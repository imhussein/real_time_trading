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
    <div
      className="
        grid min-h-dvh bg-gray-50 text-gray-900
        grid-rows-[auto_1fr] lg:grid-rows-1
        lg:grid-cols-[16rem_1fr]
      "
    >
      {/* Sidebar */}
      <aside
        className="
          bg-white border-b lg:border-b-0 lg:border-r border-gray-200 shadow-sm max-h-[40vh] overflow-y-auto lg:max-h-dvh lg:sticky lg:top-0"
      >
        {sidebar}
      </aside>

      {/* Main */}
      <main className=" bg-white overflow-y-auto p-4 sm:p-6 min-h-0">
        {main}
      </main>
    </div>
  );
}
