import { supabase } from '../../utils/supabase';
import Link from 'next/link';

// Force live data, never cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PoemsPage() {
  const { data: poems } = await supabase
    .from('poems')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white pb-32">
      <header className="w-full border-b border-zinc-200 bg-white pt-32 pb-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-zinc-900 mb-6">Poetry Collection</h1>
          <p className="text-xl text-zinc-500 font-light max-w-2xl mx-auto">
            Explorations of economy, resilience, and the human experience.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 pt-16">
        <div className="grid grid-cols-1 gap-12">
          {poems?.map((poem) => (
            <article key={poem.id} className="bg-white border border-zinc-200 p-8 md:p-12 shadow-sm hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-serif font-black mb-2">{poem.title}</h2>
                  {poem.theme && (
                    <span className="text-xs font-bold tracking-widest uppercase text-zinc-400">Theme: {poem.theme}</span>
                  )}
                </div>
                {poem.publication_year && (
                  <span className="text-xs font-bold text-zinc-400">{poem.publication_year}</span>
                )}
              </div>
              
              <p className="font-serif text-lg text-zinc-600 line-clamp-3 mb-8 whitespace-pre-wrap">
                {poem.content}
              </p>
              
              <Link 
                href={`/poems/${poem.slug}`} 
                className="inline-block border border-zinc-900 text-zinc-900 px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-colors"
              >
                Read Full Poem &rarr;
              </Link>
            </article>
          ))}

          {(!poems || poems.length === 0) && (
            <div className="text-center py-20 text-zinc-500 font-bold tracking-widest uppercase text-sm">
              No poetry published yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}