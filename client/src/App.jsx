import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router";
import {
  NavBar,
  TestButtons
} from "./components";
import {
  EditComb,
  Home,
  Login
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

            <Route path = "/comb" element = {
              <EditComb />
            } />

          </Routes>

          {/* <TestButtons /> */}

        </BrowserRouter>
      </AppContext.Provider>
    </div>
  )
}

export default App
