import React, { useEffect, useMemo, useRef, useState } from "react";
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
      window.visualViewport.height - height + window.scrollY - fix,
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

    const leading = debounce(
      () => {
        setShow(false);
      },
      140,
      {
        leading: true,
        trailing: false,
      }
    );

    const trailing = debounce(
      () => {
        setShow(true);

        setOffsetTop(calcOffsetTop());
      },
      140,
      {
        leading: false,
        trailing: true,
      }
    );

    const handler = () => {
      leading();
      trailing();
    };

    window.addEventListener("scroll", handler);

    return () => {
      window.removeEventListener("scroll", handler);
    };
  }, [isFocused]);

  const childrenRef = useRef<{ focus: () => void }>(null);

  const children = useMemo(
    () =>
      React.Children.map(props.children, (child) =>
        React.cloneElement(child, {
          ref: childrenRef,
        })
      ),
    [props.children]
  );

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
          setOffsetTop(calcOffsetTop());
        }, 700);
      }}
    >
      {children}
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