<div align=center>

<img src="./example/assets/image-lens-logo.svg" alt="logo" width="180px">

# image-lens.js

an image zoom lens with the cursor

[![npm](https://img.shields.io/npm/v/image-lens?logo=npm)](https://www.npmjs.com/package/image-lens)
[![GitHub Release Date](https://img.shields.io/github/release-date/malkiAbdoo/image-lens?color=ff1cbb&logo=github)](https://github.com/malkiAbdoo/image-lens/releases/tag/v1.0.1)
[![GitHub issues](https://img.shields.io/github/issues/malkiAbdoo/image-lens)](https://github.com/malkiAbdoo/image-lens/issues)

</div>

## Features

- Add a zoom lens that follows the **cursor** throw the image.
- Using a **zoom window** that you can change its position and width using CSS.
- Origin zoom option for the image itself.
- Set your own **class name**.

## Demo 🔎

See the [example here](https://malkiabdoo.github.io/image-lens/).

## Installation

using **npm**:
```
npm i image-lens --save
```

or **yarn**:
```
yarn add image-lens
```

## Getting started

use the `imgLens` class:
```js
import imgLens from 'image-lens';

const image = document.querySelector('img');

const lens = new imgLens(image, {
    // the zoom ratio (default = 2)
    zoomRatio: 2,

    // the lens width and height in '%' (default = 20%, 20%)
    lensWidth: 20,
    lensHeight: 20,

    // if you set this to TRUE the zoom will be in the image itself
    originZoom: false,

    // if you set this to TRUE the zoom will be in a side window
    zoomWindow: false,

    // you set the lens class name (default = 'image-lens')
    className: 'image-lens'
});
```

### Styling ✨

add your css to the lens:
```css
.image-lens {
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

Distributed under the [MIT](https://github.com/malkiAbdoo/image-lens/blob/master/LICENSE) license.
