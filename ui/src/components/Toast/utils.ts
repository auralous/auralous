import { GraphQLError } from "graphql";
import { TFunction } from "react-i18next";
import toast from "./toast";

export const toastAPIErrors = (errors: GraphQLError[], t: TFunction) => {
  for (const error of errors) {
    toast.error(t(error.message));
  }
};
