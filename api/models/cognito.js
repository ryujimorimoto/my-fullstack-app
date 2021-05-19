const cognito_identify = require('amazon-cognito-identity-js');

const userPool = new cognito_identify.CognitoUserPool({
  UserPoolId: "awsmobile.aws_user_pools_id ",
  ClientId: "awsmobile.aws_user_pools_web_client_id"
});
export const uesrInfo =  () => {
  return new Promise((resolve, reject) => {
    userPool.signUp
  });
}

export const userSignUp = (email, password, username) => {
  const dataEmail = { Name: 'email', Value: email }
  const attributeList = []
  attributeList.push(new cognito_identify.CognitoUserAttribute(dataEmail))
  const dataName = { Name: 'name', Value: username }
  attributeList.push(new cognito_identify.CognitoUserAttribute(dataName))
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
export const userConfirmation = (username, confirmationCode) => {
  const userData = { Username: username, Pool: userPool }
  const cognitoUser = new cognito_identify.CognitoUser(userData)
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
export const userLogin = (username, password) => {
  const userData = { Username: username, Pool: userPool }
  const cognitoUser = new cognito_identify.CognitoUser(userData)
  const authenticationData = { Username: username, Password: password }
  const authenticationDetails = new cognito_identify.AuthenticationDetails(authenticationData)

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

export const userChangePassword = (oldPassword, newPassword) => {
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

export const forgotPassword = (username) =>{
  const userData = { Username: username, Pool: userPool }
  const cognitoUser = new cognito_identify.CognitoUser(userData)
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

export const confirmForgotPassword = (username, confirmationCode, newPassword) => {
  const userData = { Username: username, Pool: userPool }
  const cognitoUser = new cognito_identify.CognitoUser(userData)
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
export const userLogout = () =>{
  console.log("logout")
  userPool.getCurrentUser().signOut();
  window.location.href = "/top";
}

/*
  ログインしているかの判定
  */
export const userIsAuthenticated = () => {
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