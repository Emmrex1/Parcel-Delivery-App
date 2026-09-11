import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package, Truck, Clock, Globe, Zap, Shield, MapPin, DollarSign,
  ArrowRight, Star, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedCounter from '@/components/AnimatedCounter';
import AnimatedPackage from '../components/AnimatedPackage';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

const services = [
  { icon: Zap, title: 'Same Day Delivery', desc: 'Urgent deliveries within the same city, guaranteed same-day.' },
  { icon: Clock, title: 'Overnight Delivery', desc: 'Send today, deliver tomorrow across Nigeria.' },
  { icon: Truck, title: 'Standard Delivery', desc: 'Affordable and reliable 2-5 day shipping nationwide.' },
  { icon: Globe, title: 'International Shipping', desc: 'Global reach with trusted international partners.' },
];

const steps = [
  { num: '01', title: 'Create Shipment', desc: 'Book your package online or at any RapidXpress branch.' },
  { num: '02', title: 'In Transit', desc: 'Your package travels securely through our hub network.' },
  { num: '03', title: 'Delivered', desc: 'Safe delivery to the doorstep with confirmation.' },
];

const features = [
  { icon: MapPin, title: 'Real-time Tracking', desc: 'Track every step of your package journey.' },
  { icon: Shield, title: 'Secure Delivery', desc: 'End-to-end protection for your packages.' },
  { icon: Globe, title: 'Nationwide Network', desc: 'Covering 200+ cities across Nigeria.' },
  { icon: DollarSign, title: 'Affordable Pricing', desc: 'Competitive rates without hidden fees.' },
];

const testimonials = [
  { name: 'Taiwo Sodiq', city: 'Lagos', text: 'RapidXpress delivered my package from Lagos to Abuja in just one day. Incredible speed!', rating: 5 },
  { name: 'Olalere Sodiq', city: 'Abuja', text: 'Very reliable and the tracking updates are always accurate. Highly recommended.', rating: 5 },
  { name: 'Adebayo Ola', city: 'Ibadan', text: 'Best rates in the market and their customer support is outstanding.', rating: 4 },
];

const Index = () => {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const handleQuickTrack = () => {
    if (trackingId.trim()) navigate(`/track?id=${trackingId.trim()}`);
  };

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center gradient-hero pt-16">
        <div className="container mx-auto px-4 md:px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                🚀 World's Fastest Courier Service
              </span>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground leading-tight">
                Delivering What Matters.{" "}
                <span className="text-primary">Across Nigeria</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
                From Lagos to Abuja, RapidXpress delivers your packages safely
                and on time. Same-day, overnight, and standard delivery options
                available.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/track">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                  >
                    <Search className="mr-2 h-4 w-4" /> Track Package
                  </Button>
                </Link>
                <Link to="/calculate">
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-semibold border-primary/20"
                  >
                    <DollarSign className="mr-2 h-4 w-4" /> Calculate Cost
                  </Button>
                </Link>
              </div>
            </motion.div>
            <AnimatedPackage />
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Our Services
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Tailored delivery solutions for every need
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <Card className="h-full border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                      <s.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2">
                      {s.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three simple steps to ship your package
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-display text-xl font-bold mb-4">
                  {step.num}
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-primary/20">
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.3 }}
                    />
                  </div>
                )}
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Track */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fadeUp} className="text-center">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
              Track Your Package
            </h2>
            <p className="text-primary-foreground/70 mb-6">
              Enter your tracking ID to get instant updates
            </p>
            <div className="flex max-w-md mx-auto gap-2">
              <Input
                placeholder="Enter Tracking ID"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleQuickTrack()}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50"
              />
              <Button
                onClick={handleQuickTrack}
                className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
              >
                Track <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Why Choose RapidXpress?
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 mb-4">
                  <f.icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div {...fadeUp} className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Feedback from Our Customers
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border/50">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-accent text-accent"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      "{t.text}"
                    </p>
                    <div>
                      <p className="font-display font-semibold text-foreground text-sm">
                        {t.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.city}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatedCounter
              end={10000}
              suffix="+"
              label="Packages Delivered"
            />
            <AnimatedCounter end={100} suffix="+" label="Cities Covered" />
            <AnimatedCounter end={20000} suffix="+" label="Happy Customers" />
            <AnimatedCounter end={99} suffix="%" label="On-time Delivery" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
