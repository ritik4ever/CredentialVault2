// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DIDRegistry
 * @dev Registry for managing Decentralized Identifiers (DIDs)
 */
contract DIDRegistry is Ownable, ReentrancyGuard {
    struct DIDDocument {
        string did;
        address controller;
        string publicKey;
        string serviceEndpoint;
        uint256 created;
        uint256 updated;
        bool active;
    }

    mapping(string => DIDDocument) public didDocuments;
    mapping(address => string[]) public controllerToDIDs;
    mapping(string => bool) public didExists;

    event DIDCreated(string indexed did, address indexed controller, uint256 timestamp);
    event DIDUpdated(string indexed did, address indexed controller, uint256 timestamp);
    event DIDDeactivated(string indexed did, address indexed controller, uint256 timestamp);

    modifier onlyDIDController(string memory _did) {
        require(didDocuments[_did].controller == msg.sender, "Not authorized to modify this DID");
        _;
    }

    modifier didMustExist(string memory _did) {
        require(didExists[_did], "DID does not exist");
        _;
    }

    /**
     * @dev Create a new DID document
     * @param _did The DID identifier
     * @param _publicKey The public key associated with the DID
     * @param _serviceEndpoint The service endpoint for the DID
     */
    function createDID(
        string memory _did,
        string memory _publicKey,
        string memory _serviceEndpoint
    ) external nonReentrant {
        require(!didExists[_did], "DID already exists");
        require(bytes(_did).length > 0, "DID cannot be empty");
        require(bytes(_publicKey).length > 0, "Public key cannot be empty");

        DIDDocument memory newDID = DIDDocument({
            did: _did,
            controller: msg.sender,
            publicKey: _publicKey,
            serviceEndpoint: _serviceEndpoint,
            created: block.timestamp,
            updated: block.timestamp,
            active: true
        });

        didDocuments[_did] = newDID;
        controllerToDIDs[msg.sender].push(_did);
        didExists[_did] = true;

        emit DIDCreated(_did, msg.sender, block.timestamp);
    }

    /**
     * @dev Update an existing DID document
     * @param _did The DID identifier
     * @param _publicKey The new public key
     * @param _serviceEndpoint The new service endpoint
     */
    function updateDID(
        string memory _did,
        string memory _publicKey,
        string memory _serviceEndpoint
    ) external didMustExist(_did) onlyDIDController(_did) nonReentrant {
        require(didDocuments[_did].active, "DID is deactivated");

        didDocuments[_did].publicKey = _publicKey;
        didDocuments[_did].serviceEndpoint = _serviceEndpoint;
        didDocuments[_did].updated = block.timestamp;

        emit DIDUpdated(_did, msg.sender, block.timestamp);
    }

    /**
     * @dev Deactivate a DID document
     * @param _did The DID identifier
     */
    function deactivateDID(string memory _did) 
        external 
        didMustExist(_did) 
        onlyDIDController(_did) 
        nonReentrant 
    {
        require(didDocuments[_did].active, "DID is already deactivated");

        didDocuments[_did].active = false;
        didDocuments[_did].updated = block.timestamp;

        emit DIDDeactivated(_did, msg.sender, block.timestamp);
    }

    /**
     * @dev Get DID document
     * @param _did The DID identifier
     * @return The DID document
     */
    function getDIDDocument(string memory _did) 
        external 
        view 
        didMustExist(_did) 
        returns (DIDDocument memory) 
    {
        return didDocuments[_did];
    }

    /**
     * @dev Get all DIDs controlled by an address
     * @param _controller The controller address
     * @return Array of DID identifiers
     */
    function getDIDsByController(address _controller) 
        external 
        view 
        returns (string[] memory) 
    {
        return controllerToDIDs[_controller];
    }

    /**
     * @dev Verify if a DID is active and controlled by the given address
     * @param _did The DID identifier
     * @param _controller The controller address
     * @return True if valid and active
     */
    function verifyDIDController(string memory _did, address _controller) 
        external 
        view 
        returns (bool) 
    {
        return didExists[_did] && 
               didDocuments[_did].active && 
               didDocuments[_did].controller == _controller;
    }
}
