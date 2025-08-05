import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

const StockChart = ({ data }) => {
  if (!data || !data.values) {
    return (
      <div className="text-center py-8 text-gray-500">
        No chart data available
      </div>
    )
  }

  // Transform data for the chart
  const chartData = data.values
    .slice(-30) // Last 30 days
    .map(item => ({
      date: format(new Date(item.datetime), 'MMM dd'),
      price: parseFloat(item.close),
      volume: parseInt(item.volume)
    }))
    .reverse()

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-primary-600 font-semibold">
            ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-gray-500 text-sm">
            Volume: {payload[0].payload.volume.toLocaleString()}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#3b82f6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default StockChart 