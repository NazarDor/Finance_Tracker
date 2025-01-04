"use client";

import "./Leaders.css";
import { useState } from "react";
import { Chart } from "react-google-charts";
import { leadersData, diaconsData } from "../data";

export default function Leaders() {
  const leaderNames = Object.keys(leadersData);
  const diaconNames = Object.keys(diaconsData);
  const [selectedLeader, setSelectedLeader] = useState(leaderNames[0]);
  const [selectedDiacon, setSelectedDiacon] = useState(diaconNames[0]);

  const options = {
    allowHtml: true,
  };

  return (
    <>
      <section>
        <div className="leaders">
          <div className="tabs">
            {leaderNames.map((leader) => (
              <button
                key={leader}
                className={`tab-button ${
                  selectedLeader === leader ? "active" : ""
                }`}
                onClick={() => setSelectedLeader(leader)}
              >
                {leader}
              </button>
            ))}
          </div>
          <Chart
            chartType="OrgChart"
            width="100%"
            height="100%"
            data={[["Name", "Manager"], ...leadersData[selectedLeader]]}
            options={options}
          />
        </div>

        <div className="diacons">
          <div className="tabs">
            {diaconNames.map((diacon) => (
              <button
                key={diacon}
                className={`tab-button ${
                  selectedDiacon === diacon ? "active" : ""
                }`}
                onClick={() => setSelectedDiacon(diacon)}
              >
                {diacon}
              </button>
            ))}
          </div>
          <Chart
            chartType="OrgChart"
            width="100%"
            height="100%"
            data={[["Name", "Manager"], ...diaconsData[selectedDiacon]]}
            options={options}
          />
        </div>
      </section>
    </>
  );
}
