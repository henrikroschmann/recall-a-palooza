import { configureStore } from '@reduxjs/toolkit';
import { deckApi } from './utils/slices/DeckApi';
import { sessionApi } from './utils/slices/SessionApi';


const store = configureStore({
    reducer: {
      [deckApi.reducerPath]: deckApi.reducer,
      [sessionApi.reducerPath]: sessionApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .concat(deckApi.middleware)
        .concat(sessionApi.middleware),
  });
  
  export default store;