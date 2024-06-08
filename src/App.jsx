import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "./firebaseConfig";
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AttendanceSystem from './Attendance'
import "./App.css";
import Scanned from './Scanned'
import Scanner from './Scanner'
import Register from "./AddSnksar";
import Transcript from "./Transcript";
import UserList from './Snksars'
import ViewUser from './SingleSnk'
import IDCard from './IDCard'
import Login from './Auth/Login'
import UpdateMember from './UpdateMember'
import { onAuthStateChanged } from "firebase/auth";
import { Protected } from "./Protected";
function App() {
  const [user, setUser] = useState(null)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        return;
      }
      setUser(null)
    })
    return () => unsubscribe()
  }, [])

  const router = createBrowserRouter([
    {
      path: "/members",
      element: <Protected user={user}><UserList></UserList></Protected>
    },
    {
      path: "/idcard",
      element: <Protected user={user}><IDCard></IDCard></Protected>
    },
    {
      path: "/scanner",
      element: <Protected user={user}><Scanner></Scanner></Protected>
    },

    {
      path: "/transcript/:userId",
      element: <Protected user={user}><Transcript></Transcript></Protected>
    },
    {
      path: "/update/:userId",
      element: <Protected user={user}><UpdateMember></UpdateMember></Protected>
    },
    {
      path: "/attendance",
      element: <Protected user={user}><AttendanceSystem></AttendanceSystem></Protected>
    },
    {
      path: "/:userId",
      element: <Scanned></Scanned>
    },
    {
      path: "/register",
      element: <Protected user={user}><Register></Register></Protected>
    },
    {
      path: "/",
      element: <Login></Login>
    },
    {
      path: "/members/:userId",
      element: <Protected user={user}><ViewUser /></Protected>
    },

  ])

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
