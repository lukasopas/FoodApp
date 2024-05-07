import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Image, ScrollView} from 'react-native';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { Button, Icon, Input } from '@rneui/themed';
import { Header, ListItem } from '@rneui/base';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as SQLite from 'expo-sqlite';






export default function HomeScreen() {

  const [query, setQuery]= useState('');
  const [diet, setDiet] = useState('');
  const [intolerances, setIntolerances]= useState('');
  const [includeIngredient, setIncludeIngredient]= useState('');
  const [number, setNumber]= useState('1');
  const [ranking, setRanking] =useState('1');
  
  const [recipeInstructions, setRecipeInstructions] = useState('');
  const Drawer = createDrawerNavigator();
  const [favorites, setFavorites] = useState([]);


  const [result, setResult] = useState(null);

  const db = SQLite.openDatabase('favorites.db');


useEffect(() => {
  
  const initDB = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY NOT NULL, title TEXT, image TEXT);',
        [],
        () => console.log('Table created successfully'),
        (_, err) => console.log('Failed to create table', err)
      );
    });
  };
  initDB();
}, []);

const addFavorite = (recipe) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT id FROM favorites WHERE id = ?;',
      [recipe.id],
      (_, result) => {
        if (result.rows.length === 0) {
          
          tx.executeSql(
            'INSERT INTO favorites (id, title, image) VALUES (?, ?, ?);',
            [recipe.id, recipe.title, recipe.image],
            () => {
              console.log('Recipe saved to favorites');
              fetchFavorites();  
            },
            (_, err) => console.log('Failed to add favorite', err)
          );
        } else {
          console.log('Recipe already in favorites');
        }
      },
      (_, err) => console.log('Failed to check if favorite exists', err)
    );
  });
};

const fetchFavorites = () => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM favorites;',
      [],
      (_, { rows }) => {
        setFavorites(rows._array);  
        console.log(rows._array);  
      },
      (_, err) => console.log('Failed to fetch favorites', err)
    );
  });
};









  const fetchRecipes = async () => {
    if (!query) {
      alert('Please enter a search query.');
      return;
    }

    try {
      const response = await axios.get('https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch', {
        params: { 
          query, 
          diet, 
          intolerances, 
          includeIngredient,  
          number: parseInt(number), 
          ranking: parseInt(ranking) 
        },
        headers: {
          'X-RapidAPI-Key': '2b82c55899msh6afcc2df45e44fdp1af86bjsnbdbee975f31c',
          'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
      });

      setResult(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. See console for details.');
    }
  };
  const fetchInstructions = async (recipeId) => {
    try {
      const response = await axios.get(`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${recipeId}/information`, {
        headers: {
          'X-RapidAPI-Key': '2b82c55899msh6afcc2df45e44fdp1af86bjsnbdbee975f31c',
          'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
        }
      });

      console.log("Fetched instructions:", response.data.instructions);
      setRecipeInstructions(response.data.instructions);
    } catch (error) {
      console.error('Error fetching instructions:', error);
      alert('Failed to fetch instructions. See console for details.');
      setRecipeInstructions(''); 
    }
  };
    
  return (
    <><View>

    </View><ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          <Text>Serach for food</Text>
          <TextInput
            placeholder="Search query"
            value={query}
            onChangeText={setQuery}
            style={styles.input} />
          <TextInput
            placeholder="Diet(optional)"
            value={diet}
            onChangeText={setDiet}
            style={styles.input} />
          <TextInput
            placeholder="Intolerances(optional)"
            value={intolerances}
            onChangeText={setIntolerances}
            style={styles.input} />
          <TextInput
            placeholder="Include ingredient"
            value={includeIngredient}
            onChangeText={setIncludeIngredient}
            style={styles.input} />
          <TextInput
            placeholder="Number of results"
            value={number}
            onChangeText={text => setNumber(text)}
            keyboardType="numeric"
            style={styles.input} />
          <Picker
            selectedValue={ranking}
            onValueChange={(itemValue) => setRanking(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Minimize missing incrediements" value="0" />
            <Picker.Item label="Maximize used ingrediments" value="1" />
            <Picker.Item label="Relevance" value="2" />
          </Picker>
          <Button title="Search" onPress={fetchRecipes}>
            <Icon name='search' color='white' style={{ margainleft: 10 }} />
          </Button>
          {result && result.results && (
            <FlatList
              data={result.results}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
                  <Button title="Get Recipe Instructions" onPress={() => fetchInstructions(item.id)} />
                  <Button
      title="Add to Favorites"
      onPress={() => addFavorite(item)}
    />
                </View>
              )} />
              )}
          {}
          {recipeInstructions ? (
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Recipe Instructions:</Text>
              <Text style={styles.instructionsText}>{recipeInstructions}</Text>
            </View>
          ) : null}
          
        </View>
      </ScrollView></>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    margin: 10,
  },
  picker: {
    margin: 10,
  },
  item: {
    flexDirection: 'column',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
  },
  buttonContainer: {
    width: '100%', 
    alignItems: 'center'
  }
});