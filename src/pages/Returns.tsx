import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { RefreshCw, Package, Clock, CheckCircle, XCircle, AlertCircle, ArrowRight } from "lucide-react";

const returnSteps = [
  {
    step: 1,
    title: "Initiate Return",
    description: "Log into your account, go to 'Orders', and select the items you wish to return."
  },
  {
    step: 2,
    title: "Print Label",
    description: "We'll email you a prepaid shipping label. Print it and attach it to your package."
  },
  {
    step: 3,
    title: "Ship It Back",
    description: "Drop off your package at any authorized carrier location."
  },
  {
    step: 4,
    title: "Get Refunded",
    description: "Once received, your refund will be processed within 3-5 business days."
  }
];

const Returns = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container-kanva px-5">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <RefreshCw className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading mb-4" data-testid="text-returns-title">
                Orders & Returns
              </h1>
              <p className="text-lg text-muted-foreground">
                Easy returns and hassle-free exchanges. Your satisfaction is our priority.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container-kanva px-5">
            <div className="max-w-4xl mx-auto">
              <Card className="mb-12 border-primary/20 bg-primary/5">
                <CardContent className="p-8 text-center">
                  <h2 className="text-3xl font-heading mb-2">30-Day Satisfaction Guarantee</h2>
                  <p className="text-lg text-muted-foreground">
                    Not happy with your purchase? Return it within 30 days for a full refund, no questions asked.
                  </p>
                </CardContent>
              </Card>

              <h2 className="text-2xl font-heading mb-8 text-center">How Returns Work</h2>
              <div className="grid gap-4 md:grid-cols-4 mb-16">
                {returnSteps.map((item, index) => (
                  <div key={index} className="relative">
                    <Card className="h-full">
                      <CardContent className="p-6 text-center">
                        <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                          {item.step}
                        </div>
                        <h3 className="font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                    {index < returnSteps.length - 1 && (
                      <ArrowRight className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>

              <div className="grid gap-8 md:grid-cols-2 mb-12">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-xl font-heading">Eligible for Return</h2>
                  </div>
                  <Card>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Unopened products in original packaging</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Items purchased within the last 30 days</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Defective or damaged products (within 90 days)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Wrong items received</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Gift sets (if sealed)</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-xl font-heading">Not Eligible for Return</h2>
                  </div>
                  <Card>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Opened or used products</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Items purchased more than 30 days ago</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Sale items marked as final sale</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Free samples or promotional items</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">Gift cards</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-heading">Exchanges</h2>
                  </div>
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <p className="text-muted-foreground">
                        Want to exchange for a different product? During the return process, simply select "Exchange" instead of "Refund" and choose your new item.
                      </p>
                      <p className="text-muted-foreground">
                        If the new item costs more, you'll be charged the difference. If it costs less, we'll refund the balance to your original payment method.
                      </p>
                      <p className="text-muted-foreground">
                        Your new item will ship as soon as we receive and process your return.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-heading">Refund Timeline</h2>
                  </div>
                  <Card>
                    <CardContent className="p-6">
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                          <div>
                            <p className="font-medium">Return received</p>
                            <p className="text-sm text-muted-foreground">1-2 days after carrier drop-off</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                          <div>
                            <p className="font-medium">Inspection & processing</p>
                            <p className="text-sm text-muted-foreground">3-5 business days</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                          <div>
                            <p className="font-medium">Refund issued</p>
                            <p className="text-sm text-muted-foreground">5-10 business days to appear on statement</p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card className="mt-12">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Important Note</h3>
                      <p className="text-muted-foreground mb-4">
                        Original shipping charges are non-refundable unless the return is due to our error (wrong item, defective product, etc.). We provide free return shipping for all eligible returns within the United States.
                      </p>
                      <Button asChild>
                        <Link to="/account" data-testid="link-manage-orders">Manage Your Orders</Link>
                      </Button>
                    </div>
                  </div>
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

export default Returns;
