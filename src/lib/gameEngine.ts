import {
  ActionCard,
  ActionCardType,
  BananaTrap,
  BotPersonality,
  GameMode,
  GameState,
  LadderLink,
  PlayerAvatar,
  PlayerState,
  SnakeLink,
  TickerIconType,
  TickerLog,
  WeatherEventInfo,
  WeatherType,
} from "@/types/game";

export const AVATARS: PlayerAvatar[] = [
  {
    id: "fox",
    name: "Rubah Lincah",
    color: "#F97316",
    bgLight: "#FFEDD5",
    border: "#EA580C",
  },
  {
    id: "panda",
    name: "Panda Santuy",
    color: "#3B82F6",
    bgLight: "#DBEAFE",
    border: "#2563EB",
  },
  {
    id: "frog",
    name: "Kapten Kodok",
    color: "#10B981",
    bgLight: "#D1FAE5",
    border: "#059669",
  },
  {
    id: "lion",
    name: "Singa Pemberani",
    color: "#EAB308",
    bgLight: "#FEF9C3",
    border: "#CA8A04",
  },
  {
    id: "koala",
    name: "Koala Awan",
    color: "#8B5CF6",
    bgLight: "#EDE9FE",
    border: "#7C3AED",
  },
  {
    id: "bunny",
    name: "Kelinci Roket",
    color: "#EC4899",
    bgLight: "#FCE7F3",
    border: "#DB2777",
  },
];

export const BOARD_LADDERS: LadderLink[] = [
  { id: "L1", from: 4, to: 25 },
  { id: "L2", from: 13, to: 46 },
  { id: "L3", from: 33, to: 49 },
  { id: "L4", from: 42, to: 63 },
  { id: "L5", from: 50, to: 69 },
  { id: "L6", from: 62, to: 81 },
  { id: "L7", from: 74, to: 92 },
];

export const BOARD_SNAKES: SnakeLink[] = [
  {
    id: "S1",
    head: 27,
    tail: 5,
    name: "Ular Kencur",
    colorPrimary: "#22C55E",
    colorSecondary: "#86EFAC",
  },
  {
    id: "S2",
    head: 40,
    tail: 3,
    name: "Si Oren Jahil",
    colorPrimary: "#F97316",
    colorSecondary: "#FDBA74",
  },
  {
    id: "S3",
    head: 43,
    tail: 18,
    name: "Ular Ungu Manja",
    colorPrimary: "#A855F7",
    colorSecondary: "#D8B4FE",
  },
  {
    id: "S4",
    head: 54,
    tail: 31,
    name: "Sanca Kuning",
    colorPrimary: "#EAB308",
    colorSecondary: "#FEF08A",
  },
  {
    id: "S5",
    head: 66,
    tail: 45,
    name: "Belut Biru",
    colorPrimary: "#06B6D4",
    colorSecondary: "#67E8F9",
  },
  {
    id: "S6",
    head: 89,
    tail: 53,
    name: "Ular Cabai",
    colorPrimary: "#EF4444",
    colorSecondary: "#FCA5A5",
  },
  {
    id: "S7",
    head: 98,
    tail: 79,
    name: "Raja Z-Kobra",
    colorPrimary: "#15803D",
    colorSecondary: "#A3E635",
  },
];

export const INITIAL_MYSTERY_TILES: number[] = [
  8, 19, 29, 37, 48, 58, 67, 76, 85, 94,
];

export const ACTION_CARD_TEMPLATES: Record<
  ActionCardType,
  Omit<ActionCard, "id">
> = {
  DOUBLE_ROLL: {
    type: "DOUBLE_ROLL",
    title: "Dadu Ganda",
    description:
      "Lempar 2 dadu sekaligus, lalu pilih Dadu 1, Dadu 2, atau jumlah keduanya!",
    color: "#3B82F6",
  },
  LADDER_BUILDER: {
    type: "LADDER_BUILDER",
    title: "Tangga Instan",
    description:
      "Pasang tangga tali sementara yang langsung mendongkrakmu +10 kotak ke depan!",
    color: "#10B981",
  },
  BANANA_PEEL: {
    type: "BANANA_PEEL",
    title: "Kulit Pisang",
    description:
      "Jatuhkan kulit pisang di kotakmu; lawan yang lewat/injak bakal terpeleset & skip 1 giliran!",
    color: "#EAB308",
  },
  FRIENDLY_SWAP: {
    type: "FRIENDLY_SWAP",
    title: "Tukar Posisi",
    description:
      "Tukar tempat dengan pemain tepat di depanmu (nonaktif jika mereka di kotak 90–100).",
    color: "#8B5CF6",
  },
  SNAKE_WHISTLE: {
    type: "SNAKE_WHISTLE",
    title: "Peluit Ular",
    description:
      "Jinakkan ular berikutnya yang kamu injak—lewat dengan aman tanpa turun!",
    color: "#EC4899",
  },
};

