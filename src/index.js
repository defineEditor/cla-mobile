import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import store from './redux/store.js';
import App from './core/app.js';
import theme from './core/theme.js';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </Provider>
    ,
    document.querySelector('#root'),
);

serviceWorkerRegistration.register();
