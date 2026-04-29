export default function TileDropdown({ providers, tile, setTile, openDropdown, setOpenDropdown }) {
  let isOpen = openDropdown === "tile";

  return (
    <div className="relative mx-auto w-52">
      <div
        className="flex cursor-pointer select-none flex-row justify-between rounded-lg bg-[#2a2f3b] p-5 duration-150 hover:bg-[#323741]"
        onClick={() => setOpenDropdown(isOpen ? null : "tile")}
      >
        <span>{tile.name}</span>
        <svg
          className={`${isOpen ? "rotate-180 transform" : null} relative top-[2px] h-5 w-5 transition-transform`}
          fill="currentColor"
        >
          <polygon points="5,7 10,12 15,7" />
        </svg>
      </div>
      {isOpen && (
        <ul className="absolute left-0 right-0 z-40 rounded-lg bg-[#323741] p-2 shadow-lg">
          {providers.map(provider => (
            <li
              className={`${provider.id === tile.id ? "bg-[#23242a]" : null} cursor-pointer rounded-lg p-3 duration-100 hover:bg-[#2a2d35]`}
              key={provider.id}
              onClick={() => {
                setTile(provider);
                setOpenDropdown(null);
              }}
            >
              {provider.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
