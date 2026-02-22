import { Stack, Divider } from "@mantine/core";
import { getSecretObjectiveData as getSecretData } from "@/entities/lookup/secretObjectives";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import { SecretObjectiveIcon } from "@/shared/ui/SecretObjectiveIcon";

type Props = {
  secretId: string;
};

export function SecretObjectiveCard({ secretId }: Props) {
  const secretData = getSecretData(secretId);

  if (!secretData) return null;

  return (
    <DetailsCard width={320} color="red">
      <Stack gap="md">
        <DetailsCard.Title
          title={secretData.name}
          subtitle={`${secretData.phase} Phase • ${secretData.points} VP`}
          icon={
            <DetailsCard.Icon
              icon={<SecretObjectiveIcon size={60} p="xs" />}
            />
          }
          caption="Secret Objective"
          captionColor="red"
        />

        <Divider c="gray.7" opacity={0.8} />

        <DetailsCard.Section title="Objective" content={secretData.text} />
      </Stack>
    </DetailsCard>
  );
}
