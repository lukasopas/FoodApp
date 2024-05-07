import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Image, Alert, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('favorites.db');

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const isFocused = useIsFocused();

  const logDatabaseContents = () => {
    const db = SQLite.openDatabase('favorites.db');
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM favorites;',
        [],
        (_, { rows }) => console.log(JSON.stringify(rows._array)),
        (_, error) => console.log('Error logging database contents: ', error)
      );
    });
  };

  useEffect(() => {
    if (isFocused) {
      fetchFavorites();
    }
  }, [isFocused]); 

  const fetchFavorites = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM favorites;',
        [],
        (_, { rows }) => setFavorites(rows._array),
        (_, err) => console.log('Failed to fetch favorites', err)
      );
    });
  };

  const removeFavorite = (id) => {
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM favorites WHERE id = ?;',
        [id],
        () => {
          console.log('Recipe removed from favorites');
          fetchFavorites(); 
          setFavorites(currentFavorites => currentFavorites.filter(item => item.id !== id));
          logDatabaseContents();
        },
        (_, err) => console.log('Failed to remove favorite', err)
      );
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Button title="Remove from Favorites" onPress={() => removeFavorite(item.id)} />
    </View>
  );

  return (
    <FlatList
      data={favorites}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      ListEmptyComponent={<Text>No Favorites Added</Text>}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center'
  },
  title: {
    flex: 1,
    fontSize: 18
  },
  image: {
    width: 100,
    height: 100
  }
});

export default FavoritesScreen;