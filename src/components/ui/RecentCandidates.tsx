import React from 'react';
import { Calendar, MapPin, Mail } from 'lucide-react';
import { Applicant } from '../../types/applicant';

interface RecentCandidatesProps {
  applicants: Applicant[];
}

export const RecentCandidates: React.FC<RecentCandidatesProps> = ({ applicants }) => {
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

  if (applicants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No recent candidates to display
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applicants.map((applicant) => (
        <div key={applicant.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {applicant.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">{applicant.name}</h4>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span>{applicant.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3" />
                  <span>{applicant.position}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(applicant.appliedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-medium text-gray-500">{applicant.atsNumber}</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(applicant.status)}`}>
              {applicant.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};