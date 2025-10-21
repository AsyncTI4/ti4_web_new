import { EntityData, FactionUnits } from "@/data/types";
import { HexagonVertex } from "../hitbox";
import { SPACE_HEAT_CONFIG, GROUND_HEAT_CONFIG } from "./constants";

export type Planet = {
  name: string;
  x: number;
  y: number;
  radius: number;
  resourcesLocation?: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight";
};

export type HeatSource = {
  x: number;
  y: number;
  faction?: string;
  stackSize: number;
};

export type EntityStackBase = EntityData & {
  faction: string;
};

export type EntityStack = EntityStackBase & {
  x: number;
  y: number;
  planetName?: string;
};

export type GameState = {
  space: {
    [faction: string]: {
      [unitType: string]: number;
    };
  };
  planets: {
    [planetName: string]: any;
  };
};

export type HeatConfig = typeof SPACE_HEAT_CONFIG | typeof GROUND_HEAT_CONFIG;

export type UpdateCostMapOptions = {
  gridSize: number;
  squareWidth: number;
  squareHeight: number;
  factionEntities: FactionUnits;
  existingCostMap: number[][];
  heatConfig: HeatConfig;
  repellantPlanets?: Planet[];
  rimSquares?: { row: number; col: number }[];
  heatSources?: HeatSource[];
  currentFaction?: string;
};

export type PlaceEntitiesOptions = {
  gridSize: number;
  squareWidth: number;
  squareHeight: number;
  initialCostMap: number[][];
  rimSquares: { row: number; col: number }[];
  repellantPlanets: Planet[];
  heatConfig: HeatConfig;
  factionEntities: FactionUnits;
  initialHeatSources?: HeatSource[];
};

export type PlaceSpaceEntitiesOptions = {
  gridSize: number;
  squareWidth: number;
  squareHeight: number;
  hexagonVertices: HexagonVertex[];
  planets: Planet[];
  factionEntities: FactionUnits;
  initialHeatSources?: HeatSource[];
};

export type PlaceGroundEntitiesOptions = {
  gridSize: number;
  squareWidth: number;
  squareHeight: number;
  planetX: number;
  planetY: number;
  planetRadius: number;
  factionEntities: FactionUnits;
  heatSources?: HeatSource[];
};
