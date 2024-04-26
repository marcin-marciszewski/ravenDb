import { ParkingAreasDropdownProps } from 'Interfaces';
import { FC } from 'react';

const ParkingAreasDropdown: FC<ParkingAreasDropdownProps> = ({
  parkingAreas,
  setParkingArea,
  setShowResult,
}) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setParkingArea(+event.target.value);
    setShowResult(false);
  };

  return (
    <select className="parking-area-dropdown" onChange={handleSelect}>
      {parkingAreas.map((area, index) => (
        <option value={area.id} key={index} className="menu-items">
          {area.name}
        </option>
      ))}
    </select>
  );
};

export default ParkingAreasDropdown;
