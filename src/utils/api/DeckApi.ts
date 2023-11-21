import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Deck } from "../../types";

export const deckApi = createApi({
  reducerPath: "deckApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/deck/" }),
  endpoints: (builder) => ({
    getDeckById: builder.query<Deck, string>({
      query: (deckId: string) => `${deckId}`,
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
    deleteDeckById: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetDeckByIdQuery,
  useFetchAllDecksQuery,
  useCreatePostMutation,
  useUpdateDeckByIdMutation,
  useDeleteDeckByIdMutation,
} = deckApi;
