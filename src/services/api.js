import axios from 'axios'

// You'll need to get your API key from https://twelvedata.com/
const API_KEY = import.meta.env.VITE_TWELVEDATA_API_KEY || 'demo'
const BASE_URL = 'https://api.twelvedata.com'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

// Request interceptor to add API key
api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    apikey: API_KEY,
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Check if the response has data and is not an error
    if (response.data && response.data.status === 'error') {
      throw new Error(response.data.message || 'API returned an error')
    }
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your TwelveData API key.')
    } else if (error.response?.status === 429) {
      throw new Error('API rate limit exceeded. Please try again later.')
    } else if (error.response?.status === 404) {
      throw new Error('Stock data not found. Please check the symbol.')
    } else {
      throw new Error(error.response?.data?.message || 'An error occurred while fetching data')
    }
  }
)

export const stockAPI = {
  // Get real-time quote
  getQuote: async (symbol) => {
    try {
      const response = await api.get('/quote', {
        params: { symbol: symbol.toUpperCase() }
      })
      console.log(`Quote data for ${symbol}:`, response)
      return response
    } catch (error) {
      console.error(`Failed to fetch quote for ${symbol}:`, error.message)
      return null
    }
  },

  // Get time series data for charts
  getTimeSeries: async (symbol, interval = '1day', outputsize = 30) => {
    try {
      const response = await api.get('/time_series', {
        params: {
          symbol: symbol.toUpperCase(),
          interval,
          outputsize
        }
      })
      console.log(`Time series data for ${symbol}:`, response)
      return response
    } catch (error) {
      console.error(`Failed to fetch time series for ${symbol}:`, error.message)
      return null
    }
  },

  // Get company profile
  getProfile: async (symbol) => {
    try {
      const response = await api.get('/profile', {
        params: { symbol: symbol.toUpperCase() }
      })
      console.log(`Profile data for ${symbol}:`, response)
      return response
    } catch (error) {
      console.error(`Failed to fetch profile for ${symbol}:`, error.message)
      return null
    }
  },

  // Get earnings data
  getEarnings: async (symbol) => {
    try {
      const response = await api.get('/earnings', {
        params: { symbol: symbol.toUpperCase() }
      })
      console.log(`Earnings for ${symbol}:`, response)
      return response
    } catch (error) {
      console.error(`Failed to fetch earnings for ${symbol}:`, error.message)
      return null
    }
  },

  // Get income statement
  getIncomeStatement: async (symbol) => {
    try {
      const response = await api.get('/income_statement', {
        params: { symbol: symbol.toUpperCase() }
      })
      console.log(`Income statement for ${symbol}:`, response)
      return response
    } catch (error) {
      console.error(`Failed to fetch income statement for ${symbol}:`, error.message)
      return null
    }
  },

  // Get balance sheet
  getBalanceSheet: async (symbol) => {
    try {
      const response = await api.get('/balance_sheet', {
        params: { symbol: symbol.toUpperCase() }
      })
      console.log(`Balance sheet for ${symbol}:`, response)
      return response
    } catch (error) {
      console.error(`Failed to fetch balance sheet for ${symbol}:`, error.message)
      return null
    }
  },

  // Get cash flow statement
  getCashFlow: async (symbol) => {
    try {
      const response = await api.get('/cash_flow', {
        params: { symbol: symbol.toUpperCase() }
      })
      console.log(`Cash flow for ${symbol}:`, response)
      return response
    } catch (error) {
      console.error(`Failed to fetch cash flow for ${symbol}:`, error.message)
      return null
    }
  },

  // Get news
  getNews: async (symbol) => {
    return api.get('/news', {
      params: { 
        symbol: symbol.toUpperCase(),
        limit: 10
      }
    })
  },

  // Search for symbols
  searchSymbols: async (query) => {
    return api.get('/symbol_search', {
      params: { 
        symbol: query.toUpperCase(),
        limit: 10
      }
    })
  },

  // Get market status
  getMarketStatus: async () => {
    return api.get('/market_state')
  }
}

export default api 