import React from "react";

export type ToastItem = {
  id: string;
  content: string | React.FC;
  type?: "danger" | "success";
  time?: number;
};

export type IToastContext = {
  message: (
    args:
      | string
      | React.FC
      | {
          content: string | React.FC;
          type?: "danger" | "success";
          time?: number;
        }
  ) => void;
  error: (content: string | React.FC) => void;
  success: (content: string | React.FC) => void;
  clear: () => void;
  removeToast: (id: string | React.FC) => void;
};
