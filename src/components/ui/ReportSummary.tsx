import React from 'react';
import { TrendingUp, TrendingDown, Users, Clock } from 'lucide-react';
import { Applicant } from '../../types/applicant';

interface ReportSummaryProps {
  applicants: Applicant[];
  dateRange: string;
}

export const ReportSummary: React.FC<ReportSummaryProps> = ({ applicants, dateRange }) => {
  const totalApplicants = applicants.length;
  
  const statusCounts = applicants.reduce((acc, applicant) => {
    acc[applicant.status] = (acc[applicant.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceCounts = applicants.reduce((acc, applicant) => {
    acc[applicant.source] = (acc[applicant.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgExperience = applicants.length > 0 
    ? (applicants.reduce((sum, a) => sum + a.experience, 0) / applicants.length).toFixed(1)
    : '0';

  const hireRate = totalApplicants > 0 
    ? ((statusCounts['Hired'] || 0) / totalApplicants * 100).toFixed(1)
    : '0';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Summary Report - Last {dateRange} days
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Total Applications</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">{totalApplicants}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-600">Hire Rate</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">{hireRate}%</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-600">Avg Experience</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 mt-1">{avgExperience} years</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-600">In Progress</span>
          </div>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {(statusCounts['Screening'] || 0) + (statusCounts['Interview'] || 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Top Sources</h4>
          <div className="space-y-2">
            {Object.entries(sourceCounts)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([source, count]) => (
                <div key={source} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{source}</span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Conversion Funnel</h4>
          <div className="space-y-2">
            {['New', 'Screening', 'Interview', 'Offer', 'Hired'].map(status => {
              const count = statusCounts[status] || 0;
              const percentage = totalApplicants > 0 ? (count / totalApplicants * 100).toFixed(1) : '0';
              return (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{status}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{count}</span>
                    <span className="text-gray-500">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};