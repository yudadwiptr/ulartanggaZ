"use client";

import { createClient, RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import {
  RealtimeBroadcastEvent,
  RoomPresencePayload,
} from "@/types/game";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes("your-project-id");

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 20,
        },
      },
    });
  }
  return supabaseClient;
}

export interface RoomConnectionCallbacks {
  onBroadcast: (event: RealtimeBroadcastEvent) => void;
  onPresenceSync?: (presences: RoomPresencePayload[]) => void;
  onStatusChange?: (connected: boolean, modeLabel: string) => void;
}

/**
 * Connects to an Online Party Room using Supabase Realtime (Presence + Broadcast)
 * when NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY are configured,
 * OR automatically falls back to browser BroadcastChannel so local multi-tab
 * multiplayer works immediately out-of-the-box with zero configuration!
 */
export class PartyRoomChannel {
  private roomCode: string;
  private localPresence: RoomPresencePayload;
  private callbacks: RoomConnectionCallbacks;
  private sbChannel: RealtimeChannel | null = null;
  private localChannel: BroadcastChannel | null = null;
  private localPeerMap: Map<string, RoomPresencePayload> = new Map();
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    roomCode: string,
    localPresence: RoomPresencePayload,
    callbacks: RoomConnectionCallbacks
  ) {
    this.roomCode = roomCode.toUpperCase();
    this.localPresence = localPresence;
    this.callbacks = callbacks;
  }

  public connect(): void {
    const sb = getSupabaseClient();

    if (sb) {
      const channelName = `ular-tanggaz-room:${this.roomCode}`;
      this.sbChannel = sb.channel(channelName, {
        config: {
          broadcast: { self: false },
          presence: { key: this.localPresence.playerId },
        },
      });

      this.sbChannel
        .on("broadcast", { event: "game-event" }, ({ payload }) => {
          if (payload) {
            this.callbacks.onBroadcast(payload as RealtimeBroadcastEvent);
          }
        })
        .on("presence", { event: "sync" }, () => {
          if (!this.sbChannel) return;
          const state = this.sbChannel.presenceState<RoomPresencePayload>();
          const list: RoomPresencePayload[] = [];
          Object.values(state).forEach((arr) => {
            if (arr && arr.length > 0) {
              list.push(arr[0]);
            }
          });
          list.sort((a, b) => a.joinedAt - b.joinedAt);
          this.callbacks.onPresenceSync?.(list);
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED" && this.sbChannel) {
            await this.sbChannel.track(this.localPresence);
            this.callbacks.onStatusChange?.(true, "Supabase Realtime Aktif");
          }
        });
      return;
    }

    // Fallback: Multi-Tab BroadcastChannel for zero-config local online room testing
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.localChannel = new BroadcastChannel(
        `ular-tanggaz-room:${this.roomCode}`
      );
      this.localPeerMap.set(this.localPresence.playerId, this.localPresence);

      this.localChannel.onmessage = (msg) => {
        const data = msg.data;
        if (!data) return;

        if (data.kind === "PRESENCE_PING") {
          const peer = data.presence as RoomPresencePayload;
          this.localPeerMap.set(peer.playerId, peer);
          this.emitLocalPresence();
          // Reply with our own presence so newcomer sees us immediately
          this.localChannel?.postMessage({
            kind: "PRESENCE_PONG",
            presence: this.localPresence,
          });
        } else if (data.kind === "PRESENCE_PONG") {
          const peer = data.presence as RoomPresencePayload;
          this.localPeerMap.set(peer.playerId, peer);
          this.emitLocalPresence();
        } else if (data.kind === "PRESENCE_LEAVE") {
          this.localPeerMap.delete(data.playerId);
          this.emitLocalPresence();
        } else if (data.kind === "BROADCAST_EVENT") {
          this.callbacks.onBroadcast(data.event as RealtimeBroadcastEvent);
        }
      };

      // Announce arrival
      this.localChannel.postMessage({
        kind: "PRESENCE_PING",
        presence: this.localPresence,
      });
      this.emitLocalPresence();
      this.callbacks.onStatusChange?.(
        true,
        "Realtime Multi-Tab Lokal (Buka tab lain & masukkan kode 4 huruf yang sama!)"
      );

      this.heartbeatTimer = setInterval(() => {
        this.localChannel?.postMessage({
          kind: "PRESENCE_PONG",
          presence: this.localPresence,
        });
      }, 3000);
    }
  }

  private emitLocalPresence(): void {
    const list = Array.from(this.localPeerMap.values()).sort(
      (a, b) => a.joinedAt - b.joinedAt
    );
    this.callbacks.onPresenceSync?.(list);
  }

  public async updatePresence(partial: Partial<RoomPresencePayload>): Promise<void> {
    this.localPresence = { ...this.localPresence, ...partial };
    if (this.sbChannel) {
      await this.sbChannel.track(this.localPresence);
    } else if (this.localChannel) {
      this.localPeerMap.set(this.localPresence.playerId, this.localPresence);
      this.localChannel.postMessage({
        kind: "PRESENCE_PONG",
        presence: this.localPresence,
      });
      this.emitLocalPresence();
    }
  }

  public async sendEvent(event: RealtimeBroadcastEvent): Promise<void> {
    if (this.sbChannel) {
      await this.sbChannel.send({
        type: "broadcast",
        event: "game-event",
        payload: event,
      });
    } else if (this.localChannel) {
      this.localChannel.postMessage({
        kind: "BROADCAST_EVENT",
        event,
      });
    }
  }

  public disconnect(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.sbChannel) {
      this.sbChannel.unsubscribe();
      this.sbChannel = null;
    }
    if (this.localChannel) {
      this.localChannel.postMessage({
        kind: "PRESENCE_LEAVE",
        playerId: this.localPresence.playerId,
      });
      this.localChannel.close();
      this.localChannel = null;
    }
  }
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
