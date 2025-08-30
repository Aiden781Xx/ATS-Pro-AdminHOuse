import React, { useState } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useApplicants } from '../context/ApplicantContext';
import { BulkUpload } from './ui/BulkUpload';
import { BulkUpdate } from './ui/BulkUpdate';

export const BulkOperations: React.FC = () => {
  const [activeOperation, setActiveOperation] = useState<'upload' | 'update' | null>(null);

  const downloadTemplate = () => {
    const csvContent = 'Name,Email,Phone,Position,Status,Source,Experience,Skills,Education\n' +
      'John Doe,john@example.com,+1234567890,Software Engineer,New,LinkedIn,3,"JavaScript,React,Node.js",Bachelor in Computer Science';
    
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Bulk Operations</h1>
        <button
          onClick={downloadTemplate}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Download Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => setActiveOperation('upload')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bulk Upload</h3>
              <p className="text-gray-600">Add multiple applicants from CSV/Excel files</p>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setActiveOperation('update')}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FileSpreadsheet className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Bulk Update</h3>
              <p className="text-gray-600">Update multiple applicant records at once</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Important Notes</h4>
            <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside space-y-1">
              <li>Download the template to ensure proper format</li>
              <li>Supported formats: CSV, Excel (.xlsx)</li>
              <li>Maximum 1000 records per upload</li>
              <li>Duplicate emails will be automatically skipped</li>
            </ul>
          </div>
        </div>
      </div>

      {activeOperation === 'upload' && (
        <BulkUpload onClose={() => setActiveOperation(null)} />
      )}

      {activeOperation === 'update' && (
        <BulkUpdate onClose={() => setActiveOperation(null)} />
      )}
    </div>
  );
};