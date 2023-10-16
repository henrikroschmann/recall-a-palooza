// Need to use the React-specific entry point to allow generating React hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Session } from '../../types';


// Define a service using a base URL and expected endpoints
export const sessionApi = createApi({
  reducerPath: 'sessionApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/session/' }),
  endpoints: (builder) => ({
    getsessionById: builder.query<Session, string>({
      query: (sessionId) => `${sessionId}`,
    }),
    fetchAllsessions: builder.query<Session[], void>({
      query: () => '',
    }),
    createPost: builder.mutation<Session, Partial<Session>>({
      query: (newsession) => ({
        url: '',
        method: 'POST',
        body: newsession,
      }),
    }),
    updatesessionById: builder.mutation<void, { id: string; updates: Partial<Session> }>({
      query: ({ id, updates }) => ({
        url: `${id}`,
        method: 'PUT',
        body: updates,
      }),
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  useGetsessionByIdQuery,
  useFetchAllsessionsQuery,
  useCreatePostMutation,
  useUpdatesessionByIdMutation,
} = sessionApi