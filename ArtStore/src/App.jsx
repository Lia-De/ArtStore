
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import ListInventory from './components/ListInventory.jsx'
import UpdateOrders from './components/UpdateOrders.jsx'
import Shopfront from './components/Shopfront.jsx'
import Navbar from './components/Navbar.jsx'
import Cart from './components/Cart.jsx'
import Checkout from './components/Checkout.jsx'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<h1>Welcome to the Art Store</h1>} /> */}
      <Route element={<Navbar />} >
        <Route path="/admin" element={<ListInventory />} />
        <Route path="/admin/orders" element={<UpdateOrders />} />
        <Route path="/" element={<Shopfront />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
