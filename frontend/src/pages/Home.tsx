import { FC } from 'react';
import { Link } from 'react-router-dom';

const Home: FC = () => {
  return (
    <>
      <div className="home d-flex align-items-center justify-content-center">
        <div>
          <Link className="btn btn-primary mx-2" to="/payment">
            Payment
          </Link>

          <Link className="btn btn-secondary" to="/manage">
            Parking Management
          </Link>
        </div>
      </div>
    </>
  );
};
export default Home;
