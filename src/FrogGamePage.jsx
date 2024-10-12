import { useNavigate, useParams } from "react-router-dom";
import { Center, Stack, Text, Button, Container } from "@mantine/core";
import { IconBrandDiscordFilled } from "@tabler/icons-react";
import MapUI from "./components/MapUI";
import { useFrogMap } from "./hooks/useFrogMap";
import { useUser } from "./hooks/useUser";
import { getDiscordOauthUrl } from "./components/DiscordLogin";

import "dragscroll/dragscroll.js";

function FrogGamePage() {
  const navigate = useNavigate();
  const params = useParams();
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
            <Button
              component="a"
              href={getDiscordOauthUrl()}
              size="xl"
              leftSection={<IconBrandDiscordFilled />}
            >
              Discord Login
            </Button>
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
