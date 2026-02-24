// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PropertyRegistry
 * @dev Manages rental property listings on the blockchain
 * @notice Allows landlords to register, update, and manage rental properties
 */

contract PropertyRegistry {
    
    // ============ Data Structures ============
    
    /**
     * @dev Structure to store property details
     */
    struct Property {
        uint256 propertyId;
        address landlord;
        string location;
        uint256 rentPerMonth;
        uint256 securityDeposit;
        uint8 bedrooms;
        uint8 bathrooms;
        string description;
        bool isAvailable;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    // ============ State Variables ============
    
    uint256 public propertyCounter = 0;
    
    // Mapping: propertyId => Property details
    mapping(uint256 => Property) public properties;
    
    // Mapping: landlord address => array of property IDs
    mapping(address => uint256[]) public landlordProperties;
    
    // Track total active properties
    uint256 public totalProperties = 0;
    
    // ============ Events ============
    
    /**
     * @dev Emitted when a property is registered
     */
    event PropertyRegistered(
        uint256 indexed propertyId,
        address indexed landlord,
        string location,
        uint256 rentPerMonth
    );
    
    /**
     * @dev Emitted when a property is updated
     */
    event PropertyUpdated(
        uint256 indexed propertyId,
        address indexed landlord,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when property availability status changes
     */
    event PropertyAvailabilityChanged(
        uint256 indexed propertyId,
        bool isAvailable
    );
    
    // ============ Modifiers ============
    
    /**
     * @dev Ensures only the landlord of a property can modify it
     */
    modifier onlyLandlord(uint256 _propertyId) {
        require(
            properties[_propertyId].landlord == msg.sender,
            "Only property landlord can perform this action"
        );
        _;
    }
    
    /**
     * @dev Ensures the property exists
     */
    modifier propertyExists(uint256 _propertyId) {
        require(
            _propertyId < propertyCounter,
            "Property does not exist"
        );
        _;
    }
    
    // ============ Core Functions ============
    
    /**
     * @dev Register a new property
     * @param _location Property address/location
     * @param _rentPerMonth Monthly rent amount in wei
     * @param _securityDeposit Security deposit amount in wei
     * @param _bedrooms Number of bedrooms
     * @param _bathrooms Number of bathrooms
     * @param _description Property description
     * @return propertyId The ID of the newly registered property
     */
    function registerProperty(
        string memory _location,
        uint256 _rentPerMonth,
        uint256 _securityDeposit,
        uint8 _bedrooms,
        uint8 _bathrooms,
        string memory _description
    ) public returns (uint256) {
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(_rentPerMonth > 0, "Rent must be greater than 0");
        require(_bedrooms > 0, "Must have at least 1 bedroom");
        require(_bathrooms > 0, "Must have at least 1 bathroom");
        
        uint256 propertyId = propertyCounter;
        
        properties[propertyId] = Property({
            propertyId: propertyId,
            landlord: msg.sender,
            location: _location,
            rentPerMonth: _rentPerMonth,
            securityDeposit: _securityDeposit,
            bedrooms: _bedrooms,
            bathrooms: _bathrooms,
            description: _description,
            isAvailable: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        landlordProperties[msg.sender].push(propertyId);
        propertyCounter++;
        totalProperties++;
        
        emit PropertyRegistered(
            propertyId,
            msg.sender,
            _location,
            _rentPerMonth
        );
        
        return propertyId;
    }
    
    /**
     * @dev Update property details
     * @param _propertyId ID of property to update
     * @param _location Updated location
     * @param _rentPerMonth Updated monthly rent
     * @param _securityDeposit Updated security deposit
     * @param _bedrooms Updated bedroom count
     * @param _bathrooms Updated bathroom count
     * @param _description Updated description
     */
    function updateProperty(
        uint256 _propertyId,
        string memory _location,
        uint256 _rentPerMonth,
        uint256 _securityDeposit,
        uint8 _bedrooms,
        uint8 _bathrooms,
        string memory _description
    ) public propertyExists(_propertyId) onlyLandlord(_propertyId) {
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(_rentPerMonth > 0, "Rent must be greater than 0");
        require(_bedrooms > 0, "Must have at least 1 bedroom");
        require(_bathrooms > 0, "Must have at least 1 bathroom");
        
        Property storage property = properties[_propertyId];
        
        property.location = _location;
        property.rentPerMonth = _rentPerMonth;
        property.securityDeposit = _securityDeposit;
        property.bedrooms = _bedrooms;
        property.bathrooms = _bathrooms;
        property.description = _description;
        property.updatedAt = block.timestamp;
        
        emit PropertyUpdated(_propertyId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Toggle property availability
     * @param _propertyId ID of property
     * @param _isAvailable Availability status
     */
    function setPropertyAvailability(
        uint256 _propertyId,
        bool _isAvailable
    ) public propertyExists(_propertyId) onlyLandlord(_propertyId) {
        properties[_propertyId].isAvailable = _isAvailable;
        emit PropertyAvailabilityChanged(_propertyId, _isAvailable);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get property details
     * @param _propertyId ID of property
     * @return Property struct
     */
    function getProperty(uint256 _propertyId)
        public
        view
        propertyExists(_propertyId)
        returns (Property memory)
    {
        return properties[_propertyId];
    }
    
    /**
     * @dev Get all properties of a landlord
     * @param _landlord Address of landlord
     * @return Array of property IDs owned by landlord
     */
    function getLandlordProperties(address _landlord)
        public
        view
        returns (uint256[] memory)
    {
        return landlordProperties[_landlord];
    }
    
    /**
     * @dev Get all available properties
     * @return Array of available property IDs
     */
    function getAvailableProperties()
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory available = new uint256[](totalProperties);
        uint256 count = 0;
        
        for (uint256 i = 0; i < propertyCounter; i++) {
            if (properties[i].isAvailable) {
                available[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = available[i];
        }
        
        return result;
    }
    
    /**
     * @dev Get all properties (paginated)
     * @param _offset Starting index
     * @param _limit Number of properties to return
     * @return Array of property structs
     */
    function getAllProperties(uint256 _offset, uint256 _limit)
        public
        view
        returns (Property[] memory)
    {
        require(_offset < propertyCounter, "Offset out of bounds");
        
        uint256 end = _offset + _limit;
        if (end > propertyCounter) {
            end = propertyCounter;
        }
        
        uint256 length = end - _offset;
        Property[] memory result = new Property[](length);
        
        for (uint256 i = 0; i < length; i++) {
            result[i] = properties[_offset + i];
        }
        
        return result;
    }
    
    /**
     * @dev Get count of properties by landlord
     * @param _landlord Address of landlord
     * @return Number of properties
     */
    function getLandlordPropertyCount(address _landlord)
        public
        view
        returns (uint256)
    {
        return landlordProperties[_landlord].length;
    }
}
