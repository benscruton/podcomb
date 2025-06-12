import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router";
import {
  NavBar
} from "./components";
import {
  Comb,
  Home,
  Login,
  NewComb,
  User
} from './views'
import AppContext from "./context/AppContext";
// import './App.css'

const serverUrl = "http://localhost:8000";

const App = () => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );

  return (
    <div>
      <AppContext.Provider value={{
        serverUrl,
        userData,
        setUserData
      }}>
        <BrowserRouter>
          <NavBar />

          <Routes>
            <Route path = "/" element = {
              <Home />
            } />

            <Route path = "/login" element = {
              <Login />
            } />

            <Route path = "/combs" element = {
              <NewComb />
            } />

            <Route path = "/combs/:combId" element = {
              <Comb />
            } />

            <Route path = "/users" element = {
              <User />
            } />

          </Routes>

          {/* <TestButtons /> */}

        </BrowserRouter>
      </AppContext.Provider>
    </div>
  )
}

export default App
