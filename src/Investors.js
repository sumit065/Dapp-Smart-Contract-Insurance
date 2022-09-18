import React from 'react';
import { Form, Container, Row, Col, Accordion, Button, Badge } from 'react-bootstrap';

class Investors extends React.Component {

    pendingApplications =  ( applications ) => {
        return (
            <Accordion> 
               { applications.map( (x) => {
                    return (<Accordion.Item eventKey={applications.indexOf(x).toString()}>
                        <Accordion.Header> { x } </Accordion.Header>
                        <Accordion.Body>
                            <Button variant="link" onClick={(e) => {  e.preventDefault();
                                                                      this.props.handleApplicationAccept(x)}} > Accept </Button>
                            <Button variant="link"  onClick={(e) => { e.preventDefault();
                                                                      this.props.handleApplicationReject(x)}}> Reject </Button>
                        </Accordion.Body>
                    </Accordion.Item>);
               })}
            </Accordion>
        );
    }

    pendingClaims =  ( claims ) => {
        return (
            <Accordion> 
               { claims.map( (x) => {
                    return (<Accordion.Item eventKey={claims.indexOf(x).toString()}>
                        <Accordion.Header> { x } </Accordion.Header>
                        <Accordion.Body>
                            <Button variant="link" onClick={(e) => {  e.preventDefault();
                                                                      this.props.handleClaimAccept(x)}} > Accept </Button>
                            <Button variant="link"  onClick={(e) => { e.preventDefault();
                                                                      this.props.handleClaimReject(x)}}> Reject </Button>
                        </Accordion.Body>
                    </Accordion.Item>);
               })}
            </Accordion>
        );
    }

    render() {
        return (
            <Container class="p-3 container justify-content-center">
                <Row>
                    <Col className="p-3 justify-content-center">
                        <Form onSubmit={this.props.handleInvestorApplicationSubmit}>
                            <Form.Group className="mb-3" controlId="contractAddress">
                                <Form.Label>Invest in insurance pool</Form.Label>
                                <Form.Control type="text" placeholder="Enter amount to invest"/>
                            </Form.Group>
                            <Button variant="primary" type="submit"> Apply </Button>
                        </Form>
                    </Col>
                    <Col  className="p-3 justify-content-center">
                        <Button variant="link" onClick={this.props.handlePendingApplicationsQuery}>
                            Vote for pending applications
                        </Button>
                        {
                            (this.props.pendingApplications)
                            ?( this.pendingApplications(this.props.pendingApplications) )
                            :(  <div className="p-3 justify-content-center">
                                    <p> Connect wallet to view this section. </p>
                                </div>
                            )
                        }
                    </Col>
                    <Col className="p-3 justify-content-center">
                        <Button variant="link" onClick={this.props.handlePendingClaimsQuery}>
                            Vote for pending claims
                        </Button>
                        {
                            (this.props.pendingClaims)
                            ?( this.pendingClaims(this.props.pendingClaims) )
                            :(  <div className="p-3 justify-content-center">
                                    <p> Connect wallet to view this section. </p>
                                </div>
                            )
                        }
                    </Col>
                </Row>
            </Container>
        );
    }
}
/*
<Accordion> 
               { applications.map( (x) => {
                    <Accordion.Item eventKey={applications.indexOf(x).toString()}>
                        <Accordion.Header> { x } </Accordion.Header>
                        <Accordion.Body>
                            <Button variant="primary"> Accept </Button>
                            <Button variant="danger"> Accept </Button>
                        </Accordion.Body>
                    </Accordion.Item>
               })}
            </Accordion>
*/

export default Investors;