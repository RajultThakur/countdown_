import React from "react";

function CounterBox({ title, customRef }) {
  return (
    <div className="counter-box shadow-lg rounded-xl text-white p-2 flex items-center justify-center flex-col w-20 h-20 max-md:w-14 max-md:h-14 ">
      <input
        className="w-full h-full text-4xl max-md:text-2xl text-center bg-transparent"
        type="number"
        ref={customRef}
        defaultValue={0}
      />
      <p className="text-gray-500 font-semibold text-lg max-md:text-sm">
        {title}
      </p>
    </div>
  );
}

export default CounterBox;
