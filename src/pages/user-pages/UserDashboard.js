import React, { useState, useEffect } from 'react'

function UserDashboard() {
  const [name, setName] = useState('');

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  return (
    <>
      <div style={containerStyle}>
        <div className='text-center'>
          <h1>Welcome <span className='text-danger'>{name}...</span></h1>
        </div>
      </div>
    </>
   
  )
}

export default UserDashboard
