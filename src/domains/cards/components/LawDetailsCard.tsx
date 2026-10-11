import { IconScale } from "@tabler/icons-react";
import { LawInPlay } from "@/entities/data/types";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon";
import { DetailsCard } from "@/shared/ui/DetailsCard";
import styles from "./cardText.module.css";

type Props = {
  law: LawInPlay;
};

function present(text: string | null | undefined): text is string {
  return !!text && text.trim().length > 0;
}

export function LawDetailsCard({ law }: Props) {
  return (
    <DetailsCard width={340} color="purple">
      <DetailsCard.Title
        title={law.name}
        type={law.type || "Law"}
        meta={["In play"]}
        icon={
          <DetailsCard.Icon shape="round" icon={<IconScale stroke={1.6} />} />
        }
      />
      <DetailsCard.Section
        title="Effect"
        content={
          <div className={styles.lines}>
            <p>{law.text1}</p>
            {present(law.text2) && <p>{law.text2}</p>}
          </div>
        }
      />
      {present(law.mapText) && (
        <DetailsCard.Section title="Ongoing effect" content={law.mapText} />
      )}
      {law.electedFaction && (
        <DetailsCard.Section
          title="Elected"
          content={
            <span className={styles.elected}>
              <CircularFactionIcon faction={law.electedFaction} size={22} />
              {law.electedFaction}
            </span>
          }
        />
      )}
    </DetailsCard>
  );
}
