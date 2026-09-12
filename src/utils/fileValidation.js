const MB = 1024 * 1024;

export const MAX_IMAGE_SIZE_MB = 7;
export const MAX_VIDEO_SIZE_MB = 15;

export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * MB;
export const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * MB;

export const isVideoFile = (file) => Boolean(file?.type?.startsWith('video/'));

/**
 * Returns an i18n key + interpolation values when the file exceeds its limit,
 * or null when the file is acceptable. Limits are keyed off the real MIME type,
 * since the video input also accepts images.
 */
export const getFileSizeError = (file) => {
  if (!file) return null;

  const video = isVideoFile(file);
  const maxBytes = video ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;

  if (file.size <= maxBytes) return null;

  return {
    key: video
      ? 'Video is too large. Maximum size is {{max}}MB.'
      : 'Image is too large. Maximum size is {{max}}MB.',
    values: {
      max: video ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB,
      size: (file.size / MB).toFixed(1),
    },
  };
};
