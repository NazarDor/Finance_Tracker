"use client";

import React, { useState } from "react";
import "./page.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

export default function Calendar() {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <section>
      <div className="button-container">
        <button
          className={activeTab === "tab1" ? "active" : ""}
          onClick={() => handleTabChange("tab1")}
        >
          <FontAwesomeIcon icon={faCalendarDays} />
        </button>
        <button
          className={activeTab === "tab2" ? "active" : ""}
          onClick={() => handleTabChange("tab2")}
        >
          <FontAwesomeIcon icon={faClipboardList} />
        </button>
      </div>

      <div className="calendar-container">
        {activeTab === "tab1" && (
          <iframe
            className="calendar"
            src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FKiev&showPrint=0&showTz=0&showTitle=0&src=YWFhMGZjMmRiODIwNWEyNGUzOTY4YWEyYjJjYzMyM2FjZGZlMjgzYWJmNWE5YTQ0OTY5ZDM4MjUxZWQxNGJkMkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NGVlYjIzN2I5OWU1ZDE5ZmVjODdhZTVmZmY4NDRkNWIwM2VlMjQxZmI0OWY3YmY0OTc0ZDRhOTg4ZDZmMWMwYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=OTA1M2I1NGFhYjgyNjI1OTExZDIxOTEzNDEyMmM5MzJhNjU0NTQ5NDIwZmQ1NWJhYzNhN2Q3M2MwMTMyNDZkZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=a2VzdWEub3JnQGdtYWlsLmNvbQ&color=%23E4C441&color=%237CB342&color=%23F4511E&color=%23F6BF26"
          ></iframe>
        )}
        {activeTab === "tab2" && (
          <iframe
            className="calendar"
            src="https://calendar.google.com/calendar/embed?height=600&wkst=2&ctz=Europe%2FKiev&showPrint=0&showTz=0&showTitle=0&mode=AGENDA&src=YWFhMGZjMmRiODIwNWEyNGUzOTY4YWEyYjJjYzMyM2FjZGZlMjgzYWJmNWE5YTQ0OTY5ZDM4MjUxZWQxNGJkMkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=NGVlYjIzN2I5OWU1ZDE5ZmVjODdhZTVmZmY4NDRkNWIwM2VlMjQxZmI0OWY3YmY0OTc0ZDRhOTg4ZDZmMWMwYUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=OTA1M2I1NGFhYjgyNjI1OTExZDIxOTEzNDEyMmM5MzJhNjU0NTQ5NDIwZmQ1NWJhYzNhN2Q3M2MwMTMyNDZkZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t&src=a2VzdWEub3JnQGdtYWlsLmNvbQ&color=%23E4C441&color=%237CB342&color=%23F4511E&color=%23F6BF26"
          ></iframe>
        )}
      </div>
    </section>
  );
}
