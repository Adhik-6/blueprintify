import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.pages.jsx'
import Walkthrough from './pages/Walkthrough.pages.jsx'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/walkthrough/:id" element={<Walkthrough />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
