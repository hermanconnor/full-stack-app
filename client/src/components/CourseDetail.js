import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

class CourseDetail extends Component {
  state = {
    course: {},
    student: {},
  };

  componentDidMount() {
    fetch(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ course: data[0], student: data[0].student });
      })
      .catch((err) => console.log('Error fetching and parsing data', err));
  }

  render() {
    const { context } = this.props;
    const authUser = context.authenticatedUser;

    const { course } = this.state;
    const { firstName, lastName } = this.state.student;
    // Show update & delete buttons if course belongs to authorized user
    return (
      <React.Fragment>
        <div className="actions--bar">
          <div className="wrap">
            {authUser && authUser.id === course.id ? (
              <React.Fragment>
                <Link to={`/courses/${course.id}/update`} className="button">
                  Update Course
                </Link>
                <Link onClick={this.handleDelete} to="#" className="button">
                  Delete Course
                </Link>
                <Link to="/" className="button button-secondary">
                  Return to List
                </Link>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Link className="button" to="/">
                  Return to List
                </Link>
              </React.Fragment>
            )}
          </div>
        </div>

        <div className="wrap">
          <h2>Course Detail</h2>
          <form>
            <div className="main--flex">
              <div>
                <h3 className="course--detail--title">Course</h3>
                <h4 className="course--name">{course.title}</h4>
                <p>
                  By {firstName} {lastName}
                </p>
                <ReactMarkdown children={course.description} />
              </div>
              <div>
                <h3 className="course--detail--title">Estimated Time</h3>
                <p>{course.estimatedTime}</p>
                <h3 className="course--detail--title">Materials Needed</h3>
                <ul className="course--detail--list">
                  <ReactMarkdown children={course.materialsNeeded} />
                </ul>
              </div>
            </div>
          </form>
        </div>
      </React.Fragment>
    );
  }

  // Delete
  handleDelete = () => {
    const { context } = this.props;
    const authUser = context.authenticatedUser;
    const id = this.props.match.params.id;

    context.data
      .deleteCourse(authUser.emailAddress, authUser.password, id)
      .then((errors) => {
        if (errors.length) {
          this.setState({ errors });
        } else {
          console.log(`course deleted`);
          this.props.history.push('/');
        }
      })
      .catch((err) => {
        console.log('Error: ', err);
      });
  };
}

export default CourseDetail;
