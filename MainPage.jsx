import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MainPage = () => {
  const [performance, setPerformance] = useState({
    betterThanPeers: null,
    betterThanYourself: null,
  });
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/Performance");
        setPerformance({
          betterThanPeers: response.data.betterThanPeers,
          betterThanYourself: response.data.betterThanYourself,
        });
        setChartData({
          labels: response.data.chartLabels || ["Metric 1", "Metric 2"],
          datasets: [
            {
              label: "Performance Metrics",
              data: response.data.chartValues || [50, 75],
              backgroundColor: ["#808080", "#808080"],
              borderColor: ["#696969", "#696969"],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    fetchPerformanceData();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        margin: "0",
        padding: "0",
        overflow: "hidden", // Ensures no scrollbars
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "80px", // Fixed width for sidebar
          backgroundColor: "#F59E0B",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly", // Ensures even spacing between icons
          padding: "10px 0",
          height: "100%", // Ensures the sidebar spans the full height of the viewport
          boxSizing: "border-box",
        }}
      >
        {/* Sidebar Icons */}
        <img
          src="icon1.png"
          alt="Icon 1"
          style={{
            width: "40px",
            height: "40px",
          }}
        />
        <img
          src="icon2.png"
          alt="Icon 2"
          style={{
            width: "40px",
            height: "40px",
          }}
        />
        <img
          src="icon3.png"
          alt="Icon 3"
          style={{
            width: "40px",
            height: "40px",
          }}
        />
        <img
          src="icon4.png"
          alt="Icon 4"
          style={{
            width: "40px",
            height: "40px",
          }}
        />
      </aside>

      {/* Main Content */}
      <main
        style={{
          flex: 1, // Fills the remaining width dynamically
          backgroundColor: "#F59E0B",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <header
          style={{
            fontSize: "xx-large",
            backgroundColor: "#f0f0f0",
            padding: "10px",
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: "5px",
            color: "black",
          }}
        >
          Your Performance Over Time
        </header>

        <div
          style={{
            display: "flex",
            flex: 1, // Fills vertical space dynamically
            marginTop: "20px",
          }}
        >
          {/* Left Section: Better than Peers */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              padding: "20px",
              marginRight: "10px",
              borderRadius: "10px",
              textAlign: "center",
              color: "black",
            }}
          >
            <h3>Better than Peers</h3>
            <p
              style={{
                fontSize: "90px",
                fontWeight: "bold",
                marginTop: "auto",
                marginBottom: "auto",
              }}
            >
              {performance.betterThanPeers !== null
                ? `${performance.betterThanPeers}%`
                : "XX%"}
            </p>
          </div>

          {/* Right Section: Better than Yourself */}
          <div
            style={{
              flex: 1,
              backgroundColor: "#fff",
              padding: "20px",
              marginLeft: "10px",
              borderRadius: "10px",
              textAlign: "center",
              color: "black",
            }}
          >
            <h3>Better than Yourself</h3>
            <p
              style={{
                fontSize: "90px",
                fontWeight: "bold",
                marginTop: "auto",
                marginBottom: "auto",
              }}
            >
              {performance.betterThanYourself !== null
                ? `${performance.betterThanYourself}%`
                : "YY%"}
            </p>
          </div>
        </div>

        {/* Additional Chart Section */}
        {chartData && (
          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              color: "black",
            }}
          >
            <h3 style={{ textAlign: "center" }}>Performance Metrics Chart</h3>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Performance Comparison",
                  },
                },
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default MainPage;
