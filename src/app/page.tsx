"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Users,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import Board from "@/components/Board";
import DiceRoller from "@/components/DiceRoller";
import ActionCardHand from "@/components/ActionCardHand";
import WeatherWheelModal from "@/components/WeatherWheelModal";
import LobbySetup from "@/components/LobbySetup";
import {
  ActionCardIcon,
  AvatarIcon,
  BotPersonalityIcon,
  BrandZLogo,
  CardDeckIcon,
  CrownIcon,
  DizzyIcon,
  ReactionIcon,
  TickerEventIcon,
  WeatherIcon,
} from "@/components/icons/GameIcons";
import {
  applyWeatherSpinResult,
  AVATARS,
  createInitialGameState,
  decideBotCardToPlay,
  decideBotDoubleRollChoice,
  executeActionCard,
  resolvePlayerMove,
} from "@/lib/gameEngine";
import { generateRoomCode, PartyRoomChannel } from "@/lib/realtime";
import { soundEngine } from "@/lib/sound";
import {
  ActionCard,
  FloatingStickerEvent,
  GameMode,
  GameState,
  PlayerState,
  ReactionSticker,
  RealtimeBroadcastEvent,
  RoomPresencePayload,
  WeatherType,
} from "@/types/game";

const REACTION_STICKERS: ReactionSticker[] = ["LAUGH", "SHOCK", "CLAP", "SNAKE"];

