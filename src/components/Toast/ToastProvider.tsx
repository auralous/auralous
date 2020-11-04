import React, { useState, useRef, useEffect } from "react";
import Portal from "@reach/portal";
import { IToastContext, ToastItem } from "./types";
import Toast from "./Toast";
import ToastContext from "./ToastContext";

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastItem[]>([]);
  const toasts = useRef<IToastContext>({
    message(args) {
      let content: string | React.FC;
      let type: "danger" | "success" | undefined;
      let time: number | undefined;
      if (typeof args === "string" || typeof args === "function") {
        content = args;
      } else if (typeof args === "object") {
        content = args.content;
        type = args.type;
        time = args.time;
      }
      setMessages((prevMessages) => {
        const newMessage = Array.from(prevMessages);
        const dupIndex = prevMessages.findIndex(
          ({ content: prevContent }) => prevContent === content
        );
        if (dupIndex !== -1) {
          newMessage.splice(dupIndex, 1);
        }
        return newMessage.concat([
          {
            id: Math.random().toString(36).substring(2, 15),
            content,
            type,
            time,
          },
        ]);
      });
    },
    error(content) {
      this.message({ content, type: "danger", time: 15000 });
    },
    success(content) {
      this.message({ content, type: "success" });
    },
    clear() {
      setMessages([]);
    },
    removeToast(id) {
      setMessages((prevMessages) =>
        prevMessages.filter(({ id: i }) => id !== i)
      );
    },
  }).current;
  useEffect(() => {
    window.toasts = toasts;
  }, [toasts]);
  return (
    <ToastContext.Provider value={toasts}>
      {children}
      <Portal>
        <div className="fixed z-50 top-0 right-1/2 transform translate-x-1/2 m-2">
          {messages.map((toast) => (
            <Toast key={toast.id} toast={toast} toasts={toasts} />
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
