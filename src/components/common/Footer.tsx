import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/skyntales/" },
  { icon: Facebook, href: "https://www.facebook.com/skyntales/" },
];

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-heading mb-4">Essential</h3>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Natural skincare for a healthy, radiant glow. Vegan, cruelty-free,
              and eco-friendly.
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-sm hover:underline">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/shop" className="text-sm hover:underline">
                    Shop
                  </a>
                </li>
                <li>
                  <a href="/about" className="text-sm hover:underline">
                    About
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-sm hover:underline">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <link.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded-md bg-primary-foreground/10 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="bg-accent text-accent-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/90 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>
            &copy; {new Date().getFullYear()} Essential. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
