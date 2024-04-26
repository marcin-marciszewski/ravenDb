import Navbar from './pages/layout/Navbar';
import Footer from './pages/layout/Footer';
import Home from './pages/Home';
import Payment from './pages/Payment';
import ParkingAreas from './pages/ParkingAreas';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/manage" element={<ParkingAreas />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}
export default App;
