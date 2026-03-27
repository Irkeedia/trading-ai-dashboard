import { BackendStatusBanner } from "@/components/backend-status";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="pt-[5.25rem] px-4 sm:px-6 md:px-8 lg:px-12 pb-14 min-h-screen">
      <div className="mx-auto max-w-[1600px] w-full">
        <BackendStatusBanner />
        {children}
      </div>
    </main>
  );
}
