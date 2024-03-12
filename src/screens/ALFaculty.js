import React, { useState, useEffect, useCallback } from 'react'
import "../stylesheets/Afterloginscreenstudent.css";
import logo from "../stylesheets/360VIEWOFLNMIIT.jpg"; 
import { Link, useNavigate } from 'react-router-dom'

export default function ALFaculty() {

    let navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    const [data, setdata] = useState({});
    const [Sdata, setSdata] = useState({});

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
              
                    if (json.usertype === 'Admin') {
                        navigate('/adminmain');
                    }
                    if (json.usertype === 'Student') {
                        navigate('/alstudent');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        }

        async function fetchData() {
          try {
            const response = await fetch('http://localhost:5000/api/getFacultyData', {
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
                    <img src={logo} alt="Profile" className="profile-photo"></img>
                    <div className="profile-name">{data.name}</div>
                    <div className="profile-id">{data.email}</div>
                </div>
                <div className="white-div">
                    <br></br>
                    <div className="button-container">
                            <button  className="button" style={{ width: 'auto',marginLeft:'auto',marginRight:'none' }} onClick={logout}>Log Out</button>
                    </div>
                    <div className="lobutton-container">
                        <a href={Sdata.timetable} download="timetables.zip">
                            <button className="button">Download Timetables</button>
                        </a>
                    </div>
                    <h2 className="currcour">Current Courses</h2>
                    {data.Courses && data.Courses.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Batch</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.Courses.map((course, index) => (
                                    <tr key={index}>
                                        <td><button className='coursebuttons' onClick={handleCourseInfo(course._id)}>{course.name}</button></td>
                                        <td>{course.batch}</td>
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
    )
}
