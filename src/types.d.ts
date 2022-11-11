export type Img = HTMLImageElement;
export interface Options {
  zoomRatio: number;
  className: string;
  window: HTMLDivElement;
  originZoom: boolean;
}
export interface Lens {
  div: HTMLDivElement;
  zoomRatio: number;
  origin: boolean;
  zoomRect: {
    width: number;
    height: number;
  };
  prevPosition: {
    px: number;
    py: number;
    sx: number;
    sy: number;
  };
}
