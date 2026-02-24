import React from "react";
import { useWallet } from "../hooks";
import { formatAddress } from "../utils";
import "./NavBar.css";

const NavBar = () => {
  const { account, isConnected, connect, disconnect } = useWallet();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1 className="navbar-title">Land Registry</h1>
        </div>

        <ul className="navbar-menu">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/browse">Browse Lands</a>
          </li>
          {isConnected && (
            <>
              <li>
                <a href="/register">Register Land</a>
              </li>
              <li>
                <a href="/dashboard">Dashboard</a>
              </li>
            </>
          )}
        </ul>

        <div className="navbar-wallet">
          {isConnected ? (
            <div className="wallet-connected">
              <span className="wallet-address">{formatAddress(account)}</span>
              <button className="btn-disconnect" onClick={disconnect}>
                Disconnect
              </button>
            </div>
          ) : (
            <button className="btn-connect" onClick={connect}>
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
