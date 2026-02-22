import { DetailsCard as DetailsCardComponent } from "./DetailsCard";
import DetailsCardIcon from "./DetailsCardIcon";
import DetailsCardTitle from "./DetailsCardTitle";
import DetailsCardSection from "./DetailsCardSection";

// Create compound component
type DetailsCardWithSubComponents = typeof DetailsCardComponent & {
  Icon: typeof DetailsCardIcon;
  Title: typeof DetailsCardTitle;
  Section: typeof DetailsCardSection;
};

const DetailsCard = DetailsCardComponent as DetailsCardWithSubComponents;
DetailsCard.Icon = DetailsCardIcon;
DetailsCard.Title = DetailsCardTitle;
DetailsCard.Section = DetailsCardSection;

export { DetailsCard };
