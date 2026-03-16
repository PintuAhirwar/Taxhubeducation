export const getApiPrefix = () => {
  return process.env.NEXT_PUBLIC_ENV === "local"
    ? "http://127.0.0.1:8000/api"
    : "https://classroom-backend-dvcd.onrender.com/api";
};
