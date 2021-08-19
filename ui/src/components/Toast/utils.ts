import { TFunction } from "react-i18next";
import { CombinedError } from "urql";
import toast from "./toast";

export const toastCombinedErrors = (t: TFunction, error: CombinedError) => {
  for (const err of error.graphQLErrors) {
    toast.error(t(err.message));
  }
};
