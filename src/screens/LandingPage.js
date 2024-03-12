import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import "../stylesheets/landingpage.css";

function LandingPage() {

    let navigate = useNavigate();

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
                    if (json.usertype === 'Student') {
                        navigate('/alstudent');
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        }
      
        authorize();
        // eslint-disable-next-line
      }, [])

    const [UserType, setUserType] = useState('user');

    const [creds, setcreds] = useState({ email: "", password: "" })

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/api/loginuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usertype: {UserType}, email: creds.email, password: creds.password })
        });
        const json = await response.json()
        if (!json.success) {
            alert('Enter Valid Credentials');
        }
        else {
            localStorage.setItem('authToken', json.authToken);
            localStorage.setItem('Id', json.Id);
            //console.log(localStorage.getItem('authToken'));
            let temp = {UserType}.UserType;
            if(temp === "Student"){
                navigate('/alstudent');
            }
            else if(temp === "Faculty"){
                navigate('/alfaculty');
            }
            else{
                navigate('/adminmain');
            }
        }
    }

    const onChange = (event) => {
        setcreds({ ...creds, [event.target.name]: event.target.value })
    }

    function showLogin(){
        console.log({UserType});
        var studentLogin = document.getElementById("studentLogin");
        var buttons = document.querySelectorAll('.button-container .button');
    
        // Show the studentLogin element with sliding effect
        studentLogin.style.display = "block";
        studentLogin.style.animation = "slideIn 0.5s ease";
        
        // Shrink the overlay-div to 50% width with sliding effect
        document.querySelector('.full-screen-div').style.width = '50%';
        document.querySelector('.overlay-div').style.width = '100%';
    
        buttons.forEach(button => {
            button.style.display = 'none';
        });
    }

    const showStudentLogin = () => {
        setUserType('Student');
        showLogin();
      };
    
      const showFacultyLogin = () => {
        setUserType('Faculty');
        showLogin();
      };
    
      const showAdminLogin = () => {
        setUserType('Admin');
        showLogin();
      };

    function backToNormal() {
        var studentLogin = document.getElementById("studentLogin");
        var buttons = document.querySelectorAll('.button-container .button');
        var buttonContainer = document.querySelector('.button-container');
    
        // Adjust the width and centering of the button container
        buttonContainer.style.width = '100%';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
    
        // Hide the studentLogin element with sliding effect
        studentLogin.style.animation = "slideOut 0.5s ease";
        setTimeout(() => {
            studentLogin.style.display = "none";
        }, 500); // Wait for the animation to complete before hiding
    
        // Restore the overlay-div to 100% width with sliding effect
        document.querySelector('.overlay-div').style.width = '50%';
        document.querySelector('.full-screen-div').style.width = '100%';
    
        // Show the buttons
        buttons.forEach(button => {
            button.style.display = 'block';
        });
    }
    return (
        <div>
            <div className="full-screen-div">
                <div className="overlay-div">
                    <div className="content-container">
                        <p id="maintext">Online Course Registration System</p>
                    </div>

                    <div className="button-container" >
                        <button className="button" onClick={showStudentLogin}>Student Login</button>
                        <button className="button" onClick={showFacultyLogin}>Faculty Login</button>
                        <button className="button" onClick={showAdminLogin}>Admin Login</button>
                    </div>

                </div>
            </div>
            <div id="studentLogin" className="hidden-overlay">
                <div className="everythinghidden">
                    <button className="hiddenoverlaybutton" onClick={backToNormal} style={{marginLeft:'0px'}}>Back</button>
                    <p>Hey {UserType}, <br></br> Please Login to continue</p>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email:</label>

                        <input type="email" id="email" name="email" required value={creds.email} onChange={onChange}></input>

                        <label htmlFor="password">Password:</label>

                        <input type="password" id="password" name="password" required value={creds.password} onChange={onChange}></input>
                        <br></br>
                        <button type="submit">Login</button>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default LandingPage;
