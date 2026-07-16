import { WaitlistForm } from "@/components/WaitlistForm";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Vocateur</h1>
        <p className="max-w-md text-lg text-zinc-500 dark:text-zinc-400">
          Find the career that actually fits how you think — not another personality quiz.
          <br />
          Coming soon.
        </p>
      </div>
      <WaitlistForm />
    </main>
  );
}
