import React, { Component } from 'react';
import { Table, Button, Label, Message, Form } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { Router } from '../routes';
import walletCheck from "../ethereum/walletCheck";

class WaitingApproveRows extends Component {

    state = {
        errorMessage: '',
        loading: false
    }

    onApprove = async (event)  => {
        event.preventDefault();

        try {

            this.setState({loading: true}); 

            const accounts = await web3.eth.getAccounts();
            await walletCheck.methods.step2(this.props.address).send({
                from: accounts[0],
                value: Number(this.props.weiAmountToSendBack)
            });
        
            this.setState({ 
                errorMessage: '', 
                loading: false
             });

             Router.reload(window.location.pathname)
                
        } catch (error) {
            this.setState({ 
                errorMessage: error.message, 
                loading: false
             });
        }
      };
    
    render() {
        const { Row, Cell } = Table;
        const { address, weiAmountToSendBack } = this.props;

    return (
        <Row>
            <Cell>
                {address}
            </Cell>
            <Cell>
                <Form error={!!this.state.errorMessage}>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button color="green" loading={this.state.loading} onClick={this.onApprove}>
                        Confirm
                    </Button>
                </Form>
            </Cell>
        </Row>
      );
    }
}

export default WaitingApproveRows;