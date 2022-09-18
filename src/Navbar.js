import React from 'react';
import { Link } from "react-router-dom";
import { Navbar, Container, Button, Nav } from 'react-bootstrap';
import logo from "./images/logo.png";

class Navigation extends React.Component {
    render(){
        return(
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="#home"> 
                        <img src={logo} width="40" height="40"/>
                        &nbsp; InsureSmart
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/"> Home </Nav.Link>
                            <Nav.Link as={Link} to="/applications"> Applications </Nav.Link>
                            <Nav.Link as={Link} to="/investors"> Investors </Nav.Link>
                            <Nav.Link as={Link} to="/claims"> Claims </Nav.Link>
                            <Nav.Link as={Link} to="/about"> About </Nav.Link>
                        </Nav>
                        <Nav>
                            {
                                this.props.account
                                ? ( <Button> {this.props.account.slice(0,5) + '...' + this.props.account.slice(38,42)}</Button> )
                                : ( <Button onClick={this.props.connectWallet}> Connect Wallet </Button> )
                            }
                            
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        )
    }
}

export default Navigation;