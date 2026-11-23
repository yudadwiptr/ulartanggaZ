"use client";

import React from "react";
import {
  ActionCardType,
  BotPersonality,
  ReactionSticker,
  TickerIconType,
  WeatherType,
} from "@/types/game";

interface IconProps {
  className?: string;
}

/**
 * Handcrafted Vector Logo Mark matching the user's Ular TanggaZ green Snake + Ladder Z brand
 */
export function BrandZLogo({ className = "w-10 h-10" }: IconProps) {
  return (
    <svg viewBox="0 0 128 128" className={className} aria-hidden="true">
      <rect width="128" height="128" rx="28" fill="#1A3308" />
      <rect
        x="5"
        y="5"
        width="118"
        height="118"
        rx="23"
        fill="none"
        stroke="#84CC16"
        strokeWidth="5"
      />
      <path
        d="M26 42 C26 24 44 22 66 22 L80 18 C89 16 98 22 100 28 C100 35 93 40 84 40 L48 40 C38 40 32 45 26 52 Z"
        fill="#A3E635"
      />
      <rect
        x="78"
        y="25"
        width="8"
        height="8"
        rx="1.5"
        transform="rotate(45 82 29)"
        fill="#1A3308"
      />
      <path d="M102 30 L114 23 L110 30 L114 37 Z" fill="#BEF264" />
      <path d="M68 42 L80 42 L48 92 L36 92 Z" fill="#A3E635" />
      <path d="M84 42 L96 42 L64 92 L52 92 Z" fill="#A3E635" />
      <rect x="68" y="48" width="16" height="5" rx="2" fill="#A3E635" />
      <rect x="61" y="59" width="16" height="5" rx="2" fill="#A3E635" />
      <rect x="54" y="70" width="16" height="5" rx="2" fill="#A3E635" />
      <rect x="47" y="81" width="16" height="5" rx="2" fill="#A3E635" />
      <path
        d="M32 92 C28 92 26 98 30 104 C35 110 56 110 74 106 C92 102 102 88 102 74 C98 85 88 94 72 96 L46 96 Z"
        fill="#A3E635"
      />
    </svg>
  );
}

/**
 * Reusable inner SVG artwork for the 6 Explorer Animal Mascots (viewBox centered 0..64)
 * Can be rendered inside <svg> HTML components OR embedded directly inside the 10x10 SVG Board!
 */
