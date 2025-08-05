import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, BarChart3 } from 'lucide-react'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
            <TrendingUp className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Stock Analysis</h1>
              <p className="text-sm text-gray-500">Real-time Market Data</p>
            </div>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Live Data</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header 