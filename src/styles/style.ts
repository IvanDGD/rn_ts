import { StatusBar, StyleSheet, Platform } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
  },
  inp: {
    backgroundColor: "lightblue",
    width: 200,
  },
});
export default styles;
