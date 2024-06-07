import React from 'react'
import { Link } from "react-router-dom"
function Footer() {
    const footerStyle = {
        background: 'linear-gradient(#ba89df, rgb(53 109 237))',
        padding: '10px'
    }

    return (
        <div className='footer' style={footerStyle}>
            <div className='text-center my-0 py-2 no-border'>
                <Link className='px-2 text-white' to="/create-student"><span className='b-border'>About</span></Link> |
                <Link className='px-2 text-white' to="/contact"><span className='b-border'>Contact</span></Link> |
                <Link className='px-2 text-white' to="/policy"><span className='b-border'>Privacy Policy</span></Link> 
            </div>
            <h4 className='text-center'>All Right Reserved &copy; Vijay Mane</h4>
        </div>
    )
}

export default Footer