export const getLanguageFromUrl = () => {
  const supported = ['en', 'la'];

  if (typeof window !== 'undefined' && window.location) {
    const params = new URLSearchParams(window.location.search);
    let langParam = null;

    for (const [key, value] of params.entries()) {
      if (['langcode', 'lang', 'lang_code'].includes(key.toLowerCase())) {
        langParam = value;
        break;
      }
    }

    if (langParam && supported.includes(langParam.toLowerCase())) {
      const resolved = langParam.toLowerCase();
      localStorage.setItem('lang', resolved);
      return resolved;
    }
  }

  const saved = localStorage.getItem('lang');
  if (saved && supported.includes(saved.toLowerCase())) {
    return saved.toLowerCase();
  }

  return 'la';
};
