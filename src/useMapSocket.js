import { useEffect } from "react";
import useWebSocket from "react-use-websocket";

export function useMapSocket(mapId, onMapUpdate) {
  const socket_url =
    "wss://4z4c1wj2e2.execute-api.us-east-1.amazonaws.com/dev?map=" + mapId;

  const { sendJsonMessage, lastMessage } = useWebSocket(socket_url);

  useEffect(() => {
    if (lastMessage === null) return;
    onMapUpdate(JSON.parse(lastMessage.data)["mapurl"]);
  }, [lastMessage]);

  useEffect(() => {
    sendJsonMessage({ command: "map", map: mapId });
  }, [sendJsonMessage, mapId]);
}
