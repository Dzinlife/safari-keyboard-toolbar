import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { debounce } from "lodash-es";

const EdgeBar: React.FC<{
  children: JSX.Element;
  toolbar?: JSX.Element;
  style?: React.CSSProperties;
  className?: string;
}> = (props) => {
  const [show, setShow] = useState(false);
  const [isFocused, setFocus] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const calcOffsetTop = () => {
    if (!window.visualViewport) return;
    const height = barRef.current?.offsetHeight || 0;

    const fix = window.visualViewport.pageTop - window.visualViewport.offsetTop;

    return Math.min(
      window.visualViewport.height - height + Math.max(window.scrollY, 0) - fix,
      window.outerHeight - height
    );
  };

  const [offsetTop, setOffsetTop] = useState(calcOffsetTop());

  useEffect(() => {
    if (!isFocused) return;

    const handler = () => {
      setOffsetTop(calcOffsetTop());
    };

    window.visualViewport?.addEventListener("resize", handler);

    return () => {
      window.visualViewport?.removeEventListener("resize", handler);
    };
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused) return;

    let isDragging = false;

    const startHandler = () => {
      setShow(false);

      isDragging = true;
      document.documentElement.addEventListener("touchend", endHandler);
    };

    const endHandler = () => {
      isDragging = false;
      trailing();
      document.documentElement.removeEventListener("touchend", endHandler);
    };

    document.documentElement.addEventListener("touchstart", startHandler);

    const trailing = debounce(
      () => {
        if (isDragging) return;
        setShow(true);

        setOffsetTop(calcOffsetTop());
      },
      100,
      {
        leading: false,
        trailing: true,
      }
    );

    const handler = () => {
      trailing();
    };

    window.addEventListener("scroll", handler);

    return () => {
      window.removeEventListener("scroll", handler);
      document.documentElement.removeEventListener("touchend", endHandler);
      document.documentElement.removeEventListener("touchstart", startHandler);
    };
  }, [isFocused]);

  return (
    <span
      onBlur={(e) => {
        setShow(false);
        setFocus(false);
      }}
      onFocus={() => {
        setFocus(true);
        setTimeout(() => {
          setShow(true);
        }, 500);
      }}
    >
      {props.children}
      {isFocused &&
        ReactDOM.createPortal(
          <div
            className={props.className}
            ref={barRef}
            onTouchEnd={(e) => {
              e.preventDefault();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            style={{
              transition: "opacity ease 0.16s",
              opacity: show ? "" : 0,
              position: "fixed",
              top: offsetTop,
              width: "100%",
              left: 0,
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(20px)",
              ...props.style,
            }}
          >
            {props.toolbar}
          </div>,
          document.body
        )}
    </span>
  );
};

export default EdgeBar;
