import "./StrategyCard.css";

export default function StrategyCard({
  text = "LEADERSHIP",
  number = "1",
  backgroundColor = "#dc2626",
  textColor = "white",
  borderColor = "#ffffff",
  size = "normal", // "small", "normal", "large"
}) {
  return (
    <div
      className={`strategy-card ${size}`}
      style={{
        "--bg-color": backgroundColor,
        "--text-color": textColor,
        "--border-color": borderColor,
      }}
    >
      <div className="strategy-card-main">
        <span className="strategy-card-text">{text}</span>
      </div>
      <div className="strategy-card-number">{number}</div>
    </div>
  );
}
