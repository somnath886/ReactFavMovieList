import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom"
import { Container } from "semantic-ui-react"

import "semantic-ui-css/semantic.min.css"
import './App.css'
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import WatchList from "./pages/WatchList"
import MenuBar from "./components/menuBar"
import AuthRoute from "./util/authRoute"
import {AuthProvider} from "./context/auth"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/register" component={Register} />
          <AuthRoute exact path="/login" component={Login} />
          <Route exact path="/watchlist" component={WatchList} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;