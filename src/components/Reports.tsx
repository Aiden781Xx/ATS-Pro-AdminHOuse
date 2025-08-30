import React, { useState } from 'react';
import { Download, Calendar, BarChart3, PieChart } from 'lucide-react';
import { useApplicants } from '../context/ApplicantContext';
import { ReportSummary } from './ui/ReportSummary';
import { ExportOptions } from './ui/ExportOptions';

export const Reports: React.FC = () => {
  const { applicants } = useApplicants();
  const [selectedDateRange, setSelectedDateRange] = useState('30');

  const getDateRangeApplicants = () => {
    const days = parseInt(selectedDateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return applicants.filter(applicant => 
      new Date(applicant.appliedDate) >= cutoffDate
    );
  };

  const rangeApplicants = getDateRangeApplicants();

  const generateDailyReport = () => {
    const report = {
      date: new Date().toLocaleDateString(),
      totalApplicants: applicants.length,
      newToday: applicants.filter(a => 
        new Date(a.appliedDate).toDateString() === new Date().toDateString()
      ).length,
      byStatus: {
        new: applicants.filter(a => a.status === 'New').length,
        screening: applicants.filter(a => a.status === 'Screening').length,
        interview: applicants.filter(a => a.status === 'Interview').length,
        offer: applicants.filter(a => a.status === 'Offer').length,
        hired: applicants.filter(a => a.status === 'Hired').length,
        rejected: applicants.filter(a => a.status === 'Rejected').length,
      },
      bySource: applicants.reduce((acc: Record<string, number>, curr) => {
        acc[curr.source] = (acc[curr.source] || 0) + 1;
        return acc;
      }, {}),
    };

    const csvContent = `Daily ATS Report - ${report.date}\n\n` +
      `Total Applicants: ${report.totalApplicants}\n` +
      `New Today: ${report.newToday}\n\n` +
      `Status Breakdown:\n` +
      `New: ${report.byStatus.new}\n` +
      `Screening: ${report.byStatus.screening}\n` +
      `Interview: ${report.byStatus.interview}\n` +
      `Offer: ${report.byStatus.offer}\n` +
      `Hired: ${report.byStatus.hired}\n` +
      `Rejected: ${report.byStatus.rejected}\n\n` +
      `Source Breakdown:\n` +
      Object.entries(report.bySource).map(([source, count]) => `${source}: ${count}`).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex space-x-3">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button
            onClick={generateDailyReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Daily Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReportSummary applicants={rangeApplicants} dateRange={selectedDateRange} />
        </div>
        <div>
          <ExportOptions applicants={rangeApplicants} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Status Distribution</h3>
          </div>
          <div className="space-y-3">
            {['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].map(status => {
              const count = rangeApplicants.filter(a => a.status === status).length;
              const percentage = rangeApplicants.length > 0 ? (count / rangeApplicants.length) * 100 : 0;
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{status}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Source Analysis</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(
              rangeApplicants.reduce((acc: Record<string, number>, curr) => {
                acc[curr.source] = (acc[curr.source] || 0) + 1;
                return acc;
              }, {})
            ).map(([source, count]) => {
              const percentage = rangeApplicants.length > 0 ? (count / rangeApplicants.length) * 100 : 0;
              return (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{source}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
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