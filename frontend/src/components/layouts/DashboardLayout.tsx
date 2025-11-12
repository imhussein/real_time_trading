import type { ReactNode } from "react";

type DashboardLayoutProps = {
  sidebar: ReactNode;
  main: ReactNode;
};

export default function DashboardLayout({
  sidebar,
  main,
}: DashboardLayoutProps) {
  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-50 text-gray-900">
      <aside className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-200 bg-white shadow-sm">
        {sidebar}
      </aside>

      <main className="flex-1 p-6 overflow-y-auto bg-white">{main}</main>
    </div>
  );
}
