
export type RealtimeListener = (payload: any) => void;
export type RealtimeChannel = any;

export interface RealtimeConnection {
  channel: RealtimeChannel;
  listeners: Set<RealtimeListener>;
  isConnected: boolean;
  reconnectAttempts: number;
  lastActivity: number;
}

export interface RealtimeConfig {
  maxReconnectAttempts: number;
  reconnectDelayMs: number;
  maxReconnectDelayMs: number;
  cleanupDelayMs: number;
}

export const DEFAULT_REALTIME_CONFIG: RealtimeConfig = {
  maxReconnectAttempts: 3,
  reconnectDelayMs: 1000,
  maxReconnectDelayMs: 10000,
  cleanupDelayMs: 1000
};
