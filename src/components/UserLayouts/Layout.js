import React from 'react'
import Header from './Header'
import Footer from './Footer'
function Layout({ children }) {
    return (
        <div>
            <Header />
            <main className='min-vh-78'>
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout
