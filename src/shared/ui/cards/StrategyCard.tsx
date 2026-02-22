import "./StrategyCard.css";
import type { CSSProperties } from "react";

type StrategyCardSize = "small" | "normal" | "large";

type StrategyCardProps = {
  text?: string;
  number?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  size?: StrategyCardSize;
};

export default function StrategyCard({
  text = "LEADERSHIP",
  number = "1",
  backgroundColor = "#dc2626",
  textColor = "white",
  borderColor = "#ffffff",
  size = "normal",
}: StrategyCardProps) {
  const style = {
    "--bg-color": backgroundColor,
    "--text-color": textColor,
    "--border-color": borderColor,
  } as CSSProperties;

  return (
    <div className={`strategy-card ${size}`} style={style}>
      <div className="strategy-card-main">
        <span className="strategy-card-text">{text}</span>
      </div>
      <div className="strategy-card-number">{number}</div>
    </div>
  );
}
