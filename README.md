
<div align=center>

<img src="./example/assets/zoom-lens-logo.svg" alt="logo" width="10%"><br>
# zoom-lens

an image zoom lens with the cursor

[![GitHub issues](https://img.shields.io/github/issues/malkiAbdoo/zoom-lens)](https://github.com/malkiAbdoo/zoom-lens/issues)


</div>

## Demo 🔎

See the [example here](https://malkiabdoo.github.io/zoom-lens/).

## Installation

using **npm**:
```
npm i zoom-lens --save
```

or **yarn**:
```
yarn add zoom-lens
```

## Getting started

use the `zoomLens` class:
```js
import zoomLens from 'zoom-lens';

const image = document.querySelector('img');

const lens = new zoomLens(image, {
    // the zoom ratio (default = 2)
    zoomRatio: 2,

    // the lens width and height in '%' (default = 20%, 20%)
    lensWidth: 20,
    lensHeight: 20,

    // if you set this to TRUE the zoom will be in the image itself
    originZoom: false,

    // if you set this to TRUE the zoom will be in a side window
    zoomWindow: false,

    // you set the lens class name (default = 'zoom-lens')
    className: 'zoom-lens'
});
```

### Styling ✨

add your css to the lens:
```css
.zoom-lens {
    box-shadow: 0 0 30px;

    ...
}
```

you can also style the zoom window if you are using `zoomWindow` option:
> **Important**  
you have to specify (width, top, left)
```css
.zoom-window {
    width: 150px;
    top: 50px;
    left: 700px;

    ...
}
```

## License

Distributed under the [MIT](https://github.com/malkiAbdoo/zoom-lens/blob/master/LICENSE) license.
