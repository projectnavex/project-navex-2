import { Link, Outlet } from "react-router-dom";

export default function Root() {
  return (
    <div className="flex min-h-screen flex-col bg-[#292929] font-mono text-white">
      <div className="flex-grow py-8">
        <h1 className="mb-4 text-center font-['Major_Mono_Display'] text-4xl text-[#6da48d]">
          <Link to={"/"}>Project Navex</Link>
        </h1>
        <p className="mb-5 text-center">Generate your NDS with a few clicks!</p>
        <Outlet />
      </div>
      <footer className="bg-black pb-10 pt-6 text-center">
        <h2 className="m-4 text-xl font-bold">ORD Lo.</h2>
        <p className="text-xs">
          <a href="https://github.com/Airiinnn">Alex</a> |{" "}
          <a href="https://github.com/wuihee">Wuihee</a> |{" "}
          <a href="mailto: projectnavex@gmail.com">Contact</a> | <Link></Link>
          <Link to={"/donate"}>Support Us</Link>
        </p>
      </footer>
    </div>
  );
}
