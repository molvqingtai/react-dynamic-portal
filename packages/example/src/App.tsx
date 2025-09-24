import { useState } from 'react'
import DynamicPortal from 'react-dynamic-portal'
import PortalContent from './components/portal-content'
import './App.css'

function App() {
  const [showAnchor, setShowAnchor] = useState(false)

  const handleMount = (anchor: Element, portal: HTMLElement) => {
    console.log('Portal mounted:', { anchor, portal })
  }

  const handleUnmount = (anchor: Element, portal: HTMLElement) => {
    console.log('Portal unmounted:', { anchor, portal })
  }

  return (
    <div className="app">
      <h1>DynamicPortal Example</h1>

      <h2>Target Anchor</h2>
      <div className="portal-preview">
        {showAnchor && (
          <div className="dynamic-anchor" id="dynamic-anchor">
            Target Content
          </div>
        )}
      </div>
      <div className="controls">
        <button onClick={() => setShowAnchor(!showAnchor)}>{showAnchor ? 'Hide Anchor' : 'Show Anchor'}</button>
      </div>

      {/* Target anchor examples */}
      <DynamicPortal anchor="#dynamic-anchor" position="append" onMount={handleMount} onUnmount={handleUnmount}>
        <PortalContent position="append" />
      </DynamicPortal>

      <DynamicPortal anchor="#dynamic-anchor" position="prepend" onMount={handleMount} onUnmount={handleUnmount}>
        <PortalContent position="prepend" />
      </DynamicPortal>

      <DynamicPortal anchor="#dynamic-anchor" position="before" onMount={handleMount} onUnmount={handleUnmount}>
        <PortalContent position="before" />
      </DynamicPortal>

      <DynamicPortal anchor="#dynamic-anchor" position="after" onMount={handleMount} onUnmount={handleUnmount}>
        <PortalContent position="after" />
      </DynamicPortal>

      <h2>Instructions</h2>
      <div className="instructions">
        <ul>
          <li>
            <strong>append</strong>: Adds content inside the anchor element at the end
          </li>
          <li>
            <strong>prepend</strong>: Adds content inside the anchor element at the beginning
          </li>
          <li>
            <strong>before</strong>: Adds content as a sibling before the target anchor
          </li>
          <li>
            <strong>after</strong>: Adds content as a sibling after the target anchor
          </li>
        </ul>

        <p>
          <strong>💡 Key Feature:</strong> Notice how DynamicPortal automatically detects when the target anchor appears
          or disappears. When you toggle the anchor visibility, the portal content automatically mounts and unmounts
          without any manual intervention.
        </p>

        <p>
          Open the browser console to see mount/unmount events. Try toggling the target anchor visibility to see how
          DynamicPortal responds to DOM changes in real-time.
        </p>
      </div>
    </div>
  )
}

export default App
