import { CombinedError } from "urql";
import toast from "./toast";

export const toastCombinedErrors = (error: CombinedError) => {
  for (const err of error.graphQLErrors) {
    toast.error(err.message);
  }
};
