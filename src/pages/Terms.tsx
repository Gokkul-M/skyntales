import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container-kanva px-5">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <ScrollText className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading mb-4" data-testid="text-terms-title">
                Terms & Conditions
              </h1>
              <p className="text-lg text-muted-foreground">
                Please read these terms carefully before using our website and services.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Last updated: December 10, 2024
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-kanva px-5">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8 md:p-12 prose prose-neutral dark:prose-invert max-w-none">
                  <p>
                    These Terms and Conditions govern the use of Skyntales and any related services. By purchasing or using our product, you agree to the following terms and conditions.
                  </p>

                  <h2 className="font-bold mt-8">1. Product Information</h2>
                  <p>
                    We strive to provide accurate descriptions and representations of our products. However, we do not guarantee that the product images, descriptions, or other content are entirely error-free or completely accurate. Product availability and pricing are subject to change without notice.
                  </p>

                  <h2 className="font-bold mt-8">2. Orders and Payment</h2>
                  <h3>Order Acceptance</h3>
                  <p>
                    Once an order is placed, we reserve the right to accept or reject it at our discretion. You will receive a confirmation email once your order is accepted and processed.
                  </p>
                  <h3>Payment</h3>
                  <p>
                    Payment for the product must be made at the time of purchase. We accept major credit cards, debit cards, and other payment methods as indicated at checkout. All payments are processed securely.
                  </p>
                  <h3>Cancellations</h3>
                  <p>
                    Orders may be canceled before they are shipped. Once the order is shipped, cancellations are not permitted.
                  </p>

                  <h2 className="font-bold mt-8">3. Shipping and Delivery</h2>
                  <h3>Shipping</h3>
                  <p>
                    We will ship your order to the address you provide at checkout. Delivery times vary based on your location and shipping method selected. Any delivery dates provided are estimates only.
                  </p>
                  <h3>Delays</h3>
                  <p>
                    We are not responsible for delays caused by shipping carriers or factors beyond our control.
                  </p>
                  <h3>International Shipping</h3>
                  <p>
                    If applicable, customers are responsible for any customs duties or taxes associated with international shipments.
                  </p>

                  <h2 className="font-bold mt-8">4. Returns and Refunds</h2>
                  <h3>Return Policy</h3>
                  <p>
                    If you are not satisfied with your product, you may return it within 7 working days of delivery for a refund or exchange. Items must be unused, in their original packaging, and accompanied by proof of purchase.
                  </p>
                  <h3>Refunds</h3>
                  <p>
                    Refunds will be processed to the original payment method once the returned item is received and inspected. Shipping costs are non-refundable.
                  </p>
                  <h3>Exclusions</h3>
                  <p>
                    Certain products (e.g., personalized, perishable, or clearance items) may not be eligible for returns. Please check our return policy for full details.
                  </p>

                  <h2 className="font-bold mt-8">5. Use of Product</h2>
                  <p>
                    The product is intended for specific use. You agree to use the product only as instructed and in accordance with all applicable laws and regulations.
                  </p>
                  <p>
                    We are not responsible for any injuries, damages, or losses resulting from the misuse of the product.
                  </p>

                  <h2 className="font-bold mt-8">6. Limitation of Liability</h2>
                  <p>
                    To the fullest extent permitted by law, Skyntales is not liable for any indirect, incidental, or consequential damages arising from the use of or inability to use the product, even if we have been advised of the possibility of such damages.
                  </p>
                  <p>
                    Our liability for any claim related to the product is limited to the amount you paid for the product.
                  </p>

                  <h2 className="font-bold mt-8">7. Intellectual Property</h2>
                  <p>
                    All intellectual property rights, including trademarks, logos, designs, and content, related to the product are owned by Skyntales and are protected by applicable copyright and intellectual property laws. You may not use, reproduce, or distribute our intellectual property without our express written permission.
                  </p>

                  <h2 className="font-bold mt-8">8. Changes to Terms</h2>
                  <p>
                    We reserve the right to update or modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on our website. Your continued use of the product after such changes constitutes your acceptance of the new terms.
                  </p>

                  <h2 className="font-bold mt-8">9. Contact Us</h2>
                  <p>
                    If you have any questions or concerns about these Terms and Conditions, please contact us at:
                  </p>
                  <ul>
                    <li>By email: info@skyntales.com</li>
                  </ul>
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

export default Terms;