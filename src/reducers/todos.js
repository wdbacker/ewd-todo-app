import * as types from 'constants/ActionTypes';
import { List, Map } from 'immutable';
import { combineReducers } from 'redux';

// define a todoList reducer method called by Redux
// modifies the todoList state object in Redux
// you need to return a new state always and the action data needs to be copied to the state
// for complex data structures like objects, arrays, ..., use deepAssign method from immutableJS

function todoList(state = List(), action) {
  switch (action.type) {
    case types.LOAD_TODOS:
      console.log('todos', action.todos);
      action.todos.forEach(function(todo, index) {
        console.log('todo', index, todo);
        state = state.push(Map({
          id: todo.id,
          text: todo.text,
          isCompleted: todo.isCompleted
        }))
      });
      console.log('state', state);
      return state;

    case types.ADD_TODO:
      return state.push(Map({
        id: action.id,
        text: action.text,
        isCompleted: false,
      }));

    case types.COMPLETE_TODO:
      // map through todos to find matching ID
      return state.map(todo => {
        if (todo.get('id') === action.id) {
          return todo.update('isCompleted', v => action.isCompleted);
        }
        return todo;
      });

    case types.DELETE_TODO:
      return state.filter(todo => todo.get('id') !== action.id);

    case types.DELETE_ALL_TODOS:
      return state.clear();

    default:
      return state;
  }
}

function activeFilter(state = 'all', action) {
  switch (action.type) {
    case types.CHANGE_FILTER:
      console.info('%cFilter changed: ' + action.filter.toUpperCase(), 'color:red; font-weight:bold;');
      return action.filter;

    default:
      return state;
  }
}

// all (sub)reducers must be combined to one single reducer
// Redux creates only one store for the whole application
export default combineReducers({
  activeFilter,
  todoList,
});
