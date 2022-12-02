import imgLens from 'image-lens';

const image = document.getElementById('example');
const ratioInput = document.getElementById('ratio');
const widthInput = document.getElementById('width');
const heightInput = document.getElementById('height');
const radioButtons = document.querySelectorAll('.options-container label');

let lens;
let ratio = 2;
let width = 25;
let height = 25;
let options = { o: false, w: false };
let className = 'image-lens';

function newLens() {
  if (lens) lens.remove();
  lens = new imgLens(image, {
    zoomRatio: ratio,
    lensWidth: width,
    lensHeight: height,
    originZoom: options.o,
    zoomWindow: options.w,
    className: className
  });
}

function disableInputs(r, s) {
  ratioInput.disabled = r;
  widthInput.disabled = s;
  heightInput.disabled = s;
}

ratioInput.value = ratio;
widthInput.value = width;
heightInput.value = height;
newLens();

radioButtons.forEach(rb => {
  rb.addEventListener('click', () => {
    options = { o: false, w: false };
    let value = document.getElementById(rb.htmlFor).value;
    options[value] = true;
    switch (value) {
      case 'w':
        image.style.margin = '0';
        disableInputs(true, false);
        break;
      case 'o':
        image.style.margin = null;
        disableInputs(false, true);
        break;
      case 'l':
        image.style.margin = null;
        disableInputs(false, false);
        break;
      default:
        break;
    }
    if (value !== 'l') className = 'lens';
    else className = 'image-lens';
    newLens();
  });
});

ratioInput.addEventListener('input', () => {
  let value = ratioInput.value;
  if (value > 100) ratio = 100;
  else if (!value || value < 1) ratio = 1;
  else ratio = value;
  newLens();
});

[widthInput, heightInput].forEach(i => {
  i.addEventListener('input', () => {
    let value = i.value;
    if (value > 100) value = 100;
    else if (!value || value < 0) value = 0;
    if (i === widthInput) width = value;
    else height = value;
    newLens();
  });
});