export const WEATHER_EVENTS: Record<
  Exclude<WeatherType, "CLEAR">,
  Omit<WeatherEventInfo, "roundsRemaining">
> = {
  TAILWIND: {
    type: "TAILWIND",
    title: "Angin Kencang",
    description:
      "Angin pulau mendukung! Semua pemain dapat bonus +1 langkah tiap lempar dadu!",
  },
  SLEEPY_SNAKES: {
    type: "SLEEPY_SNAKES",
    title: "Ular Ngantuk",
    description:
      "Semua ular ketiduran selama 1 ronde! Menginjak kepala ular 100% aman!",
  },
  GOLDEN_FEVER: {
    type: "GOLDEN_FEVER",
    title: "Hujan Hadiah",
    description:
      "Pesta harta karun! Dua kotak Hadiah Misteri (?) tambahan muncul acak di papan!",
  },
};

const ALL_CARD_TYPES: ActionCardType[] = [
  "DOUBLE_ROLL",
  "LADDER_BUILDER",
  "BANANA_PEEL",
  "FRIENDLY_SWAP",
  "SNAKE_WHISTLE",
];

let uidCounter = 0;
function makeId(prefix = "id"): string {
  uidCounter += 1;
  return `${prefix}_${Date.now()}_${uidCounter}_${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

export function createRandomCard(): ActionCard {
  const type =
    ALL_CARD_TYPES[Math.floor(Math.random() * ALL_CARD_TYPES.length)];
  return {
    id: makeId("card"),
    ...ACTION_CARD_TEMPLATES[type],
  };
}

export function drawRandomCards(count: number): ActionCard[] {
  return Array.from({ length: count }, () => createRandomCard());
}

/**
 * Convert tile 1..100 to 10x10 board coordinates and SVG center point (viewBox 0 0 1000 1000)
 */
export function getTileCoordinates(tile: number): {
  rowFromBottom: number;
  rowFromTop: number;
  col: number;
  x: number;
  y: number;
} {
  const clamped = Math.max(1, Math.min(100, tile));
  const zeroBased = clamped - 1;
  const rowFromBottom = Math.floor(zeroBased / 10);
  const rowFromTop = 9 - rowFromBottom;
  const offsetInRow = zeroBased % 10;
  const isLeftToRight = rowFromBottom % 2 === 0;
  const col = isLeftToRight ? offsetInRow : 9 - offsetInRow;

  const x = col * 100 + 50;
  const y = rowFromTop * 100 + 50;
  return { rowFromBottom, rowFromTop, col, x, y };
}

export function canPlayActionCard(
  state: GameState,
  playerId: string,
  cardType: ActionCardType
): { allowed: boolean; reason?: string } {
  if (state.status !== "PLAYING") {
    return { allowed: false, reason: "Permainan belum aktif." };
  }
  const activePlayer = state.players[state.currentPlayerIndex];
  if (!activePlayer || activePlayer.id !== playerId) {
    return { allowed: false, reason: "Tunggu giliranmu ya!" };
  }
  if (state.turnPhase !== "PRE_ROLL") {
    return { allowed: false, reason: "Pakai sebelum lempar dadu!" };
  }
  if (state.hasPlayedCardThisTurn) {
    return { allowed: false, reason: "Maksimal 1 kartu per giliran!" };
  }

  if (cardType === "FRIENDLY_SWAP") {
    const target = getPlayerDirectlyAhead(state, activePlayer);
    if (!target) {
      return {
        allowed: false,
        reason: "Belum ada pemain di depanmu!",
      };
    }
    if (target.position >= 90) {
      return {
        allowed: false,
        reason: `${target.name} sudah di Babak Akhir (90–100)!`,
      };
    }
  }

  if (cardType === "SNAKE_WHISTLE" && activePlayer.hasSnakeWhistle) {
    return {
      allowed: false,
      reason: "Peluit Ular sudah aktif!",
    };
  }

  if (cardType === "LADDER_BUILDER" && activePlayer.position >= 95) {
    return {
      allowed: false,
      reason: "Terlalu dekat Mahkota (#100)!",
    };
  }

  return { allowed: true };
}

export function getPlayerDirectlyAhead(
  state: GameState,
  player: PlayerState
): PlayerState | null {
  const ahead = state.players
    .filter((p) => p.id !== player.id && p.position > player.position)
    .sort((a, b) => a.position - b.position);
  return ahead.length > 0 ? ahead[0] : null;
}

export function createInitialGameState(
  roomCode: string,
  mode: GameMode,
  players: PlayerState[]
): GameState {
  const initializedPlayers = players.map((p) => ({
    ...p,
    position: 1,
    cards: drawRandomCards(2),
    hasSnakeWhistle: false,
    skipNextTurn: false,
    isDizzy: false,
    activeCardThisTurn: null,
  }));

  return {
    roomCode,
    mode,
    status: "PLAYING",
    round: 1,
    currentPlayerIndex: 0,
    turnPhase: "PRE_ROLL",
    hasPlayedCardThisTurn: false,
    lastDiceValues: [6],
    pendingDoubleRoll: null,
    weather: {
      type: "CLEAR",
      title: "Pulau Langit Cerah",
      description: "Langit cerah! Putaran Roda Cuaca berikutnya di Ronde 5.",
      roundsRemaining: 0,
    },
    players: initializedPlayers,
    mysteryTiles: [...INITIAL_MYSTERY_TILES],
    bananaTraps: [],
    tempLadders: [],
    ticker: [
      {
        id: makeId("log"),
        text: "Selamat datang di Ular TanggaZ! Setiap petualang memulai dengan 2 Kartu Aksi!",
        icon: "ISLAND",
        timestamp: Date.now(),
      },
    ],
    winnerId: null,
  };
}

export function appendTicker(
  ticker: TickerLog[],
  text: string,
  icon: TickerIconType,
  highlightColor?: string
): TickerLog[] {
  const entry: TickerLog = {
    id: makeId("log"),
    text,
    icon,
    timestamp: Date.now(),
    highlightColor,
  };
  return [entry, ...ticker].slice(0, 25);
}

export function executeActionCard(
  state: GameState,
  playerId: string,
  cardId: string
): {
  nextState: GameState;
  instantLadderClimb?: { from: number; to: number };
} {
  const playerIdx = state.players.findIndex((p) => p.id === playerId);
  if (playerIdx === -1) return { nextState: state };
  const player = state.players[playerIdx];
  const card = player.cards.find((c) => c.id === cardId);
  if (!card) return { nextState: state };

  const check = canPlayActionCard(state, playerId, card.type);
  if (!check.allowed) return { nextState: state };

  const remainingCards = player.cards.filter((c) => c.id !== cardId);
  const updatedPlayers = [...state.players];
  let updatedTicker = [...state.ticker];
  let updatedBananaTraps = [...state.bananaTraps];
  let updatedTempLadders = [...state.tempLadders];
  let instantLadderClimb: { from: number; to: number } | undefined;

  if (card.type === "DOUBLE_ROLL") {
    updatedPlayers[playerIdx] = {
      ...player,
      cards: remainingCards,
      activeCardThisTurn: "DOUBLE_ROLL",
    };
    updatedTicker = appendTicker(
      updatedTicker,
      `${player.name} mengaktifkan Dadu Ganda! Lemparan berikutnya pakai 2 dadu!`,
      "DICE",
      player.color
    );
  } else if (card.type === "SNAKE_WHISTLE") {
    updatedPlayers[playerIdx] = {
      ...player,
      cards: remainingCards,
      hasSnakeWhistle: true,
      activeCardThisTurn: "SNAKE_WHISTLE",
    };
    updatedTicker = appendTicker(
      updatedTicker,
      `${player.name} menyiapkan Peluit Ular! Ular berikutnya bakal jinak!`,
      "WHISTLE",
      player.color
    );
  } else if (card.type === "BANANA_PEEL") {
    const trapTile = Math.max(2, player.position);
    updatedBananaTraps = [
      ...updatedBananaTraps.filter((b) => b.tile !== trapTile),
      {
        id: makeId("banana"),
        tile: trapTile,
        ownerId: player.id,
        ownerName: player.name,
      },
    ];
    updatedPlayers[playerIdx] = {
      ...player,
      cards: remainingCards,
      activeCardThisTurn: "BANANA_PEEL",
    };
    updatedTicker = appendTicker(
      updatedTicker,
      `${player.name} menjatuhkan Kulit Pisang jahil di Kotak #${trapTile}!`,
      "BANANA",
      player.color
    );
  } else if (card.type === "FRIENDLY_SWAP") {
    const target = getPlayerDirectlyAhead(state, player);
    if (target && target.position < 90) {
      const targetIdx = updatedPlayers.findIndex((p) => p.id === target.id);
      const myOldPos = player.position;
      const targetOldPos = target.position;

      updatedPlayers[playerIdx] = {
        ...player,
        position: targetOldPos,
        cards: remainingCards,
        activeCardThisTurn: "FRIENDLY_SWAP",
      };
      updatedPlayers[targetIdx] = {
        ...target,
        position: myOldPos,
      };
      updatedTicker = appendTicker(
        updatedTicker,
        `${player.name} memakai Tukar Posisi dengan ${target.name} (Kotak #${myOldPos} <-> #${targetOldPos})!`,
        "SWAP",
        player.color
      );
    }
  } else if (card.type === "LADDER_BUILDER") {
    const fromTile = player.position;
    const toTile = Math.min(99, fromTile + 10);
    instantLadderClimb = { from: fromTile, to: toTile };

    updatedTempLadders = [
      ...updatedTempLadders,
      {
        id: makeId("templadder"),
        from: fromTile,
        to: toTile,
        isTemporary: true,
        ownerId: player.id,
      },
    ];

    let nextCards = remainingCards;
    let extraNote = "";
    if (state.mysteryTiles.includes(toTile) && nextCards.length < 5) {
      const bonusCard = createRandomCard();
      nextCards = [...nextCards, bonusCard];
      extraNote = ` & menemukan Hadiah Misteri (${bonusCard.title})!`;
    }

    updatedPlayers[playerIdx] = {
      ...player,
      position: toTile,
      cards: nextCards,
      activeCardThisTurn: "LADDER_BUILDER",
    };
    updatedTicker = appendTicker(
      updatedTicker,
      `${player.name} memasang Tangga Instan dari #${fromTile} naik ke #${toTile}${extraNote}!`,
      "LADDER",
      player.color
    );
  }

  return {
    nextState: {
      ...state,
      hasPlayedCardThisTurn: true,
      players: updatedPlayers,
      bananaTraps: updatedBananaTraps,
      tempLadders: updatedTempLadders,
      ticker: updatedTicker,
    },
    instantLadderClimb,
  };
}

