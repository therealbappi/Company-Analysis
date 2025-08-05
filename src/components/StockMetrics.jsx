import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Users, Globe } from 'lucide-react'

const StockMetrics = ({ quote }) => {
  // Helper function to safely parse and format numbers
  const safeParseFloat = (value, defaultValue = 0) => {
    if (!value || value === 'null' || value === 'undefined') return defaultValue
    const parsed = parseFloat(value)
    return isNaN(parsed) ? defaultValue : parsed
  }

  const safeParseInt = (value, defaultValue = 0) => {
    if (!value || value === 'null' || value === 'undefined') return defaultValue
    const parsed = parseInt(value)
    return isNaN(parsed) ? defaultValue : parsed
  }

  const formatCurrency = (value) => {
    const num = safeParseFloat(value)
    return num > 0 ? `$${num.toFixed(2)}` : 'N/A'
  }

  const formatVolume = (value) => {
    const num = safeParseInt(value)
    return num > 0 ? num.toLocaleString() : 'N/A'
  }

  const formatChange = (value) => {
    const num = safeParseFloat(value)
    if (num === 0) return 'N/A'
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}`
  }

  const metrics = [
    {
      label: 'Open',
      value: formatCurrency(quote?.open),
      icon: DollarSign,
      color: 'text-gray-600'
    },
    {
      label: 'High',
      value: formatCurrency(quote?.high),
      icon: TrendingUp,
      color: 'text-success-600'
    },
    {
      label: 'Low',
      value: formatCurrency(quote?.low),
      icon: TrendingDown,
      color: 'text-danger-600'
    },
    {
      label: 'Volume',
      value: formatVolume(quote?.volume),
      icon: BarChart3,
      color: 'text-gray-600'
    },
    {
      label: 'Previous Close',
      value: formatCurrency(quote?.previous_close),
      icon: DollarSign,
      color: 'text-gray-600'
    },
    {
      label: 'Change',
      value: formatChange(quote?.change),
      icon: safeParseFloat(quote?.change) >= 0 ? TrendingUp : TrendingDown,
      color: safeParseFloat(quote?.change) >= 0 ? 'text-success-600' : 'text-danger-600'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
          <metric.icon className={`w-6 h-6 mx-auto mb-2 ${metric.color}`} />
          <div className="text-sm font-medium text-gray-600 mb-1">
            {metric.label}
          </div>
          <div className={`text-lg font-semibold ${metric.color}`}>
            {metric.value}
          </div>
        </div>
      ))}
    </div>
  )
}

export default StockMetrics 