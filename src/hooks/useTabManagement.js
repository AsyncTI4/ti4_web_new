import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function useTabManagement() {
  const navigate = useNavigate();
  const params = useParams();
  const [activeTabs, setActiveTabs] = useState([]);

  useEffect(() => {
    const storedTabs = JSON.parse(localStorage.getItem("activeTabs")) || [];
    const currentGame = params.mapid;
    if (!storedTabs.includes(currentGame)) {
      storedTabs.push(currentGame);
    }

    setActiveTabs(storedTabs.filter((tab) => !!tab));
  }, [params.mapid]);

  useEffect(() => {
    if (activeTabs.length === 0) return;
    localStorage.setItem("activeTabs", JSON.stringify(activeTabs));
  }, [activeTabs]);

  const changeTab = (tab) => {
    if (tab === params.mapid) return;
    navigate(`/game/${tab}`);
  };

  const removeTab = (tabValue) => {
    const remaining = activeTabs.filter((tab) => tab !== tabValue);
    setActiveTabs(remaining);
    localStorage.setItem("activeTabs", JSON.stringify(remaining));

    if (params.mapid !== tabValue) return;

    if (remaining.length > 0) {
      changeTab(remaining[0]);
    } else {
      navigate("/");
    }
  };

  return { activeTabs, changeTab, removeTab };
}
