import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar />
      <Sidebar />
      <main className="pt-14 lg:pl-60 xl:pl-64 min-h-screen">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}
