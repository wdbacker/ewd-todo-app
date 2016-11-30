import React, { PropTypes } from 'react';
import PureComponent from 'components/PureComponent';
//import { render } from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import App from 'components/App';
import reducers from '../reducers';
import 'styles/app.scss';
import 'bootstrap/dist/css/bootstrap.css';

// devToolsExtension is needed to enable Redux DevTools
const store = createStore(reducers, window.devToolsExtension && window.devToolsExtension());
/*
  to move action code in components to actions/todos.js, you need to use redux-thunk & pass in ewd-client using withExtraArgument()
  see other ewd-test-app repository example to see how this works ('ewd-xpress-react' is replaced by 'react-ewd' module)
*/

// main AppContainer component (the ewd-client instance is passed in as prop 'controller')
export default class AppContainer extends PureComponent {
  static propTypes = {
    controller: PropTypes.object.isRequired,
  }
  // instantiates the Redux Provider with its store instance & our <App> component
  render() {
		const { controller } = this.props;
    return (
			<Provider store={store}>
				<App controller={controller} />
			</Provider>
    );
  }
}
