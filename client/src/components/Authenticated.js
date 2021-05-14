import React from 'react';

const Authenticated = ({ context }) => {
  const authUser = context.authenticatedUser;

  return (
    <div>
      <div>
        <h1>{authUser.name} is authenticated!</h1>
        <p>Your username is {authUser.username}.</p>
      </div>
    </div>
  );
};

export default Authenticated;
