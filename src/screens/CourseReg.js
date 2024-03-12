import React, { useCallback, useEffect, useState } from 'react'
import "../stylesheets/coursereg.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function CourseReg() {

    let location = useLocation();
    let navigate = useNavigate();
    const [data, setdata] = useState([]);

    const [myArray, setMyArray] = useState([]);
    const [count, setCount] = useState(0);
    const [maxCount, setMaxCount] = useState(1000);
    const [mandatoryCoursesButton, setMandatoryCoursesButton] = useState(
        <button className="custom-button">First Select All Mandatory Courses</button>
    );

    function handleFinalClick(){
        navigate('/electiveselection', { state: { batch: location.state.batch } });
    }

    const initializeArray = (size, ac, avc) => {
        const newArray = Array.from({ length: size }, () => 0);
        let temp = 0;
        setMaxCount(size);

        ac.forEach((cc) => {
            let i = 0;
            avc.forEach((tbrc) => {
                if (tbrc._id === cc._id) {
                    newArray[i] = 1;
                    temp++;
                }
                i++;
            });
        });
        setMyArray(newArray); // Assuming setMyArray is the state updater function
        setCount(temp);
        if(temp === size)setMandatoryCoursesButton(<button className="custom-button danger" onClick={handleFinalClick}>Proceed To Elective Selection</button>);  
    };


    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:5000/api/getBatchCoreCourse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ batch: location.state.batch })
                });

                const json = await response.json();
                const response1 = await fetch('http://localhost:5000/api/getStudentData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ authToken: localStorage.getItem('authToken') })
                });

                const json1 = await response1.json();
                if (!json.success) {
                    alert('I tried my best');
                } else {
                    setdata(json.data);
                    initializeArray(json.data.length, json1.data.Courses, json.data);
                    let regis = false;
                    json1.data.Courses.forEach(course => {
                        if(course.courseType !== 'Program Course')
                        {
                            regis =true;
                            
                        alert('Already Registered');
                        }
                    });
                    if(regis){
                        navigate('/alstudent');
                    }
                }
                } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, [count,maxCount]);

    const handleRegistration = useCallback(
        (id, index) => () => {
            async function fetchData() {
                try {
                    const response = await fetch('http://localhost:5000/api/regcourse', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ authToken: localStorage.getItem('authToken'), courseRId: id })
                    });

                    const json = await response.json();
                    if (!json.success) {
                        alert('I tried my best');
                    } else {
                        setMyArray((prevArray) => {
                            setCount((prevCount) => prevCount + 1);
                            const newArray = [...prevArray]; // Copy the previous array
                            newArray[index] = 1; // Update the specific index
                            return newArray; // Return the updated array
                        });
                        if(count === maxCount)setMandatoryCoursesButton(<Link to = '/electiveselection'><button className="custom-button danger">Proceed To Elective Selection</button></Link>);  
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            fetchData();
        },
        []
    );

    return (
        <div>
            <div className="custom-div">
                {/* Semester and Total Credits */}
                <div className="content">
                    <div className="label">Semester: TBD</div>
                    <div className="label">Total Credits: TBD</div>
                </div>
                {/* Mandatory Course and Elective Course */}
                <div className="content">
                    <div className="label">Mandatory Course: TBD</div>
                    <div className="label">Elective Course: TBD</div>
                </div>
            </div>
            <div>

                <table>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    {myArray[index] === 0 ? (
                                        <button onClick={handleRegistration(item._id, index)}>Register</button>
                                    ) : (
                                        <button>Registration Complete</button>
                                    )}
                                </td>
                                <td>{item.courseId}</td>
                                <td>
                                    {
                                        item.Faculty.map((fac,facIndex) => (
                                            <React.Fragment key={facIndex}>
                                                {fac.name}&nbsp;&nbsp;
                                            </React.Fragment>
                                        ))
                                    }
                                </td>
                                <td>{item.credits} Credits</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {mandatoryCoursesButton}
                </div>
            </div>
        </div>
    )
}
