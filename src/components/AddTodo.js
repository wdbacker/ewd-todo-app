import React, { Component, PropTypes } from 'react';
import { addTodo } from 'actions/todos';
import fetch from 'isomorphic-fetch';

export default class AddTodo extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    controller: PropTypes.object.isRequired,
  }

  shouldComponentUpdate() {
    // component has no props or state change so it is safe to just return `false`
    return false;
  }

  handleAddTodo(e) {
    const { dispatch, controller } = this.props;

    e.preventDefault();
    const input = this.refs.todo;
    const value = input.value.trim();
    if (value) {
      // eslint-disable-next-line no-undef
      if (CSP_REST_MODE) {
        let headers = new Headers({
    			"Content-Type": 'application/json',
          //"Authorization": 'Basic ' + btoa('myUser:myPassword'),
    		});
        // eslint-disable-next-line no-undef
        fetch(CSP_URL, {
          method: 'POST',
          mode: 'cors', //(cors is the default)
          headers: headers,
          body: JSON.stringify({
            Description: value,
            Active: true
          }),
          timeout: 10000
        })
        .then(response => response.json())
        .then(function(response) {
          dispatch(addTodo(response.id, value));
          controller.toastr('warning', 'Todo ' + response.id + ' added: ' + value);
        })
      }
      else { // EWD 3 mode using WebSockets/Ajax
        let messageObj = {
  				type: 'addTodo',
  				//ajax: true,
  				params: {
  					text: value,
            completed: false
  				}
  			};
  			controller.send(messageObj, function(messageObj) {
  				dispatch(addTodo(messageObj.message.id, value));
  				controller.toastr('warning', 'Todo ' + messageObj.message.id + ' added: ' + value);
  			});
      }
      input.value = '';
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={e => this.handleAddTodo(e)}>
          <input className="form-control" type="text" placeholder="Enter ToDo" ref="todo"/>
        </form>
        <br/>
      </div>
    );
  }
}
