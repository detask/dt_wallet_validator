import React from "react";
import { Menu, Message } from "semantic-ui-react";
import { Link } from "../routes";
import web3 from "../ethereum/web3";
import { Router } from "../routes";


const Header = (props) => {

    const onClickMyTasks = async (event) => {
        event.preventDefault();
        const accounts = await web3.eth.getAccounts();
        Router.pushRoute(`/task/my/${accounts[0]}`);
    };
    
    return (
        <div style={{ marginTop: "10px" }}>
            <div hidden>
                <Menu style={{ marginTop: "10px" }}>
                    <Link route="/">
                        <a className="item">Wallet validator</a>
                    </Link>
                </Menu>
            </div>
            <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                {/*<Message color="blue" header="Use Polygon Mumbai (MATIC) ONLY!!!" content="Please DO NOT use real crypto wallet on this project."></Message>*/}
            </div>
        </div>
    );

};

export default Header;