// Global type declarations for the TI4 Web application

// You can add global types here as needed
// For example:

// declare global {
//   interface Window {
//     // Add any window extensions here
//   }
// }

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
