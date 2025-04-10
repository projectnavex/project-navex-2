import { useState, useEffect } from "react";
import ApiKeyAlert from "./api-key-alert.jsx";

export default function ApiKeyManagement() {
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedApiKey = sessionStorage.getItem("userApiKey");
    setHasApiKey(!!savedApiKey);
  }, [showModal]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleClearApiKey = () => {
    sessionStorage.removeItem("userApiKey");
    setHasApiKey(false);
  };

  return (
    <div className="mb-8 mt-6 text-center">
      <p className="mb-4">
        {hasApiKey
          ? "API key set!"
          : "API key not set!"}
      </p>

      <div className="flex justify-center space-x-3">
        <button
          className="w-40 rounded-3xl border-2 bg-green p-2 text-[#fff] duration-150 hover:bg-[#284f3e]"
          onClick={handleOpenModal}
        >
          {hasApiKey ? "Update Key" : "Add API Key"}
        </button>

        {hasApiKey && (
          <button
            className="w-40 rounded-3xl border-2 bg-red p-2 text-[#fff] duration-150 hover:bg-[#9f3b27]"
            onClick={handleClearApiKey}
          >
            Remove Key
          </button>
        )}
      </div>

      {showModal && <ApiKeyAlert onClose={handleCloseModal} />}
    </div>
  );
}