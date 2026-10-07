import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { BookListScreen } from "./src/books/BookListScreen";
import { AddBookScreen } from "./src/books/AddBookScreen";
import * as SQLite from "expo-sqlite";
import { useEffect } from "react";
import { DbSqliteService } from "./src/utills/DbSqliteService";

const Drawer = createDrawerNavigator();

export default function App() {
  useEffect(() => {
    const createDbAndTable = async () => {
      try {
        const dbService = await DbSqliteService.getInstance();
        await dbService.createTable(
          "books",
          "id TEXT PRIMARY KEY, title TEXT NOT NULL, author TEXT NOT NULL",
        );
      } catch (err) {
        console.log("Помилка при створенні бази даних та таблиці", err);
      }
    };
    createDbAndTable();
  }, []);
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Список книг">
        <Drawer.Screen name="Список книг" component={BookListScreen} />
        <Drawer.Screen name="Добавить книгу" component={AddBookScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
