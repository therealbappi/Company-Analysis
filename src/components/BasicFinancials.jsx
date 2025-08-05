import React from 'react'
import { DollarSign, TrendingUp, BarChart3, Calculator } from 'lucide-react'

const BasicFinancials = ({ quote, profile }) => {
  if (!quote) {
    return null
  }

  const currentPrice = parseFloat(quote.close) || 0
  const volume = parseInt(quote.volume) || 0
  const change = parseFloat(quote.change) || 0
  const changePercent = parseFloat(quote.percent_change) || 0
  const marketCap = profile?.market_cap ? parseFloat(profile.market_cap) : null

  const formatCurrency = (value) => {
    if (!value || value <= 0) return 'N/A'
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return `$${value.toFixed(2)}`
  }

  const formatVolume = (value) => {
    if (!value || value <= 0) return 'N/A'
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`
    return value.toLocaleString()
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Calculator className="w-5 h-5 mr-2" />
        Basic Financial Information
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <DollarSign className="w-6 h-6 mx-auto mb-2 text-gray-600" />
          <div className="text-sm font-medium text-gray-600 mb-1">Current Price</div>
          <div className="text-lg font-semibold text-gray-900">
            {currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : 'N/A'}
          </div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <BarChart3 className="w-6 h-6 mx-auto mb-2 text-gray-600" />
          <div className="text-sm font-medium text-gray-600 mb-1">Trading Volume</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatVolume(volume)}
          </div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-gray-600" />
          <div className="text-sm font-medium text-gray-600 mb-1">Market Cap</div>
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(marketCap)}
          </div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <TrendingUp className={`w-6 h-6 mx-auto mb-2 ${change >= 0 ? 'text-success-600' : 'text-danger-600'}`} />
          <div className="text-sm font-medium text-gray-600 mb-1">Daily Change</div>
          <div className={`text-lg font-semibold ${change >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {change !== 0 ? (
              <>
                {change >= 0 ? '+' : ''}{change.toFixed(2)}
                <div className="text-sm">
                  ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                </div>
              </>
            ) : (
              'No change'
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">About Financial Data</h3>
        <p className="text-xs text-blue-700">
          Detailed financial statements (income statements, balance sheets, etc.) are only available for select stocks 
          in the free API tier. For comprehensive financial analysis, consider upgrading to a paid plan or using 
          alternative financial data providers.
        </p>
      </div>
    </div>
  )
}

export default BasicFinancials 