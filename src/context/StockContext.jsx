import React, { createContext, useContext, useReducer } from 'react'

const StockContext = createContext()

const initialState = {
  currentStock: null,
  stockData: null,
  financials: null,
  news: [],
  loading: false,
  error: null,
  searchHistory: []
}

const stockReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_CURRENT_STOCK':
      return { ...state, currentStock: action.payload }
    case 'SET_STOCK_DATA':
      return { ...state, stockData: action.payload, loading: false, error: null }
    case 'SET_FINANCIALS':
      return { ...state, financials: action.payload }
    case 'SET_NEWS':
      return { ...state, news: action.payload }
    case 'ADD_TO_HISTORY':
      const newHistory = [action.payload, ...state.searchHistory.filter(item => item.symbol !== action.payload.symbol)].slice(0, 10)
      return { ...state, searchHistory: newHistory }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export const StockProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stockReducer, initialState)

  return (
    <StockContext.Provider value={{ state, dispatch }}>
      {children}
    </StockContext.Provider>
  )
}

export const useStock = () => {
  const context = useContext(StockContext)
  if (!context) {
    throw new Error('useStock must be used within a StockProvider')
  }
  return context
} 