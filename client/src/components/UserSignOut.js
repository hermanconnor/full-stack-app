import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';

// Signout and redirect user to homepage
const UserSignOut = ({ context }) => {
  useEffect(() => context.actions.signOut());

  return (
    <div>
      <Redirect to="/" />
    </div>
  );
};

export default UserSignOut;
