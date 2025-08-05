import React from 'react'
import { Building2, Globe, Users, DollarSign, MapPin, Calendar, ExternalLink } from 'lucide-react'

const CompanyProfile = ({ profile }) => {
  if (!profile) {
    return (
      <div className="card">
        <div className="text-center py-8 text-gray-500">
          No company profile available
        </div>
      </div>
    )
  }

  const formatMarketCap = (marketCap) => {
    if (!marketCap) return 'N/A'
    const num = parseFloat(marketCap)
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toFixed(2)}`
  }

  const formatCurrency = (value) => {
    if (!value) return 'N/A'
    const num = parseFloat(value)
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    return `$${num.toFixed(2)}`
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Building2 className="w-5 h-5 mr-2" />
        Company Profile
      </h2>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Company Description */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-3">About {profile.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {profile.description || 'No description available.'}
          </p>
          
          {profile.website && (
            <a 
              href={profile.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Visit Company Website
            </a>
          )}
        </div>

        {/* Company Details */}
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Company Information</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Globe className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Sector</div>
                  <div className="text-sm text-gray-600">{profile.sector || 'N/A'}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Industry</div>
                  <div className="text-sm text-gray-600">{profile.industry || 'N/A'}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 text-gray-400 mr-3" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Market Cap</div>
                  <div className="text-sm text-gray-600">{formatMarketCap(profile.market_cap)}</div>
                </div>
              </div>
              
              {profile.exchange && (
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Exchange</div>
                    <div className="text-sm text-gray-600">{profile.exchange}</div>
                  </div>
                </div>
              )}
              
              {profile.currency && (
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">Currency</div>
                    <div className="text-sm text-gray-600">{profile.currency}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Financial Highlights */}
          {(profile.revenue || profile.profit_margin || profile.return_on_equity) && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Financial Highlights</h4>
              <div className="space-y-3">
                {profile.revenue && (
                  <div>
                    <div className="text-sm font-medium text-gray-900">Revenue</div>
                    <div className="text-sm text-gray-600">{formatCurrency(profile.revenue)}</div>
                  </div>
                )}
                
                {profile.profit_margin && (
                  <div>
                    <div className="text-sm font-medium text-gray-900">Profit Margin</div>
                    <div className="text-sm text-gray-600">{parseFloat(profile.profit_margin).toFixed(2)}%</div>
                  </div>
                )}
                
                {profile.return_on_equity && (
                  <div>
                    <div className="text-sm font-medium text-gray-900">ROE</div>
                    <div className="text-sm text-gray-600">{parseFloat(profile.return_on_equity).toFixed(2)}%</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyProfile 