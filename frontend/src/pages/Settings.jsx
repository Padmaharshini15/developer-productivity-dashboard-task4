import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Moon, Sun, Monitor, LogOut, Lock, Edit2, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();
  
  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (passForm.newPassword !== passForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      });
      setSuccess('Password updated successfully');
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your application preferences and security.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Appearance</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Customize how DevDash looks on your device.</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button 
            onClick={() => !isDark && toggleTheme()}
            className={`flex flex-col items-center justify-center p-4 gap-2 transition-all rounded-xl border-2 ${isDark ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
          >
            <Moon className={`w-6 h-6 ${isDark ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`} />
            <span className={`font-medium text-sm ${isDark ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>Dark Mode</span>
          </button>
          <button 
            onClick={() => isDark && toggleTheme()}
            className={`flex flex-col items-center justify-center p-4 gap-2 transition-all rounded-xl border-2 ${!isDark ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
          >
            <Sun className={`w-6 h-6 ${!isDark ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`} />
            <span className={`font-medium text-sm ${!isDark ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>Light Mode</span>
          </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Account</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your account identity.</p>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Email Address</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</div>
            </div>
            <Link to="/profile" className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Edit2 className="w-4 h-4" /> Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Security</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your account security and sessions.</p>
        
        <div className="flex flex-col gap-6">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4" /> {success}
            </div>
          )}
          
          <form onSubmit={handlePasswordChange} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30">
                <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">Change Password</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Update your account password</div>
              </div>
            </div>
            
            <div className="grid gap-4 max-w-md ml-12">
              <input 
                type="password" 
                placeholder="Current Password" 
                className="w-full text-sm p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={passForm.currentPassword}
                onChange={e => setPassForm({...passForm, currentPassword: e.target.value})}
                required 
              />
              <input 
                type="password" 
                placeholder="New Password" 
                className="w-full text-sm p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={passForm.newPassword}
                onChange={e => setPassForm({...passForm, newPassword: e.target.value})}
                required 
              />
              <input 
                type="password" 
                placeholder="Confirm New Password" 
                className="w-full text-sm p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={passForm.confirmPassword}
                onChange={e => setPassForm({...passForm, confirmPassword: e.target.value})}
                required 
              />
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors w-fit" disabled={loading}>
                {loading ? 'Updating...' : 'Change Password'}
              </button>
            </div>
          </form>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <LogOut className="w-5 h-5 text-red-600 dark:text-red-500" />
              </div>
              <div>
                <div className="font-semibold text-red-700 dark:text-red-400">Sign Out</div>
                <div className="text-sm text-red-600/80 dark:text-red-400/80">Log out of DevDash on this device</div>
              </div>
            </div>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors" onClick={logout}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
