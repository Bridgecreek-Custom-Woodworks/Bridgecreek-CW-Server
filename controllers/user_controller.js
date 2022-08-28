const User = require('../models/User')
const Users = require('../models/User')

exports.getAllUsers = async (req, res) => {
  const users = await Users.findAll()
  res.status(200).json({ success: true, data: users })
}

exports.getUser = async (req, res, next) => {
  try {
    const user = await Users.findOne({
      where: { userId: req.params.userId },
    })

    if (!user) {
      return res.status(400).json({ success: false })
    }
    res.status(200).json({ success: true, data: user })
  } catch (error) {
    // return res.status(400).json({ success: false })
    next(error)
  }
}

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body)

    res.status(201).json({ success: true, data: user })
  } catch (error) {
    console.log(error.message)
    return res.status(400).json({ success: false, error: error.message })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.update(req.body, {
      where: {
        userId: req.params.userId,
      },
    })

    res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    return res.status(400).json({ success: false })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: {
        userId: req.params.userId,
      },
    })
    res.status(200).json({
      success: true,
      msg: `User with the id ${req.params.userId} was deleted`,
    })
  } catch (error) {}
}
