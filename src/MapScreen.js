import './MapScreen.css'; 

import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useWebSocket from "react-use-websocket";

function MapScreen() {
   const params = useParams()
   const imgref = useRef();

   const socket_url = "wss://4z4c1wj2e2.execute-api.us-east-1.amazonaws.com/dev?map=" + params.mapid; 

   const { sendJsonMessage, lastMessage } = useWebSocket(socket_url);

   useEffect(() => {
    if (lastMessage !== null) {
     imgref.current.src = JSON.parse(lastMessage.data)['mapurl'];
    }
   }, [lastMessage])
    
   useEffect(() => {
    sendJsonMessage({"command":"map", "map":params.mapid})
   }, [])

   useEffect(() => {
    fetch("https://ti4.westaddisonheavyindustries.com/maps.json")
      .then((res) => {
        return res.json()
      })
      .then((pl) => {
        const u = pl.find(x => x.MapName === params.mapid).MapURL
        imgref.current.src=u
      })
   }, [])
   
   return <div className='main'><img alt="map" ref={imgref}></img></div>
}

export default MapScreen;