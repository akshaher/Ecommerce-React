import ReactDOM from 'react-dom/client';

import App from './App.jsx';
import './index.css';
import  store from "./store/cartStore.js"
import { Provider } from 'react-redux';
import "./i18n.js";
import { initGA } from './analytics.js';
import {GoogleOAuthProvider} from "@react-oauth/google";

initGA();
ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="1042638165235-6imt3jlbbtqdmcsqrfros6uikpqdtinp.apps.googleusercontent.com">
    <Provider store={store}><App /></Provider>
  </GoogleOAuthProvider>
);
