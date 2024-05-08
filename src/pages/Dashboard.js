import React from 'react';
import Layout from "../components/Layouts/Layout";

function Dashboard() {

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh'
    };

    return (
        <Layout>
            <>
                <div>
                    <h5>Dashboard works here</h5>
                </div>
                <div style={containerStyle}>
                    <div className='text-center'>
                        <h3 style={{ fontSize: "-webkit-xxx-large", fontFamily: "serif" }}>Welcome to Online School</h3>
                    </div>
                </div>
            </>
        </Layout>
    );
}

export default Dashboard;
