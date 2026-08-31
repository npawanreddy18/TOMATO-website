import React, { useState } from "react";

import Header from "../../components/header/header";
import ExploreMenu from "../../components/exploremenu/exploremenu";
import FoodDisplay from "../../components/FoodDisplay/FoodDisplay";
import AppDownload from "../../components/AppDownload/AppDownload";

import "./home.css";

const Home = () => {

    const [category, setCategory] = useState("All");

    return (
        <div className="home">

            {/* HEADER */}
            <Header />

            {/* EXPLORE MENU */}
            <ExploreMenu
                category={category}
                setCategory={setCategory}
            />

            {/* FOOD DISPLAY */}
            <FoodDisplay
                category={category}
            />

            {/* APP DOWNLOAD */}
            <AppDownload />

        </div>
    );
};

export default Home;