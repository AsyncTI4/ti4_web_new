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
import { IconPencil, IconX } from "@tabler/icons-react";
import Logo from "@/shared/ui/branding/Logo";
import { DiscordLogin } from "@/domains/auth/components/DiscordLogin";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { EditableTabLabel } from "@/shared/ui/EditableTabLabel";
import { generateColorGradient } from "@/entities/lookup/colors";
import { useTabLabelEditing } from "@/hooks/useTabLabelEditing";
import { MAIN_TAB_CONFIGS } from "@/domains/game-shell/components/main/mainTabs";

type EnrichedTab = {
  id: string;
  faction: string | null;
  factionColor: string | null;
  isManaged: boolean;
};

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
}: NavigationDrawerProps) {
  const tabLabelEditing = useTabLabelEditing();
  const { editingTabId, toggleEditing } = tabLabelEditing;

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
      zIndex={10000}
    >
      <Stack gap="md">
        {/* Discord Login */}
        <Box>
          <DiscordLogin />
        </Box>

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
          {MAIN_TAB_CONFIGS.filter(
            (tab) => tab.includeInDrawer !== false
          ).map((tab) => {
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
            <Box
              key={tab.id}
              style={{
                position: "relative",
              }}
            >
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
                    <CircularFactionIcon faction={tab.faction} size={16} />
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
