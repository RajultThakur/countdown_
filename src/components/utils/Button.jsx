import React from "react";

function Button({ Type, action, customStyle }) {
  return (
    <button
      className={`outline-none bg-transparent rounded-lg text-white ${customStyle}`}
      onClick={action}
    >
      {Type}
    </button>
  );
}

export default Button;
