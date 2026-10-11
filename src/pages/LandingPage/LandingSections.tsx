import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import WidgetBot from "@widgetbot/react-embed";
import { IconBrandDiscordFilled } from "@tabler/icons-react";
import { Button } from "@/ds";
import { cdnImage } from "@/entities/data/cdnImage";
import type { useCommunityStats } from "@/api/useCommunityStats";
import { Tech } from "@/domains/player/components/Tech/Tech";
import { GameLaneTable, type LaneGame } from "@/domains/dashboard/GameLanes";
import classes from "./LandingPage.module.css";

type CommunityStatsQuery = ReturnType<typeof useCommunityStats>;

const DISCORD_INVITE = "https://discord.gg/asyncti4";
const SHOWCASE_GAME = "pbd19460";

const SHOWCASE_FACTIONS = [
  "hacan", "sol", "letnev", "jolnar", "xxcha", "sardakk", "arborec", "mentak",
  "naalu", "nekro", "muaat", "yin", "ghost", "l1z1x", "saar", "winnu",
  "yssaril", "argent", "mahact", "nomad", "bentor", "celdauri", "cheiran",
  "edyn", "ghemina", "gledge", "kolume", "kyro", "nokar", "tnelis", "vaden",
  "zelian",
];

const HOW_IT_WORKS = [
  {
    title: "Play at your pace",
    body: "Take your turn whenever you have a few minutes. Nobody has to line up schedules across time zones, and nobody sits at a table all day.",
  },
  {
    title: "The bot runs the rules",
    body: "Buttons and slash commands in Discord move your units, resolve combat and track your faction's cards and tokens.",
  },
  {
    title: "The board stays current",
    body: "Every command redraws the map. Check it here or in Discord: units, control and scores are always up to date.",
  },
  {
    title: "Mistakes can be undone",
    body: "Undo a wrong click. Game masters can also edit the game state directly, so house rules and odd edge cases still work.",
  },
];

const STAT_FACTS = [
  { key: "activeGames", label: "Games running" },
  { key: "players", label: "Players" },
  { key: "gamesCompleted", label: "Games finished" },
] as const;

const FALLBACK_FACTS = [
  { value: "Free", label: "To play" },
  { value: "Any hour", label: "Take your turn" },
  { value: "Live", label: "Web board" },
];

function DiscordInvite({ children }: { children: ReactNode }) {
  return (
    <Button
      component="a"
      href={DISCORD_INVITE}
      target="_blank"
      rel="noopener noreferrer"
      variant="filled"
      color="var(--ds-discord)"
      size="lg"
      leftSection={<IconBrandDiscordFilled size={16} />}
    >
      {children}
    </Button>
  );
}

function SectionHead({
  num,
  kicker,
  title,
  lede,
}: {
  num: string;
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className={classes.sectionHead}>
      <span className={`${classes.label} ${classes.kicker}`}>
        <b>{num}</b>
        {kicker}
      </span>
      <h2 className={classes.h2}>{title}</h2>
      {lede && <p className={classes.sectionLede}>{lede}</p>}
    </div>
  );
}

