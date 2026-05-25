import { supabase } from '../../../utils/supabase'; 
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function NovelPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const { data: novel } = await supabase
    .from('novels')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!novel) {
    notFound(); 
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white pb-24">
      {/* Minimalist Navigation */}
      <header className="w-full border-b border-zinc-200 bg-white">
        <div className="max-w-4xl mx-auto py-6 px-8 flex justify-between items-center text-xs font-bold tracking-widest uppercase text-zinc-500">
          <Link href="/novels" className="hover:text-zinc-900 transition-colors">&larr; Back to Library</Link>
          <span>Status: {novel.status}</span>
        </div>
      </header>

      {/* Book Content */}
      <article className="max-w-4xl mx-auto px-8 pt-20">
        <div className="mb-16 border-b border-zinc-200 pb-12 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-zinc-900 mb-8">{novel.title}</h1>
          
          {novel.file_url && (
            <a 
              href={novel.file_url} 
              target="_blank" 
              rel="noreferrer"
              className="inline-block border border-zinc-900 text-zinc-900 px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-zinc-900 hover:text-white transition-colors"
            >
              Download Attached Document &darr;
            </a>
          )}
        </div>
        
        <div className="max-w-2xl mx-auto font-serif text-lg md:text-xl text-zinc-800 leading-loose">
          <p className="whitespace-pre-wrap">{novel.synopsis}</p>
        </div>
      </article>
    </main>
  );
}