export function AvatarArtwork({ avatarId }: { avatarId: string }) {
  switch (avatarId) {
    case "fox":
      return (
        <g>
          {/* Ears */}
          <path d="M12 26 L16 8 L28 18 Z" fill="#EA580C" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M52 26 L48 8 L36 18 Z" fill="#EA580C" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M16 22 L18 13 L24 19 Z" fill="#FED7AA" />
          <path d="M48 22 L46 13 L40 19 Z" fill="#FED7AA" />
          {/* Head */}
          <ellipse cx="32" cy="35" rx="22" ry="18" fill="#F97316" stroke="#1E293B" strokeWidth="2.5" />
          {/* White Cheeks */}
          <path d="M11 36 Q20 33 32 45 Q44 33 53 36 Q48 53 32 53 Q16 53 11 36 Z" fill="#FFF7ED" />
          {/* Eyes */}
          <circle cx="23" cy="32" r="3.5" fill="#0F172A" />
          <circle cx="41" cy="32" r="3.5" fill="#0F172A" />
          <circle cx="24" cy="30.8" r="1.2" fill="#FFFFFF" />
          <circle cx="42" cy="30.8" r="1.2" fill="#FFFFFF" />
          {/* Nose & Smile */}
          <ellipse cx="32" cy="40" rx="4" ry="3" fill="#0F172A" />
          <path d="M27 45 Q32 49 37 45" fill="none" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    case "panda":
      return (
        <g>
          {/* Round Dark Ears */}
          <circle cx="15" cy="17" r="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          <circle cx="49" cy="17" r="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
          {/* Head */}
          <circle cx="32" cy="34" r="21" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
          {/* Eye Patches */}
          <ellipse cx="22" cy="33" rx="6.5" ry="7.5" transform="rotate(-15 22 33)" fill="#1E293B" />
          <ellipse cx="42" cy="33" rx="6.5" ry="7.5" transform="rotate(15 42 33)" fill="#1E293B" />
          {/* Eyes */}
          <circle cx="23" cy="32" r="2.6" fill="#FFFFFF" />
          <circle cx="41" cy="32" r="2.6" fill="#FFFFFF" />
          <circle cx="23.5" cy="32" r="1.2" fill="#0F172A" />
          <circle cx="40.5" cy="32" r="1.2" fill="#0F172A" />
          {/* Rosy Cheeks */}
          <circle cx="15" cy="41" r="3.2" fill="#FDA4AF" opacity="0.7" />
          <circle cx="49" cy="41" r="3.2" fill="#FDA4AF" opacity="0.7" />
          {/* Nose & Smile */}
          <ellipse cx="32" cy="40" rx="4.2" ry="3" fill="#0F172A" />
          <path d="M27 45 Q32 49 37 45" fill="none" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    case "frog":
      return (
        <g>
          {/* Raised Frog Eyes */}
          <circle cx="20" cy="20" r="9.5" fill="#22C55E" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="44" cy="20" r="9.5" fill="#22C55E" stroke="#1E293B" strokeWidth="2.5" />
          {/* Head */}
          <ellipse cx="32" cy="37" rx="23" ry="17" fill="#22C55E" stroke="#1E293B" strokeWidth="2.5" />
          {/* Lighter Belly/Chin */}
          <ellipse cx="32" cy="44" rx="16" ry="8" fill="#BBF7D0" />
          {/* Eye Whites & Pupils */}
          <circle cx="20" cy="20" r="5.5" fill="#FFFFFF" />
          <circle cx="44" cy="20" r="5.5" fill="#FFFFFF" />
          <circle cx="20.5" cy="20" r="2.8" fill="#0F172A" />
          <circle cx="43.5" cy="20" r="2.8" fill="#0F172A" />
          <circle cx="21.5" cy="18.8" r="1" fill="#FFFFFF" />
          <circle cx="44.5" cy="18.8" r="1" fill="#FFFFFF" />
          {/* Cheeks & Big Happy Smile */}
          <circle cx="15" cy="37" r="3.5" fill="#FB7185" opacity="0.6" />
          <circle cx="49" cy="37" r="3.5" fill="#FB7185" opacity="0.6" />
          <path d="M20 38 Q32 48 44 38" fill="none" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      );
    case "lion":
      return (
        <g>
          {/* Fluffy Mane */}
          <circle cx="32" cy="34" r="25" fill="#D97706" stroke="#1E293B" strokeWidth="2.5" strokeDasharray="12 3" />
          <circle cx="32" cy="34" r="22" fill="#F59E0B" />
          {/* Ears */}
          <circle cx="17" cy="18" r="5.5" fill="#FBBF24" stroke="#1E293B" strokeWidth="2" />
          <circle cx="47" cy="18" r="5.5" fill="#FBBF24" stroke="#1E293B" strokeWidth="2" />
          {/* Face */}
          <circle cx="32" cy="35" r="16.5" fill="#FDE047" stroke="#1E293B" strokeWidth="2.2" />
          {/* Eyes */}
          <circle cx="25" cy="32" r="3.2" fill="#0F172A" />
          <circle cx="39" cy="32" r="3.2" fill="#0F172A" />
          <circle cx="26" cy="30.8" r="1.1" fill="#FFFFFF" />
          <circle cx="40" cy="30.8" r="1.1" fill="#FFFFFF" />
          {/* Snout */}
          <path d="M27 38 L37 38 L32 43 Z" fill="#92400E" />
          <path d="M26 44 Q32 48 38 44" fill="none" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );
    case "koala":
      return (
        <g>
          {/* Fluffy Big Ears */}
          <circle cx="13" cy="28" r="11" fill="#94A3B8" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="51" cy="28" r="11" fill="#94A3B8" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="13" cy="28" r="6" fill="#F1F5F9" />
          <circle cx="51" cy="28" r="6" fill="#F1F5F9" />
          {/* Head */}
          <circle cx="32" cy="35" r="19.5" fill="#CBD5E1" stroke="#1E293B" strokeWidth="2.5" />
          {/* Eyes */}
          <circle cx="22" cy="33" r="3.2" fill="#0F172A" />
          <circle cx="42" cy="33" r="3.2" fill="#0F172A" />
          <circle cx="23" cy="31.8" r="1.1" fill="#FFFFFF" />
          <circle cx="43" cy="31.8" r="1.1" fill="#FFFFFF" />
          {/* Big Koala Nose */}
          <ellipse cx="32" cy="37" rx="5.2" ry="7.2" fill="#334155" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="30.5" cy="34.5" r="1.4" fill="#94A3B8" />
          {/* Rosy Cheeks */}
          <circle cx="19" cy="41" r="3" fill="#F9A8D4" opacity="0.7" />
          <circle cx="45" cy="41" r="3" fill="#F9A8D4" opacity="0.7" />
        </g>
      );
    case "bunny":
    default:
      return (
        <g>
          {/* Tall Bunny Ears */}
          <ellipse cx="22" cy="16" rx="5.5" ry="13" transform="rotate(-10 22 16)" fill="#FCE7F3" stroke="#1E293B" strokeWidth="2.5" />
          <ellipse cx="42" cy="16" rx="5.5" ry="13" transform="rotate(10 42 16)" fill="#FCE7F3" stroke="#1E293B" strokeWidth="2.5" />
          <ellipse cx="22" cy="16" rx="2.6" ry="8.5" transform="rotate(-10 22 16)" fill="#F472B6" />
          <ellipse cx="42" cy="16" rx="2.6" ry="8.5" transform="rotate(10 42 16)" fill="#F472B6" />
          {/* Head */}
          <ellipse cx="32" cy="38" rx="20" ry="17" fill="#FFF1F2" stroke="#1E293B" strokeWidth="2.5" />
          {/* Eyes */}
          <circle cx="23" cy="35" r="3.3" fill="#0F172A" />
          <circle cx="41" cy="35" r="3.3" fill="#0F172A" />
          <circle cx="24" cy="33.8" r="1.2" fill="#FFFFFF" />
          <circle cx="42" cy="33.8" r="1.2" fill="#FFFFFF" />
          {/* Cheeks & Nose */}
          <circle cx="17" cy="41" r="3.2" fill="#F9A8D4" opacity="0.8" />
          <circle cx="47" cy="41" r="3.2" fill="#F9A8D4" opacity="0.8" />
          <ellipse cx="32" cy="40" rx="3.2" ry="2.2" fill="#EC4899" />
          <path d="M28 45 Q32 48 36 45" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
  }
}

export function AvatarIcon({
  avatarId,
  className = "w-8 h-8",
}: {
  avatarId: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <AvatarArtwork avatarId={avatarId} />
    </svg>
  );
}

/**
 * Custom Multi-Color SVG Icons for all 5 Action Cards
 */
export function ActionCardIcon({
  type,
  className = "w-6 h-6",
}: {
  type: ActionCardType;
  className?: string;
}) {
  switch (type) {
    case "DOUBLE_ROLL":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="4" y="14" width="22" height="22" rx="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" transform="rotate(-10 15 25)" />
          <circle cx="11" cy="21" r="2.2" fill="#EF4444" />
          <circle cx="19" cy="29" r="2.2" fill="#EF4444" />
          <rect x="21" y="10" width="22" height="22" rx="5" fill="#FEF08A" stroke="#0F172A" strokeWidth="3" transform="rotate(8 32 21)" />
          <circle cx="28" cy="17" r="2" fill="#0F172A" />
          <circle cx="36" cy="17" r="2" fill="#0F172A" />
          <circle cx="32" cy="21" r="2" fill="#0F172A" />
          <circle cx="28" cy="25" r="2" fill="#0F172A" />
          <circle cx="36" cy="25" r="2" fill="#0F172A" />
        </svg>
      );
    case "LADDER_BUILDER":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <line x1="15" y1="6" x2="15" y2="42" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
          <line x1="33" y1="6" x2="33" y2="42" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
          <line x1="15" y1="13" x2="33" y2="13" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="15" y1="24" x2="33" y2="24" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="15" y1="35" x2="33" y2="35" stroke="#F59E0B" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M38 6 L40 11 L45 13 L40 15 L38 20 L36 15 L31 13 L36 11 Z" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" />
        </svg>
      );
    case "BANANA_PEEL":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M24 8 C26 15 36 22 42 32 C34 34 28 31 24 25 C20 31 14 34 6 32 C12 22 22 15 24 8 Z" fill="#FACC15" stroke="#0F172A" strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M24 12 C24 22 28 32 34 39 C26 39 22 33 24 24 C20 33 16 39 11 38 C17 31 22 22 24 12 Z" fill="#FEF08A" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="21.5" y="5" width="5" height="6" rx="2" fill="#854D0E" stroke="#0F172A" strokeWidth="2" />
        </svg>
      );
    case "FRIENDLY_SWAP":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M10 21 C10 12 18 8 27 8 L32 8 L28 4 M32 8 L28 12" fill="none" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 21 C10 12 18 8 27 8 L33 8" fill="none" stroke="#38BDF8" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M28 3 L36 8 L28 13 Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
          <path d="M38 27 C38 36 30 40 21 40 L15 40" fill="none" stroke="#C084FC" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M20 35 L12 40 L20 45 Z" fill="#C084FC" stroke="#0F172A" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case "SNAKE_WHISTLE":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M8 34 L34 12 L40 19 L14 41 Z" fill="#F472B6" stroke="#0F172A" strokeWidth="2.8" strokeLinejoin="round" />
          <circle cx="19" cy="30" r="2.2" fill="#0F172A" />
          <circle cx="25" cy="25" r="2.2" fill="#0F172A" />
          <circle cx="31" cy="20" r="2.2" fill="#0F172A" />
          {/* Floating Musical Note */}
          <path d="M34 33 V24 L42 22 V31" fill="none" stroke="#FDE047" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32" cy="34" r="3" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" />
          <circle cx="40" cy="32" r="3" fill="#FDE047" stroke="#0F172A" strokeWidth="1.5" />
        </svg>
      );
  }
}

