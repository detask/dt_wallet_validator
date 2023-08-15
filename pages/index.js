import React, { Component } from "react";
import { Button, Message, Table, Form, Input, Segment, Label } from 'semantic-ui-react';
import walletCheck from "../ethereum/walletCheck";
import Layout from "../components/Layout";
import ReceiverRow from "../components/ReceiverRow";
import WaitingApproveRows from "../components/WaitingApproveRows";
import ValidatorFlow from "../components/ValidatorFlow";
import { Router } from "../routes";
import web3 from '../ethereum/web3';
const { getEthPriceNow } = require('get-eth-price');
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


class WalletValidatorIndex extends Component {
    
    static async getInitialProps() {

        let ethPrices;
        await getEthPriceNow()
        .then( data => {
            ethPrices = data;
        });

        //Run on sercer side
        //console.log("ethPrices", ethPrices)

        Object.entries(ethPrices).map(([key, value]) => {
            ethPrices = ethPrices[key].ETH;
        });

        return {
            myAccount: 'Not connected',
            walletValidated: false,
            amountToTransfer: 5000000000000,
            amountToSendBack: 1000000000000,
            ethPrices: ethPrices
        };
    }

    async componentDidMount() {

        if (web3)
        {
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            const accShort = account.substring(0, 5) + "..." + account.slice(-4);

            let waitingMyConfirmation;
            let recList;
            let sendersCount;

            try {
                waitingMyConfirmation = await walletCheck.methods.sendersWaitingByReceiver().call();
                recList = await walletCheck.methods.getReceiversBySender().call({from: account});
                sendersCount = await walletCheck.methods.sendersCount().call({from: account});
            } catch (error) {
                console.log("error", error);
            }
        
            this.setState({
                myAccount: account,
                myAccountShort: accShort,
                waitingMyConfirmation: waitingMyConfirmation ?? [],
                receiverList: recList ?? [],
                totalSenders: sendersCount ?? 0
            });
        }

        /*
        const firebaseConfig = {
            apiKey: "",
            authDomain: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: "",
            measurementId: ""
        };
        
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        */
    }
    
    state = {
        receiverWallet: '',
        loading: false,
        errorMessage: '',
        waitingMyConfirmation: [],
        receiverList: [],
        totalSenders: 0
    }


    convertEthToUSDT(weiPrice){
        
        try {

            //Erro
            //console.log("this.props.ethPrices.USD", this.props.ethPrices.USD);
            //console.log("weiPrice", weiPrice)

            const eth = web3.utils.fromWei(weiPrice.toString(), 'ether');
            const usdc = this.props.ethPrices.USD;
            return Number(eth * usdc).toFixed(4);
        } catch (error) {
            return 0;            
        }
    }

    onValidateWallet = async (event) => {
        event.preventDefault();

        let errorMsg = "";
        const accounts = await web3.eth.getAccounts();

        if(this.state.receiverWallet == "")
        {
            errorMsg += "Invalid wallet address. ";
        }

        if (this.state.receiverWallet == accounts[0])
        {
            errorMsg += "You cannot validate your own wallet. ";
        }

        if (errorMsg == "") 
        {
            const exists = await walletCheck.methods.walletValidatedBySender(this.state.receiverWallet).call({from: accounts[0]});
            if (exists == true)
            {
                errorMsg += "This receiver's wallet address was already validated. ";
            }
        }

        if (errorMsg != "")
        {
            this.setState({ 
                errorMessage: errorMsg, 
                walletValidated: false });
        }
        else 
        {

            try 
            {
                this.setState({loading: true}); 
    
                await walletCheck.methods
                .step1(
                    this.state.receiverWallet
                )
                .send({
                    from: accounts[0],
                    value: Number(this.props.amountToTransfer)
                });
    
                this.setState({
                    loading: false, 
                    walletValidated: true,
                    receiverWallet: ""
                });

                Router.reload(window.location.pathname)

            } catch (err) {
                this.setState({ 
                    errorMessage: err.message, 
                    loading: false, 
                    walletValidated: false });
            }
        }

    }

