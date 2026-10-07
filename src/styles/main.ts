import { StyleSheet, Platform, StatusBar } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#006790",
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    flex: 1,
    justifyContent: "space-evenly",
    alignItems: "flex-start",
  },
  sub_container: {
    width: 100,
    aspectRatio: 0.5,
    borderColor: "black",
    borderWidth: 2,
  },
});
export default styles;
