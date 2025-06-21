import React, {useState} from 'react';
import Container from 'react-bootstrap/Container';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {Grid1x2, Coin, People, Person, BoxArrowLeft, Bank} from 'react-bootstrap-icons';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './css/navbar.css';

const AppNavbar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  }
  return (
    <>
      <Navbar expanded={expanded} expand="lg" className='d-lg-none'>
        <Container>
          <Navbar.Brand className='navbarTitle'>Salary-Sync</Navbar.Brand>
          <Navbar.Toggle onClick={() => setExpanded(expanded ? false : "expanded")} aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
          <Nav variant="pills" className="me-auto mt-2">
            <Nav.Item>
              <Nav.Link onClick={() => setExpanded(false)}><NavLink to="/home/dashboard" className='nav-link ps-2'><Grid1x2/> <span className='ps-2'>Dashboard</span></NavLink></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setExpanded(false)}><NavLink to="/home/salary" className='nav-link ps-2'><Coin /> <span className='ps-2'>Salary</span></NavLink></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setExpanded(false)}><NavLink to="/home/loan" className='nav-link ps-2'><Bank /> <span className='ps-2'>Loan</span></NavLink></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setExpanded(false)}><NavLink to="/home/employee" className='nav-link ps-2'><People /> <span className='ps-2'>Employees</span></NavLink></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setExpanded(false)}><NavLink to="/home/profile" className='nav-link ps-2'><Person /> <span className='ps-2'>Profile</span></NavLink></Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => {setExpanded(false); handleLogout()}}><NavLink to="/" className='nav-link ps-2'><BoxArrowLeft /> <span className='ps-2'>Logout</span></NavLink></Nav.Link>
            </Nav.Item>
          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Offcanvas show={true} backdrop={false} scroll={true} className="sidebar">
        <Offcanvas.Header >
          <Offcanvas.Title className='navbarTitle'>Salary-Sync</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav variant="pills" className="me-auto offcanvasItems">
            <div>
              <Nav.Item className='mb-2'>
                <NavLink to="/home/dashboard" className='nav-link ps-2'><Grid1x2/> <span className='ps-2'>Dashboard</span></NavLink>
              </Nav.Item>
              <Nav.Item className='mb-2'>
                <NavLink to="/home/salary" className='nav-link ps-2'><Coin /> <span className='ps-2'>Salary</span></NavLink>
              </Nav.Item>
              <Nav.Item className='mb-2'>
                <NavLink to="/home/loan" className='nav-link ps-2'><Bank /> <span className='ps-2'>Loan</span></NavLink>
              </Nav.Item>
              <Nav.Item className='mb-2'>
                <NavLink to="/home/employee" className='nav-link ps-2'><People /> <span className='ps-2'>Employees</span></NavLink>
              </Nav.Item>
            </div>
            <div>
              <Nav.Item className='mb-2'>
                <NavLink to="/home/profile" className='nav-link ps-2'><Person /> <span className='ps-2'>Profile</span></NavLink>
              </Nav.Item>
              <Nav.Item className='mb-2'>
                <div onClick={()=>{handleLogout()}} className='nav-link ps-2'><BoxArrowLeft /> <span className='ps-2'>Logout</span></div>
              </Nav.Item>
            </div>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default AppNavbar;