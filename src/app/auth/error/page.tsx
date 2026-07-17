export default function AuthErrorPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">That link didn&rsquo;t work</h1>
      <p className="max-w-md text-zinc-500">
        It may have expired or already been used. Head back and request a new one.
      </p>
    </main>
  );
}
