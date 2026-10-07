import { Tabs, Box } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { DiscordLogin } from "@/domains/auth/DiscordLogin";
import { isMobileDevice } from "@/utils/isTouchDevice";
import type { EnrichedTab } from "@/app/providers/context/types";
import {
  useTabLabelEditing,
  type TabLabelEditingApi,
} from "@/hooks/useTabLabelEditing";
import { EditableTabLabel } from "@/shared/ui/EditableTabLabel";
import { factionTabStyle, TabActions, TabFactionIcon } from "./HeaderTabParts";
import { TabDropdownView } from "./TabDropdownView";
import classes from "./HeaderMenuNew.module.css";

type HeaderMenuNewProps = {
  mapId: string;
  activeTabs: EnrichedTab[];
  changeTab: (tab: string) => void;
  removeTab: (tab: string) => void;
  actions?: React.ReactNode;
};

/**
 * Switches to the dropdown once the tab strip overflows, remembering the
 * window width at that moment so widening past it restores the strip.
 */
function useTabOverflow(
  tabsListRef: React.RefObject<HTMLDivElement | null>,
  activeTabs: EnrichedTab[],
) {
  const [overflowing, setOverflowing] = useState(false);
  const [widthThreshold, setWidthThreshold] = useState<number | null>(null);

  useEffect(() => {
    const checkForOverflow = () => {
      if (widthThreshold && window.innerWidth > widthThreshold) {
        setWidthThreshold(null);
        setOverflowing(false);
        return;
      }

      const tabsList = tabsListRef.current;
      if (!tabsList || overflowing) return;
      if (tabsList.scrollWidth <= tabsList.clientWidth) return;
      setWidthThreshold(window.innerWidth);
      setOverflowing(true);
    };

    checkForOverflow();
    window.addEventListener("resize", checkForOverflow);
    return () => window.removeEventListener("resize", checkForOverflow);
  }, [tabsListRef, activeTabs, overflowing, widthThreshold]);

  return overflowing;
}

function TabStripView({
  mapId,
  activeTabs,
  changeTab,
  removeTab,
  tabLabelEditing,
  tabsListRef,
}: {
  mapId: string;
  activeTabs: EnrichedTab[];
  changeTab: (tab: string) => void;
  removeTab: (tab: string) => void;
  tabLabelEditing: TabLabelEditingApi;
  tabsListRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <Tabs
      variant="pills"
      onChange={(value) => value && changeTab(value)}
      value={mapId}
      className={classes.tabs}
    >
      <Tabs.List className={classes.tabsList} ref={tabsListRef}>
        {activeTabs.map((tab) => (
          <Tabs.Tab
            key={tab.id}
            value={tab.id}
            className={classes.tab}
            style={factionTabStyle(tab.factionColor)}
            leftSection={
              tab.faction ? <TabFactionIcon tab={tab} size={16} /> : null
            }
            rightSection={
              <TabActions
                tab={tab}
                onEdit={(event) => tabLabelEditing.toggleEditing(tab.id, event)}
                onClose={() => removeTab(tab.id)}
              />
            }
          >
            <EditableTabLabel
              tabId={tab.id}
              editingApi={tabLabelEditing}
              inputProps={{
                className: classes.tabInput,
                onClick: (event) => event.stopPropagation(),
              }}
              renderDisplay={(displayName) => (
                <span className={classes.tabText}>{displayName}</span>
              )}
            />
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}

export function HeaderMenuNew({
  mapId,
  activeTabs,
  changeTab,
  removeTab,
  actions,
}: HeaderMenuNewProps) {
  const tabsListRef = useRef<HTMLDivElement>(null);
  const overflowing = useTabOverflow(tabsListRef, activeTabs);
  const tabLabelEditing = useTabLabelEditing();
  const viewProps = {
    mapId,
    activeTabs,
    changeTab,
    removeTab,
    tabLabelEditing,
  };

  return (
    <>
      <div className={classes.tabsContainer}>
        {overflowing || isMobileDevice() ? (
          <TabDropdownView {...viewProps} />
        ) : (
          <TabStripView {...viewProps} tabsListRef={tabsListRef} />
        )}
      </div>
      {actions}
      <Box visibleFrom="sm">
        <DiscordLogin />
      </Box>
    </>
  );
}
