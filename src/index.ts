import { zoomLens } from './scripts/zoom-lens';

// test
const i = document.querySelector('img') as HTMLImageElement;
const lens = new zoomLens(i, { zoomRatio: 2, originZoom: true });
lens.hide();

export { zoomLens };
