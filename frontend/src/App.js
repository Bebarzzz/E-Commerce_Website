import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Checkout from './Pages/Checkout';
import AddCar from './Pages/Admin/AddCar';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import ProtectedAdminRoute from './Components/ProtectedAdminRoute';

function App() {
  
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} />
          <Route path='/new-cars' element={<ShopCategory category="new" />} />
          <Route path='/used-cars' element={<ShopCategory category="used" />} />
          <Route path='/offers' element={<ShopCategory category="offer" />} />
          <Route path='/product' element={<Product />}>
            <Route path=':productId' element={<Product />} />
          </Route>
          <Route path='/cart' element={<Cart />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/login' element={<LoginSignup />} />
          <Route path='/admin' element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } />
          <Route path='/admin/add-car' element={
            <ProtectedAdminRoute>
              <AddCar />
            </ProtectedAdminRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
