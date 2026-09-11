import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Cpu,
  HeartHandshake,
  Truck,
  Globe2,
  MapPin,
  Package,
  Route,
  Clock3,
  ArrowRight,
  CheckCircle2,
  Boxes,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const values = [
  {
    icon: Zap,
    title: "Speed",
    desc: "We optimize every stage of the delivery journey so your package gets where it needs to go faster.",
  },
  {
    icon: ShieldCheck,
    title: "Trust",
    desc: "Every parcel deserves careful handling, transparent tracking, and dependable delivery.",
  },
  {
    icon: Cpu,
    title: "Technology",
    desc: "Modern technology powers our tracking, delivery management, cost calculation, and operations.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    desc: "We build our service around clear communication, reliability, and a better customer experience.",
  },
];

export const stats = [
  {
    value: "24/7",
    label: "Tracking Access",
    icon: Clock3,
  },
  {
    value: "100%",
    label: "Delivery Visibility",
    icon: Route,
  },
  {
    value: "Fast",
    label: "Delivery Options",
    icon: Zap,
  },
  {
    value: "1",
    label: "Simple Platform",
    icon: Boxes,
  },
];

export const fadeUp = {
  initial: {
    opacity: 0,
    y: 40,
  },
  whileInView: {
    opacity: 1,
    y: 0,
  },
  viewport: {
    once: true,
    amount: 0.2,
  },
  transition: {
    duration: 0.6,
    ease: "easeOut",
  },
};

export const LocationCard = ({ city, label }) => {
  return (
    <div className="rounded-2xl border border-border/50 bg-background/90 px-4 py-3 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
          <MapPin className="h-4 w-4 text-primary" />
        </div>

        <div>
          <p className="text-[10px] text-muted-foreground">{label}</p>

          <p className="text-sm font-bold text-foreground">{city}</p>
        </div>
      </div>
    </div>
  );
};

export const AboutHeroVisual = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative mx-auto h-[430px] w-full max-w-[500px]"
    >
      {/* Main circle */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10 bg-primary/5"
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Orbit */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-primary/20"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main Package */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        animate={{
          y: [0, -12, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="relative">
          <div className="absolute -bottom-8 left-1/2 h-6 w-28 -translate-x-1/2 rounded-full bg-black/20 blur-xl" />

          <div className="flex h-36 w-36 items-center justify-center rounded-[2rem] bg-gradient-to-br from-primary to-primary/70 shadow-2xl shadow-primary/30">
            <Package className="h-16 w-16 text-primary-foreground" />
          </div>

          <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-background bg-accent shadow-xl">
            <Truck className="h-6 w-6 text-accent-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Lagos */}
      <motion.div
        className="absolute bottom-12 left-2 z-30"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >
        <LocationCard city="Lagos" label="Origin" />
      </motion.div>

      {/* Abuja */}
      <motion.div
        className="absolute right-0 top-10 z-30"
        animate={{ y: [0, 8, 0] }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
        }}
      >
        <LocationCard city="Abuja" label="Destination" />
      </motion.div>

      {/* Tracking Card */}
      <motion.div
        className="absolute bottom-5 right-4 z-30"
        animate={{
          x: [0, 5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      >
        <div className="rounded-2xl border border-border/50 bg-background/90 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <p className="text-[10px] text-muted-foreground">
                Delivery status
              </p>

              <p className="text-sm font-bold text-foreground">In Transit</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};


export const TimelineItem = ({ number, title, description }) => {
  return (
    <div className="relative mb-10 flex gap-5">
      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-background font-bold text-primary shadow-sm">
        {number}
      </div>

      <div className="pt-1">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>

        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
};


export const MiniFeature = ({ icon: Icon, title, text }) => {
  return (
    <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>

      <h4 className="text-sm font-bold text-foreground">{title}</h4>

      <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
    </div>
  );
};


export const CheckItem = ({ text }) => {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
      {text}
    </div>
  );
};

export const ValueCard = ({ value, index }) => {
  const Icon = value.icon;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      whileHover={{
        y: -10,
      }}
    >
      <Card className="group h-full border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
        <CardContent className="p-7">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary">
            <Icon className="h-7 w-7 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
          </div>

          <h3 className="font-display text-lg font-bold text-foreground">
            {value.title}
          </h3>

          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {value.desc}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const StatsSection = () => {
  return (
    <section className="border-y border-border/50 bg-muted/30">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="text-center"
              >
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>

                <p className="text-2xl font-extrabold text-foreground sm:text-3xl">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const AboutCTA = () => {
  return (
    <section className="pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground shadow-2xl md:px-12"
        >
          <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-white/10" />

          <div className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-white/10" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Package className="h-7 w-7" />
            </div>

            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Ready to move something?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
              Send your package with confidence and keep track of it every step
              of the way.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/calculate">
                <Button size="lg" variant="secondary" className="font-semibold">
                  Calculate Delivery Cost
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>

              <Link to="/track">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-transparent font-semibold text-white hover:bg-white/10 hover:text-white"
                >
                  Track Package
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
