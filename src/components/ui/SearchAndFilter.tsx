import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useApplicants } from '../../context/ApplicantContext';

interface SearchAndFilterProps {
  filters: {
    search: string;
    status: string;
    source: string;
    position: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    search: string;
    status: string;
    source: string;
    position: string;
  }>>;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({ filters, setFilters }) => {
  const { applicants, getFilteredApplicants } = useApplicants();

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

  const hasActiveFilters = filters.search || filters.status || filters.source || filters.position;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Search & Filter</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
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

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>
            Showing {filteredApplicants.length} of {applicants.length} applicants
          </span>
        </div>
        
        {hasActiveFilters && (
          <span className="text-blue-600">
            {Object.values(filters).filter(Boolean).length} filter(s) applied
          </span>
        )}
      </div>
    </div>
  );
};