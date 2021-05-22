import React, { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import Home from './pages/Home/Home'
import Auth from './pages/Auth/Auth'
import Dashboard from './pages/Dashboard/Dashboard'
import { getSession } from './utils'
import { AppProvider } from '@shopify/polaris'
import translations from "@shopify/polaris/locales/ja.json";
import Verification from './pages/Auth/Verification'
import AppInstall from './pages/Auth/AppInstall'
import Callback from './pages/Auth/Callback'
import ShopDomain from './pages/Auth/ShopDomain'

import {
  userPool,
} from './utils'

export default function App() {
  useEffect(()=>{
    if( !window.location.pathname.match(/auth/) &&
        !userPool.getCurrentUser()?.getSession(function(error,session){return session.accessToken.jwtToken})
    ){
      window.location = "/auth/login?flash=ログインしてください";
    }
  }, []);
  return (
    <AppProvider i18n={translations}>
      <Router>
        <Switch>
          {/* Authグループ */}
          <Route path='/auth/register' component={Auth} />
          <Route exact path='/auth/verification/:email' component={Verification} />
          <Route path='/auth/login' component={Auth} />
          <Route path='/auth/callback' component={Callback} />
          <Route path='/auth/shop_domain' component={ShopDomain} />
          <Route exact path='/auth' component={AppInstall} />
          {/* Authグループ 終了 */}

          <Route path='/top' component={Home} />
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