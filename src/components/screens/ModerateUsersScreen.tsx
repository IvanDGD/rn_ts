import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserType } from "../../types/UserType";

export const ModerateUsersScreen = ({ route }: any) => {
  const { userId } = route.params || {};
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);

  const [newUser, setNewUser] = useState<UserType>({
    id: "",
    name: "",
    password: "",
    isAdmin: false,
  });

  useEffect(() => {
    const loadUsers = async () => {
      const storedUsers = await AsyncStorage.getItem("users");
      if (storedUsers) {
        const parsedUsers: UserType[] = JSON.parse(storedUsers);
        setUsers(parsedUsers);

        const activeUser = parsedUsers.find((u) => u.id === userId);
        if (activeUser) {
          setCurrentUser(activeUser);
        }
      }
    };
    loadUsers();
  }, [userId]);

  const handleAddUser = async () => {
    if (newUser.name.trim() && newUser.password.trim()) {
        const userToAdd = { ...newUser, id: Date.now().toString() };
        const updatedUsers = [...users, userToAdd];
        setUsers(updatedUsers);
        await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
        setNewUser({ id: "", name: "", password: "", isAdmin: false });
    } else {
        alert("Please enter both username and password");
    }
  };

  const handleDeleteUser = async (userToDelete: UserType) => {
    const updatedUsers = users.filter((u) => u.id !== userToDelete.id);
    setUsers(updatedUsers);
    await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  if (!currentUser?.isAdmin) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ color: "red", fontSize: 16 }}>
          You don't have permission to access
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        User Management
      </Text>

      <FlatList
        ListEmptyComponent={<Text>No users found</Text>}
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text>
              {item.name} {item.isAdmin ? "(Admin)" : "(User)"}
            </Text>
            <Button
              title="Delete"
              onPress={() => handleDeleteUser(item)}
            />
          </View>
        )}
      />

      <TextInput
        placeholder="New User Name"
        value={newUser.name}
        onChangeText={(text) => setNewUser({ ...newUser, name: text })}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <TextInput
        placeholder="New User Password"
        value={newUser.password}
        onChangeText={(text) => setNewUser({ ...newUser, password: text })}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      
      <Button
        title="Make Admin"
        onPress={() => setNewUser({ ...newUser, isAdmin: !newUser.isAdmin })}
        color={newUser.isAdmin ? "green" : "gray"}
      />

      <View style={{ marginTop: 10 }}>
        <Button title="Add User" onPress={handleAddUser} />
      </View>
    </SafeAreaView>
  );
};