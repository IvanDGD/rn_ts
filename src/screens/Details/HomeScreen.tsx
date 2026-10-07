import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, View, Button } from "react-native";
import { DetailStackParamList } from "../../navigation/DetailsStack";

type Props = NativeStackScreenProps<DetailStackParamList, "Home">;
export default function HomeScreen({ navigation }: Props) {
  return (
    <View>
      <Text>Головна в Details Stack</Text>
      <Button
        title="Відкрити профіль"
        onPress={() => navigation.navigate("Profile")}
      />
    </View>
  );
}
