import { useState, useEffect, useRef } from "react";
import { HelpCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import NewsletterSection from "@/components/home/NewsletterSection";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

const Contact = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (!sectionRef.current) return;
    const elements = sectionRef.current.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-reveal");
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "contacts"), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        userId: user?.uid || null,
        status: "new",
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div ref={sectionRef} className="min-h-screen bg-secondary overflow-hidden">
      <Header />

      <main className="pt-28 pb-10 px-4 sm:px-6">

        <section className="text-center mb-16 reveal">
          <h1 className="text-[clamp(2.8rem,6vw,4rem)] font-heading italic mb-4">
            Contact
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
            Whether you have a question about your order,
            need skincare advice, or just want to say hello.
          </p>
        </section>

        <section className="max-w-2xl mx-auto reveal mb-30">
          <div className="bg-background rounded-3xl p-6 sm:p-10 shadow-lg border border-border/10">

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-heading">
                Send Us a Message
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sage italic font-normal">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-12 bg-secondary/50 border-0 rounded-xl 
                    placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary"
                    required
                    data-testid="input-contact-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sage italic font-normal">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-12 bg-secondary/50 border-0 rounded-xl 
                    placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary"
                    required
                    data-testid="input-contact-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sage italic font-normal">
                  Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  className="h-12 bg-secondary/50 border-0 rounded-xl 
                  placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary"
                  required
                  data-testid="input-contact-subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sage italic font-normal">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us everything..."
                  value={formData.message}
                  onChange={handleChange}
                  className="min-h-[140px] bg-secondary/50 border-0 rounded-xl 
                  placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-primary resize-none"
                  required
                  data-testid="input-contact-message"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl text-base font-medium"
                data-testid="button-send-message"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/20">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-1">Email Us</p>
                  <a href="mailto:hello@kanva.com" className="text-muted-foreground hover:text-foreground">
                    hello@kanva.com
                  </a>
                </div>
                <div>
                  <p className="font-medium mb-1">Visit Our FAQ</p>
                  <Link to="/faq" className="text-muted-foreground hover:text-foreground">
                    Common questions answered
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
