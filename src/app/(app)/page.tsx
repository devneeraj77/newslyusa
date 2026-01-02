export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen  w-full  flex-col items-center justify-between py-4 px-16 bg-white dark:bg-black sm:items-start">
        <section className="sm:flex block w-full min-h-screen mx-auto max-w-7xl">
          <div className="basis-3/1  py-12">
          <p className="pl-2 p-1 m-3 border-l-2 border-border w-fit bg-linear-to-r/decreasing from-accent to-transperant" >Best of the week</p>
          </div> 
          <div className="basis-2/2 "></div>
        </section>
      </main>
    </div>
  );
}
