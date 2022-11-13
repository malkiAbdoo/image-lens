import { Img } from '../types';

export function createZoomWindow(lens: HTMLDivElement, image: Img) {
  const zoomWindow = document.createElement('div');
  const lensRect = lens.getBoundingClientRect();
  zoomWindow.classList.add('zoom-window');
  zoomWindow.style.position = 'absolute';
  zoomWindow.style.pointerEvents = 'none';
  document.body.appendChild(zoomWindow);

  const rect = zoomWindow.getBoundingClientRect();
  if (rect.width == 0) {
    zoomWindow.style.width = image.width + 'px';
    zoomWindow.style.aspectRatio = lensRect.width + '/' + lensRect.height;
  }
  if (rect.left == 0) {
    zoomWindow.style.top = image.offsetTop + 'px';
    zoomWindow.style.left = image.offsetLeft + image.width + 10 + 'px';
  }
  //   zoomWindow.style.display = 'none';

  return zoomWindow;
}
