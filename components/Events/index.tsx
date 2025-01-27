"use client";
import React from "react";
import json from "@/JSON/data.json";
import EventCard from "./EventCard";
import { motion } from "framer-motion";

const UpcomingEventsComp = () => {
  return (
    <div className="container mx-auto ">
      <h1 className="text-4xl font-bold text-center text-gray-200">
        Upcoming Events
      </h1>
      <h4 className="text-base text-gray-300 font-medium text-center my-2">
        Stay in the Loop with What’s Happening Next!
      </h4>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.5 } }, // Staggering animation
        }}
        className="grid grid-cols-4 px-2 gap-10 py-10 events-card overflow-y-scroll scrollbar-width-none event-cards-container mt-10"
      >
        {json.events.map((event, index) => (
          <motion.div
            key={event.name}
            className="event-card  relative h-[480px]"
            initial={{ opacity: 0, y: 30 }} // Initial state (hidden and slightly shifted down)
            animate={{ opacity: 1, y: 0 }} // Final state (visible and positioned correctly)
            transition={{
              duration: 0.8,
              delay: index * 0.5, // Delay each card animation based on its index
            }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default UpcomingEventsComp;
