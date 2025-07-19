import { Stack, Image, Divider } from "@mantine/core";
import { getSecretObjectiveData as getSecretData } from "../../../lookup/secretObjectives";
import { DetailsCard } from "@/components/shared/DetailsCard";

type Props = {
  secretId: string;
};

export function SecretObjectiveCard({ secretId }: Props) {
  const secretData = getSecretData(secretId);

  if (!secretData) return null;

  const renderSecretIcon = () => (
    <Image src="/so_icon.png" w={60} h={60} p="xs" />
  );

  return (
    <DetailsCard width={320} color="red">
      <Stack gap="md">
        <DetailsCard.Title
          title={secretData.name}
          subtitle={`${secretData.phase} Phase • ${secretData.points} VP`}
          icon={<DetailsCard.Icon icon={renderSecretIcon()} />}
          caption="Secret Objective"
          captionColor="red"
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section title="Objective" content={secretData.text} />
      </Stack>
    </DetailsCard>
  );
}
