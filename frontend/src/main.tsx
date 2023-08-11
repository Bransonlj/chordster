import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import SongForm from './views/SongForm/SongForm.tsx'
import SongDetails from './views/SongDetails/SongDetails.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import LoginPage from './views/Login/LoginPage.tsx'
import SignupPage from './views/Signup/SignupPage.tsx'
import MainNavBar from './views/layout/MainNavBar.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={ <MainNavBar /> }>
      <Route path='login' element={ <LoginPage /> } />
      <Route path='signup' element={ <SignupPage /> } />
      <Route path='song'>
        <Route path='create' element={ <SongForm /> } />
      </Route>
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router}/>
    </AuthContextProvider>
  </React.StrictMode>,
)
