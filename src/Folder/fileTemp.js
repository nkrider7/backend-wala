export const fileTemp = { 
    'controllers': {
      'user.controllers.js': `const getUser = (req, res) => {
  res.send('Get User');
};

module.exports = { getUser };`
    },
    'models': {
      'user.model.js': `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
  
});

const User = mongoose.model('User', userSchema);

module.exports = User;`
    },
    'routes': {
      'user.routes.js': `const express = require('express');
const router = express.Router();
const { getUser } = require('../controllers/user.controllers');

router.get('/user', getUser);

module.exports = router;`
    },
    'utils': {
      'db.js': "write your db connection code here"
    }

  };  