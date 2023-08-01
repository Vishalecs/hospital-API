const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Function to handle user registration
module.exports.create = async function (req, res) {
  try {
    const { username, password, name } = req.body;

    let user = await User.findOne({ username });

    if (user) {
      return res.status(409).json({
        message: 'UserName Already Exists',
      });
    }

    user = await User.create({
      username,
      password,
      name,
      type: 'Doctor',
    });

    return res.status(201).json({
      message: 'User created successfully',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};

// Function to handle user login and generate a token
module.exports.createSession = async function (req, res) {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(422).json({
        message: 'Invalid UserName or Password',
      });
    }

    const token = jwt.sign({ _id: user._id }, 'Alert1234', { expiresIn: '1000000' });

    return res.status(200).json({
      message: 'Sign in successful. Here is your token, please keep it safe',
      data: {
        token,
      },
    });
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }
};
