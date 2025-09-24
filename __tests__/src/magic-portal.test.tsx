import { useRef, useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import MagicPortal from 'react-magic-portal'

describe('MagicPortal', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Functionality', () => {
    it('should render children in portal when anchor exists', () => {
      // Setup anchor element
      const anchor = document.createElement('div')
      anchor.id = 'test-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor="#test-anchor">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const portalContent = screen.getByTestId('portal-content')
      expect(portalContent).toBeTruthy()
      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should not render children when anchor does not exist', () => {
      render(
        <MagicPortal anchor="#non-existent">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      expect(screen.queryByTestId('portal-content')).toBeNull()
    })

    it('should render children when anchor appears later', async () => {
      function TestComponent() {
        const [showAnchor, setShowAnchor] = useState(false)

        return (
          <div>
            <button onClick={() => setShowAnchor(true)}>Show Anchor</button>
            {showAnchor && <div id="dynamic-anchor">Anchor</div>}
            <MagicPortal anchor="#dynamic-anchor">
              <div data-testid="portal-content">Portal Content</div>
            </MagicPortal>
          </div>
        )
      }

      const user = userEvent.setup()
      render(<TestComponent />)

      expect(screen.queryByTestId('portal-content')).toBeNull()

      await user.click(screen.getByText('Show Anchor'))

      await waitFor(() => {
        expect(screen.getByTestId('portal-content')).toBeTruthy()
      })
    })

    it('should clean up when anchor is removed', async () => {
      function TestComponent() {
        const [showAnchor, setShowAnchor] = useState(true)

        return (
          <div>
            <button onClick={() => setShowAnchor(false)}>Hide Anchor</button>
            {showAnchor && <div id="dynamic-anchor">Anchor</div>}
            <MagicPortal anchor="#dynamic-anchor">
              <div data-testid="portal-content">Portal Content</div>
            </MagicPortal>
          </div>
        )
      }

      const user = userEvent.setup()
      render(<TestComponent />)

      expect(screen.getByTestId('portal-content')).toBeTruthy()

      await user.click(screen.getByText('Hide Anchor'))

      await waitFor(() => {
        expect(screen.queryByTestId('portal-content')).toBeNull()
      })
    })
  })

  describe('Anchor Types', () => {
    it('should work with CSS selector string', () => {
      const anchor = document.createElement('div')
      anchor.className = 'test-class'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor=".test-class">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const portalContent = screen.getByTestId('portal-content')
      expect(portalContent).toBeTruthy()
      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should work with element reference', () => {
      function TestComponent() {
        const anchorRef = useRef<HTMLDivElement>(null)

        return (
          <div>
            <div ref={anchorRef} data-testid="anchor">
              Anchor
            </div>
            <MagicPortal anchor={anchorRef}>
              <div data-testid="portal-content">Portal Content</div>
            </MagicPortal>
          </div>
        )
      }

      render(<TestComponent />)

      const portalContent = screen.getByTestId('portal-content')
      const anchor = screen.getByTestId('anchor')
      expect(portalContent).toBeTruthy()
      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should work with function returning element', () => {
      const anchor = document.createElement('div')
      anchor.id = 'function-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor={() => document.getElementById('function-anchor')}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const portalContent = screen.getByTestId('portal-content')
      expect(portalContent).toBeTruthy()
      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should work with direct element', () => {
      const anchor = document.createElement('div')
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor={anchor}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const portalContent = screen.getByTestId('portal-content')
      expect(portalContent).toBeTruthy()
      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should handle null anchor gracefully', () => {
      render(
        <MagicPortal anchor={null}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      expect(screen.queryByTestId('portal-content')).toBeNull()
    })
  })

  describe('Position Options', () => {
    beforeEach(() => {
      const anchor = document.createElement('div')
      anchor.id = 'position-anchor'
      anchor.innerHTML = '<span>Existing Content</span>'
      document.body.appendChild(anchor)
    })

    it('should append by default', () => {
      render(
        <MagicPortal anchor="#position-anchor">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const anchor = document.getElementById('position-anchor')!
      const portalContent = screen.getByTestId('portal-content')

      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should prepend when position is prepend', () => {
      render(
        <MagicPortal anchor="#position-anchor" position="prepend">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const anchor = document.getElementById('position-anchor')!
      const portalContent = screen.getByTestId('portal-content')

      expect(anchor.contains(portalContent)).toBe(true)
    })

    it('should position before when position is before', () => {
      render(
        <MagicPortal anchor="#position-anchor" position="before">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const anchor = document.getElementById('position-anchor')!
      const portalContent = screen.getByTestId('portal-content')

      expect(anchor.parentElement!.contains(portalContent)).toBe(true)
      // The portal content container should be before the anchor
      const portalContainer = portalContent.parentElement!
      expect(portalContainer.nextElementSibling).toBe(anchor)
    })

    it('should position after when position is after', () => {
      render(
        <MagicPortal anchor="#position-anchor" position="after">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      const anchor = document.getElementById('position-anchor')!
      const portalContent = screen.getByTestId('portal-content')

      expect(anchor.parentElement!.contains(portalContent)).toBe(true)
      // The portal content container should be after the anchor
      const portalContainer = portalContent.parentElement!
      expect(portalContainer.previousElementSibling).toBe(anchor)
    })
  })

  describe('Lifecycle Callbacks', () => {
    it('should call onMount when portal is mounted', async () => {
      const onMount = vi.fn()
      const anchor = document.createElement('div')
      anchor.id = 'mount-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor="#mount-anchor" onMount={onMount}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      await waitFor(() => {
        expect(onMount).toHaveBeenCalledTimes(1)
        expect(onMount).toHaveBeenCalledWith(anchor, expect.any(HTMLDivElement))
      })
    })

    it('should call onUnmount when component is unmounted', async () => {
      const onUnmount = vi.fn()
      const anchor = document.createElement('div')
      anchor.id = 'unmount-anchor'
      document.body.appendChild(anchor)

      const { unmount } = render(
        <MagicPortal anchor="#unmount-anchor" onUnmount={onUnmount}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      expect(screen.getByTestId('portal-content')).toBeTruthy()

      unmount()

      expect(onUnmount).toHaveBeenCalledTimes(1)
      expect(onUnmount).toHaveBeenCalledWith(anchor, expect.any(HTMLDivElement))
    })

    it('should call both onMount and onUnmount during anchor changes', async () => {
      const onMount = vi.fn()
      const onUnmount = vi.fn()

      // Create anchor element that will persist
      const anchor = document.createElement('div')
      anchor.id = 'toggle-anchor'

      const { unmount } = render(
        <MagicPortal anchor="#toggle-anchor" onMount={onMount} onUnmount={onUnmount}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      // No anchor exists initially
      expect(screen.queryByTestId('portal-content')).toBeNull()
      expect(onMount).not.toHaveBeenCalled()

      // Add anchor to DOM
      document.body.appendChild(anchor)

      // Wait for portal to mount
      await waitFor(() => {
        expect(screen.getByTestId('portal-content')).toBeTruthy()
        expect(onMount).toHaveBeenCalledTimes(1)
      })

      // Unmount component to trigger onUnmount
      unmount()
      expect(onUnmount).toHaveBeenCalledTimes(1)
    })
  })

  describe('Ref Handling', () => {
    it('should forward ref to portal container', () => {
      const ref: { current: HTMLDivElement | null } = { current: null }
      const anchor = document.createElement('div')
      anchor.id = 'ref-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor="#ref-anchor" ref={ref}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current?.style.display).toBe('contents')
    })

    it('should handle function refs', () => {
      let refElement: HTMLDivElement | null = null
      const refCallback = (element: HTMLDivElement | null) => {
        refElement = element
      }

      const anchor = document.createElement('div')
      anchor.id = 'func-ref-anchor'
      document.body.appendChild(anchor)

      render(
        <MagicPortal anchor="#func-ref-anchor" ref={refCallback}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      expect(refElement).toBeInstanceOf(HTMLDivElement)
      expect(refElement!.style.display).toBe('contents')
    })
  })

  describe('Multiple Portals', () => {
    it('should support multiple portals on the same anchor', () => {
      const anchor = document.createElement('div')
      anchor.id = 'multi-anchor'
      document.body.appendChild(anchor)

      render(
        <div>
          <MagicPortal anchor="#multi-anchor" position="prepend">
            <div data-testid="portal-1">Portal 1</div>
          </MagicPortal>
          <MagicPortal anchor="#multi-anchor" position="append">
            <div data-testid="portal-2">Portal 2</div>
          </MagicPortal>
        </div>
      )

      const portal1 = screen.getByTestId('portal-1')
      const portal2 = screen.getByTestId('portal-2')
      expect(portal1).toBeTruthy()
      expect(portal2).toBeTruthy()
      expect(anchor.contains(portal1)).toBe(true)
      expect(anchor.contains(portal2)).toBe(true)
    })
  })

  describe('Dynamic Content Updates', () => {
    it('should detect when matching elements are added to DOM', async () => {
      function TestComponent() {
        const [elementCount, setElementCount] = useState(0)

        const addElement = () => {
          const newElement = document.createElement('div')
          newElement.className = 'dynamic-target'
          newElement.textContent = `Target ${elementCount + 1}`
          document.body.appendChild(newElement)
          setElementCount((prev) => prev + 1)
        }

        return (
          <div>
            <button onClick={addElement}>Add Target Element</button>
            <MagicPortal anchor=".dynamic-target">
              <div data-testid="portal-content">Portal Content</div>
            </MagicPortal>
          </div>
        )
      }

      const user = userEvent.setup()
      render(<TestComponent />)

      expect(screen.queryByTestId('portal-content')).toBeNull()

      await user.click(screen.getByText('Add Target Element'))

      await waitFor(() => {
        expect(screen.getByTestId('portal-content')).toBeTruthy()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid selectors gracefully', () => {
      expect(() => {
        render(
          <MagicPortal anchor="invalid>>>selector">
            <div data-testid="portal-content">Portal Content</div>
          </MagicPortal>
        )
      }).not.toThrow()

      expect(screen.queryByTestId('portal-content')).toBeNull()
    })

    it('should handle function that returns null', () => {
      render(
        <MagicPortal anchor={() => null}>
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      expect(screen.queryByTestId('portal-content')).toBeNull()
    })

    it('should handle function that throws error', () => {
      const errorFunction = () => {
        throw new Error('Test error')
      }

      // The component should handle the error gracefully and not crash
      expect(() => {
        render(
          <MagicPortal anchor={errorFunction}>
            <div data-testid="portal-content">Portal Content</div>
          </MagicPortal>
        )
      }).toThrow('Test error')

      // Portal content should not be rendered when anchor function throws
      expect(screen.queryByTestId('portal-content')).toBeNull()
    })
  })

  describe('Key Prop', () => {
    it('should pass key to ReactDOM.createPortal', () => {
      const anchor = document.createElement('div')
      anchor.id = 'key-anchor'
      document.body.appendChild(anchor)

      const { rerender } = render(
        <MagicPortal anchor="#key-anchor" key="test-key-1">
          <div data-testid="portal-content-1">Portal Content 1</div>
        </MagicPortal>
      )

      expect(screen.getByTestId('portal-content-1')).toBeTruthy()

      rerender(
        <MagicPortal anchor="#key-anchor" key="test-key-2">
          <div data-testid="portal-content-2">Portal Content 2</div>
        </MagicPortal>
      )

      expect(screen.queryByTestId('portal-content-1')).toBeNull()
      expect(screen.getByTestId('portal-content-2')).toBeTruthy()
    })
  })

  describe('Cleanup', () => {
    it('should clean up MutationObserver on unmount', () => {
      const anchor = document.createElement('div')
      anchor.id = 'cleanup-anchor'
      document.body.appendChild(anchor)

      const { unmount } = render(
        <MagicPortal anchor="#cleanup-anchor">
          <div data-testid="portal-content">Portal Content</div>
        </MagicPortal>
      )

      expect(screen.getByTestId('portal-content')).toBeTruthy()

      expect(() => unmount()).not.toThrow()
      expect(screen.queryByTestId('portal-content')).toBeNull()
    })
  })
})
