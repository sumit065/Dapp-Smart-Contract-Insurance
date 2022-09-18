import React from 'react';
import { Button, Form, Card } from 'react-bootstrap';

class Applications extends React.Component {

    applicationDetails = ( details ) => {
        return ( 
                <Card className="mb-5" > 
                    {Object.keys(details).map( (k) => {
                        return (<Card.Body> {k + ": " + details[k]} </Card.Body>);
                    })}
                </Card> 
        );
    }

    render() {
        return(
            <div class="w-50 p-3 container justify-content-center">
                    <Form onSubmit={this.props.handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label> Contract Address </Form.Label>
                            <Form.Control type="text" placeholder="Enter contract address to view details" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Button variant="primary" type="submit"> Submit </Button>
                        </Form.Group>
                    </Form>
                {
                    this.props.applicationDetails != {}
                    ?( this.applicationDetails(this.props.applicationDetails) )
                    :( <> </>) 
                }
            </div>

        );
    }
}

export default Applications;