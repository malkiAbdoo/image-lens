import { Lens } from '../types';
import { Img, Options } from '../types';
import { createZoomWindow } from './zoom-window';

const body = document.body;

export default class zoomLens {
  private _lens: Partial<Lens> = {};
  private _image: Img;

  constructor(image: Img, options: Partial<Options> = {}) {
    const lens = document.createElement('div');
    const originZoom = (options.originZoom || false) && !options.zoomWindow;
    const background = `url(${image.src}) no-repeat`;
    lens.style.position = originZoom ? 'absolute' : 'fixed';
    lens.style.pointerEvents = 'none';
    lens.style.zIndex = '999';
    lens.classList.add(options.className || 'zoom-lens');

    this._image = image;
    this._lens.div = lens;
    this._lens.origin = originZoom;
    body.appendChild(lens);

    // styling
    const lensStyle = window.getComputedStyle(lens);
    if (originZoom) {
      lens.style.width = image.width + 'px';
      lens.style.height = image.height + 'px';
    } else {
      const w = options.lensWidth || options.lensHeight || 20;
      const h = options.lensHeight || w;
      lens.style.width = (image.width * (w > 100 ? 100 : w)) / 100 + 'px';
      lens.style.height = (image.height * (h > 100 ? 100 : h)) / 100 + 'px';
    }
    if (options.zoomWindow) {
      this._lens.window = createZoomWindow(this._lens.div, this._image);
      this._lens.window.style.background = background;
      if (lensStyle.backgroundColor == 'rgba(0, 0, 0, 0)') {
        lens.style.background = '#FFF6';
      }

      const windowRect = this._lens.window.getBoundingClientRect();
      const lensRect = this._lens.div.getBoundingClientRect();
      this._lens.zoomRatio = windowRect.width / lensRect.width;
      this._lens.zoomRect = {
        width: lensRect.width,
        height: lensRect.height
      };
    } else {
      this.zoom(options.zoomRatio || 2);
      lens.style.background = background;
    }
    this.setBgSize();
    lens.style.top = image.offsetTop + 'px';
    lens.style.left = image.offsetLeft + 'px';
    this.hide();

    // Event listeners
    image.addEventListener('mousemove', e => this.updateOnMove(e));
    image.addEventListener('mouseenter', () => this.show());
    image.addEventListener('mouseleave', () => this.hide());
    window.addEventListener('scroll', () => this.updateOnScroll());
    window.addEventListener('resize', () => this.setBgSize());
  }

  private setBgSize() {
    const ratio = this._lens.zoomRatio!;
    const bgw = this._image.width * ratio;
    const bgh = this._image.height * ratio;

    const lens = this._lens.window ? this._lens.window : this._lens.div!;
    lens.style.backgroundSize = bgw + 'px ' + bgh + 'px';
  }
  private setBgPosition(x: number, y: number) {
    if (this._lens.origin) {
      this._lens.div!.style.top = this._image.offsetTop + 'px';
      this._lens.div!.style.left = this._image.offsetLeft + 'px';
      this._lens.div!.style.width = this._image.width + 'px';
      this._lens.div!.style.height = this._image.height + 'px';
    }
    const lens = this._lens.window ? this._lens.window : this._lens.div!;
    lens.style.backgroundPosition = '-' + x + 'px -' + y + 'px';
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

    // Make sure that the background position doesn't get over the image
    let maxX = imageRect.width - zoomRect.width;
    let maxY = imageRect.height - zoomRect.height;
    if (x <= 0) x = 0;
    else if (x >= maxX) x = maxX;
    if (y <= 0) y = 0;
    else if (y >= maxY) y = maxY;

    this.setBgPosition(x * ratio, y * ratio);

    // Calculating the lens position
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

    if (!this._lens.origin) {
      this._lens.div!.style.left = lensX + imageRect.left + 'px';
      this._lens.div!.style.top = lensY + imageRect.top + 'px';
    }
  }
  zoom(ratio: number) {
    if (this._lens.window) return;
    const rect = this._lens.div!.getBoundingClientRect();
    this._lens.zoomRatio = ratio <= 0 ? 0.01 : ratio;
    ratio = this._lens.zoomRatio;
    this._lens.zoomRect = {
      width: rect.width / ratio,
      height: rect.height / ratio
    };
    this.updateOnScroll();
  }

  setLensSize(width: number, height = 0) {
    if (!width || this._lens.origin) return;
    const zoomWindow = this._lens.window;
    const ratio = zoomWindow ? 1 : this._lens.zoomRatio!;
    const lens = this._lens.div!;
    const image = this._image;
    const w = width;
    const h = height || width;
    lens.style.width = (image.width * (w > 100 ? 100 : w)) / 100 + 'px';
    lens.style.height = (image.height * (h > 100 ? 100 : h)) / 100 + 'px';

    const lensRect = lens.getBoundingClientRect();
    if (zoomWindow) {
      const windowWidth = window.getComputedStyle(zoomWindow).width;
      zoomWindow.style.aspectRatio = lensRect.width + '/' + lensRect.height;
      this._lens.zoomRatio = +windowWidth.replace('px', '') / lensRect.width;
    }
    this._lens.zoomRect = {
      width: lensRect.width / ratio,
      height: lensRect.height / ratio
    };
    this.setBgSize();
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
