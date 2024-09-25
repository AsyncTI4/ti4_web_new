import { AppShell, Button, Group, Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/banner.png";

function Header({ currentTab, onImageUrlReset }) {
  const navigate = useNavigate();
  const [activeTabs, setActiveTabs] = useState([]);

  useEffect(() => {
    const storedTabs = JSON.parse(localStorage.getItem("activeTabs")) || [];
    if (!storedTabs.includes(currentTab)) {
      storedTabs.push(currentTab);
    }
    setActiveTabs(storedTabs);
  }, [currentTab]);

  useEffect(() => {
    if (activeTabs.length === 0) return;
    localStorage.setItem("activeTabs", JSON.stringify(activeTabs));
  }, [activeTabs]);

  const changeTab = (tab) => {
    onImageUrlReset();
    navigate(`/game/${tab}`);
  };

  const removeTab = (tabValue) => {
    const remaining = activeTabs.filter((tab) => tab !== tabValue);
    setActiveTabs(remaining);
    localStorage.setItem("activeTabs", JSON.stringify(remaining));
    if (remaining.length > 0) {
      changeTab(remaining[0]);
    } else {
      navigate("/");
    }
  };

  return (
    <AppShell.Header>
      <Group align="center" h="100%" px="sm" gap="sm">
        <img src={logo} alt="banner" className="logo" />
        <div className="logo-divider" />
        <Group>
          <Tabs variant="pills" onChange={changeTab} value={currentTab}>
            <Tabs.List>
              {activeTabs.map((tab) => (
                <Tabs.Tab
                  key={tab}
                  value={tab}
                  rightSection={
                    <Button
                      size="compact-xs"
                      color="red"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeTab(tab);
                      }}
                    >
                      x
                    </Button>
                  }
                >
                  {tab}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </Group>
      </Group>
    </AppShell.Header>
  );
}

export default Header;
