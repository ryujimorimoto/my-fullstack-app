const cognito_identify = require('amazon-cognito-identity-js');

const userPool = new cognito_identify.CognitoUserPool({
  UserPoolId: process.env.AWS_USER_POOLS_ID,
  ClientId: process.env.AWS_USER_POOLS_WEB_CLIENT_ID
});

const uesrInfo =  () => {
  return new Promise((resolve, reject) => {
    userPool.signUp
  });
}

const userSignUp = (email, password, username) => {
  console.log("userSignUp params:", email, password, username)
  const dataEmail = { Name: 'email', Value: email }
  const attributeList = []
  attributeList.push(new cognito_identify.CognitoUserAttribute(dataEmail))
  const dataName = { Name: 'name', Value: username }
  attributeList.push(new cognito_identify.CognitoUserAttribute(dataName))
  console.log("attributeList:", attributeList)
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, null, (err, result) => {
      if (err) {
        console.log("Error:", err)
        reject(err)
      } else {
        console.log("Success:", result)
        resolve(result)
      }
    })
  })
}

/*
  確認コードからユーザーを有効化する
  */
const userConfirmation = (email, confirmationCode) => {
  const userData = { Username: email, Pool: userPool }
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
  email, passwordでログイン
  */
const userLogin = (email, password) => {
  const userData = { Username: email, Pool: userPool }
  const cognitoUser = new cognito_identify.CognitoUser(userData)
  const authenticationData = { Username: email, Password: password }
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

const userChangePassword = (oldPassword, newPassword) => {
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

const forgotPassword = (email) =>{
  const userData = { Username: email, Pool: userPool }
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

const confirmForgotPassword = (email, confirmationCode, newPassword) => {
  const userData = { Username: email, Pool: userPool }
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

const userDelete = () => {
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
const userLogout = () =>{
  console.log("logout")
  userPool.getCurrentUser().signOut();
  window.location.href = "/top";
}

/*
  ログインしているかの判定
  */
const userIsAuthenticated = () => {
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
module.exports = {
  uesrInfo,
  userSignUp,
  userConfirmation,
  userLogin,
  userChangePassword,
  forgotPassword,
  confirmForgotPassword,
  userDelete,
  userLogout,
  userIsAuthenticated,
}