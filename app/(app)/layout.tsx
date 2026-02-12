import { Sidebar, MobileSidebar } from "@/components/Sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="tr-app-shell flex h-screen w-full flex-col overflow-hidden md:flex-row">
      <MobileSidebar />
      <Sidebar />
      <main className="tr-app-main min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
