<?php

namespace App\Service;

use DateTime;
use stdClass;
use App\Entity\ParkingArea;
use Psr\Cache\CacheItemPoolInterface;
use App\Enum\CurrencyEnum;

class CalculateFeeService
{
    public function __construct(private CacheItemPoolInterface $cache, private string $apiKey)
    {
    }

    public function calculateFee(stdClass $parkingData, ParkingArea $parkingArea): float
    {
        $isWeekend = $this->isWeekend($parkingData->parkingDate);
        $startTime = strtotime($parkingData->startTime);
        $endTime =  strtotime($parkingData->endTime);
        $parkingMinutes = round(abs($endTime - $startTime) / 60, 2);

        $totalFee = $isWeekend ?
        ($parkingArea->getWeekendRate() / 60) * $parkingMinutes :
        ($parkingArea->getWeekdayRate() / 60) * $parkingMinutes;

        $finalFee = round(
            $parkingArea->getDiscount()
            ? $totalFee * ((100 - $parkingArea->getDiscount()) / 100)
            : $totalFee,
            2
        );

        $this->cache->deleteItems(['parking_fee', 'parking_date']);
        $parkingFeeCached = $this->cache->getItem('parking_fee');
        $parkingDateCached = $this->cache->getItem('parking_date');
        $parkingFeeCached->set((string)$finalFee);
        $parkingDateCached->set((string)$parkingData->parkingDate);
        $this->cache->save($parkingFeeCached);
        $this->cache->save($parkingDateCached);

        return  $finalFee;
    }

    public function convertFee(string $currency): float
    {
        $parkingFeeCached = $this->cache->getItem('parking_fee');
        $parkingDateCached = $this->cache->getItem('parking_date');

        $parkingFee = $parkingFeeCached->get();
        $parkingDate = new DateTime($parkingDateCached->get());

        $endpoint =  $parkingDate->format('Y-m-d');
        $access_key = $this->apiKey;
        $symbols = sprintf('%s,%s,%s', CurrencyEnum::USD->value, CurrencyEnum::PLN->value, CurrencyEnum::EUR->value);

        $ch = curl_init('http://api.exchangeratesapi.io/v1/'.$endpoint.'?access_key='.$access_key.'&symbols='. $symbols .'');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $json = curl_exec($ch);
        curl_close($ch);

        $exchangeRates = json_decode($json, true);
        $parkingFeeEUR = $parkingFee * $exchangeRates['rates'][CurrencyEnum::USD->value];
        $parkingFeePLN = $parkingFeeEUR * $exchangeRates['rates'][CurrencyEnum::PLN->value];

        $finalConvertedFee = 0;

        switch ($currency) {
            case CurrencyEnum::EUR->value:
                $finalConvertedFee = $parkingFeeEUR;
                break;
            case CurrencyEnum::PLN->value:
                $finalConvertedFee =  $parkingFeePLN;
                break;
            default:
                $finalConvertedFee =  $parkingFee;
        }

        return round($finalConvertedFee, 2);
    }

    private function isWeekend($date): bool
    {
        return (date('N', strtotime($date)) >= 6);
    }
}
