# React Magic Portal

A React component designed for browser extension development that provides dynamic portal functionality with automatic anchor detection and DOM mutation monitoring.

[![version](https://img.shields.io/github/v/release/molvqingtai/react-magic-portal)](https://www.npmjs.com/package/react-magic-portal) [![workflow](https://github.com/molvqingtai/react-magic-portal/actions/workflows/ci.yml/badge.svg)](https://github.com/molvqingtai/react-magic-portal/actions) [![download](https://img.shields.io/npm/dt/react-magic-portal)](https://www.npmjs.com/package/react-magic-portal) [![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/react-magic-portal)](https://www.npmjs.com/package/react-magic-portal) [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/molvqingtai/react-magic-portal)

```bash
$ pnpm add react-magic-portal
```

## Introduction

When developing browser extensions with React, you often need to inject React components into host web pages. However, the target mounting points in these pages are frequently dynamic - they may not exist when your extension loads, or they might be created and destroyed as users navigate and interact with the page.

Traditional React portals require the target DOM element to exist before rendering, which creates challenges in browser extension scenarios where:

- **Host pages load content dynamically** - Target elements appear after AJAX requests, user interactions, or page navigation
- **Single Page Applications (SPAs)** - Content changes without full page reloads, causing mounting points to appear and disappear
- **Dynamic DOM manipulation** - Third-party scripts or frameworks modify the DOM structure continuously
- **Uncertain timing** - You can't predict when or if target elements will be available

React Magic Portal solves these challenges by automatically detecting when target elements appear or disappear in the DOM, ensuring your React components are always rendered in the right place at the right time.

## Features

- **Dynamic Anchor Detection** - Automatically detects when target elements appear or disappear in the DOM
- **Multiple Positioning Options** - Support for `append`, `prepend`, `before`, and `after` positioning
- **Flexible Anchor Selection** - Support for CSS selectors, element references, functions, and direct elements
- **Lifecycle Callbacks** - `onMount` and `onUnmount` callbacks for portal lifecycle management
- **TypeScript Support** - Full TypeScript support with comprehensive type definitions

## Usage

### Dynamic Content Loading

```jsx
function DynamicContent() {
  const [showTarget, setShowTarget] = useState(false)

  return (
    <div>
      <button onClick={() => setShowTarget(!showTarget)}>Toggle Target</button>

      {showTarget && <div id="dynamic-target">Dynamic Target Element</div>}

      {/* Portal will automatically mount/unmount based on target availability */}
      <MagicPortal
        anchor="#dynamic-target"
        onMount={() => console.log('Portal mounted')}
        onUnmount={() => console.log('Portal unmounted')}
      >
        <div>This content follows the target element</div>
      </MagicPortal>
    </div>
  )
}
```

### Multiple Portals on Same Anchor

```jsx
function MultiplePortals() {
  return (
    <div>
      <div id="target">Target Element</div>

      <MagicPortal anchor="#target" position="before">
        <div>Content before target</div>
      </MagicPortal>

      <MagicPortal anchor="#target" position="prepend">
        <div>Content at start of target</div>
      </MagicPortal>

      <MagicPortal anchor="#target" position="append">
        <div>Content at end of target</div>
      </MagicPortal>

      <MagicPortal anchor="#target" position="after">
        <div>Content after target</div>
      </MagicPortal>
    </div>
  )
}
```

## API Reference

### Props

| Prop        | Type                                                                                       | Default      | Description                                                  |
| ----------- | ------------------------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------ |
| `anchor`    | `string \| (() => Element \| null) \| Element \| React.RefObject<Element \| null> \| null` | **Required** | The target element where the portal content will be rendered |
| `position`  | `'append' \| 'prepend' \| 'before' \| 'after'`                                             | `'append'`   | Position relative to the anchor element                      |
| `children`  | `React.ReactNode`                                                                          | **Required** | The content to render in the portal                          |
| `onMount`   | `(anchor: Element, container: HTMLDivElement) => void`                                     | `undefined`  | Callback fired when the portal is mounted                    |
| `onUnmount` | `(anchor: Element, container: HTMLDivElement) => void`                                     | `undefined`  | Callback fired when the portal is unmounted                  |
| `ref`       | `React.Ref<HTMLDivElement \| null>`                                                        | `undefined`  | Ref to the portal container element                          |
| `key`       | `React.Key`                                                                                | `undefined`  | Key for the ReactDOM.createPortal                            |

### Anchor Types

#### CSS Selector String

```jsx
<MagicPortal anchor="#my-element">
  <div>Content</div>
</MagicPortal>

<MagicPortal anchor=".my-class">
  <div>Content</div>
</MagicPortal>
```

#### Element Reference

```jsx
const elementRef = useRef(null)

<div ref={elementRef}>Target</div>
<MagicPortal anchor={elementRef}>
  <div>Content</div>
</MagicPortal>
```

#### Function

```jsx
<MagicPortal anchor={() => document.querySelector('.dynamic-element')}>
  <div>Content</div>
</MagicPortal>
```

#### Direct Element

```jsx
<MagicPortal anchor={document.body}>
  <div>Content</div>
</MagicPortal>
```

### Position Options

#### `append` (default)

Adds content inside the anchor element at the end:

```html
<div id="anchor">
  Existing content
  <!-- Portal content appears here -->
</div>
```

#### `prepend`

Adds content inside the anchor element at the beginning:

```html
<div id="anchor">
  <!-- Portal content appears here -->
  Existing content
</div>
```

#### `before`

Adds content as a sibling before the anchor element:

```html
<!-- Portal content appears here -->
<div id="anchor">Existing content</div>
```

#### `after`

Adds content as a sibling after the anchor element:

```html
<div id="anchor">Existing content</div>
<!-- Portal content appears here -->
```

## License

MIT © [molvqingtai](https://github.com/molvqingtai)
