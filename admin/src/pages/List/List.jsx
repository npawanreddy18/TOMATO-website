import React, { useEffect, useState } from "react";
import "./List.css";

const API_URL = "https://tomato-backend-dgur.onrender.com";

const List = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getImageUrl = (image) => {
        if (!image) return "";

        if (image.startsWith("https://")) {
            return image;
        }

        if (image.startsWith("http://")) {
            return image.replace(
                "http://localhost:4000",
                API_URL
            );
        }

        if (image.startsWith("/images/")) {
            return `${API_URL}${image}`;
        }

        if (image.startsWith("images/")) {
            return `${API_URL}/${image}`;
        }

        return `${API_URL}/images/${image}`;
    };

    const fetchFoods = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/food/list`
            );

            const data = await response.json();

            if (data.success) {
                setFoods(data.data || data.foods || []);
            } else {
                setError(
                    data.message || "Failed to load food list."
                );
            }
        } catch (error) {
            console.error("Food list error:", error);

            setError(
                "Unable to connect to backend."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    return (
        <div className="list-page">

            <div className="list-page-header">
                <div>
                    <h1>Food List</h1>
                    <p>View all food items in your menu</p>
                </div>

                <button
                    className="refresh-btn"
                    onClick={fetchFoods}
                >
                    Refresh
                </button>
            </div>

            {loading && (
                <div className="list-message">
                    Loading food items...
                </div>
            )}

            {!loading && error && (
                <div className="list-message error">
                    {error}
                </div>
            )}

            {!loading &&
                !error &&
                foods.length === 0 && (
                    <div className="list-message">
                        No food items found.
                    </div>
                )}

            {!loading &&
                !error &&
                foods.length > 0 && (
                    <div className="food-table-container">

                        <table className="food-table">

                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {foods.map((food) => (
                                    <tr key={food._id}>

                                        <td>
                                            <img
                                                className="food-list-image"
                                                src={getImageUrl(
                                                    food.image
                                                )}
                                                alt={food.name}
                                                onError={(event) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        </td>

                                        <td>
                                            <strong>
                                                {food.name}
                                            </strong>
                                        </td>

                                        <td className="description-cell">
                                            {food.description}
                                        </td>

                                        <td>
                                            <span className="category-badge">
                                                {food.category}
                                            </span>
                                        </td>

                                        <td>
                                            ${Number(
                                                food.price || 0
                                            ).toFixed(2)}
                                        </td>

                                        <td>
                                            {food.available !== false ? (
                                                <span className="status available">
                                                    Available
                                                </span>
                                            ) : (
                                                <span className="status unavailable">
                                                    Unavailable
                                                </span>
                                            )}
                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

        </div>
    );
};

export default List;