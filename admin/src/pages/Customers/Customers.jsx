import React, { useEffect, useState } from "react";
import "./Customers.css";

const API_URL = "https://tomato-backend-dgur.onrender.com";

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("adminToken");

            if (!token) {
                setError(
                    "Admin login session expired."
                );
                return;
            }

            const response = await fetch(
                `${API_URL}/api/user/all`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (data.success) {
                setCustomers(
                    data.users ||
                    data.data ||
                    data.customers ||
                    []
                );
            } else {
                setError(
                    data.message ||
                    "Failed to load customers."
                );
            }
        } catch (error) {
            console.error(
                "Customers error:",
                error
            );

            setError(
                "Unable to connect to backend."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <div className="customers-page">

            <div className="customers-page-header">

                <div>
                    <h1>Customers</h1>
                    <p>
                        View registered customers
                    </p>
                </div>

                <button
                    className="refresh-btn"
                    onClick={fetchCustomers}
                >
                    Refresh
                </button>

            </div>

            {loading && (
                <div className="customers-message">
                    Loading customers...
                </div>
            )}

            {!loading && error && (
                <div className="customers-message error">
                    {error}
                </div>
            )}

            {!loading &&
                !error &&
                customers.length === 0 && (
                    <div className="customers-message">
                        No customers found.
                    </div>
                )}

            {!loading &&
                !error &&
                customers.length > 0 && (

                    <div className="customers-table-container">

                        <table className="customers-table">

                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>

                            <tbody>

                                {customers.map(
                                    (
                                        customer,
                                        index
                                    ) => (

                                        <tr
                                            key={
                                                customer._id ||
                                                index
                                            }
                                        >

                                            <td>
                                                {index + 1}
                                            </td>

                                            <td>
                                                <strong>
                                                    {customer.name ||
                                                        customer.username ||
                                                        "Customer"}
                                                </strong>
                                            </td>

                                            <td>
                                                {customer.email ||
                                                    "N/A"}
                                            </td>

                                            <td>
                                                {customer.phone ||
                                                    customer.mobile ||
                                                    "N/A"}
                                            </td>

                                            <td>
                                                {customer.createdAt
                                                    ? new Date(
                                                        customer.createdAt
                                                    ).toLocaleDateString()
                                                    : "N/A"}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

        </div>
    );
};

export default Customers;