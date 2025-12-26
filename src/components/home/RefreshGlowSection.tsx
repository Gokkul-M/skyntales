import skinCloseup from '@/assets/skin-closeup.jpg';
import ecoProduct from '@/assets/eco-product.jpg';
import { Leaf } from 'lucide-react';

const RefreshGlowSection = () => {
  return (
    <section className="py-24 bg-[#F8F5F1]">
      <div className="container mx-auto px-4">
        <p className="text-center text-5xl lg:text-6xl font-serif text-stone-800 leading-relaxed">
          <span>Refresh your skin, </span>
          <span className="inline-block relative w-24 h-24 -rotate-6 align-middle mx-2">
            <img
              src={skinCloseup}
              alt="Skin closeup"
              className="rounded-xl object-cover w-full h-full border-4 border-white shadow-lg"
            />
          </span>
          <span>love yourself, </span>
          <span className="inline-block relative w-24 h-24 rotate-6 align-middle mx-2">
            <img
              src={ecoProduct}
              alt="Eco product"
              className="rounded-xl object-cover w-full h-full border-4 border-white shadow-lg"
            />
          </span>
          <br />
          <span>renew your glow.</span>
          <span className="inline-block text-green-600/50 rotate-12 align-bottom ml-1">
             <Leaf className="w-20 h-20" strokeWidth={1} />
          </span>
        </p>
      </div>
    </section>
  );
};

export default RefreshGlowSection;
