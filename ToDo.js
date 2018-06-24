import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default class ToDo extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      isEditing: false,
      toDoValue: props.text
    }
  }

  render(){
    const { isEditing, toDoValue } = this.state;
    const { text, id, isCompleted, deleteToDo } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPressOut={this._toggleComplete}>
            <View
              style={[
                styles.circle,
                isCompleted ? styles.isCompleted : styles.isUnCompleted
              ]} />
              </TouchableOpacity>
              { isEditing ? (
                <TextInput
                  style={[
                    styles.text,
                    styles.input,
                    isCompleted ? styles.isCompletedText : styles.isUnCompletedText
                  ]}
                  value={toDoValue}
                  multiline={true}
                  onChangeText={this._controlInput}
                  autoCorrect={false}
                  returnKeyType={'done'}
                  onBlur={this._finishEditing}
                  />
              ):(
                <Text
                style={[
                  styles.text,
                  isCompleted ? styles.isCompletedText : styles.isUnCompletedText
                ]}>
                {text}
                </Text>
              )}
        </View>
        {isEditing ? (
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._finishEditing}>
              <Feather name="check" size={20} style={styles.actionContainer} />
            </TouchableOpacity>
          </View>
        ):(
          <View style={styles.actions}>
            <TouchableOpacity onPressOut={this._startEditing}>
              <Feather name="edit" size={20} style={styles.actionContainer} />
            </TouchableOpacity>
            <TouchableOpacity
              onPressOut={(event) =>{
                event.stopPropagation;
                deleteToDo(id);
              }
             }>
              <Feather name="x" size={20} color={'#F23657'} style={styles.actionContainer} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  _toggleComplete = (event) => {
    event.stopPropagation;
    const { isCompleted, completedToDo, uncompletedToDo, id} = this.props;
    if(isCompleted){
      uncompletedToDo(id);
    } else {
      completedToDo(id)
    }

  }
  _startEditing = (event) => {
    event.stopPropagation;
    this.setState({
      isEditing: true
    })
  }
  _finishEditing = (event) => {
    event.stopPropagation;
    const { toDoValue } = this.state;
    const {id, updateToDo} = this.props;
    updateToDo(id, toDoValue);
    this.setState({
      isEditing: false
    })
  }
  _controlInput = (text) => {
    this.setState({
      toDoValue: text
    })
  }
}

const styles = StyleSheet.create({
  container:{
    width: width-50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  circle:{
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20
  },
  isCompleted:{
    borderColor: '#bbb'
  },
  isUnCompleted:{
    borderColor: '#F23657',
  },
  text:{
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 20
  },
  isCompletedText:{
    color: "#bbb",
    textDecorationLine:"line-through"
  },
  isUnCompletedText:{
    color: "#353839"
  },
  column:{
    flexDirection: "row",
    alignItems: "center",
    width: width/2
  },
  actions:{
    flexDirection: "row"
  },
  actionContainer:{
    marginVertical: 10,
    marginHorizontal: 10
  },
  input:{
    width: width/2
  }
})
