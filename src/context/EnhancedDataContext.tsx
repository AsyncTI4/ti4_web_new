
import {
    calculateSingleTilePosition,
} from "../mapgen/tilePositioning";
import { optimizeFactionColors, RGBColor } from "../utils/colorOptimization";
import { getColorValues } from "../lookup/colors";
import { createContext, ReactNode } from "react";
import { usePlayerData } from "@/hooks/usePlayerData";
import { useParams } from "react-router-dom";
import { colors } from "@/data/colors";
import { MapTile, Planet, Unit } from "@/types/global";
import { PlanetEntityData, PlayerDataResponse, TileUnitData } from "@/data/types";

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
    tilesWithPds: Set<string>;
    dominantPdsFaction: Record<
        string,
        {
            faction: string;
            color: string;
            count: number;
            expected: number;
        }
    >;
}

export const EnhancedDataContext = createContext<EnhancedDataContextValue | undefined>(
    undefined
);


const RADIUS = 172.5; // Width = 345px
const CENTER_X_OFFSET = 172.5;
const CENTER_Y_OFFSET = 149.5;
// const HEIGHT = Math.sqrt(3) * radius; // ~298.7px

export function EnhancedDataContextProvider({ children }: EnhancedDataProviderProps) {
    const params = useParams<{ mapid: string }>();
    const { data, isLoading, isError, refetch } = usePlayerData(params.mapid!);
    const systemIdToPosition = generateSystemIdToPosition(data);
    const factionColorMap: FactionColorMap = {};

    if (!data) {
        return (<EnhancedDataContext.Provider value={undefined}>
            {children}
        </EnhancedDataContext.Provider>);
    }


    const factionToColor =
        data.playerData?.reduce(
            (acc, player) => {
                acc[player.faction] = player.color;
                return acc;
            },
            {} as Record<string, string>
        ) || {};

    function parseMapTiles(data: PlayerDataResponse): { mapTiles: MapTile[], planetAttachments: Record<string, string[]> } {
        if (!data.tileUnitData) return {
            mapTiles: [],
            planetAttachments: {}
        };

        const planetAttachments: Record<string, string[]> = {};
        const mapTiles = Object.entries(data.tileUnitData).map(([position, tileData]) => {
            const coordinates = calculateSingleTilePosition(position, data.ringCount);
            const planets: Planet[] = getPlanets(tileData);
            const { space, tokens } = getSpace(tileData);

            const points = generateHexagonPoints(
                coordinates.x + CENTER_X_OFFSET,
                coordinates.y + CENTER_Y_OFFSET,
                RADIUS
            );

            // adds to planetAttachments
            planets.filter(planet => planet.attachments.length > 0).forEach(planet => planetAttachments[planet.name] = planet.attachments);

            return {
                position: position,
                systemId: data.tilePositions.filter(pos => pos.split(":")[0] === position).slice(-2)[1],
                planets: planets,
                space: space,
                anomaly: tileData.anomaly,
                wormholes: [], //
                commandCounters: tileData.ccs,
                productionCapacity: 0, //
                tokens: tokens,
                controller: mapTileController(planets, space),
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
        });

        return {
            mapTiles,
            planetAttachments
        }
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

        return data.playerData.flatMap((player) => {
            return player.exhaustedPlanets.filter(planet => planet)
        });
    })();


    // Calculate PDS data for rendering
    const { tilesWithPds, dominantPdsFaction } = (() => {
        const tilesWithPds = new Set<string>();
        const dominantPdsFaction: Record<
            string,
            {
                faction: string;
                color: string;
                count: number;
                expected: number;
            }
        > = {};

        if (!data.tileUnitData) return { tilesWithPds, dominantPdsFaction }

        Object.entries(data.tileUnitData).forEach(
            ([position, tileData]: [string, any]) => {
                if (!(tileData.pds && Object.keys(tileData.pds).length > 0)) return;

                tilesWithPds.add(position);

                // Find the faction with the highest expected value
                let highestExpected = -1;
                let dominantFaction = "";
                let dominantCount = 0;
                let dominantExpectedValue = 0;

                Object.entries(tileData.pds).forEach(
                    ([faction, pdsData]: [string, any]) => {
                        if (pdsData.expected > highestExpected) {
                            highestExpected = pdsData.expected;
                            dominantFaction = faction;
                            dominantCount = pdsData.count;
                            dominantExpectedValue = pdsData.expected;
                        }
                    }
                );

                if (dominantFaction && factionToColor[dominantFaction]) {
                    dominantPdsFaction[position] = {
                        faction: dominantFaction,
                        color: factionToColor[dominantFaction],
                        count: dominantCount,
                        expected: dominantExpectedValue,
                    };
                }
            }
        );

        return { tilesWithPds, dominantPdsFaction };
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
        ...parseMapTiles(data), // for mapTiles and planetAttachments
        tilePositions: data.tilePositions,
        systemIdToPosition,
        factionColorMap,
        allExhaustedPlanets,
        tilesWithPds,
        dominantPdsFaction
    }

    return (
        <EnhancedDataContext.Provider value={enhancedData}>
            {children}
        </EnhancedDataContext.Provider>
    );
}






// Check planets, then check space area, otherwise no one faction has control
function mapTileController(planets: Planet[], space: Unit[]) {
    const uniquePlanetFactions = [
        ...new Set(planets.map((planet) => planet.controller)),
    ];
    const uniqueFactions = [
        ...new Set(space.map((unit) => unit.owner)),
    ];

    if (uniquePlanetFactions.length === 1) {
        return uniquePlanetFactions[0];
    } else if (uniqueFactions.length === 1) {
        return uniqueFactions[0];
    } else {
        return "";
    }
}

function getSpace(tileData: TileUnitData) {
    const space: Unit[] = [];
    const tokens: string[] = [];

    Object.entries(tileData.space).forEach(
        ([faction, entities]: [string, any]) => {
            entities.forEach((entity: any) => {
                if (entity.entityType === "unit") {
                    space.push({
                        type: entity.entityType,
                        amount: entity.count,
                        amountSustained: entity.sustained ?? 0,
                        owner: faction
                    });
                }

                if (entity.entityType === "token")
                    tokens.push(entity.entityId);
            });
        }
    );

    return {
        space,
        tokens
    }
}

function getPlanets(tileData: TileUnitData) {
    return Object.entries(tileData.planets).map(
        ([planetName, planetData]: [string, PlanetEntityData]) => {

            const attachments: string[] = [];
            const units: Unit[] = [];
            Object.entries(planetData.entities).forEach(([faction, entities]: [string, any]) => {
                entities.forEach((entity: any) => {
                    if (entity.entityType === "unit") {
                        units.push({
                            type: entity.entityType,
                            amount: entity.count,
                            amountSustained: entity.sustained ?? 0,
                            owner: faction
                        });
                    }

                    if (entity.entityType === "attachment")
                        attachments.push(entity.entityId);
                });
            });

            return {
                name: planetName,
                attachments: attachments,
                tokens: [],
                units: units,
                controller: planetData.controlledBy,
                properties: {
                    x: 0,
                    y: 0,
                },
            };
        }
    );
}

function generateSystemIdToPosition(data: PlayerDataResponse | undefined) {
    const systemIdToPosition: Record<string, string> = {};

    if (!data || !data.tilePositions) return systemIdToPosition;

    data.tilePositions.forEach((entry: string) => {
        const [position, systemId] = entry.split(":");
        systemIdToPosition[systemId] = position;
    });

    return systemIdToPosition;
}

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
