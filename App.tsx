
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
import Settings from './components/Settings';
import Login from './components/Login';
import TimeTableManager from './components/TimeTableManager';
import StudentPortal from './components/StudentPortal';
import TeacherPortal from './components/TeacherPortal';
import ExamManager from './components/ExamManager';
import { UserRole, User } from './types';
import { StorageService } from './services/storage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        const user = StorageService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          // Initial background sync
          setIsSyncing(true);
          StorageService.syncFromCloud().finally(() => setIsSyncing(false));
        }
      } catch (e) {
        console.error("Initialization Error:", e);
      } finally {
        setIsInitialized(true);
      }
    };

    initApp();

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
    if (currentUser.role === UserRole.STUDENT) {
       switch(activeTab) {
          case 'dashboard': return <StudentPortal studentId={currentUser.linkedId!} />;
          case 'timetable': return <TimeTableManager />;
          case 'settings': return <Settings />;
          default: return <StudentPortal studentId={currentUser.linkedId!} />;
       }
    }

    if (currentUser.role === UserRole.TEACHER) {
       switch(activeTab) {
          case 'dashboard': return <TeacherPortal staffId={currentUser.linkedId!} />;
          case 'attendance': return <AttendanceSystem />;
          case 'marks': return <ExamManager />;
          case 'timetable': return <TimeTableManager />;
          case 'settings': return <Settings />;
          default: return <TeacherPortal staffId={currentUser.linkedId!} />;
       }
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'admission': return <AdmissionForm />;
      case 'students': return <StudentList />;
      case 'attendance': return <AttendanceSystem />;
      case 'fees': return <FeeManagement currentUser={currentUser} />;
      case 'staff': return <StaffList />;
      case 'timetable': return <TimeTableManager />;
      case 'marks': return <ExamManager />;
      case 'insights': return <AIInsights />;
      case 'script': return <AppsScriptExporter />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {isSyncing && (
        <div className="fixed top-4 right-4 z-[999] bg-indigo-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-2 animate-bounce">
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
          Cloud Update In Progress...
        </div>
      )}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        toggle={() => setSidebarOpen(!isSidebarOpen)}
        userRole={currentUser.role}
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
