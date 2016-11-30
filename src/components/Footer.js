import React, { PropTypes } from 'react';
import { deleteAllTodos, changeFilter } from 'actions/todos';
import PureComponent from './PureComponent';
import cn from 'classnames';

export default class Footer extends PureComponent {

  static propTypes = {
    activeFilter: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }

  filters = ['all', 'completed', 'active']

  handleDeleteAllTodos() {
    const { dispatch, controller } = this.props;

    // eslint-disable-next-line no-undef
    if (CSP_REST_MODE) {
      let headers = new Headers({
  			"Content-Type": 'application/json',
        //"Authorization": 'Basic ' + btoa('myUser:myPassword'),
  		});
      // eslint-disable-next-line no-undef
      fetch(CSP_URL, {
        method: 'DELETE',
        mode: 'cors', //(cors is the default)
        headers: headers,
        timeout: 10000
      })
      .then(response => response.json())
      .then(function(response) {
        console.log(response);
        dispatch(deleteAllTodos());
      })
    }
    else { // EWD 3 mode using WebSockets/Ajax
      let messageObj = {
  			type: 'deleteAllTodos',
  			//ajax: true,
  			params: {
  			}
  		};
  		controller.send(messageObj, function(messageObj) {
  			dispatch(deleteAllTodos());
  			controller.toastr('warning', 'all todos deleted');
  		});
    }
  }

  // look at the filters.map() method (uses standard JS for loop through todo list)
  render() {
    const { dispatch } = this.props;
    return (
      <div>
        <div className="btn-group">
          {this.filters.map(filter => {
            const className = cn('btn btn-default capitalize', {
              active: this.props.activeFilter === filter,
            });
            return (
              <button key={filter} className={className} onClick={() => dispatch(changeFilter(filter))}>
                {filter}
              </button>
            );
          })}
        </div>
        <div className="pull-right">
          <button className="btn btn-danger" onClick={() => this.handleDeleteAllTodos()}>Delete all</button>
        </div>
      </div>
    );
  }
}
