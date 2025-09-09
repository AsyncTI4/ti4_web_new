import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { ReadyState } from "react-use-websocket";

export function useGameSocket(gameId: string, onRefresh: () => void) {
  const clientRef = useRef<Client | null>(null);
  const [readyState, setReadyState] = useState<ReadyState>(
    ReadyState.UNINSTANTIATED
  );
  const [isReconnecting, setIsReconnecting] = useState(false);

  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    // const brokerURL = import.meta.env.DEV
    //   ? "ws://localhost:8081/ws"
    //   : "wss://bot.asyncti4.com/ws";

    const brokerURL = "wss://bot.asyncti4.com/ws";
    const client = new Client({
      brokerURL,
      // Disable auto-reconnect; we will reconnect only on manual request
      reconnectDelay: 0,
    });

    client.beforeConnect = () => {
      setReadyState(ReadyState.CONNECTING);
    };

    client.onConnect = () => {
      setReadyState(ReadyState.OPEN);
      setIsReconnecting(false);
      client.subscribe(`/topic/game/${gameId}`, (msg: any) => {
        if (msg.body === "refresh") onRefreshRef.current?.();
      });
    };

    client.onWebSocketClose = () => {
      setReadyState(ReadyState.CLOSED);
      setIsReconnecting(false);
    };

    client.onWebSocketError = () => {
      setReadyState(ReadyState.CLOSED);
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
    setReadyState(ReadyState.CLOSING);
    client
      .deactivate()
      .finally(() => {
        setReadyState(ReadyState.CONNECTING);
        client.activate();
      })
      .catch(() => {});
  }, []);

  return { readyState, reconnect, isReconnecting };
}
