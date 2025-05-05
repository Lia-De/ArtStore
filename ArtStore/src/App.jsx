import { useState } from 'react'

import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import ListInventory from './components/ListInventory.jsx'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      {/* <Route path="/" element={<h1>Welcome to the Art Store</h1>} /> */}
      <Route path="/admin" element={<ListInventory />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
