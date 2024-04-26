import { FC, useEffect, useState } from 'react';
import axios, { AxiosResponse, AxiosInstance, AxiosError } from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IParkingArea } from 'Interfaces';
import ParkingAreasDropdown from 'components/payment/ParkingAreasDropdown';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CurrencyConvertButton from 'components/payment/CurrencyConvertButton';

const Payment: FC = () => {
  const currencies = ['USD', 'PLN', 'EUR'];

  const addMinutes = (date: Date, minutes: number): Date => {
    return new Date(date.getTime() + minutes * 60000);
  };

  const [parkingDate, setParkingDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(addMinutes(new Date(), 5));
  const [parkingAreasList, setParkingAreasList] = useState<IParkingArea[]>([]);
  const [parkingArea, setParkingArea] = useState<number>();
  const [currency, setCurrency] = useState<string>('USD');
  const [fee, setFee] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);

  const MySwal = withReactContent(Swal);

  const client: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
  });

  const fetchParkingAreas = async (): Promise<void> => {
    try {
      const response: AxiosResponse<IParkingArea[]> = await client.get(
        '/parking-areas'
      );
      setParkingAreasList(response.data);
      if (response.data.length > 0) {
        setParkingArea(response.data[0].id);
      }
    } catch (error) {
      const err = error as AxiosError;
      MySwal.fire({
        title: "We've got a problem!",
        text: err.message,
        icon: 'warning',
      });
      console.error(err);
    }
  };

  const calculateFee = async (): Promise<void> => {
    if (startTime > endTime) {
      MySwal.fire({
        title: "We've got a problem!",
        text: 'Start time cannot be after end time',
        icon: 'warning',
      });
      return;
    }
    if (!parkingArea) {
      MySwal.fire({
        title: "We've got a problem!",
        text: 'No parking area',
        icon: 'warning',
      });
      return;
    }

    setFee(0);
    setShowResult(false);
    setCurrency('USD');
    setParkingArea(parkingArea);

    const paymentData = {
      parkingDate,
      startTime,
      endTime,
      parkingArea,
    };

    try {
      const response: AxiosResponse<number> = await client.post(
        '/payments',
        paymentData
      );
      setFee(response.data);
      setShowResult(true);
    } catch (error) {
      const err = error as AxiosError;
      MySwal.fire({
        title: "We've got a problem!",
        text: err.message,
        icon: 'warning',
      });
      console.error(err);
    }
  };

  useEffect(() => {
    fetchParkingAreas();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <div className="row mb-3">
            <label htmlFor="name" className="col-sm-4 col-form-label">
              Parking area
            </label>
            <div className="col-sm-8">
              <ParkingAreasDropdown
                parkingAreas={parkingAreasList}
                setParkingArea={setParkingArea}
                setShowResult={setShowResult}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="name" className="col-sm-4 col-form-label">
              Start time
            </label>
            <div className="col-sm-8">
              <DatePicker
                selected={parkingDate || null}
                onChange={(date: Date) => {
                  setParkingDate(date);
                  setShowResult(false);
                }}
                dateFormat={'dd/MM/yyyy'}
                maxDate={new Date()}
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="name" className="col-sm-4 col-form-label">
              End time
            </label>
            <div className="col-sm-8">
              <DatePicker
                selected={startTime || null}
                onChange={(date: Date) => {
                  setStartTime(date);
                  setShowResult(false);
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="time"
                dateFormat="HH:mm"
                timeFormat="HH:mm"
              />
            </div>
          </div>
          <div className="row mb-3">
            <label htmlFor="name" className="col-sm-4 col-form-label">
              Parking area
            </label>
            <div className="col-sm-8">
              <DatePicker
                selected={endTime || null}
                onChange={(date: Date) => {
                  setEndTime(date);
                  setShowResult(false);
                }}
                showTimeSelect
                showTimeSelectOnly
                timeIntervals={15}
                timeCaption="time"
                dateFormat="HH:mm"
                timeFormat="HH:mm"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => calculateFee()}
            className="btn btn-secondary me-2"
          >
            Calculate Payment
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 mx-auto my-5">
          {showResult ? (
            fee > 0 ? (
              <>
                <div className="row">
                  <h2>
                    Your parking fee is {fee} {currency}
                  </h2>
                </div>
                <div className="row mt-4">
                  <div className="col-sm-3 d-grid">
                    <h4>Pay in:</h4>
                  </div>
                  {currencies.flatMap((currencyItem: string) =>
                    currencyItem !== currency ? (
                      <CurrencyConvertButton
                        key={currencyItem}
                        currency={currencyItem}
                        setCurrency={setCurrency}
                        setFee={setFee}
                      />
                    ) : (
                      []
                    )
                  )}
                </div>
              </>
            ) : (
              <h2>Your park for free</h2>
            )
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  );
};

export default Payment;
