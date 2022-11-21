import { Img, Div } from '../types';

export function resize(ele: Div, img: Img, w: number | null, h: number | null) {
  w = w || 20;
  h = h || w;
  const width = (w > 100 ? 100 : w) || 20;
  const height = (h > 100 ? 100 : h) || w;
  ele.style.width = (img.width * width) / 100 + 'px';
  ele.style.height = (img.height * height) / 100 + 'px';
}
