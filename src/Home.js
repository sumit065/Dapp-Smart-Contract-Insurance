import React from 'react';
import { Button, Form } from 'react-bootstrap';

class Home extends React.Component {

    render() {
        return(
            <div class="w-25 p-3 container justify-content-center">
                <Form onSubmit={this.props.handleSubmit}>
                    <Form.Group className="mb-3" controlId="contractAddress">
                        <Form.Label>Contract Address</Form.Label>
                        <Form.Control type="text" placeholder="Enter contract address"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="insuredAmount">
                        <Form.Label>Insurance Amount</Form.Label>
                        <Form.Control type="text" placeholder="Enter sum assured" />
                    </Form.Group>
                    {  this.props.applicationSuccess
                      ?( <Button variant="outline"> Applied </Button>)
                      :( <Button variant="primary" type="submit"> Apply </Button> )
                    }
                </Form>
            </div>
        );
    }
}

export default Home;