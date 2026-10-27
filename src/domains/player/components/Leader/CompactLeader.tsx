import { LeaderPortraitImage } from "@/shared/ui/LeaderPortraitImage";
import { SmoothPopover } from "@/shared/ui/SmoothPopover";
import { LeaderDetailsCard } from "@/domains/cards/components/LeaderDetailsCard";
import styles from "./CompactLeader.module.css";
import { useDisclosure } from "@/hooks/useDisclosure";
import { lowPriorityImageProps } from "@/shared/ui/imageLoading";
import { searchKey, searchTarget } from "@/domains/search/searchKeys";

type Props = {
  id: string;
  exhausted: boolean;
  locked: boolean;
};

export function CompactLeader({ id, exhausted, locked }: Props) {
  const { opened, setOpened, toggle } = useDisclosure(false);
  const shouldShowGreen = !exhausted && !locked;

  return (
    <SmoothPopover opened={opened} onChange={setOpened}>
      <SmoothPopover.Target>
        <div
          className={`${styles.compact} ${shouldShowGreen ? styles.active : styles.inactive}`}
          onClick={toggle}
          role="button"
          tabIndex={0}
          {...searchTarget(searchKey("leader", id))}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
        >
          <div className={styles.imageFrame}>
            <LeaderPortraitImage
              {...lowPriorityImageProps}
              leaderId={id}
              className={styles.image}
            />
          </div>
        </div>
      </SmoothPopover.Target>
      <SmoothPopover.Dropdown p={0}>
        <LeaderDetailsCard leaderId={id} />
      </SmoothPopover.Dropdown>
    </SmoothPopover>
  );
}
