import React from "react";

import {
    assets
} from "../../assets/assets";

import "./AppDownload.css";

const AppDownload = () => {

    return (
        <section
            className="app-download"
            id="app-download"
        >

            <div className="app-download-content">

                <h2>
                    For Better Experience
                </h2>

                <h2>
                    Download Tomato App
                </h2>

                <p>
                    Order your favourite food
                    quickly and easily from
                    your mobile device.
                </p>


                <div className="app-download-platforms">

                    <a
                        href="#"
                        onClick={(event) =>
                            event.preventDefault()
                        }
                        aria-label="Download from Google Play"
                    >

                        <img
                            src={assets.play_store}
                            alt="Google Play"
                        />

                    </a>


                    <a
                        href="#"
                        onClick={(event) =>
                            event.preventDefault()
                        }
                        aria-label="Download from App Store"
                    >

                        <img
                            src={assets.app_store}
                            alt="App Store"
                        />

                    </a>

                </div>

            </div>

        </section>
    );
};

export default AppDownload;