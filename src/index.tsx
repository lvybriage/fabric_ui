import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import Overview from './components/Overview';
import TrialsDetail from './components/TrialsDetail';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { createBrowserHistory } from 'history';
// const history = createBrowserHistory();
ReactDOM.render(
  (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={App}>
          <Route path="/oview" component={Overview} ></Route>
          <Route path="/detail" component={TrialsDetail}></Route>
        </Route>
      </Switch>
    </BrowserRouter>
  ),
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
