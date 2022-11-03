import { useCallback, useState } from "react";

async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export const useClipboard = (): [boolean, (text: string) => Promise<void>] => {
  const [isCopied, setIsCopied] = useState(false);

  const handleClipBoard = useCallback(async (text: string) => {
    await copyTextToClipboard(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }, []);

  return [isCopied, handleClipBoard];
};
