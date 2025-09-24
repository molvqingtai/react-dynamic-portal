import React, { useEffect, useState, useRef, useCallback } from 'react'
import ReactDOM from 'react-dom'

export interface MagicPortalProps {
  anchor: string | (() => Element | null) | Element | React.RefObject<Element | null> | null
  position?: 'append' | 'prepend' | 'before' | 'after'
  children: React.ReactNode
  onMount?: (anchor: Element, container: HTMLDivElement) => void
  onUnmount?: (anchor: Element, container: HTMLDivElement) => void
  ref?: React.Ref<HTMLDivElement | null>
  key?: React.Key
}

const MagicPortal = ({ anchor, position = 'append', children, onMount, onUnmount, ref, key }: MagicPortalProps) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const anchorRef = useRef<Element | null>(null)

  const updateRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(element)
        } else {
          ref.current = element
        }
      }
    },
    [ref]
  )

  const createContainer = useCallback(
    (anchorElement: Element): HTMLDivElement | null => {
      const container = document.createElement('div')
      container.style = 'display: contents !important;'

      const positionMap = {
        before: 'beforebegin',
        prepend: 'afterbegin',
        append: 'beforeend',
        after: 'afterend'
      } as const

      const result = anchorElement.insertAdjacentElement(positionMap[position], container)

      return result as HTMLDivElement | null
    },
    [position]
  )

  const resolveAnchor = useCallback((): Element | null => {
    if (typeof anchor === 'string') {
      return document.querySelector(anchor)
    } else if (typeof anchor === 'function') {
      return anchor()
    } else if (anchor && 'current' in anchor) {
      return anchor.current
    } else {
      return anchor
    }
  }, [anchor])

  const updateAnchor = useCallback(() => {
    const newAnchor = resolveAnchor()

    setContainer((prevContainer) => {
      prevContainer?.remove()
      anchorRef.current = newAnchor
      const newContainer = newAnchor ? createContainer(newAnchor) : null
      updateRef(newContainer)
      return newContainer
    })
  }, [resolveAnchor, createContainer, updateRef])

  useEffect(() => {
    updateAnchor()

    const observer = new MutationObserver((mutations) => {
      const shouldUpdate = mutations.some((mutation) => {
        const { addedNodes, removedNodes } = mutation

        // Check if current anchor is removed
        if (anchorRef.current && Array.from(removedNodes).includes(anchorRef.current)) {
          return true
        }

        // Only check added nodes when anchor is a string selector
        if (typeof anchor === 'string') {
          return Array.from(addedNodes).some(
            (node) => node.nodeType === Node.ELEMENT_NODE && node instanceof Element && node.matches?.(anchor)
          )
        }

        return false
      })

      if (shouldUpdate) {
        updateAnchor()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => observer.disconnect()
  }, [updateAnchor, anchor])

  useEffect(() => {
    if (anchorRef.current && container) {
      onMount?.(anchorRef.current, container)
      return () => {
        onUnmount?.(anchorRef.current!, container)
      }
    }
  }, [container, onMount, onUnmount])

  return container ? ReactDOM.createPortal(children, container, key) : null
}

MagicPortal.displayName = 'MagicPortal'

export default MagicPortal
