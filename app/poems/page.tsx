import { supabase } from '../../utils/supabase';
import Link from 'next/link';

export const revalidate = 0;

export default async function PoemsPage() {
  // Fetch poems and the author profile
  const { data: poems } = await supabase.from('poems').select('*').order('created_at', { ascending: false });
  const { data: profile } = await supabase.from('author_profile').select('full_name').single();
  
  const authorName = profile?.full_name || 'Gaddafi Kasimu Ali';

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white pb-24">
      <header className="w-full border-b border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto py-6 px-8 flex justify-between items-center text-xs font-bold tracking-widest uppercase text-zinc-500">
          <Link href="/" className="hover:text-zinc-900 transition-colors">&larr; Home</Link>
          <span>Poetry</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 pt-20">
        <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-zinc-900 mb-4">Selected Poems</h1>
        <p className="text-xl text-zinc-600 font-light mb-16 max-w-2xl">Exploring the human experience through verse.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {poems?.map((poem) => (
            <Link key={poem.id} href={`/poems/${poem.slug}`} className="group block">
              <article className="bg-white border border-zinc-200 p-8 h-full flex flex-col justify-between hover:border-zinc-400 hover:shadow-xl transition-all relative overflow-hidden">
                
                {/* Professional Theme Badge */}
                {poem.theme && (
                  <div className="absolute top-0 right-0 bg-zinc-100 text-zinc-500 text-[10px] font-bold px-3 py-1 uppercase tracking-widest border-b border-l border-zinc-200">
                    {poem.theme}
                  </div>
                )}

                <div>
                  <h2 className="text-2xl font-serif font-black leading-tight mb-4 group-hover:underline decoration-2 underline-offset-4 mt-2">{poem.title}</h2>
                  <p className="text-zinc-600 text-sm line-clamp-4 leading-relaxed mb-6 font-serif italic">"{poem.content.substring(0, 100)}..."</p>
                </div>
                
                <div className="flex flex-col pt-6 border-t border-zinc-100 gap-2">
                  {/* Dynamic Author and Year Attribution */}
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                    By {authorName} <span className="mx-1">•</span> {poem.publication_year}
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                    Read Poem &rarr;
                  </div>
                </div>
              </article>
            </Link>
          ))}
          {(!poems || poems.length === 0) && (
            <p className="text-zinc-500 italic font-serif">No poetry published yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}