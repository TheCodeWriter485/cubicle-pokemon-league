import Header from './header'


export default function Home() {
  return (
    <div className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className=" min-h-screen w-full max-w-3xl items-center justify-between py-10 px-16 bg-white dark:bg-black sm:items-start">
        <div className="mx-auto items-center text-center sm:items-start sm:text-left">
          <h1 className="text-5xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to the Cubicle Pokemon League!
          </h1>
        </div>
      </main>
    </div>
  );
}
