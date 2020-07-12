import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'

// establishes socket connection
import './socket'

// *** React Hooks Store
import {StoreProvider} from './context/StoreContext'

ReactDOM.render(
  <StoreProvider>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </StoreProvider>,
  document.getElementById('app')
)
