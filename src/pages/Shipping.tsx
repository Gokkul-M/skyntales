import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  Clock,
  Globe,
  Package,
  CheckCircle,
  MapPin,
} from "lucide-react";

const shippingOptions = [
  {
    name: "Standard Shipping",
    price: "Calculated at checkout",
    time: "5-7 business days",
    description: "Our standard domestic shipping option",
    badge: "Most Popular",
  },
  {
    name: "Expedited Shipping",
    price: "Calculated at checkout",
    time: "Faster delivery",
    description: "Need it fast? Choose expedited service at checkout",
  },
  {
    name: "International Shipping",
    price: "Calculated at checkout",
    time: "10-15 business days",
    description: "We ship to selected international destinations",
  },
];

const Shipping = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container-kanva px-5">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h1
                className="text-4xl md:text-5xl font-heading mb-4"
                data-testid="text-shipping-title"
              >
                Shipping & Delivery
              </h1>
              <p className="text-lg text-muted-foreground">
                Fast, reliable shipping to get your skincare essentials to your
                door.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-kanva px-5">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-heading mb-8 text-center">
                Shipping Options
              </h2>
              <div className="grid gap-4 md:grid-cols-3 mb-16">
                {shippingOptions.map((option, index) => (
                  <Card key={index} className="relative">
                    {option.badge && (
                      <Badge className="absolute -top-2 right-4">
                        {option.badge}
                      </Badge>
                    )}
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{option.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary mb-1">
                        {option.price}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                        <Clock className="h-4 w-4" />
                        {option.time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-heading">Order Processing</h2>
                  </div>
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-muted-foreground">
                        All orders are processed within 5-7 business days.
                        Orders placed on weekends or holidays will be processed
                        on the next business day.
                      </p>
                      <div className="flex items-start gap-2 p-4 bg-muted/50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <p className="text-sm">
                          You will receive a confirmation email once your order
                          has been shipped, including tracking information, if
                          applicable.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-heading">
                      International Shipping
                    </h2>
                  </div>
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-muted-foreground">
                        We ship to selected international destinations. Shipping
                        costs are calculated at checkout based on your location
                        and the weight of your order.
                      </p>
                      <p className="text-muted-foreground">
                        Please note that customs fees, taxes, or import duties
                        may apply to international orders and are the
                        responsibility of the customer.
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Estimated delivery times:
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li className="flex justify-between">
                            <span>Domestic Shipping</span>
                            <span>5-7 business days</span>
                          </li>
                          <li className="flex justify-between">
                            <span>International Shipping</span>
                            <span>10-15 business days</span>
                          </li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2">
                          Delivery times are estimates and may vary depending on
                          location and carrier delays.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-heading">Delivery Information</h2>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="font-medium mb-2">Order Tracking</h3>
                        <p className="text-sm text-muted-foreground">
                          Once your order has been shipped, you will receive a
                          tracking number via email. You can use this number to
                          track your package's progress through the carrier's
                          website.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Shipping Delays</h3>
                        <p className="text-sm text-muted-foreground">
                          While we strive to ensure timely deliveries, there may
                          be delays due to unforeseen circumstances such as
                          weather, carrier issues, or customs processing.
                          Skyntales is not responsible for delays caused by
                          third-party carriers.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">
                          Damaged, Lost, or Stolen Packages
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          If your order arrives damaged, please contact us
                          within 3 days of receiving the product, along with
                          photos of the damage. For lost or stolen packages, we
                          will assist in filing a claim with the carrier.
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">
                          Incorrect Shipping Information
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Please ensure that your shipping details are accurate
                          when placing an order. Skyntales is not responsible
                          for delayed or failed deliveries due to incorrect or
                          incomplete shipping addresses.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Shipping;
