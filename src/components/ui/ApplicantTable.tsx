import React from 'react';
import { Eye, Edit, Trash2, Download } from 'lucide-react';
import { Applicant } from '../../types/applicant';
import { useApplicants } from '../../context/ApplicantContext';

interface ApplicantTableProps {
  applicants: Applicant[];
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export const ApplicantTable: React.FC<ApplicantTableProps> = ({ 
  applicants, 
  onEdit, 
  onView 
}) => {
  const { deleteApplicant } = useApplicants();

  const getStatusColor = (status: string) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Screening': 'bg-yellow-100 text-yellow-800',
      'Interview': 'bg-purple-100 text-purple-800',
      'Offer': 'bg-green-100 text-green-800',
      'Hired': 'bg-emerald-100 text-emerald-800',
      'Rejected': 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDownloadResume = (applicant: Applicant) => {
    if (applicant.resumeUrl) {
      window.open(applicant.resumeUrl, '_blank');
    } else {
      alert('No resume available for this applicant');
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      deleteApplicant(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ATS #
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Candidate
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Applied Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applicants.map((applicant) => (
            <tr key={applicant.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {applicant.atsNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{applicant.name}</div>
                  <div className="text-sm text-gray-500">{applicant.email}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {applicant.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(applicant.status)}`}>
                  {applicant.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {applicant.source}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(applicant.appliedDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onView(applicant.id)}
                    className="text-blue-600 hover:text-blue-900 transition-colors"
                    title="View Profile"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(applicant.id)}
                    className="text-green-600 hover:text-green-900 transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadResume(applicant)}
                    className="text-purple-600 hover:text-purple-900 transition-colors"
                    title="Download Resume"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(applicant.id, applicant.name)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};