export interface Applicant {
  id: string;
  atsNumber: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  source: string;
  experience: number;
  skills: string[];
  education: string;
  appliedDate: string;
  resumeUrl?: string;
  notes?: string;
}

export interface CreateApplicantData {
  name: string;
  email: string;
  phone: string;
  position: string;
  status: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
  source: string;
  experience: number;
  skills: string[];
  education: string;
  resumeUrl?: string;
  notes?: string;
}