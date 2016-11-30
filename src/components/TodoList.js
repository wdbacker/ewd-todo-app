import React, { PropTypes } from 'react';
import PureComponent from './PureComponent';
import Todo from './Todo';

export default class TodoList extends PureComponent {

  static propTypes = {
    activeFilter: PropTypes.string.isRequired,
    todoList: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    controller: PropTypes.object.isRequired,
  }

  filterTodoList() {
    switch (this.props.activeFilter) {
      case 'completed':
        return this.props.todoList.filter(todo => todo.get('isCompleted'));
      case 'active':
        return this.props.todoList.filterNot(todo => todo.get('isCompleted'));
      default:
        return this.props.todoList;
    }
  }

  render() {
    // return todoList depending on state of activeFilter
    const todoList = this.filterTodoList();
    // render todoList in <ul> tag, notice the standerd JS array.map() method used for looping through the list!
    return (
      <div>
        {!!todoList.size && (
          <ul className="list-group">
            {todoList.map(todo => {
              return (
                <Todo key={todo.get('id')}
                    dispatch={this.props.dispatch}
                    controller={this.props.controller}
                    todo={todo}
                />
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}