    renderWaitingApproveRows() {
        return this.state.waitingMyConfirmation.map((item, index) => {
          return (
            <WaitingApproveRows
                address={item}
                weiAmountToSendBack={this.props.amountToSendBack}
            />
          );
        });
    }

    renderValidatorFlow(){
        if (this.state.waitingMyConfirmation.length == 0){
            return(
                <ValidatorFlow
                    amountSend={this.convertEthToUSDT(this.props.amountToTransfer)}
                    amountReceive={this.convertEthToUSDT(this.props.amountToSendBack)}
                />
            )
        }
        else {
            return(null);
        }
    }

    renderWaitingApprove() {
        
        const { Header, Row, HeaderCell, Body } = Table;

        if (this.state.waitingMyConfirmation.length > 0){
            return(
                <div>
                    <div>
                    <Message color='yellow'>
                        <Message.Header>
                            List of sender's waiting your confimation!
                        </Message.Header>
                        <p>
                            Click on "Confirm" to send {this.convertEthToUSDT(this.props.amountToSendBack)} USDT back to the sender and complete the validation flow
                        </p>
                    </Message>
                        
                    </div>
                    <div style={{ marginTop: "20px" }}>
                        <Table>
                            <Header>
                                <Row>
                                <HeaderCell>Address</HeaderCell>
                                <HeaderCell>Action</HeaderCell>
                                </Row>
                            </Header>
                            <Body>{this.renderWaitingApproveRows()}</Body>
                        </Table>
                    </div>
                </div>
            );
        }
        else{
            return (<div></div>);
        }

    }

    renderReceiverRequest() {

        if (this.state.waitingMyConfirmation.length == 0){
            return(
                <Segment inverted>
                    <Form inverted onSubmit={this.onValidateWallet} error={!!this.state.errorMessage}>
                        <Form.Group widths={2}>
                            <Form.Field>
                                <Input
                                placeholder='Enter a receiver wallet address to start the validation'
                                value={this.state.receiverWallet}
                                onChange={event =>
                                    this.setState({ receiverWallet: event.target.value })}
                                />
                            </Form.Field>
                            <Message error header="Oops!" content={this.state.errorMessage} />
                            <Button color="green" loading={this.state.loading}>
                                Start
                            </Button>
                        </Form.Group> 
                    </Form>
                </Segment>
            );
        }
        else{
            return (<div></div>);
        }
    }

    renderReceiverHistory() {

        const { Header, HeaderCell, Body, Cell, Row } = Table;

        if (this.state.waitingMyConfirmation.length == 0){
            return(
                <Table>
                <Header>
                    <Row>
                    <HeaderCell>Wallet addresses status</HeaderCell>
                    <HeaderCell>Started</HeaderCell>
                    <HeaderCell>Completed</HeaderCell>
                    </Row>
                </Header>
                <Body>{this.renderReceiverRows()}</Body>
            </Table>
            );
        }
        else{
            return (<div></div>);
        }
    }

    renderReceiverRows() {
        return this.state.receiverList.map((item, index) => {
          return (
            <ReceiverRow
                address={item.receiver}
                validated={item.validated}
            />
          );
        });
    }

    onReload = (e) => {
        Router.reload(window.location.pathname)
    }

    render() {
        
        //const treasuryInfo = web3.utils.fromWei(String(this.props.balance ?? 0), 'ether') + " ETH on Treasury";
        //const approversInfo = this.props.approversCount + " approver(s)";

        return (
            <Layout>
                <div style={{ marginTop: "10px" }}>
                    <div>
                        <div>
                            <b>{this.state.totalSenders}</b> address(es) questested validation
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <h4>My Wallet: <Label  color='blue'>{this.state.myAccountShort}</Label></h4>
                        </div>
                    </div>
                    <div style={{ marginTop: "20px" }}>
                        {this.renderValidatorFlow()}
                    </div>
                    <div style={{ marginTop: "20px" }}>
                        {this.renderWaitingApprove()}
                    </div>
                    <div style={{ marginTop: "20px" }}>
                        {this.renderReceiverRequest()}
                    </div>
                    <div style={{ marginTop: "70px" }}>
                        {this.renderReceiverHistory()}
                    </div>
                </div>
            </Layout>
        );
    }
}

export default WalletValidatorIndex;