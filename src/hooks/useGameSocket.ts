import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import type { IMessage } from "@stomp/stompjs";
import { config } from "../config";
import type { GameStateMessage } from "@/entities/data/types";

export enum SocketReadyState {
  UNINSTANTIATED = -1,
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export function useGameSocket(
  gameId: string,
  onRefresh: () => void,
  onStateMessage?: (msg: GameStateMessage) => void
) {
  const clientRef = useRef<Client | null>(null);
  const [readyState, setReadyState] = useState<SocketReadyState>(
    SocketReadyState.UNINSTANTIATED
  );
  const [isReconnecting, setIsReconnecting] = useState(false);

  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  const onStateMessageRef = useRef(onStateMessage);
  useEffect(() => {
    onStateMessageRef.current = onStateMessage;
  }, [onStateMessage]);

  useEffect(() => {
    const brokerURL = config.api.websocketUrl;
    const client = new Client({ brokerURL, reconnectDelay: 0 });

    client.beforeConnect = () => {
      setReadyState(SocketReadyState.CONNECTING);
    };

    client.onConnect = () => {
      setReadyState(SocketReadyState.OPEN);
      setIsReconnecting(false);
      client.subscribe(`/topic/game/${gameId}`, (msg: any) => {
        if (msg.body === "refresh") onRefreshRef.current?.();
      });
      client.subscribe(`/topic/game/${gameId}/state`, (msg: IMessage) => {
        try {
          onStateMessageRef.current?.(JSON.parse(msg.body) as GameStateMessage);
        } catch (e) {
          console.error("Bad game state message", e);
        }
      });
    };

    client.onWebSocketClose = () => {
      setReadyState(SocketReadyState.CLOSED);
      setIsReconnecting(false);
    };

    client.onWebSocketError = () => {
      setReadyState(SocketReadyState.CLOSED);
      setIsReconnecting(false);
    };

    clientRef.current = client;
    client.activate();

    return () => {
      clientRef.current = null;
      client.deactivate();
    };
  }, [gameId]);

  const reconnect = useCallback(() => {
    const client = clientRef.current;
    if (!client) return;
    setIsReconnecting(true);
    // Restart the client to force a reconnect cycle
    setReadyState(SocketReadyState.CLOSING);
    client
      .deactivate()
      .finally(() => {
        setReadyState(SocketReadyState.CONNECTING);
        client.activate();
      })
      .catch(() => {});
  }, []);

  return { readyState, reconnect, isReconnecting };
}
