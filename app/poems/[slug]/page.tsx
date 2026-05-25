import { supabase } from '../../../utils/supabase'; // Notice the 3 sets of dots!
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function NovelPage({ params }: { params: { slug: string } }) {
  // In newer Next.js versions, we await the params
  const { slug } = await params;

  const { data: novel } = await supabase
    .from('novels')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!novel) {
    notFound(); // Automatically shows a 404 page if the book doesn't exist
  }

  return (
    <main className="min-h-screen bg-slate-50 py-16 px-8 text-slate-900">
      <div className="max-w-3xl mx-auto">
        <Link href="/novels" className="text-blue-700 hover:underline font-semibold mb-8 inline-block">
          &larr; Back to Books
        </Link>
        
        <article className="bg-white p-10 rounded-xl shadow-sm border border-slate-200">
          <div className="mb-8 border-b pb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{novel.title}</h1>
            <span className="bg-blue-100 text-blue-900 text-sm font-bold px-4 py-2 rounded-full uppercase tracking-wider">
              Status: {novel.status}
            </span>
          </div>
          
          <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
            <h3 className="text-xl font-bold mb-4 text-slate-900">Synopsis</h3>
            {/* whitespace-pre-wrap ensures your paragraph breaks are respected */}
            <p className="whitespace-pre-wrap">{novel.synopsis}</p>
          </div>
        </article>
      </div>
    </main>
  );
}