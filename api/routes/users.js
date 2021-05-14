const express = require('express');
const { User } = require('../models');
const { asyncHandler } = require('../middleware/asynchandler');
const { authenticateUser } = require('../middleware/auth-user');

// CONSTRUCT A ROUTER INSTANCE
const router = express.Router();

// GET route that returns the currently authenticated user
router.get(
  '/users',
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      id: user.id,
    });
  })
);

// POST route that will create a new user
router.post(
  '/users',
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);

      res.location('/');
      res.status(201).end();
    } catch (error) {
      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstraintError'
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
