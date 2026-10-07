import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View, Text, FlatList, Button, Alert, TextInput } from "react-native";
import { IBook } from "../interfaces/IBook";
import { styles } from "../styles/book.styles";
import { DbSqliteService } from "../utills/DbSqliteService";

export const BookListScreen = ({ navigation }: any) => {
  const [books, setBooks] = useState<Array<IBook>>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadBooks = async () => {
    try {
      const dbService = await DbSqliteService.getInstance();
      const storedBooks = await dbService.getAll<IBook>("SELECT * FROM books");
      if (storedBooks) setBooks(storedBooks);
    } catch (error) {
      console.error("Ошибка при загрузке книг", error);
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const dbService = await DbSqliteService.getInstance();
      await dbService.execute("DELETE FROM books WHERE id = ?", [id]);
      loadBooks();
    } catch (error) {
      console.error("Ошибка при удалении книги", error);
      Alert.alert("Ошибка", "Не удалось удалить книгу");
    }
  };

  const deleteAllBooks = () => {
    Alert.alert(
      "Подтверждение",
      "Вы уверены, что хотите удалить абсолютно все книги?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить все",
          style: "destructive",
          onPress: async () => {
            try {
              const dbService = await DbSqliteService.getInstance();
              await dbService.execute("DELETE FROM books");
              loadBooks();
            } catch (error) {
              console.error("Ошибка при очистке базы данных", error);
              Alert.alert("Ошибка", "Не удалось удалить все книги");
            }
          },
        },
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, [])
  );

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Список книг</Text>

      {books.length > 0 && (
        <View style={{ marginBottom: 10 }}>
          <Button title="Удалить все книги" color="red" onPress={deleteAllBooks} />
        </View>
      )}

      <TextInput
        style={[styles.input, { marginBottom: 10 }]}
        placeholder="Поиск по названию или автору..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Text style={styles.bookAuthor}>Автор: {item.author}</Text>
            
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Button
                title="Изменить"
                onPress={() => navigation.navigate("Добавить книгу", { book: item })}
              />
              <Button
                title="Удалить"
                color="red"
                onPress={() => deleteBook(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};