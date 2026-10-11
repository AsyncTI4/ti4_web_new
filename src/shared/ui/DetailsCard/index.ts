import { DetailsCard as DetailsCardComponent } from "./DetailsCard";
import DetailsCardIcon from "./DetailsCardIcon";
import DetailsCardTitle from "./DetailsCardTitle";
import DetailsCardSection from "./DetailsCardSection";
import DetailsCardFlavor from "./DetailsCardFlavor";
import DetailsCardFacts from "./DetailsCardFacts";

export type { DetailsCardColor } from "./DetailsCard";
export type { DetailsCardIconShape } from "./DetailsCardIcon";

export const DetailsCard = Object.assign(DetailsCardComponent, {
  Icon: DetailsCardIcon,
  Title: DetailsCardTitle,
  Section: DetailsCardSection,
  Flavor: DetailsCardFlavor,
  Facts: DetailsCardFacts,
});
