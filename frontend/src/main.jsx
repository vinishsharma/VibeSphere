import React from 'react'
import { StrictMode } from 'react'
import './index.css'
import { createRoot } from 'react-dom/client'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import Profile from './pages/Profile.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import PrivateRoute from './routes/PrivateRoute.jsx'
import CreatePost from './pages/CreatePost.jsx'
import SearchUser from './pages/SearchUser.jsx'
import Explore from './pages/Explore.jsx'
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/search-user" element={<SearchUser />} />
        <Route path="/explore" element={<Explore />} />
      </Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <StrictMode>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </StrictMode>
  </AuthProvider>
)

