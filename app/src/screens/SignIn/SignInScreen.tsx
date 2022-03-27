import { useAuthActions } from "@/gql/context";
import type { ParamList, RouteName } from "@/screens/types";
import { useMeQuery } from "@auralous/api";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { FC } from "react";
import { useEffect } from "react";

const SignInScreen: FC<NativeStackScreenProps<ParamList, RouteName.SignIn>> = ({
  route,
  navigation,
}) => {
  const { signIn } = useAuthActions();

  const [{ data: { me } = { me: undefined } }] = useMeQuery();

  useEffect(() => {
    const accessToken = route.params?.access_token;
    if (accessToken) signIn(accessToken);
  }, [route, signIn]);

  useEffect(() => {
    if (me) navigation.goBack();
  }, [me, navigation]);

  return null;
};

export default SignInScreen;
