import React, { useState } from 'react';
import { X, Save, Search } from 'lucide-react';
import { useApplicants } from '../../context/ApplicantContext';
import { Applicant } from '../../types/applicant';

interface BulkUpdateProps {
  onClose: () => void;
}

export const BulkUpdate: React.FC<BulkUpdateProps> = ({ onClose }) => {
  const { applicants, updateApplicant } = useApplicants();
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [updateData, setUpdateData] = useState({
    status: '',
    source: '',
  });

  const filteredApplicants = applicants.filter(applicant =>
    applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    applicant.atsNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedApplicants.length === filteredApplicants.length) {
      setSelectedApplicants([]);
    } else {
      setSelectedApplicants(filteredApplicants.map(a => a.id));
    }
  };

  const handleSelectApplicant = (id: string) => {
    setSelectedApplicants(prev =>
      prev.includes(id) 
        ? prev.filter(applicantId => applicantId !== id)
        : [...prev, id]
    );
  };

  const handleBulkUpdate = () => {
    if (selectedApplicants.length === 0) return;

    const updates: Partial<Applicant> = {};
    if (updateData.status) updates.status = updateData.status as any;
    if (updateData.source) updates.source = updateData.source;

    selectedApplicants.forEach(id => {
      updateApplicant(id, updates);
    });

    onClose();
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Bulk Update Applicants</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applicants to update..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Update Fields */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Update Fields</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={updateData.status}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Keep current status</option>
                  <option value="New">New</option>
                  <option value="Screening">Screening</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <select
                  value={updateData.source}
                  onChange={(e) => setUpdateData(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Keep current source</option>
                  <option value="Website">Website</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Referral">Referral</option>
                  <option value="Career Fair">Career Fair</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Applicant Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Select Applicants ({selectedApplicants.length} selected)
              </h3>
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                {selectedApplicants.length === filteredApplicants.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
              {filteredApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="flex items-center space-x-3 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(applicant.id)}
                    onChange={() => handleSelectApplicant(applicant.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{applicant.name}</p>
                        <p className="text-sm text-gray-500">{applicant.email} • {applicant.position}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{applicant.atsNumber}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(applicant.status)}`}>
                          {applicant.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkUpdate}
              disabled={selectedApplicants.length === 0 || (!updateData.status && !updateData.source)}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Update {selectedApplicants.length} Applicant(s)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};