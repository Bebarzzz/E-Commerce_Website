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
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </NotificationProvider>
    </div>
  );
}

export default App;
