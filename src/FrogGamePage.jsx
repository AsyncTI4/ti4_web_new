import { useNavigate, useParams } from "react-router-dom";
import { Center, Stack, Text, Button, Container } from "@mantine/core";
import { IconBrandDiscordFilled } from "@tabler/icons-react";
import MapUI from "./components/MapUI";
import { useFrogMap } from "./hooks/useFrogMap";
import { useUser } from "./hooks/useUser";
import { DiscordAuthButton } from "./components/DiscordLogin";

import { useDocumentTitle } from "./hooks/useDocumentTitle";

function FrogGamePage() {
  const navigate = useNavigate();
  const params = useParams();
  useDocumentTitle(
    params.mapid ? `${params.mapid} - | AsyncTI4` : null,
    "AsyncTI4",
  );
  const frogMap = useFrogMap(params.discordid, params.mapid);
  const imageUrl = frogMap?.data;
  const user = useUser();

  // check if user id matches discordid
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
      activeTabs={[]}
      params={params}
      changeTab={() => {}}
      removeTab={() => {}}
      imageUrl={imageUrl}
      derivedImageUrl={imageUrl}
      defaultImageUrl={imageUrl}
      navigate={navigate}
    />
  );
}

export default FrogGamePage;
