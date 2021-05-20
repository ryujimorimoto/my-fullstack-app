import config from '../config'
import axiosBase from "axios";

// TODO: 全てfetchからaxiosに変更すること！
const axios = axiosBase.create({
  baseURL: process.env.REACT_APP_PUBLIC_API_URL,
  headers: {
      'Content-Type': 'application/json',
    },
  responseType: 'json'
});
/**
 * 新規ユーザー登録
 */
export const userRegister = async (email, password, name) => {
  return await requestApi('/users/register', 'POST', { email, password, name })
}

/**
 * 新規ユーザーの認証ページ
 */
export const userVerification = async (email, code) => {
  return new Promise((resolve, reject) => {
    axios.post("/users/verification",{
      email: email,
      code: code,
    }).then((user)=>{
      resolve(user);
    }).catch(err => {
      reject(err.response.data.code);
    });
  })
  
}

/**
 * ログイン
 */
export const userLogin = async (email, password) => {
  return new Promise((resolve, reject) => {
    axios.post("/users/login",{
      email: email,
      password: password,
    }).then((user)=>{
      console.log(user)
      resolve(user);
    }).catch(err => {
      console.log(err)
      reject(err.data);
    });
  });
  // return await requestApi('/users/login', 'POST', { email, password })
}


/**
 * バックエンドへのAPIリクエスト
 */
export const requestApi = async (path = '',method = 'GET',data = null,headers = {}) => {
  // API URLが設定されているかチェック
  if (!config?.domains?.api) {
    throw new Error(`Error: 
    APIドメインがありません–サーバーレスExpress.jsバックエンドからこのフロントエンドアプリケーションにAPIドメインを追加してください。
    これは、「./config.js」ファイルの「site」フォルダーで実行できます。手順はそこのドキュメントに記載されています。`)
  }
  // パスの最初は必ず「/」が付くようにする
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  const url = `${config.domains.api}${path}`

  // headersを設定
  headers = Object.assign(
    { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', 
    },
    headers
  )

  const response = await fetch(url, {
    method: method.toUpperCase(),
    mode: 'cors',
    cache: 'no-cache',
    headers,
    body: data ? JSON.stringify(data) : null
  })

  if (response.status < 200 || response.status >= 300) {
    const error = await response.json()
    throw new Error(error.error)
  }

  return await response.json()
}