import { motion } from "framer-motion";
import { Route, MapPin } from "lucide-react";
import {
  AboutHeroVisual,
  fadeUp,
  values,
  StatsSection,
  TimelineItem,
  MiniFeature,
  CheckItem,
  ValueCard,
  AboutCTA,
} from "../components/AboutSection";


const About = () => {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <section className="relative min-h-[80vh] overflow-hidden pt-24">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-[-10%] top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

          <div className="absolute right-[-10%] top-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        </div>

        {/* Grid background */}
        <div className="absolute inset-0 -z-10 opacity-[0.04]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 md:px-6">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Text */}
            <motion.div
              initial={{
                opacity: 0,
                x: -50,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.7,
              }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Built for modern delivery
              </div>

              <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Moving what
                <span className="block text-primary">matters to you.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                RapidXpress is a technology-driven parcel delivery platform
                designed to make sending, tracking, and managing deliveries
                simple, fast, and transparent across Nigeria.
              </p>
            </motion.div>

            {/* Animation */}
            <AboutHeroVisual />
          </div>
        </div>
      </section>

      <StatsSection />

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            {/* Timeline */}
            <motion.div {...fadeUp} className="relative">
              <div className="absolute left-6 top-5 h-[85%] w-px bg-gradient-to-b from-primary via-accent to-transparent" />

              <TimelineItem
                number="01"
                title="The idea"
                description="We saw an opportunity to make parcel delivery simpler, more transparent, and more technology-driven."
              />

              <TimelineItem
                number="02"
                title="The platform"
                description="RapidXpress evolved into a digital platform connecting customers, parcels, tracking, pricing, and delivery operations."
              />

              <TimelineItem
                number="03"
                title="The mission"
                description="Our goal is to make reliable delivery accessible to individuals and businesses while continuously improving the experience through technology."
              />
            </motion.div>

            {/* Story */}
            <motion.div {...fadeUp}>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
                Our Story
              </p>

              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                More than a delivery service.
                <span className="block text-primary">
                  We're building the experience around it.
                </span>
              </h2>

              <p className="mt-6 leading-8 text-muted-foreground">
                RapidXpress was created around a simple belief: sending a
                package shouldn't be complicated. Customers should know where
                their parcel is, understand what delivery will cost, and have
                confidence that their package is being handled properly.
              </p>

              <p className="mt-4 leading-8 text-muted-foreground">
                That's why we're combining logistics with technology to create a
                delivery experience that is easier to understand, easier to
                manage, and built around transparency.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <MiniFeature
                  icon={MapPin}
                  title="Track Anywhere"
                  text="Stay informed throughout the delivery journey."
                />

                <MiniFeature
                  icon={Route}
                  title="Smarter Routes"
                  text="Better planning for efficient deliveries."
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

        <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

        <div className="container relative mx-auto px-4 md:px-6">
          <motion.div
            {...fadeUp}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-accent">
              What drives us
            </p>

            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Delivering with purpose.
            </h2>

            <p className="mt-4 text-slate-400">
              Technology is only valuable when it makes people's lives easier.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Mission */}
            <motion.div {...fadeUp}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-md md:p-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20">
                  <Route className="h-7 w-7 text-primary" />
                </div>

                <p className="mb-2 text-sm font-medium text-primary">
                  OUR MISSION
                </p>

                <h3 className="text-2xl font-bold">Make delivery simple.</h3>

                <p className="mt-4 leading-7 text-slate-400">
                  To provide fast, reliable, and transparent parcel delivery
                  services that help individuals and businesses move what
                  matters with confidence.
                </p>

                <div className="mt-6 space-y-3">
                  <CheckItem text="Simple delivery experience" />
                  <CheckItem text="Transparent tracking" />
                  <CheckItem text="Reliable service" />
                </div>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div {...fadeUp}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-md md:p-10">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20">
                  <MapPin className="h-7 w-7 text-accent" />
                </div>

                <p className="mb-2 text-sm font-medium text-accent">
                  OUR VISION
                </p>

                <h3 className="text-2xl font-bold">Build smarter logistics.</h3>

                <p className="mt-4 leading-7 text-slate-400">
                  To build a modern logistics ecosystem where technology, data,
                  and human service work together to create faster and more
                  dependable deliveries.
                </p>

                <div className="mt-6 space-y-3">
                  <CheckItem text="Technology-driven operations" />
                  <CheckItem text="Better delivery visibility" />
                  <CheckItem text="Continuous innovation" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            {...fadeUp}
            className="mx-auto mb-14 max-w-2xl text-center"
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Our Principles
            </p>

            <h2 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              What we stand for
            </h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              Every feature, delivery, and customer interaction is guided by
              these principles.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <ValueCard key={value.title} value={value} index={index} />
            ))}
          </div>
        </div>
      </section>
      <AboutCTA />
    </main>
  );
};

export default About;
