export default function SocialLink({ icon }) {
  return (
    <a
      href="#"
      className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-black hover:border-black hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  );
}
