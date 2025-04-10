import { useEffect, useState } from "react";

// Disabled temporarily
// const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY;
const SOURCE_CRS = 4326; // WGS 84
const DESTINATION_CRS = 3168; // Kertau (RSO) / RSO Malaya
const FAILURE_MESSAGE = "Oops, something went wrong! Please make sure you have your API key set correctly.";

export default function NDS({ markers, interval }) {
  let [ndsData, setNdsData] = useState([]);
  let [loading, setLoading] = useState(false);
  let [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const apiKey = sessionStorage.getItem("userApiKey");

    if (!apiKey) {
      setStatusMessage(FAILURE_MESSAGE);
      return;
    }

    if (markers.length < 2) {
      return;
    }

    setLoading(true);
    let latLngs = markers
      .reduce((accumulator, marker) => {
        let { lat, lng } = marker.position;
        return accumulator + `${lng},${lat};`;
      }, "")
      .slice(0, -1);
    let url = `https://api.maptiler.com/coordinates/transform/${latLngs}.json` +
      `?s_srs=${SOURCE_CRS}` +
      `&t_srs=${DESTINATION_CRS}` +
      `&key=${apiKey}`;

    fetch(url)
      .then(response => response.json())
      .then(responsePayload => {
        setStatusMessage("");
        setLoading(false);

        const mgrs = responsePayload.results;

        // Convert all MGRs to floating point numbers.
        for (let i = 0; i < mgrs.length; i++) {
          let { x, y } = mgrs[i];
          mgrs[i] = {
            x: parseFloat(x.toString().slice(1, 5)),
            y: parseFloat(y.toString().slice(1, 5)),
          };
        }

        let data = [];
        for (let i = 1; i < mgrs.length; i++) {
          let x = mgrs[i - 1].x;
          let y = mgrs[i - 1].y;
          let xDiff = mgrs[i].x - x;
          let yDiff = mgrs[i].y - y;
          let distance = (xDiff ** 2 + yDiff ** 2) ** 0.5 / (interval / 10);
          let azimuth = getAzimuth(xDiff, yDiff);
          let xIncrement = xDiff / distance;
          let yIncrement = yDiff / distance;

          for (let j = 0; j < Math.floor(distance); j++) {
            let start = { x, y };
            x += xIncrement;
            y += yIncrement;
            let end = { x, y };
            data.push({ start, end, azimuth, interval, count: j });
          }

          let remainder = distance - Math.floor(distance);
          let start = { x, y };
          x += remainder * xIncrement;
          y += remainder * yIncrement;
          let end = { x, y };
          data.push({
            start,
            end,
            azimuth,
            interval: Math.round(remainder * interval),
            count: 0,
          });
        }

        setNdsData(data);
      })
      .catch(error => {
        setStatusMessage(FAILURE_MESSAGE);
        console.error(error);
      });
  }, [markers, interval]);

  return (
    <>
      {statusMessage && <p className="text-center mt-5">{statusMessage}</p>}
      <table
        className={`mx-auto my-7 w-11/12 border-2 border-solid border-black ${loading && "opacity-50"}`}
      >
        <thead className="bg-green">
          <tr>
            <TableCell>No.</TableCell>
            <TableCell>Start MGR</TableCell>
            <TableCell>End MGR</TableCell>
            <TableCell>Mil</TableCell>
            <TableCell>Dist.</TableCell>
          </tr>
        </thead>
        <tbody>
          {ndsData.map(({ start, end, azimuth, interval, count }, index) => (
            <tr
              key={index}
              className={`${index % 2 == 0 && "bg-[#212121]"} ${count == 0 && "text-yellow-100"}`}
            >
              <TableCell>{index}</TableCell>
              <TableCell>{getFormattedMgr(start)}</TableCell>
              <TableCell>{getFormattedMgr(end)}</TableCell>
              <TableCell>{azimuth}</TableCell>
              <TableCell>{interval}</TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function TableCell({ count, children }) {
  return (
    <td
      className={`border-2 border-solid border-black text-center ${count == 0 ? "text-yellow-100" : ""}`}
    >
      {children}
    </td>
  );
}

function getFormattedMgr(mgr) {
  return Math.round(mgr.x).toString() + " " + Math.round(mgr.y).toString();
}

function getAzimuth(xDiff, yDiff) {
  if (xDiff === 0) {
    // Vertical
    if (yDiff > 0) {
      // Upwards
      return 6400;
    } else {
      // Downwards
      return 3200;
    }
  } else {
    let angle = Math.atan(yDiff / xDiff);
    if (xDiff > 0) {
      // 1st & 4th quadrant
      return Math.floor(1600 - (angle / (2 * Math.PI)) * 6400);
    } else {
      // 2nd & 3rd quadrant
      return Math.floor(4800 - (angle / (2 * Math.PI)) * 6400);
    }
  }
}
