import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ApplicantManagement } from './components/ApplicantManagement';
import { BulkOperations } from './components/BulkOperations';
import { Reports } from './components/Reports';
import { Navigation } from './components/Navigation';
import { ApplicantProvider } from './context/ApplicantContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from './components/ui/ToastContainer';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'applicants':
        return <ApplicantManagement />;
      case 'bulk':
        return <BulkOperations />;
      case 'reports':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <NotificationProvider>
      <ApplicantProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="container mx-auto px-4 py-8">
            {renderActiveComponent()}
          </main>
          <ToastContainer />
        </div>
      </ApplicantProvider>
    </NotificationProvider>
  );
}

export default App;