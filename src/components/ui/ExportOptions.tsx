import React from 'react';
import { Download, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { Applicant } from '../../types/applicant';

interface ExportOptionsProps {
  applicants: Applicant[];
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({ applicants }) => {
  const exportToCSV = (filename: string) => {
    const headers = ['ATS Number', 'Name', 'Email', 'Phone', 'Position', 'Status', 'Source', 'Experience', 'Education', 'Skills', 'Applied Date'];
    const csvContent = [
      headers.join(','),
      ...applicants.map(applicant => [
        applicant.atsNumber,
        `"${applicant.name}"`,
        applicant.email,
        applicant.phone,
        `"${applicant.position}"`,
        applicant.status,
        applicant.source,
        applicant.experience,
        `"${applicant.education}"`,
        `"${applicant.skills.join('; ')}"`,
        new Date(applicant.appliedDate).toLocaleDateString(),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportSummaryReport = () => {
    const statusCounts = applicants.reduce((acc, applicant) => {
      acc[applicant.status] = (acc[applicant.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sourceCounts = applicants.reduce((acc, applicant) => {
      acc[applicant.source] = (acc[applicant.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const report = `ATS Summary Report - ${new Date().toLocaleDateString()}\n\n` +
      `Total Applicants: ${applicants.length}\n\n` +
      `Status Breakdown:\n` +
      Object.entries(statusCounts).map(([status, count]) => `${status}: ${count}`).join('\n') +
      `\n\nSource Breakdown:\n` +
      Object.entries(sourceCounts).map(([source, count]) => `${source}: ${count}`).join('\n') +
      `\n\nGenerated on: ${new Date().toLocaleString()}`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ats_summary_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
      
      <div className="space-y-3">
        <button
          onClick={() => exportToCSV(`applicants_${new Date().toISOString().split('T')[0]}.csv`)}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors"
        >
          <FileSpreadsheet className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Export to CSV</div>
            <div className="text-sm text-green-100">All applicant data</div>
          </div>
        </button>

        <button
          onClick={exportSummaryReport}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors"
        >
          <FileText className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Summary Report</div>
            <div className="text-sm text-blue-100">Statistics & analytics</div>
          </div>
        </button>

        <button
          onClick={() => exportToCSV(`new_applicants_${new Date().toISOString().split('T')[0]}.csv`)}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg flex items-center space-x-3 transition-colors"
        >
          <Calendar className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">New Applicants Only</div>
            <div className="text-sm text-purple-100">Recent submissions</div>
          </div>
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-600">
          All exports include {applicants.length} applicant(s) based on current filters
        </p>
      </div>
    </div>
  );
};