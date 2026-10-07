import { useState, useEffect } from "react";
import { Alert, View, Text, TextInput, Button } from "react-native";
import { styles } from "../styles/book.styles";
import { DbSqliteService } from "../utills/DbSqliteService";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export const AddBookScreen = ({ route, navigation }: any) => {
  const bookToEdit = route.params?.book;

  const [title, setTitle] = useState(bookToEdit ? bookToEdit.title : "");
  const [author, setAuthor] = useState(bookToEdit ? bookToEdit.author : "");

  useEffect(() => {
    if (bookToEdit) {
      navigation.setOptions({ title: "Редактировать книгу" });
    }
  }, [bookToEdit]);

  const saveBook = async () => {
    if (!title.trim() || !author.trim()) {
      Alert.alert("Ошибка", "Введите название и автора книги");
      return;
    }

    try {
      const dbService = await DbSqliteService.getInstance();
      
      if (bookToEdit) {
        await dbService.execute(
          "UPDATE books SET title = ?, author = ? WHERE id = ?",
          [title.trim(), author.trim(), bookToEdit.id]
        );
        Alert.alert("Успех", "Книга обновлена!");
      } else {
        await dbService.execute(
          "INSERT INTO books (id, title, author) VALUES (?, ?, ?)",
          [uuidv4(), title.trim(), author.trim()]
        );
        Alert.alert("Успех", "Книга добавлена!");
      }

      setTitle("");
      setAuthor("");
      navigation.navigate("Список книг");
    } catch (error) {
      console.error("Ошибка при сохранении книги", error);
      Alert.alert("Ошибка", "Не удалось сохранить книгу");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {bookToEdit ? "Редактировать книгу" : "Добавить книгу"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Название книги"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Автор"
        value={author}
        onChangeText={setAuthor}
      />
      <Button title={bookToEdit ? "Сохранить изменения" : "Сохранить"} onPress={saveBook} />
    </View>
  );
};