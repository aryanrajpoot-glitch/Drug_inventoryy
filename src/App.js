import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import "./App.css";

function App() {

  // LOGIN
  const [userType, setUserType] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // NAVIGATION
  const [activeSection, setActiveSection] =
    useState("Dashboard");

  // SEARCH
  const [search, setSearch] = useState("");

  // FORM
  const [category, setCategory] = useState("");
  const [drugName, setDrugName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  // CLOCK
  const [time, setTime] = useState(new Date());

  // NOTIFICATIONS
  const [notifications, setNotifications] =
    useState([]);

  // HOSPITALS
  const hospitals = [
    "City Hospital",
    "Apollo Hospital",
    "Medanta",
    "AIIMS",
    "Fortis",
  ];

  // INVENTORY FROM DATABASE
  const [inventory, setInventory] = useState([]);

  // FETCH INVENTORY
  const fetchInventory = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/inventory"
      );

      setInventory(response.data);

    } catch (error) {

      console.log(
        "Error fetching inventory",
        error
      );
    }
  };

  // CLOCK + DATABASE FETCH
  useEffect(() => {

    fetchInventory();

    const timer = setInterval(() => {

      setTime(new Date());

    }, 1000);

    return () => clearInterval(timer);

  }, []);

  // SHIPMENTS
  const [shipmentStatus] = useState([
    {
      orderId: "ORD101",
      drug: "Paracetamol",
      status: "Dispatched",
      location: "Lucknow",
    },

    {
      orderId: "ORD102",
      drug: "Insulin",
      status: "In Transit",
      location: "Delhi",
    },

    {
      orderId: "ORD103",
      drug: "Amoxicillin",
      status: "Delivered",
      location: "Mumbai",
    },
  ]);

  // ANALYTICS
  const analyticsData = [
    {
      medicine: "Paracetamol",
      consumption: 6800,
    },

    {
      medicine: "Metformin",
      consumption: 5200,
    },

    {
      medicine: "Amoxicillin",
      consumption: 4300,
    },

    {
      medicine: "Insulin",
      consumption: 3900,
    },

    {
      medicine: "Ibuprofen",
      consumption: 3200,
    },
  ];

  // AI PREDICTION
  const aiPredictionData = [
    {
      medicine: "Paracetamol",
      predictedDemand: 8500,
    },

    {
      medicine: "Insulin",
      predictedDemand: 7200,
    },

    {
      medicine: "Amoxicillin",
      predictedDemand: 6700,
    },

    {
      medicine: "Metformin",
      predictedDemand: 6100,
    },

    {
      medicine: "Azithromycin",
      predictedDemand: 5400,
    },
  ];

  // PIE DATA
  const pieData = [
    { name: "Available", value: 80 },
    { name: "Low Stock", value: 20 },
  ];

  // VENDORS
  const vendors = [
    {
      name: "Sun Pharma",
      supply: "Paracetamol",
      status: "Active",
    },

    {
      name: "Cipla",
      supply: "Insulin",
      status: "Active",
    },

    {
      name: "Dr Reddy",
      supply: "Antibiotics",
      status: "Pending",
    },
  ];

  // ALERTS
  const alerts = [
    "⚠️ Insulin stock below threshold",
    "⚠️ High demand predicted for Paracetamol",
    "⚠️ Shipment delay for Amoxicillin",
  ];

  // LOGIN
  const handleLogin = (type) => {

    setUserType(type);
    setLoggedIn(true);

    setNotifications((prev) => [
      ...prev,
      `✅ ${type} logged in successfully`,
    ]);
  };

  // LOGOUT
  const handleLogout = () => {

    setLoggedIn(false);
    setUserType("");
    setMessage("");
  };

  // REQUEST DRUG
  const handleRequest = async () => {

    const qty = parseInt(quantity);

    if (!category || !drugName || !qty) {

      setMessage(
        "❌ Please enter complete details"
      );

      return;
    }

    try {

      const response = await axios.post(
        "http://localhost:5000/request-drug",
        {
          category,
          drug_name: drugName,
          quantity: qty,
        }
      );

      setMessage(response.data.message);

      setNotifications((prev) => [
        ...prev,
        `🚚 ${drugName} dispatched successfully`,
      ]);

      fetchInventory();

      setDrugName("");
      setQuantity("");

    } catch (error) {

      setMessage(
        "❌ Stock unavailable or server error"
      );

      setNotifications((prev) => [
        ...prev,
        `⚠️ Low stock alert for ${drugName}`,
      ]);
    }
  };

  // TOTAL STOCK
  const totalStock = inventory.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // LOW STOCK
  const lowStock = inventory.filter(
    (item) => item.quantity < 40
  ).length;

  // UNIQUE CATEGORIES
  const totalCategories = [
    ...new Set(
      inventory.map(
        (item) => item.category
      )
    ),
  ];

  // LOGIN PAGE
  if (!loggedIn) {

    return (

      <div className="login-container">

        <div className="login-box">

          <h1>💊 Drug Inventory System</h1>

          <h2>Select Login Type</h2>

          <button
            onClick={() =>
              handleLogin("Admin")
            }
          >
            Admin Login
          </button>

          <button
            onClick={() =>
              handleLogin("Hospital")
            }
          >
            Hospital Login
          </button>

          <button
            onClick={() =>
              handleLogin("Supplier")
            }
          >
            Supplier Login
          </button>

          <button
            onClick={() =>
              handleLogin("Warehouse")
            }
          >
            Warehouse Login
          </button>

        </div>

      </div>
    );
  }

  return (

    <div className="app-layout">

      {/* SIDEBAR */}

      <div className="sidebar">

        <h2 className="logo">
          💊 DISTSS
        </h2>

        <div className="menu">

          <button
            className={
              activeSection === "Dashboard"
                ? "active"
                : ""
            }

            onClick={() =>
              setActiveSection("Dashboard")
            }
          >
            📊 Dashboard
          </button>

          <button
            className={
              activeSection === "Inventory"
                ? "active"
                : ""
            }

            onClick={() =>
              setActiveSection("Inventory")
            }
          >
            📦 Inventory
          </button>

          <button
            className={
              activeSection === "Vendors"
                ? "active"
                : ""
            }

            onClick={() =>
              setActiveSection("Vendors")
            }
          >
            🏭 Vendors
          </button>

          <button
            className={
              activeSection === "Alerts"
                ? "active"
                : ""
            }

            onClick={() =>
              setActiveSection("Alerts")
            }
          >
            🚨 Alerts
          </button>

          <button
            className={
              activeSection === "Consumption"
                ? "active"
                : ""
            }

            onClick={() =>
              setActiveSection("Consumption")
            }
          >
            📈 Consumption
          </button>

        </div>

      </div>

      {/* MAIN */}

      <div className="dashboard">

        {/* NAVBAR */}

        <div className="navbar">

          <div className="navbar-left">

            <h2>
              💊 Drug Inventory Dashboard
            </h2>

            <p className="live">
              🟢 Live :
              {time.toLocaleTimeString()}
            </p>

          </div>

          <div className="navbar-right">

            <span className="role">
              {userType}
            </span>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>

        </div>

        {/* DASHBOARD */}

        {activeSection === "Dashboard" && (

          <>

            <div className="cards">

              <div className="card blue-card">
                <h3>Total Categories</h3>
                <p>{totalCategories.length}</p>
              </div>

              <div className="card green-card">
                <h3>Total Stock</h3>
                <p>{totalStock}</p>
              </div>

              <div className="card red-card">
                <h3>Low Stock Alerts</h3>
                <p>{lowStock}</p>
              </div>

              <div className="card purple-card">
                <h3>Hospitals</h3>
                <p>{hospitals.length}</p>
              </div>

            </div>

            {/* ALERTS */}

            <div className="alert-box">

              <h2>
                🚨 Critical Stock Alerts
              </h2>

              {alerts.map(
                (alert, index) => (

                  <p key={index}>
                    {alert}
                  </p>
                )
              )}

            </div>

            {/* ANALYTICS */}

            <div className="analytics-section">

              <div className="chart-box">

                <h2>
                  📊 Most Consumed Medicines
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <BarChart
                    data={analyticsData}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="medicine"
                    />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Bar
                      dataKey="consumption"
                      fill="#3498db"
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

              <div className="chart-box ai-chart">

                <h2>
                  🤖 AI Demand Prediction
                </h2>

                <ResponsiveContainer
                  width="100%"
                  height={300}
                >

                  <LineChart
                    data={aiPredictionData}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="medicine"
                    />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="predictedDemand"
                      stroke="#e74c3c"
                      strokeWidth={3}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            </div>

            {/* PIE */}

            <div className="chart-box">

              <h2>
                📈 Stock Distribution
              </h2>

              <ResponsiveContainer
                width="100%"
                height={300}
              >

                <PieChart>

                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >

                    <Cell fill="#2ecc71" />

                    <Cell fill="#e74c3c" />

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </>
        )}

        {/* INVENTORY */}

        {activeSection === "Inventory" && (

          <div className="inventory-box">

            <h2>
              📦 Inventory Status
            </h2>

            <input
              type="text"
              placeholder="Search Drug..."
              className="search-bar"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <table>

              <thead>

                <tr>
                  <th>Category</th>
                  <th>Drug</th>
                  <th>Quantity</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {inventory

                  .filter((item) =>
                    item.drug_name
                      .toLowerCase()
                      .includes(
                        search.toLowerCase()
                      )
                  )

                  .map((item) => (

                    <tr key={item.id}>

                      <td>{item.category}</td>

                      <td>{item.drug_name}</td>

                      <td>{item.quantity}</td>

                      <td>

                        {item.quantity < 40 ? (

                          <span className="low">
                            Low Stock
                          </span>

                        ) : (

                          <span className="good">
                            Available
                          </span>
                        )}

                      </td>

                    </tr>
                  ))}

              </tbody>

            </table>

          </div>
        )}

        {/* VENDORS */}

        {activeSection === "Vendors" && (

          <div className="shipment-box">

            <h2>
              🏭 Vendor Management
            </h2>

            <table>

              <thead>

                <tr>
                  <th>Vendor</th>
                  <th>Supply</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {vendors.map(
                  (vendor, index) => (

                    <tr key={index}>

                      <td>
                        {vendor.name}
                      </td>

                      <td>
                        {vendor.supply}
                      </td>

                      <td>
                        {vendor.status}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

        {/* ALERTS */}

        {activeSection === "Alerts" && (

          <div className="notification-box">

            <h2>
              🔔 Notifications & Alerts
            </h2>

            {notifications.length === 0 ? (

              <p>No notifications yet.</p>

            ) : (

              notifications.map(
                (note, index) => (

                  <div
                    key={index}
                    className="notification"
                  >
                    {note}
                  </div>
                )
              )
            )}

          </div>
        )}

        {/* CONSUMPTION */}

        {activeSection === "Consumption" && (

          <div className="shipment-box">

            <h2>
              🏥 Multi Hospital Management
            </h2>

            <table>

              <thead>

                <tr>
                  <th>Hospital</th>
                  <th>Status</th>
                </tr>

              </thead>

              <tbody>

                {hospitals.map(
                  (hospital, index) => (

                    <tr key={index}>

                      <td>
                        {hospital}
                      </td>

                      <td>
                        Connected
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>
        )}

        {/* REQUEST */}

        {userType === "Hospital" && (

          <div className="request-box">

            <h2>
              💊 Request Drugs
            </h2>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >

              <option value="">
                Select Category
              </option>

              {totalCategories.map((cat) => (

                <option
                  key={cat}
                  value={cat}
                >
                  {cat}
                </option>
              ))}

            </select>

            <input
              type="text"
              placeholder="Drug Name"
              value={drugName}
              onChange={(e) =>
                setDrugName(
                  e.target.value
                )
              }
            />

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
            />

            <button
              onClick={handleRequest}
            >
              Request Drug
            </button>

          </div>
        )}

        {/* SHIPMENT */}

        <div className="shipment-box">

          <h2>
            🚚 Shipment Tracking
          </h2>

          <table>

            <thead>

              <tr>
                <th>Order ID</th>
                <th>Drug</th>
                <th>Status</th>
                <th>Location</th>
              </tr>

            </thead>

            <tbody>

              {shipmentStatus.map(
                (shipment) => (

                  <tr
                    key={shipment.orderId}
                  >

                    <td>
                      {
                        shipment.orderId
                      }
                    </td>

                    <td>
                      {shipment.drug}
                    </td>

                    <td>
                      {
                        shipment.status
                      }
                    </td>

                    <td>
                      {
                        shipment.location
                      }
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

        </div>

        {/* MESSAGE */}

        {message && (

          <h2 className="message">
            {message}
          </h2>
        )}

      </div>

    </div>
  );
}

export default App;