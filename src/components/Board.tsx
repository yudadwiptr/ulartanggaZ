"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BOARD_LADDERS,
  BOARD_SNAKES,
  getTileCoordinates,
} from "@/lib/gameEngine";
import {
  ActionCardIcon,
  AvatarArtwork,
  WeatherIcon,
} from "@/components/icons/GameIcons";
import {
  BananaTrap,
  LadderLink,
  PlayerState,
  SnakeLink,
  WeatherType,
} from "@/types/game";

interface BoardProps {
  players: PlayerState[];
  currentPlayerId: string;
  mysteryTiles: number[];
  bananaTraps: BananaTrap[];
  tempLadders: LadderLink[];
  weatherType: WeatherType;
  animatingPlayerId: string | null;
  animatedTileOverride: number | null;
}

function buildSnakePath(headTile: number, tailTile: number) {
  const head = getTileCoordinates(headTile);
  const tail = getTileCoordinates(tailTile);

  const dx = tail.x - head.x;
  const dy = tail.y - head.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const waveAmp = Math.min(85, len * 0.24);

  const c1x = head.x + dx * 0.28 + nx * waveAmp;
  const c1y = head.y + dy * 0.28 + ny * waveAmp;
  const midX = head.x + dx * 0.5;
  const midY = head.y + dy * 0.5;
  const c2x = head.x + dx * 0.72 - nx * waveAmp;
  const c2y = head.y + dy * 0.72 - ny * waveAmp;

  const d = `M ${head.x} ${head.y} Q ${c1x} ${c1y} ${midX} ${midY} T ${tail.x} ${tail.y}`;
  return { d, head, tail };
}

function buildLadderGeometry(fromTile: number, toTile: number) {
  const start = getTileCoordinates(fromTile);
  const end = getTileCoordinates(toTile);

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = (-dy / dist) * 18;
  const ny = (dx / dist) * 18;

  const leftRail = {
    x1: start.x + nx,
    y1: start.y + ny,
    x2: end.x + nx,
    y2: end.y + ny,
  };
  const rightRail = {
    x1: start.x - nx,
    y1: start.y - ny,
    x2: end.x - nx,
    y2: end.y - ny,
  };

  const rungCount = Math.max(4, Math.floor(dist / 36));
  const rungs: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  for (let i = 1; i < rungCount; i++) {
    const t = i / rungCount;
    const cx = start.x + dx * t;
    const cy = start.y + dy * t;
    rungs.push({
      x1: cx + nx,
      y1: cy + ny,
      x2: cx - nx,
      y2: cy - ny,
    });
  }

  return { leftRail, rightRail, rungs, start, end };
}

