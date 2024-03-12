import React, { useEffect, useState } from 'react';
import '../stylesheets/Electiveselection.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ElectiveSelection() {
    const [isChecked1, setIsChecked1] = useState(true);
    const [isChecked2, setIsChecked2] = useState(false);
    const [isChecked3, setIsChecked3] = useState(false);
    const [isChecked4, setIsChecked4] = useState(false);
    const [isChecked5, setIsChecked5] = useState(false);
    const [elecregistered1, setelecregistered1] = useState(true);
    const [elecregistered2, setelecregistered2] = useState(true);
    const [elecregistered3, setelecregistered3] = useState(true);
    const [elecregistered4, setelecregistered4] = useState(true);
    const [elecregistered5, setelecregistered5] = useState(true);
    const [data, setdata] = useState([]);
    let location = useLocation();
    let navigate = useNavigate();

    const [selectedCourseId1, setSelectedCourseId1] = useState('');
    const handleRadioChange1 = (courseId) => {
        setSelectedCourseId1(courseId);
    };
    const [selectedCourseId2, setSelectedCourseId2] = useState('');
    const handleRadioChange2 = (courseId) => {
        setSelectedCourseId2(courseId);
    };
    const [selectedCourseId3, setSelectedCourseId3] = useState('');
    const handleRadioChange3 = (courseId) => {
        setSelectedCourseId3(courseId);
    };
    const [selectedCourseId4, setSelectedCourseId4] = useState('');
    const handleRadioChange4 = (courseId) => {
        setSelectedCourseId4(courseId);
    };
    const [selectedCourseId5, setSelectedCourseId5] = useState('');
    const handleRadioChange5 = (courseId) => {
        setSelectedCourseId5(courseId);
    };

    async function handleConfirm1() {
        try {
            if (selectedCourseId1 === '') {
                alert('First Select an Elective');
                return;
            }
            let response = await fetch('http://localhost:5000/api/regcourse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ authToken: localStorage.getItem('authToken'), courseRId: selectedCourseId1 })
            });
            let json = await response.json();
            if (!json.success) {
                alert('Unable to select Program Elective 1');
            }
            else {
                alert('Selection Confirmed!');
                setelecregistered1(false);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function handleConfirm2() {
        try {
            if (selectedCourseId2 === '') {
                alert('First Select an Elective');
                return;
            }
            let response = await fetch('http://localhost:5000/api/regcourse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ authToken: localStorage.getItem('authToken'), courseRId: selectedCourseId2 })
            });
            let json = await response.json();
            if (!json.success) {
                alert('Unable to select Program Elective 2');
            }
            else {
                alert('Selection Confirmed!');
                setelecregistered2(false);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function handleConfirm3() {
        try {
            if (selectedCourseId3 === '') {
                alert('First Select an Elective');
                return;
            }
            let response = await fetch('http://localhost:5000/api/regcourse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ authToken: localStorage.getItem('authToken'), courseRId: selectedCourseId3 })
            });
            let json = await response.json();
            if (!json.success) {
                alert('Unable to select Program Elective 3');
            }
            else {
                alert('Selection Confirmed!');
                setelecregistered3(false);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function handleConfirm4() {
        try {
            if (selectedCourseId4 === '') {
                alert('First Select an Elective');
                return;
            }
            let response = await fetch('http://localhost:5000/api/regcourse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ authToken: localStorage.getItem('authToken'), courseRId: selectedCourseId4 })
            });
            let json = await response.json();
            if (!json.success) {
                alert('Unable to select Other Elective 1');
            }
            else {
                alert('Selection Confirmed!');
                setelecregistered4(false);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    async function handleConfirm5() {
        try {
            if (selectedCourseId5 === '') {
                alert('First Select an Elective');
                return;
            }
            let response = await fetch('http://localhost:5000/api/regcourse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ authToken: localStorage.getItem('authToken'), courseRId: selectedCourseId5 })
            });
            let json = await response.json();
            if (!json.success) {
                alert('Unable to select Other Elective 2');
            }
            else {
                alert('Selection Confirmed!');
                setelecregistered5(false);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function handleFinish() {
        navigate('/alstudent');
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:5000/api/getBatchElecCourse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ batch: location.state.batch })
                });
                const response1 = await fetch('http://localhost:5000/api/getStudentData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ authToken: localStorage.getItem('authToken') })
                });
                const json = await response.json();
                if (!json.success) {
                    alert('I tried my best');
                } else {
                    setdata(json.data);
                }

                const json1 = await response1.json();
                if (!json.success) {
                    alert('I tried my best');
                } else {
                    json1.data.Courses.forEach(course => {
                        if (course.courseType === 'Program Elective 1') setelecregistered1(false);
                        if (course.courseType === 'Program Elective 2') setelecregistered2(false);
                        if (course.courseType === 'Program Elective 3') setelecregistered3(false);
                        if (course.courseType === 'Other Elective 1') setelecregistered4(false);
                        if (course.courseType === 'Other Elective 2') setelecregistered5(false);
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <div className="scrollable-wrapper" style={{ position: 'relative', maxHeight: '70vh', overflowY: 'scroll' }}>
                <div className="scrollable-section" style={{ position: 'relative', padding: '10px' }}>
            <section className="accordion">
                {/* Accordion 1 */}
                <div className="tab">
                    <input
                        type="checkbox"
                        name="accordion-1"
                        id="cb1"
                        checked={isChecked1}
                        onChange={() => setIsChecked1(!isChecked1)}
                    />
                    <label htmlFor="cb1" className="tab__label">
                        Program Elective 1
                    </label>
                    {data && data.length > 0 && (
                        <div className="tab__content">
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Course ID</th>
                                        <th>Course Name</th>
                                        <th>Course Instructor</th>
                                        <th>Credits</th>
                                        <th>Seats Remaining</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(course => {
                                        if (course.courseType === 'Program Elective 1') {
                                            return (
                                                <tr key={course.id}>
                                                    <td>
                                                        <input
                                                            type="radio"
                                                            id="radio-group-1"
                                                            checked={selectedCourseId1 === course._id}
                                                            onChange={() => handleRadioChange1(course._id)}
                                                        >
                                                        </input>
                                                    </td>
                                                    <td>{course.courseId}</td>
                                                    <td>{course.name}</td>
                                                    <td>
                                                        {
                                                            course.Faculty.map((fac, facIndex) => (
                                                                <React.Fragment key={facIndex}>
                                                                    {fac.name}&nbsp;&nbsp;
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                    </td>
                                                    <td>{course.credits}</td>
                                                    <td>{course.seats - course.Students.length}</td>
                                                </tr>
                                            );
                                        }
                                        return null;
                                    })}
                                    <tr style={{ backgroundColor: 'white' }}>
                                        {elecregistered1 && (
                                            <button type="button" className="confirmbutton" onClick={handleConfirm1} style={{ marginTop: '10px' }}>
                                                Confirm Selection
                                            </button>
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Accordion 2 */}
                <div className="tab">
                    <input
                        type="checkbox"
                        name="accordion-2"
                        id="cb2"
                        checked={isChecked2}
                        onChange={() => setIsChecked2(!isChecked2)}
                    />
                    <label htmlFor="cb2" className="tab__label">
                        Program Elective 2
                    </label>
                    {data && data.length > 0 && (
                        <div className="tab__content">
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Course ID</th>
                                        <th>Course Name</th>
                                        <th>Course Instructor</th>
                                        <th>Credits</th>
                                        <th>Seats Remaining</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(course => {
                                        if (course.courseType === 'Program Elective 2') {
                                            return (
                                                <tr key={course.id}>
                                                    <td>
                                                        <input
                                                            type="radio"
                                                            id="radio-group-2"
                                                            checked={selectedCourseId2 === course._id}
                                                            onChange={() => handleRadioChange2(course._id)}
                                                        >
                                                        </input>
                                                    </td>
                                                    <td>{course.courseId}</td>
                                                    <td>{course.name}</td>
                                                    <td>
                                                        {
                                                            course.Faculty.map((fac, facIndex) => (
                                                                <React.Fragment key={facIndex}>
                                                                    {fac.name}&nbsp;&nbsp;
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                    </td>
                                                    <td>{course.credits}</td>
                                                    <td>{course.seats - course.Students.length}</td>
                                                </tr>
                                            );
                                        }
                                        return null;
                                    })}
                                    <tr style={{ backgroundColor: 'white' }}>
                                        {elecregistered2 && (
                                            <button type="button" className="confirmbutton" onClick={handleConfirm2} style={{ marginTop: '10px' }}>
                                                Confirm Selection
                                            </button>
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Accordion 3 */}
                <div className="tab">
                    <input
                        type="checkbox"
                        name="accordion-3"
                        id="cb3"
                        checked={isChecked3}
                        onChange={() => setIsChecked3(!isChecked3)}
                    />
                    <label htmlFor="cb3" className="tab__label">
                        Program Elective 3
                    </label>
                    {data && data.length > 0  && (
                        <div className="tab__content">
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Course ID</th>
                                        <th>Course Name</th>
                                        <th>Course Instructor</th>
                                        <th>Credits</th>
                                        <th>Seats Remaining</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(course => {
                                        if (course.courseType === 'Program Elective 3') {
                                            return (
                                                <tr key={course.id}>
                                                    <td>
                                                        <input
                                                            type="radio"
                                                            id="radio-group-3"
                                                            checked={selectedCourseId3 === course._id}
                                                            onChange={() => handleRadioChange3(course._id)}
                                                        >
                                                        </input>
                                                    </td>
                                                    <td>{course.courseId}</td>
                                                    <td>{course.name}</td>
                                                    <td>
                                                        {
                                                            course.Faculty.map((fac, facIndex) => (
                                                                <React.Fragment key={facIndex}>
                                                                    {fac.name}&nbsp;&nbsp;
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                    </td>
                                                    <td>{course.credits}</td>
                                                    <td>{course.seats - course.Students.length}</td>
                                                </tr>
                                            );
                                        }
                                        return null;
                                    })}
                                    <tr style={{ backgroundColor: 'white' }}>
                                        {elecregistered3 && (
                                            <button type="button" className="confirmbutton" onClick={handleConfirm3} style={{ marginTop: '10px' }}>
                                                Confirm Selection
                                            </button>
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Accordion 4 */}
                <div className="tab">
                    <input
                        type="checkbox"
                        name="accordion-4"
                        id="cb4"
                        checked={isChecked4}
                        onChange={() => setIsChecked4(!isChecked4)}
                    />
                    <label htmlFor="cb4" className="tab__label">
                        Other Elective 1
                    </label>
                    {data && data.length > 0  && (
                        <div className="tab__content">
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Course ID</th>
                                        <th>Course Name</th>
                                        <th>Course Instructor</th>
                                        <th>Credits</th>
                                        <th>Seats Remaining</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(course => {
                                        if (course.courseType === 'Other Elective 1') {
                                            return (
                                                <tr key={course.id}>
                                                    <td>
                                                        <input
                                                            type="radio"
                                                            id="radio-group-4"
                                                            checked={selectedCourseId4 === course._id}
                                                            onChange={() => handleRadioChange4(course._id)}
                                                        >
                                                        </input>
                                                    </td>
                                                    <td>{course.courseId}</td>
                                                    <td>{course.name}</td>
                                                    <td>
                                                        {
                                                            course.Faculty.map((fac, facIndex) => (
                                                                <React.Fragment key={facIndex}>
                                                                    {fac.name}&nbsp;&nbsp;
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                    </td>
                                                    <td>{course.credits}</td>
                                                    <td>{course.seats - course.Students.length}</td>
                                                </tr>
                                            );
                                        }
                                        return null;
                                    })}
                                    <tr style={{ backgroundColor: 'white' }}>
                                        {elecregistered4 && (
                                            <button type="button" className="confirmbutton" onClick={handleConfirm4} style={{ marginTop: '10px' }}>
                                                Confirm Selection
                                            </button>
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Accordion 5 */}
                <div className="tab">
                    <input
                        type="checkbox"
                        name="accordion-5"
                        id="cb5"
                        checked={isChecked5}
                        onChange={() => setIsChecked5(!isChecked5)}
                    />
                    <label htmlFor="cb5" className="tab__label">
                        Other Elective 2
                    </label>
                    {data && data.length > 0 && (
                        <div className="tab__content">
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Course ID</th>
                                        <th>Course Name</th>
                                        <th>Course Instructor</th>
                                        <th>Credits</th>
                                        <th>Seats Remaining</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(course => {
                                        if (course.courseType === 'Other Elective 2') {
                                            return (
                                                <tr key={course.id}>
                                                    <td>
                                                        <input
                                                            type="radio"
                                                            id="radio-group-5"
                                                            checked={selectedCourseId5 === course._id}
                                                            onChange={() => handleRadioChange5(course._id)}
                                                        >
                                                        </input>
                                                    </td>
                                                    <td>{course.courseId}</td>
                                                    <td>{course.name}</td>
                                                    <td>
                                                        {
                                                            course.Faculty.map((fac, facIndex) => (
                                                                <React.Fragment key={facIndex}>
                                                                    {fac.name}&nbsp;&nbsp;
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                    </td>
                                                    <td>{course.credits}</td>
                                                    <td>{course.seats - course.Students.length}</td>
                                                </tr>
                                            );
                                        }
                                        return null;
                                    })}
                                    <tr style={{ backgroundColor: 'white' }}>
                                        {elecregistered5 && (
                                            <button type="button" className="confirmbutton" onClick={handleConfirm5} style={{ marginTop: '10px' }}>
                                                Confirm Selection
                                            </button>
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
            </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button type="button" className="finalbutt" onClick={handleFinish}>
                    Confirm and finish registration
                </button>
            </div>
        </div>
    );
}
