import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react'
import { useStock } from '../context/StockContext'
import { stockAPI } from '../services/api'
import StockChart from './StockChart'
import StockMetrics from './StockMetrics'
import FinancialMetrics from './FinancialMetrics'
import NewsSection from './NewsSection'
import CompanyProfile from './CompanyProfile'
import LoadingSpinner from './LoadingSpinner'
import DataStatus from './DataStatus'

const StockDashboard = () => {
  const { symbol } = useParams()
  const { state, dispatch } = useStock()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchStockData = async () => {
      if (!symbol) return

      // Normalize symbol from the route, in case it came with exchange suffixes somewhere else
      const normalizedSymbol = String(symbol).split(':')[0].toUpperCase()

      dispatch({ type: 'SET_LOADING', payload: true })
      dispatch({ type: 'CLEAR_ERROR' })

      try {
        // Fetch all data in parallel with better error handling
        const [quote, profile, timeSeries, news] = await Promise.allSettled([
          stockAPI.getQuote(normalizedSymbol),
          stockAPI.getProfile(normalizedSymbol),
          stockAPI.getTimeSeries(normalizedSymbol),
          stockAPI.getNews(normalizedSymbol)
        ])

        console.log(`Data fetch results for ${symbol}:`, {
          quote: quote.status,
          profile: profile.status,
          timeSeries: timeSeries.status,
          news: news.status
        })

        const stockData = {
          quote: quote.status === 'fulfilled' ? quote.value : null,
          profile: profile.status === 'fulfilled' ? profile.value : null,
          timeSeries: timeSeries.status === 'fulfilled' ? timeSeries.value : null,
          news: news.status === 'fulfilled' ? news.value : null
        }

        // Log which data is missing
        if (!stockData.quote) console.warn(`No quote data for ${symbol}`)
        if (!stockData.profile) console.warn(`No profile data for ${symbol}`)
        if (!stockData.timeSeries) console.warn(`No time series data for ${symbol}`)
        if (!stockData.news) console.warn(`No news data for ${symbol}`)

        dispatch({ type: 'SET_STOCK_DATA', payload: stockData })
        dispatch({ type: 'SET_CURRENT_STOCK', payload: { symbol: normalizedSymbol, ...stockData } })

        // Add to search history with enhanced profile data
        if (stockData.profile) {
          dispatch({
            type: 'ADD_TO_HISTORY',
            payload: {
               symbol: normalizedSymbol,
              name: stockData.profile.name,
              description: stockData.profile.description,
              sector: stockData.profile.sector,
              industry: stockData.profile.industry,
              marketCap: stockData.profile.market_cap,
              timestamp: new Date().toISOString()
            }
          })
        }

      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error.message })
      }
    }

    fetchStockData()
  }, [symbol, dispatch])

  if (state.loading) {
    return <LoadingSpinner />
  }

  if (state.error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">Error: {state.error}</div>
        <Link to="/" className="btn-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Link>
      </div>
    )
  }

  if (!state.stockData) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-xl mb-4">No data available</div>
        <Link to="/" className="btn-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Link>
      </div>
    )
  }

  const { quote, profile, timeSeries, news } = state.stockData
  
  // Helper function to safely parse numbers
  const safeParseFloat = (value, defaultValue = 0) => {
    if (!value || value === 'null' || value === 'undefined') return defaultValue
    const parsed = parseFloat(value)
    return isNaN(parsed) ? defaultValue : parsed
  }

  const priceChange = quote ? safeParseFloat(quote.change) : 0
  const priceChangePercent = quote ? safeParseFloat(quote.percent_change) : 0
  const currentPrice = quote ? safeParseFloat(quote.close) : 0

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Search
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
             <h1 className="text-3xl font-bold text-gray-900">{String(symbol).split(':')[0].toUpperCase()}</h1>
            {profile && (
              <p className="text-gray-600 mt-1">{profile.name}</p>
            )}
          </div>
          
          {quote && (
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : 'N/A'}
              </div>
              <div className={`flex items-center text-sm ${priceChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {priceChange !== 0 ? (
                  <>
                    {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} 
                    {priceChangePercent !== 0 && ` (${priceChangePercent >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%)`}
                  </>
                ) : (
                  'No change'
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'financials', label: 'Financials', icon: DollarSign },
            { id: 'news', label: 'News', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Data Status - Show when some data is missing */}
        <DataStatus quote={quote} profile={profile} timeSeries={timeSeries} news={news} symbol={symbol} />
        
        {activeTab === 'overview' && (
          <>
            {/* Stock Chart */}
            {timeSeries && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Chart</h2>
                <StockChart data={timeSeries} />
              </div>
            )}

            {/* Key Metrics */}
            {quote && (
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Metrics</h2>
                <StockMetrics quote={quote} />
              </div>
            )}

            {/* Company Profile */}
            <CompanyProfile profile={profile} />
          </>
        )}

        {activeTab === 'financials' && (
          <FinancialMetrics symbol={symbol} quote={quote} profile={profile} />
        )}

        {activeTab === 'news' && (
          <NewsSection news={news} symbol={symbol} />
        )}


      </div>
    </div>
  )
}

export default StockDashboard 