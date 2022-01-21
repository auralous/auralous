import { IconChevronLeft, IconMessageSquare } from "@/assets";
import { Button } from "@/components/Button";
import { SlideModal, useDialog } from "@/components/Dialog";
import { Spacer } from "@/components/Spacer";
import { Heading } from "@/components/Typography";
import { usePlaybackContextMeta, usePlaybackCurrentContext } from "@/player";
import { Size } from "@/styles/spacing";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatView from "./ChatView";
import { styles } from "./QueueSheet.styles";

const ChatSheet: FC<{
  onClose(): void;
}> = ({ onClose }) => {
  const { t } = useTranslation();
  const contextMeta = usePlaybackContextMeta(usePlaybackCurrentContext());
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <TouchableOpacity
            accessibilityLabel={t("common.navigation.go_back")}
            onPress={onClose}
          >
            <IconChevronLeft width={Size[10]} height={Size[10]} />
          </TouchableOpacity>
          <Spacer x={1} />
          <Heading level={3}>{t("chat.title")}</Heading>
        </View>
        <View style={styles.headerSide}></View>
      </View>
      <View style={styles.content}>
        <ChatView contextMeta={contextMeta} />
      </View>
    </SafeAreaView>
  );
};

const GHChatSheet = gestureHandlerRootHOC(ChatSheet);

const ChatButtonAndSheet: FC = () => {
  const { t } = useTranslation();
  const [visible, present, dismiss] = useDialog();

  return (
    <>
      <Button
        accessibilityLabel={t("chat.title")}
        onPress={present}
        icon={<IconMessageSquare />}
        variant="text"
        style={styles.btn}
      />
      <SlideModal visible={visible} onDismiss={dismiss}>
        <GHChatSheet onClose={dismiss} />
      </SlideModal>
    </>
  );
};

export default ChatButtonAndSheet;
