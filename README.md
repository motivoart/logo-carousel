
# LogosCarousel

**LogosCarousel** is a lightweight, configurable TypeScript plugin that creates an auto-scrolling logo carousel. With the use of `IntersectionObserver`, carousels are initialized only when they appear in the user's viewport, improving performance.

---

## ✨ Features

- Smooth, automatic horizontal scrolling of logos
- `IntersectionObserver` support – initializes only when visible
- Option to pause animation on hover
- Works with images (`<img>`) and links (`<a><img></a>`)
- Customizable size, gap, and animation duration
- Supports multiple wrappers with logos

---

## 📦 Installation

### 1. Copy the files into your project

### 2. Import the class:

```ts
import LogosCarousel from './PluginLogosCarousel';
```

or:

```html
<script src="PluginLogosCarousel.js"></script>
```

---

## 🧩 HTML Structure

Each carousel wrapper must have a unique `data-*` attribute (e.g., `data-lc-wrapper`, `data-lc-wrapper2`, etc.). Each logo element must have `data-lc-item`.

```html
<div data-lc-wrapper>
  <img src="assets/img/logo.png" data-lc-item alt="" width="200" height="100">
  <a href="/" data-lc-item>
    <img src="assets/img/logo.png" alt="" width="200" height="100">
  </a>
  <!-- Any number of logos -->
</div>

<div data-lc-wrapper2>
  <img src="assets/img/logo.png" data-lc-item alt="" width="200" height="100">
  <img src="assets/img/logo.png" data-lc-item alt="" width="200" height="100">
</div>
```

---

## 🚀 Initialization

### Example usage:

```ts
new LogosCarousel('[data-lc-wrapper]', {
        rootMargin: "0px",
        root: null,
        threshold: 0,
        duration: 8,
        imageWidth: '200px',
        imageHeight: 'auto',
        imageGap: 50,
        stopOnHover: true,
        useIntersectionObserver: false
    });


    new LogosCarousel('[data-lc-wrapper2]', {
        rootMargin: "0px",
        root: null,
        threshold: 0,
        duration: 5,
        imageWidth: '150px',
        imageHeight: 'auto',
        imageGap: 30,
        stopOnHover: false,
        useIntersectionObserver: true
    });
```

---

## ⚙️ Configuration Options (`LogosCarouselOptions`)

| Name                     | Type                 | Default Value     | Description |
|--------------------------|----------------------|-------------------|-------------|
| `rootMargin`             | `string`             | `"0px"`           | Margin for IntersectionObserver |
| `root`                   | `Element \| null`    | `null`            | Root element for IntersectionObserver |
| `threshold`              | `number`             | `0`               | Visibility threshold |
| `duration`               | `number`             | `5`               | Scroll duration (in seconds) |
| `imageWidth`             | `string`             | `"200px"`         | Width of logo/image |
| `imageHeight`            | `string`             | `"auto"`          | Height of logo/image |
| `imageGap`               | `number`             | `0`               | Gap between logos (in px) |
| `stopOnHover`            | `boolean`            | `false`           | Pauses animation on hover |
| `useIntersectionObserver`| `boolean`            | `true`            | Initializes carousel only when in viewport |


