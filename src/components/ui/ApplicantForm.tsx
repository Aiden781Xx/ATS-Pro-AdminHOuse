import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { useApplicants } from '../../context/ApplicantContext';
import { CreateApplicantData } from '../../types/applicant';

interface ApplicantFormProps {
  applicantId?: string | null;
  onClose: () => void;
}

export const ApplicantForm: React.FC<ApplicantFormProps> = ({ applicantId, onClose }) => {
  const { addApplicant, updateApplicant, getApplicantById, checkDuplicate } = useApplicants();
  const isEditing = !!applicantId;
  const existingApplicant = applicantId ? getApplicantById(applicantId) : null;

  const [formData, setFormData] = useState<CreateApplicantData>({
    name: '',
    email: '',
    phone: '',
    position: '',
    status: 'New',
    source: 'Website',
    experience: 0,
    skills: [],
    education: '',
    resumeUrl: '',
    notes: '',
  });

  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingApplicant) {
      setFormData({
        name: existingApplicant.name,
        email: existingApplicant.email,
        phone: existingApplicant.phone,
        position: existingApplicant.position,
        status: existingApplicant.status,
        source: existingApplicant.source,
        experience: existingApplicant.experience,
        skills: existingApplicant.skills,
        education: existingApplicant.education,
        resumeUrl: existingApplicant.resumeUrl || '',
        notes: existingApplicant.notes || '',
      });
    }
  }, [existingApplicant]);

  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    
    // Check for duplicates in real-time
    if (email && checkDuplicate(email, applicantId || undefined)) {
      setEmailError('This email already exists in the system');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emailError) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isEditing && applicantId) {
        updateApplicant(applicantId, formData);
        onClose();
      } else {
        const result = await addApplicant(formData);
        if (result.success) {
          onClose();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillsChange = (skillsText: string) => {
    const skills = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setFormData(prev => ({ ...prev, skills }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditing ? 'Edit Applicant' : 'Add New Applicant'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  emailError ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {emailError && (
                <div className="flex items-center space-x-1 mt-1">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">{emailError}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position *
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
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
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Referral">Referral</option>
                <option value="Career Fair">Career Fair</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years)
              </label>
              <input
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education
              </label>
              <input
                type="text"
                value={formData.education}
                onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                placeholder="e.g., Bachelor in Computer Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              value={formData.skills.join(', ')}
              onChange={(e) => handleSkillsChange(e.target.value)}
              placeholder="e.g., JavaScript, React, Node.js"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume URL
            </label>
            <input
              type="url"
              value={formData.resumeUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, resumeUrl: e.target.value }))}
              placeholder="https://example.com/resume.pdf"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about the applicant..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !!emailError}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Add'} Applicant</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};