import React, { Component } from 'react'
import {
  Link,
  withRouter
} from 'react-router-dom'
import styles from './Home.module.css'
import {
  logout,
} from '../../utils'
export default function Home(props){
  return (
    <div className="container text-center">
      ログイン後のページ
      <Link onClick={() => logout()}>ログアウト</Link>
    </div>
  )
}

