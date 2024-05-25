import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

function MapScreen() {
   const params = useParams()
   const imgref = useRef();
   useEffect(() => {
    fetch("https://ti4.westaddisonheavyindustries.com/maps.json")
      .then((res) => {
        return res.json()
      })
      .then((pl) => {
        console.log(pl)
        const u = pl.find(x => x.MapName === params.mapid).MapURL
        imgref.current.src=u
      })
   })
   
   return <div><img alt="map" ref={imgref}></img></div>
}

export default MapScreen;