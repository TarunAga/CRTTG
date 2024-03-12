import React, { useState, useEffect, useCallback } from 'react';
import "../stylesheets/generatett.css";
import { Link, useNavigate } from 'react-router-dom';

export default function GenerateTT() {
	let navigate = useNavigate();
	const [data, setdata] = useState([]);
	const [selectedData, setSelectedData] = useState([]);

	const handleCheckboxChange = (event, courseId) => {
		const isChecked = event.target.checked;
		const checkboxValue = event.target.value;
	
		if (isChecked) {
			if (!selectedData.includes(checkboxValue)) {
				selectedData.push(checkboxValue);
			}
		} else {
			const temp = selectedData.filter((value) => value !== checkboxValue);
			setSelectedData(temp);
		}
	};
	

		const handleCourseInfo = useCallback(
			(id) => () => {
				navigate('/courseview', { state: { courseid: id } });
			},
			[]
		);
		useEffect(() => {
			async function authorize() {
				const authToken = localStorage.getItem('authToken');
				if (authToken) {
					try {
						const response = await fetch('http://localhost:5000/api/extractUserType', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({ authToken: localStorage.getItem('authToken') })
						});

						const json = await response.json();

						if (json.usertype === 'Faculty') {
							navigate('/');
						}
						if (json.usertype === 'Student') {
							navigate('/');
						}
					} catch (error) {
						console.error('Error fetching data:', error);
					}
				}
			}
			async function fetchData() {
				try {
					const response = await fetch('http://localhost:5000/api/getCourses', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						}
					});

					const json = await response.json();
					if (!json.success) {
						alert('I tried my best');
					} else {
						setdata(json.data);
					}
				} catch (error) {
					console.error('Error fetching data:', error);
				}
			}
			authorize();
			fetchData();
			// eslint-disable-next-line
		}, [])
		const handleSubmit = async (event) => {
			event.preventDefault();
			console.log(selectedData);
			const response = await fetch('http://localhost:5000/api/gentimetable', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({data:selectedData})
			});
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'timetable.csv';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		};
		return (
			<div className='bodymain'>
				<form onSubmit={handleSubmit}>
					<div className="button-container" style={{backgroundColor:'white'}}>
						<div className='buttonHolder'><button className="button" type="submit">Generate</button></div>
						<div className='buttonHolder'><Link to='/adminmain'><button className="button">Back To Home</button></Link></div>
					</div>
					<div className='tableHolder'>
						{data && data.length > 0 && (
							<table>
								<thead>
									<tr>
										<th></th>
										<th>Course ID</th>
										<th>Course Name</th>
										<th>Course Instructors</th>
										<th>Credits</th>
									</tr>
								</thead>
								<tbody>
									{data.map((course, courseIndex) => {
										if (true) {
											return (
												<tr key={course.id}>
													<td>
														<input
															type="checkbox"
															value={`${course.name} ${course.batch} ${course.Faculty.length} ${course.Faculty.map((fac) => fac.name).join(' ')
																}`}
															onChange={(event) => handleCheckboxChange(event, course.id)}
														/>
													</td>
													<td>{course.courseId}</td>
													<td><button onClick={handleCourseInfo(course._id)}>{course.name}</button></td>
													<td>
														{course.Faculty.map((fac, facIndex) => (
															<React.Fragment key={facIndex}>
																{fac.name}&nbsp;&nbsp;
															</React.Fragment>
														))}
													</td>
													<td>{course.credits}</td>
												</tr>
											);
										}
										return null;
									})}
								</tbody>
							</table>
						)}
					</div>
				</form>
			</div>
		)
	}

