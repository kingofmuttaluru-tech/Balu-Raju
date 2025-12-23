
import React, { useState, useMemo } from 'react';
import { User, Booking, BookingStatus, Test } from '../types';
import StatusBadge from '../components/StatusBadge';
import ReportModal from '../components/ReportModal';
import { TEST_TEMPLATES } from '../constants';
import { 
  ClipboardList, Package, CheckCircle, 
  Clock, Upload, Search, AlertCircle,
  FlaskConical, Plus, Edit2, Trash2, X, Info, TrendingUp, 
  Eye, BarChart3, PieChart, CalendarDays, ArrowUpRight, Save, Beaker, ShieldCheck, Stethoscope, Droplet, UserCheck, ChevronRight
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  allBookings: Booking[];
  onUpdateStatus: (id: string, status: BookingStatus, results?: Record<string, string>, extra?: Partial<Booking>) => void;
  availableTests: Test[];
  onUpdateTests: (tests: Test[]) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  user, allBookings, onUpdateStatus, availableTests, onUpdateTests 
}) => {
  const [activeTab, setActiveTab] = useState<'logistics' | 'catalog' | 'analytics'>('logistics');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingReport, setViewingReport] = useState<Booking | null>(null);
  
  // Result Entry State
  const [entryBooking, setEntryBooking] = useState<Booking | null>(null);
  const [resultValues, setResultValues] = useState<Record<string, string>>({});
  const [extraDetails, setExtraDetails] = useState({ referringDoctor: '', sampleType: '' });
  const [isApproved, setIsApproved] = useState(false);

  // Catalog Management State
  const [showTestModal, setShowTestModal] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [testForm, setTestForm] = useState<Omit<Test, 'id'>>({
    name: '',
    price: 0,
    category: 'Hematology',
    description: ''
  });

  const stats = useMemo(() => ({
    total: allBookings.length,
    pending: allBookings.filter(b => b.status === 'PENDING').length,
    assigned: allBookings.filter(b => b.status === 'ASSIGNED').length,
    processing: allBookings.filter(b => b.status === 'PROCESSING' || b.status === 'COLLECTED').length,
    completed: allBookings.filter(b => b.status === 'COMPLETED').length,
    revenue: allBookings.filter(b => b.paymentStatus === 'PAID').reduce((acc, curr) => acc + curr.amount, 0)
  }), [allBookings]);

  const filteredBookings = allBookings.filter(b => 
    b.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.labId && b.labId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenResultEntry = (booking: Booking) => {
    setEntryBooking(booking);
    setIsApproved(false);
    setExtraDetails({ 
      referringDoctor: booking.referringDoctor || 'Self', 
      sampleType: booking.sampleType || (booking.testName.toLowerCase().includes('blood') ? 'Whole Blood' : 'Serum')
    });
    
    const categoryKey = Object.keys(TEST_TEMPLATES).find(cat => 
      booking.testName.toLowerCase().includes(cat.toLowerCase()) || 
      booking.testName.toLowerCase().includes('cbc') && cat === 'Hematology' ||
      booking.testName.toLowerCase().includes('lipid') && cat === 'Biochemistry' ||
      booking.testName.toLowerCase().includes('thyroid') && cat === 'Endocrinology' ||
      booking.testName.toLowerCase().includes('diabetes') && cat === 'Metabolic' ||
      booking.testName.toLowerCase().includes('lft') && cat === 'Organ Profile'
    );

    const template = categoryKey ? TEST_TEMPLATES[categoryKey] : null;
    if (template) {
      const initialValues: Record<string, string> = {};
      template.forEach(p => initialValues[p.key] = booking.results?.[p.key] || '');
      setResultValues(initialValues);
    } else {
      setResultValues({ 'Observation': '' });
    }
  };

  const handleSaveResults = () => {
    if (!entryBooking || !isApproved) return;
    onUpdateStatus(entryBooking.id, 'COMPLETED', resultValues, extraDetails);
    setEntryBooking(null);
  };

  // Catalog Functions
  const handleOpenAddTest = () => {
    setEditingTest(null);
    setTestForm({ name: '', price: 0, category: 'Hematology', description: '' });
    setShowTestModal(true);
  };

  const handleOpenEditTest = (test: Test) => {
    setEditingTest(test);
    setTestForm({
      name: test.name,
      price: test.price,
      category: test.category,
      description: test.description
    });
    setShowTestModal(true);
  };

  const handleDeleteTest = (id: string) => {
    if (window.confirm('Are you sure you want to remove this test from the catalog?')) {
      onUpdateTests(availableTests.filter(t => t.id !== id));
    }
  };

  const handleSaveTest = () => {
    if (editingTest) {
      onUpdateTests(availableTests.map(t => t.id === editingTest.id ? { ...t, ...testForm } : t));
    } else {
      const newTest: Test = {
        ...testForm,
        id: `T${Date.now()}`
      };
      onUpdateTests([...availableTests, newTest]);
    }
    setShowTestModal(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-12">
      <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
        {[
          { id: 'logistics', icon: ClipboardList, label: 'Operations' },
          { id: 'catalog', icon: Package, label: 'Service Catalog' },
          { id: 'analytics', icon: BarChart3, label: 'Analytics' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            className={`px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all flex items-center gap-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'logistics' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Incoming</p>
                <p className="text-2xl font-black text-slate-900">{stats.pending}</p>
             </div>
             <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Pickups</p>
                <p className="text-2xl font-black text-blue-800">{stats.assigned}</p>
             </div>
             <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <p className="text-[10px] text-amber-600 font-bold uppercase mb-1">Processing</p>
                <p className="text-2xl font-black text-amber-800">{stats.processing}</p>
             </div>
             <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Reported</p>
                <p className="text-2xl font-black text-emerald-800">{stats.completed}</p>
             </div>
             <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl shadow-slate-200">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Revenue</p>
                <p className="text-2xl font-black">₹{stats.revenue.toLocaleString()}</p>
             </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-8 border-b flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
              <h3 className="text-xl font-black uppercase tracking-tight">Investigation Queue</h3>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Patient or Lab ID..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-600 transition-all" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                  <tr>
                    <th className="px-8 py-5">Patient & Lab ID</th>
                    <th className="px-8 py-5">Investigation</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-800">{b.patientName}</p>
                        <p className="text-[10px] text-blue-600 font-black tracking-widest uppercase">{b.labId || b.id}</p>
                      </td>
                      <td className="px-8 py-6 font-medium text-slate-600">{b.testName}</td>
                      <td className="px-8 py-6"><StatusBadge status={b.status} /></td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          {b.status === 'PENDING' && (
                            <button onClick={() => onUpdateStatus(b.id, 'ASSIGNED')} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2">
                              <UserCheck className="w-3 h-3" /> Assign Collector
                            </button>
                          )}
                          {b.status === 'ASSIGNED' && (
                            <button onClick={() => onUpdateStatus(b.id, 'COLLECTED')} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">
                              Mark Collected
                            </button>
                          )}
                          {b.status === 'COLLECTED' && (
                            <button onClick={() => onUpdateStatus(b.id, 'PROCESSING')} className="bg-amber-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-700 shadow-lg shadow-amber-100 transition-all">
                              Start Lab Test
                            </button>
                          )}
                          {b.status === 'PROCESSING' && (
                            <button onClick={() => handleOpenResultEntry(b)} className="bg-indigo-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2">
                              <Beaker className="w-3 h-3" /> Entry Values
                            </button>
                          )}
                          {b.status === 'COMPLETED' && (
                            <button onClick={() => setViewingReport(b)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                              View Final
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'catalog' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-tight">Active Test Catalog</h3>
            <button 
              onClick={handleOpenAddTest}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all"
            >
              <Plus className="w-4 h-4" /> Add New Test
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTests.map(test => (
              <div key={test.id} className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all group flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">{test.category}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenEditTest(test)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteTest(test.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-2 leading-tight">{test.name}</h4>
                <p className="text-xs text-slate-400 flex-grow leading-relaxed mb-6">{test.description}</p>
                <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-slate-300 uppercase mb-1">Price</p>
                    <p className="text-2xl font-black text-slate-900">₹{test.price}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <Package className="w-5 h-5 text-slate-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Management Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn border border-white/20">
            <div className="bg-blue-600 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">{editingTest ? 'Edit Investigation' : 'New Investigation'}</h3>
                <p className="text-xs text-blue-200 font-bold opacity-70 tracking-widest">Digital Service Catalog</p>
              </div>
              <button onClick={() => setShowTestModal(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-10 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investigation Name</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-100 bg-slate-50 px-5 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600"
                  value={testForm.name}
                  onChange={e => setTestForm({ ...testForm, name: e.target.value })}
                  placeholder="e.g. Total Lipid Profile"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                  <select 
                    className="w-full border border-slate-100 bg-slate-50 px-5 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-600"
                    value={testForm.category}
                    onChange={e => setTestForm({ ...testForm, category: e.target.value })}
                  >
                    {['Hematology', 'Biochemistry', 'Thyroid', 'Endocrinology', 'Metabolic', 'Vitamins', 'Organ Profile'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (₹)</label>
                  <input 
                    type="number" 
                    className="w-full border border-slate-100 bg-slate-50 px-5 py-4 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-blue-600"
                    value={testForm.price}
                    onChange={e => setTestForm({ ...testForm, price: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brief Description</label>
                <textarea 
                  className="w-full border border-slate-100 bg-slate-50 px-5 py-4 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                  rows={3}
                  value={testForm.description}
                  onChange={e => setTestForm({ ...testForm, description: e.target.value })}
                  placeholder="Explain what this test screens for..."
                />
              </div>

              <div className="pt-6 flex gap-4">
                 <button onClick={() => setShowTestModal(false)} className="flex-1 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                 <button 
                  onClick={handleSaveTest}
                  disabled={!testForm.name || testForm.price <= 0}
                  className="flex-1 py-5 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-30"
                 >
                   {editingTest ? 'Save Changes' : 'Confirm Service'}
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Entry Modal (Existing) */}
      {entryBooking && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20">
            <div className="bg-indigo-700 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Value Entry: {entryBooking.testName}</h3>
                <p className="text-xs text-indigo-200 font-bold opacity-70 tracking-widest">LAB ID: {entryBooking.labId || entryBooking.id}</p>
              </div>
              <button onClick={() => setEntryBooking(null)} className="p-3 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Referring Dr.</label>
                    <input type="text" className="w-full border border-slate-100 bg-slate-50 px-5 py-3.5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-600" value={extraDetails.referringDoctor} onChange={e => setExtraDetails({ ...extraDetails, referringDoctor: e.target.value })} />
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sample Matrix</label>
                    <input type="text" className="w-full border border-slate-100 bg-slate-50 px-5 py-3.5 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-600" value={extraDetails.sampleType} onChange={e => setExtraDetails({ ...extraDetails, sampleType: e.target.value })} />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar border-t border-slate-100 pt-8">
                {Object.entries(resultValues).map(([key, value]) => {
                  const categoryKey = Object.keys(TEST_TEMPLATES).find(cat => TEST_TEMPLATES[cat].some(p => p.key === key));
                  const param = categoryKey ? TEST_TEMPLATES[categoryKey].find(p => p.key === key) : null;
                  return (
                    <div key={key} className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{param ? param.name : key}</label>
                        {param && <span className="text-[9px] font-black text-blue-600 italic">{param.unit}</span>}
                      </div>
                      <input type="text" className="w-full border border-slate-100 bg-slate-50 px-5 py-4 rounded-2xl text-sm font-black outline-none focus:ring-2 focus:ring-indigo-600 transition-all" value={value} onChange={e => setResultValues({ ...resultValues, [key]: e.target.value })} />
                    </div>
                  );
                })}
              </div>

              <div className="pt-8 border-t border-slate-100">
                <label className="flex items-center gap-4 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 cursor-pointer group hover:bg-emerald-100/50 transition-all">
                  <input type="checkbox" className="w-6 h-6 rounded-lg accent-emerald-600 cursor-pointer" checked={isApproved} onChange={e => setIsApproved(e.target.checked)} />
                  <div>
                    <p className="text-xs font-black text-emerald-800 uppercase tracking-tight">Approve for Digital Release</p>
                    <p className="text-[10px] text-emerald-600 font-medium leading-tight">I certify clinical validation of these parameters.</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                 <button onClick={() => setEntryBooking(null)} className="flex-1 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Discard</button>
                 <button onClick={handleSaveResults} disabled={!isApproved} className="flex-1 py-5 bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-3xl shadow-2xl shadow-indigo-100 hover:bg-black transition-all disabled:opacity-30">Publish Report</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewingReport && <ReportModal booking={viewingReport} onClose={() => setViewingReport(null)} />}
      
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
