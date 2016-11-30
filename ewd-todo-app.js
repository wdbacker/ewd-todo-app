// EWD 3/Node.js back-end module for ewd-todo-app
// put this in your ewd3/node_modules directory
module.exports = {

  // allow service calls from React tools (helper functions)
  servicesAllowed: {
    'ewd-react-tools': true
  },

  handlers: {
    addTodo: function(messageObj, session, send, finished) {
      // add ToDo to ^ToDos global using ewd-document-store methods
      var todos = new this.documentStore.DocumentNode('ToDos');
      console.log('todos lastChild: ', todos.lastChild);
      var id = todos.lastChild.name == '' ? 1 : parseInt(todos.lastChild.name) + 1;
      console.log('todos id: ', id);
      todos.$(id).setDocument({
        text: messageObj.params.text,
        completed: false
      });
      console.log('todos: ', todos.getDocument(true));
      finished({ id: id, text: 'You added in EWD 3: ' + messageObj.params.text });
    },

    loadTodos: function(messageObj, session, send, finished) {
      // load ToDo's from ^ToDos global using ewd-document-store methods and return to React app
      var todos = new this.documentStore.DocumentNode('ToDos');
      var todosList = [];
      todos.forEachChild(function (id, child) {
        todosList.push({
          id: id,
          text: child.$('text').value,
          isCompleted: child.$('completed').value
        });
      });
      finished({ todos: todosList });
    },

    completeTodo: function(messageObj, session, send, finished) {
      // set ToDo completed using ewd-document-store methods
      var todos = new this.documentStore.DocumentNode('ToDos');
      var id = messageObj.params.id;
      var isCompleted = todos.$(id).$('completed').value;
      isCompleted = !isCompleted;
      todos.$(id).$('completed').value = isCompleted;
      finished({ id: id, isCompleted: isCompleted });
    },

    deleteTodo: function(messageObj, session, send, finished) {
      // delete a ToDo
      var todos = new this.documentStore.DocumentNode('ToDos');
      var id = messageObj.params.id;
      todos.$(id).delete();
      finished({ id: id });
    },

    deleteAllTodos: function(messageObj, session, send, finished) {
      // delete complete ^ToDos global
      var todos = new this.documentStore.DocumentNode('ToDos');
      todos.delete();
      finished({});
    }
  },

  workerResponseHandlers: {
    // allow interception by master process to augment / process the request after authentication in worker
  }

};
