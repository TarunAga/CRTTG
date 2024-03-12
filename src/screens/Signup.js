import React, { useState, useEffect } from 'react'
import {Link, useNavigate } from 'react-router-dom'


export default function Signup() {

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

        authorize();
        // eslint-disable-next-line
    }, [])

    const [creds, setcreds] = useState({ usertype: "Faculty", email: "" })

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(creds.email.split('@')[1]!='lnmiit.ac.in')
        {
            alert('Only Domains with \'lnmiit.ac.in\' are allowed!');
            return true;
        }
        const response = await fetch('http://localhost:5000/api/createuser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usertype: creds.usertype, email: creds.email })
        });
        const json = await response.json()
        if (!json.success) {
            alert(json.errors);
        }
        else {
            localStorage.setItem('authToken', json.authToken);
            console.log(localStorage.getItem('authToken'));
            navigate('/adminmain');
        }
    }

    const onChange = (event) => {
        setcreds({ ...creds, [event.target.name]: event.target.value })
    }

    return (
            <div style={{width:'50%',marginLeft:'auto',marginRight:'auto'}}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{marginBottom:'20px'}}>
                        <label htmlFor="usertype" style={{ marginBottom: '5px', display: 'block' }}>User</label>
                        <select className="form-control" id="usertype" name='usertype' value={creds.usertype} onChange={onChange} style={{ width: '100%', padding: '5px', borderRadius: '4px', borderColor: '#ccc' }}>
                            <option>Faculty</option>
                            <option>Student</option>
                            <option>Admin</option>
                        </select>
                    </div>
                    <div className="form-group" style={{marginBottom:'20px'}}>
                        <label htmlFor="exampleInputEmail1" style={{ marginBottom: '5px', display: 'block' }}>Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" name='email' value={creds.email} onChange={onChange} style={{ width: '100%', padding: '5px', borderRadius: '4px', borderColor: '#ccc' }}></input>
                    </div>
                    <Link to='/adminmain'>
                    <button style={{ marginRight: '30px' }}>Back To Home</button>
                </Link>
                    <button type="submit" className="btn m-3 btn-primary" style={{ padding: '8px 20px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}>Submit</button>
                </form>
            </div>
        
    )
}


