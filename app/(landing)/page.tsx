"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart3,
  LineChart,
  BookOpen,
  ShieldCheck,
  Zap,
  Globe,
  Menu,
  X,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroGraphic from "./_components/HeroGraphic";
import { cn } from "@/lib/utils";

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/favicon.png"
              width={32}
              height={32}
              alt="TraderRecord Logo"
            />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            TraderRecord
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/sign-in">
            <Button className="bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/20">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-300"
            onClick={() => setIsOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <div className="flex flex-col gap-6 mt-10 p-6 bg-[#0F172A] h-full">
              <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-purple-600 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
};

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: any;
  title: string;
  description: string;
  className?: string;
}) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    }}
    className={cn(
      "group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-colors duration-300",
      className,
    )}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 text-amber-500 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const BentoGrid = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      transition={{ staggerChildren: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[minmax(180px,auto)]"
    >
      {/* Main Feature - Spans 2 cols, 2 rows */}
      <FeatureCard
        icon={BarChart3}
        title="Advanced Analytics Dashboard"
        description="Gain deep insights into your trading performance with our powerful analytics engine. Track win rates, profit factors, and more in real-time."
        className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-white/5 to-white/0"
      />

      {/* Secondary Features */}
      <FeatureCard
        icon={BookOpen}
        title="Smart Journaling"
        description="Log trades with rich context. Attach notes, tags, and screenshots."
        className="md:col-span-1 md:row-span-1"
      />
      <FeatureCard
        icon={ShieldCheck}
        title="Secure & Private"
        description="Your data is encrypted and stored securely. We prioritize your privacy above all."
        className="md:col-span-1 md:row-span-1"
      />

      {/* Bottom Row */}
      <FeatureCard
        icon={Zap}
        title="Fast Data Sync"
        description="Instant synchronization across all your devices. Never miss a beat."
        className="md:col-span-1"
      />
      <FeatureCard
        icon={Globe}
        title="Prop Firm Manager"
        description="Manage multiple prop firm accounts in one centralized place."
        className="md:col-span-2"
      />
    </motion.div>
  );
};

const StepCard = ({
  number,
  title,
  description,
  delay,
}: {
  number: string;
  title: string;
  description: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    className="relative pl-8 md:pl-0"
  >
    <div className="md:hidden absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 to-transparent"></div>
    <div className="md:hidden absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-amber-500"></div>

    <h3 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/20 mb-2">
      {number}
    </h3>
    <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden text-foreground bg-[#0F172A] selection:bg-amber-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center lg:text-left z-10"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                Master Your Strategy <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-purple-500 animate-gradient">
                  Maximize Your Edge
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                The professional trading journal designed for serious traders.
                Analyze your performance, manage prop firm accounts, and scale
                your success.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white border-0 shadow-lg shadow-purple-500/20 text-lg px-8 h-12 rounded-full transition-transform hover:scale-105"
                  >
                    Start Journaling Free
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 opacity-70">
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">
                    Secure
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <div className="text-2xl font-bold text-white">Fast</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">
                    Sync
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <div className="text-2xl font-bold text-white">Cloud</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">
                    Storage
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <HeroGraphic />
            </motion.div>
          </div>
        </div>

        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10 opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none -z-10 opacity-20"></div>
      </section>

      {/* Features Section - Bento Grid */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to Win
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Powerful tools built to help you find your edge and stay
              consistent.
            </p>
          </motion.div>

          <BentoGrid />
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-24 bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-3xl"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Your Path to Consistency
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 text-center md:text-left">
            <StepCard
              number="01"
              title="Record"
              description="Log your trades effortlessely. Capture entries, exits, and emotions in real-time."
              delay={0.1}
            />
            <StepCard
              number="02"
              title="Analyze"
              description="visualize your performance. Identify mistakes and double down on what works."
              delay={0.2}
            />
            <StepCard
              number="03"
              title="Refine"
              description="Adjust your strategy based on data. Build discipline and scale your account."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-12 md:p-20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none"></div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Level Up?
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of traders who are taking control of their
              performance with TraderRecord.
            </p>
            <Link href="/sign-in">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 text-lg px-10 h-14 rounded-full font-bold shadow-lg shadow-white/10 transition-transform hover:scale-105"
              >
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
            <Image
              src="/favicon.png"
              width={24}
              height={24}
              alt="TraderRecord Logo"
              className="rounded-md"
            />
            <span className="font-semibold text-white">TraderRecord</span>
          </div>
          <p className="mb-8">
            © {new Date().getFullYear()} TraderRecord. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
