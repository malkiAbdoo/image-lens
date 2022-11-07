const body = document.body;

export interface Options {
  img: HTMLImageElement;
  zoom?: number;
}

export function zoomLens(options: Options) {
  const lens = document.createElement('div');
  lens.setAttribute(
    'style',
    'position: fixed;pointer-events: none !important;z-index: 999;'
  );
  lens.classList.add('cursor-lens');
  body.appendChild(lens);
  const style = lens.getBoundingClientRect();
  if (style.width == 0) {
    lens.style.width = '120px';
    lens.style.aspectRatio = '1';
    lens.style.boxShadow = '0 0 30px';
  }
  const zoomRatio = options.zoom || 2;
  const lensRect = lens.getBoundingClientRect();
  const zoomRect = {
    width: lensRect.width / zoomRatio,
    height: lensRect.height / zoomRatio
  };
  lens.style.backgroundImage = `url(${options.img.src})`;
  lens.style.backgroundRepeat = 'no-repeat';
  // imgElement.style.cursor = 'none';
  let px: number;
  let py: number;
  let sx: number;
  let sy: number;

  function hide() {
    lens.style.setProperty('display', 'none', 'important');
  }

  function updateOnScroll() {
    if (py == null) return;
    const cx = lensRect.width / zoomRect.width;
    const cy = lensRect.height / zoomRect.height;
    const x = px + (window.scrollX - sx);
    const y = py + (window.scrollY - sy);
    lens.style.backgroundPosition = '-' + x * cx + 'px -' + y * cy + 'px';
  }

  function updateOnMove(event: MouseEvent) {
    const containerRect = options.img.getBoundingClientRect();
    const { x, y } = mousePosition(event, containerRect);
    const cx = lensRect.width / zoomRect.width;
    const cy = lensRect.height / zoomRect.height;
    const bgw = containerRect.width * cx;
    const bgh = containerRect.height * cy;

    [px, py] = [x, y];
    [sx, sy] = [window.scrollX, window.scrollY];

    lens.style.backgroundSize = bgw + 'px ' + bgh + 'px';
    lens.style.backgroundPosition = '-' + x * cx + 'px -' + y * cy + 'px';
  }

  function mousePosition(event: MouseEvent, containerRect: DOMRect) {
    let x =
      event.pageX - window.scrollX - containerRect.left - zoomRect.width / 2;
    let y =
      event.pageY - window.scrollY - containerRect.top - zoomRect.height / 2;

    let maxX = containerRect.width - zoomRect.width;
    let maxY = containerRect.height - zoomRect.height;
    if (x <= 0) x = 0;
    else if (x >= maxX) x = maxX;
    if (y <= 0) y = 0;
    else if (y >= maxY) y = maxY;

    maxX = containerRect.width - lensRect.width;
    maxY = containerRect.height - lensRect.height;
    let lensX = x + zoomRect.width / 2 - lensRect.width / 2;
    let lensY = y + zoomRect.height / 2 - lensRect.height / 2;
    if (lensX <= 0) lensX = 0;
    else if (lensX >= maxX) lensX = maxX;
    if (lensY <= 0) lensY = 0;
    else if (lensY >= maxY) lensY = maxY;

    lens.style.left = lensX + containerRect.left + 'px';
    lens.style.top = lensY + containerRect.top + 'px';
    lens.style.display = 'block';

    return { x, y };
  }
  hide();

  window.addEventListener('scroll', updateOnScroll);
  options.img.addEventListener('mouseleave', hide);
  options.img.addEventListener('mousemove', updateOnMove);

  return lens;
}

// test
const i = document.querySelector('img') as HTMLImageElement;
zoomLens({ img: i });
