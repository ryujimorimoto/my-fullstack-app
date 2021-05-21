/**
 * Controllers: Users
 */

const { cognito } = require('../models')

const register = async (req, res, next) => {
console.log("======= Users Controller ======");
console.log(" POST /users/register", req);
  const body = req.body
  try {
    await cognito.userSignUp(body.email, body.password, body.name)
    res.json({ message: 'Authentication successful'})
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }

}
const verification = async (req, res, next) => {
console.log("======= Users Controller ======");
console.log(" POST /users/verification", req);
  const body = req.body;
  try {
    cognito.userConfirmation(body.email, body.code).then( (user) => {
      console.log("user:", user)
      res.json({ message: '認証成功', user })
    }).catch( err => {
      console.log("err:", err)
      return res.status(400).send({ error: '認証に失敗しました', code: err })
    })
  } catch (error) {
    return res.status(400).send({ error: '認証に失敗しました' })
  } 
}

const login = async (req, res, next) => {
  console.log("======= Users Controller ======");
  console.log(" POST /users/login", req);
  const body = req.body;
  let user
  try {
    await cognito.userLogin(body.email, body.password)
    res.json({ message: 'ログイン成功', user })
  } catch (error) {
    return res.status(401).send({ error: 'パスワードが違います' })
  }
}

/**
 * Get a user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const get = async (req, res, next) => {
  const user = cognito.convertToPublicFormat(req.user)
  res.json({ user })
}

module.exports = {
  register,
  login,
  get,
  verification,
}