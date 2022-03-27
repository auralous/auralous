import { IconFacebook, IconReddit, IconShare2, IconTwitter } from "@/assets";
import { Dialog } from "@/components/Dialog";
import { toast } from "@/components/Toast";
import { Config } from "@/config";
import { Colors } from "@/styles/colors";
import { Size } from "@/styles/spacing";
import Clipboard from "@react-native-clipboard/clipboard";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, Share as RNShare, StyleSheet } from "react-native";
import { Text } from "../Typography";

interface ShareProps {
  visible: boolean;
  url?: string;
  title?: string;
  onDismiss?(): void;
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
  },
  textContainer: {
    alignItems: "center",
    borderColor: Colors.border,
    borderRadius: Size[2],
    borderWidth: 2,
    justifyContent: "center",
    padding: Size[4],
  },
});

const Share: FC<ShareProps> = ({ visible, title = "", url, onDismiss }) => {
  const { t } = useTranslation();
  const onCopy = () => {
    Clipboard.setString(url || title);
    toast.success(t("share.copied"));
  };
  return (
    <Dialog.Dialog visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Pressable onPress={onCopy} style={styles.textContainer}>
          <Text style={styles.text}>{url}</Text>
        </Pressable>
      </Dialog.Content>
      <Dialog.Footer>
        <Dialog.Button
          accessibilityLabel={t("share.share_via_name", { name: "Facebook" })}
          icon={<IconFacebook fill={Colors.text} width={24} height={24} />}
          onPress={() => {
            Linking.openURL(
              `https://www.facebook.com/dialog/share?app_id=${Config.FACEBOOK_APP_ID}&href=${url}&display=popup`
            ).finally(onDismiss);
          }}
        />
        <Dialog.Button
          accessibilityLabel={t("share.share_via_name", { name: "Twitter" })}
          icon={<IconTwitter fill={Colors.text} width={24} height={24} />}
          onPress={() => {
            Linking.openURL(
              `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(
                title
              )}`
            ).finally(onDismiss);
          }}
        />
        <Dialog.Button
          accessibilityLabel={t("share.share_via_name", { name: "Reddit" })}
          icon={<IconReddit fill={Colors.text} width={24} height={24} />}
          onPress={() => {
            Linking.openURL(
              `https://reddit.com/submit?url=${url}&title=${encodeURIComponent(
                title
              )}`
            ).finally(onDismiss);
          }}
        />
        <Dialog.Button
          accessibilityLabel={t("share.share_via_name", { name: "Reddit" })}
          icon={<IconShare2 fill={Colors.text} width={24} height={24} />}
          onPress={() =>
            RNShare.share({
              message: url as string,
            })
              .catch((reason) => toast.error(reason.message))
              .finally(onDismiss)
          }
        />
      </Dialog.Footer>
    </Dialog.Dialog>
  );
};

export default Share;
