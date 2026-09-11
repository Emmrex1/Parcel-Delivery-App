
import { motion } from "framer-motion";
import { Package, MapPin, Truck, Plane } from "lucide-react";

const OrbitSatellite = ({
  radius,
  duration,
  direction = 1,
  size = "h-8 w-8",
  iconSize = "h-4 w-4",
  bg = "bg-primary",
  fg = "text-primary-foreground",
  Icon,
}) => (
  // Layer 1: static tilt — fakes an orbit plane in 3D space
  <div
    className="absolute inset-0"
    style={{ transform: "rotateX(70deg)", transformStyle: "preserve-3d" }}
  >
    {/* Layer 2: spin — framer-motion owns this element's transform */}
    <motion.div
      className="absolute inset-0"
      style={{ transformStyle: "preserve-3d" }}
      animate={{ rotateZ: 360 * direction }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {/* Layer 3: offset from center along the orbit radius */}
      <div
        className="absolute top-1/2 left-1/2"
        style={{ transform: `translate(-50%, -50%) translateX(${radius}px)` }}
      >
        <div
          className={`flex ${size} items-center justify-center rounded-full ${bg} shadow-lg`}
        >
          <Icon className={`${iconSize} ${fg}`} />
        </div>
      </div>
    </motion.div>
  </div>
);

const ParcelIllustration3D = () => {
  return (
    <div className="relative w-80 h-80 [perspective:1100px]">
      {/* Breathing ground shadow anchors the scene to a "floor" */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-36 h-7 rounded-full bg-foreground/15 blur-md"
        animate={{ scaleX: [1, 0.82, 1], opacity: [0.25, 0.12, 0.25] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Static dashed orbit ring for visual reference (decorative only) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="w-60 h-60 rounded-full border-2 border-dashed border-primary/20"
          style={{ transform: "rotateX(70deg)" }}
        />
      </div>

      {/* Orbiting satellites at two radii/speeds/directions for parallax depth */}
      <OrbitSatellite
        radius={118}
        duration={11}
        direction={1}
        Icon={Truck}
        bg="bg-primary"
        fg="text-primary-foreground"
      />
      <OrbitSatellite
        radius={150}
        duration={17}
        direction={-1}
        Icon={Plane}
        bg="bg-accent"
        fg="text-accent-foreground"
        size="h-7 w-7"
        iconSize="h-3.5 w-3.5"
      />

      {/* The parcel: a real cube, six faces in 3D space, spinning + bobbing */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: 360, y: [0, -16, 0] }}
        transition={{
          rotateY: { duration: 9, repeat: Infinity, ease: "linear" },
          y: { duration: 2.2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <div
          className="absolute inset-0 rounded-xl bg-accent shadow-xl flex items-center justify-center"
          style={{ transform: "translateZ(48px)" }}
        >
          <Package className="h-9 w-9 text-accent-foreground" />
        </div>
        <div
          className="absolute inset-0 rounded-xl bg-accent/70"
          style={{ transform: "rotateY(180deg) translateZ(48px)" }}
        />
        <div
          className="absolute inset-0 rounded-xl bg-accent/55"
          style={{ transform: "rotateY(90deg) translateZ(48px)" }}
        />
        <div
          className="absolute inset-0 rounded-xl bg-accent/55"
          style={{ transform: "rotateY(-90deg) translateZ(48px)" }}
        />
        <div
          className="absolute inset-0 rounded-xl bg-accent/85"
          style={{ transform: "rotateX(90deg) translateZ(48px)" }}
        />
        <div
          className="absolute inset-0 rounded-xl bg-accent/35"
          style={{ transform: "rotateX(-90deg) translateZ(48px)" }}
        />
      </motion.div>

      {/* Route pins, kept flat/legible against the 3D scene above them */}
      <div className="absolute bottom-6 left-4 flex flex-col items-center z-10">
        <MapPin className="h-8 w-8 text-primary" />
        <span className="text-xs font-medium text-primary mt-1">Lagos</span>
      </div>
      <div className="absolute bottom-6 right-4 flex flex-col items-center z-10">
        <MapPin className="h-8 w-8 text-accent" />
        <span className="text-xs font-medium text-accent mt-1">Abuja</span>
      </div>
    </div>
  );
};

export default ParcelIllustration3D;