import { useState } from "react";

export default function IntervalControls({ handleChangeInterval }) {
  let [selected, setSelected] = useState("day");

  return (
    <div className="inline-block select-none text-center">
      <input
        className="fixed w-0 opacity-0"
        onChange={e => {
          handleChangeInterval(e.target.value);
          setSelected("day");
        }}
        type="radio"
        name="radio-group"
        id="day"
        value={100}
        defaultChecked
      />
      <label
        htmlFor="day"
        className={`inline-block w-1/2 cursor-pointer rounded-l-3xl px-3 py-2 transition duration-150 ${selected === "day" ? "bg-green text-[#fff]" : "bg-[#fff] text-black hover:bg-white"}`}
      >
        100m
      </label>
      <input
        className="fixed w-0 opacity-0"
        onChange={e => {
          handleChangeInterval(e.target.value);
          setSelected("night");
        }}
        type="radio"
        name="radio-group"
        id="night"
        value={50}
      />
      <label
        htmlFor="night"
        className={`inline-block w-1/2 cursor-pointer rounded-r-3xl px-3 py-2 transition duration-150 ${selected === "night" ? "bg-green text-[#fff]" : "bg-[#fff] text-black hover:bg-white"}`}
      >
        50m
      </label>
    </div>
  );
}
