export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-16 px-4 md:px-8 pb-8 max-w-[1440px] mx-auto">
      {children}
    </main>
  );
}
