import SocketProvider from 'context/socketManager'
import SocketLayout from 'layout/SocketLayout'
import {
  createRoutesFromElements,
  Route,
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router-dom'
import Home from 'screen/Home'
import Login from 'screen/Login'
import Room from 'screen/Room'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='' element={<Outlet />}>
      <Route path='' element={<SocketLayout />}>
        <Route index element={<Home />} />
        <Route path='/:roomName' element={<Room />} />
      </Route>
      <Route path='login' element={<Login />} />
    </Route>,
  ),
)
const Router = () => {
  return (
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  )
}

export default Router
