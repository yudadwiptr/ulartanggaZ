"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  Check,
  Clock,
  Crown,
  LogOut,
  Users,
} from "lucide-react";
import { AVATARS, ACTION_CARD_TEMPLATES, WEATHER_EVENTS } from "@/lib/gameEngine";
import { isSupabaseConfigured } from "@/lib/realtime";
import {
  ActionCardIcon,
  AvatarIcon,
  BotPersonalityIcon,
  BrandZLogo,
  CardDeckIcon,
  CrownIcon,
  DizzyIcon,
  GameModeIcon,
  ReactionIcon,
  WeatherIcon,
} from "@/components/icons/GameIcons";
import {
  ActionCardType,
  BotPersonality,
  GameMode,
  PlayerState,
  RoomPresencePayload,
  WeatherType,
} from "@/types/game";

interface LobbySetupProps {
  muted: boolean;
  onToggleMute: () => void;
  onStartLocalGame: (mode: GameMode, players: PlayerState[]) => void;
  onConnectOnlineRoom: (
    roomCode: string,
    localPlayer: PlayerState,
    isHost: boolean
  ) => void;
  onlineConnected: boolean;
  onlineRoomCode: string;
  onlineModeLabel: string;
  onlinePresences: RoomPresencePayload[];
  localOnlinePlayerId: string;
  isOnlineHost: boolean;
  onToggleOnlineReady: () => void;
  onHostStartOnlineMatch: () => void;
  onLeaveOnlineRoom: () => void;
}

const BOT_PERSONALITIES: Array<{
  id: BotPersonality;
  label: string;
  short: string;
  desc: string;
}> = [
  {
    id: "CAUTIOUS",
    label: "Bot Hati-hati",
    short: "Hati-hati",
    desc: "Suka menyimpan Peluit Ular & menghindari kotak berisiko",
  },
  {
    id: "CHAOTIC",
    label: "Bot Jahil",
    short: "Jahil",
    desc: "Doyan lempar Kulit Pisang, Tukar Posisi & Dadu Ganda besar",
  },
  {
    id: "BALANCED",
    label: "Bot Petualang",
    short: "Seimbang",
    desc: "Strategi pintar mencari tangga & angka pas ke 100",
  },
];

const CARD_KEYS: ActionCardType[] = [
  "DOUBLE_ROLL",
  "LADDER_BUILDER",
  "BANANA_PEEL",
  "FRIENDLY_SWAP",
  "SNAKE_WHISTLE",
];

const WEATHER_KEYS: Array<Exclude<WeatherType, "CLEAR">> = [
  "TAILWIND",
  "SLEEPY_SNAKES",
  "GOLDEN_FEVER",
];

/**
 * Preview Papan 2.5D Melayang untuk Hero Section
 */
