import { useEffect, useState } from "react";
import "./Customers.css";

const API_URL = "http://localhost:4000";

function Customers() {

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================
    // FETCH CUSTOMERS
    // =========================================

    const fetchCustomers = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem(
                    "adminToken"
                );


            const response =
                await fetch(
                    `${API_URL}/api/user/all`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    "Failed to load customers"
                );

            }


            setCustomers(
                data.customers || []
            );

        } catch (error) {

            console.error(
                "Customers error:",
                error
            );

            setError(
                error.message ||
                "Unable to load customers"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOAD CUSTOMERS
    // =========================================

    useEffect(() => {

        fetchCustomers();

    }, []);


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="customers-page">

                <h2>Customers</h2>

                <div className="customers-message">
                    Loading customers...
                </div>

            </div>

        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="customers-page">

                <h2>Customers</h2>

                <div className="customers-message customers-error">

                    <strong>
                        Unable to load customers
                    </strong>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={
                            fetchCustomers
                        }
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="customers-page">

            {/* =================================
                HEADER
            ================================= */}

            <div className="customers-title">

                <div>

                    <h2>
                        Customers
                    </h2>

                    <p>
                        Manage your registered customers
                    </p>

                </div>


                <div className="customer-count">

                    <span>
                        Total Customers
                    </span>

                    <strong>
                        {customers.length}
                    </strong>

                </div>

            </div>


            {/* =================================
                CUSTOMERS BOX
            ================================= */}

            <div className="customers-box">


                {/* TABLE HEADER */}

                <div className="customers-header">

                    <span>
                        #
                    </span>

                    <span>
                        Name
                    </span>

                    <span>
                        Email
                    </span>

                    <span>
                        Orders
                    </span>

                    <span>
                        Status
                    </span>

                </div>


                {/* =================================
                    NO CUSTOMERS
                ================================= */}

                {customers.length === 0 ? (

                    <div className="no-customers">

                        <div>
                            👥
                        </div>

                        <h3>
                            No customers found
                        </h3>

                        <p>
                            Registered customers
                            will appear here.
                        </p>

                    </div>

                ) : (

                    customers.map(
                        (customer, index) => (

                            <div
                                className="customer-row"
                                key={
                                    customer._id
                                }
                            >

                                {/* NUMBER */}

                                <span>
                                    {index + 1}
                                </span>


                                {/* NAME */}

                                <span className="customer-name">

                                    {customer.name ||
                                        "Unknown"}

                                </span>


                                {/* EMAIL */}

                                <span className="customer-email">

                                    {customer.email}

                                </span>


                                {/* ORDERS */}

                                <span>

                                    {customer.orders}

                                </span>


                                {/* STATUS */}

                                <span>

                                    <span className="customer-active">
                                        Active
                                    </span>

                                </span>

                            </div>

                        )
                    )

                )}

            </div>

        </div>

    );

}

export default Customers;