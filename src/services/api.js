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

      // Fallback: If using demo key (which typically works only for AAPL), try a public source (Stooq)
      try {
        if ((import.meta.env.VITE_TWELVEDATA_API_KEY || 'demo') === 'demo') {
          const fallbackSymbol = `${symbol}`.toLowerCase() + '.us'
          const fallbackUrl = `https://stooq.com/q/l/?s=${fallbackSymbol}&f=sd2t2ohlcv&h&e=json`
          const fallbackResp = await axios.get(fallbackUrl, { timeout: 8000 })
          const item = fallbackResp?.data?.symbols?.[0]
          if (!item || item?.close === 'N/D') {
            return null
          }

          const toNum = (v) => {
            const n = parseFloat(v)
            return isNaN(n) ? null : n
          }

          const open = toNum(item.open)
          const close = toNum(item.close)
          const change = open != null && close != null ? close - open : null
          const percentChange = change != null && open ? (change / open) * 100 : null

          const normalized = {
            symbol: symbol.toUpperCase(),
            name: item.name || symbol.toUpperCase(),
            open,
            high: toNum(item.high),
            low: toNum(item.low),
            close,
            previous_close: null,
            change,
            percent_change: percentChange,
            volume: item.volume ? parseInt(item.volume, 10) : null,
            is_market_open: null,
            timestamp: item.date && item.time ? `${item.date} ${item.time}` : null
          }

          console.log(`Quote data (fallback) for ${symbol}:`, normalized)
          return normalized
        }
      } catch (fallbackError) {
        console.error(`Fallback quote fetch failed for ${symbol}:`, fallbackError?.message || fallbackError)
      }

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

      // Fallback to Stooq CSV when using demo key
      try {
        if ((import.meta.env.VITE_TWELVEDATA_API_KEY || 'demo') === 'demo' && interval === '1day') {
          const fallbackSymbol = `${symbol}`.toLowerCase() + '.us'
          const csvUrl = `https://stooq.com/q/d/l/?s=${fallbackSymbol}&i=d`
          const csvResp = await axios.get(csvUrl, { timeout: 8000 })
          const csv = csvResp?.data
          if (!csv || typeof csv !== 'string') return null

          const lines = csv.trim().split(/\r?\n/)
          const header = lines.shift()
          if (!header || !/date,open,high,low,close,volume/i.test(header)) return null

          const values = lines
            .map((line) => line.split(','))
            .filter((cols) => cols.length >= 6 && cols[1] !== 'N/A')
            .map((cols) => ({
              datetime: cols[0],
              open: cols[1],
              high: cols[2],
              low: cols[3],
              close: cols[4],
              volume: cols[5]
            }))

          if (!values.length) return null

          const normalized = { values }
          console.log(`Time series data (fallback) for ${symbol}:`, normalized)
          return normalized
        }
      } catch (fallbackError) {
        console.error(`Fallback time series fetch failed for ${symbol}:`, fallbackError?.message || fallbackError)
      }

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