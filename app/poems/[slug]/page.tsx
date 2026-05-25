import { supabase } from '../../../utils/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

export default async function IndividualPoemPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  const { data: poem } = await supabase
    .from('poems')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!poem) notFound();

  const { data: profile } = await supabase
    .from('author_profile')
    .select('full_name')
    .limit(1)
    .single();
  
  const authorName = profile?.full_name || 'Gaddafi Kasimu Ali';

  return (
    <main className="min-h-screen bg-[#FDFDFC] text-zinc-900 font-sans selection:bg-amber-100 pb-32">
      {/* Subtle Navigation */}
      <nav className="max-w-4xl mx-auto px-8 pt-12 pb-8 flex justify-between items-center text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400">
        <Link href="/poems" className="hover:text-zinc-900 transition-colors">&larr; Back to Library</Link>
      </nav>

      <article className="max-w-2xl mx-auto px-8 pt-12">
        {/* Title Block */}
        <div className="mb-20">
          {poem.theme && (
            <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-amber-600 mb-6 border-b border-amber-600 pb-1">
              {poem.theme}
            </span>
          )}
          <h1 className="text-5xl md:text-6xl font-serif font-light tracking-tight text-zinc-900 mb-8 leading-[1.1]">
            {poem.title}
          </h1>
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-500">
            {authorName} · {poem.publication_year || new Date().getFullYear()}
          </p>
        </div>

        {/* The Poem - Increased line height for professional legibility */}
        <div className="font-serif text-xl md:text-2xl leading-[2] text-zinc-700 whitespace-pre-wrap selection:bg-amber-100">
          {poem.content}
        </div>

        {/* Footer */}
        <div className="mt-32 border-t border-zinc-100 pt-16 text-center">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-400 mb-8">
            End of Verse
          </p>
          <Link href="/poems" className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-900 border-b border-zinc-900 pb-1 hover:text-amber-600 hover:border-amber-600 transition-all">
            Continue Reading &rarr;
          </Link>
        </div>
      </article>
    </main>
  );
}