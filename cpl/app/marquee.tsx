import React from "react";
import Marquee from "react-fast-marquee";
//import file from "../public/schedule.csv";

export default function NewsMarquee() {

  return (
    <div className="chyron">
      <Marquee>
        This is a test announcement for the news area
      </Marquee>
    </div>);
}