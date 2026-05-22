import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import './index.css';
import  store from "./store/cartStore.js"
import { Provider } from 'react-redux';
import "./i18n.js";
import { initGA } from './analytics.js';


initGA();
ReactDOM.createRoot(document.getElementById('root')).render(
<Provider store={store}><App /></Provider>);