export interface MoveSimulationResult {
  hopPath: number[];
  bouncedFrom100: boolean;
  slippedOnBanana: BananaTrap | null;
  climbedLadder: LadderLink | null;
  bittenBySnake: SnakeLink | null;
  pacifiedSnake: SnakeLink | null;
  sleptSnake: SnakeLink | null;
  drewCard: ActionCard | null;
  wonGame: boolean;
  finalState: GameState;
}

export function resolvePlayerMove(
  state: GameState,
  playerId: string,
  baseSteps: number,
  diceShown: number[]
): MoveSimulationResult {
  const playerIdx = state.players.findIndex((p) => p.id === playerId);
  const player = state.players[playerIdx];

  const tailwindBonus = state.weather.type === "TAILWIND" ? 1 : 0;
  const totalSteps = baseSteps + tailwindBonus;

  const hopPath: number[] = [];
  let cursor = player.position;
  let direction = 1;
  let bouncedFrom100 = false;
  let slippedOnBanana: BananaTrap | null = null;

  for (let step = 1; step <= totalSteps; step++) {
    cursor += direction;
    if (cursor > 100) {
      cursor = 99;
      direction = -1;
      bouncedFrom100 = true;
    }
    hopPath.push(cursor);

    const trap = state.bananaTraps.find(
      (b) => b.tile === cursor && b.ownerId !== player.id
    );
    if (trap) {
      slippedOnBanana = trap;
      break;
    }
  }

  let restingTile =
    hopPath.length > 0 ? hopPath[hopPath.length - 1] : player.position;
  let climbedLadder: LadderLink | null = null;
  let bittenBySnake: SnakeLink | null = null;
  let pacifiedSnake: SnakeLink | null = null;
  let sleptSnake: SnakeLink | null = null;
  let drewCard: ActionCard | null = null;
  let consumedWhistle = false;

  if (!slippedOnBanana) {
    const allLadders = [...BOARD_LADDERS, ...state.tempLadders];
    const ladder = allLadders.find((l) => l.from === restingTile);
    if (ladder) {
      climbedLadder = ladder;
      restingTile = ladder.to;
    } else {
      const snake = BOARD_SNAKES.find((s) => s.head === restingTile);
      if (snake) {
        if (state.weather.type === "SLEEPY_SNAKES") {
          sleptSnake = snake;
        } else if (player.hasSnakeWhistle) {
          pacifiedSnake = snake;
          consumedWhistle = true;
        } else {
          bittenBySnake = snake;
          restingTile = snake.tail;
        }
      }
    }
  }

  let updatedCards = [...player.cards];
  if (state.mysteryTiles.includes(restingTile) && updatedCards.length < 5) {
    drewCard = createRandomCard();
    updatedCards.push(drewCard);
  }

  const wonGame = restingTile === 100;

  let updatedTicker = [...state.ticker];
  const rollDesc =
    tailwindBonus > 0
      ? `${baseSteps} (+1 Angin Kencang = ${totalSteps})`
      : `${baseSteps}`;

  if (bouncedFrom100) {
    updatedTicker = appendTicker(
      updatedTicker,
      `${player.name} melempar ${rollDesc} di Babak Akhir — kelebihan! Memantul mundur ke #${restingTile} sambil pusing!`,
      "DIZZY",
      player.color
    );
  } else {
    updatedTicker = appendTicker(
      updatedTicker,
      `${player.name} melempar angka ${rollDesc} dan melompat ke Kotak #${
        hopPath[hopPath.length - 1] || player.position
      }.`,
      "DICE",
      player.color
    );
  }

  if (slippedOnBanana) {
    updatedTicker = appendTicker(
      updatedTicker,
      `${player.name} terpeleset Kulit Pisang milik ${slippedOnBanana.ownerName} di #${slippedOnBanana.tile} dan skip giliran berikutnya!`,
      "BANANA",
      "#EAB308"
    );
  }

  if (climbedLadder) {
    updatedTicker = appendTicker(
      updatedTicker,
      `${player.name} melesat naik tangga dari #${climbedLadder.from} ke #${climbedLadder.to}!`,
      "LADDER",
      "#10B981"
    );
  }

  if (pacifiedSnake) {
    updatedTicker = appendTicker(
      updatedTicker,
      `${player.name} meniup Peluit Ular dan menjinakkan ${pacifiedSnake.name} di #${pacifiedSnake.head}!`,
      "WHISTLE",
      "#EC4899"
    );
  } else if (sleptSnake) {
    updatedTicker = appendTicker(
      updatedTicker,
      `${sleptSnake.name} di #${sleptSnake.head} lagi tidur pulas! ${player.name} lewat dengan santai!`,
      "SLEEPY",
      "#38BDF8"
    );
  } else if (bittenBySnake) {
    updatedTicker = appendTicker(
      updatedTicker,
      `Waduh! ${bittenBySnake.name} di #${bittenBySnake.head} meluncurkan ${player.name} turun ke #${bittenBySnake.tail}!`,
      "SNAKE",
      "#EF4444"
    );
  }

  if (drewCard) {
    updatedTicker = appendTicker(
      updatedTicker,
      `${player.name} membuka Hadiah Misteri (?) dan mendapat kartu [${drewCard.title}]!`,
      "GIFT",
      "#8B5CF6"
    );
  }

  if (wonGame) {
    updatedTicker = appendTicker(
      updatedTicker,
      `${player.name} mendarat PAS di Kotak #100 dan merebut Mahkota Pulau Langit!`,
      "CROWN",
      player.color
    );
  }

  const updatedPlayers = [...state.players];
  updatedPlayers[playerIdx] = {
    ...player,
    position: restingTile,
    cards: updatedCards,
    hasSnakeWhistle: consumedWhistle ? false : player.hasSnakeWhistle,
    skipNextTurn: slippedOnBanana ? true : player.skipNextTurn,
    isDizzy: bouncedFrom100,
    activeCardThisTurn: null,
  };

  const remainingBananas = slippedOnBanana
    ? state.bananaTraps.filter((b) => b.id !== slippedOnBanana!.id)
    : state.bananaTraps;

  let nextState: GameState = {
    ...state,
    lastDiceValues: diceShown,
    pendingDoubleRoll: null,
    players: updatedPlayers,
    bananaTraps: remainingBananas,
    ticker: updatedTicker,
  };

  if (wonGame) {
    nextState = {
      ...nextState,
      status: "FINISHED",
      turnPhase: "GAME_OVER",
      winnerId: player.id,
    };
  } else {
    nextState = advanceToNextPlayerTurn(nextState);
  }

  return {
    hopPath,
    bouncedFrom100,
    slippedOnBanana,
    climbedLadder,
    bittenBySnake,
    pacifiedSnake,
    sleptSnake,
    drewCard,
    wonGame,
    finalState: nextState,
  };
}

