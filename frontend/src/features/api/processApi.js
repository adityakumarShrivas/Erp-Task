import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const processApi = createApi({
  reducerPath: 'processApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Process'],
  endpoints: (builder) => ({
    getProcessByOrder: builder.query({
      query: (orderId) => `/process/order/${orderId}`,
      providesTags: ['Process'],
    }),
    getAllProcesses: builder.query({
      query: () => '/process',
      providesTags: ['Process'],
    }),
    getMyTasks: builder.query({
      query: () => '/process/my-tasks',
      providesTags: ['Process'],
    }),
    getNotifications: builder.query({
  query: () => '/process/notifications',
  providesTags: ['Process'],
}),
    completeStep: builder.mutation({
      query: ({ processId, stepId, ...body }) => ({
        url:    `/process/${processId}/steps/${stepId}/complete`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Process'],
    }),
  }),
})

export const {
  useGetProcessByOrderQuery,
  useGetAllProcessesQuery,
  useGetMyTasksQuery,
  useCompleteStepMutation,
  useGetNotificationsQuery,
} = processApi