/* ====== Common GET Request Function ====== */
export async function getRequest(url) {
  // console.log("url", url);
  return await fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

/* ====== Common Delete Request Function ====== */
export async function deleteRequest(url, options) {
  return await fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

/* ====== Common Patch Request Function ====== */
export async function patchRequest(url, options) {
  return await fetch(url, options).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

/* ====== Common Put Request Function ====== */
export async function putRequest(url, options) {
  console.log(url);
  const defaultOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  };
  return await fetch(url, defaultOptions).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}
