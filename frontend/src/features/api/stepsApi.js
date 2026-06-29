import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getApiBaseUrl } from '../../utils/apiConfig.js'

export const stepsApi = createApi({
  reducerPath: 'stepsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Steps'],
  endpoints: (builder) => ({
    getSteps: builder.query({
      query: () => '/steps',
      providesTags: ['Steps'],
    }),
    createStep: builder.mutation({
      query: (body) => ({ url: '/steps', method: 'POST', body }),
      invalidatesTags: ['Steps'],
    }),
    updateStep: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/steps/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Steps'],
    }),
    deleteStep: builder.mutation({
      query: (id) => ({ url: `/steps/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Steps'],
    }),
  }),
})

export const {
  useGetStepsQuery,
  useCreateStepMutation,
  useUpdateStepMutation,
  useDeleteStepMutation,
} = stepsApi