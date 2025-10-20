import {
  Drawer,
  Stack,
  NavLink,
  Divider,
  Box,
  Group,
  Anchor,
  ActionIcon,
  TextInput,
  Button,
} from "@mantine/core";
import {
  IconMap2,
  IconTarget,
  IconUsers,
  IconPencil,
  IconX,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
// @ts-ignore
import Logo from "./Logo";
// @ts-ignore
import { DiscordLogin } from "./DiscordLogin";
import { CircularFactionIcon } from "./shared/CircularFactionIcon";
import { generateColorGradient } from "@/lookup/colors";

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
  const [editingTab, setEditingTab] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    onClose();
  };

  const handleGameClick = (id: string) => {
    if (editingTab) return;
    onGameChange(id);
    onClose();
  };

  const handleEditClick = (tabId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (editingTab === tabId) {
      if (inputRef.current) {
        handleTabRename(tabId, inputRef.current.value);
      }
      setEditingTab(null);
    } else {
      setEditingTab(tabId);
    }
  };

  const handleTabRename = (oldTab: string, newTab: string) => {
    if (oldTab !== newTab) {
      localStorage.setItem(oldTab, newTab);
    }
    setEditingTab(null);
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
          <NavLink
            label="Map"
            leftSection={<IconMap2 size={20} />}
            active={activeTab === "map"}
            onClick={() => handleTabClick("map")}
          />
          <NavLink
            label="General"
            leftSection={<IconTarget size={20} />}
            active={activeTab === "general"}
            onClick={() => handleTabClick("general")}
          />
          <NavLink
            label="Player"
            leftSection={<IconUsers size={20} />}
            active={activeTab === "players"}
            onClick={() => handleTabClick("players")}
          />
        </Stack>

        <Divider />

        <Stack gap="xs">
          <Anchor
            to="/games"
            size="sm"
            fw={600}
            c="orange"
            underline="hover"
            component={Link}
            onClick={onClose}
          >
            All Games
          </Anchor>

          {activeTabs.map((tab) => (
            <Box
              key={tab.id}
              style={{
                position: "relative",
              }}
            >
              <NavLink
                label={
                  editingTab === tab.id ? (
                    <TextInput
                      ref={inputRef}
                      size="xs"
                      defaultValue={localStorage.getItem(tab.id) || tab.id}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleTabRename(tab.id, e.currentTarget.value);
                        } else if (e.key === "Escape") {
                          handleTabRename(tab.id, tab.id);
                        }
                      }}
                      onBlur={(e) =>
                        handleTabRename(tab.id, e.currentTarget.value)
                      }
                      autoFocus
                      style={{ flex: 1 }}
                    />
                  ) : (
                    <Group justify="space-between" style={{ width: "100%" }}>
                      <span>{localStorage.getItem(tab.id) || tab.id}</span>
                      <Group gap="xs">
                        <ActionIcon
                          size="xs"
                          variant="subtle"
                          onClick={(event: React.MouseEvent) =>
                            handleEditClick(tab.id, event)
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
                  )
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
