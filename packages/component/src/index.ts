import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";

export interface DynamicPortalProps {
  anchor:
    | string
    | (() => Element | null)
    | Element
    | null
    | React.RefObject<Element>;
  position?: "append" | "prepend" | "before" | "after";
  children: React.ReactNode;
  onMount?: (anchor: Element, portal: HTMLDivElement) => void;
  onUnmount?: (anchor: Element, portal: HTMLDivElement) => void;
  ref?: React.Ref<HTMLDivElement | null>;
  key?: React.Key;
}

const DynamicPortal = ({
  anchor,
  position = "append",
  children,
  onMount,
  onUnmount,
  ref: forwardedRef,
  key,
}: DynamicPortalProps) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const currentAnchorRef = useRef<Element | null>(null);

  const createPortalContainer = useCallback(
    (anchorElement: Element): HTMLDivElement | null => {
      const portalContainer = document.createElement("div");
      portalContainer.style.display = "contents";

      const positionMap = {
        before: "beforebegin",
        prepend: "afterbegin",
        append: "beforeend",
        after: "afterend",
      } as const;

      const result = anchorElement.insertAdjacentElement(
        positionMap[position],
        portalContainer,
      );

      if (result && forwardedRef) {
        if (typeof forwardedRef === "function") {
          forwardedRef(portalContainer);
        } else {
          forwardedRef.current = portalContainer;
        }
      }

      return result as HTMLDivElement | null;
    },
    [position, forwardedRef],
  );

  const updateAnchor = useCallback(() => {
    let newAnchor: Element | null = null;

    if (typeof anchor === "string") {
      newAnchor = document.querySelector(anchor);
    } else if (typeof anchor === "function") {
      newAnchor = anchor();
    } else if (anchor && "current" in anchor) {
      newAnchor = anchor.current;
    } else {
      newAnchor = anchor;
    }

    if (newAnchor !== currentAnchorRef.current) {
      // 清理旧容器
      if (container) {
        container.remove();
        if (forwardedRef) {
          if (typeof forwardedRef === "function") {
            forwardedRef(null);
          } else {
            forwardedRef.current = null;
          }
        }
      }

      currentAnchorRef.current = newAnchor;
      setContainer(newAnchor ? createPortalContainer(newAnchor) : null);
    }
  }, [anchor, container, createPortalContainer, forwardedRef]);

  // 初始化和监听变化
  useEffect(() => {
    updateAnchor();

    const observer = new MutationObserver((mutations) => {
      const shouldUpdate = mutations.some((mutation) => {
        const { addedNodes, removedNodes } = mutation;

        // 检查当前 anchor 是否被删除
        if (
          currentAnchorRef.current &&
          Array.from(removedNodes).includes(currentAnchorRef.current)
        ) {
          return true;
        }

        // 只有当 anchor 是字符串选择器时，才检查新增节点
        if (typeof anchor === "string") {
          return Array.from(addedNodes).some(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              node instanceof Element &&
              node.matches?.(anchor),
          );
        }

        return false;
      });

      if (shouldUpdate) {
        updateAnchor();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [updateAnchor, anchor]);

  // 处理 mount/unmount 回调
  useEffect(() => {
    if (currentAnchorRef.current && container) {
      const portalElement = container;
      onMount?.(currentAnchorRef.current, portalElement);

      return () => {
        if (currentAnchorRef.current) {
          onUnmount?.(currentAnchorRef.current, portalElement);
        }
      };
    }
  }, [container, onMount, onUnmount]);

  // 清理容器
  useEffect(() => {
    return () => {
      if (container) {
        container.remove();
        if (forwardedRef) {
          if (typeof forwardedRef === "function") {
            forwardedRef(null);
          } else {
            forwardedRef.current = null;
          }
        }
      }
    };
  }, [container, forwardedRef]);

  if (!container) {
    return null;
  }

  return ReactDOM.createPortal(children, container, key);
};

DynamicPortal.displayName = "DynamicPortal";

export default DynamicPortal;
