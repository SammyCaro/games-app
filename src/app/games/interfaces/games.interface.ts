export interface GamesResponse {
  count: number;
  next: string;
  previous: null;
  results: Result[];
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  seo_h1: string;
  noindex: boolean;
  nofollow: boolean;
  description: string;
  filters: Filters;
  nofollow_collections: string[];
}

export interface Result {
  id: number;
  slug: string;
  name: string;
  released: Date;
  tba: boolean;
  background_image: string;
  rating: number;
  rating_top: number;
  ratings: Rating[];
  ratings_count: number;
  reviews_text_count: number;
  added: number;
  added_by_status: AddedByStatus;
  metacritic: number;
  playtime: number;
  suggestions_count: number;
  updated: Date;
  user_game: null;
  reviews_count: number;
  saturated_color: Color;
  dominant_color: Color;
  platforms: PlatformElement[];
  parent_platforms: ParentPlatform[];
  genres: Genre[];
  stores: Store[];
  clip: null;
  tags: Genre[];
  esrb_rating: EsrbRating;
  short_screenshots: ShortScreenshot[];
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  games_count: number;
  image_background: string;
  domain?: Domain;
  language?: Language;
}

export interface Filters {
  years: FiltersYear[];
}

export interface FiltersYear {
  from: number;
  to: number;
  filter: string;
  decade: number;
  years: YearYear[];
  nofollow: boolean;
  count: number;
}

export interface YearYear {
  year: number;
  count: number;
  nofollow: boolean;
}

export interface AddedByStatus {
  yet: number;
  owned: number;
  beaten: number;
  toplay: number;
  dropped: number;
  playing: number;
}

export enum Color {
  The0F0F0F = '0f0f0f',
}

export interface EsrbRating {
  id: number;
  name: string;
  slug: string;
}

export enum Domain {
  AppsAppleCOM = 'apps.apple.com',
  EpicgamesCOM = 'epicgames.com',
  GogCOM = 'gog.com',
  MarketplaceXboxCOM = 'marketplace.xbox.com',
  MicrosoftCOM = 'microsoft.com',
  NintendoCOM = 'nintendo.com',
  PlayGoogleCOM = 'play.google.com',
  StorePlaystationCOM = 'store.playstation.com',
  StoreSteampoweredCOM = 'store.steampowered.com',
}

export enum Language {
  Eng = 'eng',
}

export interface ParentPlatform {
  platform: EsrbRating;
}

export interface PlatformElement {
  platform: PlatformPlatform;
  released_at: Date | null;
  requirements_en: Requirements | null;
  requirements_ru: Requirements | null;
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
  minimum: string;
  recommended?: string;
}

export interface Rating {
  id: number;
  title: Title;
  count: number;
  percent: number;
}

export enum Title {
  Exceptional = 'exceptional',
  Meh = 'meh',
  Recommended = 'recommended',
  Skip = 'skip',
}

export interface ShortScreenshot {
  id: number;
  image: string;
}

export interface Store {
  id: number;
  store: Genre;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toGamesResponse(json: string): GamesResponse {
    return cast(JSON.parse(json), r('GamesResponse'));
  }

