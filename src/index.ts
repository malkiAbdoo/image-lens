import html2canvas from "html2canvas";

const body = document.body;

// reset the cursor
export const reset = (tool: HTMLElement) => {
  tool.remove();
  if (tool.tagName.toLowerCase() === 'canvas') {
    const canvas = tool as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

// create a trailer
function createTrailer(element = body) {
  const trailer = document.createElement('div');
  trailer.setAttribute('style', 
    "display: none;position: fixed;translate: -50% -50%;pointer-events: none !important;z-index: 1999;"
  );
  element.addEventListener('mouseleave', () => trailer.style.display = "none");
  element.addEventListener('mousemove', event => {
    trailer.style.top = event.pageY - window.scrollY + 'px';
    trailer.style.left = event.pageX - window.scrollX + 'px';
    trailer.style.display = "block";
  });
  return trailer;
}


export function focus (element: HTMLElement = body): HTMLElement {
  const focusBox = document.createElement('div');
  const focusCircle = createTrailer(element);
  focusBox.classList.add("cursor-focus-box");
  focusBox.appendChild(focusCircle);
  body.appendChild(focusBox);
  const containerRect = element.getBoundingClientRect();
  const boxPosition = {
    x: containerRect.left + window.scrollX,
    y: containerRect.top + window.scrollY
  }
  focusBox.setAttribute('style',
    "position: absolute;z-index: 1999;mix-blend-mode: multiply;pointer-events: none !important;"
  );
  focusBox.style.width = containerRect.width + 'px';
  focusBox.style.height = containerRect.height + 'px';
  focusBox.style.left = boxPosition.x + 'px';
  focusBox.style.top = boxPosition.y + 'px';
  focusCircle.style.background = '#fff';

  window.addEventListener("resize", () => {
    const newRect = element.getBoundingClientRect();
    focusBox.style.width = newRect.width + 'px';
    focusBox.style.height = newRect.height + 'px';
  });

  let style = window.getComputedStyle(focusBox);
  if (style['opacity'] === '1' && style['backgroundColor'] === 'rgba(0, 0, 0, 0)') {
    focusBox.style.opacity = '0.5';
    focusBox.style.backgroundColor = '#000';
  }
  style = window.getComputedStyle(focusCircle);
  if (style['width'] === 'auto' && style['height'] === 'auto') {
    focusCircle.style.width = '175px';
    focusCircle.style.height = '175px';
    focusCircle.style.borderRadius = '50%';
  }
  return focusBox;
}
focus(document.querySelector('.s2') as HTMLElement);

export function addTrailer (duration = 200, element: HTMLElement = body): HTMLElement {
  const trailer = createTrailer(element);
  trailer.classList.add("cursor-trailer");
  body.appendChild(trailer);
  const style = window.getComputedStyle(trailer);
  trailer.style.transitionDuration = duration + 'ms';
  trailer.style.transitionTimingFunction = 'ease-out';
  if (style['width'] == 'auto' && style['height'] == 'auto' && style['borderWidth'] == '0px') {
    trailer.style.width = '30px';
    trailer.style.height = '30px';
    trailer.style.borderRadius = '50%';
    trailer.style.border = '4px solid #fff';
  }
  return trailer;
}
addTrailer(200, document.querySelector('.s1') as HTMLElement);

export function zoomLens (zoomRatio = 1.5, element: HTMLElement = body): HTMLElement {
  const lens = document.createElement("div");
  lens.classList.add("cursor-lens");
  lens.style.position = 'fixed';
  lens.style.pointerEvents = 'none !important';
  body.appendChild(lens);
  const style = window.getComputedStyle(lens);
  if (style['width'] == 'auto' && style['height'] == 'auto') {
    lens.style.width = '100px';
    lens.style.height = '100px';
    lens.style.boxShadow = '0 0 30px';
  }
  const lensRect = lens.getBoundingClientRect();
  const zoomRect = {
    width: lensRect.width / zoomRatio,
    height: lensRect.height / zoomRatio
  };

  function setBackgroundImage() {
    if (element.tagName.toLowerCase() === 'img')
      lens.style.backgroundImage = `url(${(element as HTMLImageElement).src})`;
    // take a screenshot
    else html2canvas(element).then(canvas => {
      lens.style.backgroundImage = `url(${canvas.toDataURL()})`;
    });
  }
  setBackgroundImage();

  window.addEventListener("resize", setBackgroundImage);
  element.addEventListener("mouseleave", () => lens.style.display = "none");
  element.addEventListener("mousemove", (event) => {
    const containerRect = element.getBoundingClientRect();
    const { x, y } = mousePosition(event, containerRect);
    const cx = lensRect.width / zoomRect.width;
    const cy = lensRect.height / zoomRect.height;
  
    lens.style.backgroundSize = containerRect.width * cx + 'px ' + containerRect.height * cy + 'px';
    lens.style.backgroundPosition = '-' + x * cx + 'px -' + y * cy + 'px';
  });

  function mousePosition(event: MouseEvent, containerRect: DOMRect) {
    let x = event.pageX - window.scrollX - containerRect.left - zoomRect.width / 2;
    let y = event.pageY - window.scrollY - containerRect.top - zoomRect.height / 2;
    
    let maxX = containerRect.width - zoomRect.width;
    let maxY = containerRect.height - zoomRect.height;
    if (x <= 0) x = 0;
    else if (x >= maxX) x = maxX;
    if (y <= 0) y = 0;
    else if (y >= maxY) y = maxY;

    maxX = containerRect.width - lensRect.width;
    maxY = containerRect.height - lensRect.height;
    let lensX = x + zoomRect.width/2 - lensRect.width/2;
    let lensY = y + zoomRect.height/2 - lensRect.height/2;
    if (lensX <= 0) lensX = 0;
    else if (lensX >= maxX) lensX = maxX;
    if (lensY <= 0) lensY = 0;
    else if (lensY >= maxY) lensY = maxY;

    lens.style.left = lensX + containerRect.left + 'px';
    lens.style.top = lensY + containerRect.top + 'px';
    lens.style.display = "block";

    return { x, y };
  }
  return lens;
}
zoomLens(1.5, document.querySelector('.s3') as HTMLElement);

export interface context {
  lineWidth?: number;
  color?: string;
}
export function drawingMode (element: HTMLElement = body, options: context = {lineWidth: 5, color: '#000'}): HTMLElement {
  const canvas = document.createElement("canvas");
  const containerRect = element.getBoundingClientRect();
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const elementPosition = { 
    x: containerRect.left + window.scrollX,
    y: containerRect.top + window.scrollY
  }
  
  // styling
  canvas.style.position = 'absolute';
  canvas.style.zIndex = '1999';
  canvas.style.left = elementPosition.x + 'px';
  canvas.style.top = elementPosition.y + 'px';
  canvas.width = containerRect.width;
  canvas.height = containerRect.height;
  body.appendChild(canvas);

  
  let isDrawing = false;
  function start (e: MouseEvent) {
    isDrawing = true;
    draw(e);
  }
  function finish () {
    isDrawing = false;
    ctx.beginPath();
  }
  function draw (event: MouseEvent) {
    if (!isDrawing) return;

    const x = event.pageX - elementPosition.x;
    const y = event.pageY - elementPosition.y;

    ctx.lineWidth = options.lineWidth || 5;
    ctx.strokeStyle = options.color || '#000';
    ctx.lineCap = "round";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  function resize () {
    const newRect = element.getBoundingClientRect();
    canvas.width = newRect.width;
    canvas.height = newRect.height;
  }

  canvas.addEventListener("mousedown", start);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseup", finish);
  canvas.addEventListener("mouseleave", finish);
  window.addEventListener("resize", resize);

  return canvas;
}
drawingMode(document.querySelector(".s4") as HTMLElement, {color: '#ffff00'});

// Scroll cursor







