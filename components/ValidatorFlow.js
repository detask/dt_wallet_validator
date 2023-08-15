import React, { Component } from 'react';
import { Grid, Icon, Container } from 'semantic-ui-react';

class ValidatorFlow extends Component {


    render () {

        const { amountSend, amountReceive } = this.props;

        return(
            <Container>
                <div style={{ marginTop: "20px" }}>
                    <h3>Validation flow</h3>
                </div>
                <div style={{ marginTop: "20px" }}>
                    <Grid columns={5}>
                        <Grid.Row centered>
                            <Grid.Column style={{ textAlign: "center" }}>
                                <div>
                                    <Icon circular size='big' color='green' name='dollar sign' />
                                </div>
                                <div>
                                    Start validation
                                </div>
                                <div>
                                    Send ~ {amountSend} USDT
                                </div>
                            </Grid.Column>
                            <Grid.Column style={{ textAlign: "center" }}>
                                <div>
                                    <Icon size='big' name='arrow right' />
                                </div>
                                <div>
                                </div>
                            </Grid.Column>
                            <Grid.Column style={{ textAlign: "center" }}>
                                <div>
                                    <Icon circular size='big' color='orange' name='handshake outline' />
                                </div>
                                <div>
                                    Complete validation
                                </div>
                                <div>
                                    Send ~ {amountReceive} USDT back
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </Container>
        );
    }

}

export default ValidatorFlow;