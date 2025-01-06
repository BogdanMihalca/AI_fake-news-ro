import { replace } from "lodash";

const preprocessText = (text: string) => {
  // Convert text to lowercase
  text = text.toLowerCase();
  // Remove special characters
  text = replace(text, /\W/g, " ");
  // Remove all single characters
  text = replace(text, /\s+[a-zA-Z]\s+/g, " ");
  // Replace multiple spaces with a single space
  text = replace(text, /\s+/g, " ");

  if (text.length > 2500) {
    text = text.substring(0, 2500);
  }
  return text.trim();
};

const validateUrlForMaliciousContent = async (url: string) => {
  const result = await fetch(`/api/verifyUrl`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url,
    }),
  });

  const data = await result.json();

  return data.message;
};

export { preprocessText, validateUrlForMaliciousContent };
