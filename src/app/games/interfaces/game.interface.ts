// To parse this data:
//
//   import { Convert, GameResponse } from "./file";
//
//   const gameResponse = Convert.toGameResponse(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface GameResponse {
  id: number;
  slug: string;
  name: string;
  name_original: string;
  description: string;
  metacritic: number;
  metacritic_platforms: MetacriticPlatform[];
  released: Date;
  tba: boolean;
  updated: Date;
  background_image: string;
  background_image_additional: string;
  website: string;
  rating: number;
  rating_top: number;
  ratings: Rating[];
  reactions: { [key: string]: number };
  added: number;
  added_by_status: AddedByStatus;
  playtime: number;
  screenshots_count: number;
  movies_count: number;
  creators_count: number;
  achievements_count: number;
  parent_achievements_count: number;
  reddit_url: string;
  reddit_name: string;
  reddit_description: string;
  reddit_logo: string;
  reddit_count: number;
  twitch_count: number;
  youtube_count: number;
  reviews_text_count: number;
  ratings_count: number;
  suggestions_count: number;
  alternative_names: string[];
  metacritic_url: string;
  parents_count: number;
  additions_count: number;
  game_series_count: number;
  user_game: null;
  reviews_count: number;
  saturated_color: string;
  dominant_color: string;
  parent_platforms: ParentPlatform[];
  platforms: PlatformElement[];
  stores: Store[];
  developers: Developer[];
  genres: Developer[];
  tags: Developer[];
  publishers: Developer[];
  esrb_rating: EsrbRating;
  clip: null;
  description_raw: string;
}

export interface AddedByStatus {
  yet: number;
  owned: number;
  beaten: number;
  toplay: number;
  dropped: number;
  playing: number;
}

export interface Developer {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
  domain?: string;
  language?: Language;
}

export enum Language {
  Eng = 'eng',
}

export interface EsrbRating {
  id: number;
  name: string;
  slug: string;
}

export interface MetacriticPlatform {
  metascore: number;
  url: string;
  platform: MetacriticPlatformPlatform;
}

export interface MetacriticPlatformPlatform {
  platform: number;
  name: string;
  slug: string;
}

export interface ParentPlatform {
  platform: EsrbRating;
}

export interface PlatformElement {
  platform: PlatformPlatform;
  released_at: Date;
  requirements: Requirements;
}

export interface PlatformPlatform {
  id: number;
  name: string;
  slug: string;
  image: null;
  year_end: null;
  year_start: number | null;
  games_count: number;
  image_background: string;
}

export interface Requirements {
  minimum?: string;
  recommended?: string;
}

export interface Rating {
  id: number;
  title: string;
  count: number;
  percent: number;
}

export interface Store {
  id: number;
  url: string;
  store: Developer;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toGameResponse(json: string): GameResponse {
    return cast(JSON.parse(json), r('GameResponse'));
  }

