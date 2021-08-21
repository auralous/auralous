import { emitter } from "./pubsub";

interface ToastFunction {
  (message: string): void;
  error(message: string): void;
  success(message: string): void;
}

const toast: ToastFunction = (message) => {
  emitter.emit("toast", {
    message,
  });
};

toast.error = (message) => {
  emitter.emit("toast", {
    type: "error",
    message,
  });
};

toast.success = (message) => {
  emitter.emit("toast", {
    type: "success",
    message,
  });
};

export default toast;
