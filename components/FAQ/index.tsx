"use client";
import React, { useState } from "react";
import json from "@/JSON/data.json";
import Image from "next/image";

const FAQPage = () => {
  const [active, setActive] = useState(0);

  return (
    <div className="container mx-auto ">
      <div id="accordion-collapse" data-accordion="collapse">
        <h1 className="text-4xl font-bold text-center text-gray-200">
          Frequently asked questions
        </h1>
        <h4 className="text-base text-gray-300 font-medium text-center my-2">
          Here are a few of the questions we get the most.
        </h4>
        <div className="overflow-y-scroll pb-4 faq-questions scrollbar-width-none ">
          {json.faqs.map((faq, index) => (
            <div key={index} onClick={() => setActive(index)}>
              <h2 id="accordion-collapse-heading-1">
                <button
                  type="button"
                  className={`${
                    active == index ? "bg-gray-800" : ""
                  } flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-300 border border-b-0 border-gray-200 rounded-t-xl  dark:border-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3`}
                  data-accordion-target="#accordion-collapse-body-1"
                  aria-expanded="true"
                  aria-controls="accordion-collapse-body-1"
                >
                  <span>{faq.question}</span>
                  <Image
                    src="/svg/accordion.svg"
                    width={20}
                    height={20}
                    alt="accordion"
                    className={active == index ? "rotate-270" : "rotate-180"}
                  />
                </button>
                <div
                  id="accordion-collapse-body-1"
                  className={`${
                    active == index
                      ? "h-full opacity-100 transition-all ease-in delay-75       "
                      : "h-0 opacity-0"
                  } `}
                  aria-labelledby="accordion-collapse-heading-1"
                >
                  <div className="p-5 border border-b-0 border-gray-200 dark:border-gray-700 dark:bg-gray-900 w-full">
                    <p className="mb-2 text-gray-500 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
