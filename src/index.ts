import { Lens } from './types';
import { Img, Options } from './types';

const body = document.body;

export default class zoomLens {
  private _lens: Partial<Lens> = {};
  private _image: Img;
  constructor(image: Img, options: Partial<Options> = {}) {
    let lens = document.createElement('div');
    lens.style.position = 'fixed';
    lens.style.pointerEvents = 'none';
    lens.style.zIndex = '999';
    lens.classList.add(options.className || 'zoom-lens');

    this._image = image;
    this._lens.div = lens;
    body.appendChild(this._lens.div);

    if (this._lens.div.getBoundingClientRect().width == 0) {
      this._lens.div.style.width = '120px';
      this._lens.div.style.aspectRatio = '1';
      this._lens.div.style.boxShadow = '0 0 30px';
      lens = this._lens.div;
    }

    this.zoom(options.zoomRatio || 2);
    this._lens.div.style.backgroundImage = `url(${image.src})`;
    this._lens.div.style.backgroundRepeat = 'no-repeat';

    window.addEventListener('scroll', () => this.updateOnScroll());
    image.addEventListener('mousemove', e => this.updateOnMove(e));
    image.addEventListener('mouseenter', () => this.show());
    image.addEventListener('mouseleave', () => this.hide());
  }

  setBgSize() {
    const ratio = this._lens.zoomRatio!;
    const imageRect = this._image.getBoundingClientRect();
    const bgw = imageRect.width * ratio;
    const bgh = imageRect.height * ratio;

    this._lens.div!.style.backgroundSize = bgw + 'px ' + bgh + 'px';
  }
  setBgPosition(x: number, y: number) {
    this._lens.div!.style.backgroundPosition = '-' + x + 'px -' + y + 'px';
  }

  // change the background position on scroll
  private updateOnScroll() {
    const prevPos = this._lens.prevPosition;

    if (prevPos == null) return;
    const zoomRect = this._lens.zoomRect!;
    const ratio = this._lens.zoomRatio!;
    const posX = prevPos.px - zoomRect.width / 2;
    const posY = prevPos.py - zoomRect.height / 2;
    const x = (posX + (window.scrollX - prevPos.sx)) * ratio;
    const y = (posY + (window.scrollY - prevPos.sy)) * ratio;

    this.setBgSize();
    this.setBgPosition(x, y);
  }

  // change the background position on mouse mouve
  private updateOnMove(event: MouseEvent) {
    const imageRect = this._image.getBoundingClientRect();
    const [x, y] = this.getMousePosition(event, imageRect);

    this.setBgSize();
    this.setBgPosition(x, y);
  }

  private getMousePosition(event: MouseEvent, imageRect: DOMRect) {
    const posX = event.pageX - window.scrollX;
    const posY = event.pageY - window.scrollY;
    const zoomRect = this._lens.zoomRect!;
    const lensRect = this._lens.div!.getBoundingClientRect();
    const ratio = this._lens.zoomRatio!;
    let x = posX - imageRect.left - zoomRect.width / 2;
    let y = posY - imageRect.top - zoomRect.height / 2;

    let maxX = imageRect.width - zoomRect.width;
    let maxY = imageRect.height - zoomRect.height;
    if (x <= 0) x = 0;
    else if (x >= maxX) x = maxX;
    if (y <= 0) y = 0;
    else if (y >= maxY) y = maxY;

    maxX = imageRect.width - lensRect.width;
    maxY = imageRect.height - lensRect.height;
    let lensX = x + zoomRect.width / 2 - lensRect.width / 2;
    let lensY = y + zoomRect.height / 2 - lensRect.height / 2;
    if (lensX <= 0) lensX = 0;
    else if (lensX >= maxX) lensX = maxX;
    if (lensY <= 0) lensY = 0;
    else if (lensY >= maxY) lensY = maxY;

    this._lens.prevPosition = {
      px: x + zoomRect.width / 2,
      py: y + zoomRect.height / 2,
      sx: window.scrollX,
      sy: window.scrollY
    };

    // set the lens position
    this._lens.div!.style.left = lensX + imageRect.left + 'px';
    this._lens.div!.style.top = lensY + imageRect.top + 'px';
    this.show();

    return [x * ratio, y * ratio];
  }
  zoom(ratio: number) {
    const rect = this._lens.div!.getBoundingClientRect();
    this._lens.zoomRatio = ratio <= 0 ? 0.01 : ratio;
    this._lens.zoomRect = {
      width: rect.width / ratio,
      height: rect.height / ratio
    };
    this.updateOnScroll();
  }

  show() {
    this._lens.div!.style.display = 'block';
  }
  hide() {
    this._lens.div!.style.display = 'none';
  }
  remove() {
    this._lens.div!.remove();
  }
}

// test
const i = document.querySelector('img') as Img;
// eslint-disable-next-line prefer-const
let lens = new zoomLens(i, { zoomRatio: 1 });
setTimeout(() => {
  lens.zoom(2);
}, 7000);
