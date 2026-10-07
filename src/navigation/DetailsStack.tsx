import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Details/HomeScreen";
import ProfileScreen from "../screens/Details/ProfileScreen";

//Home:undefined - екран без параметрів
export type DetailStackParamList = {
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<DetailStackParamList>();

export default function DetailsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Главная" }}
      />

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Профиль" }}
      />
    </Stack.Navigator>
  );
}
