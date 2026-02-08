import "./globals.css";
import React from "react";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import Papa from "papaparse";
import file from "../public/schedule.csv"

export default function NewsMarquee() {
   function cardSched(){
     const date = new Date();
     const scheduleMap = {
         1: new Date("2026-1-4"),
         2: new Date("2026-1-11"),
         3: new Date("2026-1-18"),
         4: new Date("2026-1-25"),
      }
      
      Papa.parse(file, {})
    

   }
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
