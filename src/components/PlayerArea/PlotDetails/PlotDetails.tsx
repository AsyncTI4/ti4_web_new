import { Stack, Image } from "@mantine/core";
import { DetailsCard } from "@/components/shared/DetailsCard";
import { PlotCardInfo } from "@/data/types";

type Props = {
  plot: PlotCardInfo;
};

export function PlotDetails({ plot }: Props) {

  const renderSecretIcon = () => (
    <Image src="/so_icon.png" w={60} h={60} p="xs" />
  );

  return (
    <DetailsCard width={320} color="red">
      <Stack gap="md">
        <DetailsCard.Title
          title={plot.name}
          subtitle={plot.text}
          icon={<DetailsCard.Icon icon={renderSecretIcon()} />}
          captionColor="red"
        />
      </Stack>
    </DetailsCard>
  );
}
