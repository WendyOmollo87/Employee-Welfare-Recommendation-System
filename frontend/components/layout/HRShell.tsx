import HRSidebar from "./HRSidebar";

export default function HRShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <HRSidebar />
      <div className="ml-[250px] flex-1 min-h-screen">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}