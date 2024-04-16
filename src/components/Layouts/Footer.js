import React from 'react'
import { Link } from "react-router-dom"
function Footer() {
    const footerStyle = {
        background: 'linear-gradient(#ba89df, #8f8fef)',
        padding: '10px'
    }

    return (
        <div className='footer' style={footerStyle}>
            <h4 className='text-center'>All Right Reserved &copy; Vijay Mane</h4>
            <p className='text-center my-0 py-2'>
                <Link to="/create-student">About</Link> |
                <Link to="/contact">Contact</Link> |
                <Link to="/policy">Privacy Policy</Link> |
            </p>
        </div>
    )
}

export default Footer