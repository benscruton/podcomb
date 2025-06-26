const characterKey = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
};

const characterRegEx = /[&<>'"]/g;

const escapeHtmlChars = str => str.replace(
  characterRegEx,
  char => characterKey[char]
);

module.exports = escapeHtmlChars;