export default function Board({
  players,
  currentPlayerId,
  mysteryTiles,
  bananaTraps,
  tempLadders,
  weatherType,
  animatingPlayerId,
  animatedTileOverride,
}: BoardProps) {
  const tiles = useMemo(() => {
    const list = [];
    for (let t = 1; t <= 100; t++) {
      const coords = getTileCoordinates(t);
      const isFinalDash = t >= 91 && t <= 99;
      const isCrown = t === 100;
      const isStart = t === 1;
      const isEven = (coords.rowFromBottom + coords.col) % 2 === 0;

      let fill = isEven ? "#DCFCE7" : "#FEF9C3";
      let stroke = "#BBF7D0";

      if (isFinalDash) {
        fill = isEven ? "#E0F2FE" : "#BAE6FD";
        stroke = "#7DD3FC";
      }
      if (isCrown) {
        fill = "#FEF08A";
        stroke = "#F59E0B";
      }
      if (isStart) {
        fill = "#BBF7D0";
        stroke = "#22C55E";
      }

      const isRightRow = coords.rowFromBottom % 2 === 0;
      const isRowEnd = t % 10 === 0 && t < 100;
      const flowArrow = isRowEnd ? "↑" : isRightRow ? "→" : "←";

      list.push({
        tile: t,
        ...coords,
        fill,
        stroke,
        isFinalDash,
        isCrown,
        isStart,
        flowArrow,
      });
    }
    return list;
  }, []);

  const allLadders = useMemo(
    () => [...BOARD_LADDERS, ...tempLadders],
    [tempLadders]
  );

  const isSnakesAsleep = weatherType === "SLEEPY_SNAKES";

  const displayPlayers = useMemo(() => {
    return players.map((p) => {
      const displayTile =
        p.id === animatingPlayerId && animatedTileOverride !== null
          ? animatedTileOverride
          : p.position;
      return {
        ...p,
        displayTile,
      };
    });
  }, [players, animatingPlayerId, animatedTileOverride]);

  const tileOccupants = useMemo(() => {
    const map = new Map<number, string[]>();
    displayPlayers.forEach((p) => {
      const arr = map.get(p.displayTile) || [];
      arr.push(p.id);
      map.set(p.displayTile, arr);
    });
    return map;
  }, [displayPlayers]);

  return (
    <div className="relative w-full max-w-[720px] mx-auto select-none">
      {/* Tactile 2.5D Wooden Board Frame */}
      <div className="relative rounded-[24px] sm:rounded-[30px] bg-gradient-to-b from-[#A06B3B] via-[#8B5A2B] to-[#6E451F] p-2 sm:p-4 shadow-tabletop border-4 border-[#5C3A1B]">
        <span className="hidden sm:block absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-[#D9A773] border border-[#5C3A1B] shadow-inner" />
        <span className="hidden sm:block absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-[#D9A773] border border-[#5C3A1B] shadow-inner" />
        <span className="hidden sm:block absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-[#D9A773] border border-[#5C3A1B] shadow-inner" />
        <span className="hidden sm:block absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-[#D9A773] border border-[#5C3A1B] shadow-inner" />

        {/* Active Weather Banner Overlay */}
        <AnimatePresence>
          {weatherType !== "CLEAR" && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mb-2 flex items-center justify-center gap-2 rounded-xl bg-sky-950/90 text-white px-3 py-1.5 text-xs sm:text-sm font-extrabold shadow-md border border-sky-300/40"
            >
              <WeatherIcon type={weatherType} className="w-5 h-5 shrink-0" />
              <span>
                {weatherType === "TAILWIND" &&
                  "ANGIN KENCANG AKTIF: Setiap lemparan dadu dapat bonus +1 langkah!"}
                {weatherType === "SLEEPY_SNAKES" &&
                  "ULAR NGANTUK AKTIF: Semua ular tertidur pulas di ronde ini!"}
                {weatherType === "GOLDEN_FEVER" &&
                  "HUJAN HADIAH AKTIF: 2 kotak Hadiah Misteri (?) tambahan muncul!"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inner 10x10 SVG Board */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F8FAFC] border-4 border-[#5C3A1B] shadow-inner">
          <svg
            viewBox="0 0 1000 1000"
            className="w-full h-full block"
            aria-label="Ular TanggaZ 10x10 Game Board"
          >
            <defs>
              <filter
                id="dropShadow"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feDropShadow
                  dx="0"
                  dy="5"
                  stdDeviation="4"
                  floodColor="#0F172A"
                  floodOpacity="0.24"
                />
              </filter>
              <filter
                id="tokenShadow"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feDropShadow
                  dx="0"
                  dy="6"
                  stdDeviation="5"
                  floodColor="#0F172A"
                  floodOpacity="0.35"
                />
              </filter>
            </defs>

            {/* 1. Render 100 Board Tiles */}
            {tiles.map((t) => {
              const x0 = t.col * 100;
              const y0 = t.rowFromTop * 100;
              const hasMystery = mysteryTiles.includes(t.tile);
              const banana = bananaTraps.find((b) => b.tile === t.tile);

              return (
                <g key={t.tile}>
                  <rect
                    x={x0 + 2}
                    y={y0 + 2}
                    width={96}
                    height={96}
                    rx={14}
                    fill={t.fill}
                    stroke={t.stroke}
                    strokeWidth={3}
                  />

                  <text
                    x={x0 + 12}
                    y={y0 + 26}
                    fontSize={20}
                    fontWeight="800"
                    fill={
                      t.isCrown
                        ? "#B45309"
                        : t.isFinalDash
                        ? "#0369A1"
                        : "#334155"
                    }
                  >
                    {t.tile}
                  </text>

                  {!t.isCrown && (
                    <text
                      x={x0 + 82}
                      y={y0 + 24}
                      fontSize={15}
                      fontWeight="700"
                      textAnchor="middle"
                      fill="#94A3B8"
                      opacity={0.65}
                    >
                      {t.flowArrow}
                    </text>
                  )}

                  {/* Tile 1 START Badge */}
                  {t.isStart && (
                    <g>
                      <rect
                        x={x0 + 14}
                        y={y0 + 62}
                        width={72}
                        height={24}
                        rx={8}
                        fill="#16A34A"
                      />
                      <text
                        x={x0 + 50}
                        y={y0 + 79}
                        fontSize={14}
                        fontWeight="900"
                        fill="#FFFFFF"
                        textAnchor="middle"
                      >
                        MULAI
                      </text>
                    </g>
                  )}

                  {/* Tile 100 Vector Crown Goal Badge */}
                  {t.isCrown && (
                    <g>
                      <circle
                        cx={x0 + 50}
                        cy={y0 + 54}
                        r={27}
                        fill="#F59E0B"
                        opacity={0.22}
                      />
                      <g transform={`translate(${x0 + 26}, ${y0 + 28}) scale(1)`}>
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
                        <circle cx="24" cy="26" r="3" fill="#EF4444" />
                      </g>
                      <text
                        x={x0 + 50}
                        y={y0 + 91}
                        fontSize={12}
                        fontWeight="900"
                        fill="#92400E"
                        textAnchor="middle"
                      >
                        PAS 100
                      </text>
                    </g>
                  )}

                  {t.isFinalDash && !hasMystery && (
                    <text
                      x={x0 + 50}
                      y={y0 + 88}
                      fontSize={10.5}
                      fontWeight="800"
                      fill="#0284C7"
                      textAnchor="middle"
                      opacity={0.75}
                    >
                      BABAK AKHIR
                    </text>
                  )}

                  {/* Mystery Gift (?) Vector Badge */}
                  {hasMystery && (
                    <g transform={`translate(${x0 + 50}, ${y0 + 58})`}>
                      <circle
                        r={22}
                        fill="#8B5CF6"
                        stroke="#DDD6FE"
                        strokeWidth={3}
                      />
                      <text
                        y={8}
                        fontSize={22}
                        fontWeight="900"
                        fill="#FFFFFF"
                        textAnchor="middle"
                      >
                        ?
                      </text>
                    </g>
                  )}

                  {/* Vector Banana Peel Trap */}
                  {banana && (
                    <g transform={`translate(${x0 + 50}, ${y0 + 55})`}>
                      <circle
                        r={23}
                        fill="#FEF9C3"
                        stroke="#EAB308"
                        strokeWidth={3}
                      />
                      <g transform="translate(-19, -19) scale(0.8)">
                        <path
                          d="M24 8 C26 15 36 22 42 32 C34 34 28 31 24 25 C20 31 14 34 6 32 C12 22 22 15 24 8 Z"
                          fill="#FACC15"
                          stroke="#0F172A"
                          strokeWidth="2.8"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M24 12 C24 22 28 32 34 39 C26 39 22 33 24 24 C20 33 16 39 11 38 C17 31 22 22 24 12 Z"
                          fill="#FEF08A"
                          stroke="#0F172A"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                        />
                        <rect
                          x="21.5"
                          y="5"
                          width="5"
                          height="6"
                          rx="2"
                          fill="#854D0E"
                          stroke="#0F172A"
                          strokeWidth="2"
                        />
                      </g>
                    </g>
                  )}
                </g>
              );
            })}

            {/* 2. Render Wooden & Temporary Rope Ladders */}
            {allLadders.map((ladder) => {
              const geom = buildLadderGeometry(ladder.from, ladder.to);
              const railColor = ladder.isTemporary ? "#06B6D4" : "#92400E";
              const rungColor = ladder.isTemporary ? "#67E8F9" : "#D97706";

              return (
                <g key={ladder.id} filter="url(#dropShadow)" opacity={0.94}>
                  {geom.rungs.map((r, idx) => (
                    <line
                      key={idx}
                      x1={r.x1}
                      y1={r.y1}
                      x2={r.x2}
                      y2={r.y2}
                      stroke={rungColor}
                      strokeWidth={7}
                      strokeLinecap="round"
                    />
                  ))}
                  <line
                    x1={geom.leftRail.x1}
                    y1={geom.leftRail.y1}
                    x2={geom.leftRail.x2}
                    y2={geom.leftRail.y2}
                    stroke={railColor}
                    strokeWidth={9}
                    strokeLinecap="round"
                    strokeDasharray={ladder.isTemporary ? "12 6" : undefined}
                  />
                  <line
                    x1={geom.rightRail.x1}
                    y1={geom.rightRail.y1}
                    x2={geom.rightRail.x2}
                    y2={geom.rightRail.y2}
                    stroke={railColor}
                    strokeWidth={9}
                    strokeLinecap="round"
                    strokeDasharray={ladder.isTemporary ? "12 6" : undefined}
                  />
                  <circle
                    cx={geom.start.x}
                    cy={geom.start.y}
                    r={14}
                    fill="#10B981"
                    stroke="#FFFFFF"
                    strokeWidth={2.5}
                  />
                  <text
                    x={geom.start.x}
                    y={geom.start.y + 5}
                    fontSize={14}
                    fontWeight="900"
                    fill="#FFFFFF"
                    textAnchor="middle"
                  >
                    ↑
                  </text>
                </g>
              );
            })}

            {/* 3. Render Cute Cartoon Snakes */}
            {BOARD_SNAKES.map((snake: SnakeLink) => {
              const { d, head, tail } = buildSnakePath(snake.head, snake.tail);
              return (
                <g
                  key={snake.id}
                  filter="url(#dropShadow)"
                  opacity={isSnakesAsleep ? 0.55 : 0.95}
                >
                  <path
                    d={d}
                    fill="none"
                    stroke={snake.colorPrimary}
                    strokeWidth={22}
                    strokeLinecap="round"
                  />
                  <path
                    d={d}
                    fill="none"
                    stroke={snake.colorSecondary}
                    strokeWidth={12}
                    strokeLinecap="round"
                    strokeDasharray="14 14"
                  />
                  <circle
                    cx={tail.x}
                    cy={tail.y}
                    r={8}
                    fill={snake.colorPrimary}
                  />

                  <g transform={`translate(${head.x}, ${head.y})`}>
                    <circle
                      r={21}
                      fill={snake.colorPrimary}
                      stroke="#FFFFFF"
                      strokeWidth={3}
                    />
                    {isSnakesAsleep ? (
                      <>
                        <path
                          d="M -11 -2 Q -7 2 -3 -2 M 3 -2 Q 7 2 11 -2"
                          fill="none"
                          stroke="#FFFFFF"
                          strokeWidth={3}
                          strokeLinecap="round"
                        />
                        <text
                          x={22}
                          y={-16}
                          fontSize={18}
                          fontWeight="900"
                          fill="#0284C7"
                        >
                          Zzz
                        </text>
                      </>
                    ) : (
                      <>
                        <circle cx={-7} cy={-4} r={5.5} fill="#FFFFFF" />
                        <circle cx={7} cy={-4} r={5.5} fill="#FFFFFF" />
                        <circle cx={-7} cy={-4} r={2.7} fill="#0F172A" />
                        <circle cx={7} cy={-4} r={2.7} fill="#0F172A" />
                        <path
                          d="M 0 15 L 0 26 M 0 26 L -5 31 M 0 26 L 5 31"
                          stroke="#EF4444"
                          strokeWidth={2.8}
                          strokeLinecap="round"
                        />
                      </>
                    )}
                  </g>
                </g>
              );
            })}

            {/* 4. Render Animated Bouncy Player Tokens with Handcrafted Vector Mascots */}
            {displayPlayers.map((player) => {
              const coords = getTileCoordinates(player.displayTile);
              const occupants = tileOccupants.get(player.displayTile) || [
                player.id,
              ];
              const idxInTile = occupants.indexOf(player.id);
              const countInTile = occupants.length;

              let offsetX = 0;
              let offsetY = 0;
              if (countInTile === 2) {
                offsetX = idxInTile === 0 ? -16 : 16;
                offsetY = idxInTile === 0 ? -10 : 10;
              } else if (countInTile >= 3) {
                const offsets = [
                  [-17, -15],
                  [17, -15],
                  [-17, 15],
                  [17, 15],
                ];
                const pair = offsets[idxInTile % 4];
                offsetX = pair[0];
                offsetY = pair[1];
              }

              const isCurrentTurn = player.id === currentPlayerId;

              return (
                <motion.g
                  key={player.id}
                  initial={false}
                  animate={{
                    x: coords.x + offsetX,
                    y: coords.y + offsetY,
                    scale: isCurrentTurn ? 1.12 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 340,
                    damping: 22,
                  }}
                  filter="url(#tokenShadow)"
                >
                  {isCurrentTurn && (
                    <circle
                      r={33}
                      fill="none"
                      stroke={player.color}
                      strokeWidth={4}
                      strokeDasharray="8 6"
                      opacity={0.9}
                    />
                  )}

                  {player.hasSnakeWhistle && (
                    <circle
                      r={29}
                      fill="none"
                      stroke="#EC4899"
                      strokeWidth={3.5}
                    />
                  )}

                  {/* Token Pin Base */}
                  <circle
                    r={25}
                    fill={player.color}
                    stroke="#FFFFFF"
                    strokeWidth={4}
                  />

                  {/* Crisp Vector Animal Mascot Inside Token */}
                  <g transform="translate(-21, -22) scale(0.66)">
                    <AvatarArtwork avatarId={player.avatarId} />
                  </g>

                  {/* Player Name Pill Below Token */}
                  <rect
                    x={-35}
                    y={23}
                    width={70}
                    height={17}
                    rx={8}
                    fill="#0F172A"
                    opacity={0.88}
                  />
                  <text
                    y={35}
                    fontSize={10.5}
                    fontWeight="800"
                    fill="#FFFFFF"
                    textAnchor="middle"
                  >
                    {player.name.slice(0, 8)}
                  </text>

                  {/* Vector Status Mini-Badges */}
                  {player.hasSnakeWhistle && (
                    <g transform="translate(20, -18)">
                      <circle r="10" fill="#EC4899" stroke="#FFFFFF" strokeWidth="2" />
                      <path d="M-4 3 L4 -4" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="3" cy="3" r="2" fill="#FDE047" />
                    </g>
                  )}
                  {player.isDizzy && (
                    <g transform="translate(-20, -18)">
                      <circle r="10" fill="#0284C7" stroke="#FFFFFF" strokeWidth="2" />
                      <path d="M0 -5 L1.5 -1 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1 Z" fill="#FDE047" />
                    </g>
                  )}
                  {player.skipNextTurn && (
                    <g transform="translate(20, 14)">
                      <circle r="10" fill="#EAB308" stroke="#FFFFFF" strokeWidth="2" />
                      <path d="M-4 3 Q0 -5 5 3" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                    </g>
                  )}
                </motion.g>
              );
            })}
          </svg>
        </div>

        {/* Compact Board Legend Bar with Vector Icons */}
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 px-1.5 text-[11px] sm:text-xs font-bold text-amber-100">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5">
              <ActionCardIcon type="LADDER_BUILDER" className="w-4 h-4" />
              Naik Tangga
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-full bg-rose-500 border border-white" />
              Ular Jahil
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-violet-500 border border-white text-[10px] font-black text-white">
                ?
              </span>
              Hadiah Misteri (+1 Kartu)
            </span>
          </div>
          <span className="text-amber-200 font-extrabold">
            Kotak 91–100: Wajib Angka Pas!
          </span>
        </div>
      </div>
    </div>
  );
}