export function advanceToNextPlayerTurn(state: GameState): GameState {
  const numPlayers = state.players.length;
  let nextIdx = state.currentPlayerIndex;
  let nextRound = state.round;
  let weather = { ...state.weather };
  let tempLadders = [...state.tempLadders];
  let ticker = [...state.ticker];
  const players = [...state.players];
  let triggerWeatherSpin = false;

  for (let attempt = 0; attempt < numPlayers * 2; attempt++) {
    nextIdx = (nextIdx + 1) % numPlayers;

    if (nextIdx === 0) {
      nextRound += 1;
      if (tempLadders.length > 0) {
        tempLadders = [];
      }
      if (weather.roundsRemaining > 0) {
        weather.roundsRemaining -= 1;
        if (weather.roundsRemaining === 0) {
          weather = {
            type: "CLEAR",
            title: "Pulau Langit Cerah",
            description: "Langit kembali cerah di seluruh pulau!",
            roundsRemaining: 0,
          };
        }
      }
      if (nextRound % 5 === 0) {
        triggerWeatherSpin = true;
      }
    }

    const candidate = players[nextIdx];
    if (candidate.skipNextTurn) {
      players[nextIdx] = {
        ...candidate,
        skipNextTurn: false,
      };
      ticker = appendTicker(
        ticker,
        `${candidate.name} masih pemulihan habis terpeleset Kulit Pisang — skip giliran ini!`,
        "BANANA",
        candidate.color
      );
      continue;
    } else {
      if (candidate.isDizzy) {
        players[nextIdx] = {
          ...candidate,
          isDizzy: false,
        };
      }
      break;
    }
  }

  return {
    ...state,
    round: nextRound,
    currentPlayerIndex: nextIdx,
    turnPhase: triggerWeatherSpin ? "WEATHER_SPIN" : "PRE_ROLL",
    hasPlayedCardThisTurn: false,
    pendingDoubleRoll: null,
    weather,
    players,
    tempLadders,
    ticker,
  };
}

