import { useState, useEffect } from "react";

export default function ApiKeyAlert({ onClose }) {
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedApiKey = sessionStorage.getItem("userApiKey");

    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSaveKey = () => {
    if (!apiKey.trim() || !isValidKey(apiKey)) {
      setMessage("Please enter a valid API key");
      return;
    }

    sessionStorage.setItem("userApiKey", apiKey);
    setMessage("API key saved successfully!");
  };

  const handleDismiss = () => {
    if (onClose) {
      onClose();
    }
  };

  const isValidKey = (apiKey) => {
    return apiKey.length >= 16 && apiKey.length <= 32;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="mx-auto max-w-md rounded-lg bg-gray-800 p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">API Limit Reached</h3>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-300">
          To continue using all features, please enter your own API key below.
          This key will only be stored for your current session.
        </p>

        <div className="mb-3">
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="w-full rounded border border-gray-600 bg-gray-700 p-2 text-white"
          />
        </div>

        {message && (
          <p className={`mb-3 text-sm ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleSaveKey}
            className="rounded-md bg-green px-3 py-1 text-sm text-white hover:bg-[#5c8f7a] disabled:opacity-50"
          >
            Save API Key
          </button>
        </div>

        <div className="mt-3 text-xs text-gray-400">
          <a
            href="https://docs.maptiler.com/cloud/api/authentication-key/#get-key"
            target="_blank"
            className="text-[#6da48d] hover:underline"
          >
            How do I get an API key?
          </a>
        </div>
      </div>
    </div>
  );
}
