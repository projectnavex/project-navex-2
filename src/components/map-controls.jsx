import jsonp from "jsonp";
import { useState } from "react";

import IntervalControls from "./interval-controls";

const SOURCE_EPSG = 3168; // Kertau (RSO) / RSO Malaya
const DESTINATION_EPSG = 4326; // WGS 84
const DEFAULT_MESSAGE = "Manually input your points.";
const SUCCESS_MESSAGE = "Sucessfully plotted MGR!";

export default function MapControls({
  handleAddMarker,
  handleDeleteAllMarkers,
  handleChangeInterval,
}) {
  let [mgr, setMgr] = useState("");
  let [statusMessage, setStatusMessage] = useState(DEFAULT_MESSAGE);

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
      <button
        className="mr-3 w-20 rounded-3xl border-2 bg-green p-2 text-[#fff] duration-150 hover:bg-[#284f3e]"
        onClick={() => {
          // EPSG.io uses JSONP to bypass CORS.
          let easting = `6${mgr.slice(0, 4)}0`;
          let northing = `1${mgr.slice(4, 8)}0`;
          let url = `https://epsg.io/trans?x=${easting}&y=${northing}&s_srs=${SOURCE_EPSG}&t_srs=${DESTINATION_EPSG}`;
          jsonp(url, null, (err, latLng) => {
            let { x, y, z } = latLng;
            handleAddMarker({ lat: parseFloat(y), lng: parseFloat(x) });
          });
          setMgr("");
          setStatusMessage(SUCCESS_MESSAGE);
        }}
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
  );
}
