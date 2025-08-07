# Stock Analysis Web Application

A comprehensive web application for analyzing stocks with real-time data, financial metrics, and latest news using the TwelveData API.

## Features

- **Real-time Stock Data**: Live quotes, price changes, and trading volume
- **Interactive Charts**: Price history visualization with Recharts
- **Financial Analysis**: Income statements, balance sheets, and key ratios
- **Latest News**: Company-specific news and market updates
- **Search Functionality**: Search by stock symbol or company name
- **Responsive Design**: Modern UI that works on all devices
- **Search History**: Track your recent searches with enhanced company details
- **Automatic Company Profiles**: Comprehensive company information automatically fetched
- **Popular Stocks**: Quick access to major companies with detailed profiles
- **Enhanced UI**: Modern design with Tailwind CSS and Lucide icons
 - **Quant Strategies (New)**: Simple backtesting tab with SMA crossover and optimized suggestions

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **API**: TwelveData (real-time financial data)
- **Routing**: React Router DOM
- **State Management**: React Context API

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- TwelveData API key (free tier available)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-analysis-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get your API key**
   - Visit [TwelveData](https://twelvedata.com/)
   - Sign up for a free account
   - Get your API key from the dashboard

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_TWELVEDATA_API_KEY=your_api_key_here
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

1. **Search for a stock**: Enter a stock symbol (e.g., AAPL) or company name (e.g., Apple)
2. **Quick Access**: Use the popular stocks section for major companies
3. **View stock details**: Click on any stock to see comprehensive information
4. **Explore different tabs**:
   - **Overview**: Real-time price, chart, key metrics, and company profile
   - **Financials**: Income statements, balance sheets, and ratios
   - **News**: Latest company and market news
   - **Quant Strategies (New)**: Run a simple SMA crossover backtest and see top parameter suggestions
5. **Track your searches**: View your search history with enhanced company details

### Quant Strategies Tab (New)

The Quant Strategies tab adds a simple backtesting sandbox to quickly evaluate a classic moving-average crossover strategy.

- **Strategy**: Long entry when Short SMA crosses above Long SMA; exit when Short SMA crosses below Long SMA.
- **Inputs**:
  - **Symbol**: Defaults to the currently viewed stock or `AAPL`.
  - **Short SMA** and **Long SMA**: Choose lookback windows (e.g., 10 / 20).
- **Outputs**:
  - **Total Return**: Compounded return from the sequence of trades.
  - **Trades**: Number of closed trades.
  - **Win Rate**: % of profitable closed trades.
  - **Avg Win / Avg Loss**: Average gain/loss per winning/losing trade.
- **Suggestions**: The app runs a small grid search of SMA pairs and lists the top 5 by total return. Click a suggestion to apply those parameters instantly.

Notes and limitations:
- This is an educational tool, not investment advice.
- Uses end-of-day daily data; returns ignore transaction costs, slippage, and dividends.
- For sufficient accuracy, ensure there are enough history points relative to the chosen SMA windows.

## API Endpoints Used

The application uses the following TwelveData API endpoints:

- `/quote` - Real-time stock quotes
- `/time_series` - Historical price data
- `/profile` - Company information
- `/income_statement` - Financial statements
- `/balance_sheet` - Balance sheet data
- `/cash_flow` - Cash flow statements
- `/earnings` - Earnings data
- `/news` - Company news
- `/symbol_search` - Stock symbol search

### Fallback Data Sources

If the TwelveData demo key is used (which often only returns AAPL for real-time quotes), the app automatically tries public fallback sources for broader coverage:

- **Quotes (Fallback)**: Stooq JSON quote feed
  - `https://stooq.com/q/l/?s={symbol}.us&f=sd2t2ohlcv&h&e=json`
- **Time Series (Fallback)**: Stooq daily CSV
  - `https://stooq.com/q/d/l/?s={symbol}.us&i=d`

Returned data are normalized to match the app’s expected shape where possible.

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # Navigation header
│   ├── StockSearch.jsx # Main search page with enhanced features
│   ├── StockDashboard.jsx # Stock details page with tabs
│   ├── StockChart.jsx  # Interactive price chart component
│   ├── StockMetrics.jsx # Key metrics display
│   ├── FinancialMetrics.jsx # Financial statements and ratios
│   ├── NewsSection.jsx # Latest news display
│   ├── CompanyProfile.jsx # Enhanced company profile component
 │   ├── QuantStrategies.jsx # Quant Strategies tab with SMA crossover backtest and suggestions
│   └── LoadingSpinner.jsx # Loading indicator
├── context/            # React context
│   └── StockContext.jsx # Global state management
├── services/           # API services
│   └── api.js         # TwelveData API integration
├── App.jsx            # Main app component with routing
├── main.jsx           # App entry point
└── index.css          # Global styles with Tailwind CSS
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## API Rate Limits

The free tier of TwelveData API has the following limits:
- 800 requests per day
- 8 requests per minute

**Note**: The application is optimized to minimize API calls by:
- Fetching profile data only when needed
- Caching search results
- Using efficient data fetching strategies

For production use, consider upgrading to a paid plan for higher limits.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions:
1. Check the [TwelveData API documentation](https://twelvedata.com/docs)
2. Review the browser console for error messages
3. Ensure your API key is correctly configured
4. Check that all dependencies are installed (`npm install`)
5. Verify the development server is running (`npm run dev`)

## Troubleshooting

### Common Issues:
- **API Key Error**: Make sure your TwelveData API key is correctly set in the `.env` file
- **No Data Loading**: Check your internet connection and API key validity
- **Build Errors**: Ensure all dependencies are installed and Node.js version is 16+
- **Styling Issues**: Verify Tailwind CSS is properly configured

### Missing Company Data:
Some companies might not have complete data available due to:
- **Delisted Stocks**: Companies that are no longer publicly traded
- **Private Companies**: Non-publicly traded companies
- **International Stocks**: Some foreign stocks may not be available
- **New Listings**: Recently IPO'd companies might have limited data
- **API Limitations**: Free tier has access to limited datasets
- **Symbol Variations**: Different exchanges use different symbol formats

**Solutions:**
- Try searching with different symbol formats (e.g., AAPL vs AAPL.O)
- Check if the company is publicly traded on major exchanges
- Verify the stock symbol is correct
- Consider upgrading to a paid API plan for more comprehensive data
 - When using the demo key, rely on the built-in Stooq fallbacks for broader symbol coverage

## Key Features in Detail

### 🔍 **Smart Search & Discovery**
- **Real-time Search**: Instant results as you type
- **Symbol & Name Search**: Find stocks by ticker or company name
- **Popular Stocks**: Quick access to major companies (AAPL, GOOGL, MSFT, etc.)
- **Enhanced History**: Search history with company details and sector badges

### 📊 **Comprehensive Stock Analysis**
- **Live Data**: Real-time quotes, price changes, and volume
- **Interactive Charts**: 30-day price history with hover details
- **Key Metrics**: Open, high, low, volume, and change information
- **Company Profile**: Automatic fetching of detailed company information

### 💰 **Financial Analysis**
- **Income Statements**: Revenue, net income, gross profit, operating income
- **Balance Sheets**: Assets, liabilities, equity, cash position
- **Earnings Data**: Historical EPS and earnings performance
- **Key Ratios**: P/E, Debt/Equity, ROE, Profit Margin calculations

### 📰 **Latest News & Updates**
- **Company News**: Latest news specific to selected stocks
- **Market Updates**: General market news and analysis
- **External Links**: Direct links to full articles
- **Timestamps**: Publication dates and times

### 🎨 **Modern User Interface**
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Clean Layout**: Organized tabs and sections for easy navigation
- **Visual Feedback**: Hover effects, loading states, and smooth transitions
- **Professional Styling**: Modern design with Tailwind CSS

## Future Enhancements

- [ ] Add watchlist functionality
- [ ] Implement price alerts
- [ ] Add comparison charts
- [ ] Include technical indicators
- [ ] Add portfolio tracking
- [ ] Implement dark mode
- [ ] Add export functionality for reports
- [ ] Real-time price updates
- [ ] Social sentiment analysis
- [ ] Earnings calendar integration 
 - [ ] Additional strategies (RSI, MACD, Bollinger Bands) and walk-forward analysis