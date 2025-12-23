
import React, { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Phone, MapPin, Edit3, Save, X, Camera } from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    address: user.address || ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = () => {
    onUpdateUser({
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    });
    setIsEditing(false);
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Patient Profile</h2>
        <p className="text-slate-500 mt-1">Manage your personal information and contact details.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-slideIn ${
          message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
        }`}>
          <div className={`p-1 rounded-full ${message.type === 'success' ? 'bg-emerald-100' : 'bg-rose-100'}`}>
            <Save className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Card: Avatar & Header */}
        <div className="md:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 border-4 border-white shadow-lg overflow-hidden">
                <UserIcon className="w-16 h-16" />
              </div>
              <button className="absolute bottom-1 right-1 bg-white border border-slate-200 p-2 rounded-full text-slate-400 hover:text-blue-600 transition-colors shadow-sm">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-800 truncate">{user.name}</h3>
            <p className="text-sm text-slate-500 mb-6 uppercase tracking-widest font-semibold mt-1">Patient</p>
            
            <div className="space-y-3 pt-6 border-t border-slate-100 text-left">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-sm truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{user.phone || 'No phone added'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Details Form */}
        <div className="md:col-span-2">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                Personal Information
              </h4>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleCancel}
                    className="text-slate-500 hover:bg-slate-100 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-100"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                  {isEditing ? (
                    <input 
                      type="text"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <div className="text-slate-800 font-medium bg-slate-50 px-4 py-3 rounded-xl border border-transparent">{formData.name}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  {isEditing ? (
                    <input 
                      type="email"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  ) : (
                    <div className="text-slate-800 font-medium bg-slate-50 px-4 py-3 rounded-xl border border-transparent">{formData.email}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mobile Number</label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input 
                        type="tel"
                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  ) : (
                    <div className="text-slate-800 font-medium bg-slate-50 px-4 py-3 rounded-xl border border-transparent flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" /> {formData.phone || 'Not specified'}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient ID</label>
                  <div className="text-slate-500 font-mono text-sm bg-slate-100/50 px-4 py-3 rounded-xl border border-slate-100">
                    {user.id}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Residential Address</label>
                {isEditing ? (
                  <div className="relative">
                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                    <textarea 
                      rows={3}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your home address for collection services"
                    />
                  </div>
                ) : (
                  <div className="text-slate-800 font-medium bg-slate-50 px-4 py-3 rounded-xl border border-transparent flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 mt-1" />
                    <span>{formData.address || 'No address added yet.'}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50/50 p-6 flex items-start gap-4">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-blue-900">Privacy Note</h5>
                <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                  Your personal details are stored securely. We only use your information for diagnostic purposes, medical reports, and coordinating sample collections at your preferred address.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
