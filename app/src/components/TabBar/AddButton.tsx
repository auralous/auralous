import { Plus } from "assets/svg";
import React from "react";
import { Pressable, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Size } from "styles";

const styles = StyleSheet.create({
  wrapper: {
    padding: Size[6],
    borderRadius: 9999,
    transform: [{ translateY: -30 }],
  },
});

const AddButton: React.FC = () => {
  return (
    <Pressable>
      <LinearGradient colors={["#ff2e54", "#f5a524"]} style={styles.wrapper}>
        <Plus
          width={Size[6]}
          height={Size[6]}
          strokeWidth={3}
          stroke="#ffffff"
        />
      </LinearGradient>
    </Pressable>
  );
};

export default AddButton;
