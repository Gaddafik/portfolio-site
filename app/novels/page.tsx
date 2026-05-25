import { supabase } from '../../utils/supabase';
import Link from 'next/link';

export const revalidate = 0;

export default async function NovelsPage() {
  const { data: novels } = await supabase
    .from('novels')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white pb-24">
      <header className="w-full border-b border-zinc-200 bg-white">
        <div className="max-w-6xl mx-auto py-6 px-8 flex justify-between items-center text-xs font-bold tracking-widest uppercase text-zinc-500">
          <Link href="/" className="hover:text-zinc-900 transition-colors">&larr; Home</Link>
          <span>Bibliography</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-8 pt-20">
        <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tight text-zinc-900 mb-4">The Library</h1>
        <p className="text-xl text-zinc-600 font-light mb-16 max-w-2xl">A complete collection of published works, essays, and strategic insights.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {novels?.map((novel) => (
            <Link key={novel.id} href={`/novels/${novel.slug}`} className="group block">
              <article className="bg-white border border-zinc-200 p-8 h-full flex flex-col justify-between hover:border-zinc-400 hover:shadow-xl transition-all">
                <div>
                  <h2 className="text-2xl font-serif font-black leading-tight mb-3 group-hover:underline decoration-2 underline-offset-4">{novel.title}</h2>
                  <p className="text-zinc-600 text-sm line-clamp-3 leading-relaxed mb-6 font-serif">{novel.synopsis}</p>
                </div>
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest text-zinc-400 pt-6 border-t border-zinc-100">
                  <span>Read &rarr;</span>
                  <span className="text-zinc-900 bg-zinc-100 px-3 py-1">{novel.status}</span>
                </div>
              </article>
            </Link>
          ))}
          {(!novels || novels.length === 0) && (
            <p className="text-zinc-500 italic font-serif">No books published yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}