/**
 * Custom Multi-Color SVG Icons for Dynamic Weather Events
 */
export function WeatherIcon({
  type,
  className = "w-7 h-7",
}: {
  type: WeatherType;
  className?: string;
}) {
  switch (type) {
    case "TAILWIND":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M8 20 H32 C37 20 39 14 35 11 C31 9 28 12 28 14" fill="none" stroke="#0284C7" strokeWidth="4" strokeLinecap="round" />
          <path d="M6 28 H38 C43 28 44 35 39 37 C35 39 32 36 33 33" fill="none" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
          <path d="M12 36 H25" fill="none" stroke="#7DD3FC" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "SLEEPY_SNAKES":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="22" cy="29" r="14" fill="#22C55E" stroke="#0F172A" strokeWidth="2.8" />
          <path d="M15 27 Q18 30 21 27" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M24 27 Q27 30 30 27" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M31 11 H39 L31 19 H39" fill="none" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M39 5 H44 L39 10 H44" fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "GOLDEN_FEVER":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <rect x="8" y="18" width="32" height="24" rx="5" fill="#8B5CF6" stroke="#0F172A" strokeWidth="2.8" />
          <rect x="6" y="13" width="36" height="8" rx="3" fill="#A78BFA" stroke="#0F172A" strokeWidth="2.8" />
          <rect x="20" y="13" width="8" height="29" fill="#FACC15" stroke="#0F172A" strokeWidth="2.2" />
          <path d="M24 13 C16 5 11 10 16 13 Z" fill="#FDE047" stroke="#0F172A" strokeWidth="2.2" />
          <path d="M24 13 C32 5 37 10 32 13 Z" fill="#FDE047" stroke="#0F172A" strokeWidth="2.2" />
        </svg>
      );
    case "CLEAR":
    default:
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="24" cy="24" r="11" fill="#FACC15" stroke="#0F172A" strokeWidth="2.8" />
          <g stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round">
            <line x1="24" y1="4" x2="24" y2="9" />
            <line x1="24" y1="39" x2="24" y2="44" />
            <line x1="4" y1="24" x2="9" y2="24" />
            <line x1="39" y1="24" x2="44" y2="24" />
            <line x1="10" y1="10" x2="13.5" y2="13.5" />
            <line x1="34.5" y1="34.5" x2="38" y2="38" />
            <line x1="38" y1="10" x2="34.5" y2="13.5" />
            <line x1="13.5" y1="34.5" x2="10" y2="38" />
          </g>
        </svg>
      );
  }
}

