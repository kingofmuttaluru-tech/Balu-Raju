
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Activity, ShieldCheck, UserCircle, Key, Phone, User as UserIcon, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [identifier, setIdentifier] = useState(''); // Name or Email
  const [mobile, setMobile] = useState('');
  const [credential, setCredential] = useState(''); // Password

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      id: role === 'PATIENT' ? 'p1' : 'a1',
      name: role === 'PATIENT' ? (identifier || 'John Patient') : 'Admin User',
      email: role === 'ADMIN' ? identifier : 'patient@example.com',
      phone: role === 'PATIENT' ? mobile : undefined,
      role
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 text-center animate-fadeIn">
        <div className="bg-blue-600 p-4 rounded-3xl inline-block mb-4 shadow-2xl shadow-blue-200">
          <Activity className="text-white w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Gagan Diagnostic Centre</h1>
        <p className="text-slate-500 mt-2 font-medium">Professional Care • Accurate Results • Digital Speed</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => { setRole('PATIENT'); setIdentifier(''); setCredential(''); setMobile(''); }}
            className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              role === 'PATIENT' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <UserCircle className="w-4 h-4" /> Patient
          </button>
          <button 
            onClick={() => { setRole('ADMIN'); setIdentifier(''); setCredential(''); setMobile(''); }}
            className={`flex-1 py-5 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              role === 'ADMIN' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Management
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              {role === 'PATIENT' ? 'Full Name' : 'Admin Email'}
            </label>
            <div className="relative">
              <input 
                type={role === 'PATIENT' ? "text" : "email"} 
                required
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder={role === 'PATIENT' ? "Enter your name" : "admin@gagan.com"}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-800 bg-slate-50/50"
              />
              <div className="absolute left-4 top-4">
                <UserIcon className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {role === 'PATIENT' && (
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Mobile Number</label>
              <div className="relative">
                <input 
                  type="tel" 
                  required
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-800 bg-slate-50/50"
                />
                <div className="absolute left-4 top-4">
                  <Phone className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required
                value={credential}
                onChange={e => setCredential(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold text-slate-800 bg-slate-50/50"
              />
              <div className="absolute left-4 top-4">
                <Lock className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-black text-xs uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-[0.98]"
          >
            Log In to Portal
          </button>
        </form>

        <div className="px-8 pb-8 text-center">
          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Forgot Credentials?</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
