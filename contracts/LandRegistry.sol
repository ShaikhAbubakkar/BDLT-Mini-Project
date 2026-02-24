// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title LandRegistry
 * @dev Manages land registration and ownership on the blockchain
 * @notice Allows landowners to register and manage their properties with verified ownership
 */

contract LandRegistry {
    
    // ============ Data Structures ============
    
    /**
     * @dev Structure to store land details
     */
    struct Land {
        uint256 landId;
        string location;
        string coordinates; // lat,long format
        uint256 area; // in square meters
        string propertyNumber; // Official property ID
        string documentHash; // IPFS hash of property documents
        bool isRegistered;
        uint256 registeredAt;
        uint256 updatedAt;
    }
    
    /**
     * @dev Structure to store ownership information
     */
    struct Owner {
        address ownerAddress;
        string ownerName;
        string contactInfo;
        uint256 ownershipPercentage;
        uint256 acquiredAt;
    }
    
    // ============ State Variables ============
    
    uint256 public landCounter = 0;
    
    // Mapping: landId => Land details
    mapping(uint256 => Land) public lands;
    
    // Mapping: landId => array of owners
    mapping(uint256 => Owner[]) public landOwners;
    
    // Mapping: landId => ownership history
    mapping(uint256 => address[]) public ownershipHistory;
    
    // Mapping: address => array of land IDs owned by person
    mapping(address => uint256[]) public personLands;
    
    // Track total registered lands
    uint256 public totalRegisteredLands = 0;
    
    // ============ Events ============
    
    /**
     * @dev Emitted when land is registered
     */
    event LandRegistered(
        uint256 indexed landId,
        string location,
        string propertyNumber,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when ownership is added
     */
    event OwnershipAdded(
        uint256 indexed landId,
        address indexed owner,
        uint256 ownershipPercentage
    );
    
    /**
     * @dev Emitted when land details are updated
     */
    event LandUpdated(
        uint256 indexed landId,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when ownership changes
     */
    event OwnershipTransferred(
        uint256 indexed landId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );
    
    // ============ Modifiers ============
    
    /**
     * @dev Ensures the land exists
     */
    modifier landExists(uint256 _landId) {
        require(_landId < landCounter, "Land does not exist");
        _;
    }
    
    /**
     * @dev Ensures caller is an owner of the land
     */
    modifier onlyLandOwner(uint256 _landId) {
        bool isOwner = false;
        Owner[] memory owners = landOwners[_landId];
        
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i].ownerAddress == msg.sender) {
                isOwner = true;
                break;
            }
        }
        
        require(isOwner, "Only land owner can perform this action");
        _;
    }
    
    // ============ Core Functions ============
    
    /**
     * @dev Register a new land
     * @param _location Physical location of the land
     * @param _coordinates GPS coordinates (lat,long)
     * @param _area Area in square meters
     * @param _propertyNumber Official property/survey number
     * @param _documentHash IPFS hash of property documents
     * @param _ownerName Name of initial owner
     * @param _contactInfo Contact information of owner
     * @return landId The ID of the newly registered land
     */
    function registerLand(
        string memory _location,
        string memory _coordinates,
        uint256 _area,
        string memory _propertyNumber,
        string memory _documentHash,
        string memory _ownerName,
        string memory _contactInfo
    ) public returns (uint256) {
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(_area > 0, "Area must be greater than 0");
        require(bytes(_propertyNumber).length > 0, "Property number required");
        
        uint256 landId = landCounter;
        
        // Register land
        lands[landId] = Land({
            landId: landId,
            location: _location,
            coordinates: _coordinates,
            area: _area,
            propertyNumber: _propertyNumber,
            documentHash: _documentHash,
            isRegistered: true,
            registeredAt: block.timestamp,
            updatedAt: block.timestamp
        });
        
        // Add initial owner with 100% ownership
        landOwners[landId].push(Owner({
            ownerAddress: msg.sender,
            ownerName: _ownerName,
            contactInfo: _contactInfo,
            ownershipPercentage: 100,
            acquiredAt: block.timestamp
        }));
        
        ownershipHistory[landId].push(msg.sender);
        personLands[msg.sender].push(landId);
        landCounter++;
        totalRegisteredLands++;
        
        emit LandRegistered(landId, _location, _propertyNumber, block.timestamp);
        emit OwnershipAdded(landId, msg.sender, 100);
        
        return landId;
    }
    
    /**
     * @dev Add co-owner to the land
     * @param _landId ID of the land
     * @param _coOwnerAddress Address of co-owner
     * @param _coOwnerName Name of co-owner
     * @param _contactInfo Contact info of co-owner
     * @param _ownershipPercentage Ownership percentage (must total to 100 with existing)
     */
    function addCoOwner(
        uint256 _landId,
        address _coOwnerAddress,
        string memory _coOwnerName,
        string memory _contactInfo,
        uint256 _ownershipPercentage
    ) public landExists(_landId) onlyLandOwner(_landId) {
        require(_coOwnerAddress != address(0), "Invalid address");
        require(_ownershipPercentage > 0 && _ownershipPercentage <= 100, "Invalid percentage");
        
        // Check if co-owner already exists
        Owner[] storage owners = landOwners[_landId];
        for (uint256 i = 0; i < owners.length; i++) {
            require(owners[i].ownerAddress != _coOwnerAddress, "Already an owner");
        }
        
        // Add new co-owner
        owners.push(Owner({
            ownerAddress: _coOwnerAddress,
            ownerName: _coOwnerName,
            contactInfo: _contactInfo,
            ownershipPercentage: _ownershipPercentage,
            acquiredAt: block.timestamp
        }));
        
        ownershipHistory[_landId].push(_coOwnerAddress);
        personLands[_coOwnerAddress].push(_landId);
        
        emit OwnershipAdded(_landId, _coOwnerAddress, _ownershipPercentage);
    }
    
    /**
     * @dev Update land details
     * @param _landId ID of land to update
     * @param _coordinates New coordinates
     * @param _documentHash New document hash (IPFS)
     */
    function updateLandDetails(
        uint256 _landId,
        string memory _coordinates,
        string memory _documentHash
    ) public landExists(_landId) onlyLandOwner(_landId) {
        Land storage land = lands[_landId];
        land.coordinates = _coordinates;
        land.documentHash = _documentHash;
        land.updatedAt = block.timestamp;
        
        emit LandUpdated(_landId, block.timestamp);
    }
    
    /**
     * @dev Transfer ownership to a new owner
     * @param _landId ID of land to transfer
     * @param _newOwnerAddress Address of new owner
     * @param _newOwnerName Name of new owner
     * @param _contactInfo Contact info of new owner
     */
    function transferOwnership(
        uint256 _landId,
        address _newOwnerAddress,
        string memory _newOwnerName,
        string memory _contactInfo
    ) public landExists(_landId) onlyLandOwner(_landId) {
        require(_newOwnerAddress != address(0), "Invalid address");
        require(_newOwnerAddress != msg.sender, "Cannot transfer to self");
        
        address previousOwner = msg.sender;
        
        // Remove current owner and add new owner with full ownership
        Owner[] storage owners = landOwners[_landId];
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i].ownerAddress == previousOwner) {
                owners[i] = owners[owners.length - 1];
                owners.pop();
                break;
            }
        }
        
        // Add new owner
        owners.push(Owner({
            ownerAddress: _newOwnerAddress,
            ownerName: _newOwnerName,
            contactInfo: _contactInfo,
            ownershipPercentage: 100,
            acquiredAt: block.timestamp
        }));
        
        ownershipHistory[_landId].push(_newOwnerAddress);
        personLands[_newOwnerAddress].push(_landId);
        
        emit OwnershipTransferred(_landId, previousOwner, _newOwnerAddress, block.timestamp);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get land details
     */
    function getLand(uint256 _landId)
        public
        view
        landExists(_landId)
        returns (Land memory)
    {
        return lands[_landId];
    }
    
    /**
     * @dev Get all owners of a land
     */
    function getLandOwners(uint256 _landId)
        public
        view
        landExists(_landId)
        returns (Owner[] memory)
    {
        return landOwners[_landId];
    }
    
    /**
     * @dev Get ownership history of a land
     */
    function getOwnershipHistory(uint256 _landId)
        public
        view
        landExists(_landId)
        returns (address[] memory)
    {
        return ownershipHistory[_landId];
    }
    
    /**
     * @dev Get all lands owned by a person
     */
    function getPersonLands(address _person)
        public
        view
        returns (uint256[] memory)
    {
        return personLands[_person];
    }
    
    /**
     * @dev Check if address is owner of a land
     */
    function isLandOwner(uint256 _landId, address _address)
        public
        view
        landExists(_landId)
        returns (bool)
    {
        Owner[] memory owners = landOwners[_landId];
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i].ownerAddress == _address) {
                return true;
            }
        }
        return false;
    }
    
    /**
     * @dev Get current owner of a land (primary owner)
     */
    function getCurrentOwner(uint256 _landId)
        public
        view
        landExists(_landId)
        returns (address)
    {
        Owner[] memory owners = landOwners[_landId];
        require(owners.length > 0, "No owner found");
        return owners[0].ownerAddress;
    }
    
    /**
     * @dev Get all lands with pagination
     */
    function getAllLands(uint256 _offset, uint256 _limit)
        public
        view
        returns (Land[] memory)
    {
        require(_offset < landCounter, "Offset out of bounds");
        
        uint256 end = _offset + _limit;
        if (end > landCounter) {
            end = landCounter;
        }
        
        uint256 length = end - _offset;
        Land[] memory result = new Land[](length);
        
        for (uint256 i = 0; i < length; i++) {
            result[i] = lands[_offset + i];
        }
        
        return result;
    }
}
