import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import categoryReducer from '../slice/category'
import productReducer from '../slice/product'
import authReducer from '../slice/auth'
import cartReducer from '../slice/cart'

const rootReducer= combineReducers({
    categories: categoryReducer,
    products : productReducer,
    auth: authReducer,
    cart: cartReducer
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
});


export let persistor = persistStore(store);
