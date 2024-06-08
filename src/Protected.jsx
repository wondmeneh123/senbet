import { Navigate } from "react-router-dom"

export const Protected = ({children, user}) => {
  return user ? children :  <Navigate to='/'></Navigate>
}
