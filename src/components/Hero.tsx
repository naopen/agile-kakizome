import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center space-y-12">
        {/* Main Title with Fade-in Animation */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="space-y-4"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-yuji text-sumi tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            アジャイル書き初め
          </motion.h1>

          <motion.div
            className="h-px w-24 mx-auto bg-sumi/20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="space-y-6"
        >
          <h2 className="text-2xl md:text-4xl font-yuji text-sumi tracking-wide">
            <span className="text-shuniku">AI</span>
            とアジャイルに、新年の決意を。
          </h2>

          <p className="text-lg md:text-xl text-sumi/70 font-zen">
            Agile Kakizome 2026
          </p>

          <p className="text-base md:text-lg text-sumi/60 font-zen max-w-2xl mx-auto leading-relaxed">
            2025年の振り返りと2026年の目標を入力すると、
            <br />
            AIがあなたの今年の漢字を毛筆体で贈ります。
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="bg-sumi text-washi hover:bg-sumi-light text-lg px-8 py-6 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 font-zen"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            書き初めを始める
          </Button>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.5 }}
          className="pt-12"
        >
          <p className="text-sm text-sumi/40 font-zen">RSGT2026 LT Demo</p>
        </motion.div>
      </div>
    </div>
  );
}
