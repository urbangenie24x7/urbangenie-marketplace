import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Navbar from "@/shared/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      details: "support@urbangenie24x7.com",
      link: "mailto:support@urbangenie24x7.com",
    },
    {
      icon: Phone,
      title: "Phone",
      details: "+91 9876543210",
      link: "tel:+919876543210",
    },
    {
      icon: MapPin,
      title: "Location",
      details: "Hyderabad, Telangana, India",
    },
    {
      icon: Clock,
      title: "Working Hours",
      details: "24/7 Customer Support",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-xl text-muted-foreground">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name</label>
                      <Input placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name</label>
                      <Input placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input type="email" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input type="tel" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input placeholder="How can we help?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <Textarea
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[150px]"
                    />
                  </div>
                  <Button className="w-full bg-gradient-primary hover:opacity-90" size="lg">
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <Card key={info.title} className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                          <info.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{info.title}</h3>
                          {info.link ? (
                            <a
                              href={info.link}
                              className="text-primary hover:underline"
                            >
                              {info.details}
                            </a>
                          ) : (
                            <p className="text-muted-foreground">{info.details}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">How do I book a service?</h4>
                    <p className="text-sm text-muted-foreground">
                      Browse our services, select your preferred option, choose a time slot, and complete the booking.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What areas do you serve?</h4>
                    <p className="text-sm text-muted-foreground">
                      We currently serve select pincodes in Hyderabad. Check availability during booking.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What is your cancellation policy?</h4>
                    <p className="text-sm text-muted-foreground">
                      You can cancel or reschedule up to 2 hours before your scheduled time for a full refund.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
