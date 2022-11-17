import { Img } from '../types';

export function createZoomWindow(lens: HTMLDivElement, image: Img) {
  const zoomWindow = document.createElement('div');
  const lensRect = lens.getBoundingClientRect();
  zoomWindow.classList.add('zoom-window');
  document.body.appendChild(zoomWindow);
  zoomWindow.style.position = 'absolute';
  zoomWindow.style.pointerEvents = 'none';
  zoomWindow.style.aspectRatio = lensRect.width + '/' + lensRect.height;

  const rect = zoomWindow.getBoundingClientRect();
  if (rect.width == 0) {
    zoomWindow.style.top = image.offsetTop + 'px';
    zoomWindow.style.left = image.offsetLeft + image.width + 10 + 'px';
    zoomWindow.style.width = image.width / 2 + 'px';
  }

  return zoomWindow;
}
