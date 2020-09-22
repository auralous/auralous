/* eslint-disable react/no-this-in-sfc */
import React, { useRef, useEffect, useCallback } from "react";
import { IToastContext, ToastItem } from "./types";

const Toast: React.FC<{
  toast: ToastItem;
  toasts: IToastContext;
}> = ({ toast, toasts }) => {
  const toastRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (!toastRef.current) return;
    toastRef.current.classList.add("opacity-0", "translate-y-4");
    setTimeout(() => toasts.removeToast(toast.id), 300);
  }, [toastRef, toast, toasts]);

  useEffect(() => {
    let timeout = 6000;
    if (toast.time) timeout = toast.time;
    else if (typeof toast.content === "string") {
      const WPM = 240;
      const totalWords = toast.content.split(" ").length;
      timeout = Math.max((totalWords / WPM) * 60 * 1000, 6000);
    }

    if (!toastRef.current) return;
    switch (toast.type) {
      case "success":
        toastRef.current.classList.add("bg-success", "text-white");
        break;
      case "danger":
        toastRef.current.classList.add("bg-danger", "text-white");
        break;
      default:
        toastRef.current.classList.add("bg-background-secondary");
        break;
    }

    toastRef.current.classList.remove("opacity-0", "translate-y-4");
    const timer = window.setTimeout(close, timeout);
    return () => window.clearTimeout(timer);
  }, [close, toast]);
  return (
    <>
      {/* eslint-disable-next-line */}
      <div
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        role="status"
        ref={toastRef}
        className="p-4 mt-2 rounded-lg translate-y-4 opacity-0 transition duration-300 min-w-64 relative"
      >
        <button
          aria-label="Close toast"
          className="absolute top-0 px-2 right-2 text-lg"
          onClick={close}
        >
          ×
        </button>
        <div className="flex items-center text-sm">
          {typeof toast.content === "string" ? (
            <p>{toast.content}</p>
          ) : (
            <toast.content />
          )}
        </div>
      </div>
    </>
  );
};

export default Toast;
