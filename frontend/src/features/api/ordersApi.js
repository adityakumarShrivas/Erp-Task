import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),
    createOrder: builder.mutation({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Orders'],
    }),
    startWorkflow: builder.mutation({
      query: (id) => ({ url: `/orders/${id}/start`, method: 'POST' }),
      invalidatesTags: ['Orders'],
    }),
  }),
})

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useStartWorkflowMutation,
} = ordersApi