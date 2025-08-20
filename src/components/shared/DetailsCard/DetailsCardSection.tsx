import { Box, Text } from "@mantine/core";
import { ReactNode } from "react";
import classes from "./DetailsCard.module.css";

type Props = {
  title?: string;
  content: string | ReactNode;
};

function DetailsCardSection({ title, content }: Props) {
  return (
    <Box>
      {title && (
        <Text size="sm" c="blue.3" mb={4} className={classes.sectionTitle}>
          {title}
        </Text>
      )}
      {typeof content === "string" ? (
        <Text size="sm" c="gray.2" lh={1.4}>
          {content}
        </Text>
      ) : (
        content
      )}
    </Box>
  );
}

export default DetailsCardSection;
