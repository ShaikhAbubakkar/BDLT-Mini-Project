const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandTransfer", function () {
  let landRegistry;
  let landTransfer;
  let owner1;
  let owner2;
  let owner3;

  beforeEach(async function () {
    [owner1, owner2, owner3] = await ethers.getSigners();
    
    // Deploy LandRegistry first
    const LandRegistry = await ethers.getContractFactory("LandRegistry");
    landRegistry = await LandRegistry.deploy();
    await landRegistry.deployed();
    
    // Deploy LandTransfer with registry address
    const LandTransfer = await ethers.getContractFactory("LandTransfer");
    landTransfer = await LandTransfer.deploy(landRegistry.address);
    await landTransfer.deployed();
    
    // Register a land
    await landRegistry.connect(owner1).registerLand(
      "Plot No. 123, Main Street",
      "28.6139,77.2090",
      5000,
      "DELHI-2024-001",
      "QmXxxx",
      "Raj Kumar",
      "raj@example.com"
    );
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(landTransfer.address).to.not.equal(ethers.constants.AddressZero);
    });

    it("Should set LandRegistry address", async function () {
      const registryAddr = await landTransfer.landRegistry();
      expect(registryAddr).to.equal(landRegistry.address);
    });

    it("Should reject invalid registry address", async function () {
      const LandTransfer = await ethers.getContractFactory("LandTransfer");
      await expect(
        LandTransfer.deploy(ethers.constants.AddressZero)
      ).to.be.revertedWith("Invalid registry address");
    });
  });

  describe("Request Transfer", function () {
    it("Should create transfer request", async function () {
      const tx = await landTransfer.connect(owner1).requestTransfer(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com"
      );

      await expect(tx)
        .to.emit(landTransfer, "TransferRequested")
        .withArgs(0, 0, owner1.address, owner2.address, expect.any(Object));
    });

    it("Should increment request counter", async function () {
      await landTransfer.connect(owner1).requestTransfer(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com"
      );

      const counter = await landTransfer.transferRequestCounter();
      expect(counter).to.equal(1);
    });

    it("Should set from owner approved immediately", async function () {
      await landTransfer.connect(owner1).requestTransfer(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com"
      );

      const request = await landTransfer.getTransferRequest(0);
      expect(request.fromOwnerApproved).to.equal(true);
      expect(request.toOwnerApproved).to.equal(false);
    });

    it("Should reject non-owner transfer request", async function () {
      await expect(
        landTransfer.connect(owner3).requestTransfer(
          0,
          owner2.address,
          "Priya Kumar",
          "priya@example.com"
        )
      ).to.be.revertedWith("Only owner can request transfer");
    });

    it("Should reject self-transfer", async function () {
      await expect(
        landTransfer.connect(owner1).requestTransfer(
          0,
          owner1.address,
          "Raj Kumar",
          "raj@example.com"
        )
      ).to.be.revertedWith("Cannot transfer to yourself");
    });

    it("Should reject invalid recipient address", async function () {
      await expect(
        landTransfer.connect(owner1).requestTransfer(
          0,
          ethers.constants.AddressZero,
          "Priya Kumar",
          "priya@example.com"
        )
      ).to.be.revertedWith("Invalid recipient address");
    });

    it("Should reject empty recipient name", async function () {
      await expect(
        landTransfer.connect(owner1).requestTransfer(
          0,
          owner2.address,
          "",
          "priya@example.com"
        )
      ).to.be.revertedWith("Recipient name required");
    });
  });

  describe("Approve Transfer", function () {
    beforeEach(async function () {
      await landTransfer.connect(owner1).requestTransfer(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com"
      );
    });

    it("Should approve transfer by recipient", async function () {
      const tx = await landTransfer.connect(owner2).approveTransfer(0);

      await expect(tx)
        .to.emit(landTransfer, "TransferApprovedByRecipient")
        .withArgs(0, owner2.address, expect.any(Object));
    });

    it("Should complete transfer after both approve", async function () {
      // Owner already approved on request
      const tx = await landTransfer.connect(owner2).approveTransfer(0);

      await expect(tx)
        .to.emit(landTransfer, "TransferCompleted")
        .withArgs(0, 0, owner2.address, expect.any(Object));
    });

    it("Should update land ownership on completion", async function () {
      await landTransfer.connect(owner2).approveTransfer(0);

      const newOwner = await landRegistry.getCurrentOwner(0);
      expect(newOwner).to.equal(owner2.address);
    });

    it("Should track in land transfer history", async function () {
      await landTransfer.connect(owner2).approveTransfer(0);

      const history = await landTransfer.getLandTransferHistory(0);
      expect(history.length).to.equal(1);
      expect(history[0]).to.equal(0);
    });

    it("Should reject approval from non-recipient", async function () {
      await expect(
        landTransfer.connect(owner1).approveTransfer(0)
      ).to.be.revertedWith("Only recipient can approve");
    });

    it("Should reject double approval", async function () {
      await landTransfer.connect(owner2).approveTransfer(0);

      await expect(
        landTransfer.connect(owner2).approveTransfer(0)
      ).to.be.revertedWith("Already approved");
    });

    it("Should reject approval on cancelled transfer", async function () {
      await landTransfer.connect(owner2).rejectTransfer(0, "Changed my mind");

      await expect(
        landTransfer.connect(owner2).approveTransfer(0)
      ).to.be.revertedWith("Transfer cancelled");
    });
  });

  describe("Reject Transfer", function () {
    beforeEach(async function () {
      await landTransfer.connect(owner1).requestTransfer(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com"
      );
    });

    it("Should reject transfer by recipient", async function () {
      const tx = await landTransfer.connect(owner2).rejectTransfer(0, "Not interested");

      await expect(tx)
        .to.emit(landTransfer, "TransferRejected")
        .withArgs(0, owner2.address, "Not interested", expect.any(Object));
    });

    it("Should mark as cancelled", async function () {
      await landTransfer.connect(owner2).rejectTransfer(0, "Not interested");

      const request = await landTransfer.getTransferRequest(0);
      expect(request.isCancelled).to.equal(true);
    });

    it("Should store rejection reason", async function () {
      const reason = "Changed my mind - staying here!";
      await landTransfer.connect(owner2).rejectTransfer(0, reason);

      const request = await landTransfer.getTransferRequest(0);
      expect(request.rejectionReason).to.equal(reason);
    });

    it("Should reject approval after rejection", async function () {
      await landTransfer.connect(owner2).rejectTransfer(0, "Not interested");

      await expect(
        landTransfer.connect(owner2).approveTransfer(0)
      ).to.be.revertedWith("Transfer cancelled");
    });
  });

  describe("Cancel Transfer", function () {
    beforeEach(async function () {
      await landTransfer.connect(owner1).requestTransfer(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com"
      );
    });

    it("Should cancel transfer by requester", async function () {
      const tx = await landTransfer.connect(owner1).cancelTransfer(0);

      await expect(tx)
        .to.emit(landTransfer, "TransferCancelled")
        .withArgs(0, expect.any(Object));
    });

    it("Should reject cancel by non-requester", async function () {
      await expect(
        landTransfer.connect(owner2).cancelTransfer(0)
      ).to.be.revertedWith("Only requester can cancel");
    });

    it("Should prevent approval after cancellation", async function () {
      await landTransfer.connect(owner1).cancelTransfer(0);

      await expect(
        landTransfer.connect(owner2).approveTransfer(0)
      ).to.be.revertedWith("Transfer cancelled");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await landTransfer.connect(owner1).requestTransfer(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com"
      );
    });

    it("Should get transfer request details", async function () {
      const request = await landTransfer.getTransferRequest(0);
      expect(request.landId).to.equal(0);
      expect(request.fromOwner).to.equal(owner1.address);
      expect(request.toOwner).to.equal(owner2.address);
      expect(request.toOwnerName).to.equal("Priya Kumar");
    });

    it("Should check pending approval status", async function () {
      const isPending = await landTransfer.isPendingApproval(0);
      expect(isPending).to.equal(true);
    });

    it("Should return false after approval", async function () {
      await landTransfer.connect(owner2).approveTransfer(0);

      const isPending = await landTransfer.isPendingApproval(0);
      expect(isPending).to.equal(false);
    });

    it("Should get user pending transfers", async function () {
      const userTransfers = await landTransfer.getUserPendingTransfers(owner2.address);
      expect(userTransfers.length).to.equal(1);
      expect(userTransfers[0]).to.equal(0);
    });
  });

  describe("Multiple Transfers", function () {
    it("Should handle multiple transfer requests", async function () {
      // First transfer
      await landTransfer.connect(owner1).requestTransfer(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com"
      );

      // Complete first transfer
      await landTransfer.connect(owner2).approveTransfer(0);

      // Second transfer from new owner to owner3
      await landTransfer.connect(owner2).requestTransfer(
        0,
        owner3.address,
        "Amit Sharma",
        "amit@example.com"
      );

      // Verify transfer history
      const history = await landTransfer.getLandTransferHistory(0);
      expect(history.length).to.equal(2);

      // Third owner should have pending transfer
      const pending = await landTransfer.getUserPendingTransfers(owner3.address);
      expect(pending.length).to.equal(1);
    });
  });

  describe("Total Transfers Tracking", function () {
    it("Should increment completed transfers count", async function () {
      await landTransfer.connect(owner1).requestTransfer(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com"
      );

      await landTransfer.connect(owner2).approveTransfer(0);

      const totalCompleted = await landTransfer.totalCompletedTransfers();
      expect(totalCompleted).to.equal(1);
    });
  });
});
