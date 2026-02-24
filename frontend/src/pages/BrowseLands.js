import React, { useState, useEffect } from "react";
import { useWallet, useLandRegistry } from "../hooks";
import { LandCard } from "../components";
import { CONTRACT_CONFIG } from "../config/contracts";
import "./BrowseLands.css";

const BrowseLands = () => {
  const { signer, isConnected } = useWallet();
  const { contract: landRegistry } = useLandRegistry(signer, CONTRACT_CONFIG.mumbai.landRegistry);
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    loadLands();
  }, [landRegistry, page]);

  const loadLands = async () => {
    if (!landRegistry) return;

    try {
      setLoading(true);
      setError(null);
      const allLands = await landRegistry.getAllLands(page * itemsPerPage, itemsPerPage);
      setLands(allLands);
    } catch (err) {
      setError("Failed to load lands");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (landId) => {
    window.location.href = `/land/${landId}`;
  };

  if (!isConnected) {
    return (
      <div className="browse-lands">
        <div className="container-empty">
          <p>Please connect your wallet to browse lands</p>
        </div>
      </div>
    );
  }

  return (
    <div className="browse-lands">
      <div className="browse-container">
        <h1>Browse Registered Lands</h1>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading">Loading lands...</div>
        ) : lands.length === 0 ? (
          <div className="no-results">No lands registered yet</div>
        ) : (
          <>
            <div className="lands-grid">
              {lands.map((land) => (
                <LandCard
                  key={land.landId}
                  land={land}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            <div className="pagination">
              <button
                className="btn-pagination"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>
              <span className="page-number">Page {page + 1}</span>
              <button
                className="btn-pagination"
                disabled={lands.length < itemsPerPage}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseLands;
