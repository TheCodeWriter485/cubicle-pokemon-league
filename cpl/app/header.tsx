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
            <Image src="/Cubical.png" alt="Cubical Logo" height={ 200 } width={ 220 } />
          </div>
        </div>

        <div className="topNav">
          <Navbar />
        </div>

      </div>

      <NewsMarquee />
    </header>
  );