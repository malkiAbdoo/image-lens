import { Lens } from '../types';
import { Img, Options } from '../types';
import { createZoomWindow } from './zoom-window';

const body = document.body;

export class zoomLens {
  private _lens: Partial<Lens> = {};
  private _image: Img;

  constructor(image: Img, options: Partial<Options> = {}) {
    const lens = document.createElement('div');
    const originZoom = (options.originZoom || false) && !options.zoomWindow;
    lens.style.position = originZoom ? 'absolute' : 'fixed';
    lens.style.pointerEvents = 'none';
    lens.style.zIndex = '999';
    lens.classList.add(options.className || 'zoom-lens');

    this._image = image;
    this._lens.div = lens;
    this._lens.origin = originZoom;
    body.appendChild(lens);

    // create the zoom window
    if (originZoom) {
      lens.style.width = image.width + 'px';
      lens.style.height = image.height + 'px';
    } else if (lens.getBoundingClientRect().width == 0) {
      lens.style.width = '120px';
      lens.style.aspectRatio = '1';
      lens.style.boxShadow = '0 0 30px';
    }
    if (options.zoomWindow) {
      this._lens.window = createZoomWindow(this._lens.div, this._image);
      lens.style.background = '#1118';
      this.zoom(1);
    } else this.zoom(options.zoomRatio || 2);
    lens.style.top = image.offsetTop + 'px';
    lens.style.left = image.offsetLeft + 'px';

    lens.style.backgroundImage = `url(${image.src})`;
    lens.style.backgroundRepeat = 'no-repeat';
    this.setBgSize();
    this.hide();

    image.addEventListener('mousemove', e => this.updateOnMove(e));
    image.addEventListener('mouseenter', () => this.show());
    image.addEventListener('mouseleave', () => this.hide());
    window.addEventListener('scroll', () => this.updateOnScroll());
    window.addEventListener('resize', () => this.setBgSize());
  }

  setBgSize() {
    // image.size * image.size / lens.size
    if (this._lens.window) return;
    const imageRect = this._image.getBoundingClientRect();
    const ratio = this._lens.zoomRatio!;
    const bgw = imageRect.width * ratio;
    const bgh = imageRect.height * ratio;

    this._lens.div!.style.backgroundSize = bgw + 'px ' + bgh + 'px';
  }
  setBgPosition(x: number, y: number) {
    if (this._lens.origin) {
      this._lens.div!.style.top = this._image.offsetTop + 'px';
      this._lens.div!.style.left = this._image.offsetLeft + 'px';
      this._lens.div!.style.width = this._image.width + 'px';
      this._lens.div!.style.height = this._image.height + 'px';
    }
    this._lens.div!.style.backgroundPosition = '-' + x + 'px -' + y + 'px';
  }

  // change the background position on scroll
  private updateOnScroll() {
    const prevPos = this._lens.prevPosition;

    if (prevPos == null) return;
    const ratio = this._lens.zoomRatio!;
    const zoomRect = this._lens.zoomRect!;
    const scrollX = window.scrollX - prevPos.sx;
    const scrollY = window.scrollY - prevPos.sy;
    let x = prevPos.px + scrollX;
    let y = prevPos.py + scrollY;

    const maxX = this._image.width - zoomRect.width;
    const maxY = this._image.height - zoomRect.height;
    if (x <= 0) x = 0;
    else if (x >= maxX) x = maxX;
    if (y <= 0) y = 0;
    else if (y >= maxY) y = maxY;

    this.setBgPosition(x * ratio, y * ratio);
  }

  // change the background position on mouse move
  private updateOnMove(event: MouseEvent) {
    const origin = this._lens.origin;
    const posX = event.pageX - (origin ? 0 : window.scrollX);
    const posY = event.pageY - (origin ? 0 : window.scrollY);
    const zoomRect = this._lens.zoomRect!;
    const imageRect = this._image.getBoundingClientRect();
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

    this.setBgPosition(x * ratio, y * ratio);

    maxX = imageRect.width - lensRect.width;
    maxY = imageRect.height - lensRect.height;
    let lensX = x + zoomRect.width / 2 - lensRect.width / 2;
    let lensY = y + zoomRect.height / 2 - lensRect.height / 2;
    if (lensX <= 0) lensX = 0;
    else if (lensX >= maxX) lensX = maxX;
    if (lensY <= 0) lensY = 0;
    else if (lensY >= maxY) lensY = maxY;

    this._lens.prevPosition = {
      px: x,
      py: y,
      sx: window.scrollX,
      sy: window.scrollY
    };

    // set the lens position
    if (!this._lens.origin) {
      this._lens.div!.style.left = lensX + imageRect.left + 'px';
      this._lens.div!.style.top = lensY + imageRect.top + 'px';
    }
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
    if (this._lens.window) this._lens.window.style.display = 'block';
    this._lens.div!.style.zIndex = '999';
  }
  hide() {
    if (this._lens.window) this._lens.window.style.display = 'none';
    this._lens.div!.style.zIndex = '-1';
  }
  remove() {
    if (this._lens.window) this._lens.window.remove();
    this._lens.div!.remove();
  }
}
