import "./globals.css";
import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";

export default function NewsMarquee() {
  return (<div>   
  <Marquee>
    <Image
              src="/Cubical.png"
              alt="Cubical Logo"
              width={70}
              height={20}
              style={{margin:"0 auto", marginTop: "2rem"}}
              priority
            />
  </Marquee>
</div>);  
}
