import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
      <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/40 group-hover:scale-110 transition-transform">
          <LayoutDashboard className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-black text-white tracking-widest uppercase">Admin Panel</span>
      </Link>

      <div className="relative mb-8">
        <p className="text-[10rem] font-black text-white/5 leading-none select-none tracking-tighter">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-6 bg-gray-900 rounded-[2.5rem] shadow-2xl border border-white/5">
            <Compass className="h-16 w-16 text-primary-500 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>
      </div>

      <div className="space-y-4 max-w-md mb-12">
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
          Page Not Found
        </h1>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
          This page doesn't exist or you don't have permission to view it.
        </p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-3 px-10 py-5 bg-primary-600 text-white rounded-full text-sm font-black uppercase tracking-[0.2em] hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/40 active:scale-[0.98]"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
