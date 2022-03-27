import { t } from "i18next";
import wrappedLazy from "../lazy";
import { RouteName } from "../types";

const SignInScreen = wrappedLazy(() => import("./SignInScreen"));

const SignInRouteConfig = {
  name: RouteName.SignIn,
  component: SignInScreen,
  options: {
    presentation: "modal" as const,
    title: t("sign_in.title"),
    headerShown: false,
  },
};

export default SignInRouteConfig;
