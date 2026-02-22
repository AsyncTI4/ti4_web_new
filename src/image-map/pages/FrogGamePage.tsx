import { useParams } from "react-router-dom";
import { Center, Stack, Text, Container } from "@mantine/core";
import { IconBrandDiscordFilled } from "@tabler/icons-react";
import MapUI from "@/image-map/components/MapUI";
import { useFrogMap } from "@/image-map/hooks/useFrogMap";
import { useUser } from "@/hooks/useUser";
import { DiscordAuthButton } from "@/domains/auth/DiscordLogin";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

function FrogGamePage() {
  const params = useParams<{ discordid: string; mapid: string }>();
  useDocumentTitle(
    params.mapid ? `${params.mapid} - | AsyncTI4` : null,
    "AsyncTI4",
  );
  const frogMap = useFrogMap(params.discordid, params.mapid);
  const imageUrl = frogMap?.data;
  const { user } = useUser();

  const isOwner = user?.id === params.discordid;

  if (!isOwner) {
    return (
      <Center h="100vh">
        <Container size="sm">
          <Stack align="center" spacing="md">
            <Text size="xl">You are not the owner of this map</Text>
            <Text size="xl">Please log in with Discord to continue</Text>
            <DiscordAuthButton
              size="xl"
              leftSection={<IconBrandDiscordFilled />}
            >
              Discord Login
            </DiscordAuthButton>
          </Stack>
        </Container>
      </Center>
    );
  }

  return (
    <MapUI
      params={params}
      imageUrl={imageUrl}
      reconnect={() => {
        void frogMap.refetch();
      }}
      isReconnecting={frogMap.isFetching}
      showRefresh={false}
      isError={frogMap.isError}
      error={frogMap.error as Error | null}
    />
  );
}

export default FrogGamePage;
