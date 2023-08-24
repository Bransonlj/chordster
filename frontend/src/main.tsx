import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.scss'
import SongForm from './views/SongForm/SongForm.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import LoginPage from './views/Login/LoginPage.tsx'
import SignupPage from './views/Signup/SignupPage.tsx'
import MainNavBar from './views/layout/MainNavBar.tsx'
import HomePage from './views/Home/HomePage.tsx'
import SongList from './views/SongList/SongList.tsx'
import SongView from './views/SongView/SongView.tsx'
import SongEdit from './views/SongForm/SongEdit.tsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={ <MainNavBar /> }>
      <Route index element={ <HomePage /> } />
      <Route path='login' element={ <LoginPage /> } />
      <Route path='signup' element={ <SignupPage /> } />
      <Route path='song'>
        <Route path='list' element={ <SongList /> } />
        <Route path='create' element={ <SongForm /> } />
        <Route path='view/:id' element={ <SongView /> } />
        <Route path='edit/:id' element={ <SongEdit /> } />
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
