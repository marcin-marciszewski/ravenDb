import { FC, useState } from 'react';
import ParkingAreasList from '../components/parking-area/ParkingAreasList';
import ParkingAreaForm from '../components/parking-area/ParkingAreaForm';
import { IParkingArea } from 'Interfaces';

const ParkingAreas: FC = () => {
  const [content, setContent] = useState<JSX.Element>(
    <ParkingAreasList showForm={showForm} />
  );

  function showList() {
    setContent(<ParkingAreasList showForm={showForm} />);
  }

  function showForm(parkingArea: IParkingArea) {
    setContent(
      <ParkingAreaForm parkingArea={parkingArea} showList={showList} />
    );
  }

  return <div className="container my-5">{content}</div>;
};

export default ParkingAreas;
