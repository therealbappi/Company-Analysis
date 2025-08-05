import React from 'react'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'

const DataStatus = ({ quote, profile, timeSeries, news, symbol }) => {
  const dataItems = [
    { key: 'quote', label: 'Real-time Quote', data: quote, required: true },
    { key: 'profile', label: 'Company Profile', data: profile, required: false },
    { key: 'timeSeries', label: 'Price History', data: timeSeries, required: false },
    { key: 'news', label: 'Latest News', data: news, required: false }
  ]

  const missingData = dataItems.filter(item => !item.data)
  const hasRequiredData = dataItems.filter(item => item.required).every(item => item.data)

  if (hasRequiredData && missingData.length === 0) {
    return null // Don't show anything if all data is available
  }

  return (
    <div className="card">
      <div className="flex items-center mb-4">
        <Info className="w-5 h-5 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Data Availability</h3>
      </div>
      
      <div className="space-y-3">
        {dataItems.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{item.label}</span>
            <div className="flex items-center">
              {item.data ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {missingData.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Why some data might be missing:</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Stock symbol might not be available in the database</li>
            <li>• Company might be delisted or not publicly traded</li>
            <li>• API rate limits might be exceeded</li>
            <li>• Network connectivity issues</li>
            <li>• Data might be temporarily unavailable</li>
          </ul>
        </div>
      )}

      {!hasRequiredData && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 mb-2">Unable to display stock information</h4>
          <p className="text-xs text-red-700">
            The required quote data is not available for {symbol}. Please check the symbol or try again later.
          </p>
        </div>
      )}
    </div>
  )
}

export default DataStatus 