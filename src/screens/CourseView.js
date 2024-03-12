import React, { useState, useEffect } from 'react'
import "../stylesheets/Editcreatecourse.css";
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom'

export default function CourseView() {

    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);
    const [isFaculty, setIsFaculty] = useState(false);
    const [data, setdata] = useState({});
    const navigate = useNavigate();

    function handleCourseInfo() {
        navigate('/courseedit', { state: { courseid: location.state.courseid } });
    }
    async function handleAskStudents() {
        const response = await fetch('http://localhost:5000/api/getStudentsOfCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cId: location.state.courseid })
        });
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'studentData.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

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
                        setIsAdmin(true);
                    }
                    if (json.usertype === 'Faculty') {
                        setIsFaculty(true);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        }

        async function fetchData() {
            try {
                const response = await fetch('http://localhost:5000/api/getCourseData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: location.state.courseid })
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
    }, []);

    return (
        <div>
            <div id="form-container" style={{ marginBottom: '20px' }}>
                <div className="form-row">
                    <div className="weirdsettings">
                        <label>Course Name&nbsp;&nbsp;:&nbsp;&nbsp;</label>
                        <span>{data.name}</span>
                    </div>
                    <div className="weirdsettings">
                        <label>Course ID&nbsp;&nbsp;:&nbsp;&nbsp;</label>
                        <span id="field2Data">{data.courseId}</span>
                    </div>
                </div>
                <div className="form-row">
                    <div className="weirdsettings">
                        <label>Batch&nbsp;&nbsp;:&nbsp;&nbsp;</label>
                        <span id="field3Data">{data.batch}</span>
                    </div>
                    <div className="weirdsettings">
                        <label>Credits&nbsp;&nbsp;:&nbsp;&nbsp;</label>
                        <span id="field4Data">{data.credits}</span>
                    </div>
                </div>
                <div className="form-row">
                    <div className="weirdsettings">
                        <label>Seats&nbsp;&nbsp;:&nbsp;&nbsp;</label>
                        <span id="field5Data">{data.seats}</span>
                    </div>
                    <div className="weirdsettings">
                        <label></label>
                        <span id="field6Data"></span>
                    </div>
                </div>
                <div className="form-roww">
                    <div className="weirdsettings">
                        <div className="wow">
                            <label>Course Type&nbsp;&nbsp;:&nbsp;&nbsp;</label>
                            <span id="courseTypeData">{data.courseType}</span>
                        </div>
                    </div>
                </div>
                <div className="form-row" id="facultySection">
                    <div className="weirdsettings">
                        <label>Faculty Involved:</label>
                    </div>
                </div>
                {data.Faculty && data.Faculty.length > 0 ? (
                    <div style={{ width: 'auto' }}>
                        {data.Faculty.map((fac, index) => (
                            <p key={index} style={{ textAlign: 'left', marginLeft: '30px' }}>{fac.name}&nbsp;&nbsp;|&nbsp;&nbsp;{fac.email}</p>
                        ))}
                    </div>
                ) : (
                    <p>No Faculties currently</p>
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    <Link to='/'>
                        <button className="complete" style={{ marginRight: '30px' }}>Back To Home</button>
                    </Link>
                    {isAdmin && (
                        <button className="complete" onClick={handleCourseInfo} style={{ marginRight: '30px'}}>
                            Edit Course
                        </button>
                    )}
                    {(isAdmin || isFaculty) && (
                        <button className="complete" onClick={handleAskStudents}>
                            Student Details
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
