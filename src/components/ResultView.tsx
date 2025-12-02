import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

interface ResultViewProps {
  kanji: string;
  meaningJp: string;
  meaningEn: string;
  onReset: () => void;
}

export function ResultView({ kanji, meaningJp, meaningEn, onReset }: ResultViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-5xl w-full">
        {/* Main Kanji Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="relative"
        >
          {/* Kanji Container */}
          <div className="relative bg-washi-dark rounded-lg p-12 md:p-16 shadow-2xl border border-sumi/10">
            {/* Vertical Writing Kanji */}
            <div className="flex justify-center items-start min-h-[400px]">
              <motion.div
                className="writing-vertical font-yuji text-sumi"
                style={{ fontSize: 'clamp(8rem, 20vw, 16rem)' }}
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
              >
                {kanji}
              </motion.div>

              {/* Hanko (Seal) */}
              <motion.div
                className="hanko ml-8 mt-auto"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.5, type: 'spring' }}
              >
                敏捷
              </motion.div>
            </div>
          </div>

          {/* Year Label */}
          <motion.div
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-shuniku text-washi px-6 py-2 rounded-full shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2 }}
          >
            <span className="font-yuji text-lg">2026</span>
          </motion.div>
        </motion.div>

        {/* Meanings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="mt-12 space-y-6"
        >
          {/* Japanese Meaning */}
          <div className="bg-washi-dark rounded-lg p-6 border border-sumi/10">
            <p className="text-sumi/90 font-zen text-base md:text-lg leading-relaxed">
              {meaningJp}
            </p>
          </div>

          {/* English Meaning */}
          <div className="bg-washi-dark rounded-lg p-6 border border-sumi/10">
            <p className="text-sumi/70 font-zen text-sm md:text-base leading-relaxed italic">
              {meaningEn}
            </p>
          </div>
        </motion.div>

        {/* Reset Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="mt-12 flex justify-center"
        >
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
            className="font-zen"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            もう一度書く
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
