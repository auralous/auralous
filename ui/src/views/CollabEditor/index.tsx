import { Text } from "@auralous/ui/components";
import { FC } from "react";
import { View } from "react-native";

interface CollabManagerProps {
  addedUserIds: string[];
  onAdd(ids: string[]): void;
  onRemove(ids: string[]): void;
}

export const CollabManager: FC<CollabManagerProps> = () => {
  return (
    <View>
      <Text>hello</Text>
    </View>
  );
};
