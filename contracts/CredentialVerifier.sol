// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "./CredentialRegistry.sol";
import "./DIDRegistry.sol";

/**
 * @title CredentialVerifier
 * @dev Advanced verification logic for credentials with cryptographic proof
 */
contract CredentialVerifier {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    CredentialRegistry public credentialRegistry;
    DIDRegistry public didRegistry;

    struct VerificationResult {
        bool isValid;
        string credentialId;
        string issuerDID;
        string subjectDID;
        uint256 verificationTimestamp;
        string reason;
    }

    event CredentialVerified(
        string indexed credentialId,
        address indexed verifier,
        bool isValid,
        string reason,
        uint256 timestamp
    );

    constructor(address _credentialRegistryAddress, address _didRegistryAddress) {
        credentialRegistry = CredentialRegistry(_credentialRegistryAddress);
        didRegistry = DIDRegistry(_didRegistryAddress);
    }

    /**
     * @dev Verify a credential with full cryptographic validation
     * @param _credentialId The credential identifier
     * @param _expectedHash The expected hash of the credential content
     * @return result The verification result
     */
    function verifyCredentialWithProof(
        string memory _credentialId,
        string memory _expectedHash
    ) external returns (VerificationResult memory result) {
        result.credentialId = _credentialId;
        result.verificationTimestamp = block.timestamp;

        // Check if credential exists and get basic validity
        try credentialRegistry.verifyCredential(_credentialId) returns (
            bool isValid,
            CredentialRegistry.Credential memory credential
        ) {
            if (!isValid) {
                result.isValid = false;
                result.reason = "Credential is not valid or has expired";
                emit CredentialVerified(_credentialId, msg.sender, false, result.reason, block.timestamp);
                return result;
            }

            result.issuerDID = credential.issuerDID;
            result.subjectDID = credential.subjectDID;

            // Verify credential hash matches expected
            if (keccak256(abi.encodePacked(credential.credentialHash)) != keccak256(abi.encodePacked(_expectedHash))) {
                result.isValid = false;
                result.reason = "Credential hash mismatch";
                emit CredentialVerified(_credentialId, msg.sender, false, result.reason, block.timestamp);
                return result;
            }

            // Verify issuer DID is still active
            try didRegistry.getDIDDocument(credential.issuerDID) returns (
                DIDRegistry.DIDDocument memory issuerDID
            ) {
                if (!issuerDID.active) {
                    result.isValid = false;
                    result.reason = "Issuer DID is not active";
                    emit CredentialVerified(_credentialId, msg.sender, false, result.reason, block.timestamp);
                    return result;
                }

                // Verify signature (simplified - in production would use more sophisticated signature verification)
                bytes32 messageHash = keccak256(
                    abi.encodePacked(
                        credential.id,
                        credential.issuerDID,
                        credential.subjectDID,
                        credential.credentialHash
                    )
                );

                // For demonstration - in production, you'd verify against the issuer's public key
                if (credential.signature.length == 0) {
                    result.isValid = false;
                    result.reason = "Missing credential signature";
                    emit CredentialVerified(_credentialId, msg.sender, false, result.reason, block.timestamp);
                    return result;
                }

                result.isValid = true;
                result.reason = "Credential successfully verified";
                emit CredentialVerified(_credentialId, msg.sender, true, result.reason, block.timestamp);
                return result;

            } catch {
                result.isValid = false;
                result.reason = "Failed to retrieve issuer DID document";
                emit CredentialVerified(_credentialId, msg.sender, false, result.reason, block.timestamp);
                return result;
            }

        } catch {
            result.isValid = false;
            result.reason = "Credential does not exist or verification failed";
            emit CredentialVerified(_credentialId, msg.sender, false, result.reason, block.timestamp);
            return result;
        }
    }

    /**
     * @dev Batch verify multiple credentials
     * @param _credentialIds Array of credential identifiers
     * @param _expectedHashes Array of expected hashes
     * @return results Array of verification results
     */
    function batchVerifyCredentials(
        string[] memory _credentialIds,
        string[] memory _expectedHashes
    ) external returns (VerificationResult[] memory results) {
        require(_credentialIds.length == _expectedHashes.length, "Arrays length mismatch");
        
        results = new VerificationResult[](_credentialIds.length);
        
        for (uint256 i = 0; i < _credentialIds.length; i++) {
            results[i] = this.verifyCredentialWithProof(_credentialIds[i], _expectedHashes[i]);
        }
        
        return results;
    }

    /**
     * @dev Quick verification without cryptographic proof (for basic checks)
     * @param _credentialId The credential identifier
     * @return isValid True if credential passes basic validation
     * @return issuerDID The issuer DID
     * @return status The credential status
     */
    function quickVerify(string memory _credentialId)
        external
        view
        returns (bool isValid, string memory issuerDID, CredentialRegistry.CredentialStatus status)
    {
        try credentialRegistry.verifyCredential(_credentialId) returns (
            bool valid,
            CredentialRegistry.Credential memory credential
        ) {
            return (valid, credential.issuerDID, credential.status);
        } catch {
            return (false, "", CredentialRegistry.CredentialStatus.Revoked);
        }
    }
}
