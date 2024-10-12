import { Image } from "@mantine/core";

import logo from "../assets/banner.png";
import { useNavigate } from "react-router-dom";

function Logo() {
  const navigate = useNavigate();
  return (
    <Image
      src={logo}
      alt="banner"
      className="logo"
      onClick={() => navigate("/")}
      style={{ cursor: "pointer" }}
      h={{ base: 12, sm: 25 }}
      p={{ base: 0, sm: 4 }}
      w="auto"
      fit="contain"
    />
  );
}

export default Logo;
