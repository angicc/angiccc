// GENERATED - do not edit. Produced by scripts/build_territory_anchors.mjs
// from the geometry in public/data/map-territories/.
//
// For each anchor: the territory topics whose borders actually enclose it. The
// Atlas turns that into a reading path - only the lessons where this ground
// changed hands.

export interface TerritoryAnchor {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export const TERRITORY_ANCHORS: TerritoryAnchor[] = [
  {
    "id": "macedonia",
    "name": "Macedonia",
    "lat": 41.99,
    "lng": 21.43
  },
  {
    "id": "athens",
    "name": "Athens",
    "lat": 37.98,
    "lng": 23.73
  },
  {
    "id": "rome",
    "name": "Rome",
    "lat": 41.9,
    "lng": 12.5
  },
  {
    "id": "constantinople",
    "name": "Constantinople",
    "lat": 41.1,
    "lng": 28.7
  },
  {
    "id": "paris",
    "name": "Paris",
    "lat": 48.85,
    "lng": 2.35
  },
  {
    "id": "london",
    "name": "London",
    "lat": 51.51,
    "lng": -0.13
  },
  {
    "id": "berlin",
    "name": "Berlin",
    "lat": 52.52,
    "lng": 13.4
  },
  {
    "id": "vienna",
    "name": "Vienna",
    "lat": 48.21,
    "lng": 16.37
  },
  {
    "id": "moscow",
    "name": "Moscow",
    "lat": 55.76,
    "lng": 37.62
  },
  {
    "id": "kyiv",
    "name": "Kyiv",
    "lat": 50.45,
    "lng": 30.52
  },
  {
    "id": "madrid",
    "name": "Madrid",
    "lat": 40.42,
    "lng": -3.7
  },
  {
    "id": "cairo",
    "name": "Cairo",
    "lat": 30.04,
    "lng": 31.24
  },
  {
    "id": "jerusalem",
    "name": "Jerusalem",
    "lat": 31.78,
    "lng": 35.22
  },
  {
    "id": "baghdad",
    "name": "Baghdad",
    "lat": 33.31,
    "lng": 44.37
  },
  {
    "id": "delhi",
    "name": "Delhi",
    "lat": 28.61,
    "lng": 77.21
  },
  {
    "id": "beijing",
    "name": "Beijing",
    "lat": 39.9,
    "lng": 116.41
  },
  {
    "id": "kyoto",
    "name": "Kyoto",
    "lat": 35.01,
    "lng": 135.77
  },
  {
    "id": "timbuktu",
    "name": "Timbuktu",
    "lat": 16.77,
    "lng": -3.01
  },
  {
    "id": "mexico-city",
    "name": "Mexico City",
    "lat": 19.43,
    "lng": -99.13
  },
  {
    "id": "samarkand",
    "name": "Samarkand",
    "lat": 39.65,
    "lng": 66.96
  }
];

/** anchor id -> topic ids containing it. */
export const ANCHOR_TOPICS: Record<string, string[]> = {
  "cairo": [
    "achaemenid-persia",
    "ancient-macedonia",
    "byzantine-empire",
    "hellenistic-world",
    "islamic-caliphates",
    "mesopotamia",
    "ottoman-empire",
    "persian-empire",
    "roman-empire"
  ],
  "jerusalem": [
    "achaemenid-persia",
    "ancient-macedonia",
    "byzantine-empire",
    "hellenistic-world",
    "islamic-caliphates",
    "macedonian-struggle",
    "ottoman-empire",
    "persian-empire",
    "roman-empire",
    "ww1"
  ],
  "baghdad": [
    "achaemenid-persia",
    "ancient-macedonia",
    "hellenistic-world",
    "islamic-caliphates",
    "macedonian-struggle",
    "mesopotamia",
    "mongol-empire",
    "ottoman-empire",
    "persian-empire",
    "ww1"
  ],
  "samarkand": [
    "achaemenid-persia",
    "ancient-macedonia",
    "cold-war",
    "hellenistic-world",
    "islamic-caliphates",
    "mongol-empire",
    "persian-empire",
    "soviet-rise",
    "ww1",
    "ww2"
  ],
  "madrid": [
    "al-andalus",
    "french-revolution-napoleon",
    "ottoman-empire",
    "protestant-reformation",
    "roman-empire"
  ],
  "beijing": [
    "ancient-china",
    "cold-war",
    "mongol-empire"
  ],
  "athens": [
    "ancient-macedonia",
    "byzantine-empire",
    "classical-greece",
    "hellenistic-world",
    "macedonian-struggle",
    "ottoman-empire",
    "roman-empire",
    "slavic-mission"
  ],
  "constantinople": [
    "ancient-macedonia",
    "byzantine-empire",
    "hellenistic-world",
    "macedonian-struggle",
    "ottoman-empire",
    "roman-empire",
    "slavic-mission",
    "ww1"
  ],
  "delhi": [
    "british-raj-partition",
    "hellenistic-world",
    "mughal-empire"
  ],
  "macedonia": [
    "byzantine-empire",
    "macedonian-struggle",
    "ottoman-empire",
    "roman-empire",
    "slavic-mission",
    "ww1",
    "yugoslav-wars"
  ],
  "rome": [
    "byzantine-empire",
    "french-revolution-napoleon",
    "hellenistic-world",
    "protestant-reformation",
    "renaissance-italy",
    "roman-empire",
    "ww2"
  ],
  "moscow": [
    "cold-war",
    "ottoman-empire",
    "slavic-mission",
    "soviet-rise",
    "viking-age",
    "ww1",
    "ww2"
  ],
  "kyiv": [
    "cold-war",
    "ottoman-empire",
    "protestant-reformation",
    "slavic-mission",
    "soviet-rise",
    "viking-age",
    "ww1",
    "ww2"
  ],
  "paris": [
    "french-revolution-napoleon",
    "hundred-years-war",
    "protestant-reformation",
    "roman-empire",
    "ww1",
    "ww2"
  ],
  "london": [
    "hundred-years-war",
    "industrial-revolution",
    "protestant-reformation",
    "roman-empire",
    "ww1",
    "ww2"
  ],
  "kyoto": [
    "medieval-japan",
    "tokugawa-japan",
    "ww2"
  ],
  "mexico-city": [
    "olmec-mesoamerica"
  ],
  "berlin": [
    "ottoman-empire",
    "protestant-reformation",
    "ww1",
    "ww2"
  ],
  "vienna": [
    "ottoman-empire",
    "protestant-reformation",
    "ww1",
    "ww2"
  ],
  "timbuktu": [
    "songhai-empire"
  ]
};
