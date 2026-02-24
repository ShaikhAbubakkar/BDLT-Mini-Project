import React from "react";
import { convertToDate, convertAreaSquareMeters } from "../utils";
import "./LandCard.css";

const LandCard = ({ land, onViewDetails }) => {
  return (
    <div className="land-card">
      <div className="land-card-header">
        <h3 className="land-card-title">Property {land.landId}</h3>
        <span className="land-card-status">
          {land.isRegistered ? "Registered" : "Not Registered"}
        </span>
      </div>

      <div className="land-card-body">
        <p className="land-property">
          <strong>Property No:</strong> {land.propertyNumber}
        </p>
        <p className="land-location">
          <strong>Location:</strong> {land.location}
        </p>
        <p className="land-area">
          <strong>Area:</strong> {convertAreaSquareMeters(land.area)} sqm
        </p>
        <p className="land-coordinates">
          <strong>Coordinates:</strong> {land.coordinates}
        </p>
        <p className="land-date">
          <strong>Registered:</strong> {convertToDate(land.registeredAt)}
        </p>
      </div>

      <div className="land-card-footer">
        <button className="btn-view" onClick={() => onViewDetails(land.landId)}>
          View Details
        </button>
      </div>
    </div>
  );
};

export default LandCard;
