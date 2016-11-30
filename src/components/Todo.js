import React, { PropTypes } from 'react';
import { deleteTodo, completeTodo } from 'actions/todos';
import PureComponent from './PureComponent';
import cn from 'classnames';

export default class Todo extends PureComponent {

  static propTypes = {
    todo: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    controller: PropTypes.object.isRequired,
  }

  componentWillMount() {
    console.info('%cToDo mounting- ID: ' + this.props.todo.get('id'), 'color:green; font-weight:bold;');
  }

  componentWillUpdate(nextProps) {
    console.info('%cToDo updating - ID: ' + nextProps.todo.get('id'), 'color:blue; font-weight:bold;');
  }

  componentWillUnmount() {
    console.info('%cToDo unmounting - ID: ' + this.props.todo.get('id'), 'color:orange; font-weight:bold;');
  }

  handleCompleteTodo(id, text, isCompleted) {
    const { dispatch, controller } = this.props;

    // eslint-disable-next-line no-undef
    if (CSP_REST_MODE) {
      let headers = new Headers({
  			"Content-Type": 'application/json',
        //"Authorization": 'Basic ' + btoa('myUser:myPassword'),
  		});
      // eslint-disable-next-line no-undef
      fetch(CSP_URL + '/' + id, {
        method: 'POST',
        mode: 'cors', //(cors is the default)
        headers: headers,
        body: JSON.stringify({
          Description: text,
          Active: !isCompleted
        }),
        timeout: 10000
      })
      .then(response => response.json())
      .then(function(response) {
        console.log(response);
        dispatch(completeTodo(id, isCompleted));
      })
    }
    else { // EWD 3 mode using WebSockets/Ajax
      let messageObj = {
  			type: 'completeTodo',
  			params: {
  				id: id,
          isCompleted: isCompleted
  			}
  		};
  		controller.send(messageObj, function(messageObj) {
        dispatch(completeTodo(messageObj.message.id, messageObj.message.isCompleted));
  			controller.toastr('warning', 'Todo ' + id +  ' (un)completed');
  		});
    }
  }

  handleDeleteTodo(id) {
    const { dispatch, controller } = this.props;

    // eslint-disable-next-line no-undef
    if (CSP_REST_MODE) {
      let headers = new Headers({
  			"Content-Type": 'application/json',
        //"Authorization": 'Basic ' + btoa('myUser:myPassword'),
  		});
      // eslint-disable-next-line no-undef
      fetch(CSP_URL + '/' + id, {
        method: 'DELETE',
        mode: 'cors', //(cors is the default)
        headers: headers,
        timeout: 10000
      })
      .then(response => response.json())
      .then(function(response) {
        console.log(response);
        dispatch(deleteTodo(id));
      })
    }
    else { // EWD 3 mode using WebSockets/Ajax
      let messageObj = {
  			type: 'deleteTodo',
  			//ajax: true,
  			params: {
  				id: id
  			}
  		};
  		controller.send(messageObj, function(messageObj) {
  			dispatch(deleteTodo(id));
  			controller.toastr('warning', 'Todo ' + id +  ' deleted');
  		});
    }
  }

  render() {
    const { id, text, isCompleted } = this.props.todo.toObject();
    const classNames = cn('todo', {
      completed: isCompleted,
    });
    return (
      <li className="list-group-item">
        <span className={classNames}
            onClick={() => this.handleCompleteTodo(id, text, !isCompleted)}>
          {text}
        </span>
        <div className="close"
            onClick={() => this.handleDeleteTodo(id)}>
          &times;
        </div>
      </li>
    );
  }
}
