import React, { useEffect, useMemo, useState } from 'react'
import { useStock } from '../context/StockContext'
import { stockAPI } from '../services/api'
import { TrendingUp, TrendingDown, Play, RefreshCw } from 'lucide-react'

const computeSMA = (data, period) => {
  const result = new Array(data.length).fill(null)
  let sum = 0
  for (let i = 0; i < data.length; i++) {
    sum += data[i]
    if (i >= period) sum -= data[i - period]
    if (i >= period - 1) result[i] = sum / period
  }
  return result
}

const backtestSmaCrossover = (closes, shortP = 10, longP = 20) => {
  if (!closes || closes.length === 0) return { trades: [], closedTrades: [], equityCurve: [], stats: null }
  const short = computeSMA(closes, shortP)
  const long = computeSMA(closes, longP)
  const trades = []
  const closedTrades = []
  const equityCurve = []
  let position = 0 // 0 none, 1 long
  let entryPrice = 0
  let entryIndex = -1
  let equity = 1.0

  for (let i = 0; i < closes.length; i++) {
    equityCurve.push(equity)
    const s = short[i]
    const l = long[i]
    if (s == null || l == null) continue
    if (position === 0 && s > l) {
      position = 1
      entryPrice = closes[i]
      entryIndex = i
      trades.push({ type: 'BUY', index: i, price: closes[i] })
    } else if (position === 1 && s < l) {
      position = 0
      const exitPrice = closes[i]
      const ret = (exitPrice - entryPrice) / entryPrice
      equity *= 1 + ret
      trades.push({ type: 'SELL', index: i, price: exitPrice, return: ret })
      closedTrades.push({ entryIndex, entryPrice, exitIndex: i, exitPrice, return: ret })
    }
  }

  // Close any open position at last price
  if (position === 1) {
    const exitPrice = closes[closes.length - 1]
    const ret = (exitPrice - entryPrice) / entryPrice
    equity *= 1 + ret
    trades.push({ type: 'SELL', index: closes.length - 1, price: exitPrice, return: ret })
    closedTrades.push({ entryIndex, entryPrice, exitIndex: closes.length - 1, exitPrice, return: ret })
  }

  const totalReturn = equity - 1
  const winTrades = trades.filter(t => t.type === 'SELL' && t.return > 0)
  const lossTrades = trades.filter(t => t.type === 'SELL' && t.return <= 0)
  const stats = {
    totalReturn,
    numTrades: trades.filter(t => t.type === 'SELL').length,
    winRate: (winTrades.length / Math.max(1, winTrades.length + lossTrades.length)) * 100,
    avgWin: winTrades.length ? (winTrades.reduce((s, t) => s + t.return, 0) / winTrades.length) * 100 : 0,
    avgLoss: lossTrades.length ? (lossTrades.reduce((s, t) => s + t.return, 0) / lossTrades.length) * 100 : 0
  }

  return { trades, closedTrades, equityCurve, stats }
}

