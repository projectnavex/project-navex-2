import { useMap } from "@vis.gl/react-google-maps";
import { useState } from "react";

export default function TrainingAreaDropdown({ trainingAreas }) {
  let map = useMap();
  let [trainingArea, setTrainingArea] = useState(trainingAreas.lorongAsrama);
  let [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <div
        className="mx-auto flex w-52 cursor-pointer select-none flex-row justify-between rounded-lg bg-[#2a2f3b] p-5 duration-150 hover:bg-[#323741]"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span>{trainingArea.name}</span>
        <svg
          className={`${menuOpen ? "rotate-180 transform" : null} relative top-[2px] h-5 w-5 transition-transform`}
          fill="currentColor"
        >
          <polygon points="5,7 10,12 15,7" />
        </svg>
      </div>
      {menuOpen && (
        <ul className="absolute left-1/2 z-40 w-52 translate-x-[-50%] rounded-lg bg-[#323741] p-2 shadow-lg">
          {Object.values(trainingAreas).map(area => (
            <li
              className={`${area.name === trainingArea.name ? "bg-[#23242a]" : null} cursor-pointer rounded-lg p-3 duration-100 hover:bg-[#2a2d35]`}
              key={area.name}
              onClick={() => {
                setTrainingArea(area);
                setMenuOpen(false);
                map.setZoom(15);
                map.panTo(area.location);
              }}
            >
              {area.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
