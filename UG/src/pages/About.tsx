import { Users, Target, Heart, Award } from "lucide-react";
import Navbar from "@/shared/components/Navbar";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Customer First",
      description: "Your satisfaction is our top priority. We ensure every service meets the highest standards.",
    },
    {
      icon: Target,
      title: "Quality Service",
      description: "All our professionals are background verified and trained to deliver excellence.",
    },
    {
      icon: Heart,
      title: "Trust & Safety",
      description: "We maintain strict safety protocols and ensure a secure experience for all.",
    },
    {
      icon: Award,
      title: "Innovation",
      description: "Constantly improving our platform to provide you with the best service experience.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About UrbanGenie24x7</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Revolutionizing doorstep services in Hyderabad with quality, convenience, and trust
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              UrbanGenie24x7 was born from a simple idea: bringing professional services to your doorstep 
              shouldn't be complicated. We started in 2024 with a vision to transform how Hyderabad residents 
              access beauty, wellness, food, and lifestyle services.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, we connect thousands of verified professionals with customers across the city, 
              making quality service accessible, affordable, and convenient for everyone.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Professionals</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Services</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-muted-foreground">What drives us every day</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-card rounded-xl p-6 shadow-card text-center">
                <div className="inline-flex w-16 h-16 rounded-full bg-gradient-primary items-center justify-center mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To make quality doorstep services accessible to everyone in Hyderabad by connecting 
                  verified professionals with customers through a seamless, reliable platform.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To become India's most trusted and comprehensive doorstep services platform, 
                  expanding to every major city while maintaining our commitment to quality and customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
