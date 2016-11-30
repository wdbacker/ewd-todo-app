import { loader } from 'ewd-xpress-react';
import AppContainer from 'components/AppContainer';

// to start the app, the ewd-xpress-react loader is used here and will render the app
loader({
  applicationName: 'ewd-todo-app', // application name
  MainPage: AppContainer,        // main React component for your application
	targetElementId: 'content',
	log: true,
  // eslint-disable-next-line no-undef
	url: EWD_URL,
  // implement custom ajax function using fetch()
  // by default, ewd-client tries to use $.ajax() from jQuery
	ajax: function(params, done, fail) {
		var headers = new Headers({
			"Content-Type": params.contentType || 'application/json'
		});

		fetch(params.url, {
			method: (params.type || params.method || 'GET').toUpperCase(),
			// mode: 'cors', (cors is the default)
			headers: headers,
			body: JSON.stringify(params.data || ''),
			timeout: params.timeout || 30000
		}).then(response => {
			if (response.ok) {
				return response.json().then(json => {
					done(json);
				});
			}
			else {
				throw Error(response.statusText);
			}
		}).catch(err => {
			console.log('fetch error: ', err);
			fail(err);
		});
	},
	no_sockets: false,
	registeredCallback: function() {
		console.log('registered callback called');
	},
});
