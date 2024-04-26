export interface IParkingArea {
  id: number;
  name: string;
  weekdayRate: string;
  weekendRate: string;
  discount: number;
}

export interface ParkingAreaFormProps {
  showList: () => void;
  parkingArea: IParkingArea;
}

export interface ParkingAreasListProps {
  showForm: (parkingArea: IParkingArea) => void;
}

export interface CurrencyConvertProps {
  currency: string;
  setCurrency: (currency: string) => void;
  setFee: (fee: number) => void;
}

export interface ParkingAreasDropdownProps {
  parkingAreas: IParkingArea[];
  setParkingArea: (parkingArea: number) => void;
  setShowResult(boolean: boolean): void;
}
