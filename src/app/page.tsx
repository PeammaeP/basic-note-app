import styles from "./page.module.css";
import "tailwindcss/tailwind.css";
import ApiHandling from "./api/api-handle";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <header className="font-mono text-yellow-50 font-bold text-3xl text-center">
          Notes App ✏️
        </header>
        <section className="text-3xl text-yellow-50 font-semibold p-20">
          <ApiHandling />
        </section>
      </div>
    </main>
  );
}
