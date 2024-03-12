import React, { useEffect, useState } from 'react';
import "../stylesheets/coursedropstyle.css";
import { Link, useNavigate } from 'react-router-dom';

export default function CourseDrop() {

  const [data, setdata] = useState({});
  const [selectedCourses, setSelectedCourses] = useState([]);
  let navigate = useNavigate();

  async function handleDrop(){
    for(let i = 0; i < selectedCourses.length; i++){
      let response = await fetch('http://localhost:5000/api/dropcourse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ courseRId: selectedCourses[i], authToken: localStorage.getItem('authToken') })
        });

        let json = await response.json();

        if (!json.success) {
          alert('I tried my best');
        }
    }
    navigate('/alstudent');
  }

  useEffect(() => {
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

        if (!json.success) {
          alert('I tried my best');
        } else {
          setdata(json.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  const handleCheckboxChange = (id) => {
    const updatedSelectedCourses = [...selectedCourses];
    const index = updatedSelectedCourses.indexOf(id);
    
    if (index > -1) {
      updatedSelectedCourses.splice(index, 1); // Remove from array if already exists
    } else {
      updatedSelectedCourses.push(id); // Add to array if doesn't exist
    }
    
    setSelectedCourses(updatedSelectedCourses);
  };

  return (
    <div>
      <div className="panel">
        <h2>Available Courses for Dropping</h2>
        {data.Courses && data.Courses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Drop</th>
                <th>Course Name</th>
                <th>Credits</th>
              </tr>
            </thead>
            <tbody>
              {data.Courses.map((item, index) => (
                <>
                {
                  item.courseType === 'Program Course' ? (
                    <></>
                  ) : (
                    <tr key={index}>
                      <td>
                        <input
                          type="checkbox"
                          onChange={() => handleCheckboxChange(item._id)}
                          checked={selectedCourses.includes(item._id)}
                        />
                      </td>
                      <td>{item.courseId}</td>
                      <td>{item.credits} Credits</td>
                    </tr>
                  )
                }
                </>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No courses available</p>
        )}
      </div>
      <div className="action-buttons">
        <Link to='/alstudent'><button>Back to Homepage</button></Link>
        <button onClick={handleDrop}>Confirm Drop</button>
      </div>
    </div>
  );
}