/**
 * Custom Illustrated Reaction Stickers (Zero Unicode emojis!)
 */
export function ReactionIcon({
  sticker,
  className = "w-6 h-6",
}: {
  sticker: ReactionSticker;
  className?: string;
}) {
  switch (sticker) {
    case "LAUGH":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="#FDE047" stroke="#0F172A" strokeWidth="3" />
          <path d="M13 20 Q17 15 21 20" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <path d="M27 20 Q31 15 35 20" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <path d="M13 26 Q24 40 35 26 Z" fill="#EF4444" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M16 26 H32" stroke="#FFFFFF" strokeWidth="3" />
          <path d="M9 24 C6 28 8 33 12 31 C13 29 11 26 9 24 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
          <path d="M39 24 C42 28 40 33 36 31 C35 29 37 26 39 24 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
        </svg>
      );
    case "SHOCK":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="#BAE6FD" stroke="#0F172A" strokeWidth="3" />
          <circle cx="17" cy="20" r="4.8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.2" />
          <circle cx="31" cy="20" r="4.8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.2" />
          <circle cx="17" cy="20" r="2" fill="#0F172A" />
          <circle cx="31" cy="20" r="2" fill="#0F172A" />
          <ellipse cx="24" cy="33" rx="5.5" ry="7" fill="#0F172A" />
          <path d="M37 11 C40 16 39 20 36 19 C34 18 35 14 37 11 Z" fill="#38BDF8" stroke="#0369A1" strokeWidth="1.5" />
        </svg>
      );
    case "CLAP":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <path d="M12 10 L16 14 M24 6 V11 M36 10 L32 14" stroke="#F59E0B" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M14 29 L22 15 C24 12 28 14 27 18 L24 24 L33 17 C36 15 39 18 37 21 L29 35 C25 40 17 40 14 35 Z" fill="#FDE047" stroke="#0F172A" strokeWidth="2.8" strokeLinejoin="round" />
          <path d="M10 31 L17 19 C19 16 23 18 22 22 L19 36 C16 39 10 36 10 31 Z" fill="#FBBF24" stroke="#0F172A" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
      );
    case "SNAKE":
      return (
        <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
          <circle cx="24" cy="22" r="17" fill="#22C55E" stroke="#0F172A" strokeWidth="3" />
          <circle cx="17" cy="19" r="4.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <circle cx="31" cy="19" r="4.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
          <circle cx="17.5" cy="19" r="2.2" fill="#0F172A" />
          <circle cx="30.5" cy="19" r="2.2" fill="#0F172A" />
          <path d="M24 36 V43 M24 43 L20 46 M24 43 L28 46" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
          <path d="M16 29 Q24 34 32 29" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
  }
}

