// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./DIDRegistry.sol";

/**
 * @title CredentialRegistry
 * @dev Registry for managing verifiable credentials
 */
contract CredentialRegistry is Ownable, ReentrancyGuard {
    DIDRegistry public didRegistry;

    enum CredentialStatus { Active, Revoked, Suspended }

    struct Credential {
        string id;
        string issuerDID;
        string subjectDID;
        string credentialType;
        string credentialHash;
        string metadataURI;
        uint256 issuanceDate;
        uint256 expirationDate;
        CredentialStatus status;
        bytes signature;
    }

    mapping(string => Credential) public credentials;
    mapping(string => bool) public credentialExists;
    mapping(string => string[]) public issuerCredentials;
    mapping(string => string[]) public subjectCredentials;
    mapping(string => uint256) public credentialCounts;

    event CredentialIssued(
        string indexed credentialId,
        string indexed issuerDID,
        string indexed subjectDID,
        string credentialType,
        uint256 timestamp
    );

    event CredentialRevoked(
        string indexed credentialId,
        string indexed issuerDID,
        uint256 timestamp
    );

    event CredentialStatusUpdated(
        string indexed credentialId,
        CredentialStatus oldStatus,
        CredentialStatus newStatus,
        uint256 timestamp
    );

    modifier credentialMustExist(string memory _credentialId) {
        require(credentialExists[_credentialId], "Credential does not exist");
        _;
    }

    modifier onlyIssuer(string memory _credentialId) {
        require(
            didRegistry.verifyDIDController(
                credentials[_credentialId].issuerDID, 
                msg.sender
            ),
            "Not authorized to modify this credential"
        );
        _;
    }

    constructor(address _didRegistryAddress) {
        didRegistry = DIDRegistry(_didRegistryAddress);
    }

    /**
     * @dev Issue a new verifiable credential
     * @param _credentialId Unique identifier for the credential
     * @param _issuerDID DID of the credential issuer
     * @param _subjectDID DID of the credential subject
     * @param _credentialType Type of credential (e.g., "degree", "certificate")
     * @param _credentialHash Hash of the credential content
     * @param _metadataURI URI pointing to credential metadata
     * @param _expirationDate Expiration timestamp (0 for no expiration)
     * @param _signature Digital signature of the credential
     */
    function issueCredential(
        string memory _credentialId,
        string memory _issuerDID,
        string memory _subjectDID,
        string memory _credentialType,
        string memory _credentialHash,
        string memory _metadataURI,
        uint256 _expirationDate,
        bytes memory _signature
    ) external nonReentrant {
        require(!credentialExists[_credentialId], "Credential already exists");
        require(bytes(_credentialId).length > 0, "Credential ID cannot be empty");
        require(
            didRegistry.verifyDIDController(_issuerDID, msg.sender),
            "Invalid issuer DID or not authorized"
        );
        require(
            _expirationDate == 0 || _expirationDate > block.timestamp,
            "Invalid expiration date"
        );

        Credential memory newCredential = Credential({
            id: _credentialId,
            issuerDID: _issuerDID,
            subjectDID: _subjectDID,
            credentialType: _credentialType,
            credentialHash: _credentialHash,
            metadataURI: _metadataURI,
            issuanceDate: block.timestamp,
            expirationDate: _expirationDate,
            status: CredentialStatus.Active,
            signature: _signature
        });

        credentials[_credentialId] = newCredential;
        credentialExists[_credentialId] = true;
        issuerCredentials[_issuerDID].push(_credentialId);
        subjectCredentials[_subjectDID].push(_credentialId);
        credentialCounts[_credentialType]++;

        emit CredentialIssued(
            _credentialId,
            _issuerDID,
            _subjectDID,
            _credentialType,
            block.timestamp
        );
    }

    /**
     * @dev Revoke a credential
     * @param _credentialId The credential identifier
     */
    function revokeCredential(string memory _credentialId)
        external
        credentialMustExist(_credentialId)
        onlyIssuer(_credentialId)
        nonReentrant
    {
        require(
            credentials[_credentialId].status == CredentialStatus.Active,
            "Credential is not active"
        );

        CredentialStatus oldStatus = credentials[_credentialId].status;
        credentials[_credentialId].status = CredentialStatus.Revoked;

        emit CredentialRevoked(_credentialId, credentials[_credentialId].issuerDID, block.timestamp);
        emit CredentialStatusUpdated(_credentialId, oldStatus, CredentialStatus.Revoked, block.timestamp);
    }

    /**
     * @dev Update credential status
     * @param _credentialId The credential identifier
     * @param _newStatus The new status
     */
    function updateCredentialStatus(string memory _credentialId, CredentialStatus _newStatus)
        external
        credentialMustExist(_credentialId)
        onlyIssuer(_credentialId)
        nonReentrant
    {
        CredentialStatus oldStatus = credentials[_credentialId].status;
        require(oldStatus != _newStatus, "Status is already set to this value");

        credentials[_credentialId].status = _newStatus;

        emit CredentialStatusUpdated(_credentialId, oldStatus, _newStatus, block.timestamp);
    }

    /**
     * @dev Verify a credential
     * @param _credentialId The credential identifier
     * @return isValid True if credential is valid and active
     * @return credential The credential data
     */
    function verifyCredential(string memory _credentialId)
        external
        view
        credentialMustExist(_credentialId)
        returns (bool isValid, Credential memory credential)
    {
        credential = credentials[_credentialId];
        
        // Check if credential is active
        if (credential.status != CredentialStatus.Active) {
            return (false, credential);
        }

        // Check if credential has expired
        if (credential.expirationDate != 0 && credential.expirationDate <= block.timestamp) {
            return (false, credential);
        }

        // Verify issuer DID is still active
        try didRegistry.getDIDDocument(credential.issuerDID) returns (DIDRegistry.DIDDocument memory didDoc) {
            if (!didDoc.active) {
                return (false, credential);
            }
        } catch {
            return (false, credential);
        }

        return (true, credential);
    }

    /**
     * @dev Get credential by ID
     * @param _credentialId The credential identifier
     * @return The credential data
     */
    function getCredential(string memory _credentialId)
        external
        view
        credentialMustExist(_credentialId)
        returns (Credential memory)
    {
        return credentials[_credentialId];
    }

    /**
     * @dev Get credentials issued by a DID
     * @param _issuerDID The issuer DID
     * @return Array of credential IDs
     */
    function getCredentialsByIssuer(string memory _issuerDID)
        external
        view
        returns (string[] memory)
    {
        return issuerCredentials[_issuerDID];
    }

    /**
     * @dev Get credentials for a subject DID
     * @param _subjectDID The subject DID
     * @return Array of credential IDs
     */
    function getCredentialsBySubject(string memory _subjectDID)
        external
        view
        returns (string[] memory)
    {
        return subjectCredentials[_subjectDID];
    }

    /**
     * @dev Get count of credentials by type
     * @param _credentialType The credential type
     * @return The count
     */
    function getCredentialCountByType(string memory _credentialType)
        external
        view
        returns (uint256)
    {
        return credentialCounts[_credentialType];
    }
}
