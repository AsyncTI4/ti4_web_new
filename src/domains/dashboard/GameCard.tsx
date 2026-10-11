import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { IconExternalLink } from "@tabler/icons-react";
import { CircularFactionIcon } from "@/shared/ui/CircularFactionIcon/CircularFactionIcon";
import { resolvePrimaryRgb } from "@/entities/lookup/colors";
import type { DashboardGame } from "./types";
import classes from "./DashboardPage.module.css";

function seatColorStyle(color: string | null): CSSProperties | undefined {
  const rgb = color ? resolvePrimaryRgb(color) : undefined;
  if (!rgb) return undefined;
  return { "--pc": `${rgb.red} ${rgb.green} ${rgb.blue}` } as CSSProperties;
}

function VpBar({ score, target }: { score: number; target: number }) {
  const segments = Math.max(1, Math.min(target, 20));
  return (
    <span className={classes.vpbar} aria-hidden="true">
      {Array.from({ length: segments }, (_, index) => (
        <i key={index} data-on={index < score || undefined} />
      ))}
    </span>
  );
}

/** "Needs you" card: game, what is asked of you, and your VP bar in your colour. */
export function GameCard({ game }: { game: DashboardGame }) {
  const seat = game.yourSeat;
  return (
    <div className={classes.gcard} style={seatColorStyle(seat.color)}>
      <Link to={`/game/${game.gameId}`} className={classes.gcardHead}>
        {seat.faction && <CircularFactionIcon faction={seat.faction} size={22} />}
        <b>{game.gameId}</b>
        <small>R{game.round}</small>
      </Link>
      <span className={classes.ask} title={game.title}>
        <b>Your turn</b> · {game.title}
      </span>
      <span className={classes.vpRow}>
        <VpBar score={seat.score} target={game.vpTarget} />
        <span className={classes.vpText}>
          <b>{seat.score}</b>/{game.vpTarget} VP
        </span>
      </span>
      <span className={classes.gcardLinks}>
        <Link to={`/game/${game.gameId}`}>Open board</Link>
        {game.actionsJumpUrl && (
          <a href={game.actionsJumpUrl} target="_blank" rel="noreferrer">
            Actions channel <IconExternalLink size={11} />
          </a>
        )}
      </span>
    </div>
  );
}
