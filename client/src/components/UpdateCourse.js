import React, { Component } from 'react';
import Form from './Form';

class UpdateCourse extends Component {
  state = {
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    course: {},
    student: {},
    errors: [],
  };

  // Get Current Page Data
  componentDidMount() {
    fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          title: data.title,
          description: data.description,
          estimatedTime: data.estimatedTime,
          materialsNeeded: data.materialsNeeded,
          course: data[0],
          student: data[0],
        });
      })
      .catch((err) => console.log('Error fetching and parsing data', err));
  }

  render() {
    const { title, description, estimatedTime, materialsNeeded } =
      this.state.course;
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
                  <label htmlFor="courseTitle">Course Title</label>
                  <input
                    onChange={this.change}
                    type="text"
                    name="courseTitle"
                    id="courseTitle"
                    value={title || ''}
                  />
                  <p>
                    By {firstName} {lastName}
                  </p>
                  <label htmlFor="courseDescription">Course Description</label>
                  <textarea
                    onChange={this.change}
                    name="courseDescription"
                    id="courseDescription"
                    value={description || ''}
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="estimatedTime">Estimated Time</label>
                  <input
                    onChange={this.change}
                    type="text"
                    id="estimatedTime"
                    name="estimatedTime"
                    value={estimatedTime || ''}
                  />
                  <label htmlFor="materialsNeeded">Materials Needed</label>
                  <textarea
                    onChange={this.change}
                    name="materialsNeeded"
                    id="materialsNeeded"
                    value={materialsNeeded || ''}
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
