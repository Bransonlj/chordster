import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import SongForm from './views/SongForm/SongForm.tsx'
import SongDetails from './views/SongDetails/SongDetails.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SongForm />
  </React.StrictMode>,
)
