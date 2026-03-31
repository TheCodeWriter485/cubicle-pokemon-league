import Image from "next/image";
import Navbar from "./navbar";
import NewsMarquee from "./marquee";

export default function Header()
{
  return (
    <header>

      <div className="headerContent">

        <div className="logoContainer">
          <div className="logoBackground">
            <img className="logoImg" src="/CubicleLogo.svg" alt="Cubical Logo" />

          </div>
        </div>

        <div className="topNav">
          <Navbar />
        </div>

      </div>

      <NewsMarquee />
    </header>
  );
}