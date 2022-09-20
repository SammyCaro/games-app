export interface GameScreenshotResponse {
  count: number;
  next: null;
  previous: null;
  results: Results[];
}

export interface Results {
  id: number;
  image: string;
  width: number;
  height: number;
  is_deleted: boolean;
}
