// Expanded Fracture definitions from TI4_map_generator_bot/src/main/resources.
// Retain the fields used by the web view; base generated catalogs remain untouched.
import type { Planet, TileData } from "./types";

export const expandedFractureSystems: TileData[] = [
  {
    "id": "ef1",
    "name": "Persephone",
    "aliases": [
      "ef1",
      "persephone"
    ],
    "imagePath": "ef1.png",
    "shipPositionsType": "TYPE09",
    "spaceTokenLocations": [
      {
        "x": 195.0,
        "y": 10.0
      },
      {
        "x": 255.0,
        "y": 50.0
      },
      {
        "x": 305.0,
        "y": 105.0
      },
      {
        "x": 115.0,
        "y": 40.0
      }
    ],
    "wormholes": [],
    "hasIngress": true,
    "planets": [
      "persephone"
    ],
    "source": "expanded_fracture",
    "tileBack": "fracture"
  },
  {
    "id": "ef2",
    "name": "Hades",
    "aliases": [
      "ef2",
      "hades"
    ],
    "imagePath": "ef2.png",
    "shipPositionsType": "TYPE09",
    "spaceTokenLocations": [
      {
        "x": 195.0,
        "y": 10.0
      },
      {
        "x": 255.0,
        "y": 50.0
      },
      {
        "x": 305.0,
        "y": 105.0
      },
      {
        "x": 115.0,
        "y": 40.0
      }
    ],
    "wormholes": [],
    "hasEgress": true,
    "hasIngress": true,
    "planets": [
      "hades"
    ],
    "source": "expanded_fracture",
    "tileBack": "fracture"
  },
  {
    "id": "ef3",
    "name": "Prometheus Supernova",
    "aliases": [
      "ef3",
      "prometheus"
    ],
    "imagePath": "ef3.png",
    "shipPositionsType": "TYPE05",
    "spaceTokenLocations": [
      {
        "x": 190.0,
        "y": 30.0
      },
      {
        "x": 215.0,
        "y": 110.0
      },
      {
        "x": 185.0,
        "y": 205.0
      },
      {
        "x": 100.0,
        "y": 90.0
      },
      {
        "x": 60.0,
        "y": 130.0
      }
    ],
    "wormholes": [],
    "planets": [
      "prometheus"
    ],
    "isSupernova": true,
    "tileBack": "red",
    "source": "expanded_fracture"
  },
  {
    "id": "ef4",
    "name": "Sisyphus Gravity Rift",
    "aliases": [
      "ef4",
      "sisyphus"
    ],
    "imagePath": "ef4.png",
    "shipPositionsType": "TYPE05",
    "spaceTokenLocations": [
      {
        "x": 190.0,
        "y": 30.0
      },
      {
        "x": 215.0,
        "y": 110.0
      },
      {
        "x": 185.0,
        "y": 205.0
      },
      {
        "x": 100.0,
        "y": 90.0
      },
      {
        "x": 60.0,
        "y": 130.0
      }
    ],
    "wormholes": [],
    "planets": [
      "sisyphus"
    ],
    "isGravityRift": true,
    "tileBack": "red",
    "source": "expanded_fracture"
  },
  {
    "id": "ef5",
    "name": "Fracture Void",
    "aliases": [
      "ef5"
    ],
    "imagePath": "ef5.png",
    "shipPositionsType": "TYPE08",
    "tileBack": "fracture",
    "source": "expanded_fracture"
  },
  {
    "id": "ef6",
    "name": "Entropic Scar (Fracture)",
    "aliases": [
      "ef6"
    ],
    "imagePath": "ef6.png",
    "shipPositionsType": "TYPE08",
    "planets": [],
    "wormholes": [],
    "tileBack": "red",
    "isScar": true,
    "source": "expanded_fracture"
  },
  {
    "id": "ef7",
    "name": "Nyx/Hypnos/Hecate",
    "aliases": [
      "ef7",
      "nyx",
      "hypnos",
      "hecate"
    ],
    "imagePath": "ef7.png",
    "shipPositionsType": "TYPE03",
    "spaceTokenLocations": [
      {
        "x": 250.0,
        "y": 90.0
      },
      {
        "x": 80.0,
        "y": 10.0
      },
      {
        "x": 135.0,
        "y": 105.0
      },
      {
        "x": 80.0,
        "y": 185.0
      }
    ],
    "wormholes": [],
    "planets": [
      "nyx",
      "hypnos",
      "hecate"
    ],
    "source": "expanded_fracture",
    "tileBack": "red"
  },
  {
    "id": "ef8",
    "name": "Nebula (Fracture)",
    "aliases": [
      "ef8",
      "fracturenebula"
    ],
    "imagePath": "ef8.png",
    "shipPositionsType": "TYPE08",
    "spaceTokenLocations": [
      {
        "x": 190.0,
        "y": 30.0
      },
      {
        "x": 215.0,
        "y": 110.0
      },
      {
        "x": 185.0,
        "y": 205.0
      },
      {
        "x": 100.0,
        "y": 190.0
      },
      {
        "x": 60.0,
        "y": 130.0
      }
    ],
    "wormholes": [],
    "planets": [],
    "isNebula": true,
    "source": "expanded_fracture",
    "tileBack": "red"
  },
  {
    "id": "ef9",
    "name": "Asteroids Fracture",
    "aliases": [
      "ef9"
    ],
    "imagePath": "ef9.png",
    "shipPositionsType": "TYPE08",
    "spaceTokenLocations": [
      {
        "x": 190.0,
        "y": 30.0
      },
      {
        "x": 215.0,
        "y": 110.0
      },
      {
        "x": 185.0,
        "y": 205.0
      },
      {
        "x": 100.0,
        "y": 190.0
      },
      {
        "x": 60.0,
        "y": 130.0
      }
    ],
    "wormholes": [],
    "planets": [],
    "isAsteroidField": true,
    "source": "expanded_fracture",
    "tileBack": "red"
  },
  {
    "id": "ef10",
    "name": "Mnemosyne",
    "aliases": [
      "ef10",
      "mnemosyne",
      "mne"
    ],
    "imagePath": "ef10.png",
    "planets": [
      "mnemosyne"
    ],
    "shipPositionsType": "TYPE04",
    "tileBack": "fracture",
    "source": "expanded_fracture"
  },
  {
    "id": "ef11",
    "name": "Fracture Void",
    "aliases": [
      "ef11"
    ],
    "imagePath": "ef11.png",
    "shipPositionsType": "TYPE08",
    "tileBack": "fracture",
    "source": "expanded_fracture"
  },
  {
    "id": "ef12",
    "name": "Thanatos/Charon",
    "aliases": [
      "ef12",
      "thanatos",
      "charon"
    ],
    "imagePath": "ef12.png",
    "planets": [
      "thanatos",
      "charon"
    ],
    "shipPositionsType": "TYPE05",
    "tileBack": "fracture",
    "source": "expanded_fracture"
  }
];

