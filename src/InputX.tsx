import React, {
  ChangeEventHandler,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const InputX = React.forwardRef<
  {
    focus: Function;
    value: string;
    isFocused: () => boolean;
  },
  {
    className?: string;
    value?: string | number;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
  }
>((props, ref) => {
  const [renderStatus, setRenderStauts] = useState<0 | 1>(0);

  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(String(props.value || ""));

  props.value ??
    String(props.value) !== props.value ??
    setValue(String(props.value));

  const _onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
    props.onChange?.(e);
  };

  const focus = () => {
    setRenderStauts(1);
  };

  const getValue = () => inputRef.current?.value ?? value;

  const isFocused = () => {
    return renderStatus !== 0;
  };

  useImperativeHandle(
    ref,
    () => {
      const obj = {
        focus,
        value: getValue(),
        isFocused,
      };

      return Object.defineProperty(obj, "value", {
        get() {
          return getValue();
        },
        set(value) {
          setValue(value);
        },
      });
    },
    []
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  const _onFocus: React.FormEventHandler = async () => {
    const original = inputRef.current!;

    const clone = original.cloneNode() as HTMLInputElement;

    await new Promise((resolve) => setTimeout(resolve));
    clone.selectionStart = original.selectionStart;

    clone.style.position = "absolute";
    clone.style.top = "0";
    clone.style.left = "0";
    clone.style.opacity = "0";
    wrapperRef.current!.appendChild(clone);

    clone.focus();

    setTimeout(() => {
      clone.style.opacity = "";
      original.style.opacity = "0";
      original.disabled = true;
    });

    clone.addEventListener("input", (e: any) => {
      _onChange?.(e);
    });

    clone.addEventListener("blur", (e) => {
      props.onBlur?.(e as any);
      original.disabled = false;
      original.style.opacity = "";
      clone.style.opacity = "0";
      setTimeout(() => {
        clone.remove();
      });
    });
  };

  return (
    <div
      className={props.className}
      ref={wrapperRef}
      style={{ position: "relative", display: "inline-block" }}
    >
      <input
        value={value}
        onFocus={_onFocus}
        ref={inputRef}
        onChange={_onChange}
        style={{
          height: "100%",
        }}
      ></input>
    </div>
  );
});

export default InputX;
