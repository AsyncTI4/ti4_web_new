import { Stack } from "@mantine/core";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { PlotCardInfo } from "@/entities/data/types";
import { SecretObjectiveIcon } from "@/shared/ui/SecretObjectiveIcon";

type Props = {
  plot: PlotCardInfo;
};

export function PlotDetails({ plot }: Props) {
  return (
    <DetailsCard width={320} color="red">
      <Stack gap="md">
        <DetailsCard.Title
          title={plot.name}
          subtitle={plot.text}
          icon={
            <DetailsCard.Icon
              icon={<SecretObjectiveIcon size={60} p="xs" />}
            />
          }
          captionColor="red"
        />
      </Stack>
    </DetailsCard>
  );
}
