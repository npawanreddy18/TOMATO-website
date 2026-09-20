import React, { useEffect, useState } from "react";
import "./List.css";

const API_URL = "http://localhost:4000";

// =====================================================
// IMAGE URL HELPER
// =====================================================

const getImageUrl = (image) => {
    if (!image) {
        return "";
    }

    // Already a complete URL
    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    // Already starts with /images/
    if (image.startsWith("/images/")) {
        return `${API_URL}${image}`;
    }

    // Starts with images/
    if (image.startsWith("images/")) {
        return `${API_URL}/${image}`;
    }

    // Only filename, for example food_1.png
    return `${API_URL}/images/${image}`;
};

function List() {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingFood, setEditingFood] = useState(null);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [available, setAvailable] = useState(true);
    const [image, setImage] = useState(null);

    const [saving, setSaving] = useState(false);

    // =====================================================
    // GET FOOD LIST
    // =====================================================

    const fetchFoods = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/food/list`
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Failed to fetch foods"
                );
            }

            setFoods(data.foods || []);
        } catch (err) {
            console.error("Fetch foods error:", err);

            setError(
                err.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // LOAD FOODS
    // =====================================================

    useEffect(() => {
        fetchFoods();
    }, []);

    // =====================================================
    // OPEN EDIT
    // =====================================================

    const openEdit = (food) => {
        setEditingFood(food);

        setName(food.name || "");
        setDescription(food.description || "");

        setPrice(
            food.price !== undefined &&
                food.price !== null
                ? food.price
                : ""
        );

        setCategory(food.category || "");
        setAvailable(food.available !== false);
        setImage(null);
    };

    // =====================================================
    // CLOSE EDIT
    // =====================================================

    const closeEdit = () => {
        setEditingFood(null);

        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setAvailable(true);
        setImage(null);
    };

    // =====================================================
    // UPDATE FOOD
    // =====================================================

    const updateFood = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Please enter food name");
            return;
        }

        if (!description.trim()) {
            alert("Please enter description");
            return;
        }

        if (
            price === "" ||
            price === null ||
            price === undefined ||
            Number(price) < 0
        ) {
            alert("Please enter a valid price");
            return;
        }

        if (!category) {
            alert("Please select a category");
            return;
        }

        if (!editingFood || !editingFood._id) {
            alert("Food ID is missing");
            return;
        }

        try {
            setSaving(true);

            const token =
                localStorage.getItem("adminToken");

            if (!token) {
                alert(
                    "Admin login required. Please login again."
                );
                return;
            }

            let response;

            // =================================================
            // NEW IMAGE SELECTED
            // =================================================

            if (image) {
                const formData = new FormData();

                formData.append(
                    "name",
                    name.trim()
                );

                formData.append(
                    "description",
                    description.trim()
                );

                formData.append(
                    "price",
                    String(Number(price))
                );

                formData.append(
                    "category",
                    category
                );

                formData.append(
                    "available",
                    String(available)
                );

                formData.append(
                    "image",
                    image
                );

                response = await fetch(
                    `${API_URL}/api/food/update/${editingFood._id}`,
                    {
                        method: "PUT",

                        headers: {
                            Authorization: `Bearer ${token}`,
                        },

                        body: formData,
                    }
                );
            }

            // =================================================
            // NO NEW IMAGE
            // =================================================

            else {
                response = await fetch(
                    `${API_URL}/api/food/update/${editingFood._id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body: JSON.stringify({
                            name: name.trim(),

                            description:
                                description.trim(),

                            price: Number(price),

                            category: category,

                            available: available,
                        }),
                    }
                );
            }

            const data =
                await response.json();

            console.log(
                "Update food response:",
                data
            );

            if (
                !response.ok ||
                !data.success
            ) {
                alert(
                    data.message ||
                        `Unable to update food. Server status: ${response.status}`
                );

                return;
            }

            alert(
                "Food updated successfully"
            );

            closeEdit();

            await fetchFoods();

        } catch (error) {
            console.error(
                "Update food error:",
                error
            );

            alert(
                "Unable to update food. Please check the backend."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // CHANGE AVAILABILITY
    // =====================================================

    const changeAvailability = async (
        id,
        currentAvailability
    ) => {
        try {
            const token =
                localStorage.getItem(
                    "adminToken"
                );

            if (!token) {
                alert(
                    "Admin login required. Please login again."
                );
                return;
            }

            const response = await fetch(
                `${API_URL}/api/food/availability/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        available:
                            !currentAvailability,
                    }),
                }
            );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {
                alert(
                    data.message ||
                        "Failed to change availability"
                );

                return;
            }

            setFoods(
                (previousFoods) =>
                    previousFoods.map(
                        (food) =>
                            food._id === id
                                ? {
                                      ...food,
                                      available:
                                          !currentAvailability,
                                  }
                                : food
                    )
            );

        } catch (error) {
            console.error(
                "Availability error:",
                error
            );

            alert(
                "Unable to update availability"
            );
        }
    };

    // =====================================================
    // DELETE FOOD
    // =====================================================

    const deleteFood = async (
        id,
        foodName
    ) => {
        const confirmDelete =
            window.confirm(
                `Are you sure you want to delete "${foodName}"?`
            );

        if (!confirmDelete) {
            return;
        }

        try {
            const token =
                localStorage.getItem(
                    "adminToken"
                );

            if (!token) {
                alert(
                    "Admin login required. Please login again."
                );
                return;
            }

            const response = await fetch(
                `${API_URL}/api/food/delete/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {
                alert(
                    data.message ||
                        "Failed to delete food"
                );

                return;
            }

            setFoods(
                (previousFoods) =>
                    previousFoods.filter(
                        (food) =>
                            food._id !== id
                    )
            );

            alert(
                "Food deleted successfully"
            );

        } catch (error) {
            console.error(
                "Delete food error:",
                error
            );

            alert(
                "Unable to delete food"
            );
        }
    };

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="list-page">

            {/* HEADER */}

            <div className="list-header">

                <div>
                    <h1>Food List</h1>

                    <p>
                        Manage all food items
                        in your restaurant
                    </p>
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchFoods}
                >
                    🔄 Refresh
                </button>

            </div>

            {/* FOOD COUNT */}

            {!loading && !error && (
                <div className="food-count">

                    <strong>
                        {foods.length}
                    </strong>

                    <span>
                        Food Items
                    </span>

                </div>
            )}

            {/* LOADING */}

            {loading && (
                <div className="list-message">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading food items...
                    </p>

                </div>
            )}

            {/* ERROR */}

            {!loading && error && (
                <div className="list-message error-message">

                    <div>⚠️</div>

                    <h3>
                        Unable to load food items
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchFoods}
                    >
                        Try Again
                    </button>

                </div>
            )}

            {/* FOOD TABLE */}

            {!loading &&
                !error &&
                foods.length > 0 && (

                    <div className="food-table-container">

                        <table className="food-table">

                            <thead>

                                <tr>

                                    <th>
                                        Image
                                    </th>

                                    <th>
                                        Food Name
                                    </th>

                                    <th>
                                        Category
                                    </th>

                                    <th>
                                        Price
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {foods.map(
                                    (food) => (

                                        <tr
                                            key={
                                                food._id
                                            }
                                        >

                                            {/* IMAGE */}

                                            <td>

                                                <img
                                                    src={getImageUrl(
                                                        food.image
                                                    )}
                                                    alt={
                                                        food.name
                                                    }
                                                    className="food-list-image"

                                                    onError={(
                                                        e
                                                    ) => {
                                                        console.error(
                                                            "Image failed:",
                                                            food.image
                                                        );

                                                        e.currentTarget.style.display =
                                                            "none";
                                                    }}
                                                />

                                            </td>

                                            {/* NAME */}

                                            <td>

                                                <div className="food-name">
                                                    {
                                                        food.name
                                                    }
                                                </div>

                                                <div className="food-description">
                                                    {
                                                        food.description
                                                    }
                                                </div>

                                            </td>

                                            {/* CATEGORY */}

                                            <td>

                                                <span className="category-badge">
                                                    {
                                                        food.category
                                                    }
                                                </span>

                                            </td>

                                            {/* PRICE */}

                                            <td>

                                                <strong className="food-price">
                                                    ₹
                                                    {Number(
                                                        food.price
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </strong>

                                            </td>

                                            {/* STATUS */}

                                            <td>

                                                <button
                                                    className={
                                                        food.available
                                                            ? "status-button available"
                                                            : "status-button unavailable"
                                                    }

                                                    onClick={() =>
                                                        changeAvailability(
                                                            food._id,
                                                            food.available
                                                        )
                                                    }
                                                >
                                                    ●{" "}
                                                    {food.available
                                                        ? "Available"
                                                        : "Unavailable"}
                                                </button>

                                            </td>

                                            {/* ACTIONS */}

                                            <td>

                                                <div className="food-actions">

                                                    <button
                                                        className="edit-button"

                                                        onClick={() =>
                                                            openEdit(
                                                                food
                                                            )
                                                        }

                                                        title="Edit food"
                                                    >
                                                        ✏️
                                                    </button>

                                                    <button
                                                        className="delete-button"

                                                        onClick={() =>
                                                            deleteFood(
                                                                food._id,
                                                                food.name
                                                            )
                                                        }

                                                        title="Delete food"
                                                    >
                                                        🗑️
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            {/* EMPTY */}

            {!loading &&
                !error &&
                foods.length === 0 && (

                    <div className="list-message">

                        <div className="empty-icon">
                            🍔
                        </div>

                        <h3>
                            No Food Items
                        </h3>

                        <p>
                            You haven't added any
                            food items yet.
                        </p>

                    </div>
                )}

            {/* EDIT MODAL */}

            {editingFood && (

                <div className="edit-overlay">

                    <div className="edit-modal">

                        {/* MODAL HEADER */}

                        <div className="edit-modal-header">

                            <div>

                                <h2>
                                    Edit Food
                                </h2>

                                <p>
                                    Update food
                                    information
                                </p>

                            </div>

                            <button
                                className="close-edit"
                                onClick={closeEdit}
                                disabled={saving}
                            >
                                ×
                            </button>

                        </div>

                        {/* EDIT FORM */}

                        <form
                            onSubmit={
                                updateFood
                            }
                        >

                            {/* IMAGE */}

                            <div className="edit-image-section">

                                <img
                                    src={
                                        image
                                            ? URL.createObjectURL(
                                                  image
                                              )
                                            : getImageUrl(
                                                  editingFood.image
                                              )
                                    }
                                    alt={name}
                                    className="edit-food-image"

                                    onError={(
                                        e
                                    ) => {
                                        e.currentTarget.style.display =
                                            "none";
                                    }}
                                />

                                <label className="change-image-button">

                                    📷 Change Image

                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/webp"

                                        onChange={(
                                            e
                                        ) =>
                                            setImage(
                                                e
                                                    .target
                                                    .files[0] ||
                                                    null
                                            )
                                        }
                                    />

                                </label>

                            </div>

                            {/* NAME */}

                            <div className="edit-field">

                                <label>
                                    Food Name
                                </label>

                                <input
                                    type="text"
                                    value={name}

                                    onChange={(
                                        e
                                    ) =>
                                        setName(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                />

                            </div>

                            {/* DESCRIPTION */}

                            <div className="edit-field">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={
                                        description
                                    }

                                    onChange={(
                                        e
                                    ) =>
                                        setDescription(
                                            e
                                                .target
                                                .value
                                        )
                                    }
                                ></textarea>

                            </div>

                            {/* PRICE + CATEGORY */}

                            <div className="edit-two-columns">

                                <div className="edit-field">

                                    <label>
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"

                                        value={
                                            price
                                        }

                                        onChange={(
                                            e
                                        ) =>
                                            setPrice(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                    />

                                </div>

                                <div className="edit-field">

                                    <label>
                                        Category
                                    </label>

                                    <select
                                        value={
                                            category
                                        }

                                        onChange={(
                                            e
                                        ) =>
                                            setCategory(
                                                e
                                                    .target
                                                    .value
                                            )
                                        }
                                    >

                                        <option value="">
                                            Select Category
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

                            {/* AVAILABILITY */}

                            <div className="edit-availability">

                                <div>

                                    <h3>
                                        Food Availability
                                    </h3>

                                    <p>
                                        Show this food
                                        on the customer
                                        website
                                    </p>

                                </div>

                                <label className="edit-switch">

                                    <input
                                        type="checkbox"

                                        checked={
                                            available
                                        }

                                        onChange={(
                                            e
                                        ) =>
                                            setAvailable(
                                                e
                                                    .target
                                                    .checked
                                            )
                                        }
                                    />

                                    <span></span>

                                </label>

                            </div>

                            {/* BUTTONS */}

                            <div className="edit-actions">

                                <button
                                    type="button"
                                    className="edit-cancel"

                                    onClick={
                                        closeEdit
                                    }

                                    disabled={
                                        saving
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="edit-save"

                                    disabled={
                                        saving
                                    }
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default List;