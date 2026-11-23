"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ActionCard, GameState } from "@/types/game";
import { canPlayActionCard } from "@/lib/gameEngine";
import { ActionCardIcon, CardDeckIcon } from "@/components/icons/GameIcons";

interface ActionCardHandProps {
  gameState: GameState;
  playerId: string;
  playerName: string;
  cards: ActionCard[];
  isMyTurn: boolean;
  onPlayCard: (card: ActionCard) => void;
}

export default function ActionCardHand({
  gameState,
  playerId,
  playerName,
  cards,
  isMyTurn,
  onPlayCard,
}: ActionCardHandProps) {
  return (
    <div className="rounded-2xl bg-white border-2 border-slate-900/15 p-3 sm:p-4 shadow-card3d">
      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
        <div className="flex items-center gap-1.5">
          <CardDeckIcon className="w-5 h-5" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700">
            Kartu {playerName} ({cards.length}/5)
          </h3>
        </div>
        <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
          {gameState.hasPlayedCardThisTurn
            ? "Sudah Pakai 1 Kartu"
            : "Pakai 1 Sebelum Lempar"}
        </span>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 py-4 px-3 text-center">
          <p className="text-xs font-bold text-slate-400">
            Belum ada Kartu Aksi! Mendaratlah di kotak{" "}
            <span className="text-violet-600 font-black">
              Hadiah Misteri (?)
            </span>{" "}
            untuk ambil kartu baru!
          </p>
        </div>
      ) : (
        <div className="flex sm:grid sm:grid-cols-2 gap-2.5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory no-scrollbar pb-1">
          <AnimatePresence mode="popLayout">
            {cards.map((card) => {
              const check = canPlayActionCard(gameState, playerId, card.type);
              const playable = isMyTurn && check.allowed;

              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.75, y: -10 }}
                  whileHover={playable ? { y: -3 } : undefined}
                  className={`snap-start shrink-0 w-[235px] sm:w-auto relative flex flex-col justify-between rounded-xl p-3 border-2 transition-all ${
                    playable
                      ? "bg-gradient-to-b from-white to-slate-50 border-slate-800 shadow-[0_4px_0_0_#1e293b]"
                      : "bg-slate-50 border-slate-200 opacity-75"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-900/15"
                        style={{ backgroundColor: `${card.color}22` }}
                      >
                        <ActionCardIcon type={card.type} className="w-6 h-6" />
                      </span>
                      <span className="font-black text-xs sm:text-sm text-slate-800 truncate">
                        {card.title}
                      </span>
                    </div>
                    <p className="text-[11px] leading-snug font-semibold text-slate-600 mt-1">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    {!playable && check.reason ? (
                      <span className="text-[10px] font-bold text-amber-700 truncate">
                        {check.reason}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700">
                        Siap dipakai
                      </span>
                    )}

                    <button
                      type="button"
                      disabled={!playable}
                      onClick={() => onPlayCard(card)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all shrink-0 ${
                        playable
                          ? "bg-slate-900 hover:bg-violet-600 active:scale-95 text-white cursor-pointer shadow-sm"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      PAKAI
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
