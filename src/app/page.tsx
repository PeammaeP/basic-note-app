import "tailwindcss/tailwind.css";
import ApiHandling from "./api/apiHandling";

export default function Home() {
  return (
    <main className="min-h-[4000px] w-full flex flex-col justify-between items-center py-24 px-4 bg-[#080808]">
      <header className="font-mono text-yellow-50 font-bold text-3xl text-center">
        Notes App ✏️
      </header>
      <section className="text-3xl text-yellow-50 font-semibold">
        <ApiHandling />
      </section>
    </main>
  );
}
