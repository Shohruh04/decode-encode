import { useState, useEffect, type Dispatch, type SetStateAction } from "react";
import {
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  Edit,
  Save,
  X,
  Lock,
  Unlock,
  Hash,
} from "lucide-react";

const CameraHashTool = () => {
  const [hashedData, setHashedData] = useState("");
  const [showOriginal, setShowOriginal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState("");
  const [jsonError, setJsonError] = useState("");

  // New states for encrypt/decrypt functionality
  const [encryptInput, setEncryptInput] = useState("");
  const [encryptOutput, setEncryptOutput] = useState("");
  const [decryptInput, setDecryptInput] = useState("");
  const [decryptOutput, setDecryptOutput] = useState("");
  const [encryptError, setEncryptError] = useState("");
  const [decryptError, setDecryptError] = useState("");
  const [activeTab, setActiveTab] = useState("camera-data");

  // Your camera data (initial state)
  const [cameraData, setCameraData] = useState([]);

  // Hash configuration
  const HASH_CAMERA = {
    ALGORITHM: "aes-256-cbc",
    CODE: "base64",
    SECRET_KEY: "71brDMAH!kOm*YN39nZ#F1qq47kHM!2!",
  };

  // Real AES-256-CBC encryption using Web Crypto API
  const encrypt = async (data: unknown): Promise<string> => {
    try {
      const textToEncrypt =
        typeof data === "string" ? data : JSON.stringify(data);
      const encoder = new TextEncoder();
      const keyMaterial = encoder.encode(HASH_CAMERA.SECRET_KEY);

      // Import key for AES-CBC
      const key = await crypto.subtle.importKey(
        "raw",
        keyMaterial.slice(0, 32), // AES-256 needs 32 bytes
        { name: "AES-CBC" },
        false,
        ["encrypt"]
      );

      // Create IV (16 zeros to match your decrypt function)
      const iv = new Uint8Array(16);

      // Encrypt the data
      const encrypted = await crypto.subtle.encrypt(
        { name: "AES-CBC", iv: iv },
        key,
        encoder.encode(textToEncrypt)
      );

      // Convert to base64
      const encryptedArray = new Uint8Array(encrypted);
      let binary = "";
      for (let i = 0; i < encryptedArray.length; i++) {
        binary += String.fromCharCode(encryptedArray[i]);
      }
      return btoa(binary);
    } catch (error: unknown) {
      console.error("Encryption error:", error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error("Encryption failed: " + message);
    }
  };

  // Real AES-256-CBC decryption using Web Crypto API
  const decrypt = async (encryptedData: string): Promise<string> => {
    try {
      const keyMaterial = new TextEncoder().encode(HASH_CAMERA.SECRET_KEY);

      // Import key for AES-CBC
      const key = await crypto.subtle.importKey(
        "raw",
        keyMaterial.slice(0, 32), // AES-256 needs 32 bytes
        { name: "AES-CBC" },
        false,
        ["decrypt"]
      );

      // Create IV (16 zeros to match your encrypt function)
      const iv = new Uint8Array(16);

      // Convert base64 to ArrayBuffer
      const binaryString = atob(encryptedData);
      const encryptedArray = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        encryptedArray[i] = binaryString.charCodeAt(i);
      }

      // Decrypt the data
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-CBC", iv: iv },
        key,
        encryptedArray
      );

      // Convert back to string
      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error: unknown) {
      console.error("Decryption error:", error);
      const message = error instanceof Error ? error.message : String(error);
      throw new Error("Decryption failed: " + message);
    }
  };

  // Generate hash on component mount and when camera data changes
  useEffect(() => {
    const generateHash = async () => {
      try {
        const hash = await encrypt(cameraData);
        setHashedData(hash);
      } catch (error) {
        setHashedData("Hash generation failed");
      }
    };
    generateHash();
  }, [cameraData]);

  // Initialize edited data when editing starts
  useEffect(() => {
    if (isEditing) {
      setEditedData(JSON.stringify(cameraData, null, 2));
      setJsonError("");
    }
  }, [isEditing, cameraData]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleDataChange = (value: string) => {
    setEditedData(value);
    setJsonError("");

    try {
      JSON.parse(value);
      setJsonError("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setJsonError("Invalid JSON format: " + message);
    }
  };

  const handleSaveChanges = () => {
    try {
      const parsedData = JSON.parse(editedData);
      setCameraData(parsedData);
      setIsEditing(false);
      setJsonError("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setJsonError("Cannot save: " + message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setJsonError("");
  };

  // Encrypt any text
  const handleEncrypt = async () => {
    if (!encryptInput.trim()) {
      setEncryptError("Please enter text to encrypt");
      return;
    }

    try {
      const encrypted = await encrypt(encryptInput);
      setEncryptOutput(encrypted);
      setEncryptError("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setEncryptError(message);
    }
  };

  // Decrypt any text
  const handleDecrypt = async () => {
    if (!decryptInput.trim()) {
      setDecryptError("Please enter text to decrypt");
      return;
    }

    try {
      const decrypted = await decrypt(decryptInput);
      setDecryptOutput(decrypted);
      setDecryptError("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      setDecryptError(message);
    }
  };

  // Copy function for any text
  const copyText = async (
    text: string,
    setCopiedState: Dispatch<SetStateAction<boolean>>
  ): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const copyToClipboard = async () => {
    await copyText(hashedData, setCopied);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Camera Data Hash Tool
      </h1>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab("camera-data")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "camera-data"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Hash size={16} />
            <span>Camera Data Hash</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("encrypt")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "encrypt"
              ? "border-green-500 text-green-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Lock size={16} />
            <span>Encrypt</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("decrypt")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "decrypt"
              ? "border-red-500 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center space-x-2">
            <Unlock size={16} />
            <span>Decrypt</span>
          </div>
        </button>
      </div>

      {/* Camera Data Tab */}
      {activeTab === "camera-data" && (
        <div className="space-y-6">
          {/* Camera Data Editor/Viewer Section */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Camera Data
              </h2>
              <div className="flex items-center space-x-2">
                {!isEditing && (
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    {showOriginal ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span>{showOriginal ? "Hide" : "Show"}</span>
                  </button>
                )}

                <button
                  onClick={handleEditToggle}
                  className={`flex items-center space-x-2 px-3 py-1 rounded text-sm transition-colors ${
                    isEditing
                      ? "bg-gray-600 text-white hover:bg-gray-700"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {isEditing ? <X size={16} /> : <Edit size={16} />}
                  <span>{isEditing ? "Cancel" : "Edit"}</span>
                </button>
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editedData}
                  onChange={(e) => handleDataChange(e.target.value)}
                  className={`w-full h-80 p-4 border rounded font-mono text-sm resize-none focus:outline-none focus:ring-2 ${
                    jsonError
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Edit your camera data JSON here..."
                />

                {jsonError && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertTriangle size={16} />
                    <span>{jsonError}</span>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    disabled={!!jsonError}
                    className={`flex items-center space-x-2 px-4 py-2 rounded transition-colors ${
                      jsonError
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <Save size={16} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            ) : (
              showOriginal && (
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify(cameraData, null, 2)}
                </pre>
              )
            )}
          </div>

          {/* Hashed Data Section */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-700">
                Hashed Data
              </h2>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                <Copy size={16} />
                <span>{copied ? "Copied!" : "Copy Hash"}</span>
              </button>
            </div>

            <div className="bg-gray-100 p-4 rounded">
              <textarea
                value={hashedData}
                readOnly
                className="w-full h-32 text-sm font-mono bg-transparent border-none resize-none focus:outline-none"
                placeholder="Generating hash..."
              />
            </div>

            <div className="mt-2 text-sm text-gray-600">
              Hash length: {hashedData.length} characters
            </div>
          </div>
        </div>
      )}

      {/* Encrypt Tab */}
      {activeTab === "encrypt" && (
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Encrypt Any Text
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Text to Encrypt:
                </label>
                <textarea
                  value={encryptInput}
                  onChange={(e) => setEncryptInput(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter any text to encrypt..."
                />
              </div>

              <button
                onClick={handleEncrypt}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                <Lock size={16} />
                <span>Encrypt</span>
              </button>

              {encryptError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertTriangle size={16} />
                  <span>{encryptError}</span>
                </div>
              )}

              {encryptOutput && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-600">
                      Encrypted Result:
                    </label>
                    <button
                      onClick={() => copyText(encryptOutput, setCopied)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Copy size={14} />
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                  <textarea
                    value={encryptOutput}
                    readOnly
                    className="w-full h-32 p-3 bg-gray-100 border border-gray-300 rounded text-sm font-mono resize-none"
                  />
                  <div className="text-sm text-gray-600">
                    Length: {encryptOutput.length} characters
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decrypt Tab */}
      {activeTab === "decrypt" && (
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Decrypt Encrypted Text
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Encrypted Text:
                </label>
                <textarea
                  value={decryptInput}
                  onChange={(e) => setDecryptInput(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                  placeholder="Paste encrypted text here..."
                />
              </div>

              <button
                onClick={handleDecrypt}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                <Unlock size={16} />
                <span>Decrypt</span>
              </button>

              {decryptError && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertTriangle size={16} />
                  <span>{decryptError}</span>
                </div>
              )}

              {decryptOutput && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-600">
                      Decrypted Result:
                    </label>
                    <button
                      onClick={() => copyText(decryptOutput, setCopied)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Copy size={14} />
                      <span>{copied ? "Copied!" : "Copy"}</span>
                    </button>
                  </div>
                  <textarea
                    value={decryptOutput}
                    readOnly
                    className="w-full h-32 p-3 bg-gray-100 border border-gray-300 rounded resize-none"
                  />
                  <div className="text-sm text-gray-600">
                    Length: {decryptOutput.length} characters
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraHashTool;
