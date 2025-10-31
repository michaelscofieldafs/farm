export const openInNewTab = (url: string) => {
  window.open(url, "_blank", "noreferrer");
};

export const sleep = (msec: number) => {
  return new Promise(resolve => setTimeout(resolve, msec));
}

export const safeCall = async (method: any, defaultValue: any = null) => {
  try {
    return await method.call();
  } catch {
    return defaultValue;
  }
};