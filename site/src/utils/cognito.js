import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from 'amazon-cognito-identity-js'
import awsmobile from '../aws-exports'
export const userPool = new CognitoUserPool({
  UserPoolId: awsmobile.aws_user_pools_id,
  ClientId: awsmobile.aws_user_pools_web_client_id
});
  /*
    username, passwordでサインアップ
    username = emailとしてUserAttributeにも登録
   */
export const signUp = (email, password, name) => {
  const dataEmail = { Name: 'email', Value: email }
  const attributeList = []
  attributeList.push(new CognitoUserAttribute(dataEmail))
  const dataName = { Name: 'name', Value: name }
  attributeList.push(new CognitoUserAttribute(dataName))
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

/*
  確認コードからユーザーを有効化する
  */
  export const confirmation = (username, confirmationCode) =>{
  const userData = { Username: username, Pool: userPool }
  const cognitoUser = new CognitoUser(userData)

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

/*
  username, passwordでログイン
  */
  export const login = (username, password) =>{
  const userData = { Username: username, Pool: userPool }
  const cognitoUser = new CognitoUser(userData)
  const authenticationData = { Username: username, Password: password }
  const authenticationDetails = new AuthenticationDetails(authenticationData)

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result)
      },
      onFailure: (err) => {
        reject(err)
      }
    })
  })
}

export const changePassword = (oldPassword, newPassword) => {
  var cognitoUser = userPool.getCurrentUser()
  return new Promise((resolve, reject) => {
    cognitoUser.getSession(function (err, result) {
      if (result) {
        cognitoUser.changePassword(oldPassword, newPassword, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      } else {
        reject(err)
      }
    })
  })
}

export const forgotPassword = (username) => {
  const userData = { Username: username, Pool: userPool }
  const cognitoUser = new CognitoUser(userData)
  return new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: (result) => {
        resolve(result)
      },
      onFailure: (err) => {
        reject(err)
      }
    })
  })
}

export const confirmForgotPassword =  (username, confirmationCode, newPassword) => {
  const userData = { Username: username, Pool: userPool }
  const cognitoUser = new CognitoUser(userData)
  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(confirmationCode, newPassword, {
      onSuccess: (result) => {
        resolve(result)
      },
      onFailure: (err) => {
        reject(err)
      }
    })
  })
}

export const userDelete = () => {
  var cognitoUser = userPool.getCurrentUser()
  return new Promise((resolve, reject) => {
    cognitoUser.getSession(function (err, result) {
      if (result) {
        cognitoUser.deleteUser((err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
      } else {
        reject(err)
      }
    })
  })
}

/*
  ログアウト
  */
  export const logout = () => {
  console.log("logout")
  userPool.getCurrentUser().signOut();
  window.location.href = "/top";
}

/*
  ログインしているかの判定
  */
  export const isAuthenticated = () => {
  const cognitoUser = userPool.getCurrentUser()
  return new Promise((resolve, reject) => {
    if (cognitoUser === null) { reject(cognitoUser) }
    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err)
      } else {
        if (!session.isValid()) {
          reject(session)
        } else {
          resolve(session)
        }
      }
    })
  })
}