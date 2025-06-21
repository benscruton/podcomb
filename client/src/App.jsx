import { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router";
import axios from "axios";
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

const serverUrl = process.env.NODE_ENV === "development" || process.env.NODE_ENV === "postgres" ?
  "http://localhost:8000" : "";

const App = () => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData"))
  );

  const logOut = () => {
    axios.get(
      `${serverUrl}/api/auth/logout`,
      {withCredentials: true}
    ).then(rsp => {
        if(rsp.data.success){
          setUserData(null);
          localStorage.removeItem("userData");
        }
      })
      .catch(e => console.error(e));
  };

  return (
    <div>
      <AppContext.Provider value={{
        serverUrl,
        userData,
        setUserData,
        logOut
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
