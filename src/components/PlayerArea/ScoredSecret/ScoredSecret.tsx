import { Image } from "@mantine/core";
import { getSecretObjectiveData } from "../../../lookup/secretObjectives";
import { Chip } from "@/components/shared/primitives/Chip";
import { SmoothPopover } from "@/components/shared/SmoothPopover";
import { useState } from "react";
import { SecretObjectiveCard } from "../SecretObjectiveCard";

type Props = {
  secretId: string;
  onClick?: () => void;
  variant?: "scored" | "unscored";
};

export function ScoredSecret({ secretId, onClick, variant = "scored" }: Props) {
  const [opened, setOpened] = useState(false);
  const secretData = getSecretObjectiveData(secretId);
  const secretName = secretData?.name || secretId;
  const isScored = variant === "scored";

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <div>
          <Chip
            accent={isScored ? "red" : "gray"}
            onClick={() => {
              setOpened((o) => !o);
              if (onClick) onClick();
            }}
            leftSection={<Image src="/so_icon.png" />}
            ribbon
            title={secretName}
          />
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <SecretObjectiveCard secretId={secretId} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
