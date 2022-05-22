import * as React from 'react';
//import App from './App';
//import theme from './theme';
import './main.scss';
import ReactDOM from 'react-dom';
import AppNew from 'AppNew';
import { BrowserRouter } from 'react-router-dom';
import App_ from 'App_';

ReactDOM.render(
  <BrowserRouter>
    <App_ />
  </BrowserRouter>,
  document.getElementById('root')
);
