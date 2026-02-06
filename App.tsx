
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AdmissionForm from './components/AdmissionForm';
import AttendanceSystem from './components/AttendanceSystem';
import FeeManagement from './components/FeeManagement';
import StaffList from './components/StaffList';
import StudentList from './components/StudentList';
import AIInsights from './components/AIInsights';
import AppsScriptExporter from './components/AppsScriptExporter';
import Login from './components/Login';
import { UserRole, User } from './types';
import { StorageService } from './services/storage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const user = StorageService.getCurrentUser();
    if (user) setCurrentUser(user);
    setIsInitialized(true);

    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
  };

  if (!isInitialized) return null;

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'admission': return <AdmissionForm />;
      case 'students': return <StudentList />;
      case 'attendance': return <AttendanceSystem />;
      case 'fees': return <FeeManagement currentUser={currentUser} />;
      case 'staff': return <StaffList />;
      case 'insights': return <AIInsights />;
      case 'script': return <AppsScriptExporter />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        toggle={() => setSidebarOpen(!isSidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
