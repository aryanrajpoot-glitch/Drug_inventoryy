import React, { useState } from "react";

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
  // LOGIN STATES
  const [userType, setUserType] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // SEARCH STATE
  const [search, setSearch] = useState("");

  // CATEGORY
  const [category, setCategory] = useState("");

  // DRUG FORM
  const [drugName, setDrugName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");

  // INVENTORY
  const [inventory, setInventory] = useState({
    Antibiotics: {
      amoxicillin: 120,
      azithromycin: 80,
      ciprofloxacin: 65,
    },

    Painkillers: {
      paracetamol: 100,
      dolo: 50,
      ibuprofen: 70,
    },

    Diabetes: {
      insulin: 30,
      metformin: 60,
    },

    Vitamins: {
      vitaminC: 90,
      vitaminD: 40,
    },

    Cardiology: {
      aspirin: 55,
      atorvastatin: 45,
    },
  });

  // SHIPMENT DATA
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

  // ANALYTICS DATA
  const analyticsData = [
    { month: "Jan", consumption: 400 },
    { month: "Feb", consumption: 650 },
    { month: "Mar", consumption: 500 },
    { month: "Apr", consumption: 900 },
    { month: "May", consumption: 1200 },
  ];

  // AI PREDICTION
  const aiPredictionData = [
    { month: "Jun", demand: 1300 },
    { month: "Jul", demand: 1500 },
    { month: "Aug", demand: 1700 },
    { month: "Sep", demand: 2000 },
  ];

  // PIE CHART DATA
  const pieData = [
    { name: "Available", value: 80 },
    { name: "Low Stock", value: 20 },
  ];

  // LOGIN FUNCTION
  const handleLogin = (type) => {
    setUserType(type);
    setLoggedIn(true);
  };

  // LOGOUT
  const handleLogout = () => {
    setLoggedIn(false);
    setUserType("");
  };

  // REQUEST FUNCTION
  const handleRequest = () => {
    const qty = parseInt(quantity);
    const drug = drugName.toLowerCase();

    if (!category || !drug || !qty) {
      setMessage("Please enter complete details");
      return;
    }

    const categoryDrugs = inventory[category];

    if (categoryDrugs[drug] && categoryDrugs[drug] >= qty) {
      setInventory({
        ...inventory,

        [category]: {
          ...categoryDrugs,
          [drug]: categoryDrugs[drug] - qty,
        },
      });

      setMessage(`✅ ${qty} ${drug} dispatched successfully`);
    } else {
      setMessage(`❌ Stock unavailable for ${drug}`);
    }
  };

  // LOGIN PAGE
  if (!loggedIn) {
    return (
      <div className="login-container">

        <div className="login-box">

          <h1>💊 Drug Inventory System</h1>

          <h2>Select Login Type</h2>

          <button onClick={() => handleLogin("Admin")}>
            Admin Login
          </button>

          <button onClick={() => handleLogin("Hospital")}>
            Hospital Login
          </button>

          <button onClick={() => handleLogin("Supplier")}>
            Supplier Login
          </button>

          <button onClick={() => handleLogin("Warehouse")}>
            Warehouse Login
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">

      {/* NAVBAR */}

      <div className="navbar">

        <h2>💊 Drug Inventory Dashboard</h2>

        <div>
          <span className="role">
            Logged in as: {userType}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </div>

      {/* DASHBOARD CARDS */}

      <div className="cards">

        <div className="card total-drugs-card">
          <h3>Total Categories</h3>
          <p>{Object.keys(inventory).length}</p>
        </div>

        <div className="card total-stock-card">
          <h3>Total Stock</h3>

          <p>
            {
              Object.values(inventory)
                .flatMap((category) =>
                  Object.values(category)
                )
                .reduce((a, b) => a + b, 0)
            }
          </p>
        </div>

        <div className="card low-stock-card">
          <h3>Low Stock Alerts</h3>

          <p>
            {
              Object.values(inventory)
                .flatMap((category) =>
                  Object.values(category)
                )
                .filter((qty) => qty < 40).length
            }
          </p>
        </div>

        <div className="card">
          <h3>Monthly Orders</h3>
          <p>245</p>
        </div>

      </div>

      {/* REQUEST BOX */}

      {userType === "Hospital" && (

        <div className="request-box">

          <h2>Request Drugs</h2>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="">Select Category</option>

            {Object.keys(inventory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter Drug Name"
            value={drugName}
            onChange={(e) =>
              setDrugName(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
          />

          <button onClick={handleRequest}>
            Request Drug
          </button>

        </div>
      )}

      {/* SEARCH */}

      <div className="search-box">

        <input
          type="text"
          placeholder="Search Drug..."
          className="search-bar"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>

      {/* INVENTORY TABLE */}

      <div className="inventory-box">

        <h2>📦 Inventory Status</h2>

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

            {Object.keys(inventory).map(
              (categoryName) =>
                Object.keys(inventory[categoryName])

                  .filter((drug) =>
                    drug
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )

                  .map((drug) => (

                    <tr key={drug}>

                      <td>{categoryName}</td>

                      <td>{drug}</td>

                      <td>
                        {inventory[categoryName][drug]}
                      </td>

                      <td>
                        {inventory[categoryName][drug] <
                        40 ? (
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
                  ))
            )}

          </tbody>

        </table>

      </div>

      {/* ANALYTICS */}

      <div className="analytics-section">

        {/* BAR GRAPH */}

        <div className="chart-box">

          <h2>📊 Monthly Consumption</h2>

          <ResponsiveContainer width="100%" height={300}>

            <BarChart data={analyticsData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

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

        {/* AI GRAPH */}

        <div className="chart-box">

          <h2>🤖 AI Demand Prediction</h2>

          <ResponsiveContainer width="100%" height={300}>

            <LineChart data={aiPredictionData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="demand"
                stroke="#e74c3c"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* PIE CHART */}

      <div className="chart-box">

        <h2>📈 Stock Distribution</h2>

        <ResponsiveContainer width="100%" height={300}>

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

      {/* SHIPMENT TRACKING */}

      <div className="shipment-box">

        <h2>🚚 Shipment Tracking</h2>

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

            {shipmentStatus.map((shipment) => (

              <tr key={shipment.orderId}>

                <td>{shipment.orderId}</td>

                <td>{shipment.drug}</td>

                <td>{shipment.status}</td>

                <td>{shipment.location}</td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* MESSAGE */}

      <h2 className="message">{message}</h2>

    </div>
  );
}

export default App;