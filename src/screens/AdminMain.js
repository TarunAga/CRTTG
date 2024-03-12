import React, { useState, useEffect, useCallback } from 'react';
import "../stylesheets/adminmain.css";
import { Link, useNavigate } from 'react-router-dom';

export default function AdminMain() {

    let navigate = useNavigate();
    const [data, setdata] = useState([]);
    const [Sdata, setSdata] = useState({});

    const handleCourseRegClick = async () => {
        const newData = Sdata;
        // console.log(newData);
        if(newData.CourseReg)newData.CourseReg=false;
        else newData.CourseReg=true;
        try {
            const response = await fetch('http://localhost:5000/api/updateswitches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data: newData})
            });
            const json = await response.json();
            if(json)navigate('/adminmain');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const handleCourseDropClick = async () => {
        const newData = Sdata;
        if(newData.CourseDrop)newData.CourseDrop=false;
        else newData.CourseDrop=true;
        try {
            const response = await fetch('http://localhost:5000/api/updateswitches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data: newData})
            });
            const json = await response.json();
            if(json)navigate('/adminmain');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const [fileLink, setFileLink] = useState('');

    const handleFileChange = (event) => {
        const link = event.target.value;
        setFileLink(link);
    }
    
    const handleUploadClick = async () => {
        const newData = Sdata;
        newData.timetable=fileLink;
        try {
            const response = await fetch('http://localhost:5000/api/updateswitches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({data: newData})
            });
            const json = await response.json();
            if(json.success)navigate('/');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
      };

    const AccordionBatch = (text) => {
        return (
            <div className="tab">
                <input
                    type="checkbox"
                    name={`accordion-${text}`}
                    id={`cb${text}`}
                />
                <label htmlFor={`cb${text}`} className="tab__label">
                    {text}
                </label>
                <div className="tab__content">
                    {data && data.length > 0 && (
                        <table>
                            <thead>
                                <tr>
                                    {/* <th></th> */}
                                    <th>Course ID</th>
                                    <th>Course Name</th>
                                    <th>Course Instructors</th>
                                    <th>Credits</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(course => {
                                    if (course.batch === text) {
                                        return (
                                            <tr key={course.id}>
                                                {/* <td>
                                                    <input type="radio" name="radio-group" />
                                                </td> */}
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
            </div>
        );
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
                const response = await fetch('http://localhost:5000/api/getAllCourses', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
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
                    // console.log(json1);
                    setdata(json.data);
                    setSdata(json1);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        authorize();
        fetchData();
        // eslint-disable-next-line
    }, [])

    const logout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div className="button-container" style={{ position: 'sticky', top: 0, zIndex: 1, padding: '10px',marginLeft:'auto',marginRight:'none' }}>
                <div className='buttonHolder' style={{width:'10%'}}><button className="button" onClick={logout}>Logout</button></div>
            </div>
            <div className="button-container" style={{ position: 'sticky', top: 0, zIndex: 1, padding: '10px' }}>
                <div className='buttonHolder'><Link to='/generatett'><button className="button">Generate Timetable</button></Link></div>
                <div className='buttonHolder'><Link to='/coursecreate'><button className="button">Create New Course</button></Link></div>
                <div className='buttonHolder'><Link to='/signup'><button className="button">Create New Account</button></Link></div>
            </div>
            <div className="button-container" style={{ position: 'sticky', top: 0, zIndex: 1, padding: '10px' }}>
                <div className='buttonHolder'>
                <a href={Sdata.timetable} download="timetables.zip">
                    <button className="button">Download Timetables</button>
                </a>
                </div>
                <div className='buttonHolder'>{Sdata.CourseReg && (<button className="button" onClick={handleCourseRegClick}> Disable Course Registration</button>)}
                {!Sdata.CourseReg && (<button className="button" onClick={handleCourseRegClick}>Enable Course Registration</button>)}</div>
                <div className='buttonHolder'>{Sdata.CourseDrop && (<button className="button" onClick={handleCourseDropClick}>Disable Course Drop</button>)}
                {!Sdata.CourseDrop && (<button className="button" onClick={handleCourseDropClick}>Enable Course Drop</button>)}</div>
            </div>
            <div className="button-container" style={{ position: 'sticky', top: 0, zIndex: 1, padding: '10px' }}>
                <div className='buttonHolder'>
                    <input type="text" onChange={handleFileChange} style={{width:'60%',marginLeft:'10%'}}/>
                    <button className="button" onClick={handleUploadClick}  style={{width:'20%'}}>Upload Timetables</button>
                </div>
            </div>
            <div className="scrollable-wrapper" style={{ position: 'relative', height: '100%', overflowY: 'scroll' }}>
                <div className="scrollable-section" style={{ position: 'relative', padding: '10px' }}>
                    <section className="accordion">
                        {AccordionBatch('Y21A1')}
                        {AccordionBatch('Y21A2')}
                        {AccordionBatch('Y22A1')}
                        {AccordionBatch('Y22A2')}
                        {AccordionBatch('Y22ME')}
                        {AccordionBatch('Y23A1')}
                        {AccordionBatch('Y23A2')}
                    </section>
                </div>
            </div>
        </div>

    )
}