export function applyWeatherSpinResult(
  state: GameState,
  chosenWeather: Exclude<WeatherType, "CLEAR">
): GameState {
  const info = WEATHER_EVENTS[chosenWeather];
  let mysteryTiles = [...state.mysteryTiles];
  let ticker = [...state.ticker];

  if (chosenWeather === "GOLDEN_FEVER") {
    const occupied = new Set<number>([
      1,
      100,
      ...mysteryTiles,
      ...BOARD_LADDERS.flatMap((l) => [l.from, l.to]),
      ...BOARD_SNAKES.flatMap((s) => [s.head, s.tail]),
    ]);
    const available: number[] = [];
    for (let t = 2; t <= 97; t++) {
      if (!occupied.has(t)) available.push(t);
    }
    const spawned: number[] = [];
    for (let i = 0; i < 2 && available.length > 0; i++) {
      const idx = Math.floor(Math.random() * available.length);
      const tile = available.splice(idx, 1)[0];
      spawned.push(tile);
      mysteryTiles.push(tile);
    }
    ticker = appendTicker(
      ticker,
      `Cuaca Baru: ${info.title}! Hadiah Misteri tambahan muncul di Kotak #${spawned.join(" & #")}!`,
      "GIFT",
      "#EAB308"
    );
  } else {
    ticker = appendTicker(
      ticker,
      `Cuaca Baru: ${info.title}! ${info.description}`,
      chosenWeather === "TAILWIND" ? "TAILWIND" : "SLEEPY",
      "#0284C7"
    );
  }

  return {
    ...state,
    turnPhase: "PRE_ROLL",
    weather: {
      ...info,
      roundsRemaining: 1,
    },
    mysteryTiles,
    ticker,
  };
}

