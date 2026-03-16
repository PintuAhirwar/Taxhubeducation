export const getImagePrefix = () => {
  const base =
    process.env.NEXT_PUBLIC_ENV === "local"
      ? "http://127.0.0.1:8000"
      : "https://classroom-backend-dvcd.onrender.com";

  return `${base}/media/`;  // <<< MOST IMPORTANT
};