export const expandedFracturePlanets: Planet[] = [
  {
    "id": "charon",
    "tileId": "ef12",
    "name": "Charon",
    "aliases": [
      "charon"
    ],
    "resources": 2,
    "influence": 3,
    "planetTypes": [
      "LIGHTNING"
    ],
    "planetLayout": {
      "unitHolderName": "charon",
      "resourcesLocation": "BottomRight",
      "centerPosition": {
        "x": 200.0,
        "y": 210.0
      }
    },
    "source": "expanded_fracture"
  },
  {
    "planetLayout": {
      "unitHolderName": "hades",
      "resourcesLocation": "BottomLeft",
      "centerPosition": {
        "x": 236,
        "y": 156
      }
    },
    "id": "hades",
    "tileId": "ef2",
    "name": "Hades",
    "aliases": [
      "hades"
    ],
    "positionInTile": {
      "x": 236.0,
      "y": 156.0
    },
    "resources": 4,
    "influence": 4,
    "factionHomeworld": null,
    "planetType": "LIGHTNING",
    "cardImagePath": null,
    "techSpecialties": null,
    "legendaryAbilityName": "Primordial Inferno",
    "legendaryAbilityText": "Game effects cannot prevent you from scoring public objectives. Players may treat the Fracture Nexus as your home system.",
    "contrastColor": "orange",
    "source": "expanded_fracture"
  },
  {
    "planetLayout": {
      "unitHolderName": "hecate",
      "resourcesLocation": "TopLeft",
      "centerPosition": {
        "x": 228,
        "y": 222
      }
    },
    "id": "hecate",
    "tileId": "ef7",
    "name": "Hecate",
    "aliases": [
      "hecate"
    ],
    "positionInTile": {
      "x": 228.0,
      "y": 222.0
    },
    "resources": 1,
    "influence": 1,
    "planetType": "LIGHTNING",
    "cardImagePath": null,
    "techSpecialties": null,
    "legendaryAbilityName": null,
    "legendaryAbilityText": null,
    "source": "expanded_fracture"
  },
  {
    "planetLayout": {
      "unitHolderName": "hypnos",
      "resourcesLocation": "BottomLeft",
      "centerPosition": {
        "x": 87,
        "y": 136
      }
    },
    "id": "hypnos",
    "tileId": "ef7",
    "name": "Hypnos",
    "aliases": [
      "hypnos"
    ],
    "positionInTile": {
      "x": 87.0,
      "y": 136.0
    },
    "resources": 0,
    "influence": 1,
    "planetType": "LIGHTNING",
    "cardImagePath": null,
    "techSpecialties": null,
    "legendaryAbilityName": null,
    "legendaryAbilityText": null,
    "source": "expanded_fracture"
  },
  {
    "id": "mnemosyne",
    "tileId": "ef10",
    "name": "Mnemosyne",
    "aliases": [
      "mnemosyne"
    ],
    "resources": 0,
    "influence": 0,
    "planetTypes": [
      "LIGHTNING"
    ],
    "techSpecialties": [
      "PROPULSION",
      "BIOTIC",
      "WARFARE",
      "CYBERNETIC"
    ],
    "legendaryAbilityName": "Innovative Flux",
    "legendaryAbilityText": "You may exhaust this card when you pass to purge 1 technology you own. When you do, gain 1 technology with the same number of prerequisites.",
    "planetLayout": {
      "unitHolderName": "mnemosyne",
      "resourcesLocation": "BottomLeft",
      "centerPosition": {
        "x": 170.0,
        "y": 150.0
      },
      "extraIcons": 1
    },
    "positionInTile": {
      "x": 172.0,
      "y": 150.0
    },
    "contrastColor": "orange",
    "source": "expanded_fracture"
  },
  {
    "planetLayout": {
      "unitHolderName": "nyx",
      "resourcesLocation": "TopRight",
      "centerPosition": {
        "x": 209,
        "y": 80
      }
    },
    "id": "nyx",
    "tileId": "ef7",
    "name": "Nyx",
    "aliases": [
      "nyx"
    ],
    "positionInTile": {
      "x": 209.0,
      "y": 80.0
    },
    "resources": 1,
    "influence": 0,
    "planetType": "LIGHTNING",
    "cardImagePath": null,
    "techSpecialties": null,
    "legendaryAbilityName": null,
    "legendaryAbilityText": null,
    "source": "expanded_fracture"
  },
  {
    "id": "oceanus",
    "name": "Oceanus",
    "aliases": [
      "oceanus"
    ],
    "resources": 4,
    "influence": 1,
    "planetTypes": [
      "LIGHTNING"
    ],
    "legendaryAbilityName": "Edge of Tomorrow",
    "legendaryAbilityText": "When exploring, you may treat planets in the fracture as if they had all traits.",
    "legendaryAbilityFlavourText": "To find it, you must look beyond what you seek.",
    "planetLayout": {
      "unitHolderName": "oceanus",
      "resourcesLocation": "BottomRight",
      "centerPosition": {
        "x": 92,
        "y": 66
      },
      "planetRadius": 60,
      "extraIcons": 1
    },
    "source": "expanded_fracture"
  },
  {
    "planetLayout": {
      "unitHolderName": "persephone",
      "resourcesLocation": "BottomLeft",
      "centerPosition": {
        "x": 236,
        "y": 156
      }
    },
    "id": "persephone",
    "tileId": "ef1",
    "name": "Persephone",
    "aliases": [
      "persephone"
    ],
    "positionInTile": {
      "x": 236.0,
      "y": 156.0
    },
    "resources": 3,
    "influence": 3,
    "factionHomeworld": null,
    "planetType": "LIGHTNING",
    "cardImagePath": null,
    "techSpecialties": null,
    "legendaryAbilityName": "Eleusinian Gardens",
    "legendaryAbilityText": "Your monument gains: When a player activates this system, you may exhaust any number of planets; unless the active player exhausts an equal number of planets, end their turn. Neutral units are treated as if they exhausted 3 planets.",
    "contrastColor": "orange",
    "source": "expanded_fracture"
  },
  {
    "planetLayout": {
      "unitHolderName": "prometheus",
      "resourcesLocation": "BottomLeft",
      "centerPosition": {
        "x": 135,
        "y": 185
      }
    },
    "id": "prometheus",
    "tileId": "ef3",
    "name": "Prometheus",
    "aliases": [
      "prometheus"
    ],
    "positionInTile": {
      "x": 135.0,
      "y": 185.0
    },
    "resources": 4,
    "influence": 0,
    "factionHomeworld": null,
    "planetType": "LIGHTNING",
    "cardImagePath": null,
    "techSpecialties": null,
    "legendaryAbilityName": null,
    "legendaryAbilityText": null,
    "source": "expanded_fracture"
  },
  {
    "id": "sisyphus",
    "tileId": "ef4",
    "name": "Sisyphus",
    "shortName": "Sisyphus",
    "aliases": [
      "sisyphus"
    ],
    "resources": 1,
    "influence": 1,
    "planetTypes": [
      "SPACESTATION"
    ],
    "planetLayout": {
      "unitHolderName": "sisyphus",
      "resourcesLocation": "BottomLeft",
      "centerPosition": {
        "x": 200.0,
        "y": 210.0
      }
    },
    "source": "expanded_fracture"
  },
  {
    "id": "thanatos",
    "tileId": "ef12",
    "name": "thanatos",
    "aliases": [
      "thanatos"
    ],
    "resources": 1,
    "influence": 1,
    "planetTypes": [
      "SPACESTATION",
      "LIGHTNING"
    ],
    "planetLayout": {
      "unitHolderName": "thanatos",
      "resourcesLocation": "TopLeft",
      "centerPosition": {
        "x": 137,
        "y": 90
      }
    },
    "source": "expanded_fracture"
  }
];
