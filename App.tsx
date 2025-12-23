
import React, { useState } from 'react';
import { User, Booking, Test, BookingStatus } from './types';
import Login from './views/Login';
import PatientDashboard from './views/PatientDashboard';
import AdminDashboard from './views/AdminDashboard';
import Profile from './views/Profile';
import { MOCK_BOOKINGS, AVAILABLE_TESTS } from './constants';
import { Activity, User as UserIcon, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [tests, setTests] = useState<Test[]>(AVAILABLE_TESTS);

  const handleLogin = (u: User) => {
    // Adding default profile data for patient if missing
    if (u.role === 'PATIENT') {
      u.age = u.age || '45 Yrs';
      u.gender = u.gender || 'Male';
    }
    setUser(u);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const updateBookingStatus = (id: string, status: BookingStatus, results?: Record<string, string>, extra?: Partial<Booking>) => {
    setBookings(prev => prev.map(b => 
      b.id === id 
        ? { 
            ...b, 
            status, 
            results: results || b.results,
            ...extra,
            verifiedAt: status === 'COMPLETED' ? new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : b.verifiedAt
          } 
        : b
    ));
  };

  const addBooking = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
  };

  const updateTests = (updatedTests: Test[]) => {
    setTests(updatedTests);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="bg-blue-600 p-2 rounded-lg">
                <Activity className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent hidden sm:block uppercase tracking-tight">
                Gagan Diagnostic Centre
              </span>
              <span className="text-xl font-bold text-blue-700 sm:hidden">GDC</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {user.role === 'PATIENT' && (
                <div className="hidden sm:flex items-center gap-1 mr-2">
                  <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}><LayoutDashboard className="w-4 h-4" /> Dashboard</button>
                  <button onClick={() => setActiveTab('profile')} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}><UserCircle className="w-4 h-4" /> Profile</button>
                </div>
              )}
              <div onClick={() => user.role === 'PATIENT' && setActiveTab('profile')} className={`flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full cursor-pointer hover:bg-slate-200 transition-colors ${activeTab === 'profile' ? 'ring-2 ring-blue-500' : ''}`}>
                <UserIcon className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 hidden xs:block">{user.name}</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">{user.role}</span>
              </div>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50"><LogOut className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {user.role === 'PATIENT' ? (
          activeTab === 'dashboard' ? <PatientDashboard user={user} bookings={bookings.filter(b => b.patientId === user.id)} onNewBooking={addBooking} availableTests={tests} /> : <Profile user={user} onUpdateUser={handleUpdateUser} />
        ) : (
          <AdminDashboard user={user} allBookings={bookings} onUpdateStatus={updateBookingStatus} availableTests={tests} onUpdateTests={updateTests} />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        <p>&copy; 2024 Gagan Diagnostic Centre. Professional Healthcare Delivered.</p>
      </footer>
    </div>
  );
};

export default App;
