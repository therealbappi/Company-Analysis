import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import StockSearch from './components/StockSearch'
import StockDashboard from './components/StockDashboard'
import { StockProvider } from './context/StockContext'

function App() {
  return (
    <StockProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<StockSearch />} />
              <Route path="/stock/:symbol" element={<StockDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </StockProvider>
  )
}

export default App 