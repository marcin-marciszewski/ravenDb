import { FC } from 'react';
import axios, { AxiosResponse, AxiosInstance, AxiosError } from 'axios';
import { CurrencyConvertProps } from 'Interfaces';

const CurrencyConvertButton: FC<CurrencyConvertProps> = ({
  currency,
  setCurrency,
  setFee,
}) => {
  const client: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
  });

  const convertCurrency = async (): Promise<void> => {
    try {
      const response: AxiosResponse<string> = await client.post(
        '/payments/convert',
        currency
      );
      setFee(+response.data);
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrency(currency);
    convertCurrency();
  };

  return (
    <div className="col-sm-4 d-grid">
      <button
        onClick={handleClick}
        type="button"
        className="btn btn-primary btn-sm me-3"
        value={currency}
      >
        {currency}
      </button>
    </div>
  );
};

export default CurrencyConvertButton;
