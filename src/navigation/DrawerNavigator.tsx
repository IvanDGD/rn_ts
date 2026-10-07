// import { createDrawerNavigator } from "@react-navigation/drawer";
// import HomeScreen from "../screens/HomeScreen";
// import ProfileScreen from "../screens/ProfileScreen";

// const Drawer = createDrawerNavigator();

// export const DrawerNavigator = () => {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="Home" component={HomeScreen} />
//       <Drawer.Screen name="Profile" component={ProfileScreen} />
//     </Drawer.Navigator>
//   );
// };

import { Image } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DetailsStack from "./DetailsStack";
import DetailsScreen from "../screens/DetailsScreen";
import ProfileScreen from "../screens/Details/ProfileScreen";
import AppTabNavigator from "./AppTabNavigator";

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="AppNavigator"
        component={AppTabNavigator}
        options={{
          drawerIcon: ({ focused }) => (
            <Image
              source={require("../../assets/home.png")}
              style={{ width: 24, height: 24, opacity: focused ? 1 : 0.5 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="MyOrders"
        component={DetailsScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Image
              source={require("../../assets/details.png")}
              style={{ width: 24, height: 24, opacity: focused ? 1 : 0.5 }}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Image
              source={require("../../assets/details.png")}
              style={{ width: 24, height: 24, opacity: focused ? 1 : 0.5 }}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};
