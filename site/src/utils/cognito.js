import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from 'amazon-cognito-identity-js'
import awsmobile from '../aws-exports'
export default class Cognito {
  constructor(){
    if (this.userPool) {
      this.userPool = this.userPool
    } else {
      this.userPool = new CognitoUserPool({
        UserPoolId: awsmobile.aws_user_pools_id ,
        ClientId: awsmobile.aws_user_pools_web_client_id
      })
    }
  }

  /*
    username, passwordでサインアップ
    username = emailとしてUserAttributeにも登録
   */
  signUp (email, password, name) {
    const dataEmail = { Name: 'email', Value: email }
    const attributeList = []
    attributeList.push(new CognitoUserAttribute(dataEmail))
    const dataName = { Name: 'name', Value: name }
    attributeList.push(new CognitoUserAttribute(dataName))
    return new Promise((resolve, reject) => {
      this.userPool.signUp(email, password, attributeList, null, (err, result) => {
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
  confirmation (username, confirmationCode) {
    const userData = { Username: username, Pool: this.userPool }
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
  login (username, password) {
    const userData = { Username: username, Pool: this.userPool }
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

  changePassword (oldPassword, newPassword) {
    var cognitoUser = this.userPool.getCurrentUser()
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

  forgotPassword (username) {
    const userData = { Username: username, Pool: this.userPool }
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

  confirmForgotPassword (username, confirmationCode, newPassword) {
    const userData = { Username: username, Pool: this.userPool }
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

  delete () {
    var cognitoUser = this.userPool.getCurrentUser()
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
  logout () {
    console.log("logout")
    this.userPool.getCurrentUser().signOut();
    window.location.href = "/top";
  }

  /*
    ログインしているかの判定
   */
  isAuthenticated () {
    const cognitoUser = this.userPool.getCurrentUser()
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
}