  public static gameResponseToJson(value: GameResponse): string {
    return JSON.stringify(uncast(value, r('GameResponse')), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
  if (key) {
    throw Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ
      )} but got ${JSON.stringify(val)}`
    );
  }
  throw Error(
    `Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`
  );
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(cases, val);
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue('array', val);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue('Date', val);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any
  ): any {
    if (val === null || typeof val !== 'object' || Array.isArray(val)) {
      return invalidValue('object', val);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, prop.key);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key);
      }
    });
    return result;
  }

  if (typ === 'any') return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val);
  }
  if (typ === false) return invalidValue(typ, val);
  while (typeof typ === 'object' && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === 'object') {
    return typ.hasOwnProperty('unionMembers')
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty('arrayItems')
      ? transformArray(typ.arrayItems, val)
      : typ.hasOwnProperty('props')
      ? transformObject(getProps(typ), typ.additional, val)
      : invalidValue(typ, val);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== 'number') return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  GameResponse: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'slug', js: 'slug', typ: '' },
      { json: 'name', js: 'name', typ: '' },
      { json: 'name_original', js: 'name_original', typ: '' },
      { json: 'description', js: 'description', typ: '' },
      { json: 'metacritic', js: 'metacritic', typ: 0 },
      {
        json: 'metacritic_platforms',
        js: 'metacritic_platforms',
        typ: a(r('MetacriticPlatform')),
      },
      { json: 'released', js: 'released', typ: Date },
      { json: 'tba', js: 'tba', typ: true },
      { json: 'updated', js: 'updated', typ: Date },
      { json: 'background_image', js: 'background_image', typ: '' },
      {
        json: 'background_image_additional',
        js: 'background_image_additional',
        typ: '',
      },
      { json: 'website', js: 'website', typ: '' },
      { json: 'rating', js: 'rating', typ: 3.14 },
      { json: 'rating_top', js: 'rating_top', typ: 0 },
      { json: 'ratings', js: 'ratings', typ: a(r('Rating')) },
      { json: 'reactions', js: 'reactions', typ: m(0) },
      { json: 'added', js: 'added', typ: 0 },
      {
        json: 'added_by_status',
        js: 'added_by_status',
        typ: r('AddedByStatus'),
      },
      { json: 'playtime', js: 'playtime', typ: 0 },
      { json: 'screenshots_count', js: 'screenshots_count', typ: 0 },
      { json: 'movies_count', js: 'movies_count', typ: 0 },
      { json: 'creators_count', js: 'creators_count', typ: 0 },
      { json: 'achievements_count', js: 'achievements_count', typ: 0 },
      {
        json: 'parent_achievements_count',
        js: 'parent_achievements_count',
        typ: 0,
      },
      { json: 'reddit_url', js: 'reddit_url', typ: '' },
      { json: 'reddit_name', js: 'reddit_name', typ: '' },
      { json: 'reddit_description', js: 'reddit_description', typ: '' },
      { json: 'reddit_logo', js: 'reddit_logo', typ: '' },
      { json: 'reddit_count', js: 'reddit_count', typ: 0 },
      { json: 'twitch_count', js: 'twitch_count', typ: 0 },
      { json: 'youtube_count', js: 'youtube_count', typ: 0 },
      { json: 'reviews_text_count', js: 'reviews_text_count', typ: 0 },
      { json: 'ratings_count', js: 'ratings_count', typ: 0 },
      { json: 'suggestions_count', js: 'suggestions_count', typ: 0 },
      { json: 'alternative_names', js: 'alternative_names', typ: a('') },
      { json: 'metacritic_url', js: 'metacritic_url', typ: '' },
      { json: 'parents_count', js: 'parents_count', typ: 0 },
      { json: 'additions_count', js: 'additions_count', typ: 0 },
      { json: 'game_series_count', js: 'game_series_count', typ: 0 },
      { json: 'user_game', js: 'user_game', typ: null },
      { json: 'reviews_count', js: 'reviews_count', typ: 0 },
      { json: 'saturated_color', js: 'saturated_color', typ: '' },
      { json: 'dominant_color', js: 'dominant_color', typ: '' },
      {
        json: 'parent_platforms',
        js: 'parent_platforms',
        typ: a(r('ParentPlatform')),
      },
      { json: 'platforms', js: 'platforms', typ: a(r('PlatformElement')) },
      { json: 'stores', js: 'stores', typ: a(r('Store')) },
      { json: 'developers', js: 'developers', typ: a(r('Developer')) },
      { json: 'genres', js: 'genres', typ: a(r('Developer')) },
      { json: 'tags', js: 'tags', typ: a(r('Developer')) },
      { json: 'publishers', js: 'publishers', typ: a(r('Developer')) },
      { json: 'esrb_rating', js: 'esrb_rating', typ: r('EsrbRating') },
      { json: 'clip', js: 'clip', typ: null },
      { json: 'description_raw', js: 'description_raw', typ: '' },
    ],
    false
  ),
  AddedByStatus: o(
    [
      { json: 'yet', js: 'yet', typ: 0 },
      { json: 'owned', js: 'owned', typ: 0 },
      { json: 'beaten', js: 'beaten', typ: 0 },
      { json: 'toplay', js: 'toplay', typ: 0 },
      { json: 'dropped', js: 'dropped', typ: 0 },
      { json: 'playing', js: 'playing', typ: 0 },
    ],
    false
  ),
  Developer: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'name', js: 'name', typ: '' },
      { json: 'slug', js: 'slug', typ: '' },
      { json: 'games_count', js: 'games_count', typ: 0 },
      { json: 'image_background', js: 'image_background', typ: '' },
      { json: 'domain', js: 'domain', typ: u(undefined, '') },
      { json: 'language', js: 'language', typ: u(undefined, r('Language')) },
    ],
    false
  ),
  EsrbRating: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'name', js: 'name', typ: '' },
      { json: 'slug', js: 'slug', typ: '' },
    ],
    false
  ),
  MetacriticPlatform: o(
    [
      { json: 'metascore', js: 'metascore', typ: 0 },
      { json: 'url', js: 'url', typ: '' },
      {
        json: 'platform',
        js: 'platform',
        typ: r('MetacriticPlatformPlatform'),
      },
    ],
    false
  ),
  MetacriticPlatformPlatform: o(
    [
      { json: 'platform', js: 'platform', typ: 0 },
      { json: 'name', js: 'name', typ: '' },
      { json: 'slug', js: 'slug', typ: '' },
    ],
    false
  ),
  ParentPlatform: o(
    [{ json: 'platform', js: 'platform', typ: r('EsrbRating') }],
    false
  ),
  PlatformElement: o(
    [
      { json: 'platform', js: 'platform', typ: r('PlatformPlatform') },
      { json: 'released_at', js: 'released_at', typ: Date },
      { json: 'requirements', js: 'requirements', typ: r('Requirements') },
    ],
    false
  ),
  PlatformPlatform: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'name', js: 'name', typ: '' },
      { json: 'slug', js: 'slug', typ: '' },
      { json: 'image', js: 'image', typ: null },
      { json: 'year_end', js: 'year_end', typ: null },
      { json: 'year_start', js: 'year_start', typ: u(0, null) },
      { json: 'games_count', js: 'games_count', typ: 0 },
      { json: 'image_background', js: 'image_background', typ: '' },
    ],
    false
  ),
  Requirements: o(
    [
      { json: 'minimum', js: 'minimum', typ: u(undefined, '') },
      { json: 'recommended', js: 'recommended', typ: u(undefined, '') },
    ],
    false
  ),
  Rating: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'title', js: 'title', typ: '' },
      { json: 'count', js: 'count', typ: 0 },
      { json: 'percent', js: 'percent', typ: 3.14 },
    ],
    false
  ),
  Store: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'url', js: 'url', typ: '' },
      { json: 'store', js: 'store', typ: r('Developer') },
    ],
    false
  ),
  Language: ['eng'],
};
