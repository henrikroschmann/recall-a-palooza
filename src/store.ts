import { configureStore } from '@reduxjs/toolkit';
import { deckApi } from './utils/api/DeckApi';
import { sessionApi } from './utils/api/SessionApi';


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