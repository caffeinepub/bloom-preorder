import type { Preorder } from "@/backend.d";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import {
  useGetAllPreorders,
  useGetTotalPreorders,
  useSubmitPreorder,
  useUpdateOrderStatus,
} from "@/hooks/useQueries";
import {
  AlertCircle,
  CheckCircle,
  ChevronDown,
  FlaskConical,
  Heart,
  Leaf,
  Loader2,
  LogOut,
  Menu,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/* ─────────────────────────────────────────────────────────────────────────
   Animated Counter Hook
───────────────────────────────────────────────────────────────────────── */
function useAnimatedCounter(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (target === 0) return;
    startRef.current = null;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return count;
}

/* ─────────────────────────────────────────────────────────────────────────
   Navbar
───────────────────────────────────────────────────────────────────────── */
function Navbar({ onAdminClick }: { onAdminClick?: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-lg shadow-bloom-soft"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2 group"
          aria-label="Bloom - back to top"
        >
          <div className="w-8 h-8 rounded-full bg-bloom-hot-pink flex items-center justify-center shadow-bloom">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-2xl font-semibold text-bloom-hot-pink tracking-tight">
            Bloom
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["About", "Features", "FAQ"].map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => scrollTo(item.toLowerCase())}
              className="text-sm font-medium text-bloom-dark hover:text-bloom-hot-pink transition-colors"
            >
              {item}
            </button>
          ))}
          <Button
            data-ocid="nav.preorder_button"
            onClick={() => scrollTo("preorder")}
            className="bg-bloom-hot-pink hover:bg-bloom-pink text-white font-semibold rounded-full px-6 shadow-bloom transition-all hover:shadow-bloom-lg hover:-translate-y-0.5"
          >
            Preorder Now
          </Button>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded-full hover:bg-bloom-pale transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="w-5 h-5 text-bloom-dark" />
          ) : (
            <Menu className="w-5 h-5 text-bloom-dark" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white/95 backdrop-blur-lg border-t border-bloom-pale overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {["About", "Features", "FAQ"].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="text-left text-sm font-medium text-bloom-dark hover:text-bloom-hot-pink transition-colors py-2"
                >
                  {item}
                </button>
              ))}
              <Button
                data-ocid="nav.preorder_button"
                onClick={() => scrollTo("preorder")}
                className="bg-bloom-hot-pink hover:bg-bloom-pink text-white font-semibold rounded-full w-full shadow-bloom"
              >
                Preorder Now
              </Button>
              {onAdminClick && (
                <button
                  type="button"
                  onClick={() => {
                    onAdminClick();
                    setMenuOpen(false);
                  }}
                  className="text-left text-xs text-bloom-gray hover:text-bloom-hot-pink transition-colors"
                >
                  Admin Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Hero Section
───────────────────────────────────────────────────────────────────────── */
function HeroSection() {
  const scrollToPreorder = () => {
    document.getElementById("preorder")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-bloom-blush petal-bg pt-16"
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-10 right-0 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.687 0.195 349) 0%, transparent 70%)",
          transform: "translate(30%, -20%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.617 0.225 349.5) 0%, transparent 70%)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 bg-bloom-pale text-bloom-hot-pink text-xs font-semibold px-4 py-2 rounded-full border border-bloom-pink/30 mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                New — Launching Spring 2026
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-bloom-dark leading-tight tracking-tight mb-6"
            >
              Keep Your Dress in Place,{" "}
              <span
                className="relative inline-block"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, oklch(0.617 0.225 349.5), oklch(0.687 0.195 349))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                All Day Long
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg text-bloom-gray leading-relaxed mb-8 max-w-lg"
            >
              Bloom Styling Glue™ is the adhesive body glue designed to prevent
              your dress from falling or slipping — no matter what.
              Chemical-free, skin-safe, and made with natural ingredients.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              <Button
                data-ocid="hero.primary_button"
                onClick={scrollToPreorder}
                size="lg"
                className="bg-bloom-hot-pink hover:bg-bloom-pink text-white font-semibold text-base rounded-full px-8 py-4 h-auto shadow-bloom-lg transition-all hover:shadow-bloom hover:-translate-y-1"
              >
                <Heart className="w-4 h-4 mr-2" />
                Preorder Now
              </Button>
              <span className="text-sm text-bloom-gray flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Cash on Delivery available
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="flex items-center gap-6 mt-10"
            >
              <div className="flex -space-x-2">
                {[
                  { bg: "bg-bloom-hot-pink", initial: "A" },
                  { bg: "bg-bloom-pink", initial: "M" },
                  { bg: "bg-bloom-pale", initial: "J" },
                ].map(({ bg, initial }) => (
                  <div
                    key={initial}
                    className={`w-8 h-8 rounded-full border-2 border-white ${bg} flex items-center justify-center`}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {initial}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {["s1", "s2", "s3", "s4", "s5"].map((k) => (
                    <Star
                      key={k}
                      className="w-3.5 h-3.5 fill-bloom-hot-pink text-bloom-hot-pink"
                    />
                  ))}
                </div>
                <p className="text-xs text-bloom-gray mt-0.5">
                  1,200+ women on the waitlist
                </p>
              </div>
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center relative"
          >
            <div className="relative w-full max-w-lg">
              {/* Glow behind image */}
              <div
                className="absolute inset-4 rounded-[3rem] blur-3xl opacity-30"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.687 0.195 349), oklch(0.617 0.225 349.5))",
                }}
              />
              <div className="relative rounded-[3rem] overflow-hidden shadow-bloom-lg animate-float">
                <img
                  src="/assets/uploads/file_000000001fc4720890e72374fd0b0857-1.png"
                  alt="Bloom Styling Glue stick held against arm"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {/* Overlay badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-3 shadow-bloom">
                    <div className="w-10 h-10 rounded-full bg-bloom-hot-pink flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-bloom-dark">
                        Keeps dress in place all day
                      </p>
                      <p className="text-xs text-bloom-gray">
                        Dermatologist tested
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-bloom-pink opacity-60" />
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Product Showcase
───────────────────────────────────────────────────────────────────────── */
const features = [
  {
    icon: Leaf,
    title: "Natural Ingredients",
    desc: "Made with 100% natural ingredients — gentle on your skin, tough on slipping.",
  },
  {
    icon: FlaskConical,
    title: "Dermatologist Tested",
    desc: "Clinically tested and approved for all skin types, including sensitive skin.",
  },
  {
    icon: Heart,
    title: "Chemical & Paraben Free",
    desc: "Completely free of chemicals and parabens. Safe, clean, and skin-friendly.",
  },
  {
    icon: Sparkles,
    title: "Suitable for All Skin Types",
    desc: "Works on every skin tone and type — no irritation, no mess, just confidence.",
  },
];

function ProductShowcase() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{
          background: "oklch(0.687 0.195 349)",
          transform: "translate(30%, -30%)",
        }}
      />
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Product image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div
              className="absolute inset-0 rounded-[3rem] blur-2xl opacity-20"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.687 0.195 349), oklch(0.617 0.225 349.5))",
              }}
            />
            <div className="relative rounded-[3rem] overflow-hidden shadow-bloom-lg bg-bloom-blush">
              <img
                src="/assets/uploads/file_0000000073dc720888ec783a4e2cc579-1.png"
                alt="Bloom Styling Glue stick product"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 3,
                delay: 0.5,
              }}
              className="absolute -top-4 -right-4 bg-bloom-hot-pink text-white rounded-2xl px-4 py-2 shadow-bloom"
            >
              <p className="text-xs font-bold">Spring 2026</p>
              <p className="text-xs opacity-80">Limited Edition</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 3.5,
                delay: 1,
              }}
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-bloom flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-bloom-pale flex items-center justify-center">
                <Star className="w-4 h-4 fill-bloom-hot-pink text-bloom-hot-pink" />
              </div>
              <div>
                <p className="text-xs font-bold text-bloom-dark">4.9/5</p>
                <p className="text-xs text-bloom-gray">Early testers</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Features list */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-bloom-hot-pink text-xs font-semibold uppercase tracking-widest mb-3">
                Why Bloom
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-bloom-dark leading-tight mb-4">
                The secret to a{" "}
                <span className="text-bloom-hot-pink">
                  perfect fit, every time
                </span>
              </h2>
              <p className="text-bloom-gray leading-relaxed mb-10">
                Bloom Styling Glue™ is your invisible confidence booster. Roll
                it on where your dress tends to slip, and it holds all day — no
                matter how much you dance, move, or celebrate.
              </p>
            </motion.div>

            <div className="space-y-6">
              {features.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-bloom-pale flex items-center justify-center flex-shrink-0 group-hover:bg-bloom-hot-pink transition-colors duration-300">
                    <feat.icon className="w-5 h-5 text-bloom-hot-pink group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-bloom-dark mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-sm text-bloom-gray leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Social Proof Counter
───────────────────────────────────────────────────────────────────────── */
function SocialProofSection() {
  const { data: totalPreorders, isLoading } = useGetTotalPreorders();
  const baseCount = 1247;
  const total = baseCount + Number(totalPreorders ?? 0);
  const animatedCount = useAnimatedCounter(total, 2000);
  const [hasEntered, setHasEntered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasEntered(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const displayCount = hasEntered ? animatedCount : 0;

  const stats = [
    { label: "Countries", value: "47+" },
    { label: "Testers", value: "150+" },
    { label: "Satisfaction", value: "98%" },
  ];

  return (
    <section
      id="about"
      data-ocid="social_proof.section"
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.617 0.225 349.5) 0%, oklch(0.687 0.195 349) 100%)",
      }}
    >
      {/* Decorative petals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              top: `${10 + i * 15}%`,
              left: `${5 + i * 16}%`,
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-block bg-white/20 text-white text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            Join the movement
          </span>

          <div className="mb-4">
            {isLoading ? (
              <div className="h-20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
              </div>
            ) : (
              <motion.p
                key={displayCount}
                className="text-7xl sm:text-8xl font-bold text-white tracking-tight"
              >
                {displayCount.toLocaleString()}+
              </motion.p>
            )}
          </div>

          <p className="text-xl sm:text-2xl text-white/90 font-medium mb-4">
            women have already reserved theirs
          </p>
          <p className="text-white/70 max-w-lg mx-auto mb-12">
            Join our growing community of women who never worry about wardrobe
            malfunctions again.
          </p>

          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/15 rounded-2xl py-4 px-3"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Preorder Form
───────────────────────────────────────────────────────────────────────── */
function PreorderSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [quantity, setQuantity] = useState<string>("1");

  const mutation = useSubmitPreorder();
  const { actor, isFetching: actorLoading } = useActor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !street.trim() ||
      !city.trim() ||
      !state.trim() ||
      !pincode.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, ""))) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return;
    }
    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }
    if (!actor) {
      toast.error(
        "Still connecting to the server. Please wait a moment and try again.",
      );
      return;
    }
    mutation.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        quantity: Number.parseInt(quantity),
      },
      {
        onSuccess: () => {
          setName("");
          setEmail("");
          setPhone("");
          setStreet("");
          setCity("");
          setState("");
          setPincode("");
          setQuantity("1");
        },
        onError: () => {
          toast.error(
            "Order could not be placed. Please check your connection and try again.",
          );
        },
      },
    );
  };

  const isDisabled = mutation.isPending || actorLoading || !actor;

  return (
    <section
      id="preorder"
      className="py-24 bg-bloom-blush petal-bg relative overflow-hidden"
    >
      <div className="max-w-xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-bloom-hot-pink text-xs font-semibold uppercase tracking-widest mb-3">
            Limited Spots
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-bloom-dark mb-4">
            Reserve Your Spot
          </h2>
          <p className="text-bloom-gray">
            Secure your stick at our exclusive preorder price before we launch.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* COD Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-green-800">
                Cash on Delivery
              </p>
              <p className="text-xs text-green-700">
                Pay when your order arrives at your door — no payment needed
                now!
              </p>
            </div>
            <div className="ml-auto">
              <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                COD
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-bloom-lg p-8 sm:p-10">
            {/* Price callout */}
            <div className="bg-bloom-pale rounded-2xl p-4 mb-8 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-bloom-hot-pink">
                  ₹400.00
                </p>
                <p className="text-xs text-bloom-gray">per bottle</p>
              </div>
              <div className="text-right">
                <span className="bg-bloom-hot-pink text-white text-xs font-bold px-3 py-1 rounded-full">
                  Best Value
                </span>
                <p className="text-xs text-bloom-gray mt-1">Pay on delivery</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {mutation.isSuccess ? (
                <motion.div
                  key="success"
                  data-ocid="preorder.success_state"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-bloom-pale flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-bloom-hot-pink" />
                  </div>
                  <h3 className="text-xl font-bold text-bloom-dark mb-2">
                    Order Placed! 🌸
                  </h3>
                  <p className="text-bloom-gray text-sm max-w-xs mx-auto">
                    Your preorder is confirmed. We'll be in touch when your
                    Bloom Styling Glue™ is ready to ship — and you pay only when
                    it arrives!
                  </p>
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 inline-flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-700">
                      Cash on Delivery confirmed
                    </span>
                  </div>
                  <div className="mt-6">
                    <Button
                      onClick={() => mutation.reset()}
                      variant="outline"
                      className="border-bloom-pink text-bloom-hot-pink hover:bg-bloom-pale rounded-full"
                    >
                      Reserve Another
                    </Button>
                  </div>
                </motion.div>
              ) : mutation.isError ? (
                <motion.div
                  key="error"
                  data-ocid="preorder.error_state"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4 mb-4"
                >
                  <div className="bg-red-50 rounded-xl p-4 flex items-start gap-3 text-left">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-red-700 font-medium">
                        Something went wrong
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        Please check your details and try again.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => mutation.reset()}
                      className="border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-xs flex-shrink-0"
                    >
                      Try Again
                    </Button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {!mutation.isSuccess && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <Label
                    htmlFor="preorder-name"
                    className="text-sm font-medium text-bloom-dark mb-1.5 block"
                  >
                    Full Name <span className="text-bloom-hot-pink">*</span>
                  </Label>
                  <Input
                    id="preorder-name"
                    data-ocid="preorder.input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                    className="rounded-xl border-bloom-pink/40 focus:ring-bloom-hot-pink focus:border-bloom-hot-pink h-11"
                    required
                    disabled={isDisabled}
                    autoComplete="name"
                  />
                </div>

                {/* Email */}
                <div>
                  <Label
                    htmlFor="preorder-email"
                    className="text-sm font-medium text-bloom-dark mb-1.5 block"
                  >
                    Email Address <span className="text-bloom-hot-pink">*</span>
                  </Label>
                  <Input
                    id="preorder-email"
                    data-ocid="preorder.email.input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="rounded-xl border-bloom-pink/40 focus:ring-bloom-hot-pink focus:border-bloom-hot-pink h-11"
                    required
                    disabled={isDisabled}
                    autoComplete="email"
                  />
                </div>

                {/* Phone */}
                <div>
                  <Label
                    htmlFor="preorder-phone"
                    className="text-sm font-medium text-bloom-dark mb-1.5 block"
                  >
                    Phone Number <span className="text-bloom-hot-pink">*</span>
                  </Label>
                  <Input
                    id="preorder-phone"
                    data-ocid="preorder.phone.input"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="rounded-xl border-bloom-pink/40 focus:ring-bloom-hot-pink focus:border-bloom-hot-pink h-11"
                    required
                    disabled={isDisabled}
                    autoComplete="tel"
                    maxLength={10}
                  />
                </div>

                {/* Street Address */}
                <div>
                  <Label
                    htmlFor="preorder-street"
                    className="text-sm font-medium text-bloom-dark mb-1.5 block"
                  >
                    Street Address{" "}
                    <span className="text-bloom-hot-pink">*</span>
                  </Label>
                  <Input
                    id="preorder-street"
                    data-ocid="preorder.street.input"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="House no., Street, Area"
                    className="rounded-xl border-bloom-pink/40 focus:ring-bloom-hot-pink focus:border-bloom-hot-pink h-11"
                    required
                    disabled={isDisabled}
                    autoComplete="street-address"
                  />
                </div>

                {/* City + State */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="preorder-city"
                      className="text-sm font-medium text-bloom-dark mb-1.5 block"
                    >
                      City <span className="text-bloom-hot-pink">*</span>
                    </Label>
                    <Input
                      id="preorder-city"
                      data-ocid="preorder.city.input"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      className="rounded-xl border-bloom-pink/40 focus:ring-bloom-hot-pink focus:border-bloom-hot-pink h-11"
                      required
                      disabled={isDisabled}
                      autoComplete="address-level2"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="preorder-state"
                      className="text-sm font-medium text-bloom-dark mb-1.5 block"
                    >
                      State <span className="text-bloom-hot-pink">*</span>
                    </Label>
                    <Input
                      id="preorder-state"
                      data-ocid="preorder.state.input"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="State"
                      className="rounded-xl border-bloom-pink/40 focus:ring-bloom-hot-pink focus:border-bloom-hot-pink h-11"
                      required
                      disabled={isDisabled}
                      autoComplete="address-level1"
                    />
                  </div>
                </div>

                {/* Pincode + Quantity */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="preorder-pincode"
                      className="text-sm font-medium text-bloom-dark mb-1.5 block"
                    >
                      Pincode <span className="text-bloom-hot-pink">*</span>
                    </Label>
                    <Input
                      id="preorder-pincode"
                      data-ocid="preorder.pincode.input"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="6-digit pincode"
                      className="rounded-xl border-bloom-pink/40 focus:ring-bloom-hot-pink focus:border-bloom-hot-pink h-11"
                      required
                      disabled={isDisabled}
                      autoComplete="postal-code"
                      maxLength={6}
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="preorder-qty"
                      className="text-sm font-medium text-bloom-dark mb-1.5 block"
                    >
                      Quantity <span className="text-bloom-hot-pink">*</span>
                    </Label>
                    <Select
                      value={quantity}
                      onValueChange={setQuantity}
                      disabled={isDisabled}
                    >
                      <SelectTrigger
                        id="preorder-qty"
                        data-ocid="preorder.quantity.select"
                        className="rounded-xl border-bloom-pink/40 h-11 focus:ring-bloom-hot-pink"
                      >
                        <SelectValue placeholder="Qty" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="1">1 — ₹400</SelectItem>
                        <SelectItem value="2">2 — ₹800</SelectItem>
                        <SelectItem value="3">3+ — Best deal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {mutation.isPending && (
                  <div
                    data-ocid="preorder.loading_state"
                    className="flex items-center gap-2 text-bloom-gray text-sm py-1"
                  >
                    <Loader2 className="w-4 h-4 animate-spin text-bloom-hot-pink" />
                    Securing your spot…
                  </div>
                )}

                <Button
                  data-ocid="preorder.submit_button"
                  type="submit"
                  disabled={isDisabled}
                  size="lg"
                  className="w-full bg-bloom-hot-pink hover:bg-bloom-pink text-white font-semibold rounded-xl h-12 shadow-bloom transition-all hover:shadow-bloom-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Placing Order…
                    </>
                  ) : actorLoading ? (
                    <>
                      <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      Connecting…
                    </>
                  ) : (
                    <>
                      <Truck className="mr-2 w-4 h-4" />
                      Place COD Order
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-bloom-gray">
                  🔒 Secure. Pay only when your package arrives. Cancel anytime.
                </p>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   FAQ
───────────────────────────────────────────────────────────────────────── */
const faqs = [
  {
    q: "When will the product ship?",
    a: "We expect to ship in Spring 2026. You'll receive a tracking email as soon as your order is on its way!",
  },
  {
    q: "How do I use Bloom Styling Glue™?",
    a: "Simply roll the stick onto your skin where your dress tends to slip — along your chest, waist, or sides. Let it dry for a few seconds and your dress stays in place all day.",
  },
  {
    q: "Is it safe for sensitive skin?",
    a: "Yes! Bloom Styling Glue™ is dermatologist tested, paraben-free, chemical-free, and made with natural ingredients. It's suitable for all skin types, including sensitive skin.",
  },
  {
    q: "Can I cancel my preorder?",
    a: "Absolutely. Email us at hello@bloomstylingglue.co anytime before we begin shipping, and we'll cancel your reservation — no questions asked.",
  },
  {
    q: "How long does it last?",
    a: "One application lasts all day — through dancing, sweating, and everything in between. Simply remove with warm water and mild soap.",
  },
  {
    q: "Do I pay now or on delivery?",
    a: "You pay on delivery — Cash on Delivery (COD) only. No online payment is required at any point. Our delivery partner will collect the payment when they arrive at your door.",
  },
];

function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-bloom-hot-pink text-xs font-semibold uppercase tracking-widest mb-3">
            Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-bloom-dark">
            Frequently Asked
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${i}`}
                data-ocid="faq.panel"
                className="border border-bloom-pink/20 rounded-2xl px-6 overflow-hidden bg-white hover:bg-bloom-blush transition-colors data-[state=open]:bg-bloom-blush"
              >
                <AccordionTrigger className="text-left font-semibold text-bloom-dark hover:text-bloom-hot-pink hover:no-underline py-5 text-sm sm:text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-bloom-gray text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Footer
───────────────────────────────────────────────────────────────────────── */
function Footer({ onAdminClick }: { onAdminClick: () => void }) {
  const year = new Date().getFullYear();
  const hostname = encodeURIComponent(window.location.hostname);
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer className="bg-bloom-dark py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-bloom-hot-pink flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">Bloom</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Style, Secured.
            </p>
            <p className="text-xs text-white/40 mt-4">
              The adhesive body glue that keeps your dress in place, all day.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {["About", "Features", "FAQ", "Preorder"].map((link) => (
                <li key={link}>
                  <button
                    type="button"
                    data-ocid="nav.link"
                    onClick={() =>
                      document
                        .getElementById(link.toLowerCase())
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-sm text-white/60 hover:text-bloom-pink transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:hello@bloomstylingglue.co"
                  className="text-sm text-white/60 hover:text-bloom-pink transition-colors"
                >
                  hello@bloomstylingglue.co
                </a>
              </li>
              <li>
                <p className="text-sm text-white/60">@bloomstylingglue</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {year} Bloom. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              Built with ❤️ using caffeine.ai
            </a>
            <button
              type="button"
              data-ocid="admin.link"
              onClick={onAdminClick}
              className="text-xs text-white/20 hover:text-white/40 transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Admin Dashboard — Status Badge
───────────────────────────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    confirmed: {
      label: "Confirmed",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    shipped: {
      label: "Shipped",
      className: "bg-purple-100 text-purple-800 border-purple-200",
    },
    delivered: {
      label: "Delivered",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };

  const config = configs[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Admin Dashboard — Order Row
───────────────────────────────────────────────────────────────────────── */
function OrderRow({ order, index }: { order: Preorder; index: number }) {
  const updateMutation = useUpdateOrderStatus();
  const [localStatus, setLocalStatus] = useState(order.status);

  const handleStatusChange = (newStatus: string) => {
    setLocalStatus(newStatus);
    updateMutation.mutate(
      { orderId: order.id as bigint, newStatus },
      {
        onError: () => {
          setLocalStatus(order.status);
          toast.error("Failed to update status. Please try again.");
        },
        onSuccess: () => {
          toast.success("Order status updated!");
        },
      },
    );
  };

  const date = new Date(Number(order.createdAt) / 1_000_000);
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <TableRow
      data-ocid={`admin.order.row.${index}`}
      className="hover:bg-pink-50/50 transition-colors"
    >
      <TableCell className="font-medium text-bloom-dark text-center w-10">
        {index}
      </TableCell>
      <TableCell>
        <div>
          <p className="font-semibold text-bloom-dark text-sm">{order.name}</p>
          <p className="text-xs text-bloom-gray">{order.email}</p>
        </div>
      </TableCell>
      <TableCell className="text-sm text-bloom-dark">{order.phone}</TableCell>
      <TableCell>
        <div className="text-xs text-bloom-gray space-y-0.5">
          <p>{order.address.street}</p>
          <p>
            {order.address.city}, {order.address.state}
          </p>
          <p className="font-medium text-bloom-dark">{order.address.pincode}</p>
        </div>
      </TableCell>
      <TableCell className="text-center font-semibold text-bloom-dark">
        {Number(order.quantity)}
      </TableCell>
      <TableCell>
        <StatusBadge status={localStatus} />
      </TableCell>
      <TableCell>
        <Select
          value={localStatus}
          onValueChange={handleStatusChange}
          disabled={updateMutation.isPending}
        >
          <SelectTrigger
            data-ocid={`admin.order.select.${index}`}
            className="h-8 text-xs rounded-lg border-gray-200 w-32"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell className="text-xs text-bloom-gray whitespace-nowrap">
        {formattedDate}
      </TableCell>
    </TableRow>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Admin Dashboard — Main
───────────────────────────────────────────────────────────────────────── */
function AdminDashboard({ onExit }: { onExit: () => void }) {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "bloom2026admin") {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPassword("");
    }
  };

  // Password gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bloom-blush via-white to-bloom-pale flex items-center justify-center px-4 font-poppins">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-bloom-hot-pink flex items-center justify-center mx-auto mb-4 shadow-bloom">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-bloom-dark">Admin Login</h1>
            <p className="text-sm text-bloom-gray mt-1">Bloom Styling Glue™</p>
          </div>

          <div className="bg-white rounded-3xl shadow-bloom-lg p-8">
            <form
              onSubmit={handleLogin}
              className="space-y-5"
              data-ocid="admin.modal"
            >
              <div>
                <Label
                  htmlFor="admin-password"
                  className="text-sm font-medium text-bloom-dark mb-1.5 block"
                >
                  Admin Password
                </Label>
                <Input
                  id="admin-password"
                  data-ocid="admin.input"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Enter admin password"
                  className={`rounded-xl h-11 ${passwordError ? "border-red-400 focus:ring-red-400" : "border-bloom-pink/40 focus:ring-bloom-hot-pink focus:border-bloom-hot-pink"}`}
                  autoFocus
                />
                {passwordError && (
                  <p
                    data-ocid="admin.error_state"
                    className="text-xs text-red-500 mt-1.5 flex items-center gap-1"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>

              <Button
                data-ocid="admin.submit_button"
                type="submit"
                className="w-full bg-bloom-hot-pink hover:bg-bloom-pink text-white font-semibold rounded-xl h-11 shadow-bloom"
              >
                <ShieldCheck className="mr-2 w-4 h-4" />
                Access Dashboard
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                data-ocid="admin.cancel_button"
                onClick={onExit}
                className="text-xs text-bloom-gray hover:text-bloom-hot-pink transition-colors"
              >
                ← Back to store
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return <AdminDashboardContent onExit={onExit} />;
}

/* ─────────────────────────────────────────────────────────────────────────
   Admin Dashboard — Content (after auth)
───────────────────────────────────────────────────────────────────────── */
function AdminDashboardContent({ onExit }: { onExit: () => void }) {
  const { data: orders = [], isLoading } = useGetAllPreorders();

  const totalOrders = orders.length;
  const pending = orders.filter((o) => o.status === "pending").length;
  const confirmed = orders.filter((o) => o.status === "confirmed").length;
  const shipped = orders.filter((o) => o.status === "shipped").length;
  const delivered = orders.filter((o) => o.status === "delivered").length;

  const summaryCards = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: Package,
      color: "text-bloom-hot-pink",
      bg: "bg-bloom-pale",
    },
    {
      label: "Pending",
      value: pending,
      icon: Loader2,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Confirmed",
      value: confirmed,
      icon: CheckCircle,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Shipped",
      value: shipped,
      icon: Truck,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Delivered",
      value: delivered,
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-bloom-hot-pink flex items-center justify-center shadow-bloom">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-bloom-dark">Bloom</span>
              <span className="text-xs text-bloom-gray ml-2 hidden sm:inline">
                Admin Dashboard
              </span>
            </div>
          </div>
          <Button
            data-ocid="admin.close_button"
            onClick={onExit}
            variant="outline"
            size="sm"
            className="border-gray-200 text-bloom-gray hover:text-bloom-dark hover:border-bloom-pink gap-1.5 rounded-full"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-bloom-dark">Orders</h1>
          <p className="text-sm text-bloom-gray mt-1">
            Manage all preorders and update their status
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {summaryCards.map((card) => (
            <Card
              key={card.label}
              className="border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <card.icon className={`w-4 h-4 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-bloom-dark">
                      {card.value}
                    </p>
                    <p className="text-xs text-bloom-gray">{card.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Orders table */}
        <Card className="border-gray-100 shadow-sm" data-ocid="admin.table">
          <CardHeader className="pb-4 border-b border-gray-50">
            <CardTitle className="text-base font-semibold text-bloom-dark">
              All Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div
                data-ocid="admin.loading_state"
                className="flex items-center justify-center py-20"
              >
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-bloom-hot-pink animate-spin mx-auto mb-3" />
                  <p className="text-sm text-bloom-gray">Loading orders…</p>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div
                data-ocid="admin.empty_state"
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-bloom-pale flex items-center justify-center mb-4">
                  <Package className="w-7 h-7 text-bloom-hot-pink" />
                </div>
                <h3 className="font-semibold text-bloom-dark mb-1">
                  No orders yet
                </h3>
                <p className="text-sm text-bloom-gray max-w-xs">
                  Orders will appear here once customers start preordering from
                  your store.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/70 hover:bg-gray-50/70">
                      <TableHead className="w-10 text-center text-xs font-semibold text-bloom-gray">
                        #
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-bloom-gray">
                        Customer
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-bloom-gray">
                        Phone
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-bloom-gray">
                        Address
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-bloom-gray text-center">
                        Qty
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-bloom-gray">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-bloom-gray">
                        Update
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-bloom-gray">
                        Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, i) => (
                      <OrderRow
                        key={order.id.toString()}
                        order={order}
                        index={i + 1}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   App Root
───────────────────────────────────────────────────────────────────────── */
type View = "home" | "admin";

export default function App() {
  const [view, setView] = useState<View>("home");

  return (
    <div className="min-h-screen font-poppins">
      <Toaster position="top-center" richColors />
      <AnimatePresence mode="wait">
        {view === "admin" ? (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <AdminDashboard onExit={() => setView("home")} />
          </motion.div>
        ) : (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Navbar onAdminClick={() => setView("admin")} />
            <main>
              <HeroSection />
              <ProductShowcase />
              <SocialProofSection />
              <PreorderSection />
              <FAQSection />
            </main>
            <Footer onAdminClick={() => setView("admin")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
