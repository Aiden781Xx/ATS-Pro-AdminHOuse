import React from 'react';
import { X, Mail, Phone, Calendar, MapPin, Award, GraduationCap, FileText, Download } from 'lucide-react';
import { useApplicants } from '../../context/ApplicantContext';

interface ApplicantProfileProps {
  applicantId: string;
  onClose: () => void;
}

export const ApplicantProfile: React.FC<ApplicantProfileProps> = ({ applicantId, onClose }) => {
  const { getApplicantById } = useApplicants();
  const applicant = getApplicantById(applicantId);

  if (!applicant) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800 border-blue-200',
      'Screening': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Interview': 'bg-purple-100 text-purple-800 border-purple-200',
      'Offer': 'bg-green-100 text-green-800 border-green-200',
      'Hired': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Rejected': 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleDownloadResume = () => {
    if (applicant.resumeUrl) {
      window.open(applicant.resumeUrl, '_blank');
    } else {
      alert('No resume available for this applicant');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{applicant.name}</h2>
            <p className="text-gray-500">{applicant.atsNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{applicant.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{applicant.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{applicant.position}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900">
                      Applied: {new Date(applicant.appliedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Experience:</span>
                    <span className="text-sm font-medium text-gray-900">{applicant.experience} years</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Education:</span>
                    <span className="text-sm font-medium text-gray-900">{applicant.education}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {applicant.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{applicant.notes}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
                <span className={`px-3 py-2 text-sm font-medium rounded-lg border ${getStatusColor(applicant.status)}`}>
                  {applicant.status}
                </span>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Source</h3>
                <p className="text-sm text-gray-900">{applicant.source}</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Resume</h3>
                <button
                  onClick={handleDownloadResume}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resume</span>
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                    Schedule Interview
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                    Send Email
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                    Add Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};