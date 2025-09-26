import React, { useEffect, useState, useRef, useCallback, useLayoutEffect } from 'react'
import ReactDOM from 'react-dom'

export interface MagicPortalProps {
  anchor: string | (() => Element | null) | Element | React.RefObject<Element | null> | null
  position?: 'append' | 'prepend' | 'before' | 'after'
  children?: React.ReactElement | React.ReactElement[]
  onMount?: (anchor: Element, container: Element) => void
  onUnmount?: (anchor: Element, container: Element) => void
  key?: React.Key
}

/**
 * https://github.com/radix-ui/primitives/blob/36d954d3c1b41c96b1d2e875b93fc9362c8c09e6/packages/react/slot/src/slot.tsx#L166
 */
const getElementRef = (element: React.ReactElement) => {
  // React <=18 in DEV
  let getter = Object.getOwnPropertyDescriptor(element.props, 'ref')?.get
  let mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return (element as any).ref as React.Ref<Element>
  }
  // React 19 in DEV
  getter = Object.getOwnPropertyDescriptor(element, 'ref')?.get
  mayWarn = getter && 'isReactWarning' in getter && getter.isReactWarning
  if (mayWarn) {
    return (element.props as { ref?: React.Ref<Element> }).ref
  }

  // Not DEV
  return (element.props as { ref?: React.Ref<Element> }).ref || ((element as any).ref as React.Ref<Element>)
}

const resolveAnchor = (anchor: MagicPortalProps['anchor']) => {
  if (typeof anchor === 'string') {
    return document.querySelector(anchor)
  } else if (typeof anchor === 'function') {
    return anchor()
  } else if (anchor && 'current' in anchor) {
    return anchor.current
  } else {
    return anchor
  }
}

const mergeRef = <T extends Element | null>(...refs: (React.Ref<T> | undefined)[]) => {
  return (node: T) =>
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    })
}

const MagicPortal = ({ anchor, position = 'append', children, onMount, onUnmount, key }: MagicPortalProps) => {
  const anchorRef = useRef<Element | null>(null)
  const [container, setContainer] = useState<Element | null>(null)

  const nodes = React.Children.map(children, (item) => {
    if (!React.isValidElement(item)) {
      return null
    }
    const originalRef = getElementRef(item)
    return React.cloneElement(item as React.ReactElement<any>, {
      ref: mergeRef(originalRef, (node) => {
        const positionMap = {
          before: 'beforebegin',
          prepend: 'afterbegin',
          append: 'beforeend',
          after: 'afterend'
        } as const
        node && anchorRef.current?.insertAdjacentElement(positionMap[position], node)
      })
    })
  })

  const update = useCallback(() => {
    anchorRef.current = resolveAnchor(anchor)
    setContainer(
      position === 'prepend' || position === 'append' ? anchorRef.current : (anchorRef.current?.parentElement ?? null)
    )
  }, [anchor, position])

  useLayoutEffect(() => {
    update()

    const observer = new MutationObserver((mutations) => {
      const isSelfMutation = mutations
        .flatMap(({ addedNodes, removedNodes }) => [...addedNodes, ...removedNodes])
        .some((node) => container?.contains(node))
      !isSelfMutation && update()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    return () => observer.disconnect()
  }, [update, anchor, container])

  useEffect(() => {
    if (container && anchorRef.current) {
      onMount?.(anchorRef.current, container)
      return () => {
        onUnmount?.(anchorRef.current!, container)
      }
    }
  }, [onMount, onUnmount, container])

  return container && ReactDOM.createPortal(nodes, container, key)
}

MagicPortal.displayName = 'MagicPortal'

export default MagicPortal
