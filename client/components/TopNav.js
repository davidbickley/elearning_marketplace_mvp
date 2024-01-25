import { useState, useEffect, useContext } from 'react';
import { Context } from '../context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const TopNav = () => {
    const [current, setCurrent] = useState('');

    const { state, dispatch } = useContext(Context);
    const { user } = state

    const router = useRouter();

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    const logout = async () => {
        dispatch({ type: "LOGOUT" });
        window.localStorage.removeItem('user');
        const { data } =await axios.get('/api/logout');
        toast(data.message);
        router.push('/login')
    }

    return( 
        <Navbar className="bg-body-tertiary">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link key="/" onClick={ event => setCurrent(event.key)} href="/">Home</Nav.Link>

                    {user && user.role && user.role.includes("Instructor") ? (
                        <Nav.Link key="/instructor/course/create" href="/instructor/course/create" onClick={ event => setCurrent(event.key)}>
                                Create Course
                        </Nav.Link>
                    ) : (
                        <Nav.Link key="/user/become-instructor" href="/user/become-instructor" onClick={ event => setCurrent(event.key)}>
                                Become Instructor
                        </Nav.Link>
                    ) }

                    { user === null && (
                        <>
                        <Nav.Link key="/login" href="/login" onClick={ event => setCurrent(event.key)}>
                            Login
                        </Nav.Link>
                        <Nav.Link key="/register" href="/register" onClick={ event => setCurrent(event.key)}>
                            Register
                        </Nav.Link>
                        </>
                    )}

                    {user !== null && (
                        <NavDropdown title={user && user.name} id="basic-nav-dropdown">
                            <NavDropdown.Item key="/user" href="/user">
                                    Dashboard
                            </NavDropdown.Item>
                            {user && user.role && user.role.includes("Instructor") ? ( 
                                <NavDropdown.Item key="/instructor" href="/instructor">
                                        Instructor Dashboard
                                </NavDropdown.Item>
                            ) : ('') }
                            <NavDropdown.Item key="/logout" onClick={ logout } >
                                    Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default TopNav;