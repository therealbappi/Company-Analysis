import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { useStock } from '../context/StockContext'
import { stockAPI } from '../services/api'

const StockSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const navigate = useNavigate()
  const { state, dispatch } = useStock()

  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'NFLX', name: 'Netflix Inc.' }
  ]

  const handleSearch = async (query) => {
    if (!query.trim()) return
    
    setIsSearching(true)
    try {
      const results = await stockAPI.searchSymbols(query)
      setSearchResults(results.data || [])
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleStockSelect = async (stock) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })
    
    try {
      // Fetch company profile for more details
      let profileData = null
      try {
        profileData = await stockAPI.getProfile(stock.symbol)
      } catch (profileError) {
        console.log('Could not fetch profile for', stock.symbol)
      }
      
      // Add to search history with enhanced details
      dispatch({ 
        type: 'ADD_TO_HISTORY', 
        payload: { 
          symbol: stock.symbol, 
          name: profileData?.name || stock.name || stock.description,
          description: profileData?.description || stock.description,
          sector: profileData?.sector,
          industry: profileData?.industry,
          marketCap: profileData?.market_cap,
          timestamp: new Date().toISOString()
        } 
      })
      
      // Navigate to stock dashboard
      navigate(`/stock/${stock.symbol}`)
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message })
    }
  }

  const handleQuickSearch = async (symbol) => {
    const stock = popularStocks.find(s => s.symbol === symbol)
    if (stock) {
      // Fetch profile data for popular stocks
      let profileData = null
      try {
        profileData = await stockAPI.getProfile(symbol)
      } catch (profileError) {
        console.log('Could not fetch profile for', symbol)
      }
      
      handleStockSelect({ 
        symbol, 
        name: profileData?.name || stock.name,
        description: profileData?.description,
        sector: profileData?.sector,
        industry: profileData?.industry,
        marketCap: profileData?.market_cap
      })
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm)
      } else {
        setSearchResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Analyze Any Stock
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Get real-time data, financial metrics, and latest news for any publicly traded company
        </p>
      </div>

      {/* Search Section */}
      <div className="card mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by stock symbol or company name (e.g., AAPL, Apple)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-12 text-lg"
          />
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleStockSelect(result)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">{result.symbol}</div>
                    <div className="text-sm text-gray-500">{result.description}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        )}

        {isSearching && (
          <div className="mt-4 text-center text-gray-500">
            Searching...
          </div>
        )}
      </div>

      {/* Popular Stocks */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Popular Stocks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularStocks.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleQuickSearch(stock.symbol)}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-gray-900">{stock.symbol}</div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
              </div>
              <div className="text-sm text-gray-600 mb-1">{stock.name}</div>
              <div className="text-xs text-gray-500">Click to analyze</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      {state.searchHistory.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Searches
          </h2>
          <div className="space-y-3">
            {state.searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => handleStockSelect(item)}
                className="w-full text-left p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 hover:border-primary-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="font-semibold text-gray-900">{item.symbol}</div>
                      {item.sector && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {item.sector}
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-1">{item.name}</div>
                    {item.industry && (
                      <div className="text-xs text-gray-500 mb-2">{item.industry}</div>
                    )}
                    {item.marketCap && (
                      <div className="text-xs text-gray-600">
                        Market Cap: ${(parseFloat(item.marketCap) / 1e9).toFixed(2)}B
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default StockSearch 