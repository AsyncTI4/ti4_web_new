import { Image } from "@/ds";
import { getActionCard } from "@/entities/lookup/actionCards";
import { cdnImage } from "@/entities/data/cdnImage";
import { DetailsCard } from "@/shared/ui/DetailsCard";

type Props = {
  actionCardId: string;
};

export function ActionCardDetailsCard({ actionCardId }: Props) {
  const actionCardData = getActionCard(actionCardId);

  if (!actionCardData) return null;

  return (
    <DetailsCard width={340} color="yellow">
      <DetailsCard.Title
        title={actionCardData.name}
        type="Action card"
        meta={[actionCardData.phase && `${actionCardData.phase} phase`]}
        icon={
          <DetailsCard.Icon
            shape="card"
            icon={
              <Image
                src={cdnImage("/player_area/cardback_action.jpg")}
                alt=""
              />
            }
          />
        }
      />
      <DetailsCard.Section
        title={actionCardData.window}
        content={actionCardData.text}
      />
      {actionCardData.flavorText && (
        <DetailsCard.Flavor>{actionCardData.flavorText}</DetailsCard.Flavor>
      )}
    </DetailsCard>
  );
}
