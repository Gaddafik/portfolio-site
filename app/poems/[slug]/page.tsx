import { supabase } from '../../../utils/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

// Correct way to handle params in modern Next.js
export default async function IndividualPoemPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // Await the params first
  const { slug } = await params;

  // Fetch the specific poem
  const { data: poem } = await supabase
    .from('poems')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!poem) {
    notFound();
  }

  const { data: profile } = await supabase
    .from('author_profile')
    .select('full_name')
    .limit(1)
    .single();
  
  const authorName = profile?.full_name || 'Gaddafi Kasimu Ali';

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white pb-32">
      <header className="w-full border-b border-zinc-200 bg-white">
        <div className="max-w-4xl mx-auto py-6 px-8 flex justify-between items-center text-xs font-bold tracking-widest uppercase text-zinc-500">
          <Link href="/poems" className="hover:text-zinc-900 transition-colors">&larr; Back to Poetry</Link>
          <span>{poem.publication_year || new Date().getFullYear()}</span>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-8 pt-20">
        <div className="mb-12 text-center">
          {poem.theme && (
            <div className="inline-block border border-zinc-200 bg-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-zinc-500 shadow-sm mb-6">
              Theme: {poem.theme}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-zinc-900 mb-6 leading-tight">
            {poem.title}
          </h1>
          <div className="w-16 h-1 bg-zinc-900 mx-auto mb-6"></div>
          <p className="text-sm font-bold tracking-widest uppercase text-zinc-400">
            By {authorName}
          </p>
        </div>

        <div className="bg-white border border-zinc-200 p-10 md:p-16 shadow-xl">
          <div className="font-serif text-lg md:text-xl leading-loose text-zinc-800 whitespace-pre-wrap">
            {poem.content}
          </div>
        </div>

        <div className="mt-16 text-center border-t border-zinc-200 pt-12">
          <Link href="/poems" className="inline-block bg-zinc-900 text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-zinc-800 transition-all shadow-xl hover:-translate-y-1">
            Read More Poetry
          </Link>
        </div>
      </article>
    </main>
  );
}