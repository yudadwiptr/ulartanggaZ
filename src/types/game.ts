export type GameMode = "PASS_AND_PLAY" | "VS_BOTS" | "ONLINE_PARTY";

export type ActionCardType =
  | "DOUBLE_ROLL"
  | "LADDER_BUILDER"
  | "BANANA_PEEL"
  | "FRIENDLY_SWAP"
  | "SNAKE_WHISTLE";

export interface ActionCard {
  id: string;
  type: ActionCardType;
  title: string;
  description: string;
  color: string;
}

export type WeatherType = "CLEAR" | "TAILWIND" | "SLEEPY_SNAKES" | "GOLDEN_FEVER";

export interface WeatherEventInfo {
  type: WeatherType;
  title: string;
  description: string;
  roundsRemaining: number;
}

export type BotPersonality = "CAUTIOUS" | "CHAOTIC" | "BALANCED";

export interface PlayerAvatar {
  id: string;
  name: string;
  color: string;
  bgLight: string;
  border: string;
}

export interface PlayerState {
  id: string;
  name: string;
  avatarId: string;
  color: string;
  position: number; // 1 to 100
  cards: ActionCard[];
  hasSnakeWhistle: boolean;
  skipNextTurn: boolean;
  isDizzy: boolean;
  isBot: boolean;
  botPersonality?: BotPersonality;
  isReady: boolean;
  isHost?: boolean;
  activeCardThisTurn: ActionCardType | null;
}

export interface SnakeLink {
  id: string;
  head: number;
  tail: number;
  name: string;
  colorPrimary: string;
  colorSecondary: string;
}

export interface LadderLink {
  id: string;
  from: number;
  to: number;
  isTemporary?: boolean;
  ownerId?: string;
}

export interface BananaTrap {
  id: string;
  tile: number;
  ownerId: string;
  ownerName: string;
}

export interface DoubleRollChoice {
  die1: number;
  die2: number;
  bonusSteps: number; // e.g., +1 from Tailwind
}

export type TickerIconType =
  | "ISLAND"
  | "DICE"
  | "LADDER"
  | "BANANA"
  | "SWAP"
  | "WHISTLE"
  | "SNAKE"
  | "SLEEPY"
  | "TAILWIND"
  | "GIFT"
  | "DIZZY"
  | "CROWN";

export interface TickerLog {
  id: string;
  text: string;
  icon: TickerIconType;
  timestamp: number;
  highlightColor?: string;
}

export type TurnPhase =
  | "PRE_ROLL" // Can play 1 action card or click Roll
  | "ROLLING" // 3D dice spinning
  | "AWAITING_DOUBLE_CHOICE" // Player played Double Roll and must pick d1, d2, or d1+d2
  | "MOVING" // Token hopping tile-by-tile
  | "WEATHER_SPIN" // Spinning the Dynamic Weather Wheel (every 5 rounds)
  | "GAME_OVER"; // Someone landed exactly on 100!

export interface GameState {
  roomCode: string;
  mode: GameMode;
  status: "LOBBY" | "PLAYING" | "FINISHED";
  round: number;
  currentPlayerIndex: number;
  turnPhase: TurnPhase;
  hasPlayedCardThisTurn: boolean;
  lastDiceValues: number[];
  pendingDoubleRoll: DoubleRollChoice | null;
  weather: WeatherEventInfo;
  players: PlayerState[];
  mysteryTiles: number[];
  bananaTraps: BananaTrap[];
  tempLadders: LadderLink[];
  ticker: TickerLog[];
  winnerId: string | null;
}

export type ReactionSticker = "LAUGH" | "SHOCK" | "CLAP" | "SNAKE";

export interface FloatingStickerEvent {
  id: string;
  senderId: string;
  senderName: string;
  sticker: ReactionSticker;
  createdAt: number;
}

/**
 * Supabase Realtime Broadcast & Presence Schema
 * Channel Name: `ular-tanggaz-room:${roomCode}`
 */
export interface RoomPresencePayload {
  playerId: string;
  name: string;
  avatarId: string;
  color: string;
  isReady: boolean;
  isHost: boolean;
  joinedAt: number;
}

export type RealtimeBroadcastEvent =
  | {
      type: "STATE_SYNC";
      state: GameState;
      senderId: string;
    }
  | {
      type: "PLAYER_ACTION";
      action:
        | { kind: "PLAY_CARD"; playerId: string; cardId: string }
        | { kind: "ROLL_DICE"; playerId: string; die1: number; die2?: number }
        | { kind: "CHOOSE_DOUBLE_ROLL"; playerId: string; chosenBaseSteps: number }
        | { kind: "TOGGLE_READY"; playerId: string }
        | { kind: "JOIN_REQUEST"; player: PlayerState };
      senderId: string;
    }
  | {
      type: "STICKER";
      sticker: FloatingStickerEvent;
    };
