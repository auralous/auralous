import { Link, useLinkProps } from "@react-navigation/native";
import type { ComponentProps, FC } from "react";
import { Platform, Pressable } from "react-native";

const ReactNavigationLinkWeb: FC<ComponentProps<typeof Link>> = ({
  children,
  ...props
}) => {
  return <Link {...props}>{children}</Link>;
};

// Since styling in native does not work properly with Text
// we fallback to a Pressable
const ReactNavigationLinkNative: FC<ComponentProps<typeof Link>> = ({
  to,
  action,
  children,
  ...rest
}) => {
  const { onPress, ...props } = useLinkProps({ to, action });

  return (
    <Pressable onPress={onPress} {...props} {...rest}>
      {children}
    </Pressable>
  );
};

export default Platform.OS === "web"
  ? ReactNavigationLinkWeb
  : ReactNavigationLinkNative;
