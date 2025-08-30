import React, { useState, useCallback } from 'react';
import { Upload, X, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useApplicants } from '../../context/ApplicantContext';
import { CreateApplicantData } from '../../types/applicant';

interface BulkUploadProps {
  onClose: () => void;
}

export const BulkUpload: React.FC<BulkUploadProps> = ({ onClose }) => {
  const { bulkAddApplicants } = useApplicants();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    uploading: boolean;
    success: boolean;
    added: number;
    duplicates: number;
    errors: string[];
  }>({
    uploading: false,
    success: false,
    added: 0,
    duplicates: 0,
    errors: [],
  });

  const parseCSV = (text: string): CreateApplicantData[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const applicant: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        switch (header) {
          case 'name':
            applicant.name = value;
            break;
          case 'email':
            applicant.email = value;
            break;
          case 'phone':
            applicant.phone = value;
            break;
          case 'position':
            applicant.position = value;
            break;
          case 'status':
            applicant.status = ['New', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'].includes(value) ? value : 'New';
            break;
          case 'source':
            applicant.source = value || 'Website';
            break;
          case 'experience':
            applicant.experience = parseInt(value) || 0;
            break;
          case 'skills':
            applicant.skills = value ? value.split(';').map(s => s.trim()) : [];
            break;
          case 'education':
            applicant.education = value;
            break;
          case 'resumeurl':
          case 'resume_url':
            applicant.resumeUrl = value;
            break;
          case 'notes':
            applicant.notes = value;
            break;
        }
      });

      return applicant as CreateApplicantData;
    }).filter(applicant => applicant.name && applicant.email);
  };

  const handleFile = useCallback(async (file: File) => {
    if (!file) return;

    setUploadStatus(prev => ({ ...prev, uploading: true }));

    try {
      const text = await file.text();
      const applicants = parseCSV(text);
      
      if (applicants.length === 0) {
        setUploadStatus({
          uploading: false,
          success: false,
          added: 0,
          duplicates: 0,
          errors: ['No valid applicant data found in file'],
        });
        return;
      }

      const result = await bulkAddApplicants(applicants);
      setUploadStatus({
        uploading: false,
        success: result.success,
        added: result.added,
        duplicates: result.duplicates,
        errors: result.errors,
      });

    } catch (error) {
      setUploadStatus({
        uploading: false,
        success: false,
        added: 0,
        duplicates: 0,
        errors: ['Failed to parse file. Please check the format.'],
      });
    }
  }, [bulkAddApplicants]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => 
      file.type === 'text/csv' || 
      file.name.endsWith('.csv') ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx')
    );
    
    if (csvFile) {
      handleFile(csvFile);
    }
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'Name,Email,Phone,Position,Status,Source,Experience,Skills,Education,ResumeURL,Notes\n' +
      'John Doe,john@example.com,+1234567890,Software Engineer,New,LinkedIn,3,"JavaScript;React;Node.js",Bachelor in Computer Science,,Great candidate with strong technical skills';
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applicant_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Bulk Upload Applicants</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Upload a CSV file with applicant data
            </p>
            <button
              onClick={downloadTemplate}
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download Template</span>
            </button>
          </div>

          {!uploadStatus.uploading && !uploadStatus.success && uploadStatus.errors.length === 0 && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your CSV file here
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files
              </p>
              <input
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-colors inline-block"
              >
                Choose File
              </label>
            </div>
          )}

          {uploadStatus.uploading && (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Processing applicants...</p>
            </div>
          )}

          {(uploadStatus.success || uploadStatus.errors.length > 0) && (
            <div className="space-y-4">
              {uploadStatus.success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h4 className="text-sm font-medium text-green-800">Upload Summary</h4>
                  </div>
                  <div className="mt-2 text-sm text-green-700">
                    <p>✅ {uploadStatus.added} applicant(s) added successfully</p>
                    {uploadStatus.duplicates > 0 && (
                      <p>⚠️ {uploadStatus.duplicates} duplicate(s) skipped</p>
                    )}
                  </div>
                </div>
              )}

              {uploadStatus.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h4 className="text-sm font-medium text-red-800">Upload Errors</h4>
                  </div>
                  <div className="space-y-1 text-sm text-red-700 max-h-32 overflow-y-auto">
                    {uploadStatus.errors.map((error, index) => (
                      <p key={index}>• {error}</p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setUploadStatus({
                    uploading: false,
                    success: false,
                    added: 0,
                    duplicates: 0,
                    errors: [],
                  })}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Upload Another File
                </button>
                <button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">File Format Requirements</h4>
                <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside space-y-1">
                  <li>CSV format with comma-separated values</li>
                  <li>Headers: Name, Email, Phone, Position, Status, Source, Experience, Skills, Education</li>
                  <li>Skills should be separated by semicolons (;)</li>
                  <li>Maximum 1000 records per upload</li>
                  <li>Duplicate emails will be automatically detected and skipped</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};