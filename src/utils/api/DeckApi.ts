import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Deck } from "../../types";

export const deckApi = createApi({
  reducerPath: "deckApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/deck/" }),
  endpoints: (builder) => ({
    getDeckById: builder.query<Deck, string>({      
      query: (deckId?) => `${deckId}`,
    }),
    fetchAllDecks: builder.query<Deck[], void>({
      query: () => "",
    }),
    createPost: builder.mutation<Deck, Partial<Deck>>({
      query: (newDeck) => ({
        url: "",
        method: "POST",
        body: newDeck,
      }),
    }),
    updateDeckById: builder.mutation<
      void,
      { id: string; updates: Partial<Deck> }
    >({
      query: ({ id, updates }) => ({
        url: `${id}`,
        method: "PATCH",
        body: updates,
      }),
    }),
  }),
});

export const {
  useGetDeckByIdQuery,
  useFetchAllDecksQuery,
  useCreatePostMutation,
  useUpdateDeckByIdMutation,
} = deckApi;
