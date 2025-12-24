import './App.css';
import Chatbot from './Components/Chatbot';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './Context/NotificationContext';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Checkout from './Pages/Checkout';
import OrderConfirmed from './Pages/OrderConfirmed';
import Contact from './Pages/Contact';
import AdminLayout from './Components/Admin/Layout/AdminLayout';
import AdminRoute from './Components/Admin/Auth/AdminRoute';
import AdminDashboard from './Components/Admin/Pages/AdminDashboard';
import AdminCarsList from './Components/Admin/Pages/AdminCarsList';
import AdminCarCreate from './Components/Admin/Pages/AdminCarCreate';
import AdminCarEdit from './Components/Admin/Pages/AdminCarEdit';
import AdminOrdersList from './Components/Admin/Pages/AdminOrdersList';
import AdminOrderView from './Components/Admin/Pages/AdminOrderView';
function App() {

  return (
    <div>
      <NotificationProvider>
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
            <Route path='/order-confirmed' element={<OrderConfirmed />} />
            <Route path='/login' element={<LoginSignup />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/admin' element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path='cars' element={<AdminCarsList />} />
              <Route path='cars/new' element={<AdminCarCreate />} />
              <Route path='cars/:id/edit' element={<AdminCarEdit />} />
              <Route path='orders' element={<AdminOrdersList />} />
              <Route path='orders/:id' element={<AdminOrderView />} />
            </Route>
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </NotificationProvider>
    </div>
  );
}

export default App;
