import React from "react";
import {Container, Row, Col, Card, Button} from 'react-bootstrap';
import Slider from "../inc/Slider";

function Home() {
    return (
        <div>
            <Slider/>

            <section className="section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <h3 className="nain-heading">Our Company</h3>
                            <div className="underline mx-auto"></div>
                            <p>
                                Careerboost is simply tool to help you find better job for you
                            </p>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
}

export default Home;