export default function UlarTanggaZPage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [muted, setMuted] = useState<boolean>(false);

  const [animatingPlayerId, setAnimatingPlayerId] = useState<string | null>(
    null
  );
  const [animatedTileOverride, setAnimatedTileOverride] = useState<
    number | null
  >(null);
  const isAnimatingRef = useRef<boolean>(false);

  const channelRef = useRef<PartyRoomChannel | null>(null);
  const [onlineConnected, setOnlineConnected] = useState(false);
  const [onlineRoomCode, setOnlineRoomCode] = useState("");
  const [onlineModeLabel, setOnlineModeLabel] = useState("");
  const [onlinePresences, setOnlinePresences] = useState<RoomPresencePayload[]>(
    []
  );
  const [localOnlinePlayer, setLocalOnlinePlayer] =
    useState<PlayerState | null>(null);
  const [isOnlineHost, setIsOnlineHost] = useState(false);

  const [stickers, setStickers] = useState<FloatingStickerEvent[]>([]);

  useEffect(() => {
    setMuted(soundEngine.isMuted());
    return () => {
      channelRef.current?.disconnect();
    };
  }, []);

  const triggerVictoryConfetti = useCallback(() => {
    soundEngine.playVictoryFanfare();
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 },
    });
  }, []);

  const spawnFloatingSticker = useCallback((sticker: FloatingStickerEvent) => {
    soundEngine.playCardPop();
    setStickers((prev) => [...prev.slice(-10), sticker]);
    setTimeout(() => {
      setStickers((prev) => prev.filter((s) => s.id !== sticker.id));
    }, 3200);
  }, []);

  const syncStateToPeers = useCallback(
    (nextState: GameState) => {
      if (
        nextState.mode === "ONLINE_PARTY" &&
        channelRef.current &&
        localOnlinePlayer
      ) {
        channelRef.current.sendEvent({
          type: "STATE_SYNC",
          state: nextState,
          senderId: localOnlinePlayer.id,
        });
      }
    },
    [localOnlinePlayer]
  );

  const playMoveAnimation = useCallback(
    (
      playerId: string,
      baseSteps: number,
      diceValues: number[],
      sourceState: GameState,
      broadcastAfter: boolean
    ) => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const sim = resolvePlayerMove(
        sourceState,
        playerId,
        baseSteps,
        diceValues
      );

      setAnimatingPlayerId(playerId);
      setGameState((prev) =>
        prev
          ? {
              ...prev,
              turnPhase: "MOVING",
              lastDiceValues: diceValues,
              pendingDoubleRoll: null,
            }
          : prev
      );

      const hops = sim.hopPath;
      let idx = 0;

      const stepTimer = setInterval(() => {
        if (idx < hops.length) {
          const tile = hops[idx];
          setAnimatedTileOverride(tile);
          soundEngine.playHop(idx);
          idx += 1;
        } else {
          clearInterval(stepTimer);

          if (sim.bouncedFrom100) {
            soundEngine.playBounceBack();
          }
          if (sim.slippedOnBanana) {
            soundEngine.playBananaSlip();
          } else if (sim.climbedLadder) {
            soundEngine.playLadderClimb();
          } else if (sim.pacifiedSnake || sim.sleptSnake) {
            soundEngine.playSnakePacified();
          } else if (sim.bittenBySnake) {
            soundEngine.playSnakeBite();
          } else if (sim.drewCard) {
            soundEngine.playCardPop();
          }

          setTimeout(() => {
            setAnimatingPlayerId(null);
            setAnimatedTileOverride(null);
            isAnimatingRef.current = false;
            setGameState(sim.finalState);

            if (broadcastAfter) {
              syncStateToPeers(sim.finalState);
            }

            if (sim.wonGame) {
              triggerVictoryConfetti();
            }
          }, 320);
        }
      }, 190);
    },
    [syncStateToPeers, triggerVictoryConfetti]
  );

  const handleConnectOnlineRoom = (
    roomCodeInput: string,
    localPlayer: PlayerState,
    asHost: boolean
  ) => {
    channelRef.current?.disconnect();
    const code = asHost ? generateRoomCode() : roomCodeInput.toUpperCase();

    setOnlineRoomCode(code);
    setLocalOnlinePlayer(localPlayer);
    setIsOnlineHost(asHost);

    const presencePayload: RoomPresencePayload = {
      playerId: localPlayer.id,
      name: localPlayer.name,
      avatarId: localPlayer.avatarId,
      color: localPlayer.color,
      isReady: true,
      isHost: asHost,
      joinedAt: Date.now(),
    };

    const channel = new PartyRoomChannel(code, presencePayload, {
      onStatusChange: (connected, label) => {
        setOnlineConnected(connected);
        setOnlineModeLabel(label);
      },
      onPresenceSync: (list) => {
        setOnlinePresences(list);
      },
      onBroadcast: (event: RealtimeBroadcastEvent) => {
        if (event.type === "STATE_SYNC") {
          setGameState(event.state);
          if (event.state.status === "FINISHED" && event.state.winnerId) {
            triggerVictoryConfetti();
          }
        } else if (event.type === "STICKER") {
          spawnFloatingSticker(event.sticker);
        }
      },
    });

    channel.connect();
    channelRef.current = channel;
  };

  const handleToggleOnlineReady = () => {
    if (!channelRef.current || !localOnlinePlayer) return;
    const me = onlinePresences.find((p) => p.playerId === localOnlinePlayer.id);
    const nextReady = me ? !me.isReady : true;
    channelRef.current.updatePresence({ isReady: nextReady });
  };

  const handleHostStartOnlineMatch = () => {
    if (!onlineRoomCode || onlinePresences.length === 0) return;

    const builtPlayers: PlayerState[] = onlinePresences
      .slice(0, 4)
      .map((p, idx) => ({
        id: p.playerId,
        name: p.name,
        avatarId: p.avatarId,
        color: p.color || AVATARS[idx % AVATARS.length].color,
        position: 1,
        cards: [],
        hasSnakeWhistle: false,
        skipNextTurn: false,
        isDizzy: false,
        isBot: false,
        isReady: true,
        isHost: p.isHost,
        activeCardThisTurn: null,
      }));

    if (builtPlayers.length === 1) {
      const botAvatar = AVATARS[1];
      builtPlayers.push({
        id: "online_bot_companion",
        name: "Robo Z-Bot",
        avatarId: botAvatar.id,
        color: botAvatar.color,
        position: 1,
        cards: [],
        hasSnakeWhistle: false,
        skipNextTurn: false,
        isDizzy: false,
        isBot: true,
        botPersonality: "CHAOTIC",
        isReady: true,
        activeCardThisTurn: null,
      });
    }

    const initial = createInitialGameState(
      onlineRoomCode,
      "ONLINE_PARTY",
      builtPlayers
    );
    soundEngine.playCardPop();
    setGameState(initial);
    syncStateToPeers(initial);
  };

  const handleStartLocalGame = (mode: GameMode, players: PlayerState[]) => {
    const code = generateRoomCode();
    const initial = createInitialGameState(code, mode, players);
    soundEngine.playCardPop();
    setGameState(initial);
  };

  const handlePlayCard = useCallback(
    (card: ActionCard) => {
      if (!gameState || isAnimatingRef.current) return;
      const activePlayer = gameState.players[gameState.currentPlayerIndex];
      if (!activePlayer) return;

      soundEngine.playCardPop();
      const { nextState, instantLadderClimb } = executeActionCard(
        gameState,
        activePlayer.id,
        card.id
      );

      if (instantLadderClimb) {
        soundEngine.playLadderClimb();
      }

      setGameState(nextState);
      syncStateToPeers(nextState);
    },
    [gameState, syncStateToPeers]
  );

  const handleRollDice = useCallback(() => {
    if (
      !gameState ||
      gameState.turnPhase !== "PRE_ROLL" ||
      isAnimatingRef.current
    )
      return;

    const activePlayer = gameState.players[gameState.currentPlayerIndex];
    if (!activePlayer) return;

    const isDouble = activePlayer.activeCardThisTurn === "DOUBLE_ROLL";
    const d1 = Math.floor(Math.random() * 6) + 1;
    const d2 = Math.floor(Math.random() * 6) + 1;
    const diceValues = isDouble ? [d1, d2] : [d1];

    soundEngine.playDiceClack();

    setGameState((prev) =>
      prev
        ? {
            ...prev,
            turnPhase: "ROLLING",
            lastDiceValues: diceValues,
          }
        : prev
    );

    setTimeout(() => {
      if (isDouble) {
        const tailwindBonus = gameState.weather.type === "TAILWIND" ? 1 : 0;

        if (activePlayer.isBot) {
          const botChosen = decideBotDoubleRollChoice(
            gameState,
            activePlayer,
            d1,
            d2
          );
          playMoveAnimation(
            activePlayer.id,
            botChosen,
            [d1, d2],
            gameState,
            true
          );
        } else {
          const awaitingState: GameState = {
            ...gameState,
            turnPhase: "AWAITING_DOUBLE_CHOICE",
            lastDiceValues: [d1, d2],
            pendingDoubleRoll: {
              die1: d1,
              die2: d2,
              bonusSteps: tailwindBonus,
            },
          };
          setGameState(awaitingState);
          syncStateToPeers(awaitingState);
        }
      } else {
        playMoveAnimation(activePlayer.id, d1, [d1], gameState, true);
      }
    }, 520);
  }, [gameState, playMoveAnimation, syncStateToPeers]);

  const handleSelectDoubleChoice = (chosenBaseSteps: number) => {
    if (!gameState || gameState.turnPhase !== "AWAITING_DOUBLE_CHOICE") return;
    const activePlayer = gameState.players[gameState.currentPlayerIndex];
    if (!activePlayer) return;

    playMoveAnimation(
      activePlayer.id,
      chosenBaseSteps,
      gameState.lastDiceValues,
      gameState,
      true
    );
  };

  const handleWeatherComplete = (chosen: Exclude<WeatherType, "CLEAR">) => {
    if (!gameState) return;
    const updated = applyWeatherSpinResult(gameState, chosen);
    setGameState(updated);
    syncStateToPeers(updated);
  };

  const handleSendSticker = (stickerType: ReactionSticker) => {
    const activePlayer = gameState?.players[gameState.currentPlayerIndex];
    const senderName =
      localOnlinePlayer?.name || activePlayer?.name || "Explorer";
    const senderId = localOnlinePlayer?.id || activePlayer?.id || "local";

    const sticker: FloatingStickerEvent = {
      id: `stk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      senderId,
      senderName,
      sticker: stickerType,
      createdAt: Date.now(),
    };

    spawnFloatingSticker(sticker);
    if (channelRef.current) {
      channelRef.current.sendEvent({
        type: "STICKER",
        sticker,
      });
    }
  };

  useEffect(() => {
    if (!gameState || gameState.status !== "PLAYING") return;
    if (gameState.turnPhase !== "PRE_ROLL") return;
    if (isAnimatingRef.current) return;

    const activePlayer = gameState.players[gameState.currentPlayerIndex];
    if (!activePlayer || !activePlayer.isBot) return;

    if (gameState.mode === "ONLINE_PARTY" && !isOnlineHost) return;

    const timer = setTimeout(() => {
      const cardToPlay = decideBotCardToPlay(gameState, activePlayer);
      if (cardToPlay) {
        handlePlayCard(cardToPlay);
      } else {
        handleRollDice();
      }
    }, 950);

    return () => clearTimeout(timer);
  }, [gameState, isOnlineHost, handlePlayCard, handleRollDice]);

  // Render Revamped Full-Width Sky Island Landing & Lobby
  if (!gameState) {
    return (
      <main className="min-h-screen w-full">
        <LobbySetup
          muted={muted}
          onToggleMute={() => setMuted(soundEngine.toggleMute())}
          onStartLocalGame={handleStartLocalGame}
          onConnectOnlineRoom={handleConnectOnlineRoom}
          onlineConnected={onlineConnected}
          onlineRoomCode={onlineRoomCode}
          onlineModeLabel={onlineModeLabel}
          onlinePresences={onlinePresences}
          localOnlinePlayerId={localOnlinePlayer?.id || ""}
          isOnlineHost={isOnlineHost}
          onToggleOnlineReady={handleToggleOnlineReady}
          onHostStartOnlineMatch={handleHostStartOnlineMatch}
          onLeaveOnlineRoom={() => {
            channelRef.current?.disconnect();
            setOnlineConnected(false);
            setOnlineRoomCode("");
          }}
        />
      </main>
    );
  }

  const activePlayer = gameState.players[gameState.currentPlayerIndex];
  const isLocalTurn =
    gameState.mode !== "ONLINE_PARTY"
      ? !activePlayer.isBot
      : activePlayer.id === localOnlinePlayer?.id;

  const handOwner =
    gameState.mode === "ONLINE_PARTY" && localOnlinePlayer
      ? gameState.players.find((p) => p.id === localOnlinePlayer.id) ||
        activePlayer
      : activePlayer;

  const winnerPlayer = gameState.winnerId
    ? gameState.players.find((p) => p.id === gameState.winnerId)
    : null;

  const latestLog = gameState.ticker[0];

  return (
    <main className="min-h-screen pb-safe">
      {/* Floating SVG Reaction Stickers Overlay */}
      <div className="pointer-events-none fixed bottom-16 sm:bottom-10 right-4 sm:right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {stickers.map((s) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 40, scale: 0.6 }}
              animate={{ opacity: 1, y: -30, scale: 1.05 }}
              exit={{ opacity: 0, y: -90, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 rounded-full bg-slate-900/95 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 shadow-xl border-2 border-amber-300"
            >
              <ReactionIcon sticker={s.sticker} className="w-7 h-7" />
              <span className="text-xs font-black text-amber-300">
                {s.senderName}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Sky Island Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b-4 border-slate-900 px-2.5 sm:px-6 py-2">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <BrandZLogo className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl shrink-0 shadow-sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-sm sm:text-lg tracking-tight text-slate-900 truncate">
                  ULAR TANGGA<span className="text-emerald-600">Z</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-[11px] font-black shrink-0">
                  {gameState.mode === "ONLINE_PARTY"
                    ? `ROOM: ${gameState.roomCode}`
                    : gameState.mode === "VS_BOTS"
                    ? "LAWAN BOT"
                    : "MAIN BARENG"}
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-500 flex items-center gap-1.5 truncate">
                <span>Ronde {gameState.round}</span>
                <span>•</span>
                <WeatherIcon
                  type={gameState.weather.type}
                  className="w-4 h-4 shrink-0"
                />
                <span className="truncate">{gameState.weather.title}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-100 rounded-xl sm:rounded-2xl p-0.5 sm:p-1 border border-slate-200">
              {REACTION_STICKERS.map((stickerKey) => (
                <button
                  key={stickerKey}
                  type="button"
                  onClick={() => handleSendSticker(stickerKey)}
                  title="Kirim stiker reaksi"
                  className="w-8 h-8 rounded-lg sm:rounded-xl hover:bg-white active:scale-125 transition-all flex items-center justify-center"
                >
                  <ReactionIcon sticker={stickerKey} className="w-6 h-6" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMuted(soundEngine.toggleMute())}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300"
              title={muted ? "Nyalakan Efek Suara" : "Matikan Efek Suara"}
            >
              {muted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setGameState(null)}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lobi</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Compact Player Strip + Instant Event Toast */}
      <div className="lg:hidden max-w-2xl mx-auto px-2.5 pt-2.5 space-y-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {gameState.players.map((p) => {
            const isTurn = p.id === activePlayer.id;
            return (
              <div
                key={p.id}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border-2 shrink-0 transition-all ${
                  isTurn
                    ? "bg-amber-100 border-slate-900 shadow-sm scale-[1.02]"
                    : "bg-white border-slate-200 opacity-85"
                }`}
              >
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center border border-slate-900/20"
                  style={{ backgroundColor: `${p.color}28` }}
                >
                  <AvatarIcon avatarId={p.avatarId} className="w-5 h-5" />
                </span>
                <span className="font-extrabold text-xs text-slate-900">
                  {p.name.slice(0, 8)}
                </span>
                <span className="font-black text-xs px-1.5 py-0.5 rounded-md bg-slate-900 text-white">
                  #{p.position}
                </span>
                {p.hasSnakeWhistle && (
                  <ActionCardIcon type="SNAKE_WHISTLE" className="w-4 h-4" />
                )}
                {p.skipNextTurn && (
                  <ActionCardIcon type="BANANA_PEEL" className="w-4 h-4" />
                )}
                {p.isDizzy && <DizzyIcon className="w-4 h-4" />}
              </div>
            );
          })}
        </div>

        {latestLog && (
          <div className="flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-1.5 text-xs font-bold shadow-sm">
            <TickerEventIcon
              icon={latestLog.icon}
              className="w-4 h-4 shrink-0"
            />
            <span className="truncate">{latestLog.text}</span>
          </div>
        )}
      </div>

      {/* Main Responsive Tabletop Layout */}
      <div className="max-w-[1440px] mx-auto px-2.5 sm:px-6 pt-2 sm:pt-5 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        {/* Center/Left: Crisp 10x10 SVG Board */}
        <div className="lg:col-span-7">
          <Board
            players={gameState.players}
            currentPlayerId={activePlayer.id}
            mysteryTiles={gameState.mysteryTiles}
            bananaTraps={gameState.bananaTraps}
            tempLadders={gameState.tempLadders}
            weatherType={gameState.weather.type}
            animatingPlayerId={animatingPlayerId}
            animatedTileOverride={animatedTileOverride}
          />
        </div>

        {/* Right/Bottom HUD */}
        <div className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-4">
          {/* 1. Interactive 3D Dice Roller */}
          <div className="order-1 lg:order-2">
            <DiceRoller
              values={gameState.lastDiceValues}
              isRolling={gameState.turnPhase === "ROLLING"}
              canRoll={isLocalTurn && gameState.turnPhase === "PRE_ROLL"}
              isDoubleRollArmed={
                activePlayer.activeCardThisTurn === "DOUBLE_ROLL"
              }
              tailwindActive={gameState.weather.type === "TAILWIND"}
              pendingDoubleChoice={
                isLocalTurn ? gameState.pendingDoubleRoll : null
              }
              activePlayerName={activePlayer.name}
              activePlayerAvatarId={activePlayer.avatarId}
              activePlayerColor={activePlayer.color}
              currentPosition={activePlayer.position}
              onRollClick={handleRollDice}
              onSelectDoubleChoice={handleSelectDoubleChoice}
            />
          </div>

          {/* 2. Player's Current Action Cards Hand */}
          <div className="order-2 lg:order-3">
            <ActionCardHand
              gameState={gameState}
              playerId={handOwner.id}
              playerName={handOwner.name}
              cards={handOwner.cards}
              isMyTurn={isLocalTurn && handOwner.id === activePlayer.id}
              onPlayCard={handlePlayCard}
            />
          </div>

          {/* 3. Desktop Active Turn Banner & Standings */}
          <div className="hidden lg:block order-3 lg:order-1 rounded-2xl bg-white border-2 border-slate-900/15 p-4 shadow-card3d">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 border-slate-900 shadow-sm"
                  style={{ backgroundColor: `${activePlayer.color}28` }}
                >
                  <AvatarIcon
                    avatarId={activePlayer.avatarId}
                    className="w-10 h-10"
                  />
                </span>
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Giliran Aktif • Ronde {gameState.round}
                  </div>
                  <div className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                    {activePlayer.name}
                    {activePlayer.isBot && activePlayer.botPersonality && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black">
                        <BotPersonalityIcon
                          personality={activePlayer.botPersonality}
                          className="w-3.5 h-3.5"
                        />
                        {activePlayer.botPersonality === "CAUTIOUS"
                          ? "HATI-HATI"
                          : activePlayer.botPersonality === "CHAOTIC"
                          ? "JAHIL"
                          : "SEIMBANG"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase">
                  Kotak
                </div>
                <div className="font-display text-2xl font-bold text-slate-900">
                  #{activePlayer.position}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              {gameState.players.map((p) => {
                const isTurn = p.id === activePlayer.id;
                return (
                  <div
                    key={p.id}
                    className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                      isTurn
                        ? "bg-amber-50 border-slate-900 shadow-sm"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-slate-900/20"
                        style={{ backgroundColor: `${p.color}28` }}
                      >
                        <AvatarIcon avatarId={p.avatarId} className="w-6 h-6" />
                      </span>
                      <div className="truncate">
                        <div className="font-extrabold text-xs text-slate-800 truncate">
                          {p.name}
                        </div>
                        <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-0.5">
                            <CardDeckIcon className="w-3.5 h-3.5" />
                            {p.cards.length}
                          </span>
                          {p.hasSnakeWhistle && (
                            <ActionCardIcon
                              type="SNAKE_WHISTLE"
                              className="w-3.5 h-3.5"
                            />
                          )}
                          {p.skipNextTurn && (
                            <ActionCardIcon
                              type="BANANA_PEEL"
                              className="w-3.5 h-3.5"
                            />
                          )}
                          {p.isDizzy && <DizzyIcon className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                    <span className="font-black text-xs px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                      #{p.position}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Compact Live Ticker History */}
          <div className="order-4 rounded-2xl bg-slate-900 text-white p-3.5 sm:p-4 border-2 border-slate-800 shadow-card3d">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Kabar Langsung Pulau Langit
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400">
                Roda Cuaca: Ronde {Math.ceil((gameState.round + 0.1) / 5) * 5}
              </span>
            </div>
            <div className="space-y-1.5 max-h-28 sm:max-h-36 overflow-y-auto pr-1">
              {gameState.ticker.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`flex items-start gap-2 text-xs font-bold rounded-xl px-2.5 py-1.5 ${
                    idx === 0
                      ? "bg-slate-800 text-white border border-slate-700"
                      : "text-slate-300 opacity-80"
                  }`}
                >
                  <TickerEventIcon
                    icon={entry.icon}
                    className="w-4 h-4 shrink-0 mt-0.5"
                  />
                  <span className="leading-snug">{entry.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Weather Wheel Modal */}
      <WeatherWheelModal
        isOpen={gameState.turnPhase === "WEATHER_SPIN"}
        round={gameState.round}
        onComplete={handleWeatherComplete}
      />

      {/* Victory Celebration Modal */}
      <AnimatePresence>
        {gameState.status === "FINISHED" && winnerPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md rounded-3xl bg-white border-4 border-slate-900 p-6 text-center shadow-[0_12px_0_0_#0f172a]"
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                <CrownIcon className="w-12 h-12" />
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border-[3px] border-slate-900 shadow-md"
                  style={{ backgroundColor: `${winnerPlayer.color}28` }}
                >
                  <AvatarIcon
                    avatarId={winnerPlayer.avatarId}
                    className="w-13 h-13"
                  />
                </div>
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase mb-2">
                Juara Pulau Langit!
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                {winnerPlayer.name} Menang!
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1 mb-6">
                Mendarat pas di Kotak #100 pada Ronde {gameState.round}!
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const rematch = createInitialGameState(
                      gameState.roomCode,
                      gameState.mode,
                      gameState.players
                    );
                    setGameState(rematch);
                    syncStateToPeers(rematch);
                  }}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 font-black text-sm border-2 border-slate-900 shadow-[0_5px_0_0_#0f172a] inline-flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  Main Lagi!
                </button>
                <button
                  type="button"
                  onClick={() => setGameState(null)}
                  className="py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm border-2 border-slate-300 inline-flex items-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  Lobi
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
