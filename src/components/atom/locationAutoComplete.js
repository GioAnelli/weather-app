export const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

function loadScript(src, position, id) {
  if (!position) {
    return;
  }
  // Crea un nuovo elemento script
  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

// Funzione per inizializzare l'API di Google Maps
export const initGoogleAPI = (loaded) => {
  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&loading=async&libraries=places`,
        document.querySelector("head"),
        "google-maps"
      );
    }
    // Imposta 'loaded.current' a true per indicare che l'API è stata caricata
    loaded.current = true;
  }
};
