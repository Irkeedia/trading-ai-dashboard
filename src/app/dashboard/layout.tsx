export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-16 px-4 sm:px-6 md:px-10 lg:px-16 pb-8">
      {children}
    </main>
  );
}