export function decideBotCardToPlay(
  state: GameState,
  bot: PlayerState
): ActionCard | null {
  if (state.hasPlayedCardThisTurn || bot.cards.length === 0) return null;

  const playable = bot.cards.filter(
    (c) => canPlayActionCard(state, bot.id, c.type).allowed
  );
  if (playable.length === 0) return null;

  const personality: BotPersonality = bot.botPersonality || "BALANCED";

  const swapCard = playable.find((c) => c.type === "FRIENDLY_SWAP");
  const playerAhead = getPlayerDirectlyAhead(state, bot);
  if (
    swapCard &&
    playerAhead &&
    playerAhead.position < 90 &&
    (personality === "CHAOTIC" ||
      playerAhead.position - bot.position >= 12)
  ) {
    return swapCard;
  }

  const whistleCard = playable.find((c) => c.type === "SNAKE_WHISTLE");
  const snakeAhead = BOARD_SNAKES.some(
    (s) => s.head > bot.position && s.head - bot.position <= 6
  );
  if (whistleCard && (snakeAhead || personality === "CAUTIOUS")) {
    return whistleCard;
  }

  const ladderCard = playable.find((c) => c.type === "LADDER_BUILDER");
  if (ladderCard) {
    const dest = Math.min(99, bot.position + 10);
    const hitsSnake = BOARD_SNAKES.some((s) => s.head === dest);
    if (!hitsSnake) {
      return ladderCard;
    }
  }

  if (personality === "CHAOTIC") {
    const banana = playable.find((c) => c.type === "BANANA_PEEL");
    if (banana && bot.position > 5) return banana;
    const dbl = playable.find((c) => c.type === "DOUBLE_ROLL");
    if (dbl) return dbl;
  }

  const doubleRoll = playable.find((c) => c.type === "DOUBLE_ROLL");
  if (doubleRoll && (bot.position >= 85 || Math.random() < 0.7)) {
    return doubleRoll;
  }

  const banana = playable.find((c) => c.type === "BANANA_PEEL");
  if (banana && bot.position > 10 && Math.random() < 0.65) {
    return banana;
  }

  return null;
}

