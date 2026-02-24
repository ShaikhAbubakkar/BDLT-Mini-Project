const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LandRegistry", function () {
  let landRegistry;
  let owner1;
  let owner2;
  let owner3;

  beforeEach(async function () {
    [owner1, owner2, owner3] = await ethers.getSigners();
    
    const LandRegistry = await ethers.getContractFactory("LandRegistry");
    landRegistry = await LandRegistry.deploy();
    await landRegistry.deployed();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(landRegistry.address).to.not.equal(ethers.constants.AddressZero);
    });

    it("Should initialize with zero lands", async function () {
      const total = await landRegistry.totalRegisteredLands();
      expect(total).to.equal(0);
    });
  });

  describe("Register Land", function () {
    it("Should register land successfully", async function () {
      const tx = await landRegistry.connect(owner1).registerLand(
        "Plot No. 123, Main Street",
        "28.6139,77.2090", // Delhi coordinates
        5000, // 5000 sq meters
        "DELHI-2024-001",
        "QmXxxx",
        "Raj Kumar",
        "raj@example.com"
      );

      await expect(tx)
        .to.emit(landRegistry, "LandRegistered")
        .withArgs(0, "Plot No. 123, Main Street", "DELHI-2024-001", expect.any(Object));
    });

    it("Should reject empty location", async function () {
      await expect(
        landRegistry.connect(owner1).registerLand(
          "",
          "28.6139,77.2090",
          5000,
          "DELHI-2024-001",
          "QmXxxx",
          "Raj Kumar",
          "raj@example.com"
        )
      ).to.be.revertedWith("Location cannot be empty");
    });

    it("Should reject zero area", async function () {
      await expect(
        landRegistry.connect(owner1).registerLand(
          "Plot No. 123, Main Street",
          "28.6139,77.2090",
          0,
          "DELHI-2024-001",
          "QmXxxx",
          "Raj Kumar",
          "raj@example.com"
        )
      ).to.be.revertedWith("Area must be greater than 0");
    });

    it("Should reject empty property number", async function () {
      await expect(
        landRegistry.connect(owner1).registerLand(
          "Plot No. 123, Main Street",
          "28.6139,77.2090",
          5000,
          "",
          "QmXxxx",
          "Raj Kumar",
          "raj@example.com"
        )
      ).to.be.revertedWith("Property number required");
    });

    it("Should increment land counter", async function () {
      await landRegistry.connect(owner1).registerLand(
        "Plot 1",
        "28.6139,77.2090",
        5000,
        "DELHI-001",
        "QmXxxx",
        "Raj",
        "raj@example.com"
      );

      const counter = await landRegistry.landCounter();
      expect(counter).to.equal(1);
    });
  });

  describe("Get Land", function () {
    beforeEach(async function () {
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

    it("Should retrieve land details", async function () {
      const land = await landRegistry.getLand(0);
      expect(land.landId).to.equal(0);
      expect(land.location).to.equal("Plot No. 123, Main Street");
      expect(land.area).to.equal(5000);
      expect(land.propertyNumber).to.equal("DELHI-2024-001");
    });

    it("Should revert for non-existent land", async function () {
      await expect(landRegistry.getLand(999)).to.be.revertedWith(
        "Land does not exist"
      );
    });
  });

  describe("Update Land Details", function () {
    beforeEach(async function () {
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

    it("Should update land coordinates and document", async function () {
      const tx = await landRegistry.connect(owner1).updateLandDetails(
        0,
        "28.6140,77.2091",
        "QmYyyy"
      );

      await expect(tx).to.emit(landRegistry, "LandUpdated");

      const land = await landRegistry.getLand(0);
      expect(land.coordinates).to.equal("28.6140,77.2091");
      expect(land.documentHash).to.equal("QmYyyy");
    });

    it("Should reject update from non-owner", async function () {
      await expect(
        landRegistry.connect(owner2).updateLandDetails(
          0,
          "28.6140,77.2091",
          "QmYyyy"
        )
      ).to.be.revertedWith("Only land owner can perform this action");
    });
  });

  describe("Co-Ownership", function () {
    beforeEach(async function () {
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

    it("Should add co-owner to land", async function () {
      const tx = await landRegistry.connect(owner1).addCoOwner(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com",
        50
      );

      await expect(tx)
        .to.emit(landRegistry, "OwnershipAdded")
        .withArgs(0, owner2.address, 50);
    });

    it("Should return all land owners", async function () {
      await landRegistry.connect(owner1).addCoOwner(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com",
        50
      );

      const owners = await landRegistry.getLandOwners(0);
      expect(owners.length).to.equal(2);
      expect(owners[0].ownerAddress).to.equal(owner1.address);
      expect(owners[1].ownerAddress).to.equal(owner2.address);
    });

    it("Should reject duplicate co-owner", async function () {
      await landRegistry.connect(owner1).addCoOwner(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com",
        50
      );

      await expect(
        landRegistry.connect(owner1).addCoOwner(
          0,
          owner2.address,
          "Priya Kumar",
          "priya@example.com",
          25
        )
      ).to.be.revertedWith("Already an owner");
    });

    it("Should reject invalid percentage", async function () {
      await expect(
        landRegistry.connect(owner1).addCoOwner(
          0,
          owner2.address,
          "Priya Kumar",
          "priya@example.com",
          0
        )
      ).to.be.revertedWith("Invalid percentage");
    });

    it("Should reject update from non-owner", async function () {
      await expect(
        landRegistry.connect(owner3).addCoOwner(
          0,
          owner2.address,
          "Priya Kumar",
          "priya@example.com",
          50
        )
      ).to.be.revertedWith("Only land owner can perform this action");
    });
  });

  describe("Transfer Ownership", function () {
    beforeEach(async function () {
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

    it("Should transfer ownership to new owner", async function () {
      const tx = await landRegistry.connect(owner1).transferOwnership(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com"
      );

      await expect(tx)
        .to.emit(landRegistry, "OwnershipTransferred")
        .withArgs(0, owner1.address, owner2.address, expect.any(Object));

      const owners = await landRegistry.getLandOwners(0);
      expect(owners[0].ownerAddress).to.equal(owner2.address);
    });

    it("Should record in ownership history", async function () {
      await landRegistry.connect(owner1).transferOwnership(
        0,
        owner2.address,
        "Priya Kumar",
        "priya@example.com"
      );

      const history = await landRegistry.getOwnershipHistory(0);
      expect(history.length).to.equal(2);
      expect(history[0]).to.equal(owner1.address);
      expect(history[1]).to.equal(owner2.address);
    });

    it("Should reject self-transfer", async function () {
      await expect(
        landRegistry.connect(owner1).transferOwnership(
          0,
          owner1.address,
          "Raj Kumar",
          "raj@example.com"
        )
      ).to.be.revertedWith("Cannot transfer to self");
    });

    it("Should reject transfer from non-owner", async function () {
      await expect(
        landRegistry.connect(owner3).transferOwnership(
          0,
          owner2.address,
          "Priya Kumar",
          "priya@example.com"
        )
      ).to.be.revertedWith("Only land owner can perform this action");
    });
  });

  describe("Owner Verification", function () {
    beforeEach(async function () {
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

    it("Should verify land owner", async function () {
      const isOwner = await landRegistry.isLandOwner(0, owner1.address);
      expect(isOwner).to.equal(true);
    });

    it("Should return false for non-owner", async function () {
      const isOwner = await landRegistry.isLandOwner(0, owner2.address);
      expect(isOwner).to.equal(false);
    });

    it("Should get current owner", async function () {
      const currentOwner = await landRegistry.getCurrentOwner(0);
      expect(currentOwner).to.equal(owner1.address);
    });
  });

  describe("Person Lands", function () {
    it("Should get all lands owned by a person", async function () {
      await landRegistry.connect(owner1).registerLand(
        "Plot 1",
        "28.6139,77.2090",
        5000,
        "DELHI-001",
        "QmXxxx",
        "Raj",
        "raj@example.com"
      );

      await landRegistry.connect(owner1).registerLand(
        "Plot 2",
        "28.6140,77.2091",
        3000,
        "DELHI-002",
        "QmYyyy",
        "Raj",
        "raj@example.com"
      );

      const lands = await landRegistry.getPersonLands(owner1.address);
      expect(lands.length).to.equal(2);
      expect(lands[0]).to.equal(0);
      expect(lands[1]).to.equal(1);
    });
  });

  describe("Pagination", function () {
    beforeEach(async function () {
      for (let i = 0; i < 5; i++) {
        await landRegistry.connect(owner1).registerLand(
          `Plot ${i}`,
          "28.6139,77.2090",
          5000,
          `DELHI-${i}`,
          "QmXxxx",
          "Raj",
          "raj@example.com"
        );
      }
    });

    it("Should get paginated lands", async function () {
      const lands = await landRegistry.getAllLands(0, 2);
      expect(lands.length).to.equal(2);
      expect(lands[0].landId).to.equal(0);
      expect(lands[1].landId).to.equal(1);
    });

    it("Should handle pagination beyond total", async function () {
      const lands = await landRegistry.getAllLands(3, 10);
      expect(lands.length).to.equal(2);
      expect(lands[0].landId).to.equal(3);
      expect(lands[1].landId).to.equal(4);
    });
  });
});
