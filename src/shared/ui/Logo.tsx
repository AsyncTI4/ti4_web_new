import { Image } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import desktopLogo from "@/assets/banner.png";
import mobileLogo from "@/assets/bannerStacked.png";
import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 47.999em)");
  return (
    <Image
      src={isMobile ? mobileLogo : desktopLogo}
      alt="banner"
      className="logo"
      onClick={() => navigate("/")}
      style={{ cursor: "pointer" }}
      h={ 25 }
      p={{ base: 0, sm: 4 }}
      w="auto"
      fit="contain"
    />
  );
}

export default Logo;
