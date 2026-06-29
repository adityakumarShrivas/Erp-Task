import { createSlice } from '@reduxjs/toolkit'

const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null

const initialState = {
  user:  userFromStorage,
  token: userFromStorage?.token || null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user  = action.payload
      state.token = action.payload.token
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.user  = null
      state.token = null
      localStorage.removeItem('user')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer