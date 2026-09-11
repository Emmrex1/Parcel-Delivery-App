import { motion } from "framer-motion";
import { Package, MapPin } from "lucide-react";

const AnimatedPackage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="relative hidden lg:flex h-[500px] items-center justify-center"
    >
      <div className="relative h-[430px] w-[430px]">
        {/* Ambient glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Outer orbital ring */}
        <motion.div
          className="absolute inset-8 rounded-full border border-primary/20"
          animate={{ rotate: 360 }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Second orbital ring */}
        <motion.div
          className="absolute inset-20 rounded-full border border-accent/20"
          animate={{ rotate: -360 }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Dashed delivery route */}
        <svg viewBox="0 0 430 430" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient
              id="deliveryGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="hsl(224 76% 40%)" />
              <stop offset="100%" stopColor="hsl(25 95% 53%)" />
            </linearGradient>
          </defs>

          <motion.ellipse
            cx="215"
            cy="215"
            rx="165"
            ry="95"
            fill="none"
            stroke="url(#deliveryGradient)"
            strokeWidth="2"
            strokeDasharray="7 8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
            }}
          />

          <motion.ellipse
            cx="215"
            cy="215"
            rx="120"
            ry="170"
            fill="none"
            stroke="hsl(224 76% 40% / 0.12)"
            strokeWidth="2"
            strokeDasharray="5 10"
          />
        </svg>

        {/* Floating delivery status card */}
        <motion.div
          className="absolute right-3 top-8 z-20"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/90 px-4 py-3 shadow-xl backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <Package className="h-5 w-5 text-accent" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Delivery Status</p>

              <p className="text-sm font-bold text-foreground">In Transit</p>
            </div>

            <motion.span
              className="h-2.5 w-2.5 rounded-full bg-green-500"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>

        {/* Lagos location */}
        <motion.div
          className="absolute bottom-12 left-0 z-20"
          animate={{
            y: [0, -6, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="flex items-center gap-2 rounded-xl border border-primary/10 bg-background/90 px-3 py-2 shadow-lg backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>

            <div>
              <p className="text-[10px] text-muted-foreground">From</p>

              <p className="text-xs font-bold text-foreground">Lagos</p>
            </div>
          </div>
        </motion.div>

        {/* Abuja location */}
        <motion.div
          className="absolute bottom-20 right-0 z-20"
          animate={{
            y: [0, -7, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="flex items-center gap-2 rounded-xl border border-accent/10 bg-background/90 px-3 py-2 shadow-lg backdrop-blur-md">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
              <MapPin className="h-4 w-4 text-accent" />
            </div>

            <div>
              <p className="text-[10px] text-muted-foreground">To</p>

              <p className="text-xs font-bold text-foreground">Abuja</p>
            </div>
          </div>
        </motion.div>

        {/* Main parcel */}
        <motion.div
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          animate={{
            y: [0, -12, 0],
            rotateX: [0, 3, 0],
            rotateY: [0, -4, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            perspective: "1000px",
          }}
        >
          {/* Parcel shadow */}
          <motion.div
            className="absolute -bottom-10 left-1/2 h-8 w-40 -translate-x-1/2 rounded-full bg-slate-900/20 blur-xl"
            animate={{
              scale: [1, 0.85, 1],
              opacity: [0.3, 0.15, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Parcel box */}
          <div
            className="relative h-44 w-52"
            style={{
              transform: "rotateX(8deg) rotateY(-12deg)",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Front face */}
            <div className="absolute inset-0 rounded-xl border border-orange-900/20 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 shadow-2xl">
              {/* Tape */}
              <div className="absolute left-1/2 top-0 h-full w-12 -translate-x-1/2 bg-yellow-200/60" />

              {/* Parcel label */}
              <div className="absolute left-7 top-10 rounded-md bg-white/90 px-4 py-3 shadow-sm">
                <div className="space-y-1">
                  <div className="h-1.5 w-20 rounded bg-slate-300" />
                  <div className="h-1.5 w-14 rounded bg-slate-300" />

                  <div className="mt-2 flex gap-1">
                    <span className="h-5 w-1 bg-slate-700" />
                    <span className="h-5 w-1 bg-slate-400" />
                    <span className="h-5 w-1 bg-slate-700" />
                    <span className="h-5 w-1 bg-slate-400" />
                    <span className="h-5 w-1 bg-slate-700" />
                    <span className="h-5 w-1 bg-slate-400" />
                  </div>
                </div>
              </div>

              {/* RapidXpress branding */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-black tracking-wider text-orange-950">
                RAPIDXpress
              </div>
            </div>

            {/* Top face */}
            <div className="absolute -top-10 left-0 h-10 w-full origin-bottom skew-x-[-28deg] rounded-t-xl border border-orange-900/10 bg-gradient-to-r from-orange-200 to-orange-300" />

            {/* Side face */}
            <div className="absolute right-[-38px] top-0 h-full w-10 origin-left skew-y-[-28deg] rounded-r-xl border border-orange-900/10 bg-gradient-to-b from-orange-400 to-orange-600" />
          </div>
        </motion.div>

        {/* Orbiting mini package */}
        <motion.div
          className="absolute left-1/2 top-1/2 z-30"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            width: "100%",
            height: "100%",
            marginLeft: "-50%",
            marginTop: "-50%",
          }}
        >
          <div className="absolute left-1/2 top-2 -translate-x-1/2">
            <motion.div
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "linear",
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/40 bg-primary text-white shadow-lg"
            >
              <Package className="h-5 w-5" />
            </motion.div>
          </div>
        </motion.div>

        {/* Floating particle 1 */}
        <motion.div
          className="absolute left-16 top-28 h-2 w-2 rounded-full bg-accent"
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        {/* Floating particle 2 */}
        <motion.div
          className="absolute right-20 top-40 h-2.5 w-2.5 rounded-full bg-primary"
          animate={{
            y: [0, 15, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
          }}
        />

        {/* Floating particle 3 */}
        <motion.div
          className="absolute bottom-28 left-24 h-1.5 w-1.5 rounded-full bg-accent"
          animate={{
            x: [0, 15, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />

        {/* Speed indicator */}
        <motion.div
          className="absolute left-10 top-16 rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground shadow-lg"
          animate={{
            x: [0, 8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          FAST DELIVERY
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnimatedPackage;
