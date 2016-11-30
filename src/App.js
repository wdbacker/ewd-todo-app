/*
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
				Ward has changed this!
      </div>
    );
  }
}

export default App;
*/

import React, { PropTypes } from 'react';
import PureComponent from 'components/PureComponent';
import { connect } from 'react-redux';
import TodoList from 'components/TodoList';
import AddTodo from 'components/AddTodo';
import Footer from 'components/Footer';

class App extends PureComponent {

  static propTypes = {
    activeFilter: PropTypes.string.isRequired,
    todoList: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  render() {
    const { dispatch, activeFilter, todoList } = this.props;
    return (
      <div className="app">
        <div className="todos">
          <h1>ToDo App</h1>
          <AddTodo dispatch={dispatch} />
          <TodoList dispatch={dispatch} activeFilter={activeFilter} todoList={todoList} />
          <Footer dispatch={dispatch} activeFilter={activeFilter} />
        </div>
        <small className="signature">by <b>Ivan Rogić</b> from <b>Toptal</b></small>
      </div>
    );
  }
}

const mapStateToProps = state => ({ ...state.todos });

export default connect(mapStateToProps)(App);
