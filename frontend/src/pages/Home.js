import React from "react";
import { useWallet } from "../hooks";
import "./Home.css";

const Home = () => {
  const { isConnected, connect } = useWallet();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Blockchain-Based Land Registry</h1>
          <p>Transparent, immutable, and secure land ownership records on the blockchain</p>
          {!isConnected && (
            <button className="btn-hero-primary" onClick={connect}>
              Get Started
            </button>
          )}
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <div className="feature-card">
            <h3>Immutable Records</h3>
            <p>Land ownership records are permanently stored on the blockchain, preventing fraud and tampering.</p>
          </div>

          <div className="feature-card">
            <h3>Transparent Transfers</h3>
            <p>Track complete chain of title with every historical ownership change recorded and verified.</p>
          </div>

          <div className="feature-card">
            <h3>Multi-Party Approval</h3>
            <p>Secure transfers require approval from both parties, ensuring mutual agreement and protection.</p>
          </div>

          <div className="feature-card">
            <h3>Co-Ownership Support</h3>
            <p>Manage shared properties with multiple owners and configurable ownership percentages.</p>
          </div>

          <div className="feature-card">
            <h3>Document Verification</h3>
            <p>Store property documents on IPFS with cryptographic verification of authenticity.</p>
          </div>

          <div className="feature-card">
            <h3>Complete History</h3>
            <p>View entire transfer history and ownership lineage for complete transparency.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Register Your Land?</h2>
        <p>Start by connecting your wallet to explore the system</p>
        {!isConnected && (
          <button className="btn-cta" onClick={connect}>
            Connect Wallet Now
          </button>
        )}
      </section>
    </div>
  );
};

export default Home;
