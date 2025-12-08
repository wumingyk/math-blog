import * as React from 'react';
import { ArrowUpRight, ArrowRight, Menu, X, Github, Twitter, Instagram } from 'lucide-react';

// --- 数据源 (加入真实图片链接) ---
const BLOG_POSTS = [
  {
    id: 1,
    title: "The Art of Subtracting",
    titleCn: "极简生活：给生活做减法",
    excerpt: "在这个信息过载的时代，极简主义不仅仅是扔掉东西，更是对生活优先级的重新审视。当我们开始拒绝无效的输入，真实的自我才会浮现。",
    content: `(这里保持之前的长文内容，为了演示省略...)`,
    date: "OCT 24, 2023",
    category: "LIFESTYLE",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=2000&auto=format&fit=crop", // 极简白色调
    featured: true // 标记为推荐文章
  },
  {
    id: 2,
    title: "React 19: A New Era",
    titleCn: "探索 React 19 的新特性",
    excerpt: "编译器优化、全新的 Hook 以及对服务器组件的进一步支持。前端开发的范式正在悄然改变。",
    content: `...`,
    date: "NOV 05, 2023",
    category: "TECH",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop", // 抽象科技感
    featured: false
  },
  {
    id: 3,
    title: "City Walker",
    titleCn: "周末的胶片摄影日记",
    excerpt: "带上我的旧相机，穿梭在老城区的街道。胶片的颗粒感似乎能留住时间的温度，每一次快门都是与光影的对话。",
    content: `...`,
    date: "NOV 12, 2023",
    category: "PHOTOGRAPHY",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop", // 相机/胶片
    featured: false
  },
  {
    id: 4,
    title: "Reading Classics",
    titleCn: "为什么我们要阅读经典？",
    excerpt: "卡尔维诺说：经典作品是那些你经常听人家说正在重读、而不是正在阅读的书。",
    content: `...`,
    date: "NOV 20, 2023",
    category: "READING",
    image: "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=2000&auto=format&fit=crop", // 书籍
    featured: false
  }
];

// --- 组件部分 ---

const Header = ({ setView, activeView }) => (
  <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white px-6 py-6 flex justify-between items-center pointer-events-none">
    {/* Logo 区 - 即使背景是白色，混合模式也会让它可见 */}
    <div 
      className="text-2xl font-serif font-bold tracking-tighter cursor-pointer pointer-events-auto hover:opacity-70 transition-opacity"
      onClick={() => setView('home')}
    >
      Alex.
    </div>

    {/* 极简导航 */}
    <nav className="pointer-events-auto hidden md:flex space-x-8 text-sm font-medium tracking-widest">
      {['HOME', 'WRITING', 'ABOUT'].map((item) => (
        <button
          key={item}
          onClick={() => setView(item === 'HOME' ? 'home' : 'about')}
          className="hover:underline decoration-1 underline-offset-4 transition-all"
        >
          {item}
        </button>
      ))}
    </nav>

    {/* 移动端菜单图标 */}
    <button className="md:hidden pointer-events-auto">
      <Menu size={24} />
    </button>
  </header>
);

