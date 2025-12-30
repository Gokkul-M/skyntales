import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Twitter,
  ArrowUpRight,
  Shield,
  ScrollText,
  Cookie,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const Footer = () => {
  const footerRef = useRef(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [cookiesOpen, setCookiesOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
        }
      },
      { threshold: 0.1 },
    );

    if (footerRef.current) observer.observe(footerRef.current);

    return () => observer.disconnect();
  }, []);

  const footerLinks = {
    pages: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Shop", href: "/shop" },
      { label: "Blog", href: "/blog" },
    ],
    categories: [
      { label: "All Products", href: "/shop" },
      { label: "Cleansers", href: "/shop/cleansers" },
      { label: "Lotions", href: "/shop/lotions" },
      { label: "Moisturizers", href: "/shop/moisturizers" },
    ],
    support: [
      { label: "Contact", href: "/contact" },
      { label: "FAQs", href: "/faq" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Return & Cancellation", href: "/returns" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
    account: [
      { label: "Favorites", href: "/favorites" },
      { label: "My Account", href: "/account" },
    ],
  };

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://www.instagram.com/skyntales/",
      label: "Instagram",
    },
    {
      icon: Facebook,
      href: " https://www.facebook.com/skyntales/",
      label: "Facebook",
    },
  ];

  const paymentMethods = ["Apple Pay", "Stripe", "Visa", "G Pay"];

  return (
    <footer
      ref={footerRef}
      className="bg-primary text-primary-foreground overflow-hidden
      opacity-0 translate-y-20 transition-all duration-700"
    >
      <div className="container-kanva py-10 sm:py-16 px-4 sm:px-5">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="col-span-2 sm:col-span-2 lg:col-span-4">
            <Link
              to="/"
              className="inline-block text-xl sm:text-2xl font-heading mb-4 sm:mb-6 hover:opacity-80 transition"
            >
              Skyntales
            </Link>

            <p className="text-primary-foreground/60 mb-6 sm:mb-8 max-w-sm leading-relaxed text-xs sm:text-sm">
              Combining nature and science, we create skincare that nurtures
              your skin and respects the planet. Healthy, radiant skin starts
              here.
            </p>

            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2.5 sm:p-3 bg-primary-foreground/10 hover:bg-primary-foreground/20 
                  rounded-full transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <FooterColumn title="Pages" links={footerLinks.pages} />
          </div>

          <div className="col-span-1 lg:col-span-2">
            <FooterColumn title="Categories" links={footerLinks.categories} />
            <div className="mt-6 sm:mt-8">
              <FooterColumn title="Account" links={footerLinks.account} />
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <FooterColumn title="Support" links={footerLinks.support} />
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-primary-foreground/40 mb-3 sm:mb-5">
              Get in Touch
            </h4>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <InfoBlock label="Email" value="care@skyntales.com" />
              <InfoBlock label="Phone" value="+1 (555) 123-4567" />
              <InfoBlock
                label="Address"
                value={
                  <>
                    EKOROOTS Ventures LLP, 7th Floor, Block No. 75, Amarasi
                    Towers, 455, Anna Salai, <br />
                    Chennai - 600018.
                  </>
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-kanva py-6 px-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
            <p className="text-primary-foreground/40 text-xs">
              © 2025 Skyntales. All rights reserved.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-xs">
              <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
                <DialogTrigger asChild>
                  <button
                    className="footer-bottom-link cursor-pointer bg-transparent border-none"
                    data-testid="button-privacy-popup"
                  >
                    Privacy
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <Shield className="h-5 w-5 text-primary" />
                      Privacy Policy
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-muted-foreground text-sm mb-4">
                        Last updated: December 10, 2024
                      </p>

                      <h3 className="mt-6">Privacy Policy</h3>
                      <p>
                        This Privacy Policy explains how Skyntales (“Site,”
                        “we,” “us,” or “our”) collects, uses, and shares your
                        personal information when you visit our website, use our
                        services, make purchases from skyntales.com (the
                        “Site”), or interact with us in any other way
                        (collectively referred to as the “Services”). In this
                        Privacy Policy, “you” and “your” refer to any individual
                        using our Services, whether as a customer, website
                        visitor, or any other individual whose information we
                        collect in accordance with this policy.
                      </p>
                      <p>
                        Please review this Privacy Policy carefully. By
                        accessing or using any of our Services, you consent to
                        the collection, use, and sharing of your information as
                        outlined here. If you do not agree with these terms,
                        please refrain from using our Services.
                      </p>

                      <h3 className="mt-6">
                        1. Modifications to This Privacy Statement
                      </h3>
                      <p>
                        This Privacy Policy may be updated from time to time for
                        operational, legal, or regulatory purposes, as well as
                        to reflect changes to our practices. We will amend the
                        “Last updated” date, display the updated Privacy Policy
                        on the Site, and take any other actions mandated by the
                        relevant laws.
                      </p>

                      <h3 className="mt-6">
                        2. How We Gather and Utilise Your Personal Data
                      </h3>
                      <p>
                        In order to deliver the Services, we gather and have
                        gathered personal data about you from a number of
                        sources within the last 12 months. Depending on your
                        interactions with us, different information is gathered
                        and used. We may use the information we collect for
                        communicating with you, delivering the Services,
                        fulfilling legal obligations, enforcing applicable
                        terms, and protecting our rights and users.
                      </p>

                      <h3 className="mt-6">3. The Personal Data We Gather</h3>
                      <p>
                        The kinds of personal data we collect about you depend
                        on your interactions with our Site and Services.
                        “Personal information” includes any data that
                        identifies, relates to, describes, or can be associated
                        with you.
                      </p>

                      <h3 className="mt-6">
                        4. Information Directly Collected from You
                      </h3>
                      <p>
                        Your direct submission of information to us may include:
                      </p>
                      <ul>
                        <li>Name, phone number, email address, and address</li>
                        <li>
                          Order details such as billing address, shipping
                          address, payment confirmation, email, and phone number
                        </li>
                        <li>
                          Account details such as password, security questions,
                          and username
                        </li>
                        <li>
                          Purchase activity including viewed products, cart
                          items, and wish list activity
                        </li>
                        <li>
                          Customer service information you choose to provide
                          when contacting us
                        </li>
                      </ul>
                      <p>
                        Some features may require you to provide specific
                        personal information. You may choose not to provide it,
                        but doing so may limit your ability to use those
                        features.
                      </p>

                      <h3 className="mt-6">
                        5. Data That We Gather Using Cookies
                      </h3>
                      <p>
                        We automatically collect certain usage data through
                        cookies, pixels, and similar technologies. Usage Data
                        may include your device details, browser information, IP
                        address, network connection, and interactions with our
                        Site and Services.
                      </p>

                      <h3 className="mt-6">
                        6. Data That We Acquire from Outside Sources
                      </h3>
                      <p>
                        Third parties may provide us with your information,
                        including vendors and service providers who collect data
                        on our behalf. Examples include:
                      </p>
                      <ul>
                        <li>
                          Payment processors that collect payment details such
                          as credit card information and billing address to
                          complete your transactions
                        </li>
                        <li>
                          Third parties using tracking technologies (cookies,
                          web beacons, SDKs) when you interact with our Site,
                          emails, or ads
                        </li>
                      </ul>
                      <p>
                        We handle third-party information according to this
                        Privacy Policy. We are not responsible for the accuracy
                        or practices of third parties.
                      </p>

                      <h3 className="mt-6">7. How We Utilise Personal Data</h3>

                      <h4 className="mt-4">Deliver Goods and Services</h4>
                      <p>
                        We use personal information to fulfil orders, process
                        payments, manage accounts, provide notifications, assist
                        with returns or exchanges, support account management,
                        and enable product reviews.
                      </p>

                      <h4 className="mt-4">Marketing and Advertising</h4>
                      <p>
                        We may send promotional communications via email, text,
                        or mail and show you personalised ads based on your
                        data.
                      </p>

                      <h4 className="mt-4">
                        Protection Against Fraud and Security
                      </h4>
                      <p>
                        We use personal information to detect and respond to
                        fraudulent or harmful behaviour. You are responsible for
                        keeping your account credentials secure.
                      </p>

                      <h4 className="mt-4">Communicating with You</h4>
                      <p>
                        We use your information to communicate with you, provide
                        customer service, and improve the quality of our
                        Services.
                      </p>

                      <h3 className="mt-6">
                        8. Cookies and Tracking Technologies
                      </h3>
                      <p>
                        Our product and website may use cookies and other
                        tracking tools to improve user experience and monitor
                        usage. Disabling cookies may affect certain
                        functionalities.
                      </p>

                      <h3 className="mt-6">9. Data Security</h3>
                      <p>
                        We apply appropriate technical and organisational
                        security measures to protect your personal information.
                        However, no system is completely secure, and we cannot
                        guarantee absolute security.
                      </p>

                      <h3 className="mt-6">10. Your Rights and Choices</h3>
                      <p>You have the right to:</p>
                      <ul>
                        <li>
                          Access, update, or delete your personal information
                        </li>
                        <li>Opt out of marketing communications</li>
                        <li>Request limitations on data processing</li>
                        <li>
                          Lodge a complaint with a data protection authority
                        </li>
                      </ul>

                      <h3 className="mt-6">11. Retention of Information</h3>
                      <p>
                        We retain your personal information as long as necessary
                        to fulfil outlined purposes, comply with legal
                        requirements, resolve disputes, and enforce agreements.
                      </p>

                      <h3 className="mt-6">12. Complaints</h3>
                      <p>
                        If you have complaints regarding how we process your
                        data, you may contact us using the details provided
                        below. If you are not satisfied with our response, you
                        may have the right to escalate your complaint to your
                        local data protection authority.
                      </p>

                      <h3 className="mt-6">13. International Users</h3>
                      <p>
                        Your personal information may be transferred, stored,
                        and processed outside your country, including in the
                        United States, by our staff and third-party service
                        providers.
                      </p>

                      <h3 className="mt-6">
                        14. Changes to This Privacy Policy
                      </h3>
                      <p>
                        We may update this Privacy Policy from time to time.
                        Changes will be posted on this page, and if necessary,
                        we will notify you through email or other communication
                        methods.
                      </p>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
                <DialogTrigger asChild>
                  <button
                    className="footer-bottom-link cursor-pointer bg-transparent border-none"
                    data-testid="button-terms-popup"
                  >
                    Terms
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <ScrollText className="h-5 w-5 text-primary" />
                      Terms of Service
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-muted-foreground text-sm mb-4">
                        Last updated: December 10, 2024
                      </p>

                      <h3 className="mt-6">Terms and Conditions</h3>
                      <p>
                        These Terms and Conditions govern the use of [Your
                        Product Name] and any related services. By purchasing or
                        using our product, you agree to the following terms and
                        conditions.
                      </p>

                      <h3 className="mt-6">1. Product Information</h3>
                      <p>
                        We strive to provide accurate descriptions and
                        representations of our products. However, we do not
                        guarantee that the product images, descriptions, or
                        other content are entirely error-free or completely
                        accurate. Product availability and pricing are subject
                        to change without notice.
                      </p>

                      <h3 className="mt-6">2. Orders and Payment</h3>
                      <h4 className="mt-4">Order Acceptance</h4>
                      <p>
                        Once an order is placed, we reserve the right to accept
                        or reject it at our discretion. You will receive a
                        confirmation email once your order is accepted and
                        processed.
                      </p>

                      <h4 className="mt-4">Payment</h4>
                      <p>
                        Payment for the product must be made at the time of
                        purchase. We accept major credit cards, debit cards, and
                        other payment methods as indicated at checkout. All
                        payments are processed securely.
                      </p>

                      <h4 className="mt-4">Cancellations</h4>
                      <p>
                        Orders may be canceled before they are shipped. Once the
                        order is shipped, cancellations are not permitted.
                      </p>

                      <h3 className="mt-6">3. Shipping and Delivery</h3>
                      <h4 className="mt-4">Shipping</h4>
                      <p>
                        We will ship your order to the address you provide at
                        checkout. Delivery times vary based on your location and
                        shipping method selected. Any delivery dates provided
                        are estimates only.
                      </p>

                      <h4 className="mt-4">Delays</h4>
                      <p>
                        We are not responsible for delays caused by shipping
                        carriers or factors beyond our control.
                      </p>

                      <h4 className="mt-4">International Shipping</h4>
                      <p>
                        If applicable, customers are responsible for any customs
                        duties or taxes associated with international shipments.
                      </p>

                      <h3 className="mt-6">4. Returns and Refunds</h3>
                      <h4 className="mt-4">Return Policy</h4>
                      <p>
                        If you are not satisfied with your product, you may
                        return it within 7 working days of delivery for a refund
                        or exchange. Items must be unused, in their original
                        packaging, and accompanied by proof of purchase.
                      </p>

                      <h4 className="mt-4">Refunds</h4>
                      <p>
                        Refunds will be processed to the original payment method
                        once the returned item is received and inspected.
                        Shipping costs are non-refundable.
                      </p>

                      <h4 className="mt-4">Exclusions</h4>
                      <p>
                        Certain products (e.g., personalized, perishable, or
                        clearance items) may not be eligible for returns. Please
                        check our return policy for full details.
                      </p>

                      <h3 className="mt-6">5. Use of Product</h3>
                      <p>
                        The product is intended for specific use. You agree to
                        use the product only as instructed and in accordance
                        with all applicable laws and regulations.
                      </p>
                      <p>
                        We are not responsible for any injuries, damages, or
                        losses resulting from the misuse of the product.
                      </p>

                      <h3 className="mt-6">6. Limitation of Liability</h3>
                      <p>
                        To the fullest extent permitted by law, Skyntales is not
                        liable for any indirect, incidental, or consequential
                        damages arising from the use of or inability to use the
                        product, even if we have been advised of the possibility
                        of such damages.
                      </p>
                      <p>
                        Our liability for any claim related to the product is
                        limited to the amount you paid for the product.
                      </p>

                      <h3 className="mt-6">7. Intellectual Property</h3>
                      <p>
                        All intellectual property rights, including trademarks,
                        logos, designs, and content, related to the product are
                        owned by Skyntales and are protected by applicable
                        copyright and intellectual property laws. You may not
                        use, reproduce, or distribute our intellectual property
                        without our express written permission.
                      </p>

                      <h3 className="mt-6">8. Changes to Terms</h3>
                      <p>
                        We reserve the right to update or modify these Terms and
                        Conditions at any time. Any changes will be effective
                        immediately upon posting on our website. Your continued
                        use of the product after such changes constitutes your
                        acceptance of the new terms.
                      </p>

                      <h3 className="mt-6">9. Contact Us</h3>
                      <p>
                        If you have any questions or concerns about these Terms
                        and Conditions, please contact us at: info@skyntales.com
                      </p>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Dialog open={cookiesOpen} onOpenChange={setCookiesOpen}>
                <DialogTrigger asChild>
                  <button
                    className="footer-bottom-link cursor-pointer bg-transparent border-none"
                    data-testid="button-cookies-popup"
                  >
                    Shipping Policy
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                      <Cookie className="h-5 w-5 text-primary" />
                      Shipping Policy
                    </DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <p className="text-muted-foreground text-sm mb-4">
                        Effective Date: 24/9/2024
                      </p>

                      <h3 className="mt-6">Shipping Policy for Skyntales</h3>
                      <p>
                        At Skyntales, we are committed to ensuring a smooth and
                        timely delivery of your purchases. Please read our
                        Shipping Policy to understand how we handle shipping,
                        delivery times, and other related details.
                      </p>

                      <h3 className="mt-6">1. Processing Time</h3>
                      <p>
                        All orders are processed within 5-7 business days.
                        Orders placed on weekends or holidays will be processed
                        on the next business day.
                      </p>
                      <p>
                        You will receive a confirmation email once your order
                        has been shipped, including tracking information, if
                        applicable.
                      </p>

                      <h3 className="mt-6">
                        2. Shipping Rates and Delivery Estimates
                      </h3>
                      <p>
                        Shipping costs are calculated at checkout based on your
                        location and the weight of your order.
                      </p>
                      <p>Estimated delivery times:</p>
                      <ul>
                        <li>Domestic Shipping: 5-7 business days.</li>
                        <li>International Shipping: 10-15 business days.</li>
                      </ul>
                      <p>
                        Please note that delivery times are estimates and may
                        vary depending on your location and shipping carrier
                        delays, which are outside our control.
                      </p>

                      <h3 className="mt-6">3. Shipping Methods</h3>
                      <p>
                        We offer several shipping options to meet your needs,
                        including standard and expedited services. During
                        checkout, you will be able to select your preferred
                        shipping method.
                      </p>

                      <h3 className="mt-6">4. Order Tracking</h3>
                      <p>
                        Once your order has been shipped, you will receive a
                        tracking number via email. You can use this number to
                        track your package’s progress through the carrier’s
                        website.
                      </p>

                      <h3 className="mt-6">5. Shipping Locations</h3>

                      <h4 className="mt-4">Domestic Shipping</h4>
                      <p>We currently ship across all states.</p>

                      <h4 className="mt-4">International Shipping</h4>
                      <p>
                        We also ship to selected international destinations.
                        Please note that customs fees, taxes, or import duties
                        may apply to international orders and are the
                        responsibility of the customer.
                      </p>

                      <h3 className="mt-6">6. Shipping Delays</h3>
                      <p>
                        While we strive to ensure timely deliveries, there may
                        be delays due to unforeseen circumstances such as
                        weather, carrier issues, or customs processing for
                        international orders. Skyntales is not responsible for
                        delays caused by third-party carriers.
                      </p>

                      <h3 className="mt-6">
                        7. Damaged, Lost, or Stolen Packages
                      </h3>
                      <p>
                        If your order arrives damaged, please contact us within
                        3 days of receiving the product, along with photos of
                        the damage.
                      </p>
                      <p>
                        For lost or stolen packages, we will assist in filing a
                        claim with the carrier but cannot be held responsible
                        for packages marked as delivered by the carrier.
                      </p>

                      <h3 className="mt-6">
                        8. Incorrect Shipping Information
                      </h3>
                      <p>
                        Please ensure that your shipping details are accurate
                        when placing an order. Skyntales is not responsible for
                        delayed or failed deliveries due to incorrect or
                        incomplete shipping addresses.
                      </p>

                      <h3 className="mt-6">9. Contact Us</h3>
                      <p>
                        If you have any questions regarding this Shipping Policy
                        or need assistance, please contact us at:
                        info@skyntales.com
                      </p>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <>
    <h4 className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/40 mb-5">
      {title}
    </h4>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.href}
            className="text-primary-foreground/70 hover:text-primary-foreground 
            transition-colors text-sm flex items-center gap-1 group"
          >
            {link.label}
            <ArrowUpRight
              className="h-3 w-3 opacity-0 -translate-x-1 
              group-hover:opacity-100 group-hover:translate-x-0 transition-all"
            />
          </Link>
        </li>
      ))}
    </ul>
  </>
);

const InfoBlock = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <p className="text-primary-foreground/70">
    <span className="block text-primary-foreground/40 text-xs mb-1">
      {label}
    </span>
    {value}
  </p>
);

export default Footer;