function HeroBoardShowcase() {
  return (
    <div className="relative w-full max-w-[540px] mx-auto py-4 sm:py-6 select-none">
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-amber-300/45 via-lime-300/35 to-sky-300/45 blur-3xl pointer-events-none" />

      {/* Kartu Melayang Kiri */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [-12, -9, -12] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="hidden sm:flex flex-col items-center justify-center absolute -left-6 top-8 z-20 w-28 rounded-2xl bg-white border-[3px] border-slate-900 p-2.5 shadow-[0_6px_0_0_#0f172a]"
      >
        <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center border-2 border-slate-900 mb-1.5">
          <ActionCardIcon type="DOUBLE_ROLL" className="w-8 h-8" />
        </div>
        <span className="font-display font-bold text-xs text-slate-900">
          Dadu Ganda
        </span>
        <span className="text-[10px] font-bold text-slate-500 text-center leading-tight">
          Lempar 2 dadu &amp; pilih!
        </span>
      </motion.div>

      {/* Kartu Melayang Kanan Atas */}
      <motion.div
        animate={{ y: [0, 9, 0], rotate: [11, 14, 11] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        className="hidden sm:flex flex-col items-center justify-center absolute -right-5 top-4 z-20 w-28 rounded-2xl bg-white border-[3px] border-slate-900 p-2.5 shadow-[0_6px_0_0_#0f172a]"
      >
        <div className="w-11 h-11 rounded-xl bg-pink-500 flex items-center justify-center border-2 border-slate-900 mb-1.5">
          <ActionCardIcon type="SNAKE_WHISTLE" className="w-8 h-8" />
        </div>
        <span className="font-display font-bold text-xs text-slate-900">
          Peluit Ular
        </span>
        <span className="text-[10px] font-bold text-slate-500 text-center leading-tight">
          Jinakkan semua ular!
        </span>
      </motion.div>

      {/* Lencana Cuaca Kanan Bawah */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.6,
        }}
        className="absolute -bottom-2 right-2 sm:-right-4 z-20 flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-3.5 py-2 border-2 border-amber-300 shadow-xl"
      >
        <WeatherIcon type="TAILWIND" className="w-6 h-6" />
        <div className="leading-tight">
          <div className="text-[10px] font-black uppercase text-amber-300">
            Roda Cuaca
          </div>
          <div className="text-xs font-extrabold">Angin +1 Langkah</div>
        </div>
      </motion.div>

      {/* Papan Mini 2.5D Bingkai Kayu */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 rounded-[32px] bg-gradient-to-b from-[#A06B3B] via-[#8B5A2B] to-[#5C3A1B] p-3 sm:p-4 border-4 border-[#452A12] shadow-[0_14px_0_0_#452A12,0_25px_50px_rgba(15,23,42,0.28)]"
      >
        <div className="rounded-2xl bg-[#F8FAFC] border-4 border-[#452A12] overflow-hidden p-2 sm:p-3">
          <svg
            viewBox="0 0 400 320"
            className="w-full h-auto block"
            aria-label="Pratinjau Papan Interaktif Ular TanggaZ"
          >
            {[
              { num: 100, x: 0, y: 0, fill: "#FEF08A", stroke: "#F59E0B" },
              { num: 99, x: 100, y: 0, fill: "#BAE6FD", stroke: "#38BDF8" },
              { num: 98, x: 200, y: 0, fill: "#E0F2FE", stroke: "#7DD3FC" },
              { num: 97, x: 300, y: 0, fill: "#BAE6FD", stroke: "#38BDF8" },
              { num: 93, x: 0, y: 106, fill: "#DCFCE7", stroke: "#86EFAC" },
              { num: 94, x: 100, y: 106, fill: "#FEF9C3", stroke: "#FDE047" },
              { num: 95, x: 200, y: 106, fill: "#DCFCE7", stroke: "#86EFAC" },
              { num: 96, x: 300, y: 106, fill: "#FEF9C3", stroke: "#FDE047" },
              { num: 92, x: 0, y: 212, fill: "#FEF9C3", stroke: "#FDE047" },
              { num: 91, x: 100, y: 212, fill: "#DCFCE7", stroke: "#86EFAC" },
              { num: 90, x: 200, y: 212, fill: "#FEF9C3", stroke: "#FDE047" },
              { num: 89, x: 300, y: 212, fill: "#DCFCE7", stroke: "#86EFAC" },
            ].map((t) => (
              <g key={t.num}>
                <rect
                  x={t.x + 4}
                  y={t.y + 4}
                  width={92}
                  height={98}
                  rx={16}
                  fill={t.fill}
                  stroke={t.stroke}
                  strokeWidth={3}
                />
                <text
                  x={t.x + 16}
                  y={t.y + 28}
                  fontSize="17"
                  fontWeight="900"
                  fill={t.num === 100 ? "#B45309" : "#334155"}
                >
                  {t.num}
                </text>
              </g>
            ))}

            {/* Mahkota Kotak 100 */}
            <g transform="translate(26, 30) scale(1.05)">
              <path
                d="M6 34 L10 14 L19 23 L24 10 L29 23 L38 14 L42 34 Z"
                fill="#FACC15"
                stroke="#0F172A"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <rect
                x="8"
                y="34"
                width="32"
                height="6"
                rx="2.5"
                fill="#F59E0B"
                stroke="#0F172A"
                strokeWidth="2.8"
              />
            </g>

            {/* Hadiah Misteri Kotak 94 */}
            <g transform="translate(150, 162)">
              <circle r="22" fill="#8B5CF6" stroke="#DDD6FE" strokeWidth="3" />
              <text
                y="8"
                fontSize="22"
                fontWeight="900"
                fill="#FFFFFF"
                textAnchor="middle"
              >
                ?
              </text>
            </g>

            {/* Tangga Kayu 91 -> 99 */}
            <g opacity="0.95">
              <line
                x1="138"
                y1="264"
                x2="138"
                y2="54"
                stroke="#92400E"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <line
                x1="164"
                y1="264"
                x2="164"
                y2="54"
                stroke="#92400E"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {[90, 130, 170, 210, 245].map((ry) => (
                <line
                  key={ry}
                  x1="138"
                  y1={ry}
                  x2="164"
                  y2={ry}
                  stroke="#F59E0B"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              ))}
            </g>

            {/* Raja Z-Kobra 98 -> 89 */}
            <g>
              <path
                d="M 250 56 Q 315 110 295 162 T 345 266"
                fill="none"
                stroke="#15803D"
                strokeWidth="20"
                strokeLinecap="round"
              />
              <path
                d="M 250 56 Q 315 110 295 162 T 345 266"
                fill="none"
                stroke="#A3E635"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="12 12"
              />
              <g transform="translate(250, 56)">
                <circle r="19" fill="#15803D" stroke="#FFFFFF" strokeWidth="3" />
                <circle cx="-6" cy="-4" r="5" fill="#FFFFFF" />
                <circle cx="6" cy="-4" r="5" fill="#FFFFFF" />
                <circle cx="-6" cy="-4" r="2.4" fill="#0F172A" />
                <circle cx="6" cy="-4" r="2.4" fill="#0F172A" />
                <path
                  d="M 0 13 L 0 23 M 0 23 L -4 27 M 0 23 L 4 27"
                  stroke="#EF4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </g>
            </g>

            {/* Token Rubah di 99 */}
            <motion.g
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <g transform="translate(150, 56)">
                <circle r="27" fill="#F97316" stroke="#FFFFFF" strokeWidth="4" />
                <g transform="translate(-22, -23) scale(0.7)">
                  <path
                    d="M12 26 L16 8 L28 18 Z"
                    fill="#EA580C"
                    stroke="#1E293B"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M52 26 L48 8 L36 18 Z"
                    fill="#EA580C"
                    stroke="#1E293B"
                    strokeWidth="2.5"
                  />
                  <ellipse
                    cx="32"
                    cy="35"
                    rx="22"
                    ry="18"
                    fill="#F97316"
                    stroke="#1E293B"
                    strokeWidth="2.5"
                  />
                  <path
                    d="M11 36 Q20 33 32 45 Q44 33 53 36 Q48 53 32 53 Q16 53 11 36 Z"
                    fill="#FFF7ED"
                  />
                  <circle cx="23" cy="32" r="3.5" fill="#0F172A" />
                  <circle cx="41" cy="32" r="3.5" fill="#0F172A" />
                  <ellipse cx="32" cy="40" rx="4" ry="3" fill="#0F172A" />
                </g>
              </g>
            </motion.g>

            {/* Token Kodok di 92 */}
            <motion.g
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            >
              <g transform="translate(52, 260)">
                <circle r="25" fill="#10B981" stroke="#FFFFFF" strokeWidth="4" />
                <g transform="translate(-21, -22) scale(0.66)">
                  <circle
                    cx="20"
                    cy="20"
                    r="9.5"
                    fill="#22C55E"
                    stroke="#1E293B"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="44"
                    cy="20"
                    r="9.5"
                    fill="#22C55E"
                    stroke="#1E293B"
                    strokeWidth="2.5"
                  />
                  <ellipse
                    cx="32"
                    cy="37"
                    rx="23"
                    ry="17"
                    fill="#22C55E"
                    stroke="#1E293B"
                    strokeWidth="2.5"
                  />
                  <circle cx="20" cy="20" r="5" fill="#FFFFFF" />
                  <circle cx="44" cy="20" r="5" fill="#FFFFFF" />
                  <circle cx="20" cy="20" r="2.6" fill="#0F172A" />
                  <circle cx="44" cy="20" r="2.6" fill="#0F172A" />
                  <path
                    d="M20 38 Q32 48 44 38"
                    fill="none"
                    stroke="#0F172A"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            </motion.g>
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

export default function LobbySetup({
  muted,
  onToggleMute,
  onStartLocalGame,
  onConnectOnlineRoom,
  onlineConnected,
  onlineRoomCode,
  onlineModeLabel,
  onlinePresences,
  localOnlinePlayerId,
  isOnlineHost,
  onToggleOnlineReady,
  onHostStartOnlineMatch,
  onLeaveOnlineRoom,
}: LobbySetupProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>("VS_BOTS");

  const [playerCount, setPlayerCount] = useState<number>(3);
  const [slots, setSlots] = useState<
    Array<{
      name: string;
      avatarIndex: number;
      botPersonality: BotPersonality;
    }>
  >([
    { name: "Yuda", avatarIndex: 0, botPersonality: "BALANCED" },
    { name: "Nisya", avatarIndex: 1, botPersonality: "CHAOTIC" },
    { name: "Bimo", avatarIndex: 2, botPersonality: "CAUTIOUS" },
    { name: "Rara", avatarIndex: 3, botPersonality: "BALANCED" },
  ]);

  const [onlineName, setOnlineName] = useState("Petualang");
  const [onlineAvatarIdx, setOnlineAvatarIdx] = useState(0);
  const [joinCodeInput, setJoinCodeInput] = useState("");

  const handleUpdateSlot = (
    idx: number,
    patch: Partial<(typeof slots)[number]>
  ) => {
    setSlots((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, ...patch } : item))
    );
  };

  const handleLaunchLocal = () => {
    const built: PlayerState[] = Array.from({ length: playerCount }).map(
      (_, idx) => {
        const slot = slots[idx];
        const avatar = AVATARS[slot.avatarIndex % AVATARS.length];
        const isBot = selectedMode === "VS_BOTS" && idx > 0;
        const botInfo = BOT_PERSONALITIES.find(
          (b) => b.id === slot.botPersonality
        );

        return {
          id: `player_${idx + 1}`,
          name:
            slot.name.trim() ||
            (isBot ? `${botInfo?.label || "Bot"} ${idx}` : `Pemain ${idx + 1}`),
          avatarId: avatar.id,
          color: avatar.color,
          position: 1,
          cards: [],
          hasSnakeWhistle: false,
          skipNextTurn: false,
          isDizzy: false,
          isBot,
          botPersonality: isBot ? slot.botPersonality : undefined,
          isReady: true,
          activeCardThisTurn: null,
        };
      }
    );

    onStartLocalGame(selectedMode, built);
  };

  const handleQuickStartSolo = () => {
    const quickPlayers: PlayerState[] = [
      {
        id: "player_1",
        name: slots[0].name.trim() || "Petualang",
        avatarId: AVATARS[slots[0].avatarIndex].id,
        color: AVATARS[slots[0].avatarIndex].color,
        position: 1,
        cards: [],
        hasSnakeWhistle: false,
        skipNextTurn: false,
        isDizzy: false,
        isBot: false,
        isReady: true,
        activeCardThisTurn: null,
      },
      {
        id: "player_2",
        name: "Bot Nisya",
        avatarId: AVATARS[1].id,
        color: AVATARS[1].color,
        position: 1,
        cards: [],
        hasSnakeWhistle: false,
        skipNextTurn: false,
        isDizzy: false,
        isBot: true,
        botPersonality: "CHAOTIC",
        isReady: true,
        activeCardThisTurn: null,
      },
      {
        id: "player_3",
        name: "Bot Bimo",
        avatarId: AVATARS[2].id,
        color: AVATARS[2].color,
        position: 1,
        cards: [],
        hasSnakeWhistle: false,
        skipNextTurn: false,
        isDizzy: false,
        isBot: true,
        botPersonality: "CAUTIOUS",
        isReady: true,
        activeCardThisTurn: null,
      },
    ];
    onStartLocalGame("VS_BOTS", quickPlayers);
  };

  const handleCreateOrJoinOnline = (asHost: boolean) => {
    const avatar = AVATARS[onlineAvatarIdx % AVATARS.length];
    const code = asHost
      ? ""
      : joinCodeInput.trim().toUpperCase().slice(0, 4);
    if (!asHost && code.length !== 4) return;

    const player: PlayerState = {
      id: `peer_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: onlineName.trim() || avatar.name,
      avatarId: avatar.id,
      color: avatar.color,
      position: 1,
      cards: [],
      hasSnakeWhistle: false,
      skipNextTurn: false,
      isDizzy: false,
      isBot: false,
      isReady: true,
      isHost: asHost,
      activeCardThisTurn: null,
    };

    onConnectOnlineRoom(code, player, asHost);
  };

  const scrollToSetup = (mode?: GameMode) => {
    if (mode) setSelectedMode(mode);
    const el = document.getElementById("party-setup-studio");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden pb-safe">
      {/* LATAR BELAKANG PULAU LANGIT FULL-BLEED */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-amber-200/35 blur-3xl" />

        <svg
          className="absolute top-12 left-[4%] w-44 sm:w-64 opacity-80 animate-cloud-drift"
          viewBox="0 0 220 90"
        >
          <path
            d="M40 72 H175 C195 72 208 58 205 42 C202 28 188 20 174 22 C166 8 145 2 128 10 C114 0 88 2 76 18 C58 14 38 24 35 42 C20 44 16 72 40 72 Z"
            fill="#FFFFFF"
          />
        </svg>
        <svg
          className="absolute top-28 right-[5%] w-40 sm:w-72 opacity-75 animate-cloud-drift"
          style={{ animationDelay: "-5s" }}
          viewBox="0 0 220 90"
        >
          <path
            d="M40 72 H175 C195 72 208 58 205 42 C202 28 188 20 174 22 C166 8 145 2 128 10 C114 0 88 2 76 18 C58 14 38 24 35 42 C20 44 16 72 40 72 Z"
            fill="#FFFFFF"
          />
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-full h-36 sm:h-52"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120 Q360 30 720 110 T1440 90 L1440 200 L0 200 Z"
            fill="#86EFAC"
            opacity="0.45"
          />
          <path
            d="M0 155 Q400 90 820 145 T1440 125 L1440 200 L0 200 Z"
            fill="#4ADE80"
            opacity="0.35"
          />
        </svg>
      </div>

      {/* NAVBAR ATAS FULL-WIDTH */}
      <nav className="sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md border-b-[3px] border-slate-900">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandZLogo className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl shadow-md shrink-0" />
            <div>
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-slate-900 block leading-none">
                ULAR TANGGA<span className="text-emerald-600">Z</span>
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700">
                Edisi Pesta Pulau Langit
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-extrabold text-slate-700">
            <button
              type="button"
              onClick={() => scrollToSetup()}
              className="hover:text-emerald-700 transition-colors"
            >
              Arena Main
            </button>
            <button
              type="button"
              onClick={() => scrollToSetup("ONLINE_PARTY")}
              className="hover:text-emerald-700 transition-colors"
            >
              Room Online
            </button>
            <a
              href="#party-mechanics"
              className="hover:text-emerald-700 transition-colors"
            >
              Aturan Unik &ldquo;Z&rdquo;
            </a>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onToggleMute}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border-2 border-slate-900/15 transition-colors"
              aria-label={muted ? "Nyalakan Suara" : "Matikan Suara"}
            >
              {muted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={() => scrollToSetup()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a] active:translate-y-0.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Main Sekarang
            </button>
          </div>
        </div>
      </nav>

      {/* BAGIAN 1: HERO SECTION FULL-WIDTH */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6 sm:pt-12 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Copy Hero & Tombol Utama */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-6 space-y-5 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900 text-lime-300 border-2 border-slate-900 shadow-sm text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Game Papan Seru Buat Mabar Keluarga &amp; Teman
            </div>

            <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-slate-900 leading-[1.05]">
              Panjat, Jahilin &amp; Balapan ke{" "}
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-lime-600 to-amber-500">
                Kotak 100!
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-slate-700 font-bold max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Ular Tangga klasik kini tampil lebih heboh dan penuh kejutan!
              Keluarkan{" "}
              <span className="text-violet-700 font-black">Kartu Aksi</span>,
              nikmati{" "}
              <span className="text-sky-700 font-black">
                Roda Cuaca Dinamis
              </span>{" "}
              tiap 5 ronde, dan rebut Mahkota dengan angka pas di{" "}
              <span className="text-amber-700 font-black">
                Babak Akhir (91–100)
              </span>
              !
            </p>

            {/* Tombol CTA Utama */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                type="button"
                onClick={handleQuickStartSolo}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base sm:text-lg border-[3px] border-slate-900 shadow-[0_6px_0_0_#0f172a] active:translate-y-1 transition-all"
              >
                <Play className="w-5 h-5 fill-current" />
                Langsung Main Lawan Bot
              </button>

              <button
                type="button"
                onClick={() => scrollToSetup("ONLINE_PARTY")}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl bg-white hover:bg-sky-50 text-slate-900 font-black text-base border-[3px] border-slate-900 shadow-[0_6px_0_0_#0f172a] active:translate-y-1 transition-all"
              >
                <GameModeIcon mode="ONLINE_PARTY" className="w-6 h-6" />
                Buat Room Online
              </button>
            </div>

            {/* Highlight Fitur */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-3 max-w-xl mx-auto lg:mx-0">
              <div className="rounded-2xl bg-white/90 border-2 border-slate-900/15 p-3 shadow-sm flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
                <CardDeckIcon className="w-7 h-7 shrink-0" />
                <div>
                  <div className="font-black text-xs sm:text-sm text-slate-900">
                    5 Kartu Z
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">
                    Dek Aksi Seru
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/90 border-2 border-slate-900/15 p-3 shadow-sm flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
                <WeatherIcon type="SLEEPY_SNAKES" className="w-7 h-7 shrink-0" />
                <div>
                  <div className="font-black text-xs sm:text-sm text-slate-900">
                    Tiap 5 Ronde
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">
                    Roda Cuaca
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/90 border-2 border-slate-900/15 p-3 shadow-sm flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
                <CrownIcon className="w-7 h-7 shrink-0" />
                <div>
                  <div className="font-black text-xs sm:text-sm text-slate-900">
                    2–4 Pemain
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">
                    Online &amp; Bareng
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Preview Papan 2.5D Kanan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="lg:col-span-6"
          >
            <HeroBoardShowcase />
          </motion.div>
        </div>
      </section>

      {/* BAGIAN 2: STUDIO PENGATURAN LOBI FULL-WIDTH */}
      <section
        id="party-setup-studio"
        className="max-w-[1440px] mx-auto px-4 sm:px-8 pb-12 sm:pb-16"
      >
        <div className="rounded-[32px] bg-white/95 backdrop-blur-md border-4 border-slate-900 shadow-[0_12px_0_0_#0f172a] overflow-hidden">
          <div className="bg-gradient-to-r from-[#1A3308] via-[#22440B] to-[#1A3308] px-5 sm:px-8 py-4 border-b-4 border-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-lime-400 bg-[#1A3308] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.jpg"
                  alt="Logo Resmi Ular TanggaZ"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-lime-300 leading-tight">
                  Lobi Pesta &amp; Pengaturan Permainan
                </h2>
                <p className="text-xs font-bold text-emerald-100/90">
                  Pilih mode main, atur tim petualangmu, lalu meluncur ke Pulau
                  Langit!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 border border-lime-300/30 rounded-2xl px-3 py-1.5">
              <span className="text-[11px] font-black text-lime-200 mr-1">
                Stiker Reaksi:
              </span>
              {(["LAUGH", "SHOCK", "CLAP", "SNAKE"] as const).map((st) => (
                <ReactionIcon key={st} sticker={st} className="w-6 h-6" />
              ))}
            </div>
          </div>

          <div className="p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Kiri 7 Kolom: Pilih Mode & Daftar Pemain */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500">
                    Langkah 1 — Pilih Mode Permainan
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                  {[
                    {
                      mode: "VS_BOTS" as GameMode,
                      title: "Lawan Bot",
                      sub: "Solo vs AI Pintar",
                      accent: "from-violet-50 to-purple-100",
                    },
                    {
                      mode: "PASS_AND_PLAY" as GameMode,
                      title: "Main Bareng",
                      sub: "2–4P di 1 Perangkat",
                      accent: "from-amber-50 to-orange-100",
                    },
                    {
                      mode: "ONLINE_PARTY" as GameMode,
                      title: "Room Online",
                      sub: "Kode 4 Huruf",
                      accent: "from-sky-50 to-cyan-100",
                    },
                  ].map((item) => {
                    const active = selectedMode === item.mode;
                    return (
                      <button
                        key={item.mode}
                        type="button"
                        onClick={() => setSelectedMode(item.mode)}
                        className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl border-[3px] transition-all ${
                          active
                            ? `bg-gradient-to-b ${item.accent} border-slate-900 shadow-[0_5px_0_0_#0f172a] -translate-y-0.5`
                            : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        <GameModeIcon
                          mode={item.mode}
                          className="w-9 h-9 sm:w-11 sm:h-11 mb-2"
                        />
                        <span className="font-display font-bold text-xs sm:text-base text-slate-900">
                          {item.title}
                        </span>
                        <span className="text-[10px] sm:text-xs font-bold text-slate-500 mt-0.5">
                          {item.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedMode !== "ONLINE_PARTY" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500">
                      Langkah 2 — Atur Petualang ({playerCount} Pemain)
                    </span>
                    <div className="flex items-center gap-1.5">
                      {[2, 3, 4].map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setPlayerCount(cnt)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-black border-2 transition-all ${
                            playerCount === cnt
                              ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {cnt} Pemain
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {Array.from({ length: playerCount }).map((_, idx) => {
                      const slot = slots[idx];
                      const avatar = AVATARS[slot.avatarIndex % AVATARS.length];
                      const isBotSlot = selectedMode === "VS_BOTS" && idx > 0;

                      return (
                        <div
                          key={idx}
                          className="rounded-2xl bg-slate-50 border-2 border-slate-200 p-3.5 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-slate-900 shadow-sm shrink-0"
                              style={{ backgroundColor: avatar.bgLight }}
                            >
                              <AvatarIcon
                                avatarId={avatar.id}
                                className="w-10 h-10"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                                  {isBotSlot
                                    ? `Lawan AI #${idx}`
                                    : `Pemain #${idx + 1}`}
                                </span>
                                <span
                                  className="text-[11px] font-black px-2 py-0.5 rounded-full"
                                  style={{
                                    backgroundColor: avatar.bgLight,
                                    color: avatar.border,
                                  }}
                                >
                                  {avatar.name}
                                </span>
                              </div>
                              <input
                                type="text"
                                value={slot.name}
                                maxLength={14}
                                onChange={(e) =>
                                  handleUpdateSlot(idx, {
                                    name: e.target.value,
                                  })
                                }
                                placeholder={
                                  isBotSlot
                                    ? "Nama Bot"
                                    : `Pemain ${idx + 1}`
                                }
                                className="w-full rounded-xl bg-white border-2 border-slate-300 px-3 py-1.5 text-sm font-extrabold text-slate-900 focus:outline-none focus:border-slate-900"
                              />
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
                            <div className="flex items-center gap-1.5">
                              {AVATARS.map((av, avIdx) => {
                                const picked = slot.avatarIndex === avIdx;
                                return (
                                  <button
                                    key={av.id}
                                    type="button"
                                    onClick={() =>
                                      handleUpdateSlot(idx, {
                                        avatarIndex: avIdx,
                                      })
                                    }
                                    title={av.name}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all ${
                                      picked
                                        ? "border-slate-900 scale-110 shadow-sm"
                                        : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                                    style={{ backgroundColor: av.bgLight }}
                                  >
                                    <AvatarIcon
                                      avatarId={av.id}
                                      className="w-7 h-7"
                                    />
                                  </button>
                                );
                              })}
                            </div>

                            {isBotSlot && (
                              <div className="flex items-center gap-1.5">
                                {BOT_PERSONALITIES.map((bp) => (
                                  <button
                                    key={bp.id}
                                    type="button"
                                    onClick={() =>
                                      handleUpdateSlot(idx, {
                                        botPersonality: bp.id,
                                      })
                                    }
                                    title={bp.desc}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-black border-2 transition-all ${
                                      slot.botPersonality === bp.id
                                        ? "bg-violet-600 text-white border-slate-900 shadow-sm"
                                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                                    }`}
                                  >
                                    <BotPersonalityIcon
                                      personality={bp.id}
                                      className="w-4 h-4"
                                    />
                                    {bp.short}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={handleLaunchLocal}
                    className="w-full py-4 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base sm:text-lg border-[3px] border-slate-900 shadow-[0_6px_0_0_#0f172a] active:translate-y-1 transition-all flex items-center justify-center gap-2.5"
                  >
                    <ActionCardIcon type="DOUBLE_ROLL" className="w-7 h-7" />
                    MULAI PERMAINAN SEKARANG!
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                /* Pengaturan Room Online */
                <div className="space-y-4">
                  <div className="rounded-2xl bg-sky-50 border-2 border-sky-200 p-3.5 text-xs font-extrabold text-sky-900 flex items-center gap-2.5">
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        isSupabaseConfigured
                          ? "bg-emerald-500"
                          : "bg-amber-400 animate-pulse"
                      }`}
                    />
                    <span>
                      {isSupabaseConfigured
                        ? "Supabase Realtime Aktif — Undang teman dari HP atau laptop mana saja!"
                        : "Mode Realtime Multi-Tab Aktif — Buka 2 tab browser dengan kode 4 huruf yang sama untuk langsung tes mabar!"}
                    </span>
                  </div>

                  {!onlineConnected ? (
                    <>
                      <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3">
                        <label className="block text-xs font-black uppercase text-slate-500">
                          Profil Petualangmu
                        </label>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-slate-900 shrink-0"
                            style={{
                              backgroundColor:
                                AVATARS[onlineAvatarIdx % AVATARS.length]
                                  .bgLight,
                            }}
                          >
                            <AvatarIcon
                              avatarId={
                                AVATARS[onlineAvatarIdx % AVATARS.length].id
                              }
                              className="w-10 h-10"
                            />
                          </div>
                          <input
                            type="text"
                            value={onlineName}
                            maxLength={14}
                            onChange={(e) => setOnlineName(e.target.value)}
                            placeholder="Nama Petualangmu"
                            className="flex-1 min-w-0 rounded-xl bg-white border-2 border-slate-300 px-3 py-2 text-sm font-extrabold text-slate-900"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          {AVATARS.map((av, avIdx) => (
                            <button
                              key={av.id}
                              type="button"
                              onClick={() => setOnlineAvatarIdx(avIdx)}
                              title={av.name}
                              className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all ${
                                onlineAvatarIdx === avIdx
                                  ? "border-slate-900 scale-110 shadow-sm"
                                  : "border-transparent opacity-60 hover:opacity-100"
                              }`}
                              style={{ backgroundColor: av.bgLight }}
                            >
                              <AvatarIcon
                                avatarId={av.id}
                                className="w-8 h-8"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => handleCreateOrJoinOnline(true)}
                          className="py-3.5 px-4 rounded-2xl bg-gradient-to-b from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 font-black text-sm border-[3px] border-slate-900 shadow-[0_5px_0_0_#0f172a] flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          Buat Room 4 Huruf
                        </button>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={joinCodeInput}
                            maxLength={4}
                            onChange={(e) =>
                              setJoinCodeInput(e.target.value.toUpperCase())
                            }
                            placeholder="KODE"
                            className="w-24 text-center uppercase tracking-widest rounded-2xl bg-white border-[3px] border-slate-900 px-3 py-3 text-base font-black text-slate-900"
                          />
                          <button
                            type="button"
                            disabled={joinCodeInput.trim().length !== 4}
                            onClick={() => handleCreateOrJoinOnline(false)}
                            className="flex-1 py-3.5 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-sm border-[3px] border-slate-900 shadow-[0_5px_0_0_#0f172a] inline-flex items-center justify-center gap-1.5"
                          >
                            Gabung
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 border-[3px] border-slate-900 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-extrabold uppercase text-slate-500">
                            Kode Undangan Room
                          </span>
                          <div className="font-display text-3xl font-bold tracking-widest text-slate-900">
                            {onlineRoomCode}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={onLeaveOnlineRoom}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs font-black"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Keluar
                        </button>
                      </div>

                      <p className="text-xs font-bold text-emerald-700">
                        {onlineModeLabel}
                      </p>

                      <div className="space-y-2">
                        <div className="text-xs font-black uppercase text-slate-500 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          Pemain di Lobi ({onlinePresences.length}/4)
                        </div>
                        {onlinePresences.map((p) => (
                          <div
                            key={p.playerId}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-white border-2 border-slate-200"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center border border-slate-900/20 shrink-0"
                                style={{ backgroundColor: `${p.color}22` }}
                              >
                                <AvatarIcon
                                  avatarId={p.avatarId}
                                  className="w-7 h-7"
                                />
                              </div>
                              <span className="font-extrabold text-sm text-slate-800 truncate">
                                {p.name}
                                {p.playerId === localOnlinePlayerId && " (Kamu)"}
                              </span>
                              {p.isHost && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black shrink-0">
                                  <Crown className="w-3 h-3" /> HOST
                                </span>
                              )}
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shrink-0 ${
                                p.isReady
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {p.isReady ? (
                                <>
                                  <Check className="w-3.5 h-3.5" /> Siap
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3.5 h-3.5" /> Menunggu
                                </>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
                        <button
                          type="button"
                          onClick={onToggleOnlineReady}
                          className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm"
                        >
                          Ubah Status Siap
                        </button>
                        {isOnlineHost && (
                          <button
                            type="button"
                            onClick={onHostStartOnlineMatch}
                            className="flex-1 py-3 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 font-black text-sm border-2 border-slate-900 shadow-[0_4px_0_0_#0f172a]"
                          >
                            Mulai Match ({onlinePresences.length}P)
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Kanan 5 Kolom: Panduan Kartu Aksi & Cuaca */}
            <div
              id="party-mechanics"
              className="lg:col-span-5 flex flex-col gap-4"
            >
              <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-50 border-2 border-violet-200 p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <CardDeckIcon className="w-6 h-6" />
                  <h3 className="font-display text-base font-bold text-violet-950">
                    Kartu Aksi (Dek Pesta)
                  </h3>
                </div>
                <p className="text-xs font-bold text-violet-800/90 mb-3">
                  Mulai dengan 2 kartu acak &amp; dapat +1 setiap mendarat di
                  kotak Hadiah Misteri (?). Pakai 1 kartu sebelum lempar dadu:
                </p>
                <div className="space-y-2">
                  {CARD_KEYS.map((key) => {
                    const card = ACTION_CARD_TEMPLATES[key];
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-3 p-2 rounded-xl bg-white/90 border border-violet-200/80 shadow-sm"
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-slate-900/20"
                          style={{ backgroundColor: `${card.color}22` }}
                        >
                          <ActionCardIcon type={key} className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-xs text-slate-900">
                            {card.title}
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 leading-tight">
                            {card.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-cyan-50 border-2 border-sky-200 p-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <WeatherIcon type="TAILWIND" className="w-6 h-6" />
                  <h3 className="font-display text-base font-bold text-sky-950">
                    Cuaca Dinamis (Tiap 5 Ronde)
                  </h3>
                </div>
                <div className="space-y-2">
                  {WEATHER_KEYS.map((wKey) => {
                    const info = WEATHER_EVENTS[wKey];
                    return (
                      <div
                        key={wKey}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-white/90 border border-sky-200/80"
                      >
                        <WeatherIcon type={wKey} className="w-7 h-7 shrink-0" />
                        <div>
                          <div className="font-black text-xs text-slate-900">
                            {info.title}
                          </div>
                          <div className="text-[11px] font-semibold text-slate-600 leading-tight">
                            {info.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 p-4 flex items-center gap-3">
                <div className="flex items-center -space-x-2 shrink-0">
                  <CrownIcon className="w-9 h-9" />
                  <DizzyIcon className="w-7 h-7" />
                </div>
                <div>
                  <div className="font-display font-bold text-sm text-amber-950">
                    Babak Akhir (Kotak 91–100)
                  </div>
                  <p className="text-xs font-bold text-amber-900/90 leading-snug">
                    Lempar angka yang <span className="underline">PAS</span>{" "}
                    untuk menang di Kotak 100! Jika kelebihan, pionmu akan
                    memantul mundur sambil pusing!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
