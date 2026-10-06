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
import Icon from "react-native-vector-icons/FontAwesome";
import { Tab } from "../navigation/MainNavigation";
import { ModerateUsersScreen } from "./ModerateUsersScreen";
import { UserType } from "../../types/UserType";

export const HomeScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  
  const [books, setBooks] = useState<{ title: string; author: string }[]>([]);
  const [newBook, setNewBook] = useState<{ title: string; author: string }>({
    title: "",
    author: "",
  });

  useEffect(() => {
    const loadInitialData = async () => {
      const storedBooks = await AsyncStorage.getItem("books");
      if (storedBooks) {
        setBooks(JSON.parse(storedBooks));
      }

      const storedUsers = await AsyncStorage.getItem("users");
      if (storedUsers) {
        setUsersList(JSON.parse(storedUsers));
      } else {
        const defaultAdmin: UserType = { id: "1", name: "admin", password: "123", isAdmin: true };
        await AsyncStorage.setItem("users", JSON.stringify([defaultAdmin]));
        setUsersList([defaultAdmin]);
      }

      const savedUserId = await AsyncStorage.getItem("currentUserId");
      if (savedUserId) {
        setCurrentUserId(savedUserId);
        setIsLoggedIn(true);
      }
      if (storedUsers) {
      const parsedUsers: UserType[] = JSON.parse(storedUsers);
      
      const activeUser = parsedUsers.find((u) => u.id === savedUserId);
      if (activeUser) {
        setCurrentUser(activeUser);
      }
    }
    };

    loadInitialData();
  }, []);

  const handleLogin = async () => {
    const storedUsers = await AsyncStorage.getItem("users");
    const latestUsers: UserType[] = storedUsers ? JSON.parse(storedUsers) : usersList;

    const foundUser = latestUsers.find(
        (u) => u.name === username && u.password === password
    );

    if (foundUser) {
        setIsLoggedIn(true);
        setCurrentUserId(foundUser.id);
        await AsyncStorage.setItem("isLoggedIn", "true");
        await AsyncStorage.setItem("currentUserId", foundUser.id);
    } else {
        alert("Invalid credentials");
    }
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    setCurrentUserId(null);
    await AsyncStorage.removeItem("isLoggedIn");
    await AsyncStorage.removeItem("currentUserId");
  };

  const handleAddBook = async () => {
    if (!currentUser?.isAdmin) return alert("You are not an admin");
    if (newBook.title && newBook.author) {
      const updatedBooks = [...books, newBook];
      setBooks(updatedBooks);
      await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
      setNewBook({ title: "", author: "" });
    }
  };

  const handleDeleteBook = async (book: { title: string; author: string }) => {
    if (!currentUser?.isAdmin) return alert("You are not an admin");
    const updatedBooks = books.filter((b) => b !== book);
    setBooks(updatedBooks);
    await AsyncStorage.setItem("books", JSON.stringify(updatedBooks));
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 20 }}>
        <Text>Login</Text>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{ borderBottomWidth: 1, marginBottom: 20 }}
        />
        <Button title="Login" onPress={handleLogin} />
      </SafeAreaView>
    );
  }

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Books"
        options={{
          tabBarIcon: () => <Icon name="book" size={20} />,
        }}
      >
        {() => (
          <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <Text>Book List</Text>
            <FlatList
              ListEmptyComponent={<Text>List is empty</Text>}
              data={books}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text>
                    {item.title} by {item.author}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Button
                      title="Delete"
                      onPress={() => handleDeleteBook(item)}
                    />
                  </View>
                </View>
              )}
            />
            <TextInput
              placeholder="Book Title"
              value={newBook.title}
              onChangeText={(text) => setNewBook({ ...newBook, title: text })}
              style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
              placeholder="Author"
              value={newBook.author}
              onChangeText={(text) => setNewBook({ ...newBook, author: text })}
              style={{ borderBottomWidth: 1, marginBottom: 20 }}
            />

            <Button title="Add Book" onPress={handleAddBook} />
            <View style={{ marginTop: 10 }}>
              <Button title="Logout" onPress={handleLogout} />
            </View>
          </SafeAreaView>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Settings"
        options={{
          tabBarIcon: () => <Icon name="cogs" size={20} />,
        }}
      >
        {() => (
          <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <Text>Settings</Text>
            <Text>Тут будуть налаштування</Text>
          </SafeAreaView>
        )}
      </Tab.Screen>

      <Tab.Screen
        name="Users"
        component={ModerateUsersScreen}
        options={{
            tabBarIcon: () => <Icon name="user" size={20} />,
        }}
        listeners={({ navigation }) => ({
            tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Users", { userId: currentUserId });
            },
        })}
      />
    </Tab.Navigator>
  );
};