const QuantStrategies = () => {
  const { state } = useStock()
  const [symbol, setSymbol] = useState('AAPL')
  const [loading, setLoading] = useState(false)
  const [series, setSeries] = useState(null)
  const [shortPeriod, setShortPeriod] = useState(10)
  const [longPeriod, setLongPeriod] = useState(20)

  useEffect(() => {
    if (state?.currentStock?.symbol) {
      setSymbol(state.currentStock.symbol)
    }
  }, [state?.currentStock?.symbol])

  const fetchSeries = async (s) => {
    setLoading(true)
    try {
      const data = await stockAPI.getTimeSeries(s, '1day', 200)
      setSeries(data)
    } catch (e) {
      setSeries(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSeries(symbol)
  }, [])

  const { closes, dates } = useMemo(() => {
    if (!series?.values) return { closes: [], dates: [] }
    const ordered = [...series.values].reverse()
    const points = ordered
      .map(v => ({ date: v.datetime, close: parseFloat(v.close) }))
      .filter(p => !isNaN(p.close))
    return { closes: points.map(p => p.close), dates: points.map(p => p.date) }
  }, [series])

  const results = useMemo(() => backtestSmaCrossover(closes, Number(shortPeriod), Number(longPeriod)), [closes, shortPeriod, longPeriod])

  const suggestions = useMemo(() => {
    if (!closes || closes.length < 30) return []
    const shortCandidates = [5, 8, 10, 12, 15, 20]
    const longCandidates = [20, 30, 40, 50, 100, 200]
    const combos = []
    for (const s of shortCandidates) {
      for (const l of longCandidates) {
        if (l <= s) continue
        if (l > closes.length - 5) continue
        const r = backtestSmaCrossover(closes, s, l)
        const totalReturn = r?.stats?.totalReturn
        if (typeof totalReturn === 'number' && isFinite(totalReturn)) {
          combos.push({ short: s, long: l, totalReturn })
        }
      }
    }
    combos.sort((a, b) => b.totalReturn - a.totalReturn)
    return combos.slice(0, 5)
  }, [closes])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-gray-900">Quant Strategies (SMA Crossover)</h2>
        <button onClick={() => fetchSeries(symbol)} className="btn-secondary inline-flex items-center">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </button>
      </div>
      <div className="text-xs text-gray-500 mb-4">
        Backtest uses daily end-of-day data (~200 most recent trading days). SMA windows are in trading days.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Symbol</label>
          <input value={symbol} onChange={(e) => setSymbol(e.target.value.toUpperCase())} className="input-field" placeholder="AAPL" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Short SMA</label>
          <input type="number" min="2" value={shortPeriod} onChange={(e) => setShortPeriod(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Long SMA</label>
          <input type="number" min="3" value={longPeriod} onChange={(e) => setLongPeriod(e.target.value)} className="input-field" />
        </div>
      </div>

      <div className="mb-4">
        <button onClick={() => fetchSeries(symbol)} className="btn-primary inline-flex items-center">
          <Play className="w-4 h-4 mr-2" /> Run Backtest
        </button>
      </div>

      {loading && <div className="text-gray-500">Loading data...</div>}

      {!loading && results?.stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600">Total Return</div>
            <div className={`text-xl font-semibold ${results.stats.totalReturn >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {(results.stats.totalReturn * 100).toFixed(2)}%
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600">Trades</div>
            <div className="text-xl font-semibold">{results.stats.numTrades}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600">Win Rate</div>
            <div className="text-xl font-semibold">{results.stats.winRate.toFixed(1)}%</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600">Avg Win / Avg Loss</div>
            <div className="text-xl font-semibold">
              {results.stats.avgWin.toFixed(2)}% / {results.stats.avgLoss.toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      {!loading && suggestions.length > 0 && (
        <div className="mt-2">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Suggestions to improve total return</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={`${s.short}-${s.long}-${idx}`}
                onClick={() => { setShortPeriod(s.short); setLongPeriod(s.long) }}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                title="Apply these SMA settings"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900">SMA {s.short} / {s.long}</div>
                  <div className="text-xs text-gray-500">Click to apply</div>
                </div>
                <div className={`text-sm font-semibold ${s.totalReturn >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {(s.totalReturn * 100).toFixed(2)}%
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && (!series || !series.values) && (
        <div className="text-gray-500">No time series data available. Try another symbol.</div>
      )}

      {!loading && results?.closedTrades?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-800 mb-2">Profitable trades (BUY ➜ SELL)</h3>
          <div className="space-y-2">
            {results.closedTrades.filter(t => t.return > 0).map((t, idx) => (
              <div key={`${t.entryIndex}-${t.exitIndex}-${idx}`} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="text-sm text-gray-700">
                    Buy {dates[t.entryIndex]} @ ${t.entryPrice.toFixed(2)} ➜ Sell {dates[t.exitIndex]} @ ${t.exitPrice.toFixed(2)}
                  </div>
                </div>
                <div className="text-sm font-semibold text-success-600">{(t.return * 100).toFixed(2)}%</div>
              </div>
            ))}
            {results.closedTrades.filter(t => t.return > 0).length === 0 && (
              <div className="text-xs text-gray-500">No profitable trades for the selected parameters.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuantStrategies


