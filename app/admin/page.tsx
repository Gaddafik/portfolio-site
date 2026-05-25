"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [viewType, setViewType] = useState('novels'); 
  
  // Content Forms States
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [externalUrl, setExternalUrl] = useState(''); 
  
  // NEW: Theme and Year States
  const [theme, setTheme] = useState('');
  const [year, setYear] = useState('');

  // Profile Forms States
  const [profileData, setProfileData] = useState({ id: '', full_name: '', detailed_bio: '', email: '', linkedin_url: '', profile_image_url: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [message, setMessage] = useState('');

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      setLoading(false);
      fetchItems('novels');
      fetchProfile();
    };
    init();
  }, [router]);

  const fetchItems = async (table: string) => {
    setViewType(table);
    if (table !== 'profile') {
      const { data } = await supabase.from(table).select('*').order('created_at', { ascending: false });
      setItems(data || []);
    }
  };

  const fetchProfile = async () => {
    const { data } = await supabase.from('author_profile').select('*').limit(1).single();
    if (data) setProfileData(data);
  };

  const uploadFile = async () => { /* ... truncated for brevity, same logic as before ... */
    if (!file) return null;
    const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('documents').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('documents').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const uploadImage = async () => { /* ... same logic as before ... */
    if (!imageFile) return profileData.profile_image_url; 
    const fileName = `gaddafi-kasimu-ali-author-${Date.now()}.jpg`; 
    const { error } = await supabase.storage.from('images').upload(fileName, imageFile, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handlePublishContent = async (e: React.FormEvent, type: string) => {
    e.preventDefault();
    setMessage('Publishing...');
    try {
      let file_url = await uploadFile();
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      // AUTO-YEAR LOGIC: If left blank, automatically use the current year
      const finalYear = year.trim() !== '' ? year : new Date().getFullYear().toString();

      let error;
      if (type === 'novels') ({ error } = await supabase.from('novels').insert([{ title, slug, synopsis: content, file_url, external_url: externalUrl, status: 'Published' }]));
      else if (type === 'articles') ({ error } = await supabase.from('articles').insert([{ title, slug, content, file_url }]));
      // NEW: Pass Theme and Year into Poems and Quotes
      else if (type === 'poems') ({ error } = await supabase.from('poems').insert([{ title, slug, content, theme, publication_year: finalYear }]));
      else if (type === 'quotes') ({ error } = await supabase.from('quotes').insert([{ content, theme, publication_year: finalYear }]));

      if (error) throw error;
      setMessage(`${type} published successfully!`);
      
      // Reset all fields
      setTitle(''); setContent(''); setFile(null); setExternalUrl(''); setTheme(''); setYear('');
      fetchItems(type); 
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    /* ... exact same profile logic ... */
    e.preventDefault();
    setMessage('Updating profile...');
    try {
      const imageUrl = await uploadImage();
      const { error } = await supabase.from('author_profile').update({
        full_name: profileData.full_name, detailed_bio: profileData.detailed_bio, email: profileData.email, linkedin_url: profileData.linkedin_url, profile_image_url: imageUrl
      }).eq('id', profileData.id); 

      if (error) throw error;
      setMessage('Profile updated successfully!');
      setImageFile(null);
      fetchProfile();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    const { error } = await supabase.from(viewType).delete().eq('id', id);
    if (!error) fetchItems(viewType); 
  };

  if (loading) return <div className="p-10">Loading secure dashboard...</div>;

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button onClick={() => { supabase.auth.signOut(); router.push('/'); }} className="text-red-600 hover:underline">Exit to Site</button>
        </header>

        <div className="flex gap-2 mb-8 border-b pb-4 overflow-x-auto">
          {['profile', 'novels', 'poems', 'articles', 'quotes'].map(tab => (
            <button key={tab} onClick={() => fetchItems(tab)} className={`px-6 py-2 rounded-t-lg text-sm font-bold capitalize transition-colors ${viewType === tab ? 'bg-blue-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-200'}`}>
              {tab === 'profile' ? 'My Profile & Image' : `Manage ${tab}`}
            </button>
          ))}
        </div>

        {message && <div className="mb-6 p-4 bg-emerald-100 text-emerald-900 rounded font-bold border border-emerald-200">{message}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {viewType === 'profile' ? (
            /* ... Profile Form remains exactly the same ... */
            <section className="bg-white p-8 rounded-xl shadow border lg:col-span-2 max-w-3xl">
              <h2 className="text-2xl font-bold mb-6">Edit Identity & Contact Info</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div><label className="block text-sm font-bold mb-1">Author Name</label><input type="text" value={profileData.full_name || ''} onChange={e => setProfileData({...profileData, full_name: e.target.value})} className="w-full p-3 border rounded bg-slate-50" /></div>
                <div><label className="block text-sm font-bold mb-1">Detailed Bio</label><textarea value={profileData.detailed_bio || ''} onChange={e => setProfileData({...profileData, detailed_bio: e.target.value})} className="w-full p-3 border rounded bg-slate-50 h-32" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-bold mb-1">Public Email</label><input type="email" value={profileData.email || ''} onChange={e => setProfileData({...profileData, email: e.target.value})} className="w-full p-3 border rounded bg-slate-50" /></div>
                  <div><label className="block text-sm font-bold mb-1">LinkedIn URL</label><input type="url" value={profileData.linkedin_url || ''} onChange={e => setProfileData({...profileData, linkedin_url: e.target.value})} className="w-full p-3 border rounded bg-slate-50" /></div>
                </div>
                <div className="p-6 border border-dashed border-slate-300 bg-slate-50 rounded">
                  <label className="block text-sm font-bold mb-2">Upload Profile Picture (JPG/PNG)</label>
                  <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full text-sm" />
                </div>
                <button type="submit" className="bg-blue-900 text-white px-8 py-3 rounded font-bold w-full text-lg hover:bg-blue-800 transition-colors">Save Profile Settings</button>
              </form>
            </section>
          ) : (
            <>
              <div className="space-y-8">
                <section className="bg-white p-6 rounded-xl shadow border">
                  <h2 className="text-xl font-bold mb-4">Publish Content</h2>
                  <form onSubmit={(e) => handlePublishContent(e, viewType)} className="space-y-4">
                    {viewType !== 'quotes' && (
                      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" required />
                    )}
                    <textarea placeholder={viewType === 'quotes' ? '"Write your quote here..."' : "Write content or synopsis here..."} value={content} onChange={(e) => setContent(e.target.value)} className={`w-full p-2 border rounded ${viewType === 'quotes' ? 'h-24 font-serif text-lg' : 'h-32'}`} required />
                    
                    {/* NEW: Optional Metadata inputs for Poems and Quotes */}
                    {(viewType === 'poems' || viewType === 'quotes') && (
                      <div className="grid grid-cols-2 gap-4 p-4 border border-zinc-200 rounded bg-slate-50">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Theme (Optional)</label>
                          <input type="text" placeholder="e.g. Economy, Resilience..." value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full p-2 border rounded text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Year (Auto-fills if blank)</label>
                          <input type="text" placeholder="e.g. 2026" value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-2 border rounded text-sm" />
                        </div>
                      </div>
                    )}

                    {(viewType === 'novels' || viewType === 'articles') && (
                      <div className="space-y-4 p-4 border border-zinc-200 rounded bg-slate-50">
                        {/* ... document upload block remains same ... */}
                        <div><label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Option A: Direct Download</label><input type="file" accept=".doc,.docx,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm" /></div>
                        <div className="text-center text-xs font-bold text-slate-400">- OR -</div>
                        <div><label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Option B: External Link (Amazon, Selar, etc.)</label><input type="url" placeholder="https://..." value={externalUrl} onChange={(e) => setExternalUrl(e.target.value)} className="w-full p-2 border rounded text-sm" /></div>
                      </div>
                    )}
                    <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded font-bold w-full capitalize">Publish to {viewType}</button>
                  </form>
                </section>
              </div>

              <section className="bg-white p-6 rounded-xl shadow border h-fit">
                <h2 className="text-xl font-bold mb-4 capitalize">Manage {viewType}</h2>
                <ul className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded border">
                      <div>
                        <strong className="block text-sm">{item.title || "Quote"}</strong>
                        <span className="text-xs text-slate-500 line-clamp-1">{item.content || item.synopsis}</span>
                        {/* Display the metadata in the admin view so you can see it saved! */}
                        {(item.theme || item.publication_year) && (
                           <span className="text-xs text-blue-600 font-bold ml-2">[{item.theme} • {item.publication_year}]</span>
                        )}
                      </div>
                      <button onClick={() => handleDelete(item.id)} className="ml-4 text-xs bg-red-100 text-red-700 px-3 py-1 rounded font-bold hover:bg-red-200">Delete</button>
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}
        </div>
      </div>
    </main>
  );
}