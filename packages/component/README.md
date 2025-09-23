# DynamicPortal

A flexible React component that extends the functionality of React's built-in Portal with dynamic anchor points and multiple positioning modes.

## Features

- 🎯 **Dynamic Anchors**: Support for CSS selectors, DOM elements, and functions that return elements
- 📍 **Flexible Positioning**: Four positioning modes - `append`, `prepend`, `before`, and `after`
- 🔄 **Real-time Updates**: Automatically responds to DOM changes and anchor updates
- 🎣 **Lifecycle Hooks**: Mount and unmount callbacks for custom behavior
- 📦 **TypeScript Support**: Full TypeScript definitions included
- 🪶 **Lightweight**: Minimal bundle size with no external dependencies

## Installation

```bash
npm install @react-dynamic-portal/component
# or
yarn add @react-dynamic-portal/component
# or
pnpm add @react-dynamic-portal/component
```

## Basic Usage

```tsx
import React from 'react';
import { DynamicPortal } from '@react-dynamic-portal/component';

function App() {
  return (
    <div>
      <div id="target">Target Element</div>
      
      <DynamicPortal anchor="#target" position="append">
        <div>This content will be rendered inside the target element</div>
      </DynamicPortal>
    </div>
  );
}
```

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `anchor` | `string \| Element \| (() => Element \| null) \| null` | **Required** | The target element where the portal content will be rendered |
| `position` | `'append' \| 'prepend' \| 'before' \| 'after'` | `'append'` | How the content should be positioned relative to the anchor |
| `children` | `React.ReactNode` | **Required** | The content to render in the portal |
| `onMount` | `(anchor: Element, portal: HTMLElement) => void` | `undefined` | Callback fired when the portal is mounted |
| `onUnmount` | `(anchor: Element, portal: HTMLElement) => void` | `undefined` | Callback fired when the portal is unmounted |
| `ref` | `Ref<Element \| null>` | `undefined` | Ref to the portal container element (only set when successfully inserted) |

### Positioning Modes

#### `append` (default)
Adds content **inside** the anchor element at the **end** (as the last child).

```tsx
<DynamicPortal anchor="#target" position="append">
  <span>Appended content</span>
</DynamicPortal>

// Result:
// <div id="target">
//   Existing content...
//   <div><span>Appended content</span></div>  <!-- Added here -->
// </div>
```

#### `prepend`
Adds content **inside** the anchor element at the **beginning** (as the first child).

```tsx
<DynamicPortal anchor="#target" position="prepend">
  <span>Prepended content</span>
</DynamicPortal>

// Result:
// <div id="target">
//   <div><span>Prepended content</span></div>  <!-- Added here -->
//   Existing content...
// </div>
```

#### `before`
Adds content as a **sibling** element **before** the anchor.

**Note**: If the anchor element has no parent node, the portal will not render.

```tsx
<DynamicPortal anchor="#target" position="before">
  <span>Before content</span>
</DynamicPortal>

// Result:
// <div class="parent">
//   <div><span>Before content</span></div>  <!-- Added here -->
//   <div id="target">Target content</div>
// </div>
```

#### `after`
Adds content as a **sibling** element **after** the anchor.

**Note**: If the anchor element has no parent node, the portal will not render.

```tsx
<DynamicPortal anchor="#target" position="after">
  <span>After content</span>
</DynamicPortal>

// Result:
// <div class="parent">
//   <div id="target">Target content</div>
//   <div><span>After content</span></div>  <!-- Added here -->
// </div>
```

## Advanced Usage

### CSS Selector Anchor

```tsx
<DynamicPortal anchor=".my-class" position="append">
  <div>Content for elements with class "my-class"</div>
</DynamicPortal>
```

### Function Anchor

```tsx
<DynamicPortal 
  anchor={() => document.getElementById('dynamic-target')} 
  position="before"
>
  <div>Dynamic anchor content</div>
</DynamicPortal>
```

### Element Anchor with Ref

```tsx
function MyComponent() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  return (
    <>
      <div ref={targetRef}>Target Element</div>
      
      <DynamicPortal anchor={targetRef.current} position="after">
        <div>Content positioned after the ref element</div>
      </DynamicPortal>
    </>
  );
}
```

### SVG Element Anchor

```tsx
function SVGExample() {
  return (
    <>
      <svg width="200" height="100">
        <rect width="180" height="80" x="10" y="10" fill="#f0f0f0" />
        <text x="100" y="55" textAnchor="middle">SVG Element</text>
      </svg>
      
      <DynamicPortal anchor="svg rect" position="before">
        <text x="100" y="30" textAnchor="middle" fill="red">
          Portal in SVG!
        </text>
      </DynamicPortal>
    </>
  );
}
```

### With Lifecycle Callbacks

```tsx
<DynamicPortal
  anchor="#target"
  position="append"
  onMount={(anchor, portal) => {
    console.log('Portal mounted!', { anchor, portal });
    // Add custom classes, event listeners, etc.
  }}
  onUnmount={(anchor, portal) => {
    console.log('Portal unmounted!', { anchor, portal });
    // Cleanup logic
  }}
>
  <div>Content with lifecycle hooks</div>
</DynamicPortal>
```

### Dynamic Anchor Changes

The portal automatically responds to changes in the anchor:

