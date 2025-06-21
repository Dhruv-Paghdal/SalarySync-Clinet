import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100vh"}}>
      <Card className='m-3'>
        <Card.Body className='p-4'>
          <Card.Title className='pt-3 text-primary'>Page Not Found</Card.Title>
          <Card.Text className='py-2'>
            The page you are attempting to access does not exist at the moment. 
          </Card.Text>
          <Link to="/" onClick={()=>{localStorage.removeItem("token")}}><Button className='w-100'>Home</Button></Link>
        </Card.Body>
      </Card>
    </div>
  )
}

export default ErrorPage;