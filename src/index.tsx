import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import Overview from './components/Overview';
import TrialsDetail from './components/TrialsDetail';
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  (
    // <BrowserRouter>
    //   <Switch>
    // {/* 错误示范 用route这样包裹path / 这个路径就不能正确匹配, 只能显示 单一oview/detail的页面, 会丢掉nav的内容*/}
    //     <Route path="/" component={App}>
    //       <Route path="/oview" component={Overview} ></Route>
    //       <Route path="/detail" component={TrialsDetail}></Route>
    //     </Route>
    //     <Redirect to="/oview"/>
    //   </Switch>
    // </BrowserRouter>

    <BrowserRouter>
      <Switch>
        <App path="/">
          <Route path="/oview" component={Overview} ></Route>
          <Route path="/detail" component={TrialsDetail}></Route>
          {/* 以上都匹配不上，开始redirect */}
          <Redirect to="/oview"/>
        </App>
      </Switch>
    </BrowserRouter>
  ),
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
