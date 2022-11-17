import zoomLens from './scripts/zoom-lens';

// test
const i = document.querySelector('img') as HTMLImageElement;
const lens = new zoomLens(i, {
  zoomRatio: 2,
  zoomWindow: true
});
lens.hide();

export { zoomLens };
