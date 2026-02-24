// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title LandTransfer
 * @dev Manages land transfer requests and approvals
 * @notice Handles multi-signature approval for land ownership transfers
 */

interface ILandRegistry {
    function isLandOwner(uint256 _landId, address _address) external view returns (bool);
    function transferOwnership(
        uint256 _landId,
        address _newOwnerAddress,
        string memory _newOwnerName,
        string memory _contactInfo
    ) external;
}

contract LandTransfer {
    
    // ============ Data Structures ============
    
    /**
     * @dev Transfer request structure
     */
    struct TransferRequest {
        uint256 requestId;
        uint256 landId;
        address fromOwner;
        address toOwner;
        string toOwnerName;
        string toOwnerContact;
        uint256 requestedAt;
        bool fromOwnerApproved;
        bool toOwnerApproved;
        bool isCompleted;
        bool isCancelled;
        string rejectionReason;
    }
    
    // ============ State Variables ============
    
    ILandRegistry public landRegistry;
    uint256 public transferRequestCounter = 0;
    
    // Mapping: requestId => TransferRequest
    mapping(uint256 => TransferRequest) public transferRequests;
    
    // Mapping: landId => array of transfer request IDs
    mapping(uint256 => uint256[]) public landTransferHistory;
    
    // Mapping: address => array of pending transfer request IDs for that person
    mapping(address => uint256[]) public userPendingTransfers;
    
    uint256 public totalCompletedTransfers = 0;
    
    // ============ Events ============
    
    /**
     * @dev Emitted when transfer request is created
     */
    event TransferRequested(
        uint256 indexed requestId,
        uint256 indexed landId,
        address indexed fromOwner,
        address toOwner,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when transfer is approved by owner
     */
    event TransferApprovedByOwner(
        uint256 indexed requestId,
        address indexed approver,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when transfer is approved by recipient
     */
    event TransferApprovedByRecipient(
        uint256 indexed requestId,
        address indexed approver,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when transfer is completed
     */
    event TransferCompleted(
        uint256 indexed requestId,
        uint256 indexed landId,
        address indexed newOwner,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when transfer is rejected
     */
    event TransferRejected(
        uint256 indexed requestId,
        address indexed rejectedBy,
        string reason,
        uint256 timestamp
    );
    
    /**
     * @dev Emitted when transfer is cancelled
     */
    event TransferCancelled(
        uint256 indexed requestId,
        uint256 timestamp
    );
    
    // ============ Modifiers ============
    
    /**
     * @dev Ensures transfer request exists
     */
    modifier requestExists(uint256 _requestId) {
        require(_requestId < transferRequestCounter, "Transfer request does not exist");
        _;
    }
    
    /**
     * @dev Ensures only owner or recipient can modify request
     */
    modifier onlyParty(uint256 _requestId) {
        TransferRequest storage request = transferRequests[_requestId];
        require(
            msg.sender == request.fromOwner || msg.sender == request.toOwner,
            "Only parties involved can perform this action"
        );
        _;
    }
    
    // ============ Core Functions ============
    
    /**
     * @dev Initialize with LandRegistry address
     */
    constructor(address _landRegistry) {
        require(_landRegistry != address(0), "Invalid registry address");
        landRegistry = ILandRegistry(_landRegistry);
    }
    
    /**
     * @dev Request land transfer
     * @param _landId ID of land to transfer
     * @param _toOwnerAddress Address of new owner
     * @param _toOwnerName Name of new owner
     * @param _toOwnerContact Contact info of new owner
     * @return requestId ID of the transfer request
     */
    function requestTransfer(
        uint256 _landId,
        address _toOwnerAddress,
        string memory _toOwnerName,
        string memory _toOwnerContact
    ) public returns (uint256) {
        require(_toOwnerAddress != address(0), "Invalid recipient address");
        require(_toOwnerAddress != msg.sender, "Cannot transfer to yourself");
        require(landRegistry.isLandOwner(_landId, msg.sender), "Only owner can request transfer");
        require(bytes(_toOwnerName).length > 0, "Recipient name required");
        
        uint256 requestId = transferRequestCounter;
        
        transferRequests[requestId] = TransferRequest({
            requestId: requestId,
            landId: _landId,
            fromOwner: msg.sender,
            toOwner: _toOwnerAddress,
            toOwnerName: _toOwnerName,
            toOwnerContact: _toOwnerContact,
            requestedAt: block.timestamp,
            fromOwnerApproved: true, // Requester approves immediately
            toOwnerApproved: false,
            isCompleted: false,
            isCancelled: false,
            rejectionReason: ""
        });
        
        landTransferHistory[_landId].push(requestId);
        userPendingTransfers[_toOwnerAddress].push(requestId);
        transferRequestCounter++;
        
        emit TransferRequested(requestId, _landId, msg.sender, _toOwnerAddress, block.timestamp);
        
        return requestId;
    }
    
    /**
     * @dev Approve transfer request (by recipient)
     */
    function approveTransfer(uint256 _requestId)
        public
        requestExists(_requestId)
    {
        TransferRequest storage request = transferRequests[_requestId];
        
        require(!request.isCompleted, "Transfer already completed");
        require(!request.isCancelled, "Transfer cancelled");
        require(msg.sender == request.toOwner, "Only recipient can approve");
        require(!request.toOwnerApproved, "Already approved");
        
        request.toOwnerApproved = true;
        
        emit TransferApprovedByRecipient(_requestId, msg.sender, block.timestamp);
        
        // If both have approved, complete the transfer
        if (request.fromOwnerApproved && request.toOwnerApproved) {
            _completeTransfer(_requestId);
        }
    }
    
    /**
     * @dev Reject transfer request
     */
    function rejectTransfer(uint256 _requestId, string memory _reason)
        public
        requestExists(_requestId)
        onlyParty(_requestId)
    {
        TransferRequest storage request = transferRequests[_requestId];
        
        require(!request.isCompleted, "Transfer already completed");
        require(!request.isCancelled, "Transfer already cancelled");
        
        request.isCancelled = true;
        request.rejectionReason = _reason;
        
        emit TransferRejected(_requestId, msg.sender, _reason, block.timestamp);
    }
    
    /**
     * @dev Cancel transfer request (by requester only)
     */
    function cancelTransfer(uint256 _requestId)
        public
        requestExists(_requestId)
    {
        TransferRequest storage request = transferRequests[_requestId];
        
        require(msg.sender == request.fromOwner, "Only requester can cancel");
        require(!request.isCompleted, "Transfer already completed");
        require(!request.isCancelled, "Transfer already cancelled");
        
        request.isCancelled = true;
        
        emit TransferCancelled(_requestId, block.timestamp);
    }
    
    // ============ Internal Functions ============
    
    /**
     * @dev Complete the transfer (internal)
     */
    function _completeTransfer(uint256 _requestId) internal {
        TransferRequest storage request = transferRequests[_requestId];
        
        require(!request.isCompleted, "Already completed");
        require(request.fromOwnerApproved && request.toOwnerApproved, "Not all parties approved");
        
        request.isCompleted = true;
        totalCompletedTransfers++;
        
        // Call LandRegistry to update ownership
        landRegistry.transferOwnership(
            request.landId,
            request.toOwner,
            request.toOwnerName,
            request.toOwnerContact
        );
        
        emit TransferCompleted(_requestId, request.landId, request.toOwner, block.timestamp);
    }
    
    // ============ View Functions ============
    
    /**
     * @dev Get transfer request details
     */
    function getTransferRequest(uint256 _requestId)
        public
        view
        requestExists(_requestId)
        returns (TransferRequest memory)
    {
        return transferRequests[_requestId];
    }
    
    /**
     * @dev Get transfer history of a land
     */
    function getLandTransferHistory(uint256 _landId)
        public
        view
        returns (uint256[] memory)
    {
        return landTransferHistory[_landId];
    }
    
    /**
     * @dev Get pending transfers for a user
     */
    function getUserPendingTransfers(address _user)
        public
        view
        returns (uint256[] memory)
    {
        return userPendingTransfers[_user];
    }
    
    /**
     * @dev Check if transfer is pending approval
     */
    function isPendingApproval(uint256 _requestId)
        public
        view
        requestExists(_requestId)
        returns (bool)
    {
        TransferRequest memory request = transferRequests[_requestId];
        return !request.isCompleted && !request.isCancelled && !request.toOwnerApproved;
    }
}