// 首页 - 杂志风格布局
const HomeView = ({ posts, onPostClick }) => {
  const featuredPost = posts.find(p => p.featured) || posts[0];
  const listPosts = posts.filter(p => p.id !== featuredPost.id);

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-stone-900 pt-24 pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Hero Section - 巨大的宣言 */}
      <section className="mb-24 mt-12 border-b border-stone-200 pb-12">
        <h1 className="font-serif text-5xl md:text-8xl leading-[0.9] tracking-tight mb-8">
          Design, Code <br />
          <span className="italic font-light text-stone-400">& Life.</span>
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end w-full max-w-4xl">
          <p className="text-sm md:text-base text-stone-500 max-w-md leading-relaxed mb-6 md:mb-0">
            欢迎来到我的数字花园。这里没有喧嚣的算法推荐，只有关于技术、极简生活和光影瞬间的静谧思考。
          </p>
          <div className="flex space-x-4">
             <SocialLink icon={<Github size={18} />} />
             <SocialLink icon={<Twitter size={18} />} />
             <SocialLink icon={<Instagram size={18} />} />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* 左侧：封面故事 (Featured Post) */}
        <div 
          className="lg:col-span-7 group cursor-pointer"
          onClick={() => onPostClick(featuredPost)}
        >
          <div className="relative overflow-hidden aspect-[4/3] mb-6">
            <img 
              src={featuredPost.image} 
              alt={featuredPost.title}
              className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 text-xs tracking-widest font-bold">
              FEATURED
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-3 text-xs font-bold tracking-widest text-stone-400 mb-3">
              <span>{featuredPost.category}</span>
              <span>—</span>
              <span>{featuredPost.date}</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight mb-3 group-hover:text-stone-600 transition-colors">
              {featuredPost.title}
              <span className="block text-lg md:text-xl font-sans font-normal text-stone-500 mt-1">{featuredPost.titleCn}</span>
            </h2>
            <p className="text-stone-500 line-clamp-3 leading-relaxed max-w-xl">
              {featuredPost.excerpt}
            </p>
          </div>
        </div>

        {/* 右侧：极简列表 (Minimal List) */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-12 border-t lg:border-t-0 border-stone-200 pt-12 lg:pt-0">
          <div className="text-xs font-bold tracking-widest text-stone-400 mb-4 hidden lg:block">LATEST STORIES</div>
          {listPosts.map(post => (
            <div 
              key={post.id} 
              className="group cursor-pointer flex flex-col border-b border-stone-100 pb-8 last:border-0"
              onClick={() => onPostClick(post)}
            >
              <div className="flex items-center justify-between text-xs font-bold tracking-widest text-stone-400 mb-2">
                <span>{post.category}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-800"><ArrowRight size={14}/></span>
              </div>
              <h3 className="font-serif text-2xl mb-2 group-hover:translate-x-2 transition-transform duration-300">
                {post.title}
              </h3>
               <p className="text-sm text-stone-500 mb-2">{post.titleCn}</p>
              <div className="text-xs text-stone-300 font-mono">{post.date}</div>
            </div>
          ))}
          
          <div className="pt-8">
            <button className="text-sm font-bold tracking-widest border-b border-black pb-1 hover:text-stone-500 hover:border-stone-500 transition-colors">
              VIEW ARCHIVE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 文章详情页 - 沉浸式阅读
const PostDetail = ({ post, onBack }) => (
  <article className="min-h-screen bg-white">
    {/* 顶部大图 */}
    <div className="h-[50vh] w-full relative">
       <img 
          src={post.image} 
          className="w-full h-full object-cover" 
          alt="cover"
        />
       <div className="absolute inset-0 bg-black/20"></div>
       <button 
        onClick={onBack}
        className="absolute top-8 left-8 text-white flex items-center space-x-2 hover:opacity-80 transition-opacity z-50"
       >
         <ArrowUpRight className="rotate-[-135deg]" size={24} />
         <span className="font-bold tracking-widest text-sm">BACK</span>
       </button>
    </div>

    <div className="max-w-3xl mx-auto px-6 -mt-20 relative z-10">
      <div className="bg-white p-8 md:p-12 shadow-sm border border-stone-100">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-stone-400 block mb-4">{post.category} · {post.date}</span>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">{post.title}</h1>
          <h2 className="text-xl text-stone-500 font-light">{post.titleCn}</h2>
        </div>
        
        <div className="prose prose-stone prose-lg max-w-none first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left">
          {post.content.split('\n').map((p, i) => (
            <p key={i} className="mb-6 leading-loose text-stone-600">{p}</p>
          ))}
        </div>
      </div>
    </div>
    
    <div className="h-32"></div>
  </article>
);

const SocialLink = ({ icon }) => (
  <a href="#" className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-black hover:border-black hover:text-white transition-all duration-300">
    {icon}
  </a>
);

export default function App() {
  const [view, setView] = React.useState('home');
  const [selectedPost, setSelectedPost] = React.useState(null);

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setView('post');
    window.scrollTo(0, 0);
  };

  return (
    <div className="font-sans antialiased selection:bg-stone-200 selection:text-black">
      <Header setView={setView} activeView={view} />
      
      {view === 'home' && (
        <HomeView posts={BLOG_POSTS} onPostClick={handlePostClick} />
      )}

      {view === 'post' && selectedPost && (
        <PostDetail post={selectedPost} onBack={() => setView('home')} />
      )}
      
       {view === 'about' && (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCF8] px-4">
           <div className="max-w-lg text-center">
             <h1 className="font-serif text-4xl mb-6">About Alex.</h1>
             <p className="text-stone-500 leading-relaxed mb-8">
               这里是演示页面。这个设计风格采用了"Editorial Design"（编辑设计）理念，强调字体的层级、大面积的留白以及去网格化的布局。
             </p>
             <button onClick={() => setView('home')} className="text-xs font-bold tracking-widest border-b border-black pb-1">BACK HOME</button>
           </div>
        </div>
      )}
    </div>
  );
}