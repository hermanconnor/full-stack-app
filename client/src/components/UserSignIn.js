import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';

class UserSignIn extends Component {
  state = {
    emailAddress: '',
    password: '',
    errors: [],
  };

  render() {
    const { emailAddress, password, errors } = this.state;

    return (
      <div className="form--centered">
        <h2>Sign In</h2>
        <Form
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText="Sign In"
          elements={() => (
            <React.Fragment>
              <label htmlFor="emailAddress">Email Address</label>
              <input
                onChange={this.change}
                id="emailAddress"
                name="emailAddress"
                type="email"
                value={emailAddress}
              />
              <label htmlFor="password">Password</label>
              <input
                onChange={this.change}
                id="password"
                name="password"
                type="password"
                value={password}
              />
            </React.Fragment>
          )}
        />
        <p>
          Don't have a user account? Click here to{' '}
          <Link to="/signup">sign up</Link>
        </p>
      </div>
    );
  }

  // onChange Handler
  change = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState(() => {
      return {
        [name]: value,
      };
    });
  };

  // Submit Handler
  submit = () => {
    const { context } = this.props;

    const { emailAddress, password } = this.state;

    // Sign In User
    context.actions
      .signIn(emailAddress, password)
      .then((user) => {
        if (user === null) {
          this.setState(() => {
            return { errors: ['Sign-in unsuccessful'] };
          });
        } else {
          this.props.history.push('/');
          console.log(`SUCCESS ${emailAddress} is now signed in:`);
        }
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  };

  // Cancel Handler
  cancel = () => {
    this.props.history.push('/');
  };
}

export default UserSignIn;
