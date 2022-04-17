import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';
//import theme from './theme';
import './main.scss';


const container = document.getElementById('root');

const root = ReactDOMClient.createRoot(container as Element);

// Initial render
root.render(<App />);
