import React, { useState } from "react";
import { useWallet, useLandRegistry, useTransaction } from "../hooks";
import { CONTRACT_CONFIG } from "../config/contracts";
import { validateLocation, validateArea, validatePropertyNumber } from "../utils";
import "./RegisterLand.css";

const RegisterLand = () => {
  const { isConnected, signer } = useWallet();
  const { contract: landRegistry } = useLandRegistry(signer, CONTRACT_CONFIG.mumbai.landRegistry);
  const { execute, txLoading, txError, isSuccess, reset } = useTransaction();

  const [formData, setFormData] = useState({
    location: "",
    coordinates: "",
    area: "",
    propertyNumber: "",
    documentHash: "",
    ownerName: "",
    contactInfo: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!validateLocation(formData.location)) {
      newErrors.location = "Location is required and must be less than 500 characters";
    }
    if (!formData.coordinates) {
      newErrors.coordinates = "Coordinates are required (format: lat,lng)";
    }
    if (!validateArea(formData.area)) {
      newErrors.area = "Area must be greater than 0";
    }
    if (!validatePropertyNumber(formData.propertyNumber)) {
      newErrors.propertyNumber = "Property number is required";
    }
    if (!formData.documentHash) {
      newErrors.documentHash = "IPFS document hash is required";
    }
    if (!formData.ownerName) {
      newErrors.ownerName = "Owner name is required";
    }
    if (!formData.contactInfo) {
      newErrors.contactInfo = "Contact information is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await execute(async () => {
        return await landRegistry.registerLand(
          formData.location,
          formData.coordinates,
          formData.area,
          formData.propertyNumber,
          formData.documentHash,
          formData.ownerName,
          formData.contactInfo
        );
      });

      if (isSuccess) {
        setFormData({
          location: "",
          coordinates: "",
          area: "",
          propertyNumber: "",
          documentHash: "",
          ownerName: "",
          contactInfo: "",
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  if (!isConnected) {
    return (
      <div className="register-land">
        <div className="container-message">
          <p>Please connect your wallet to register land</p>
        </div>
      </div>
    );
  }

  return (
    <div className="register-land">
      <div className="register-container">
        <h1>Register Land</h1>

        {isSuccess && (
          <div className="success-message">
            Land registered successfully! Refresh the page to see your land.
            <button className="btn-dismiss" onClick={reset}>
              Dismiss
            </button>
          </div>
        )}

        {txError && (
          <div className="error-message">
            {txError}
            <button className="btn-dismiss" onClick={reset}>
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Plot No. 123, Main Street"
              disabled={txLoading}
            />
            {errors.location && <span className="error-text">{errors.location}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="coordinates">Coordinates (lat, lng) *</label>
            <input
              type="text"
              id="coordinates"
              name="coordinates"
              value={formData.coordinates}
              onChange={handleChange}
              placeholder="e.g., 28.6139,77.2090"
              disabled={txLoading}
            />
            {errors.coordinates && <span className="error-text">{errors.coordinates}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="area">Area (in square meters) *</label>
            <input
              type="number"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="e.g., 5000"
              disabled={txLoading}
            />
            {errors.area && <span className="error-text">{errors.area}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="propertyNumber">Property Number *</label>
            <input
              type="text"
              id="propertyNumber"
              name="propertyNumber"
              value={formData.propertyNumber}
              onChange={handleChange}
              placeholder="e.g., DELHI-2024-001"
              disabled={txLoading}
            />
            {errors.propertyNumber && <span className="error-text">{errors.propertyNumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="documentHash">IPFS Document Hash *</label>
            <input
              type="text"
              id="documentHash"
              name="documentHash"
              value={formData.documentHash}
              onChange={handleChange}
              placeholder="e.g., QmXxxx..."
              disabled={txLoading}
            />
            {errors.documentHash && <span className="error-text">{errors.documentHash}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="ownerName">Owner Name *</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="Your name"
              disabled={txLoading}
            />
            {errors.ownerName && <span className="error-text">{errors.ownerName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="contactInfo">Contact Information *</label>
            <input
              type="text"
              id="contactInfo"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="Your contact information"
              disabled={txLoading}
            />
            {errors.contactInfo && <span className="error-text">{errors.contactInfo}</span>}
          </div>

          <button type="submit" className="btn-submit" disabled={txLoading}>
            {txLoading ? "Registering..." : "Register Land"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterLand;
