import { Stack, Divider, Group } from "@mantine/core";
import { StatMono } from "@/shared/ui/primitives/StatMono";
import InfluenceIcon from "@/shared/ui/InfluenceIcon";
import { cdnImage } from "@/entities/data/cdnImage";
import { StatRow } from "./StatRow";

// Component for the half-yellow, half-blue combined icon
function CombinedResourceInfluenceIcon({ size = 20 }: { size?: number }) {
  const gradientId = `half-yellow-blue-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="50%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <polygon
        points="6,2 18,2 22,12 18,22 6,22 2,12"
        fill="transparent"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
      />
    </svg>
  );
}

// Helper function to pad single digits with space for alignment and round down decimals
const padNumber = (num: number): string => {
  const rounded = Math.floor(num);
  return rounded < 10 ? ` ${rounded}` : `${rounded}`;
};

type Props = {
  currentResources: number;
  totalResources: number;
  currentInfluence: number;
  totalInfluence: number;
  currentFlex?: number;
  totalFlex?: number;
  showTotal?: boolean;
  showFlex?: boolean;
  flexSpendOnly?: boolean;
};

export function EconomicsColumn({
  currentResources,
  totalResources,
  currentInfluence,
  totalInfluence,
  currentFlex,
  totalFlex,
  showTotal = true,
  showFlex = false,
  flexSpendOnly = false,
}: Props) {
  // When flexSpendOnly is true, show only a single flex row with the combined total
  if (flexSpendOnly) {
    const combinedCurrent =
      currentResources + currentInfluence + (currentFlex ?? 0);
    const combinedTotal = totalResources + totalInfluence + (totalFlex ?? 0);

    const currentDigits = Math.floor(combinedCurrent).toString().length;
    const totalDigits = Math.floor(combinedTotal).toString().length;

    return (
      <Stack gap={6} align="flex-start" mt={2}>
        <StatRow
          icon={<CombinedResourceInfluenceIcon size={16} />}
          current={combinedCurrent}
          total={combinedTotal}
          currentWidth={`${currentDigits}ch`}
          totalWidth={`${totalDigits}ch`}
          color="gray"
        />
      </Stack>
    );
  }

  // Calculate max digits for alignment
  const currentValues = [currentResources, currentInfluence];
  if (showFlex && currentFlex !== undefined) {
    currentValues.push(currentFlex);
  }
  const maxCurrentDigits = Math.max(
    ...currentValues.map((val) => Math.floor(val).toString().length)
  );

  const totalValues = [totalResources, totalInfluence];
  if (showFlex && totalFlex !== undefined) {
    totalValues.push(totalFlex);
  }
  const maxTotalDigits = Math.max(
    ...totalValues.map((val) => Math.floor(val).toString().length)
  );

  const currentWidth = `${maxCurrentDigits}ch`;
  const totalWidth = `${maxTotalDigits}ch`;

  return (
    <Stack gap={6} align="flex-start" mt={2}>
      <StatRow
        icon={
          <img
            src={cdnImage("/player_area/pa_resources.png")}
            width={16}
            height={16}
            style={{ flexShrink: 0 }}
          />
        }
        current={currentResources}
        total={totalResources}
        currentWidth={currentWidth}
        totalWidth={totalWidth}
        color="yellow"
      />

      <StatRow
        icon={<InfluenceIcon size={16} />}
        current={currentInfluence}
        total={totalInfluence}
        currentWidth={currentWidth}
        totalWidth={totalWidth}
        color="blue"
      />

      {showFlex && currentFlex !== undefined && totalFlex !== undefined ? (
        <StatRow
          icon={<CombinedResourceInfluenceIcon size={16} />}
          current={currentFlex}
          total={totalFlex}
          currentWidth={currentWidth}
          totalWidth={totalWidth}
          color="gray"
        />
      ) : (
        <div style={{ visibility: "hidden" }}>
          <StatRow
            icon={<div style={{ width: 16, height: 16 }} />}
            current={0}
            total={0}
            currentWidth={currentWidth}
            totalWidth={totalWidth}
            color="gray"
          />
        </div>
      )}

      {showTotal && (
        <Divider
          size="xs"
          style={{
            width: "60%",
            alignSelf: "center",
            borderColor:
              "var(--resource-divider-color, rgba(148, 163, 184, 0.3))",
          }}
        />
      )}
      {showTotal && (
        <Group gap={4} align="baseline" wrap="nowrap">
          <div style={{ width: 18 }} />
          <StatMono
            size="lg"
            fw={700}
            c="gray.3"
            style={{
              lineHeight: 1,
              minWidth: currentWidth,
              textAlign: "right",
            }}
          >
            {padNumber(
              currentResources +
                currentInfluence +
                (showFlex && currentFlex !== undefined ? currentFlex : 0)
            )}
          </StatMono>
          <StatMono
            size="xs"
            c="gray.5"
            fw={500}
            style={{ lineHeight: 1, width: "1ch" }}
          >
            /
          </StatMono>
          <StatMono
            size="xs"
            c="gray.5"
            fw={500}
            style={{ lineHeight: 1, minWidth: totalWidth, textAlign: "right" }}
          >
            {Math.floor(
              totalResources +
                totalInfluence +
                (showFlex && totalFlex !== undefined ? totalFlex : 0)
            )}
          </StatMono>
        </Group>
      )}
    </Stack>
  );
}