/**
 * General Game & UI Illustrated SVG Icons
 */
export function CrownIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path d="M6 34 L10 14 L19 23 L24 10 L29 23 L38 14 L42 34 Z" fill="#FACC15" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />
      <rect x="8" y="34" width="32" height="6" rx="2.5" fill="#F59E0B" stroke="#0F172A" strokeWidth="2.8" />
      <circle cx="24" cy="26" r="3" fill="#EF4444" />
      <circle cx="14" cy="27" r="2.2" fill="#38BDF8" />
      <circle cx="34" cy="27" r="2.2" fill="#10B981" />
    </svg>
  );
}

export function DizzyIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <ellipse cx="24" cy="24" rx="18" ry="9" transform="rotate(-20 24 24)" fill="none" stroke="#38BDF8" strokeWidth="3.5" strokeDasharray="8 5" />
      <path d="M11 14 L13 18 L17 19 L13 21 L11 25 L9 21 L5 19 L9 18 Z" fill="#FACC15" stroke="#0F172A" strokeWidth="1.5" />
      <path d="M36 22 L38 26 L42 27 L38 29 L36 33 L34 29 L30 27 L34 26 Z" fill="#FACC15" stroke="#0F172A" strokeWidth="1.5" />
    </svg>
  );
}

export function CardDeckIcon({ className = "w-5 h-5" }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect x="6" y="10" width="24" height="32" rx="5" fill="#A78BFA" stroke="#0F172A" strokeWidth="2.8" transform="rotate(-10 18 26)" />
      <rect x="17" y="7" width="24" height="32" rx="5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.8" transform="rotate(6 29 23)" />
      <path d="M29 17 L31 22 L36 23 L31 25 L29 30 L27 25 L22 23 L27 22 Z" fill="#F59E0B" />
    </svg>
  );
}

