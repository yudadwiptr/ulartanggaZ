"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { WEATHER_EVENTS } from "@/lib/gameEngine";
import { WeatherIcon } from "@/components/icons/GameIcons";
import { WeatherType } from "@/types/game";
import { soundEngine } from "@/lib/sound";

interface WeatherWheelModalProps {
  isOpen: boolean;
  round: number;
  onComplete: (chosen: Exclude<WeatherType, "CLEAR">) => void;
}

const WHEEL_OPTIONS: Array<Exclude<WeatherType, "CLEAR">> = [
  "TAILWIND",
  "SLEEPY_SNAKES",
  "GOLDEN_FEVER",
];

export default function WeatherWheelModal({
  isOpen,
  round,
  onComplete,
}: WeatherWheelModalProps) {
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [selectedWeather, setSelectedWeather] = useState<Exclude<
    WeatherType,
    "CLEAR"
  > | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setSelectedWeather(null);
      return;
    }

    soundEngine.playWeatherWheel();
    const finalPick =
      WHEEL_OPTIONS[Math.floor(Math.random() * WHEEL_OPTIONS.length)];

    let ticks = 0;
    const interval = setInterval(() => {
      ticks += 1;
      setHighlightIndex((prev) => (prev + 1) % WHEEL_OPTIONS.length);
      if (ticks >= 12) {
        clearInterval(interval);
        const finalIdx = WHEEL_OPTIONS.indexOf(finalPick);
        setHighlightIndex(finalIdx);
        setSelectedWeather(finalPick);
        soundEngine.playLadderClimb();
      }
    }, 110);

    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.85, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.85, y: 20 }}
            className="w-full max-w-md rounded-3xl bg-white border-4 border-slate-900 p-6 shadow-[0_12px_0_0_#0f172a] text-center"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Putaran Cuaca Ronde {round}!
            </div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              Roda Cuaca Pulau Langit
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1 mb-5">
              Setiap 5 ronde, cuaca pulau berubah dan memberi kejutan untuk
              semua pemain!
            </p>

            <div className="space-y-2.5 text-left mb-5">
              {WHEEL_OPTIONS.map((wKey, idx) => {
                const info = WEATHER_EVENTS[wKey];
                const isActive = highlightIndex === idx;
                return (
                  <div
                    key={wKey}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all ${
                      isActive
                        ? "bg-amber-100 border-slate-900 scale-[1.03] shadow-[0_4px_0_0_#0f172a]"
                        : "bg-slate-50 border-slate-200 opacity-60"
                    }`}
                  >
                    <WeatherIcon type={wKey} className="w-10 h-10 shrink-0" />
                    <div>
                      <div className="font-black text-sm text-slate-900">
                        {info.title}
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        {info.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedWeather ? (
              <button
                type="button"
                onClick={() => onComplete(selectedWeather)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 font-black text-base border-2 border-slate-900 shadow-[0_5px_0_0_#0f172a] inline-flex items-center justify-center gap-2"
              >
                Mantap! Lanjut Main
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="py-3 text-sm font-black text-sky-600 animate-pulse">
                Memutar Roda Cuaca Pulau Langit...
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
