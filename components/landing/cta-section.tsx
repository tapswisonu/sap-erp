"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Factory, Sparkles } from "lucide-react";

export function CtaSection() {
  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative glass-card gradient-border rounded-3xl p-12 overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-48 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/30">
                <Factory size={28} className="text-white" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-400 text-xs font-medium mb-6">
              <Sparkles size={12} />
              Start Your Digital Transformation
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Ready to Modernize
              <span className="block gradient-text">Your Manufacturing?</span>
            </h2>

            <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Join hundreds of manufacturers already using XYZ Manufacturing ERP
              to streamline operations, reduce costs, and accelerate growth.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                id="cta-dashboard-btn"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300"
              >
                View Dashboard
                <ArrowRight size={18} />
              </Link>
              <Link
                href="#features"
                id="cta-features-btn"
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-medium border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-300 text-foreground"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
