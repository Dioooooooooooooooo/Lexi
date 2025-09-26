import Sound from "react-native-sound";

// Enable playback in silence mode
Sound.setCategory("Playback");

const CorrectSound = new Sound(
  require("~/assets/sounds/correct-choice.mp3"),
  Sound.MAIN_BUNDLE,
  (error) => {
    if (error) {
      console.log("Failed to load correct sound:", error);
      return;
    }
  }
);

const IncorrectSound = new Sound(
  require("~/assets/sounds/error.mp3"),
  Sound.MAIN_BUNDLE,
  (error) => {
    if (error) {
      console.log("Failed to load incorrect sound:", error);
      return;
    }
  }
);

export { CorrectSound, IncorrectSound };