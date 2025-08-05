import React, { useState, useEffect } from 'react'
import { DollarSign, TrendingUp, BarChart3, FileText } from 'lucide-react'
import { stockAPI } from '../services/api'
import BasicFinancials from './BasicFinancials'

const FinancialMetrics = ({ symbol, quote, profile }) => {
  const [financials, setFinancials] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeStatement, setActiveStatement] = useState('income')

  useEffect(() => {
    const fetchFinancials = async () => {
      setLoading(true)
      try {
        const [income, balance, cashFlow, earnings] = await Promise.allSettled([
          stockAPI.getIncomeStatement(symbol),
          stockAPI.getBalanceSheet(symbol),
          stockAPI.getCashFlow(symbol),
          stockAPI.getEarnings(symbol)
        ])

        setFinancials({
          income: income.status === 'fulfilled' ? income.value : null,
          balance: balance.status === 'fulfilled' ? balance.value : null,
          cashFlow: cashFlow.status === 'fulfilled' ? cashFlow.value : null,
          earnings: earnings.status === 'fulfilled' ? earnings.value : null
        })
      } catch (error) {
        console.error('Error fetching financials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFinancials()
  }, [symbol])

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading financial data...</span>
        </div>
      </div>
    )
  }

  if (!financials) {
    return (
      <div className="space-y-6">
        <BasicFinancials quote={quote} profile={profile} />
        <div className="card">
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">No detailed financial data available</div>
            <div className="text-sm text-gray-400 max-w-md mx-auto">
              Detailed financial statements may not be available for this stock due to:
              <ul className="mt-2 text-left space-y-1">
                <li>• Free API tier limitations</li>
                <li>• Stock not covered in financial database</li>
                <li>• Recent listing or delisting</li>
                <li>• International stock with limited coverage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatCurrency = (value) => {
    if (!value) return 'N/A'
    const num = parseFloat(value)
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const renderIncomeStatement = () => {
    if (!financials.income || !financials.income.annualReports) return null
    
    const latest = financials.income.annualReports[0]
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Revenue</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(latest.totalRevenue)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Net Income</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(latest.netIncome)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Gross Profit</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(latest.grossProfit)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Operating Income</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(latest.operatingIncome)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderBalanceSheet = () => {
    if (!financials.balance || !financials.balance.annualReports) return null
    
    const latest = financials.balance.annualReports[0]
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Assets</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(latest.totalAssets)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Liabilities</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(latest.totalLiabilities)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Equity</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(latest.totalShareholderEquity)}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Cash & Equivalents</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(latest.cashAndCashEquivalents)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderEarnings = () => {
    if (!financials.earnings || !financials.earnings.annualEarnings) return null
    
    const earnings = financials.earnings.annualEarnings.slice(0, 5)
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Annual Earnings</h3>
        <div className="space-y-3">
          {earnings.map((earning, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">{earning.fiscalDateEnding}</div>
                <div className="text-sm text-gray-600">Fiscal Year</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  ${parseFloat(earning.reportedEPS).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">EPS</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Basic Financial Information */}
      <BasicFinancials quote={quote} profile={profile} />
      
      {/* Statement Tabs */}
      <div className="card">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'income', label: 'Income Statement', icon: DollarSign },
              { id: 'balance', label: 'Balance Sheet', icon: BarChart3 },
              { id: 'earnings', label: 'Earnings', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveStatement(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeStatement === tab.id
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

        {/* Statement Content */}
        <div>
          {activeStatement === 'income' && renderIncomeStatement()}
          {activeStatement === 'balance' && renderBalanceSheet()}
          {activeStatement === 'earnings' && renderEarnings()}
        </div>
      </div>

      {/* Key Ratios */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Key Financial Ratios
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">P/E Ratio</div>
            <div className="text-lg font-semibold text-gray-900">
              {financials.earnings?.annualEarnings?.[0]?.reportedEPS ? 
                (parseFloat(financials.income?.annualReports?.[0]?.closePrice || 0) / 
                 parseFloat(financials.earnings.annualEarnings[0].reportedEPS)).toFixed(2) : 'N/A'}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Debt/Equity</div>
            <div className="text-lg font-semibold text-gray-900">
              {financials.balance?.annualReports?.[0]?.totalLiabilities && 
               financials.balance?.annualReports?.[0]?.totalShareholderEquity ?
                (parseFloat(financials.balance.annualReports[0].totalLiabilities) / 
                 parseFloat(financials.balance.annualReports[0].totalShareholderEquity)).toFixed(2) : 'N/A'}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">ROE</div>
            <div className="text-lg font-semibold text-gray-900">
              {financials.income?.annualReports?.[0]?.netIncome && 
               financials.balance?.annualReports?.[0]?.totalShareholderEquity ?
                ((parseFloat(financials.income.annualReports[0].netIncome) / 
                  parseFloat(financials.balance.annualReports[0].totalShareholderEquity)) * 100).toFixed(2) + '%' : 'N/A'}
            </div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Profit Margin</div>
            <div className="text-lg font-semibold text-gray-900">
              {financials.income?.annualReports?.[0]?.netIncome && 
               financials.income?.annualReports?.[0]?.totalRevenue ?
                ((parseFloat(financials.income.annualReports[0].netIncome) / 
                  parseFloat(financials.income.annualReports[0].totalRevenue)) * 100).toFixed(2) + '%' : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialMetrics 