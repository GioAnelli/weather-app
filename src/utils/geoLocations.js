// get browser location

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

// gets browser language

export const getBrowserLang = () => {
  let lang;
  if (navigator.languages && navigator.languages.length) {
    lang = navigator.languages[0];
  } else if (navigator.language) {
    lang = navigator.language;
  } else {
    lang = "en";
  }

  return lang;
};

export const getBrowserLangSimple = () => getBrowserLang().slice(0, 2);
