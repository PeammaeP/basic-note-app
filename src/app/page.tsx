import styles from "./page.module.css";
import "tailwindcss/tailwind.css";
import ApiHandling from "./api/apiHandling";

export default function Home() {
  return (
    <main className={styles.main} min-h-screen="true" w-full="true">
      <header className="font-mono text-yellow-50 font-bold text-3xl text-center">
        Notes App ✏️
      </header>
      <section className="text-3xl text-yellow-50 font-semibold">
        <ApiHandling />
      </section>
    </main>
  );
}
