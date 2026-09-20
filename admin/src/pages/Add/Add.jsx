import React, { useState } from "react";
import "./Add.css";

const API_URL = "https://tomato-backend-dgur.onrender.com";

const Add = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [available, setAvailable] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !image
        ) {
            alert("Please fill all fields and select an image.");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("image", image);
            formData.append("available", available);

            const token = localStorage.getItem("adminToken");

            if (!token) {
                alert("Admin login session expired. Please login again.");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/food/add`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Food added successfully!");

                setName("");
                setDescription("");
                setPrice("");
                setCategory("");
                setImage(null);
                setAvailable(true);

                const imageInput =
                    document.getElementById("food-image");

                if (imageInput) {
                    imageInput.value = "";
                }
            } else {
                alert(data.message || "Failed to add food.");
            }
        } catch (error) {
            console.error("Add food error:", error);

            alert(
                "Unable to connect to backend. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-page">

            <div className="add-page-header">
                <h1>Add Food</h1>
                <p>Add a new food item to your menu</p>
            </div>

            <div className="add">

                <form onSubmit={handleSubmit}>

                    {/* FOOD NAME */}

                    <div className="form-group">
                        <label>Food Name</label>

                        <input
                            type="text"
                            placeholder="Enter food name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                        />
                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            placeholder="Enter food description"
                            value={description}
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                        ></textarea>
                    </div>


                    {/* PRICE AND CATEGORY */}

                    <div className="form-row">

                        <div className="form-group">
                            <label>Price ($)</label>

                            <input
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(event) =>
                                    setPrice(event.target.value)
                                }
                            />
                        </div>


                        <div className="form-group">
                            <label>Category</label>

                            <select
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value)
                                }
                            >
                                <option value="">
                                    Select category
                                </option>

                                <option value="Salad">
                                    Salad
                                </option>

                                <option value="Rolls">
                                    Rolls
                                </option>

                                <option value="Deserts">
                                    Deserts
                                </option>

                                <option value="Sandwich">
                                    Sandwich
                                </option>

                                <option value="Cake">
                                    Cake
                                </option>

                                <option value="Pure Veg">
                                    Pure Veg
                                </option>

                                <option value="Pasta">
                                    Pasta
                                </option>

                                <option value="Noodles">
                                    Noodles
                                </option>

                                <option value="Pizza">
                                    Pizza
                                </option>

                                <option value="Burger">
                                    Burger
                                </option>
                            </select>
                        </div>

                    </div>


                    {/* IMAGE FILE */}

                    <div className="form-group image-upload">

                        <label>Food Image</label>

                        <input
                            id="food-image"
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/webp"
                            onChange={(event) => {
                                const selectedFile =
                                    event.target.files[0];

                                setImage(selectedFile || null);
                            }}
                        />

                        {image && (
                            <p className="selected-image">
                                Selected image: {image.name}
                            </p>
                        )}

                    </div>


                    {/* AVAILABLE */}

                    <div className="available-row">

                        <label className="switch">

                            <input
                                type="checkbox"
                                checked={available}
                                onChange={(event) =>
                                    setAvailable(
                                        event.target.checked
                                    )
                                }
                            />

                            <span className="slider"></span>

                        </label>

                        <span>Food Available</span>

                    </div>


                    {/* ADD BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "ADDING FOOD..."
                            : "ADD FOOD"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default Add;