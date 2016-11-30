import React, { PropTypes, createFactory } from 'react';
import PureComponent from './PureComponent';
import { connect } from 'react-redux';
import TodoList from './TodoList';
import AddTodo from './AddTodo';
import Footer from './Footer';
import { loadTodos } from 'actions/todos';
import { ToastContainer, ToastMessage } from 'react-toastr';

// create <App> instance
class App extends PureComponent {
  static propTypes = {
    activeFilter: PropTypes.string.isRequired,
    todoList: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    controller: PropTypes.object.isRequired,
  }

  componentWillMount() {
    // load and augment the ewd-client (controller)
    // with toastr to display warnings
    const { controller } = this.props;
    const component = this;

    controller.log = true;

    controller.toastr = function(type, text) {
      if (type && type !== '' && component._toastContainer && component._toastContainer[type]) {
        component._toastContainer[type](text);
      }
    };

    controller.displayError = function(error) {
      controller.toastr('error', error);
    };

    // display generic EWD.js errors using toastr:
    controller.on('error', function(messageObj) {
      controller.displayError(messageObj.message.error);
    });
  }

  // when App component is mounted, load existing Todo's from database (handleLoadTodos)
  componentDidMount() {
    const { controller } = this.props;
    console.log('App started, loading todos ...');
    this.handleLoadTodos();
		controller.toastr('success', 'Todo App started!');
  }

  handleLoadTodos() {
    const { dispatch, controller } = this.props;

    // code splitting tip: this controller code should be moved inside actions/todos.js using thunk middleware
    // and we should only fire a dispatch(requestLoadTodos()) call here (using redux-thunk async actions)
    // see other ewd-test-app repository example to see how this works ('ewd-xpress-react' is replaced by 'react-ewd' module)

    // eslint-disable-next-line no-undef
    console.log('Operating in CSP_REST_MODE? ', CSP_REST_MODE);
    // eslint-disable-next-line no-undef
    if (CSP_REST_MODE) { // in this mode, the Caché CSP/REST gateway is called directly, see config/env.js
      let headers = new Headers({
  			"Content-Type": 'application/json',
        //"Authorization": 'Basic ' + btoa('myUser:myPassword'),
  		});
      // assemble the fetch() call to CSP/REST
      // eslint-disable-next-line no-undef
      fetch(CSP_URL, {
        method: 'GET',
        mode: 'cors', //(cors is the default)
        headers: headers,
        timeout: 10000
      })
      .then(response => response.json())
      .then(function(response) {
        console.log(response);
        // translate the Caché class response to the right array format our app expects
        let todos = [];
        response.children.forEach(function(child) {
          todos.push({
            id: child.ID,
            text: child.Description,
            isCompleted: !child.Active
          });
        })
        // dispatch the loadTodos() action with the properly formatted todos array
        // to the corresponding action method, see actions/todos.js
        dispatch(loadTodos(todos));
      })
    }
    else { // EWD 3 mode using WebSockets/Ajax
      let messageObj = {
				type: 'loadTodos',
				//ajax: true,
				params: {}
			};
      // do the same as in CSP/REST mode, but using the EWD 3/Node.js back-end
			controller.send(messageObj, function(messageObj) {
				dispatch(loadTodos(messageObj.message.todos));
			});
    }
  }

  // render our main App component
  render() {
    const { controller, dispatch, activeFilter, todoList } = this.props;
		const ToastMessageFactory = createFactory(ToastMessage.animation);

    // create our main App view with our own subcomponents, passing in the necessary properties
    return (
      <div className="app">
        <div className="todos">
					<ToastContainer
						ref={(c) => (this._toastContainer = c)} // strings refs are deprecated
						toastMessageFactory={ToastMessageFactory}
						className="toast-top-right"
						newestOnTop={true}
						target="body"
					/>
        <h1>React ToDo App</h1>
          <AddTodo controller={controller} dispatch={dispatch} />
          <TodoList controller={controller} dispatch={dispatch} activeFilter={activeFilter} todoList={todoList} />
          <Footer controller={controller} dispatch={dispatch} activeFilter={activeFilter} />
        </div>
        <small className="signature">by <b>Ivan Rogić</b> from <b>Toptal</b></small><br/>
        <small className="signature">modified for InterSystems Caché &amp; EWD 3 by <b>Ward De Backer, Stabe nv</b></small>
      </div>
    );
  }
}

// map the todos substate to the App component state
const mapStateToProps = state => ({ ...state.todos });
// connect the App state to its props using Redux
export default connect(mapStateToProps)(App);
