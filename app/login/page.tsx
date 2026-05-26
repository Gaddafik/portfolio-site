"use client";

import { useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-6 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white relative">
      
      {/* Background Editorial Accents */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white border-b border-zinc-200 -z-10"></div>
      
      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-zinc-200 p-10 shadow-2xl relative">
        {/* Top stark border accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-zinc-900"></div>

        <div className="text-center mb-10 mt-4">
          <h1 className="text-3xl font-serif font-black tracking-tight text-zinc-900 mb-2">Author Workspace</h1>
          <p className="text-xs font-bold tracking-widest uppercase text-zinc-400">Secure Access Portal</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm font-bold border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">
              Email Address
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-4 border border-zinc-200 bg-[#F8F9FA] focus:bg-white focus:border-zinc-900 focus:outline-none transition-colors text-sm"
              required 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-zinc-500 mb-2 uppercase tracking-widest">
              Password
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-4 border border-zinc-200 bg-[#F8F9FA] focus:bg-white focus:border-zinc-900 focus:outline-none transition-colors text-sm"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-zinc-900 text-white px-8 py-5 text-sm font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
          >
            {loading ? 'Authenticating...' : 'Enter Workspace'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-zinc-100 pt-6">
          <Link href="/" className="text-xs font-bold tracking-widest uppercase text-zinc-400 hover:text-zinc-900 transition-colors">
            &larr; Return to Public Site
          </Link>
        </div>
      </div>
    </main>
  );
}