const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyRegistry", function () {
  let propertyRegistry;
  let landlord;
  let tenant;
  let other;

  beforeEach(async function () {
    [landlord, tenant, other] = await ethers.getSigners();
    
    const PropertyRegistry = await ethers.getContractFactory("PropertyRegistry");
    propertyRegistry = await PropertyRegistry.deploy();
    await propertyRegistry.deployed();
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(propertyRegistry.address).to.not.equal(ethers.constants.AddressZero);
    });

    it("Should initialize with zero properties", async function () {
      const total = await propertyRegistry.totalProperties();
      expect(total).to.equal(0);
    });
  });

  describe("Register Property", function () {
    it("Should register a property successfully", async function () {
      const tx = await propertyRegistry.connect(landlord).registerProperty(
        "123 Main Street",
        ethers.utils.parseEther("1"), // 1 ETH per month
        ethers.utils.parseEther("2"), // 2 ETH deposit
        2, // bedrooms
        1, // bathrooms
        "Beautiful apartment"
      );

      await expect(tx)
        .to.emit(propertyRegistry, "PropertyRegistered")
        .withArgs(0, landlord.address, "123 Main Street", ethers.utils.parseEther("1"));
    });

    it("Should increment property counter", async function () {
      await propertyRegistry.connect(landlord).registerProperty(
        "123 Main Street",
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("2"),
        2,
        1,
        "Beautiful apartment"
      );

      const counter = await propertyRegistry.propertyCounter();
      expect(counter).to.equal(1);
    });

    it("Should reject empty location", async function () {
      await expect(
        propertyRegistry.connect(landlord).registerProperty(
          "",
          ethers.utils.parseEther("1"),
          ethers.utils.parseEther("2"),
          2,
          1,
          "Beautiful apartment"
        )
      ).to.be.revertedWith("Location cannot be empty");
    });

    it("Should reject zero rent", async function () {
      await expect(
        propertyRegistry.connect(landlord).registerProperty(
          "123 Main Street",
          0,
          ethers.utils.parseEther("2"),
          2,
          1,
          "Beautiful apartment"
        )
      ).to.be.revertedWith("Rent must be greater than 0");
    });

    it("Should reject zero bedrooms", async function () {
      await expect(
        propertyRegistry.connect(landlord).registerProperty(
          "123 Main Street",
          ethers.utils.parseEther("1"),
          ethers.utils.parseEther("2"),
          0,
          1,
          "Beautiful apartment"
        )
      ).to.be.revertedWith("Must have at least 1 bedroom");
    });

    it("Should reject zero bathrooms", async function () {
      await expect(
        propertyRegistry.connect(landlord).registerProperty(
          "123 Main Street",
          ethers.utils.parseEther("1"),
          ethers.utils.parseEther("2"),
          2,
          0,
          "Beautiful apartment"
        )
      ).to.be.revertedWith("Must have at least 1 bathroom");
    });
  });

  describe("Get Property", function () {
    beforeEach(async function () {
      await propertyRegistry.connect(landlord).registerProperty(
        "123 Main Street",
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("2"),
        2,
        1,
        "Beautiful apartment"
      );
    });

    it("Should retrieve property details", async function () {
      const property = await propertyRegistry.getProperty(0);
      expect(property.propertyId).to.equal(0);
      expect(property.landlord).to.equal(landlord.address);
      expect(property.location).to.equal("123 Main Street");
      expect(property.bedrooms).to.equal(2);
      expect(property.bathrooms).to.equal(1);
    });

    it("Should revert for non-existent property", async function () {
      await expect(propertyRegistry.getProperty(999)).to.be.revertedWith(
        "Property does not exist"
      );
    });
  });

  describe("Update Property", function () {
    beforeEach(async function () {
      await propertyRegistry.connect(landlord).registerProperty(
        "123 Main Street",
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("2"),
        2,
        1,
        "Beautiful apartment"
      );
    });

    it("Should update property details", async function () {
      const tx = await propertyRegistry.connect(landlord).updateProperty(
        0,
        "456 Oak Avenue",
        ethers.utils.parseEther("1.5"),
        ethers.utils.parseEther("3"),
        3,
        2,
        "Updated apartment"
      );

      await expect(tx).to.emit(propertyRegistry, "PropertyUpdated");

      const property = await propertyRegistry.getProperty(0);
      expect(property.location).to.equal("456 Oak Avenue");
      expect(property.rentPerMonth).to.equal(ethers.utils.parseEther("1.5"));
      expect(property.bedrooms).to.equal(3);
    });

    it("Should reject update from non-landlord", async function () {
      await expect(
        propertyRegistry.connect(tenant).updateProperty(
          0,
          "456 Oak Avenue",
          ethers.utils.parseEther("1.5"),
          ethers.utils.parseEther("3"),
          3,
          2,
          "Updated apartment"
        )
      ).to.be.revertedWith("Only property landlord can perform this action");
    });

    it("Should reject update to non-existent property", async function () {
      await expect(
        propertyRegistry.connect(landlord).updateProperty(
          999,
          "456 Oak Avenue",
          ethers.utils.parseEther("1.5"),
          ethers.utils.parseEther("3"),
          3,
          2,
          "Updated apartment"
        )
      ).to.be.revertedWith("Property does not exist");
    });
  });

  describe("Property Availability", function () {
    beforeEach(async function () {
      await propertyRegistry.connect(landlord).registerProperty(
        "123 Main Street",
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("2"),
        2,
        1,
        "Beautiful apartment"
      );
    });

    it("Should set property availability", async function () {
      const tx = await propertyRegistry.connect(landlord).setPropertyAvailability(0, false);
      
      await expect(tx)
        .to.emit(propertyRegistry, "PropertyAvailabilityChanged")
        .withArgs(0, false);

      const property = await propertyRegistry.getProperty(0);
      expect(property.isAvailable).to.equal(false);
    });

    it("Should reject availability change from non-landlord", async function () {
      await expect(
        propertyRegistry.connect(tenant).setPropertyAvailability(0, false)
      ).to.be.revertedWith("Only property landlord can perform this action");
    });
  });

  describe("Landlord Properties", function () {
    it("Should get landlord properties", async function () {
      await propertyRegistry.connect(landlord).registerProperty(
        "123 Main Street",
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("2"),
        2,
        1,
        "Apartment 1"
      );

      await propertyRegistry.connect(landlord).registerProperty(
        "456 Oak Avenue",
        ethers.utils.parseEther("2"),
        ethers.utils.parseEther("3"),
        3,
        2,
        "Apartment 2"
      );

      const properties = await propertyRegistry.getLandlordProperties(landlord.address);
      expect(properties.length).to.equal(2);
      expect(properties[0]).to.equal(0);
      expect(properties[1]).to.equal(1);
    });

    it("Should get landlord property count", async function () {
      await propertyRegistry.connect(landlord).registerProperty(
        "123 Main Street",
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("2"),
        2,
        1,
        "Apartment 1"
      );

      const count = await propertyRegistry.getLandlordPropertyCount(landlord.address);
      expect(count).to.equal(1);
    });
  });

  describe("Available Properties", function () {
    it("Should get all available properties", async function () {
      await propertyRegistry.connect(landlord).registerProperty(
        "123 Main Street",
        ethers.utils.parseEther("1"),
        ethers.utils.parseEther("2"),
        2,
        1,
        "Apartment 1"
      );

      await propertyRegistry.connect(landlord).registerProperty(
        "456 Oak Avenue",
        ethers.utils.parseEther("2"),
        ethers.utils.parseEther("3"),
        3,
        2,
        "Apartment 2"
      );

      await propertyRegistry.connect(landlord).setPropertyAvailability(0, false);

      const available = await propertyRegistry.getAvailableProperties();
      expect(available.length).to.equal(1);
      expect(available[0]).to.equal(1);
    });
  });

  describe("Pagination", function () {
    beforeEach(async function () {
      for (let i = 0; i < 5; i++) {
        await propertyRegistry.connect(landlord).registerProperty(
          `Property ${i}`,
          ethers.utils.parseEther("1"),
          ethers.utils.parseEther("2"),
          2,
          1,
          `Description ${i}`
        );
      }
    });

    it("Should get paginated properties", async function () {
      const properties = await propertyRegistry.getAllProperties(0, 2);
      expect(properties.length).to.equal(2);
      expect(properties[0].propertyId).to.equal(0);
      expect(properties[1].propertyId).to.equal(1);
    });

    it("Should handle pagination offset", async function () {
      const properties = await propertyRegistry.getAllProperties(3, 2);
      expect(properties.length).to.equal(2);
      expect(properties[0].propertyId).to.equal(3);
      expect(properties[1].propertyId).to.equal(4);
    });

    it("Should handle pagination beyond total", async function () {
      const properties = await propertyRegistry.getAllProperties(3, 10);
      expect(properties.length).to.equal(2);
    });
  });
});
