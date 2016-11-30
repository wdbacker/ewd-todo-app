import * as types from 'constants/ActionTypes';

// define action methods for each action for use with Redux dispatch method
export const loadTodos = (todos) => ({ type: types.LOAD_TODOS, todos });
export const addTodo = (id, text) => ({ type: types.ADD_TODO, text, id });
export const completeTodo = (id, isCompleted) => ({ type: types.COMPLETE_TODO, id, isCompleted });
export const changeFilter = filter => ({ type: types.CHANGE_FILTER, filter });
export const deleteTodo = id => ({ type: types.DELETE_TODO, id });
export const deleteAllTodos = () => ({ type: types.DELETE_ALL_TODOS });
