import moment from "moment";
import Link from "next/link";
import React from "react";
import { controleText } from "@/functions";
import { eventInterface } from "@/interfaces";

const EventCard = ({ event }: { event: eventInterface }) => {
  return (
    <>
      <div className="flex items-center justify-center w-full">
        <img
          src={event.img_src}
          alt={event.name}
          className="w-full h-48 rounded-t-lg"
        />
      </div>
      <div className="flex flex-col p-4 ">
        <div className="flex justify-between w-full items-center">
          <span className=" text-base text-slate-400 uppercase tracking-wider font-bold">
            {event.category}
          </span>
          <span className="font-bold bg-slate-800 rounded-lg w-max px-2 text-slate-400">
            {event.date}
          </span>
        </div>

        <h2 className="text-2xl text-slate-300 font-semibold mt-4">
          {event.name}
        </h2>
        <p className="text-slate-300 mt-2 ">
          {controleText(event.description, 50)}
        </p>
        <p className="text-slate-300 mt-2 text-xs font-semibold">
          <b>Note :</b> {controleText(event.note, 40)}
        </p>
        <div className="flex w-full items-center mt-3">
          <span className="font-bold bg-slate-800 rounded-lg w-max px-2 text-slate-400">
            {moment(event.start_time).format("hh:mm A")}
          </span>
          <span className="font-bold px-2">-</span>
          <span className="font-bold bg-slate-800 rounded-lg w-max px-2 text-slate-400">
            {moment(event.end_time).format("hh:mm A")}
          </span>
        </div>

        <div className="flex justify-start ">
          <Link
            href="/in-development"
            className="w-max  px-6 uppercase tracking-wide bg-slate-800 py-3 rounded absolute bottom-4 text-slate-300 font-semibold"
          >
            view details
          </Link>
        </div>
      </div>
    </>
  );
};

export default EventCard;
