
import React from 'react';
import { Booking } from '../types';
import { TEST_TEMPLATES, Parameter } from '../constants';
import { X, Printer, Download, Activity, CheckCircle2, ShieldCheck, AlertCircle, User as UserIcon, Calendar, Clock, Stethoscope, Beaker } from 'lucide-react';

interface ReportModalProps {
  booking: Booking;
  onClose: () => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ booking, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const results = booking.results || {};
  
  const testCategory = TEST_TEMPLATES[Object.keys(TEST_TEMPLATES).find(cat => 
    booking.testName.toLowerCase().includes(cat.toLowerCase()) || 
    (results && Object.keys(results).some(rk => TEST_TEMPLATES[cat].some(p => p.key === rk)))
  ) || 'Hematology'];

  const parameters = testCategory || [];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scaleIn">
        {/* Header - Non Printable */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Activity className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-slate-800">Diagnostic Report Viewer</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="p-2 hover:bg-slate-200 rounded-lg text-slate-600 flex items-center gap-2 text-sm font-semibold transition-colors"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-grow overflow-y-auto p-8 sm:p-12 print:p-0 print:overflow-visible bg-white" id="report-printable">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Lab Header */}
            <div className="flex justify-between items-start border-b-4 border-blue-600 pb-6">
              <div className="space-y-1">
                <h1 className="text-3xl font-black text-blue-800 uppercase tracking-tighter">Gagan Diagnostic Centre</h1>
                <p className="text-xs font-bold text-slate-500 uppercase">NABL Accredited & ISO Certified Laboratory</p>
                <p className="text-[10px] text-slate-400">123 Health Enclave, Ludhiana, Punjab - 141001</p>
                <p className="text-[10px] text-slate-400">Phone: +91 98765 43210 | Email: care@gagandiagnostics.com</p>
              </div>
              <div className="text-right">
                <div className="bg-blue-600 text-white px-3 py-1 rounded-md text-[10px] font-bold uppercase mb-2 tracking-widest">Final Report</div>
                <div className="text-xs font-mono font-bold text-slate-800">ID: {booking.id}</div>
              </div>
            </div>

            {/* MANDATORY NABL PATIENT INFO GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 border border-slate-200 rounded-lg divide-y md:divide-y-0 md:divide-x divide-slate-200 text-[11px] overflow-hidden">
              {/* Left Column */}
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-3 p-2.5">
                  <span className="font-bold text-slate-400 uppercase">Patient Name:</span>
                  <span className="col-span-2 font-black text-slate-900">{booking.patientName}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="font-bold text-slate-400 uppercase">Age / Sex:</span>
                  <span className="col-span-2 font-black text-slate-900">{booking.age || '---'} / {booking.gender || '---'}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="font-bold text-slate-400 uppercase">Ref. Doctor:</span>
                  <span className="col-span-2 font-black text-slate-900">{booking.referringDoctor || 'Self'}</span>
                </div>
              </div>
              {/* Right Column */}
              <div className="divide-y divide-slate-100 bg-slate-50/30">
                <div className="grid grid-cols-3 p-2.5">
                  <span className="font-bold text-slate-400 uppercase">Collected:</span>
                  <span className="col-span-2 font-black text-slate-900">{booking.date} {booking.time ? `@ ${booking.time}` : ''}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="font-bold text-slate-400 uppercase">Reported:</span>
                  <span className="col-span-2 font-black text-slate-900">{booking.verifiedAt || '---'}</span>
                </div>
                <div className="grid grid-cols-3 p-2.5">
                  <span className="font-bold text-slate-400 uppercase">Sample Type:</span>
                  <span className="col-span-2 font-black text-slate-900">{booking.sampleType || '---'}</span>
                </div>
              </div>
            </div>

            {/* Test Results Table */}
            <div className="space-y-4">
              <div className="bg-slate-800 text-white px-4 py-2 rounded-md flex justify-between items-center">
                <h3 className="font-black text-xs uppercase tracking-widest">Investigation: {booking.testName}</h3>
                <span className="text-[9px] font-bold opacity-70 uppercase">Verified Findings</span>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-800">
                    <th className="py-2 px-1 text-[10px] font-black text-slate-600 uppercase">Parameter</th>
                    <th className="py-2 px-1 text-[10px] font-black text-slate-600 uppercase">Result</th>
                    <th className="py-2 px-1 text-[10px] font-black text-slate-600 uppercase text-center">Units</th>
                    <th className="py-2 px-1 text-[10px] font-black text-slate-600 uppercase text-right">Biological Range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parameters.length > 0 ? (
                    parameters.map(p => (
                      <tr key={p.key} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-1 text-sm font-semibold text-slate-800">{p.name}</td>
                        <td className="py-3 px-1 text-sm font-black text-blue-700">{results[p.key] || '---'}</td>
                        <td className="py-3 px-1 text-[11px] text-slate-500 text-center">{p.unit}</td>
                        <td className="py-3 px-1 text-[11px] text-slate-500 text-right font-mono">{p.range}</td>
                      </tr>
                    ))
                  ) : (
                    Object.entries(results).map(([key, value]) => (
                      <tr key={key}>
                        <td className="py-3 px-1 text-sm font-semibold text-slate-800">{key}</td>
                        <td className="py-3 px-1 text-sm font-black text-blue-700">{value}</td>
                        <td className="py-3 px-1 text-[11px] text-slate-500 text-center">---</td>
                        <td className="py-3 px-1 text-[11px] text-slate-500 text-right">---</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {Object.keys(results).length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center text-slate-300 border border-dashed rounded-xl">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest">Analysis in Progress</p>
                </div>
              )}
            </div>

            {/* Pathologist Section */}
            <div className="pt-16 flex justify-between items-end border-t border-slate-100">
              <div className="text-center w-40">
                <div className="h-12 flex items-end justify-center pb-2 border-b border-slate-100">
                   <div className="text-[10px] text-slate-300 italic">Technician Signature</div>
                </div>
                <p className="text-[10px] font-black text-slate-800 uppercase mt-2">Verified Technician</p>
              </div>

              <div className="flex flex-col items-center mb-4">
                 <div className="w-20 h-20 border-2 border-emerald-500/20 rounded-full flex items-center justify-center relative">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    <div className="absolute -bottom-2 bg-emerald-500 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase whitespace-nowrap">Secure Copy</div>
                 </div>
              </div>

              <div className="text-center w-40">
                <div className="h-12 flex items-end justify-center pb-2 border-b border-slate-900">
                   <div className="text-sm font-serif font-bold italic">Dr. S.K. Gagan</div>
                </div>
                <p className="text-[10px] font-black text-slate-800 uppercase mt-2">Dr. S.K. Gagan</p>
                <p className="text-[8px] text-slate-500 font-bold uppercase">MD (Pathology) | Lab Director</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-4 text-[9px] text-slate-400 text-center space-y-1">
              <p className="font-bold uppercase tracking-tighter">*** End of Diagnostic Report ***</p>
              <p>Clinical correlation is advised. Results are valid only for the sample tested at Gagan Diagnostic Centre.</p>
              <p>For any queries, please visit our website or contact our care team.</p>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3 print:hidden">
          <button 
            onClick={handlePrint}
            className="flex-1 bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" /> Save / Print PDF
          </button>
          <button onClick={onClose} className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all">Close</button>
        </div>
      </div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #report-printable, #report-printable * { visibility: visible; }
          #report-printable { position: fixed; left: 0; top: 0; width: 100%; margin: 0; padding: 15mm; }
          .print\\:hidden { display: none !important; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ReportModal;
