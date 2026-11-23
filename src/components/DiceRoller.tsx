"use client";

import React from "react";
import { motion } from "framer-motion";
import { DoubleRollChoice } from "@/types/game";
import {
  ActionCardIcon,
  AvatarIcon,
  WeatherIcon,
} from "@/components/icons/GameIcons";

interface DiceRollerProps {
  values: number[];
  isRolling: boolean;
  canRoll: boolean;
  isDoubleRollArmed: boolean;
  tailwindActive: boolean;
  pendingDoubleChoice: DoubleRollChoice | null;
  activePlayerName: string;
  activePlayerAvatarId: string;
  activePlayerColor: string;
  currentPosition: number;
  onRollClick: () => void;
  onSelectDoubleChoice: (chosenBaseSteps: number) => void;
}

const PIP_LAYOUTS: Record<number, number[]> = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function DieFace({
  value,
  isRolling,
  accentColor,
}: {
  value: number;
  isRolling: boolean;
  accentColor?: string;
}) {
  const pips = PIP_LAYOUTS[value] || PIP_LAYOUTS[6];

  return (
    <motion.div
      animate={
        isRolling
          ? {
              rotateX: [0, 180, 360],
              rotateY: [0, 180, 360],
              rotateZ: [0, -25, 25, 0],
              scale: [1, 1.15, 0.95, 1.08, 1],
            }
          : { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 }
      }
      transition={{ duration: 0.48, ease: "easeInOut" }}
      className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-slate-200 border-[3px] sm:border-4 border-slate-800 shadow-[0_5px_0_0_#1e293b] sm:shadow-[0_7px_0_0_#1e293b] p-2 sm:p-2.5 grid grid-cols-3 grid-rows-3 place-items-center shrink-0"
      style={{
        borderColor: accentColor || "#1e293b",
      }}
    >
      {Array.from({ length: 9 }).map((_, idx) => {
        const hasPip = pips.includes(idx);
        return (
          <span
            key={idx}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-transform ${
              hasPip
                ? value === 6 || value === 1
                  ? "bg-rose-500 scale-100"
                  : "bg-slate-800 scale-100"
                : "scale-0"
            }`}
          />
        );
      })}
    </motion.div>
  );
}

export default function DiceRoller({
  values,
  isRolling,
  canRoll,
  isDoubleRollArmed,
  tailwindActive,
  pendingDoubleChoice,
  activePlayerName,
  activePlayerAvatarId,
  activePlayerColor,
  currentPosition,
  onRollClick,
  onSelectDoubleChoice,
}: DiceRollerProps) {
  const displayValues =
    values.length > 0 ? values : isDoubleRollArmed ? [6, 6] : [6];

  const previewTarget = (base: number) => {
    const total = base + (tailwindActive ? 1 : 0);
    const raw = currentPosition + total;
    if (raw > 100) {
      return `Mantul #${100 - (raw - 100)}`;
    }
    if (raw === 100) {
      return `#100 MENANG!`;
    }
    return `Ke #${raw}`;
  };

  return (
    <div className="rounded-2xl bg-white border-2 border-slate-900/15 p-3 sm:p-4 shadow-card3d">
      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center border border-slate-900/25 shrink-0"
            style={{ backgroundColor: `${activePlayerColor}28` }}
          >
            <AvatarIcon avatarId={activePlayerAvatarId} className="w-6 h-6" />
          </span>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 truncate">
            {activePlayerName} • Kotak #{currentPosition}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {isDoubleRollArmed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-extrabold">
              <ActionCardIcon type="DOUBLE_ROLL" className="w-3.5 h-3.5" />
              x2 Aktif
            </span>
          )}
          {tailwindActive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[11px] font-extrabold">
              <WeatherIcon type="TAILWIND" className="w-3.5 h-3.5" />
              +1 Langkah
            </span>
          )}
        </div>
      </div>

      {/* Dadu & Tombol Lempar Ramah Jempol */}
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {displayValues.map((val, idx) => (
            <DieFace
              key={idx}
              value={val}
              isRolling={isRolling}
              accentColor={isDoubleRollArmed ? "#2563EB" : undefined}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={!canRoll || isRolling}
          onClick={onRollClick}
          className={`flex-1 min-h-[54px] sm:min-h-[64px] py-3 sm:py-4 px-4 sm:px-5 rounded-2xl font-black text-sm sm:text-lg tracking-wide transition-all transform active:translate-y-1 inline-flex items-center justify-center gap-2 ${
            canRoll && !isRolling
              ? "bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-900 border-2 border-slate-900 shadow-[0_5px_0_0_#0F172A] cursor-pointer"
              : "bg-slate-200 text-slate-400 border-2 border-slate-300 cursor-not-allowed"
          }`}
        >
          <ActionCardIcon type="DOUBLE_ROLL" className="w-6 h-6 shrink-0" />
          <span>
            {isRolling
              ? "Mengocok..."
              : isDoubleRollArmed
              ? "LEMPAR 2 DADU!"
              : "LEMPAR DADU!"}
          </span>
        </button>
      </div>

      {/* Pilihan Dadu Ganda */}
      {pendingDoubleChoice && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 pt-2.5 border-t-2 border-dashed border-blue-200"
        >
          <p className="text-[11px] sm:text-xs font-extrabold text-blue-800 uppercase tracking-wide mb-2">
            Dadu Ganda! Pilih langkah yang mau dijalankan:
          </p>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {[
              {
                label: `Dadu 1 (${pendingDoubleChoice.die1})`,
                steps: pendingDoubleChoice.die1,
              },
              {
                label: `Dadu 2 (${pendingDoubleChoice.die2})`,
                steps: pendingDoubleChoice.die2,
              },
              {
                label: `Jumlah (${
                  pendingDoubleChoice.die1 + pendingDoubleChoice.die2
                })`,
                steps: pendingDoubleChoice.die1 + pendingDoubleChoice.die2,
              },
            ].map((opt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectDoubleChoice(opt.steps)}
                className="flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl bg-blue-50 hover:bg-blue-600 active:bg-blue-700 text-blue-900 hover:text-white border-2 border-blue-300 hover:border-blue-800 transition-colors font-extrabold text-xs shadow-sm"
              >
                <span className="text-xs sm:text-sm font-black">
                  {opt.label}
                </span>
                <span className="text-[10px] sm:text-[11px] opacity-85 mt-0.5">
                  {previewTarget(opt.steps)}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
