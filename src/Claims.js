import React from 'react';
import { Button, Form } from 'react-bootstrap';

class Claims extends React.Component {
    render() {
        return(
            <div class="w-25 p-3 container justify-content-center">
                <Form onSubmit={this.props.handleClaimSubmit}>
                    <Form.Group className="mb-3" controlId="contractAddress">
                        <Form.Label>Contract Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter contract address"/>
                    </Form.Group>
                    {  this.props.claimSuccess
                      ?( <Button variant="outline"> Claimed </Button>)
                      :( <Button variant="primary" type="submit"> Claim </Button> )
                    }
                </Form>
            </div>
        );
    }
}

export default Claims;