  public static gamesResponseToJson(value: GamesResponse): string {
    return JSON.stringify(uncast(value, r('GamesResponse')), null, 2);
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
  GamesResponse: o(
    [
      { json: 'count', js: 'count', typ: 0 },
      { json: 'next', js: 'next', typ: '' },
      { json: 'previous', js: 'previous', typ: null },
      { json: 'results', js: 'results', typ: a(r('Result')) },
      { json: 'seo_title', js: 'seo_title', typ: '' },
      { json: 'seo_description', js: 'seo_description', typ: '' },
      { json: 'seo_keywords', js: 'seo_keywords', typ: '' },
      { json: 'seo_h1', js: 'seo_h1', typ: '' },
      { json: 'noindex', js: 'noindex', typ: true },
      { json: 'nofollow', js: 'nofollow', typ: true },
      { json: 'description', js: 'description', typ: '' },
      { json: 'filters', js: 'filters', typ: r('Filters') },
      { json: 'nofollow_collections', js: 'nofollow_collections', typ: a('') },
    ],
    false
  ),
  Filters: o([{ json: 'years', js: 'years', typ: a(r('FiltersYear')) }], false),
  FiltersYear: o(
    [
      { json: 'from', js: 'from', typ: 0 },
      { json: 'to', js: 'to', typ: 0 },
      { json: 'filter', js: 'filter', typ: '' },
      { json: 'decade', js: 'decade', typ: 0 },
      { json: 'years', js: 'years', typ: a(r('YearYear')) },
      { json: 'nofollow', js: 'nofollow', typ: true },
      { json: 'count', js: 'count', typ: 0 },
    ],
    false
  ),
  YearYear: o(
    [
      { json: 'year', js: 'year', typ: 0 },
      { json: 'count', js: 'count', typ: 0 },
      { json: 'nofollow', js: 'nofollow', typ: true },
    ],
    false
  ),
  Result: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'slug', js: 'slug', typ: '' },
      { json: 'name', js: 'name', typ: '' },
      { json: 'released', js: 'released', typ: Date },
      { json: 'tba', js: 'tba', typ: true },
      { json: 'background_image', js: 'background_image', typ: '' },
      { json: 'rating', js: 'rating', typ: 3.14 },
      { json: 'rating_top', js: 'rating_top', typ: 0 },
      { json: 'ratings', js: 'ratings', typ: a(r('Rating')) },
      { json: 'ratings_count', js: 'ratings_count', typ: 0 },
      { json: 'reviews_text_count', js: 'reviews_text_count', typ: 0 },
      { json: 'added', js: 'added', typ: 0 },
      {
        json: 'added_by_status',
        js: 'added_by_status',
        typ: r('AddedByStatus'),
      },
      { json: 'metacritic', js: 'metacritic', typ: 0 },
      { json: 'playtime', js: 'playtime', typ: 0 },
      { json: 'suggestions_count', js: 'suggestions_count', typ: 0 },
      { json: 'updated', js: 'updated', typ: Date },
      { json: 'user_game', js: 'user_game', typ: null },
      { json: 'reviews_count', js: 'reviews_count', typ: 0 },
      { json: 'saturated_color', js: 'saturated_color', typ: r('Color') },
      { json: 'dominant_color', js: 'dominant_color', typ: r('Color') },
      { json: 'platforms', js: 'platforms', typ: a(r('PlatformElement')) },
      {
        json: 'parent_platforms',
        js: 'parent_platforms',
        typ: a(r('ParentPlatform')),
      },
      { json: 'genres', js: 'genres', typ: a(r('Genre')) },
      { json: 'stores', js: 'stores', typ: a(r('Store')) },
      { json: 'clip', js: 'clip', typ: null },
      { json: 'tags', js: 'tags', typ: a(r('Genre')) },
      { json: 'esrb_rating', js: 'esrb_rating', typ: r('EsrbRating') },
      {
        json: 'short_screenshots',
        js: 'short_screenshots',
        typ: a(r('ShortScreenshot')),
      },
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
  EsrbRating: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'name', js: 'name', typ: '' },
      { json: 'slug', js: 'slug', typ: '' },
    ],
    false
  ),
  Genre: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'name', js: 'name', typ: '' },
      { json: 'slug', js: 'slug', typ: '' },
      { json: 'games_count', js: 'games_count', typ: 0 },
      { json: 'image_background', js: 'image_background', typ: '' },
      { json: 'domain', js: 'domain', typ: u(undefined, r('Domain')) },
      { json: 'language', js: 'language', typ: u(undefined, r('Language')) },
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
      { json: 'released_at', js: 'released_at', typ: u(Date, null) },
      {
        json: 'requirements_en',
        js: 'requirements_en',
        typ: u(r('Requirements'), null),
      },
      {
        json: 'requirements_ru',
        js: 'requirements_ru',
        typ: u(r('Requirements'), null),
      },
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
      { json: 'minimum', js: 'minimum', typ: '' },
      { json: 'recommended', js: 'recommended', typ: u(undefined, '') },
    ],
    false
  ),
  Rating: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'title', js: 'title', typ: r('Title') },
      { json: 'count', js: 'count', typ: 0 },
      { json: 'percent', js: 'percent', typ: 3.14 },
    ],
    false
  ),
  ShortScreenshot: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'image', js: 'image', typ: '' },
    ],
    false
  ),
  Store: o(
    [
      { json: 'id', js: 'id', typ: 0 },
      { json: 'store', js: 'store', typ: r('Genre') },
    ],
    false
  ),
  Color: ['0f0f0f'],
  Domain: [
    'apps.apple.com',
    'epicgames.com',
    'gog.com',
    'marketplace.xbox.com',
    'microsoft.com',
    'nintendo.com',
    'play.google.com',
    'store.playstation.com',
    'store.steampowered.com',
  ],
  Language: ['eng'],
  Title: ['exceptional', 'meh', 'recommended', 'skip'],
};