export function BotPersonalityIcon({
  personality,
  className = "w-4 h-4",
}: {
  personality: BotPersonality;
  className?: string;
}) {
  if (personality === "CAUTIOUS") {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <path d="M16 3 L27 7 V15 C27 22 22 27 16 29 C10 27 5 22 5 15 V7 Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M12 16 L15 19 L21 12" fill="none" stroke="#FFFFFF" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (personality === "CHAOTIC") {
    return (
      <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
        <path d="M18 3 L7 18 H15 L13 29 L25 14 H17 Z" fill="#FACC15" stroke="#0F172A" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="#34D399" stroke="#0F172A" strokeWidth="2.4" />
      <polygon points="16,7 20,16 16,25 12,16" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.8" strokeLinejoin="round" />
      <polygon points="16,7 20,16 12,16" fill="#EF4444" />
    </svg>
  );
}

export function GameModeIcon({
  mode,
  className = "w-8 h-8",
}: {
  mode: "VS_BOTS" | "PASS_AND_PLAY" | "ONLINE_PARTY";
  className?: string;
}) {
  if (mode === "VS_BOTS") {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <line x1="24" y1="6" x2="24" y2="13" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="6" r="3" fill="#EF4444" stroke="#0F172A" strokeWidth="2" />
        <rect x="9" y="13" width="30" height="26" rx="8" fill="#8B5CF6" stroke="#0F172A" strokeWidth="3" />
        <rect x="14" y="19" width="20" height="10" rx="4" fill="#1E293B" />
        <circle cx="20" cy="24" r="2.6" fill="#38BDF8" />
        <circle cx="28" cy="24" r="2.6" fill="#38BDF8" />
        <path d="M18 33 H30" stroke="#DDD6FE" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (mode === "PASS_AND_PLAY") {
    return (
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <rect x="6" y="14" width="36" height="20" rx="10" fill="#F97316" stroke="#0F172A" strokeWidth="3" />
        <path d="M16 20 V28 M12 24 H20" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="31" cy="21" r="2.4" fill="#FEF08A" />
        <circle cx="35" cy="25" r="2.4" fill="#86EFAC" />
        <circle cx="27" cy="25" r="2.4" fill="#BAE6FD" />
        <circle cx="31" cy="28" r="2.4" fill="#FDA4AF" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="18" fill="#0EA5E9" stroke="#0F172A" strokeWidth="3" />
      <ellipse cx="24" cy="24" rx="9" ry="18" fill="none" stroke="#E0F2FE" strokeWidth="2.5" />
      <line x1="6" y1="24" x2="42" y2="24" stroke="#E0F2FE" strokeWidth="2.5" />
      <path d="M10 15 Q24 19 38 15" fill="none" stroke="#E0F2FE" strokeWidth="2.2" />
      <path d="M10 33 Q24 29 38 33" fill="none" stroke="#E0F2FE" strokeWidth="2.2" />
    </svg>
  );
}

export function TickerEventIcon({
  icon,
  className = "w-5 h-5",
}: {
  icon: TickerIconType;
  className?: string;
}) {
  switch (icon) {
    case "DICE":
      return <ActionCardIcon type="DOUBLE_ROLL" className={className} />;
    case "LADDER":
      return <ActionCardIcon type="LADDER_BUILDER" className={className} />;
    case "BANANA":
      return <ActionCardIcon type="BANANA_PEEL" className={className} />;
    case "SWAP":
      return <ActionCardIcon type="FRIENDLY_SWAP" className={className} />;
    case "WHISTLE":
      return <ActionCardIcon type="SNAKE_WHISTLE" className={className} />;
    case "SNAKE":
      return <ReactionIcon sticker="SNAKE" className={className} />;
    case "SLEEPY":
      return <WeatherIcon type="SLEEPY_SNAKES" className={className} />;
    case "TAILWIND":
      return <WeatherIcon type="TAILWIND" className={className} />;
    case "GIFT":
      return <WeatherIcon type="GOLDEN_FEVER" className={className} />;
    case "DIZZY":
      return <DizzyIcon className={className} />;
    case "CROWN":
      return <CrownIcon className={className} />;
    case "ISLAND":
    default:
      return <WeatherIcon type="CLEAR" className={className} />;
  }
}
