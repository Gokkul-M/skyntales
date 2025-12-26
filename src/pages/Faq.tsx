import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HelpCircle, Package, CreditCard, Truck, RefreshCw, Leaf, Mail } from "lucide-react";

const faqCategories = [
  {
    title: "Orders & Shopping",
    icon: Package,
    questions: [
      {
        q: "How do I place an order?",
        a: "Simply browse our products, add items to your cart, and proceed to checkout. You can create an account for a faster checkout experience or checkout as a guest. We accept all major credit cards and secure payment methods."
      },
      {
        q: "Can I modify or cancel my order?",
        a: "Orders can be modified or cancelled within 1 hour of placement. After this window, orders enter processing and cannot be changed. Please contact our support team immediately if you need to make changes."
      },
      {
        q: "How can I track my order?",
        a: "Once your order ships, you'll receive a confirmation email with tracking information. You can also log into your account and view your order status in the 'Orders' section."
      },
      {
        q: "Do you offer gift wrapping?",
        a: "Yes! We offer complimentary gift wrapping on all orders. Simply select the gift wrap option at checkout and include a personalized message for the recipient."
      }
    ]
  },
  {
    title: "Payment & Security",
    icon: CreditCard,
    questions: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, and PayPal. All transactions are secured with SSL encryption for your protection."
      },
      {
        q: "Is my payment information secure?",
        a: "Absolutely. We use industry-standard SSL encryption and never store your complete credit card details. Our payment processing is PCI-DSS compliant."
      },
      {
        q: "When will I be charged?",
        a: "Your payment is processed immediately upon order confirmation. If an item is out of stock, you will be notified and given the option to wait or receive a refund."
      },
      {
        q: "Do you offer payment plans?",
        a: "We partner with Klarna and Afterpay to offer flexible payment options. You can split your purchase into 4 interest-free payments at checkout."
      }
    ]
  },
  {
    title: "Shipping & Delivery",
    icon: Truck,
    questions: [
      {
        q: "How long does shipping take?",
        a: "Standard shipping takes 3-5 business days within the US. Express shipping (1-2 business days) is available for an additional fee. International shipping typically takes 7-14 business days."
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! We offer free standard shipping on all orders over $50 within the continental United States. Orders under $50 have a flat shipping rate of $5.99."
      },
      {
        q: "Do you ship internationally?",
        a: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location and are calculated at checkout."
      },
      {
        q: "What if my package is lost or damaged?",
        a: "We insure all shipments. If your package is lost or arrives damaged, please contact us within 48 hours of expected delivery and we'll send a replacement or issue a full refund."
      }
    ]
  },
  {
    title: "Returns & Exchanges",
    icon: RefreshCw,
    questions: [
      {
        q: "What is your return policy?",
        a: "We offer a 30-day satisfaction guarantee. If you're not completely happy with your purchase, return it within 30 days for a full refund or exchange. Products must be unused and in original packaging."
      },
      {
        q: "How do I initiate a return?",
        a: "Log into your account, go to 'Orders', select the order, and click 'Return Items'. You'll receive a prepaid shipping label via email. Pack the items securely and drop off at any carrier location."
      },
      {
        q: "How long do refunds take?",
        a: "Once we receive your return, refunds are processed within 3-5 business days. The refund will appear on your original payment method within 5-10 business days depending on your bank."
      },
      {
        q: "Can I exchange for a different product?",
        a: "Yes! During the return process, you can select 'Exchange' and choose a different product. If there's a price difference, you'll be charged or refunded accordingly."
      }
    ]
  },
  {
    title: "Products & Ingredients",
    icon: Leaf,
    questions: [
      {
        q: "Are your products cruelty-free?",
        a: "Yes, all Kanva products are 100% cruelty-free and never tested on animals. We're certified by Leaping Bunny and PETA."
      },
      {
        q: "Are your products suitable for sensitive skin?",
        a: "Most of our products are formulated for sensitive skin. We recommend checking individual product descriptions and ingredient lists. Our 'Gentle' collection is specifically designed for sensitive skin types."
      },
      {
        q: "How should I store my skincare products?",
        a: "Store products in a cool, dry place away from direct sunlight. Some products with active ingredients like Vitamin C should be refrigerated for optimal potency."
      },
      {
        q: "What is the shelf life of your products?",
        a: "Our products have a shelf life of 12-24 months unopened. Once opened, most products should be used within 6-12 months. Check the PAO (Period After Opening) symbol on each product."
      }
    ]
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container-kanva px-5">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading mb-4" data-testid="text-faq-title">
                Frequently Asked Questions
              </h1>
              <p className="text-lg text-muted-foreground">
                Find answers to common questions about shopping, shipping, returns, and our products.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-kanva px-5">
            <div className="max-w-4xl mx-auto space-y-12">
              {faqCategories.map((category, index) => (
                <div key={index}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-2xl font-heading">{category.title}</h2>
                  </div>
                  <Card>
                    <CardContent className="p-0">
                      <Accordion type="single" collapsible className="w-full">
                        {category.questions.map((item, qIndex) => (
                          <AccordionItem 
                            key={qIndex} 
                            value={`${index}-${qIndex}`}
                            className="border-b last:border-0"
                          >
                            <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted/50">
                              <span className="font-medium">{item.q}</span>
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-4 text-muted-foreground">
                              {item.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <div className="max-w-4xl mx-auto mt-16">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-8 text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-heading mb-2">Still have questions?</h3>
                  <p className="text-primary-foreground/80 mb-6">
                    Our customer support team is here to help you with any questions or concerns.
                  </p>
                  <Button variant="secondary" asChild>
                    <Link to="/contact" data-testid="link-contact">Contact Us</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
