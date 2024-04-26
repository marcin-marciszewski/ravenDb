import { FC, useEffect, useState } from 'react';
import axios, { AxiosResponse, AxiosInstance, AxiosError } from 'axios';
import { IParkingArea, ParkingAreasListProps } from 'Interfaces';

const ParkingAreasList: FC<ParkingAreasListProps> = (props) => {
  const [parkingAreasList, setParkingAreasList] = useState<IParkingArea[]>([]);
  const client: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
  });

  const fetchParkingAreas = async (): Promise<void> => {
    try {
      const response: AxiosResponse<IParkingArea[]> = await client.get(
        '/parking-areas'
      );
      setParkingAreasList(response.data);
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
    }
  };

  const deleteParkingArea = async (
    deletedParkingArea: IParkingArea
  ): Promise<void> => {
    try {
      await client.delete(`/parking-areas/${deletedParkingArea.id}`);
      setParkingAreasList(
        parkingAreasList.filter((parkingArea) => {
          return parkingArea.id !== deletedParkingArea.id;
        })
      );
    } catch (error) {
      const err = error as AxiosError;
      console.error(err);
    }
  };

  useEffect(() => {
    fetchParkingAreas();
  }, []);

  return (
    <>
      <h2 className="text-center">Parking Areas List</h2>
      <button
        onClick={() => props.showForm({} as IParkingArea)}
        className="btn btn-primary m-2"
      >
        Add Parking Area
      </button>
      <button
        onClick={() => fetchParkingAreas()}
        className="btn btn-outline-primary m-2"
      >
        Refresh
      </button>
      {parkingAreasList.length !== 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Weekday Rate</th>
              <th>Weekend Rate</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parkingAreasList.map((parkingArea) => (
              <tr key={parkingArea.id}>
                <td>{parkingArea.id}</td>
                <td>{parkingArea.name}</td>
                <td>{parkingArea.weekdayRate}$</td>
                <td>{parkingArea.weekendRate}$</td>
                <td>{parkingArea.discount}%</td>
                <td style={{ width: '10px', whiteSpace: 'nowrap' }}>
                  <button
                    onClick={() => props.showForm(parkingArea)}
                    type="button"
                    className="btn btn-primary btn-sm me-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteParkingArea(parkingArea)}
                    type="button"
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h2>No parking areas.</h2>
      )}
    </>
  );
};

export default ParkingAreasList;
