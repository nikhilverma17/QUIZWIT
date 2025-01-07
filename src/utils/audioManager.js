const isLocal = !window.location.href.includes('quickwit.netlify.app');  // Check if it's running locally

const baseUrl = isLocal ? '/assets/' : 'https://quickwit.netlify.app/assets/';

const audioManager = {
  backgroundAudio: new Audio(`${baseUrl}Intro.mp3`),
  soundEffects: {
    correct: [
      new Audio(`${baseUrl}Correct1.mp3`),
      new Audio(`${baseUrl}Correct3.mp3`),
      new Audio(`${baseUrl}Correct2.mp3`),
    ],
    wrong: [
      new Audio(`${baseUrl}Wrong1..mp3`), // Updated link for both local and web
      new Audio(`${baseUrl}Wrong2..mp3`),
      new Audio(`${baseUrl}Wrong3..mp3`),
    ],
    questionAppear: new Audio(`${baseUrl}Question.mp3`),
  },

  getRandomAudio: (type) => {
    if (Array.isArray(audioManager.soundEffects[type])) {
      const randomIndex = Math.floor(Math.random() * audioManager.soundEffects[type].length);
      return audioManager.soundEffects[type][randomIndex];
    }
    return audioManager.soundEffects[type];
  },

  play: (audioType) => {
    if (audioType === 'background') {
      if (!audioManager.backgroundAudio.paused) {
        return; // Don't play if it's already playing
      }
      audioManager.backgroundAudio.loop = false; // Set to false to play only once
      audioManager.backgroundAudio.play().catch(error => console.error('Error playing background audio:', error));
    } else {
      const audio = audioManager.getRandomAudio(audioType);
      audio.play().catch(error => console.error(`Error playing ${audioType} sound:`, error));
    }
  },

  stop: (audioType) => {
    if (audioType === 'background') {
      audioManager.backgroundAudio.pause();
      audioManager.backgroundAudio.currentTime = 0;
    } else if (audioManager.soundEffects[audioType]) {
      audioManager.soundEffects[audioType].pause();
      audioManager.soundEffects[audioType].currentTime = 0;
    }
  },

  pause: (audioType) => {
    if (audioType === 'background') {
      audioManager.backgroundAudio.pause();
    } else if (audioManager.soundEffects[audioType]) {
      audioManager.soundEffects[audioType].pause();
    }
  },
};

export default audioManager;
