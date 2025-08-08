// Global type declarations for the TI4 Web application

// You can add global types here as needed
// For example:

// declare global {
//   interface Window {
//     // Add any window extensions here
//   }
// }


export type MapTile = {
  position: string;
  systemId: string;
  planets: Planet[];
  space: Unit[];
  anomaly: boolean;
  wormholes: string[];
  commandCounters: string[];
  productionCapacity: number;
  tokens: string[];
  controller: string;
  properties: {
    x: number;
    y: number;
    hexOutline: {
      points: {
        x: number;
        y: number;
      }[];
      sides: {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
      }[];
    };
    width: number;
    height: number;
  };
};

export type Planet = {
  name: string;
  attachments: string[];
  tokens: string[];
  units: Unit[];
  controller: string;
  properties: {
    x: number;
    y: number;
  };
};

export type Unit = {
  type: "unit" | "token" | "attachment";
  amount: number;
  amountSustained: number;
  owner: string;
};

// Common types that might be used across components
export interface Player {
  id: string;
  name: string;
  faction: string;
  color: string;
}

export interface Game {
  id: string;
  name: string;
  players: Player[];
  status: "waiting" | "active" | "completed";
}

// Add more shared types as needed
export {};
