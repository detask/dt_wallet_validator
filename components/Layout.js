import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Head from "next/head";
import { Container } from 'semantic-ui-react';
import { NextScript } from "next/document";


const Layout = (props) => {

    return (
        <Container>
            <Head>
                <title>Crypto wallet address validator | DeTask</title>
                <meta name="description" content="DeTask free tool to validate your wallet address"/>
                <meta name="keywords" content="crypto"/>

                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="validator.detask" />
                <meta property="og:title" content="DeTask free tool to validate your wallet address" />
                <meta property="og:description" content="crypto" />

                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css"/>

            </Head>
            <Header/>
            {props.children}
            <Footer/>
        </Container>
    );

};

export default Layout;