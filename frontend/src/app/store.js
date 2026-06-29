import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import { authApi }    from '../features/api/authApi.js'
import { stepsApi }   from '../features/api/stepsApi.js'
import { formsApi }   from '../features/api/formsApi.js'
import { ordersApi }  from '../features/api/ordersApi.js'
import { processApi } from '../features/api/processApi.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]:    authApi.reducer,
    [stepsApi.reducerPath]:   stepsApi.reducer,
    [formsApi.reducerPath]:   formsApi.reducer,
    [ordersApi.reducerPath]:  ordersApi.reducer,
    [processApi.reducerPath]: processApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      stepsApi.middleware,
      formsApi.middleware,
      ordersApi.middleware,
      processApi.middleware,
    ),
})

export default store