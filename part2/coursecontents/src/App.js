import React, { useState } from "react";
import Course from "./components/Course";

const App = ({ courses }) => {
	return (
		<div>
			<h1>Web Development Curriculum</h1>
			{courses.map((course) => (
				<Course course={course} key={course.id} />
			))}
		</div>
	);
};

export default App;
