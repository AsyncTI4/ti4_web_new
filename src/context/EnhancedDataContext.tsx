
import {
    calculateSingleTilePosition,
} from "../mapgen/tilePositioning";
import { optimizeFactionColors, RGBColor } from "../utils/colorOptimization";
import { getColorValues } from "../lookup/colors";
import { createContext, ReactNode } from "react";
import { usePlayerData } from "@/hooks/usePlayerData";
import { useParams } from "react-router-dom";
import { colors } from "@/data/colors";
import { MapTile, Planet } from "@/types/global";
import { PlayerDataResponse } from "@/data/types";




export type FactionColorMap = {
    [key: string]: FactionColorData
}

export type FactionColorData = {
    faction: string,
    color: string,
    optimizedColor: RGBColor
}

type EnhancedDataProviderProps = {
    children: ReactNode;
};

type EnhancedDataContextValue = {
    planetAttachments: Record<string, string[]>;
    mapTiles: MapTile[];
    tilePositions: any;
    allExhaustedPlanets: string[];
    systemIdToPosition: Record<string, string>;
    factionColorMap: FactionColorMap;
}

const EnhancedDataContext = createContext<EnhancedDataContextValue | undefined>(
    undefined
);

export function EnhancedDataContextProvider({ children }: EnhancedDataProviderProps) {
    const params = useParams<{ mapid: string }>();
    const gameId = params.mapid!;
    const systemIdToPosition: Record<string, string> = {};
    const planetAttachments: Record<string, string[]> = {};
    const factionColorMap: FactionColorMap = {};
    let validData: PlayerDataResponse;

    const { data, isLoading, isError, refetch } = usePlayerData(gameId);

    if (data) {
        validData = data!;
    } else return (<EnhancedDataContext.Provider value={undefined}>
        {children}
    </EnhancedDataContext.Provider>);


    if (validData.tilePositions) {
        data.tilePositions.forEach((entry: string) => {
            const [position, systemId] = entry.split(":");
            systemIdToPosition[systemId] = position;
        });
    }

    const factionToColor =
        validData.playerData?.reduce(
            (acc, player) => {
                acc[player.faction] = player.color;
                return acc;
            },
            {} as Record<string, string>
        ) || {};


    function generateHexagonPoints(cx: number, cy: number, radius: number) {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = i * 60 * (Math.PI / 180); // Start at 0° for flat-top orientation
            const x = cx + radius * Math.cos(angle);
            const y = cy + radius * Math.sin(angle);
            points.push({ x, y });
        }
        return points;
    }

    function generateHexagonSides(points: { x: number; y: number }[]) {
        const sides = [];
        for (let i = 0; i < 6; i++) {
            const nextI = (i + 1) % 6;
            sides.push({
                x1: points[i].x,
                y1: points[i].y,
                x2: points[nextI].x,
                y2: points[nextI].y,
            });
        }
        return sides;
    }

    function parseMapTiles(): MapTile[] {
        let mapTiles: MapTile[] = [];

        if (!validData.tileUnitData) return [];
        Object.entries(validData.tileUnitData).forEach(([position, tileData]) => {
            const coordinates = calculateSingleTilePosition(position, validData.ringCount);

            // the id printed on the cardboard
            const [_, systemId] = validData.tilePositions.filter(pos => pos.split(":")[0] === position).slice(-2);

            const radius = 172.5; // Width = 345px
            // const height = Math.sqrt(3) * radius; // ~298.7px
            const cx = coordinates.x + 172.5;
            const cy = coordinates.y + 149.5;
            const points = generateHexagonPoints(cx, cy, radius);

            let newMapTile: MapTile = {
                position: position,
                systemId: systemId,
                planets: [],
                space: [],
                anomaly: tileData.anomaly,
                wormholes: [], //
                commandCounters: tileData.ccs,
                productionCapacity: 0, //
                tokens: [],
                controller: "",
                properties: {
                    x: coordinates.x,
                    y: coordinates.y,
                    hexOutline: {
                        points: points,
                        sides: generateHexagonSides(points),
                    },
                    width: 0,
                    height: 0,
                },
            };

            Object.entries(tileData.planets).forEach(
                ([planetName, planetData]: [string, any]) => {
                    let newPlanet: Planet = {
                        name: planetName,
                        baseResources: 0,
                        baseInfluence: 0,
                        totalResources: 0,
                        totalInfluence: 0,
                        type: "",
                        hasTechSpecialty: false,
                        techSpecialty: "",
                        attachments: [],
                        tokens: [],
                        units: [],
                        controller: planetData.controlledBy,
                        properties: {
                            x: 0,
                            y: 0,
                        },
                    };

                    Object.entries(planetData.entities).forEach(([faction, entities]: [string, any]) => {
                        entities.forEach((entity: any) => {
                            if (entity.entityType === "unit") {
                                newPlanet.units.push({
                                    type: entity.entityType,
                                    amount: entity.count,
                                    amountSustained: entity.sustained ?? 0,
                                    owner: faction,
                                    color: "",
                                });
                            }

                            if (entity.entityType === "attachment")
                                newPlanet.attachments.push(entity.entityId);
                        });
                    });

                    if (newPlanet.attachments.length > 0) {
                        planetAttachments[planetName] = newPlanet.attachments;
                    }
                    newMapTile.planets.push(newPlanet);
                }
            );

            Object.entries(tileData.space).forEach(
                ([faction, entities]: [string, any]) => {
                    entities.forEach((entity: any) => {
                        if (entity.entityType === "unit") {
                            newMapTile.space.push({
                                type: entity.entityType,
                                amount: entity.count,
                                amountSustained: entity.sustained ?? 0,
                                owner: faction,
                                color: "",
                            });
                        }

                        if (entity.entityType === "token")
                            newMapTile.tokens.push(entity.entityId);
                    });
                }
            );

            const uniquePlanetFactions = [
                ...new Set(newMapTile.planets.map((planet) => planet.controller)),
            ];
            const uniqueFactions = [
                ...new Set(newMapTile.space.map((unit) => unit.owner)),
            ];

            // Check planets, then check space area, otherwise no one faction has control
            if (uniquePlanetFactions.length === 1) {
                newMapTile.controller = uniquePlanetFactions[0];
            } else if (uniqueFactions.length === 1) {
                newMapTile.controller = uniqueFactions[0];
            } else {
                newMapTile.controller = "";
            }

            mapTiles.push(newMapTile);
        });

        return mapTiles;
    }

    const optimizedColors: Record<string, RGBColor> = (() => {
        // Get unique colors that are actually in use by factions
        const colorsInUse = new Set(Object.values(factionToColor));

        // Transform only the colors that are actually being used
        const transformedColors = colors
            .filter((color) => colorsInUse.has(color.name))
            .map((color) => {
                // Use getColorValues to handle both primaryColor and primaryColorRef
                const primaryColorValues = getColorValues(
                    (color as any).primaryColorRef,
                    color.primaryColor
                );

                if (!primaryColorValues) return null;

                return {
                    alias: color.name,
                    primaryColor: primaryColorValues as RGBColor,
                };
            })
            .filter(
                (color): color is { alias: string; primaryColor: RGBColor } =>
                    color !== null
            );

        return optimizeFactionColors(transformedColors);
    })();

    const allExhaustedPlanets: string[] = (() => {
        if (!data.playerData) return [];

        const exhaustedPlanetsSet = new Set<string>();
        data.playerData.forEach((player) => {
            if (player.exhaustedPlanets) {
                player.exhaustedPlanets.forEach((planetId) => {
                    exhaustedPlanetsSet.add(planetId);
                });
            }
        });

        return Array.from(exhaustedPlanetsSet);
    })();

    // you can use either Faction or Color to access all of faction/color/optimized color.
    // this way, we don't have to pass two objects around (though maybe this is too fancy)
    data.playerData.forEach((player) => {
        factionColorMap[player.faction] = {
            faction: player.faction,
            color: player.color,
            optimizedColor: optimizedColors[player.color]
        };
        factionColorMap[player.color] = {
            faction: player.faction,
            color: player.color,
            optimizedColor: optimizedColors[player.color]
        };
    })


    const enhancedData: EnhancedDataContextValue = {
        planetAttachments,
        mapTiles: parseMapTiles(),
        tilePositions: data.tilePositions,
        systemIdToPosition,
        factionColorMap,
        allExhaustedPlanets,
    }

    return (
        <EnhancedDataContext.Provider value={enhancedData}>
            {children}
        </EnhancedDataContext.Provider>
    );
}




