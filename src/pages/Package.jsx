import React from "react";
import { motion } from "framer-motion";
import { GoDot } from "react-icons/go";

const Package = (props) => {
  const { pack, title, price, features, description } = props;
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-[320px] h-auto p-4 flex flex-col items-start justify-between shadow-sm shadow-indigo-500 border-2 border-red-500 rounded-xl border-opacity-20 gap-6"
    >
      <h1 className="text-2xl font-bold">{pack}</h1>
      <p className="italic text-xs">{description}</p>
      <div className="w-full flex flex-row  gap-2 items-center justify-between">
        <p>{title}</p>
        <h1 className="text-xl font-semibold">${price} </h1>
      </div>
      {features.map((feature) => {
        return <p key={feature.index} className="flex items-center flex-row gap-2"> <GoDot/> {feature}</p>;
      })}
      <button className="w-full text-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-500">
        Start here
      </button>
    </motion.div>
  );
};

export default Package;
