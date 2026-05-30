import { useState } from "react";

export const Button = () => {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount((c) => c + 1)} type="button">
      {count}
    </button>
  );
};
