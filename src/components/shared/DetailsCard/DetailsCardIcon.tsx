import { Box } from "@mantine/core";
import classes from "./DetailsCard.module.css";

function DetailsCardIcon({ icon }: { icon: React.ReactNode }) {
  return <Box className={classes.detailsCardIcon}>{icon}</Box>;
}

export default DetailsCardIcon;
