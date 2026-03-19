const accentChars = {
    'č': 'c', 'š': 's', 'ž': 'z', 'ė': 'e', 'ų': 'u', 'ū': 'u', 'ą': 'a', 'ę': 'e', 'į': 'i' 
};

const normalizeSearch = (text) => {
    return text.toLowerCase()
        .trim()
        .split('')
        .map(c => accentChars[c] || c)
        .join('');
};

module.exports = {
    normalizeSearch
};