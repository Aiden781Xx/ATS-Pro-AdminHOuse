import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { useApplicants } from '../../context/ApplicantContext';

export const FilterPanel: React.FC = () => {
  const { applicants, getFilteredApplicants } = useApplicants();
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    position: '',
  });

  const filteredApplicants = getFilteredApplicants(filters);

  const uniqueStatuses = [...new Set(applicants.map(a => a.status))];
  const uniqueSources = [...new Set(applicants.map(a => a.source))];
  const uniquePositions = [...new Set(applicants.map(a => a.position))];

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      source: '',
      position: '',
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search applicants..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Statuses</option>
          {uniqueStatuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={filters.source}
          onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Sources</option>
          {uniqueSources.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>

        <select
          value={filters.position}
          onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Positions</option>
          {uniquePositions.map(position => (
            <option key={position} value={position}>{position}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>Showing {filteredApplicants.length} of {applicants.length} applicants</span>
        </div>
        
        {(filters.search || filters.status || filters.source || filters.position) && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
};