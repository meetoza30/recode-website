import React, { useState } from 'react';
import { Building, Search, Target, Sparkles, Key, ArrowRight, Award } from 'lucide-react';

const CompanySelection = ({ companies, companiesLoading, onCompanySelect, hasApiKey, skipApiKey, onRetryApiKey, userName }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
  };

  const handleContinue = () => {
    if (selectedCompany) {
      onCompanySelect(selectedCompany);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Choose Your Dream Company</h1>
                <p className="text-blue-100">Hello, {userName}! Select where you want to build your career</p>
              </div>
            </div>
          </div>

          {/* API Status */}
          <div className="flex items-center justify-center space-x-4">
            {hasApiKey ? (
              <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-300">
                <Key className="w-4 h-4 text-green-300" />
                <span className="text-green-100 font-semibold">Premium Mode Active</span>
              </div>
            ) : skipApiKey ? (
              <div className="flex items-center space-x-2 bg-yellow-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-yellow-300">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-yellow-100 font-semibold">Default Mode</span>
                <button
                  onClick={onRetryApiKey}
                  className="text-yellow-200 hover:text-white text-sm underline"
                >
                  Add API Key
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search companies... (Google, Microsoft, Amazon, etc.)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg"
            />
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {companiesLoading ? (
              // Loading Skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                  <div className="w-12 h-12 bg-gray-300 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))
            ) : filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => handleCompanySelect(company.name)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                    selectedCompany === company.name
                      ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{company.name}</h3>
                      <p className="text-gray-600 text-sm">Software Engineering</p>
                    </div>
                  </div>
                  {selectedCompany === company.name && (
                    <div className="mt-3 flex items-center space-x-1 text-blue-600">
                      <Award className="w-4 h-4" />
                      <span className="text-sm font-semibold">Selected</span>
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!selectedCompany}
              className="group px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                <span>Generate Roadmap for {selectedCompany || 'Company'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </button>
            <p className="text-gray-500 mt-3">
              {hasApiKey 
                ? '🚀 Premium roadmap generation with advanced AI'
                : '⚡ Standard roadmap generation with essential features'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySelection;