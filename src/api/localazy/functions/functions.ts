import LocalazyApi from "@localazy/ts-api";

export const getLocalazyApi = async (user: any, baseUrl: string) => {
  const { accessToken } = user;
  if (!accessToken) {
    throw new Error("Localazy user is not logged in.");
  }

  const api = LocalazyApi({
    projectToken: accessToken,
    baseUrl: baseUrl,
  });
  return api;
};

export const delay = (ms = 250) =>
  new Promise((resolve) => setTimeout(resolve, ms));
