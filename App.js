import React from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, Dimensions, Platform, ScrollView, AsyncStorage } from 'react-native';
import ToDo from './ToDo';
import { AppLoading } from 'expo';
import uuidv1 from 'uuid/v1';

const { width, height } = Dimensions.get('window');

export default class App extends React.Component {
  state = {
    newToDo: "",
    loadedToDos: false,
    toDos: {}
  }

  componentDidMount(){
    this._loadToDos();
  }

  render() {
    const { newToDo, loadedToDos, toDos } = this.state;

    if(!loadedToDos){
      return (
        <AppLoading />
      )
    }

    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>Cute To Do</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={"New To do"}
            underlineColorAndroid={"transparent"}
            value={newToDo}
            onChangeText={this._controlNewToDo}
            placeholderTextColor={"#999"}
            returnKeyType={'done'}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
          />
          <ScrollView contentContainerStyle={styles.toDos}>
            {Object.values(toDos).map(todo => <ToDo key={todo.id} {...todo} deleteToDo={this._deleteToDo} uncompletedToDo={this._uncompletedToDo} completedToDo={this._completedToDo} updateToDo={this._updateToDo} />)}
          </ScrollView>
        </View>
      </View>
    );
  }

  _controlNewToDo = text => {
    this.setState({
      newToDo: text
    })
  }
  _loadToDos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        loadedToDos: true,
        toDos: parsedToDos || {}
      });
    } catch(err){
      console.log(err);
    }
  }
  _addToDo = () => {
    const { newToDo } = this.state;
    if(newToDo !== ""){
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]:{
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newToDo: "",
          toDos:{
            ...prevState.toDos,
            ...newToDoObject
          }
        };
        this._saveToDo(newState.toDos);
        return { ...newState };
      })
    }
  }
  _deleteToDo = (id) => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      }
      this._saveToDo(newState.toDos);
      return { ...newState }
    })
  }
  _uncompletedToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      }
      this._saveToDo(newState.toDos);
      return { ...newState };
    })
  }
  _completedToDo = (id) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      }
      this._saveToDo(newState.toDos);
      return { ...newState };
    })
  }
  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos:{
          ...prevState.toDos,
          [id]:{
            ...prevState.toDos[id],
            text: text
          }
        }
      }
      this._saveToDo(newState.toDos);
      return { ...newState };
    })
  }
  _saveToDo = (newToDo) => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDo));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center',
  },
  title:{
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "200",
    marginBottom: 30
  },
  card:{
    width: width - 25,
    backgroundColor: "white",
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios:{
        shadowColor: "rgb(50, 50, 50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset:{
          height: -1,
          width:0
        }
      },
      android:{
        elevation: 3
      }
    })
  },
  input:{
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos:{
    alignItems: "center"
  }
});
