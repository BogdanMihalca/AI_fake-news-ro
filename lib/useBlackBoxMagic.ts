import { useState } from "react";

const useBlackBoxMagic = () => {
  const [result, setResult] = useState<{ label: string; score: any }[]>([]);
  const [ready, setReady] = useState<boolean | null>(null);

  const blackboxify = async (text: string) => {
    setResult([]);
    if (!text) {
      console.log("%c Blackboxify [ERROR]: test missing", "color: red");
      return;
    }
    if (ready === null) setReady(false);

    try {
      console.log(
        "%c Blackboxify [INFO]: Attempting to get result",
        "color: yellow",
        text
      );
      const response = await fetch(
        `/api/blackboxmagic?text=${encodeURIComponent(text)}`
      );
      const json = await response.json();
      setResult(json);
      console.log(
        "%c Blackboxify [INFO]: Result success",
        "color: green",
        json
      );
    } catch (error) {
      console.log(
        "%c Blackboxify [ERROR]: Error getting result",
        "color: red",
        error
      );
    } finally {
      if (!ready) setReady(true);
    }
  };

  return { result, ready, blackboxify };
};

export default useBlackBoxMagic;
