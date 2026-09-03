export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col w-full pb-16 bg-white">{children}</main>
    </div>
  );
}
