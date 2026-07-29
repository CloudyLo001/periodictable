// Browser URLs for Mint-generated SFX, synchronized through mint-assets.json
// (registry keys: zoom-whoosh, flap-open, flap-close, atom-ambience).
const base = import.meta.env.BASE_URL;

export const AUDIO_FILES = {
  whoosh: `${base}assets/mint/zoom-whoosh/audio_file.mp3`,
  flapOpen: `${base}assets/mint/flap-open/audio_file.mp3`,
  flapClose: `${base}assets/mint/flap-close/audio_file.mp3`,
  ambience: `${base}assets/mint/atom-ambience/audio_file.mp3`,
} as const;
