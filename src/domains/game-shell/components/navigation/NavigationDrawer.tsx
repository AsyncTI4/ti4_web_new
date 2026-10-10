import {
  Drawer,
  Stack,
  NavLink,
  Divider,
  Box,
  Group,
  ActionIcon,
  Button,
} from "@mantine/core";
import {
  IconCards,
  IconHistory,
  IconLayoutDashboard,
  IconPencil,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "@/shared/ui/Logo";
import { DiscordLogin } from "@/domains/auth/DiscordLogin";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { EditableTabLabel } from "@/domains/tabs/components/EditableTabLabel";
import { generateColorGradient } from "@/entities/lookup/colors";
import { useTabLabelEditing } from "@/domains/tabs/hooks/useTabLabelEditing";
import type { EnrichedTab } from "@/domains/tabs/hooks/useTabManagement";
import { MAIN_TAB_CONFIGS } from "@/domains/game-shell/components/mainTabs";
import { useUser } from "@/api/auth/useUser";

type NavigationDrawerProps = {
  opened: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  gameId: string;
  activeTabs: EnrichedTab[];
  onGameChange: (gameId: string) => void;
  onRemoveTab: (gameId: string) => void;
  onShowOldUI?: () => void;
  /** Lists the player's hand in the menu when given. */
  onCardsClick?: () => void;
  /** Lists the event log in the menu when given. */
  onEventsClick?: () => void;
};

export function NavigationDrawer({
  opened,
  onClose,
  activeTab,
  onTabChange,
  gameId,
  activeTabs,
  onGameChange,
  onRemoveTab,
  onShowOldUI,
  onCardsClick,
  onEventsClick,
}: NavigationDrawerProps) {
  const tabLabelEditing = useTabLabelEditing();
  const { editingTabId, toggleEditing } = tabLabelEditing;
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    onClose();
  };

  const handleGameClick = (id: string) => {
    if (editingTabId) return;
    onGameChange(id);
    onClose();
  };

  const handleRemoveClick = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onRemoveTab(tabId);
  };

  const handleRouteClick = (route: string) => {
    navigate(route);
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="right"
      title={
        <Group gap="xs">
          <Logo />
        </Group>
      }
      hiddenFrom="sm"
      size="sm"
      zIndex="var(--z-navigation-drawer)"
    >
      <Stack gap="md">
        <Box>
          <DiscordLogin />
        </Box>

        {user?.authenticated && (
          <>
            <Divider />

            <Stack gap="xs">
              <NavLink
                label="Dashboard"
                leftSection={<IconLayoutDashboard size={18} />}
                active={location.pathname === "/dashboard"}
                onClick={() => handleRouteClick("/dashboard")}
              />
              <NavLink
                label="Settings"
                leftSection={<IconSettings size={18} />}
                active={location.pathname === "/dashboard/settings"}
                onClick={() => handleRouteClick("/dashboard/settings")}
              />
            </Stack>
          </>
        )}

        <Divider />

        {onShowOldUI && (
          <Button
            variant="light"
            size="xs"
            color="cyan"
            onClick={() => {
              onShowOldUI();
              onClose();
            }}
          >
            GO TO OLD UI
          </Button>
        )}

        <Stack gap="xs">
          {onCardsClick && (
            <NavLink
              label="Your cards"
              leftSection={<IconCards size={20} />}
              onClick={() => {
                onCardsClick();
                onClose();
              }}
            />
          )}
          {onEventsClick && (
            <NavLink
              label="Event log"
              leftSection={<IconHistory size={20} />}
              onClick={() => {
                onEventsClick();
                onClose();
              }}
            />
          )}
          {MAIN_TAB_CONFIGS.map((tab) => {
            const Icon = tab.Icon;
            return (
              <NavLink
                key={tab.value}
                label={tab.label}
                leftSection={<Icon size={20} />}
                active={activeTab === tab.value}
                onClick={() => handleTabClick(tab.value)}
              />
            );
          })}
        </Stack>

        <Divider />

        <Stack gap="xs">
          {activeTabs.map((tab) => (
            <Box key={tab.id} pos="relative">
              <NavLink
                label={
                  <EditableTabLabel
                    tabId={tab.id}
                    editingApi={tabLabelEditing}
                    inputProps={{ style: { flex: 1 } }}
                    renderDisplay={(displayName) => (
                      <Group justify="space-between" style={{ width: "100%" }}>
                        <span>{displayName}</span>
                        <Group gap="xs">
                          <ActionIcon
                            size="xs"
                            variant="subtle"
                            onClick={(event: React.MouseEvent) =>
                              toggleEditing(tab.id, event)
                            }
                          >
                            <IconPencil size={14} />
                          </ActionIcon>
                          {!tab.isManaged && (
                            <ActionIcon
                              size="xs"
                              variant="subtle"
                              color="red"
                              onClick={(event: React.MouseEvent) =>
                                handleRemoveClick(tab.id, event)
                              }
                            >
                              <IconX size={14} />
                            </ActionIcon>
                          )}
                        </Group>
                      </Group>
                    )}
                  />
                }
                active={tab.id === gameId}
                onClick={() => handleGameClick(tab.id)}
                leftSection={
                  tab.faction ? (
                    <CircularFactionIcon
                      faction={tab.faction}
                      factionImageOverride={tab.factionImage}
                      factionImageTypeOverride={tab.factionImageType}
                      size={16}
                    />
                  ) : null
                }
                style={
                  tab.factionColor
                    ? {
                        borderLeft: `3px solid`,
                        borderImage: `${generateColorGradient(tab.factionColor, 0.5)} 1`,
                      }
                    : undefined
                }
              />
            </Box>
          ))}
        </Stack>
      </Stack>
    </Drawer>
  );
}