export function decideBotDoubleRollChoice(
  state: GameState,
  bot: PlayerState,
  die1: number,
  die2: number
): number {
  const options = [die1, die2, die1 + die2];
  const bonus = state.weather.type === "TAILWIND" ? 1 : 0;

  let bestOption = die1 + die2;
  let bestScore = -9999;

  for (const opt of options) {
    const steps = opt + bonus;
    let target = bot.position + steps;
    let score = target;

    if (target === 100) {
      score += 1000;
    } else if (target > 100) {
      target = 100 - (target - 100);
      score = target - 25;
    }

    const ladder = BOARD_LADDERS.find((l) => l.from === target);
    if (ladder) {
      score += (ladder.to - ladder.from) * 2;
    }

    const snake = BOARD_SNAKES.find((s) => s.head === target);
    if (
      snake &&
      state.weather.type !== "SLEEPY_SNAKES" &&
      !bot.hasSnakeWhistle
    ) {
      score -= (snake.head - snake.tail) * 2.5;
    }

    if (state.mysteryTiles.includes(target)) {
      score += 12;
    }

    if (
      bot.botPersonality === "CHAOTIC" &&
      opt === die1 + die2 &&
      target <= 100
    ) {
      score += 10;
    }

    if (score > bestScore) {
      bestScore = score;
      bestOption = opt;
    }
  }

  return bestOption;
}
