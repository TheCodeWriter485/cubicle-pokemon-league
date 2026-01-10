import Header from './header'


export default function Home() {
  return (
    <div className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-10  bg-white dark:bg-black sm:items-start mx-auto my-20">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="text-5xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to the Cubicle Pokemon League!
          </h1>
        </div>
      </main>
    </div>
  );
}
