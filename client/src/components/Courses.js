import React, { Component } from 'react';
import CourseModule from './CourseModule';
import AddModule from './AddModule';

class Courses extends Component {
  state = {
    courses: [],
  };

  // Get courses to render the homepage display
  componentDidMount() {
    fetch('http://localhost:5000/api/courses')
      .then((res) => res.json())
      .then((data) => this.setState({ courses: data }))
      .catch((err) => console.log('Error fetching and parsing data', err));
  }

  render() {
    const { courses } = this.state;

    return (
      <div className="wrap main--grid">
        {courses.map((course) => (
          <CourseModule key={course.id} course={course} />
        ))}
        <AddModule />
      </div>
    );
  }
}

export default Courses;
