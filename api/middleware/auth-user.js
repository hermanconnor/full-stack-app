'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
  let message;

  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);

  if (credentials) {
    const user = await User.findOne({
      // retrieve the user by their email address
      where: { emailAddress: credentials.name },
    });

    // If a user was successfully retrieved, cross-check passwords
    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);

      // If passwords match, Store the retrieved user object on the request object
      if (authenticated) {
        req.currentUser = user;
        console.log(
          `Authentication successful for emailAddress: ${user.emailAddress}`
        );
      } else {
        message = `Authentication failure for emailAddress: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for emailAddress: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  // If user authentication failed
  // Return a response with a 401 Unauthorized HTTP status code.
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    // If authentication succeeds
    next();
  }
};
