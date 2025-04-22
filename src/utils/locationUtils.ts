/**
 * Retrieves the user's current geolocation coordinates.
 *
 * This function uses the browser's Geolocation API to get the current position
 * of the user's device. If successful, it returns the coordinates as a string
 * in the format "latitude,longitude".
 *
 * @returns A Promise that resolves to a string containing the user's coordinates
 *          in the format "latitude,longitude"
 * @throws {Error} If geolocation is not supported by the browser
 * @throws {Error} If the user denies the geolocation request or if there's another error
 *                 getting the location (with the error message included)
 */
export function getUserLocation(): Promise<string> {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(`${position.coords.latitude},${position.coords.longitude}`);
        },
        (error) => {
          reject(`Error getting location: ${error.message}`);
        }
      );
    } else {
      reject("Geolocation is not supported by this browser.");
    }
  });
}