```tsx
function DynamicExample() {
  const [targetId, setTargetId] = useState('target1');
  const [asyncElement, setAsyncElement] = useState(null);
  
  // Simulate async loading (API response, lazy component, etc.)
  const loadAsyncElement = () => {
    setTimeout(() => {
      const element = document.createElement('div');
      element.id = 'async-target';
      document.body.appendChild(element);
      setAsyncElement(element);
    }, 2000);
  };
  
  return (
    <>
      <div id="target1">Target 1</div>
      <div id="target2">Target 2</div>
      
      <button onClick={() => setTargetId(targetId === 'target1' ? 'target2' : 'target1')}>
        Switch Target
      </button>
      <button onClick={loadAsyncElement}>Load Async Target</button>
      
      {/* No need to check if anchor exists - component handles it internally */}
      <DynamicPortal anchor={`#${targetId}`} position="append">
        <div>This content will move when the target changes!</div>
      </DynamicPortal>
      
      {/* Works even when asyncElement is initially null */}
      <DynamicPortal anchor={asyncElement} position="append">
        <div>This appears when async element loads!</div>
      </DynamicPortal>
    </>
  );
}
```

## TypeScript

The component is fully typed and exports its prop types:

```tsx
import { DynamicPortal, DynamicPortalProps } from '@react-dynamic-portal/component';

// Use DynamicPortalProps for typing
const MyWrapper: React.FC<DynamicPortalProps> = (props) => {
  return <DynamicPortal {...props} />;
};
```

## Comparison with React Portal

| Feature | React Portal | DynamicPortal |
|---------|--------------|---------------|
| Static anchor | ✅ | ✅ |
| Dynamic anchor | ❌ | ✅ |
| CSS selector anchor | ❌ | ✅ |
| Function anchor | ❌ | ✅ |
| Position inside (append/prepend) | ✅ | ✅ |
| Position outside (before/after) | ❌ | ✅ |
| Auto DOM change detection | ❌ | ✅ |
| Lifecycle callbacks | ❌ | ✅ |

## Element Type Support

DynamicPortal supports all DOM elements, including:

- **HTML Elements** - `div`, `span`, `p`, etc.
- **SVG Elements** - `svg`, `circle`, `rect`, `path`, etc.
- **Web Components** - Custom elements
- **Any Element** - Anything that extends the DOM `Element` interface

This makes it more flexible than solutions limited to HTML elements only.

## Dynamic Behavior - No Manual Checks Required

One of the key benefits of DynamicPortal is that you **don't need to manually check** if anchors exist:

```tsx
function App() {
  const [dynamicAnchor, setDynamicAnchor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // ❌ Don't do this - unnecessary manual checking
  {dynamicAnchor && (
    <DynamicPortal anchor={dynamicAnchor} position="append">
      <div>Content</div>
    </DynamicPortal>
  )}
  
  // ✅ Do this - let the component handle it
  <DynamicPortal anchor={dynamicAnchor} position="append">
    <div>Content appears automatically when anchor is available</div>
  </DynamicPortal>
  
  // ✅ Works great for async scenarios
  <DynamicPortal anchor="#lazy-loaded-component" position="before">
    <div>Waits for lazy component to load</div>
  </DynamicPortal>
}
```

**Real-world scenarios where this is useful:**
- **Lazy-loaded components** - Portal waits for component to render
- **API responses** - Content appears when data loads and creates DOM elements  
- **Conditional rendering** - No need to sync portal visibility with anchor visibility
- **Dynamic imports** - Works seamlessly with code-splitting

## Special Cases

### Anchor Without Parent Node

For `before` and `after` positions, if the anchor element has no parent node (i.e., not attached to the DOM tree), the portal will not render:

```tsx
const detachedElement = document.createElement('div');

// This will not render anything
<DynamicPortal anchor={detachedElement} position="before">
  <div>This won't appear</div>
</DynamicPortal>

// This will work fine
<DynamicPortal anchor={detachedElement} position="append">
  <div>This will appear inside the detached element</div>
</DynamicPortal>
```

This behavior ensures that the component doesn't attempt invalid DOM operations when the anchor lacks the necessary parent context for sibling positioning.

### Ref Behavior

The `ref` prop will only be set when the portal container is successfully inserted into the DOM:

```tsx
function RefExample() {
  const portalRef = useRef<Element>(null);
  
  useEffect(() => {
    if (portalRef.current) {
      // Safe to perform DOM operations - element is definitely in the DOM
      const rect = portalRef.current.getBoundingClientRect();
      console.log('Portal container position:', rect);
    }
  }, []);

  return (
    <>
      <div id="target">Target</div>
      
      {/* Ref will be set since this will succeed */}
      <DynamicPortal ref={portalRef} anchor="#target" position="append">
        <div>Content</div>
      </DynamicPortal>
      
      {/* Ref will NOT be set if anchor has no parent and position is before/after */}
      <DynamicPortal ref={portalRef} anchor={detachedElement} position="before">
        <div>This won't set the ref</div>
      </DynamicPortal>
    </>
  );
}
```

**Benefits of this approach:**
- **Safe DOM operations**: If `ref.current` exists, the element is guaranteed to be in the DOM
- **Consistent with React patterns**: Similar to conditional rendering where hidden components have `null` refs
- **Prevents confusion**: Avoids references to "detached" elements that aren't actually positioned correctly

## Browser Support

- Modern browsers with ES2015+ support
- React 18.0.0 or later
- ReactDOM 18.0.0 or later

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [molvqingtai](https://github.com/molvqingtai)