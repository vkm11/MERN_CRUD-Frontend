import React from 'react'
import Footer from './Footer';
import Header from './Header';
const Layout = (props) => {

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <main style={{ flex: 1, minHeight: 0, height: "100%", overflowY: "auto" }}>
                {props.children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout;