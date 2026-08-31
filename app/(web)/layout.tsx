import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Socials from '@/components/Socials';

export default function WebLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col w-full pb-16 bg-white">{children}</main>
      <Footer />
      <Socials />
    </div>
  );
}
