import Sidebar from "./Sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-[250px] flex-1 min-h-screen">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}