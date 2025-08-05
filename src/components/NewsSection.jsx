import React from 'react'
import { ExternalLink, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'

const NewsSection = ({ news, symbol }) => {
  if (!news || !news.data || news.data.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8 text-gray-500">
          No news available for {symbol}
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy')
    } catch {
      return 'Unknown date'
    }
  }

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'HH:mm')
    } catch {
      return 'Unknown time'
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Latest News for {symbol}
        </h2>
        
        <div className="space-y-4">
          {news.data.slice(0, 10).map((article, index) => (
            <article key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                    <a 
                      href={article.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-start"
                    >
                      {article.title}
                      <ExternalLink className="w-4 h-4 ml-2 mt-1 text-gray-400 flex-shrink-0" />
                    </a>
                  </h3>
                  
                  {article.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.description}
                    </p>
                  )}
                  
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(article.published_at)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(article.published_at)}
                    </div>
                    {article.source && (
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {article.source}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            News data provided by TwelveData API
          </p>
        </div>
      </div>
    </div>
  )
}

export default NewsSection 