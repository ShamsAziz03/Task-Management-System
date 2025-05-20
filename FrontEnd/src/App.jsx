import './App.css'
import AllApp from './components/AllApp' 
import LogIn from './components/LogIn'     
import React,{ useContext} from "react";
import { AppContext } from "./Context/AppContext"


function App() {
    const {logHome} = useContext(AppContext); 
  return (
    <>
    {logHome === 0 ? <LogIn /> : <AllApp />}
    </>
  )
}

export default App
