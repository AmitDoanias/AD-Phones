import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFab from "@/components/layout/WhatsAppFab";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            AD Phones - תיקון סלולר מקצועי
          </h1>
          <p className="text-slate-500">האתר בבנייה - נחזור בקרוב!</p>
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
