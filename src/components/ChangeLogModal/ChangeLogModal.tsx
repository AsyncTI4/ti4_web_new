import { useEffect, useMemo, useState } from "react";
import { Modal, ScrollArea, Stack, Text } from "@mantine/core";
import classes from "./ChangeLogModal.module.css";

export type ChangeLogItem = {
  version: string;
  date?: string;
  sections: Array<{
    title: string;
    items: string[];
  }>;
};

const STORAGE_KEY_PREFIX = "changelog_viewed_";

function getStorageKey(version: string): string {
  return `${STORAGE_KEY_PREFIX}${version}`;
}

type Props = {
  version: string;
  changelog: ChangeLogItem;
};

export function ChangeLogModal({ version, changelog }: Props) {
  const [opened, setOpened] = useState(false);

  const storageKey = useMemo(() => getStorageKey(version), [version]);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey) === "true";
      if (!seen) setOpened(true);
    } catch {
      setOpened(true);
    }
  }, [storageKey]);

  const handleClose = () => {
    try {
      localStorage.setItem(storageKey, "true");
    } catch {
      // ignore
    }
    setOpened(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title="What's new"
      size="lg"
      centered
      zIndex={3300}
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="sm" className={classes.body}>
        <Text className={classes.versionTitle}>v{changelog.version}</Text>
        {changelog.sections.map((section) => (
          <div key={section.title} className={classes.section}>
            <Text size="sm" fw={600} className={classes.sectionTitle}>
              {section.title}
            </Text>
            <ul className={classes.list}>
              {section.items.map((text, idx) => (
                <li key={idx} className={classes.listItem}>
                  <Text size="sm">{text}</Text>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Stack>
    </Modal>
  );
}

export default ChangeLogModal;
