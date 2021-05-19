/**
 * Controllers: Users
 */

// const jwt = require('jsonwebtoken')
// const { users } = require('../models')
const { cognito } = require('../models')
// const { comparePassword } = require('../utils')

const register = async (req, res, next) => {

  try {
    await cognito.userSignUp(req.body)
    res.json({ message: 'Authentication successful'})
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }

}

const login = async (req, res, next) => {
  let user
  try {
    user = await cognito.userIsAuthenticated();
  } catch (error) {
    return done(error, null)
  } 
  if (!user) {
    return res.status(404).send({ error: 'ユーザーが登録されていません' })
  }
  try {
    // TODO: req.body が [メールアドレス, パスワード]の組み合わせ確認
    console.log("req.body:", req.body);
    await cognito.userLogin(req.body)
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
}