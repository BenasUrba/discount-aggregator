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

const synonyms = {
    cipsai: ["traskuciai"],
    vistiena: ["visciuku", "vistienos"],
    saldainiai: ["saldainiams", "guminukai", "guminukams", "saldainiu"],
    mesa: ["vistiena", "vistienos", "visciuku", "jautiena", "lasisa", "lasisos", "kiauliena", "kiaulienos", "jautienos", "kiaul.", "antis", "svieziai"]
};

const expandSearch = (term) => {
    return [term, ...(synonyms[term] || [])];
};

module.exports = {
    normalizeSearch,
    expandSearch
};