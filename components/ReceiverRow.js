import React, { Component } from 'react';
import { Table, Button, Label, Icon, Form, Message } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { Router } from '../routes';
import walletCheck from "../ethereum/walletCheck";

class ReceiverRow extends Component {
    
    async componentDidMount(){
        this.setState({
            address: this.props.address,
            validated: this.props.validated
        });        
    }

    state = {
        errorMessage: '',
        loading: false,
        address: '',
        validated: false
    }

    render() {
        const { Row, Cell } = Table;

    return (
        <Row>
            <Cell>
                {this.state.address}
            </Cell>
            <Cell>
                <Icon circular inverted size='large' color='green' name='checkmark' />
            </Cell>
            <Cell>
                {this.state.validated ? (
                    <Icon circular inverted size='large' color='green' name='checkmark' />
                    ) : (
                    <Icon circular inverted size='large' color='orange' name='clock' />
                )}
            </Cell>
        </Row>
      );
    }
}

export default ReceiverRow;