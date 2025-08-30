import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApplicants } from '../context/ApplicantContext';
import { ApplicantTable } from './ui/ApplicantTable';
import { ApplicantForm } from './ui/ApplicantForm';
import { ApplicantProfile } from './ui/ApplicantProfile';
import { SearchAndFilter } from './ui/SearchAndFilter';
import { Pagination } from './ui/Pagination';

export const ApplicantManagement: React.FC = () => {
  const { getFilteredApplicants } = useApplicants();
  const [showForm, setShowForm] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState<string | null>(null);
  const [viewingApplicant, setViewingApplicant] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    position: '',
  });

  const filteredApplicants = getFilteredApplicants(filters);
  const applicantsPerPage = 10;
  const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);
  const startIndex = (currentPage - 1) * applicantsPerPage;
  const currentApplicants = filteredApplicants.slice(startIndex, startIndex + applicantsPerPage);

  const handleEdit = (id: string) => {
    setEditingApplicant(id);
    setShowForm(true);
  };

  const handleView = (id: string) => {
    setViewingApplicant(id);
  };

  const closeModal = () => {
    setShowForm(false);
    setEditingApplicant(null);
    setViewingApplicant(null);
  };

  if (viewingApplicant) {
    return (
      <ApplicantProfile 
        applicantId={viewingApplicant} 
        onClose={closeModal}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Applicant Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Applicant</span>
        </button>
      </div>

      <SearchAndFilter filters={filters} setFilters={setFilters} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <ApplicantTable
          applicants={currentApplicants}
          onEdit={handleEdit}
          onView={handleView}
        />
        
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredApplicants.length}
              itemsPerPage={applicantsPerPage}
            />
          </div>
        )}
      </div>

      {showForm && (
        <ApplicantForm
          applicantId={editingApplicant}
          onClose={closeModal}
        />
      )}
    </div>
  );
};