function HeroFacts({ query }: { query: CommunityStatsQuery }) {
  if (query.isError) {
    return (
      <div className={classes.facts}>
        {FALLBACK_FACTS.map((fact) => (
          <span key={fact.label} className={classes.fact}>
            <b>{fact.value}</b>
            <small>{fact.label}</small>
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className={classes.facts}>
      {STAT_FACTS.map(({ key, label }) => (
        <span key={key} className={classes.fact}>
          <b>{query.data?.[key].toLocaleString() ?? "—"}</b>
          <small>{label}</small>
        </span>
      ))}
    </div>
  );
}

function LiveBoard() {
  return (
    <figure className={classes.board} aria-label="A live game board">
      <div className={classes.boardBar}>
        <span className={classes.liveDot} aria-hidden="true" />
        <span>Live board · {SHOWCASE_GAME}</span>
        <Link to={`/game/${SHOWCASE_GAME}`}>Open game</Link>
      </div>
      <iframe
        className={classes.boardFrame}
        src={`/embed/${SHOWCASE_GAME}/map-only?sidebar=none`}
        title={`Live board for ${SHOWCASE_GAME}`}
        loading="lazy"
      />
      <Link to={`/game/${SHOWCASE_GAME}`} className={classes.boardOpen}>
        Open the live board
      </Link>
    </figure>
  );
}

export function HeroSection({ query }: { query: CommunityStatsQuery }) {
  return (
    <section className={classes.hero} aria-label="Async Twilight Imperium">
      <div className={`${classes.inner} ${classes.heroGrid}`}>
        <div className={classes.heroCopy}>
          <span className={classes.label}>Play-by-Discord · Twilight Imperium 4e</span>
          <h1 className={classes.headline}>The galaxy waits for your move.</h1>
          <p className={classes.lede}>
            Full games of Twilight Imperium, played asynchronously through
            Discord. A bot keeps the rules, and the board on this site updates
            with every command.
          </p>
          <div className={classes.ctas}>
            <DiscordInvite>Join the Discord</DiscordInvite>
            <Button component={Link} to="/games" variant="default" size="lg">
              Watch a live game
            </Button>
          </div>
          <HeroFacts query={query} />
          <span className={classes.fanNote}>A free fan project for Twilight Imperium™.</span>
        </div>
        <LiveBoard />
      </div>
    </section>
  );
}

export function FactionStrip() {
  return (
    <div className={classes.strip} aria-hidden="true">
      <div className={classes.stripInner}>
        {SHOWCASE_FACTIONS.map((faction) => (
          <img
            key={faction}
            src={cdnImage(`/factions/${faction}.png`)}
            alt=""
            loading="lazy"
            className={classes.stripIcon}
          />
        ))}
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className={classes.section} aria-label="How it works">
      <div className={classes.inner}>
        <SectionHead
          num="01"
          kicker="How it works"
          title="A full game, a few minutes at a time"
          lede="A game usually runs for weeks. Each turn happens in your game's Discord channel, whenever it suits you."
        />
        <div className={classes.how}>
          <ol className={classes.steps}>
            {HOW_IT_WORKS.map((item, index) => (
              <li key={item.title} className={classes.step}>
                <span className={classes.stepNum}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className={classes.stepTitle}>{item.title}</h3>
                <p className={classes.stepBody}>{item.body}</p>
              </li>
            ))}
          </ol>
          <figure className={classes.shot}>
            <img src="/discord.png" alt="A game channel in Discord with the bot's turn buttons" loading="lazy" />
            <figcaption>A game channel: the bot posts the state, you press buttons to act.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function MapSpecimen() {
  const cells = ["a", "", "c", "", "b", "", "a", "", "", "c", "b", "", "a", "a", ""];
  return (
    <div className={classes.specimen} aria-hidden="true">
      <div className={classes.specimenHex}>
        {cells.map((c, index) => (
          <i key={index} data-c={c || undefined} />
        ))}
      </div>
    </div>
  );
}

function TechSpecimen() {
  return (
    <div className={`${classes.specimen} ${classes.techs}`}>
      <Tech techId="gd" />
      <Tech techId="st" />
      <Tech techId="ps" />
    </div>
  );
}

function TurnSpecimen() {
  return (
    <div className={classes.specimen} aria-hidden="true">
      <div className={classes.specimenRow}>
        <b>pbd16664</b> <span className={classes.specimenYou}>Your turn</span>
      </div>
      <div className={classes.specimenRow}>
        <b>pbd17012</b> Waiting on the table
      </div>
      <div className={classes.specimenRow}>
        <b>pbd16502</b> Waiting on the table
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: "The live board",
    body: "Zoom the map, check who controls what, and open any system to see the units in it.",
    specimen: <MapSpecimen />,
  },
  {
    title: "Every player's area",
    body: "Tech, planets, leaders, objectives and promissory notes for each seat, laid out so you can compare them at a glance.",
    specimen: <TechSpecimen />,
  },
  {
    title: "Your games in one place",
    body: "Log in with Discord to see which of your games are waiting on you, plus your titles and badges.",
    specimen: <TurnSpecimen />,
  },
];

export function FeaturesSection() {
  return (
    <section className={classes.section} aria-label="On this site">
      <div className={classes.inner}>
        <SectionHead
          num="02"
          kicker="On this site"
          title="Everything the table can see"
          lede="Discord is where you play. This site is where you read the game."
        />
        <div className={classes.features}>
          {FEATURES.map((feature) => (
            <article key={feature.title} className={classes.feature}>
              {feature.specimen}
              <h3 className={classes.featureTitle}>{feature.title}</h3>
              <p className={classes.featureBody}>{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function GamesInProgressSection({ query }: { query: CommunityStatsQuery }) {
  const failed = query.isError || (!query.isLoading && !query.data);
  const games: LaneGame[] = (query.data?.gamesInProgress ?? []).map((game) => ({
    id: game.id,
    title: game.name,
    href: `/game/${game.id}`,
    seats: game.factions.map((faction) => ({ key: faction, faction })),
    round: `R${game.round}`,
    clock: { kind: "quiet", label: `First to ${game.vpTarget} VP` },
    last: "Watch",
  }));

  return (
    <section className={classes.section} aria-label="Games in progress">
      <div className={classes.inner}>
        <div className={classes.sectionHeadRow}>
          <SectionHead
            num="03"
            kicker="Live now"
            title="Games in progress"
            lede="Open any game to see its board and scores. You don't need an account to watch."
          />
          {query.data && (
            <span className={classes.meta}>
              {query.data.activeGames.toLocaleString()} games running
            </span>
          )}
        </div>
        <GameLaneTable
          label="Games in progress"
          loading={query.isLoading}
          games={games}
          columns={{ seats: "Factions", clock: "Target", last: "" }}
          empty={
            failed
              ? { title: "Live games didn't load", body: "Try again in a moment." }
              : { title: "No public games to show right now" }
          }
        />
      </div>
    </section>
  );
}

export function CommunitySection() {
  return (
    <section className={classes.section} aria-label="Community">
      <div className={classes.inner}>
        <SectionHead
          num="04"
          kicker="Community"
          title="Come and say hello"
          lede="We run 32-player mega games, odd mods like Rotato Potato (the map rings turn every round) and plenty of homebrew. Talk strategy, find a game, or watch."
        />
        <div className={classes.widget}>
          <WidgetBot
            server="943410040369479690"
            channel="1025083568839471165"
            width="100%"
            height="560px"
          />
        </div>
        <div className={classes.ctas} style={{ marginTop: 16 }}>
          <DiscordInvite>Join the Discord</DiscordInvite>
        </div>
      </div>
    </section>
  );
}

export function BanAppealsSection() {
  return (
    <section className={classes.inner} aria-label="Server ban appeals">
      <div className={classes.appeals}>
        <div className={classes.appealsText}>
          <h2 className={classes.appealsTitle}>Server ban appeals</h2>
          <p className={classes.appealsBody}>
            Banned from the{" "}
            <a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
              AsyncTI4 Discord server
            </a>{" "}
            and think it was a mistake? Send an appeal and the mod team will
            reply. This form is not for bug reports or game support.
          </p>
        </div>
        <Button
          component="a"
          href="https://forms.gle/o5D9JoXTbxpXEQfT9"
          target="_blank"
          rel="noopener noreferrer"
          variant="default"
        >
          Submit a ban appeal
        </Button>
      </div>
    </section>
  );
}
