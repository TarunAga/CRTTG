import React, { useState, useEffect, useCallback } from 'react'
import "../stylesheets/Afterloginscreenstudent.css";
import logo from "../stylesheets/360VIEWOFLNMIIT.jpg";
import { Link, useNavigate } from 'react-router-dom'

export default function ALStudent() {

    let navigate = useNavigate();
    const [data, setdata] = useState({});
    const [Sdata, setSdata] = useState({});

    const logout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const handleCourseInfo = useCallback(
        (id) => () => {
            navigate('/courseview', { state: { courseid: id } });
        },
        []
    );

    function takeMeToCR(){
        navigate('/coursereg', { state: { batch: data.batch } });
    }

    // const handleCourseInfo = () => {

    // };

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

              
                    if (json.usertype === 'Admin') {
                        navigate('/adminmain');
                    }
                    if (json.usertype === 'Faculty') {
                        navigate('/alfaculty');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        }
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:5000/api/getStudentData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ authToken: localStorage.getItem('authToken') })
                });

                const json = await response.json();

                const response1 = await fetch('http://localhost:5000/api/getswitches', {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
            
                  const json1 = await response1.json();

                if (!json.success) {
                    alert('I tried my best');
                } else {
                    setdata(json.data);
                    setSdata(json1);
                    //   console.log(data.name);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        authorize();
        fetchData();
    }, []);


    return (
        <div>
            <div className="main-content">
                <div className="grey-div">
                    <img src={logo} alt="Profile" className="profile-photo" />
                    <div className="profile-name">{data.name}</div>
                    <div className="profile-id">{data.email}</div>
                    <div className="profile-info">
                        <div>Batch: {data.batch}</div>
                        <div style={{ margin: '0 40px' }}> </div>
                        <div>CGPA: {data.cgpa}</div>
                    </div>
                </div>
                <div className="white-div">
                    <div className="button-container">
                        <button className="button" style={{ width: 'auto' }} onClick={logout} >Log Out</button>

                    </div>
                    <div className="lobutton-container">
                        <a href={Sdata.timetable} download="timetables.zip">
                            <button className="button">Download Timetables</button>
                        </a>
                        {Sdata.CourseDrop && (<Link to='/coursedrop'>
                            <button className="button">Course Drop</button>
                        </Link>
                        )}
                        {!Sdata.CourseDrop && (<button className="button">Course Drop Disabled</button>)}
                        
                        {Sdata.CourseReg && (<button className="button" onClick={takeMeToCR}>Course Registration</button>)}
                        {!Sdata.CourseReg && (<button className="button">Course Registration Disabled</button>)}
                    </div>
                    <h2 className="currcour">Current Courses</h2>
                    {data.Courses && data.Courses.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.Courses.map((course, index) => (
                                    <tr key={index}>
                                        <td><button className='coursebuttons' onClick={handleCourseInfo(course._id)}>{course.name}</button></td>
                                        <td>{course.credits}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No courses available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
