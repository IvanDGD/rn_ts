import { Text, View, Button } from "react-native";

export default function ProfileScreen() {
  return (
    <View>
      <Text>Профіль у Details Stack</Text>
      <Button
        title="Відкрити деталі"
        onPress={() => {
          //navigation.navigate("Details");
        }}
      />
    </View>
  );
}
