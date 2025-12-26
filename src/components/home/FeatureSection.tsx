
import { Leaf, Rabbit, Award, Truck } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Natural Formula',
    description: 'Crafted with pure, skin-loving ingredients for ultimate care.',
  },
  {
    icon: Rabbit,
    title: 'Cruelty-Free',
    description: 'Our products are never tested on animals, guaranteed ethical.',
  },
  {
    icon: Award,
    title: 'Expert Approved',
    description: 'Carefully tested to ensure safety and visible results.',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Delivered to your doorstep with no extra costs worldwide.',
  },
];

const FeatureSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container-kanva">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <feature.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-heading mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-heading italic text-foreground mb-8">
            Refresh your skin, love yourself, renew your glow.
          </h2>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md">Cleansers</button>
            <button className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md">Lotions</button>
            <button className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md">Moisturizers</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
