

export const wormHoleEntities = ["alpha,", "beta", "creussalpha", "creussbeta", "creussgamma", "gamma", "ionalpha", "ionbeta"]

export function translateWormholeChannel(entityId: string) {
    switch (entityId) {
        case "alpha":
        case "cruessalpha":
        case "ionalpha":
            return "ALPHA"
        case "beta":
        case "cruessbeta":
        case "ionbeta":
            return "BETA"
        case "gamma":
        case "cruessgamma":
            return "GAMMA"
        default:
            return undefined;
    }
}