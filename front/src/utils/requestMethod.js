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
