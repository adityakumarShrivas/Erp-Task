import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const formsApi = createApi({
  reducerPath: 'formsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('Authorization', `Bearer ${token}`)
      return headers
    },
  }),
  tagTypes: ['Forms'],
  endpoints: (builder) => ({
    getForms: builder.query({
      query: () => '/forms',
      providesTags: ['Forms'],
    }),
    getFormById: builder.query({
      query: (id) => `/forms/${id}`,
    }),
    createForm: builder.mutation({
      query: (body) => ({ url: '/forms', method: 'POST', body }),
      invalidatesTags: ['Forms'],
    }),
    updateForm: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/forms/${id}`, method: 'PUT', body }),
      invalidatesTags: ['Forms'],
    }),
    deleteForm: builder.mutation({
      query: (id) => ({ url: `/forms/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Forms'],
    }),
  }),
})

export const {
  useGetFormsQuery,
  useGetFormByIdQuery,
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
} = formsApi