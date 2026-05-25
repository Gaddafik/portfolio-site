"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import Link from 'next/link';

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls the mobile menu

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('author_profile')
        .select('*')
        .limit(1)
        .single();
        
      if (data) setProfile(data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMenuOpen]);

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white pb-20">
      
      {/* Navigation */}
      <nav className="w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md fixed top-0 z-50">
        <div className="max-w-7xl mx-auto py-5 px-6 md:px-8 flex justify-between items-center">
          
          {/* Logo / Author Name */}
          <span className="text-2xl font-black tracking-tighter uppercase font-serif z-50 relative">
            {profile?.full_name || 'Gaddafi Kasimu Ali'}
          </span>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-xs font-bold tracking-widest text-zinc-500 uppercase">
            <Link href="/novels" className="hover:text-zinc-900 transition-colors">Books</Link>
            <Link href="/poems" className="hover:text-zinc-900 transition-colors">Poetry</Link>
            <a href="#contact" className="hover:text-zinc-900 transition-colors">Contact</a>
          </div>

          {/* Mobile Menu Trigger (Hamburger) */}
          <button 
            className="md:hidden z-50 relative p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-5 flex flex-col justify-between items-end">
              <span className={`h-[2px] bg-zinc-900 transition-all duration-300 ease-out ${isMenuOpen ? 'w-6 rotate-45 translate-y-2.5' : 'w-6'}`}></span>
              <span className={`h-[2px] bg-zinc-900 transition-all duration-300 ease-out ${isMenuOpen ? 'w-0 opacity-0' : 'w-4'}`}></span>
              <span className={`h-[2px] bg-zinc-900 transition-all duration-300 ease-out ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-[9px]' : 'w-5'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Full-Screen Overlay */}
        <div className={`fixed inset-0 bg-white z-40 transition-all duration-500 ease-in-out md:hidden flex flex-col items-center justify-center space-y-10 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <Link href="/novels" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif font-black uppercase tracking-widest text-zinc-900 hover:text-zinc-500 transition-colors">Books</Link>
          <Link href="/poems" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif font-black uppercase tracking-widest text-zinc-900 hover:text-zinc-500 transition-colors">Poetry</Link>
          <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-3xl font-serif font-black uppercase tracking-widest text-zinc-900 hover:text-zinc-500 transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 md:px-8 pt-32 md:pt-40 pb-16 md:pb-20 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6 md:space-y-8 mt-8 md:mt-0">
          <div className="inline-block border border-zinc-200 bg-white px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase text-zinc-500 shadow-sm">
            Author • Strategist • Developer
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 leading-[1.1] font-serif">
            Forging <span className="text-zinc-400 italic font-light">economic pathways</span> through literature.
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-2xl font-light whitespace-pre-wrap">
            {profile?.detailed_bio || 'Exploring industrialization, strategy, and the human experience.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/novels" className="bg-zinc-900 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all shadow-xl hover:-translate-y-1 text-center">
              Explore the Books
            </Link>
            <a href="#contact" className="bg-white text-zinc-900 border border-zinc-200 px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-zinc-50 transition-all text-center">
              Get in Touch
            </a>
          </div>
        </div>

        <div className="w-full md:w-[450px] relative mt-8 md:mt-0">
          <div className="aspect-[4/5] relative shadow-2xl rounded-sm overflow-hidden border-8 border-white bg-zinc-200">
            {!loading && profile?.profile_image_url ? (
              <img 
                src={profile.profile_image_url} 
                alt={`${profile?.full_name || 'Author'} - Nigerian Author`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-zinc-400 font-bold tracking-widest uppercase text-sm">
                {loading ? 'Loading...' : 'Image Not Found'}
              </div>
            )}
          </div>
          <div className="absolute -z-10 top-4 -right-4 md:top-6 md:-right-6 w-full h-full bg-zinc-200"></div>
        </div>
      </header>

      {/* Selected Works Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="border-t border-zinc-200 pt-16 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-black mb-2">Selected Works</h2>
            <p className="text-zinc-500 uppercase tracking-widest text-xs md:text-sm font-bold">Published Bibliography</p>
          </div>
          <Link href="/novels" className="text-xs md:text-sm font-bold tracking-widest uppercase text-zinc-900 hover:underline">
            View Complete Library &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link href="/novels/forging-the-giant" className="group block">
            <div className="bg-white aspect-[2/3] border border-zinc-200 shadow-sm mb-6 flex flex-col justify-center items-center p-8 text-center group-hover:border-zinc-400 group-hover:shadow-xl transition-all">
              <h3 className="text-2xl font-serif font-black uppercase tracking-tight mb-2">Forging the Giant</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Economic Strategy</p>
            </div>
          </Link>
          
          <Link href="/novels" className="group block">
            <div className="bg-zinc-900 text-white aspect-[2/3] shadow-sm mb-6 flex flex-col justify-center items-center p-8 text-center group-hover:shadow-xl transition-all">
              <h3 className="text-2xl font-serif font-black uppercase tracking-tight mb-2">Upcoming Title</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Fiction</p>
            </div>
          </Link>

          <Link href="/novels" className="group block">
            <div className="bg-zinc-100 aspect-[2/3] border border-zinc-200 shadow-sm mb-6 flex flex-col justify-center items-center p-8 text-center group-hover:border-zinc-400 group-hover:shadow-xl transition-all">
              <h3 className="text-2xl font-serif font-black uppercase tracking-tight mb-2">Upcoming Title</h3>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Anthology</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-zinc-900 text-white pt-20 md:pt-24 pb-8 mt-12 md:mt-20">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-black mb-6">Let's Connect.</h2>
          <p className="text-zinc-400 text-base md:text-xl font-light mb-10 max-w-2xl mx-auto">
            Available for speaking engagements, publishing inquiries, software collaborations, and discussions on Nigerian economic development.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-16 md:mb-24">
            {profile?.email && (
              <a 
                href={`mailto:${profile.email}`} 
                className="bg-white text-zinc-900 px-8 md:px-10 py-4 md:py-5 text-xs md:text-sm font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors w-full sm:w-auto"
              >
                Email Me Directly
              </a>
            )}
            {profile?.linkedin_url && (
              <a 
                href={profile.linkedin_url} 
                target="_blank"
                rel="noreferrer"
                className="border border-zinc-700 text-white px-8 md:px-10 py-4 md:py-5 text-xs md:text-sm font-bold tracking-widest uppercase hover:border-white transition-colors w-full sm:w-auto"
              >
                LinkedIn Profile
              </a>
            )}
          </div>

          <div className="border-t border-zinc-800 pt-8 flex justify-center text-[10px] md:text-xs text-zinc-600 font-bold tracking-widest uppercase text-center">
            <span>&copy; {new Date().getFullYear()} {profile?.full_name || 'Gaddafi Kasimu Ali'}. All Rights Reserved.</span>
          </div>
        </div>
      </section>
    </main>
  );
}