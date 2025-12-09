// src/pages/Home.jsx
import React from 'react'
import { ArrowRight } from 'lucide-react'

export default function Home({ posts, onPostClick }) {
  // 1. 【关键修复】这行代码必须放在所有变量声明之前！
  // 如果 posts 不存在，或者 posts 是空数组，直接显示加载中，不要往下执行
  if (!posts || posts.length === 0) {
    return (
      <main className="pt-20 pb-20 min-h-screen">
        <section className="container-max">
          <div className="text-center text-stone-400 mt-20">
            还没有文章数据...
          </div>
        </section>
      </main>
    )
  }

  // 2. 只有上面的检查通过了，才能安全地定义 featured
  const featured = posts[0]
  const others = posts.slice(1)

  // 3. 再次确保 featured 真的有内容（双重保险）
  if (!featured) return null;

  return (
    <main className="pt-20 pb-20 min-h-screen">
      <section className="container-max mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <div className="card overflow-hidden">
              <div style={{height: '420px'}} className="relative">
                {/* 这里现在绝对安全了 */}
                <img 
                  src={featured.image} 
                  alt={featured.title} 
                  className="w-full h-full object-cover brightness-90" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute left-6 bottom-6 text-white">
                  <div className="text-xs uppercase tracking-wider text-stone-300 mb-2">{featured.category} · {featured.date}</div>
                  <h2 className="text-3xl font-serif leading-tight">{featured.title}</h2>
                  <p className="mt-2 text-stone-300 max-w-xl">{featured.summary || featured.titleCn}</p>
                  <button onClick={() => onPostClick(featured)} className="mt-4 btn-accent">Read more</button>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5 space-y-6">
            {others.map(post => (
              <div key={post.id} className="card p-4 flex items-start space-x-4 cursor-pointer hover:translate-x-1 transition-transform" onClick={() => onPostClick(post)}>
                <img src={post.image} alt="" className="w-28 h-20 object-cover rounded-md flex-shrink-0" />
                <div>
                  <div className="text-xs text-stone-400 mb-1">{post.category} · {post.date}</div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <div className="text-sm text-stone-300 mt-1">{post.summary}</div>
                </div>
                <div className="ml-auto text-stone-400"><ArrowRight size={18} /></div>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="container-max">
        <div className="text-stone-400 text-sm">更多文章…</div>
      </section>
    </main>
  )
}