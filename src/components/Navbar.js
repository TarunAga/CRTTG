import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {

    let navigate = useNavigate();

    const handlelogout = () => {
        console.log(localStorage.getItem('authToken'));
        localStorage.removeItem('authToken');
        
        navigate('/login');
    }

    return (
        <div>
        </div>
    )
}