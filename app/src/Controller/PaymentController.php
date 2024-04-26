<?php

namespace App\Controller;

use App\Entity\ParkingArea;
use App\Service\CalculateFeeService;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route('/api', name: 'api_')]
class PaymentController extends AbstractController
{
    public function __construct(private CalculateFeeService $calculateFeeService)
    {
    }

    #[Route('/payments', name: 'payment_create', methods: ['post'])]
    public function create(ManagerRegistry $doctrine, Request $request): JsonResponse
    {
        $requestData = json_decode($request->getContent());

        $entityManager = $doctrine->getManager();
        $parkingArea = $entityManager->getRepository(ParkingArea::class)->find((int)$requestData->parkingArea);

        $parkingFee = $this->calculateFeeService->calculateFee($requestData, $parkingArea);

        return $this->json($parkingFee);
    }

    #[Route('/payments/convert', name: 'payment_convert', methods: ['post'])]
    public function convert(Request $request): JsonResponse
    {
        $convertedFee = $this->calculateFeeService->convertFee($request->getContent());

        return $this->json($convertedFee);
    }
}
