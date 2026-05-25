"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import Link from 'next/link';

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [novels, setNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Profile
      const { data: p } = await supabase.from('author_profile').select('*').limit(1).single();
      // Fetch Novels
      const { data: n } = await supabase.from('novels').select('*').order('created_at', { ascending: false });
      
      if (p) setProfile(p);
      if (n) setNovels(n);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans pb-20">
      {/* Navigation */}
      <nav className="w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md fixed top-0 z-50">
        <div className="max-w-7xl mx-auto py-5 px-6 md:px-8 flex justify-between items-center">
          <span className="text-2xl font-black tracking-tighter uppercase font-serif z-50">
            {profile?.full_name || 'Gaddafi Kasimu Ali'}
          </span>
          <div className="hidden md:flex space-x-8 text-xs font-bold tracking-widest text-zinc-500 uppercase">
            <Link href="/novels" className="hover:text-zinc-900 transition-colors">Books</Link>
            <Link href="/poems" className="hover:text-zinc-900 transition-colors">Poetry</Link>
            <a href="#contact" className="hover:text-zinc-900 transition-colors">Contact</a>
          </div>
          <button className="md:hidden z-50 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span className={`h-[2px] bg-zinc-900 transition-all ${isMenuOpen ? 'w-6 rotate-45 translate-y-2.5' : 'w-6'}`}></span>
              <span className={`h-[2px] bg-zinc-900 transition-all ${isMenuOpen ? 'w-0 opacity-0' : 'w-4'}`}></span>
              <span className={`h-[2px] bg-zinc-900 transition-all ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-[9px]' : 'w-5'}`}></span>
            </div>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-7xl mx-auto px-6 md:px-8 pt-40 pb-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-8">
          <div className="inline-block border border-zinc-200 bg-white px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase text-zinc-500 shadow-sm">
            Author • Strategist • Developer
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight font-serif">Forging <span className="text-zinc-400 italic">economic pathways</span>.</h1>
          <p className="text-xl text-zinc-600 font-light whitespace-pre-wrap">{profile?.detailed_bio}</p>
        </div>
        <div className="w-full md:w-[400px] aspect-[4/5] bg-zinc-200 shadow-2xl relative">
          {profile?.profile_image_url && <img src={profile.profile_image_url} className="w-full h-full object-cover" alt="Author" />}
        </div>
      </header>

      {/* Dynamic Library Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-20 border-t border-zinc-200">
        <h2 className="text-4xl font-serif font-black mb-12">Library</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {novels.length > 0 ? (
            novels.map((n) => (
              <div key={n.id} className="bg-white border p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-black mb-2">{n.title}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 ${n.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {n.status}
                  </span>
                </div>
                <div className="mt-8">
                  {(n.file_url || n.external_url) ? (
                    <a href={n.file_url || n.external_url} target="_blank" className="text-xs font-bold uppercase tracking-widest underline">
                      {n.file_url ? 'Download' : 'Read Online'}
                    </a>
                  ) : <span className="text-xs text-zinc-400">Coming Soon</span>}
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-500">No books in the library yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}