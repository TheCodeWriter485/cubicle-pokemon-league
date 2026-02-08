import NewsMarquee from "./marquee";
import Navbar from "./navbar";
import Image from "next/image";

export default function Header(){
    return (
      <header>
        <Image
          src="/Cubical.png"
          alt="Cubical Logo"
          width={200}
          height={20}
          style={{margin:"0 auto", marginTop: "2rem"}}
          priority
        />
        <NewsMarquee />
        <Navbar />
      </header>
    );
}