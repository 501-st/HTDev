import {configureStore, combineReducers} from "@reduxjs/toolkit";
import noteSlice from "./slice"
import {persistReducer, persistStore} from "redux-persist";
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({
    notes: noteSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer
})

export const persistor = persistStore(store);