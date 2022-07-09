import ReactDOM from 'react-dom/client';
import App from "./App";
import {persistor, store} from "./store";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import * as React from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App/>
        </PersistGate>
    </Provider>
);