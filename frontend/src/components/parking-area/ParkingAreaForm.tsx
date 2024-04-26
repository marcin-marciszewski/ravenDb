import { FC } from 'react';
import axios, { AxiosResponse, AxiosInstance, AxiosError } from 'axios';
import { IParkingArea, ParkingAreaFormProps } from 'Interfaces';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const ParkingAreaForm: FC<ParkingAreaFormProps> = (props) => {
  const MySwal = withReactContent(Swal);

  const hasEmptyValue = (obj: { [key: string]: any }): boolean => {
    return Object.values(obj).some(
      (val) => val === '' || (val === null && val !== 0)
    );
  };

  const handleOnSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const formData: FormData = new FormData(event.currentTarget);
    const fromEntries = Object.fromEntries(formData.entries());
    let parkingArea: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(fromEntries)) {
      if (key !== 'name') {
        parkingArea[key] = Number(value);
      } else {
        parkingArea[key] = value;
      }
    }

    const client: AxiosInstance = axios.create({
      baseURL: 'http://localhost:8080/api',
    });

    if (hasEmptyValue(parkingArea)) {
      MySwal.fire({
        title: "We've got a problem!",
        text: 'Please fill all fields',
        icon: 'warning',
      });
      return;
    }

    try {
      let response: AxiosResponse<IParkingArea> =
        {} as AxiosResponse<IParkingArea>;

      if (parkingArea.id) {
        response = await client.patch(
          `/parking-areas/${parkingArea.id}`,
          parkingArea
        );
      } else {
        response = await client.post('/parking-areas', parkingArea);
      }

      if (response.status === 200) {
        props.showList();
      } else {
        throw new Error('Something went wrong');
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

  return (
    <>
      <h2 className="text-center mb-3">
        {props.parkingArea.id ? 'Edit Parking Area' : 'Add New Parking Area'}
      </h2>
      <div className="row">
        <div className="col-lg-6 mx-auto">
          <form onSubmit={handleOnSubmit}>
            {props.parkingArea.id && (
              <div className="row mb-3">
                <label htmlFor="name" className="col-sm-4 col-form-label">
                  ID
                </label>
                <div className="col-sm-8">
                  <input
                    readOnly
                    className="form-control-plaintext"
                    name="id"
                    defaultValue={props.parkingArea.id}
                  />
                </div>
              </div>
            )}
            <div className="row mb-3">
              <label htmlFor="name" className="col-sm-4 col-form-label">
                Name
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  defaultValue={props.parkingArea.name}
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="name" className="col-sm-4 col-form-label">
                Weekday rate
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  name="weekdayRate"
                  defaultValue={props.parkingArea.weekdayRate ?? '0.01'}
                  min="0.01"
                  max="999"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="name" className="col-sm-4 col-form-label">
                Weekend rate
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  name="weekendRate"
                  defaultValue={props.parkingArea.weekendRate ?? '0.01'}
                  min="0.01"
                  max="999"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="row mb-3">
              <label htmlFor="name" className="col-sm-4 col-form-label">
                Discount %
              </label>
              <div className="col-sm-8">
                <input
                  type="number"
                  className="form-control"
                  name="discount"
                  defaultValue={props.parkingArea.discount ?? '0'}
                  min="0"
                  max="100"
                  step="1"
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="offset-sm-4 col-sm-4 d-grid">
                <button type="submit" className="btn btn-primary btn-sm me-3">
                  Save
                </button>
              </div>
              <div className="col-sm-4 d-grid">
                <button
                  type="button"
                  onClick={() => props.showList()}
                  className="btn btn-secondary me-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ParkingAreaForm;
