import React from 'react';
import './exploremenu.css';

import { menu_list } from '../../assets/assets';

const ExploreMenu = ({ category, setCategory }) => {

    return (
        <div className="explore-menu" id="explore-menu">

            <h1>Explore Our Menu</h1>

            <p className="explore-menu-text">
                This menu shows good food for good health.
                View the items, choose what you love and enjoy!
            </p>

            <div className="explore-menu-list">

                {menu_list.map((item, index) => {

                    const isActive = category === item.menu_name;

                    return (
                        <div
                            key={index}
                            className="explore-menu-list-item"
                            onClick={() => {
                                setCategory(
                                    isActive
                                        ? 'All'
                                        : item.menu_name
                                );
                            }}
                        >

                            <img
                                className={isActive ? 'active' : ''}
                                src={item.menu_image}
                                alt={item.menu_name}
                            />

                            <p>{item.menu_name}</p>

                        </div>
                    );

                })}

            </div>

            <hr />

        </div>
    );
};

export default ExploreMenu;