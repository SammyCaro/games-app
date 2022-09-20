export interface GameSeriesResponse {
  count: number;
  next: null;
  previous: null;
  results: Results[];
}

export interface Results {
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
  metacritic: number | null;
  playtime: number;
  suggestions_count: number;
  updated: Date;
  user_game: null;
  reviews_count: number;
  saturated_color: string;
  dominant_color: string;
  platforms: PlatformElement[];
  parent_platforms: ParentPlatform[];
  genres: Genre[];
  stores: Store[];
  clip: null;
  tags: Genre[];
  esrb_rating: EsrbRating;
  short_screenshots: ShortScreenshot[];
}

export interface AddedByStatus {
  yet: number;
  owned: number;
  beaten: number;
  toplay: number;
  dropped: number;
  playing: number;
}

export interface EsrbRating {
  id: number;
  name: string;
  slug: string;
}

export interface Genre {
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

export interface ParentPlatform {
  platform: EsrbRating;
}

export interface PlatformElement {
  platform: PlatformPlatform;
  released_at: Date;
  requirements_en: RequirementsEn | null;
  requirements_ru: null;
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

export interface RequirementsEn {
  minimum: string;
  recommended: string;
}

export interface Rating {
  id: number;
  title: string;
  count: number;
  percent: number;
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
  public static toGameSeriesResponse(json: string): GameSeriesResponse {
    return cast(JSON.parse(json), r('GameSeriesResponse'));
  }

  public static gameSeriesResponseToJson(value: GameSeriesResponse): string {
    return JSON.stringify(uncast(value, r('GameSeriesResponse')), null, 2);
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
  GameSeriesResponse: o(
    [
      { json: 'count', js: 'count', typ: 0 },
      { json: 'next', js: 'next', typ: null },
      { json: 'previous', js: 'previous', typ: null },
      { json: 'results', js: 'results', typ: a(r('Result')) },
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
      { json: 'metacritic', js: 'metacritic', typ: u(0, null) },
      { json: 'playtime', js: 'playtime', typ: 0 },
      { json: 'suggestions_count', js: 'suggestions_count', typ: 0 },
      { json: 'updated', js: 'updated', typ: Date },
      { json: 'user_game', js: 'user_game', typ: null },
      { json: 'reviews_count', js: 'reviews_count', typ: 0 },
      { json: 'saturated_color', js: 'saturated_color', typ: '' },
      { json: 'dominant_color', js: 'dominant_color', typ: '' },
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
      { json: 'domain', js: 'domain', typ: u(undefined, '') },
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
      { json: 'released_at', js: 'released_at', typ: Date },
      {
        json: 'requirements_en',
        js: 'requirements_en',
        typ: u(r('RequirementsEn'), null),
      },
      { json: 'requirements_ru', js: 'requirements_ru', typ: null },
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
  RequirementsEn: o(
    [
      { json: 'minimum', js: 'minimum', typ: '' },
      { json: 'recommended', js: 'recommended', typ: '' },
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
  Language: ['eng'],
};
