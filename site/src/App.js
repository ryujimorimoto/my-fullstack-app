import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom'
import Home from './pages/Home/Home'
import Auth from './pages/Auth/Auth'
import Dashboard from './pages/Dashboard/Dashboard'
import { getSession } from './utils'
import { AppProvider } from '@shopify/polaris'
import translations from "@shopify/polaris/locales/ja.json";
import Verification from './pages/Auth/Verification'


export default function App() {
  useEffect(()=>{
    console.log("session:", getSession())
  }, []);
  return (
    <AppProvider i18n={translations}>
      <Router>
        <Switch>
          <Route path='/register'>
            <Auth />
          </Route>
          <Route exact path='/verification/:email' component={Verification} />
          <Route path='/login'>
            <Auth />
          </Route>
          <PrivateRoute
            exact
            path='/'
            component={Dashboard}
          />
        </Switch>
      </Router>
    </AppProvider>
  )
}

/**
 * A component to protect routes.
 * Shows Auth page if the user is not authenticated
 */
const PrivateRoute = ({ component, ...options }) => {

  const session = getSession()

  const finalComponent = session ? Dashboard : Auth
  return <Route {...options} component={finalComponent} />
}