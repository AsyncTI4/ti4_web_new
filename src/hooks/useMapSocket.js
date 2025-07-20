import { useCallback, useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { config } from "../config";

export function useMapSocket(mapId, onMapUpdate) {
  const [isReconnecting, setIsReconnecting] = useState(false);

  const socket_url = config.api.socketUrl + "?map=" + mapId;

  const { sendJsonMessage, lastMessage, readyState, getWebSocket } =
    useWebSocket(socket_url, {
      reconnectInterval: 3000,
      shouldReconnect: (closeEvent) => true,
      onReconnectStop: () => setIsReconnecting(false),
    });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];


  useEffect(() => {
    if (connectionStatus === "Open") setIsReconnecting(false);
  }, [connectionStatus]);

  useEffect(() => {
    if (lastMessage === null) return;
    onMapUpdate(JSON.parse(lastMessage.data)["mapurl"]);
  }, [lastMessage]);

  useEffect(() => {
    sendJsonMessage({ command: "map", map: mapId });
  }, [sendJsonMessage, mapId]);

  const reconnect = useCallback(() => {
    setIsReconnecting(true);
    getWebSocket()?.close();
  }, [getWebSocket]);

  return { readyState, reconnect, isReconnecting };
}
