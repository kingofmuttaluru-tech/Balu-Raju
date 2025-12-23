
import React, { useState, useMemo } from 'react';
import { User, Booking, Test, BookingStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import HealthBot from '../components/HealthBot';
import ReportModal from '../components/ReportModal';
import { 
  Search, Calendar, CreditCard, Download, Clock, 
  FlaskConical, CheckCircle2, ClipboardCheck, AlertCircle, X, Eye, 
  Filter, CalendarDays, History, LayoutGrid, ListFilter,
  FileCheck, Truck, MapPin, ChevronRight, Wallet, User as UserIcon, Settings, Home, ShoppingBag, MoreHorizontal,
  Beaker
} from 'lucide-react';

interface PatientDashboardProps {
  user: User;
  bookings: Booking[];
  onNewBooking: (b: Booking) => void;
  availableTests: Test[];
}

const TIME_SLOTS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, bookings, onNewBooking, availableTests }) => {
  const [view, setView] = useState<'HOME' | 'CATALOGUE' | 'TRACK' | 'REPORTS' | 'PAYMENTS'>('HOME');
  
  // Search and Sort
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  // Booking State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [collectionType, setCollectionType] = useState<'HOME' | 'LAB'>('HOME');
  const [address, setAddress] = useState(user.address || '');
  const [paymentStep, setPaymentStep] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [viewingReport, setViewingReport] = useState<Booking | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(availableTests.map(t => t.category));
    return ['All Categories', ...Array.from(cats)];
  }, [availableTests]);

  const filteredTests = useMemo(() => {
    return availableTests.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || t.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [availableTests, searchTerm, selectedCategory]);

  const activeBookings = bookings.filter(b => b.status !== 'COMPLETED');
  const finishedBookings = bookings.filter(b => b.status === 'COMPLETED');

  const confirmBooking = () => {
    if (!selectedTest) return;
    const newBooking: Booking = {
      id: `BK${Math.floor(Math.random() * 9000) + 1000}`,
      labId: `GDC-${Math.floor(Math.random() * 90000) + 10000}`,
      patientId: user.id,
      patientName: user.name,
      age: user.age || '30 Yrs',
      gender: user.gender || 'Male',
      testId: selectedTest.id,
      testName: selectedTest.name,
      date: bookingDate || new Date().toISOString().split('T')[0],
      time: bookingTime || "08:00 AM",
      status: 'PENDING',
      paymentStatus: 'PAID',
      amount: selectedTest.price,
      referringDoctor: 'Self',
      sampleType: selectedTest.category === 'Hematology' ? 'Whole Blood' : 'Serum',
      collectionType,
      address: collectionType === 'HOME' ? address : undefined
    };
    onNewBooking(newBooking);
    setLastBooking(newBooking);
    setShowConfirmation(true);
  };

  const NavCard = ({ icon: Icon, title, desc, target, color }: any) => (
    <button 
      onClick={() => setView(target)}
      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left group"
    >
      <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{desc}</p>
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-fadeIn">
      
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Welcome, {user.name}</h1>
          <p className="text-slate-500 font-medium">Your Health, Our Priority</p>
        </div>
        <div className="flex items-center gap-3">
          {bookings.some(b => b.paymentStatus === 'PAID') && (
            <div className="bg-blue-600 px-6 py-3 rounded-2xl shadow-xl shadow-blue-100 text-white animate-pulse">
              <p className="text-[9px] font-black uppercase opacity-60">Active Lab ID</p>
              <p className="text-sm font-black tracking-widest">{bookings.find(b => b.paymentStatus === 'PAID')?.labId}</p>
            </div>
          )}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <UserIcon className="w-6 h-6 text-slate-400" />
          </div>
        </div>
      </div>

      {/* View Logic */}
      {view === 'HOME' && (
        <div className="space-y-12">
          {/* Main Quick Nav Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <NavCard icon={ShoppingBag} title="Book Test" desc="Instant Booking" target="CATALOGUE" color="bg-blue-600" />
            <NavCard icon={FlaskConical} title="Catalogue" desc="All Services" target="CATALOGUE" color="bg-indigo-600" />
            <NavCard icon={Clock} title="Live Track" desc="Sample Status" target="TRACK" color="bg-amber-500" />
            <NavCard icon={History} title="Reports" desc="Download PDF" target="REPORTS" color="bg-emerald-600" />
            <NavCard icon={Wallet} title="Payments" desc="Invoices" target="PAYMENTS" color="bg-slate-900" />
          </div>

          {/* Active Tracking Mini Component */}
          {activeBookings.length > 0 && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden relative">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-lg font-black uppercase tracking-tight">Active Tracking</h2>
                <button onClick={() => setView('TRACK')} className="text-xs font-bold text-blue-600 hover:underline">Full Timeline</button>
              </div>
              <div className="relative flex justify-between items-center">
                {['Booked', 'Assigned', 'Sample', 'In-Lab', 'Ready'].map((step, i) => (
                  <div key={step} className="flex flex-col items-center gap-2 z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-black ${
                      i <= activeBookings.length ? 'bg-blue-600 shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-300'
                    }`}>
                      {i + 1}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${
                      i <= activeBookings.length ? 'text-slate-800' : 'text-slate-300'
                    }`}>{step}</span>
                  </div>
                ))}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-100 -z-0"></div>
                <div className="absolute top-4 left-0 h-0.5 bg-blue-600 transition-all duration-1000 -z-0" style={{ width: `${(activeBookings.length / 4) * 100}%` }}></div>
              </div>
            </div>
          )}

          {/* Test Catalogue (Home Inline) */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-xl font-black uppercase tracking-tight">Recommended Packages</h2>
              <button onClick={() => setView('CATALOGUE')} className="text-xs font-bold text-blue-600 flex items-center gap-1">Browse All <ChevronRight className="w-3.5 h-3.5" /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availableTests.slice(0, 3).map(test => (
                <div key={test.id} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all">
                  <div className="bg-slate-50 inline-block px-3 py-1 rounded-lg text-[10px] font-black text-blue-600 uppercase mb-4">{test.category}</div>
                  <h3 className="font-bold text-slate-800 text-lg mb-2">{test.name}</h3>
                  <p className="text-2xl font-black text-slate-900 mb-6">₹{test.price}</p>
                  <button onClick={() => { setSelectedTest(test); setShowBookingModal(true); }} className="w-full py-3 bg-blue-600 text-white font-black text-xs uppercase rounded-xl hover:bg-blue-700">Quick Book</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {view === 'CATALOGUE' && (
        <div className="space-y-6">
          <button onClick={() => setView('HOME')} className="text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-2 uppercase tracking-widest"><X className="w-4 h-4" /> Close Catalogue</button>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search for tests..." className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-blue-500 font-bold" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <select className="bg-slate-50 px-6 py-3 rounded-2xl font-bold text-sm outline-none border border-transparent focus:border-blue-500" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTests.map(test => (
              <div key={test.id} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm group hover:border-blue-300 transition-all">
                <h3 className="font-black text-slate-800 text-xl mb-4 leading-tight">{test.name}</h3>
                <p className="text-xs text-slate-400 mb-8 leading-relaxed">{test.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-blue-600">₹{test.price}</span>
                  <button onClick={() => { setSelectedTest(test); setShowBookingModal(true); }} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-colors">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'TRACK' && (
        <div className="space-y-8">
          <button onClick={() => setView('HOME')} className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><X className="w-4 h-4" /> Close Tracker</button>
          <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">Sample Collection Tracker</h2>
            <p className="text-slate-400 text-sm max-w-md">Real-time status of your medical investigations. Laboratory processed results will appear here as soon as they are verified.</p>
            <Truck className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10" />
          </div>
          <div className="grid gap-6">
            {activeBookings.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
                <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No active investigations tracking currently.</p>
              </div>
            ) : (
              activeBookings.map(b => (
                <div key={b.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-10">
                  <div className="md:w-1/3">
                    <p className="text-blue-600 font-black text-lg mb-2 tracking-widest">{b.labId || b.id}</p>
                    <h3 className="font-bold text-xl text-slate-800 mb-2">{b.testName}</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Calendar className="w-3.5 h-3.5" /> {b.date}
                      <Clock className="w-3.5 h-3.5 ml-2" /> {b.time}
                    </div>
                  </div>
                  <div className="md:w-2/3 space-y-8">
                     {/* Horizontal Status Timeline */}
                     <div className="flex justify-between items-start text-center">
                        {[
                          { label: 'Confirmed', icon: ClipboardCheck },
                          { label: 'En-route', icon: MapPin },
                          { label: 'Testing', icon: Beaker },
                          { label: 'Published', icon: CheckCircle2 }
                        ].map((s, idx) => {
                          const isActive = (idx === 0) || (idx === 1 && b.status !== 'PENDING') || (idx === 2 && b.status === 'PROCESSING') || (idx === 3 && b.status === 'COMPLETED');
                          return (
                            <div key={s.label} className="flex flex-col items-center gap-3">
                               <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all ${
                                 isActive ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-110' : 'bg-slate-50 border-slate-100 text-slate-300'
                               }`}>
                                 <s.icon className="w-5 h-5" />
                               </div>
                               <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'text-blue-700' : 'text-slate-300'}`}>{s.label}</span>
                            </div>
                          );
                        })}
                     </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Booking Modal (The "Next Level" Workflow) */}
      {showBookingModal && selectedTest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn border border-white/20">
            {!showConfirmation ? (
              <div className="p-10">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-1">Investigation</p>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">{selectedTest.name}</h2>
                  </div>
                  <button onClick={() => setShowBookingModal(false)} className="bg-slate-50 p-3 rounded-full hover:bg-slate-100 transition-colors"><X className="w-5 h-5" /></button>
                </div>

                {!paymentStep ? (
                  <div className="space-y-8">
                    {/* Collection Type Selector */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-2 rounded-3xl">
                      <button 
                        onClick={() => setCollectionType('HOME')}
                        className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          collectionType === 'HOME' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
                        }`}
                      >Home Collection</button>
                      <button 
                        onClick={() => setCollectionType('LAB')}
                        className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          collectionType === 'LAB' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'
                        }`}
                      >Visit Laboratory</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Date</label>
                        <input type="date" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-sm outline-none" value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Slot</label>
                        <select className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-sm outline-none" value={bookingTime} onChange={e => setBookingTime(e.target.value)}>
                          {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {collectionType === 'HOME' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Home Address</label>
                        <textarea className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-sm outline-none resize-none" rows={3} value={address} onChange={e => setAddress(e.target.value)} placeholder="Full address for sample collection..." />
                      </div>
                    )}

                    <div className="bg-blue-600 p-8 rounded-[32px] text-white flex justify-between items-center shadow-2xl shadow-blue-100">
                      <div>
                        <p className="text-[10px] font-black uppercase opacity-60 mb-1">Total Payable</p>
                        <p className="text-3xl font-black">₹{selectedTest.price}</p>
                      </div>
                      <button onClick={() => setPaymentStep(true)} className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Continue</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8 text-center">
                    <div className="bg-blue-50 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto text-blue-600 shadow-xl shadow-blue-50 mb-4">
                      <Wallet className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Digital Payment</h3>
                    <div className="grid grid-cols-1 gap-3">
                       <button onClick={confirmBooking} className="flex items-center justify-between p-5 border border-slate-100 rounded-3xl hover:bg-slate-50 transition-all group">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">UPI</div>
                             <div className="text-left">
                                <p className="font-bold text-slate-800">Unified Payments</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">PhonePe / GPay / Paytm</p>
                             </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600" />
                       </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-10 leading-relaxed">By clicking pay, you agree to our digital health privacy terms and lab protocols.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center animate-bounceIn">
                 <div className="w-24 h-24 bg-emerald-500 rounded-[40px] flex items-center justify-center mx-auto text-white shadow-2xl shadow-emerald-100 mb-8 rotate-12">
                   <CheckCircle2 className="w-12 h-12" />
                 </div>
                 <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Booking Successful</h2>
                 <p className="text-slate-500 font-medium mb-10 px-8 leading-relaxed">Payment verified. Your Lab ID <span className="text-blue-600 font-black tracking-widest">{lastBooking?.labId}</span> is now active. You can track your sample in the dashboard.</p>
                 <button onClick={() => { setShowBookingModal(false); setView('HOME'); }} className="w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-2xl hover:bg-black transition-all">Go to Dashboard</button>
              </div>
            )}
          </div>
        </div>
      )}

      {viewingReport && <ReportModal booking={viewingReport} onClose={() => setViewingReport(null)} />}
      <HealthBot />

      {/* Floating Bottom Nav (Mobile/Web Hybrid Feel) */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-100 p-4 md:hidden flex justify-around items-center z-50">
        <button onClick={() => setView('HOME')} className={`p-3 rounded-2xl ${view === 'HOME' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><Home className="w-6 h-6" /></button>
        <button onClick={() => setView('CATALOGUE')} className={`p-3 rounded-2xl ${view === 'CATALOGUE' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><LayoutGrid className="w-6 h-6" /></button>
        <button onClick={() => setView('TRACK')} className={`p-3 rounded-2xl ${view === 'TRACK' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><MapPin className="w-6 h-6" /></button>
        <button onClick={() => setView('REPORTS')} className={`p-3 rounded-2xl ${view === 'REPORTS' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><History className="w-6 h-6" /></button>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounceIn { animation: bounceIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default PatientDashboard;
