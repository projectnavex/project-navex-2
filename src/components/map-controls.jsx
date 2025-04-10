import { useState } from "react";

import IntervalControls from "./interval-controls";

// Disabled temporarily
// const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
const SOURCE_CRS = 3168; // Kertau (RSO) / RSO Malaya
const DESTINATION_CRS = 4326; // WGS 84
const DEFAULT_MESSAGE = "Manually input your points.";
const SUCCESS_MESSAGE = "Sucessfully plotted MGR!";
const FAILURE_MESSAGE = "Oops, something went wrong!";
const INVALID_MGR_MESSAGE = "Oops, MGR must be an 8 digit number!";
const MISSING_API_KEY = "Oops, missing API key!";

export default function MapControls({
  handleAddMarker,
  handleDeleteAllMarkers,
  handleChangeInterval,
}) {
  let [mgr, setMgr] = useState("");
  let [statusMessage, setStatusMessage] = useState(DEFAULT_MESSAGE);

  const handleSubmit = () => {
    const apiKey = sessionStorage.getItem("userApiKey");

    if (!apiKey) {
      setStatusMessage(MISSING_API_KEY);
      return;
    }

    if (mgr.length !== 8) {
      setStatusMessage(INVALID_MGR_MESSAGE);
      return;
    }

    let easting = `6${mgr.slice(0, 4)}0`;
    let northing = `1${mgr.slice(4, 8)}0`;

    let url = `https://api.maptiler.com/coordinates/transform/` +
      `${easting},${northing}.json` +
      `?s_srs=${SOURCE_CRS}` +
      `&t_srs=${DESTINATION_CRS}` +
      `&key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(responsePayload => {
        let { x, y, z } = responsePayload.results[0];
        handleAddMarker({ lat: parseFloat(y), lng: parseFloat(x) });

        setStatusMessage(SUCCESS_MESSAGE);
        setMgr("");
      })
      .catch(error => {
        setStatusMessage(FAILURE_MESSAGE);
        console.error(error);
      });
  }

  return (
    <div className="text-center">
      <p className="mb-3">{statusMessage}</p>
      <input
        className="mr-3 rounded-3xl p-2 text-center text-black"
        type="text"
        maxLength={8}
        placeholder="Enter MGR"
        value={mgr}
        onInput={e => {
          let userInput = e.target.value;
          if (!isNaN(userInput)) {
            setMgr(userInput);
          }
        }}
      />
      <div className="mt-3 inline-block sm:mt-0">
        <button
          className="mr-3 w-20 rounded-3xl border-2 bg-green p-2 text-[#fff] duration-150 hover:bg-[#284f3e]"
          onClick={handleSubmit}
        >
          Plot
        </button>
        <button
          className="mr-3 w-20 rounded-3xl border-2 bg-red p-2 text-[#fff] duration-150 hover:bg-[#9f3b27]"
          onClick={() => {
            handleDeleteAllMarkers();
            setStatusMessage(DEFAULT_MESSAGE);
          }}
        >
          Clear
        </button>
        <IntervalControls handleChangeInterval={handleChangeInterval} />
      </div>
    </div>
  );
}
