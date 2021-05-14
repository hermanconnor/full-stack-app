import React, { Component } from 'react';
import Form from './Form';

class CreateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    errors: [],
  };

  render() {
    const { context } = this.props;
    const authUser = context.authenticatedUser;

    const { title, description, estimatedTime, materialsNeeded, errors } =
      this.state;

    return (
      <div className="wrap">
        <h2>Create Course</h2>
        <Form
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText="Create Course"
          elements={() => (
            <React.Fragment>
              <div className="main--flex">
                <div>
                  <label htmlFor="title">Course Title</label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={this.change}
                  />
                  <p>
                    By {authUser.firstName} {authUser.lastName}
                  </p>
                  <label htmlFor="description">Course Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={this.change}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="estimatedTime">Estimated Time</label>
                  <input
                    onChange={this.change}
                    type="text"
                    id="estimatedTime"
                    name="estimatedTime"
                    value={estimatedTime}
                  />
                  <label htmlFor="materialsNeeded">Materials Needed</label>
                  <textarea
                    onChange={this.change}
                    name="materialsNeeded"
                    id="materialsNeeded"
                    value={materialsNeeded}
                  ></textarea>
                </div>
              </div>
            </React.Fragment>
          )}
        />
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
    const { emailAddress, password, id } = context.authenticatedUser;
    const userId = id;
    const { title, description, estimatedTime, materialsNeeded } = this.state;

    // New Course Object
    const course = {
      title,
      userId,
      description,
      estimatedTime,
      materialsNeeded,
    };

    // Create New Course From Context
    context.data
      .createCourse(course, emailAddress, password)
      .then((errors) => {
        if (errors.length) {
          this.setState({ errors });
        } else {
          this.props.history.push('/');
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

export default CreateCourse;
