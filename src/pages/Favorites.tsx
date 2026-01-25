import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Favorites = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container-kanva py-24">
        <h1 className="text-4xl font-heading">Favorites</h1>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
