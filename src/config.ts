const devConfig = {
  api: {
    mapsUrl: "https://asyncti4.com/maps.json",
    proxyMapsUrl: "/proxy/maps.json",
    frogMapUrl:
      "https://qw2j1lld43.execute-api.us-east-1.amazonaws.com/Production/frog",
    websiteBase: "http://localhost:5173/",
    discordLoginUrl: "http://localhost:8000/login",
    discordRedirectUri: "http://localhost:5173/login",
    gameDataUrl: "https://asyncti4.com/webdata",
    botApiUrl: "/bot/api",
    websocketUrl: "wss://bot.asyncti4.com/ws",
    // websocketUrl: "ws://localhost:8081/ws",
  },
};

const prodConfig = {
  api: {
    mapsUrl: "https://asyncti4.com/maps.json",
    proxyMapsUrl: "/proxy/maps.json",
    frogMapUrl:
      "https://qw2j1lld43.execute-api.us-east-1.amazonaws.com/Production/frog",
    websiteBase: "https://asyncti4.com/",
    discordLoginUrl: "https://api.asyncti4.com/login",
    discordRedirectUri: "https://asyncti4.com/login",
    gameDataUrl: "https://asyncti4.com/webdata",
    botApiUrl: "https://bot.asyncti4.com/api",
    websocketUrl: "wss://bot.asyncti4.com/ws",
  },
};

export const config = import.meta.env.DEV ? devConfig : prodConfig;
