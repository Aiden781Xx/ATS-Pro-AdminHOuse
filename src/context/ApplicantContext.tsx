import React, { createContext, useContext, useState, useEffect } from 'react';
import { Applicant, CreateApplicantData } from '../types/applicant';
import { generateMockApplicants } from '../utils/mockData';
import { useNotifications } from './NotificationContext';

interface ApplicantContextType {
  applicants: Applicant[];
  loading: boolean;
  addApplicant: (data: CreateApplicantData) => Promise<{ success: boolean; message: string }>;
  updateApplicant: (id: string, data: Partial<Applicant>) => void;
  deleteApplicant: (id: string) => void;
  bulkAddApplicants: (applicants: CreateApplicantData[]) => Promise<{ success: boolean; added: number; duplicates: number; errors: string[] }>;
  getFilteredApplicants: (filters: FilterOptions) => Applicant[];
  getApplicantById: (id: string) => Applicant | undefined;
  checkDuplicate: (email: string, excludeId?: string) => boolean;
}

interface FilterOptions {
  search?: string;
  status?: string;
  source?: string;
  position?: string;
}

const ApplicantContext = createContext<ApplicantContextType | undefined>(undefined);

export const useApplicants = () => {
  const context = useContext(ApplicantContext);
  if (!context) {
    throw new Error('useApplicants must be used within an ApplicantProvider');
  }
  return context;
};

export const ApplicantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Initialize with mock data
    setTimeout(() => {
      setApplicants(generateMockApplicants(25));
      setLoading(false);
    }, 500);
  }, []);

  const generateATSNumber = (): string => {
    const lastNumber = applicants.length > 0 
      ? Math.max(...applicants.map(a => parseInt(a.atsNumber.replace('ATS', ''))))
      : 8000;
    return `ATS${lastNumber + 1}`;
  };

  const checkDuplicate = (email: string, excludeId?: string): boolean => {
    return applicants.some(applicant => 
      applicant.email.toLowerCase() === email.toLowerCase() && 
      applicant.id !== excludeId
    );
  };

  const addApplicant = async (data: CreateApplicantData): Promise<{ success: boolean; message: string }> => {
    // Check for duplicate email
    if (checkDuplicate(data.email)) {
      addNotification({
        type: 'error',
        title: 'Duplicate Email',
        message: `An applicant with email ${data.email} already exists in the system.`,
      });
      return { success: false, message: 'Duplicate email found' };
    }

    const newApplicant: Applicant = {
      id: Date.now().toString(),
      atsNumber: generateATSNumber(),
      ...data,
      appliedDate: new Date().toISOString(),
    };

    setApplicants(prev => [newApplicant, ...prev]);
    
    addNotification({
      type: 'success',
      title: 'Applicant Added',
      message: `${data.name} has been successfully added to the system.`,
    });

    return { success: true, message: 'Applicant added successfully' };
  };

  const updateApplicant = (id: string, data: Partial<Applicant>) => {
    const applicant = getApplicantById(id);
    if (!applicant) return;

    // Check for duplicate email if email is being updated
    if (data.email && data.email !== applicant.email && checkDuplicate(data.email, id)) {
      addNotification({
        type: 'error',
        title: 'Duplicate Email',
        message: `An applicant with email ${data.email} already exists in the system.`,
      });
      return;
    }

    setApplicants(prev => 
      prev.map(applicant => 
        applicant.id === id ? { ...applicant, ...data } : applicant
      )
    );

    addNotification({
      type: 'success',
      title: 'Applicant Updated',
      message: `${applicant.name}'s information has been updated successfully.`,
    });

    // Send status change notification
    if (data.status && data.status !== applicant.status) {
      addNotification({
        type: 'info',
        title: 'Status Changed',
        message: `${applicant.name}'s status changed from ${applicant.status} to ${data.status}.`,
      });
    }
  };

  const deleteApplicant = (id: string) => {
    const applicant = getApplicantById(id);
    if (!applicant) return;

    setApplicants(prev => prev.filter(applicant => applicant.id !== id));
    
    addNotification({
      type: 'warning',
      title: 'Applicant Deleted',
      message: `${applicant.name} has been removed from the system.`,
    });
  };

  const bulkAddApplicants = async (newApplicants: CreateApplicantData[]): Promise<{ success: boolean; added: number; duplicates: number; errors: string[] }> => {
    let added = 0;
    let duplicates = 0;
    const errors: string[] = [];
    const validApplicants: Applicant[] = [];

    for (const [index, data] of newApplicants.entries()) {
      try {
        // Check for duplicate email
        if (checkDuplicate(data.email)) {
          duplicates++;
          errors.push(`Row ${index + 1}: Duplicate email ${data.email}`);
          continue;
        }

        // Check if email is already in the current batch
        if (validApplicants.some(a => a.email.toLowerCase() === data.email.toLowerCase())) {
          duplicates++;
          errors.push(`Row ${index + 1}: Duplicate email ${data.email} in batch`);
          continue;
        }

        const newApplicant: Applicant = {
          id: (Date.now() + index).toString(),
          atsNumber: `ATS${8001 + applicants.length + added}`,
          ...data,
          appliedDate: new Date().toISOString(),
        };

        validApplicants.push(newApplicant);
        added++;
      } catch (error) {
        errors.push(`Row ${index + 1}: Invalid data format`);
      }
    }

    if (validApplicants.length > 0) {
      setApplicants(prev => [...validApplicants, ...prev]);
    }

    // Send notifications
    if (added > 0) {
      addNotification({
        type: 'success',
        title: 'Bulk Upload Complete',
        message: `Successfully added ${added} applicant(s) to the system.`,
      });
    }

    if (duplicates > 0) {
      addNotification({
        type: 'warning',
        title: 'Duplicates Skipped',
        message: `${duplicates} duplicate email(s) were skipped during upload.`,
      });
    }

    if (errors.length > 0 && added === 0) {
      addNotification({
        type: 'error',
        title: 'Upload Failed',
        message: `No applicants were added due to validation errors.`,
      });
    }

    return { success: added > 0, added, duplicates, errors };
  };

  const getFilteredApplicants = (filters: FilterOptions): Applicant[] => {
    return applicants.filter(applicant => {
      const matchesSearch = !filters.search || 
        applicant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        applicant.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        applicant.phone.includes(filters.search) ||
        applicant.atsNumber.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = !filters.status || applicant.status === filters.status;
      const matchesSource = !filters.source || applicant.source === filters.source;
      const matchesPosition = !filters.position || applicant.position === filters.position;

      return matchesSearch && matchesStatus && matchesSource && matchesPosition;
    });
  };

  const getApplicantById = (id: string): Applicant | undefined => {
    return applicants.find(applicant => applicant.id === id);
  };

  return (
    <ApplicantContext.Provider value={{
      applicants,
      loading,
      addApplicant,
      updateApplicant,
      deleteApplicant,
      bulkAddApplicants,
      getFilteredApplicants,
      getApplicantById,
      checkDuplicate,
    }}>
      {children}
    </ApplicantContext.Provider>
  );
};