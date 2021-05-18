import React, { Component } from 'react';
import Form from './Form';

class UpdateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    student: {},
    errors: [],
  };

  // Get Current Page Data
  componentDidMount() {
    fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          title: data[0].title,
          description: data[0].description,
          estimatedTime: data[0].estimatedTime,
          materialsNeeded: data[0].materialsNeeded,
          student: data[0],
        });
      })
      .catch((err) => console.log('Error fetching and parsing data', err));
  }

  render() {
    const { errors } = this.state;
    const { firstName, lastName } = this.state.student;

    return (
      <div className="wrap">
        <h2>Create Course</h2>
        <Form
          cancel={this.cancel}
          errors={errors}
          submit={this.submit}
          submitButtonText="Update Course"
          elements={() => (
            <React.Fragment>
              <div className="main--flex">
                <div>
                  <label htmlFor="title">Course Title</label>
                  <input
                    onChange={this.change}
                    type="text"
                    name="title"
                    id="title"
                    value={this.state.title}
                  />
                  <p>
                    By {firstName} {lastName}
                  </p>
                  <label htmlFor="description">Course Description</label>
                  <textarea
                    onChange={this.change}
                    name="description"
                    id="description"
                    value={this.state.description}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="estimatedTime">Estimated Time</label>
                  <input
                    onChange={this.change}
                    type="text"
                    id="estimatedTime"
                    name="estimatedTime"
                    value={this.state.estimatedTime}
                  />
                  <label htmlFor="materialsNeeded">Materials Needed</label>
                  <textarea
                    onChange={this.change}
                    name="materialsNeeded"
                    id="materialsNeeded"
                    value={this.state.materialsNeeded}
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
    const paramId = this.props.match.params.id;
    const { context } = this.props;
    const { emailAddress, password } = context.authenticatedUser;

    const { id, title, description, student, estimatedTime, materialsNeeded } =
      this.state;

    // New Course Object
    const course = {
      id,
      title,
      description,
      student,
      estimatedTime,
      materialsNeeded,
    };

    // Update The Course From Context
    context.data
      .updateCourse(emailAddress, password, course, paramId)
      .then((errors) => {
        if (errors.length) {
          this.setState({ errors });
        } else {
          this.props.history.push(`/courses/${paramId}`);
        }
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  };

  // Cancel Handler
  cancel = () => {
    this.props.history.push(`/courses/${this.props.match.params.id}`);
  };
}

export default UpdateCourse;
