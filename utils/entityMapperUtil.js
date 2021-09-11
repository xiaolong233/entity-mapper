/**
 * 拆分字段名，只支持下划线分隔或驼峰命名的字段名。
 * @param {string} sourceFieldName 源字段名
 * @returns {Array} 拆分后的单词数组
 */
function splitFieldName(sourceFieldName) {
    let words = [];
    if (!sourceFieldName || sourceFieldName.length <= 0) {
        return words;
    }

    if (sourceFieldName.indexOf('_') > -1) {
        words = sourceFieldName.split('_');
    }
    else {
        words = sourceFieldName.split(/(?=[A-Z])/g);
    }

    return words;
}

/**
 * 根据大驼峰命名法把字符串数组拼接成一个新的字符串
 * @param {Array} words 需要拼接的字符串数组
 * @returns 符合大驼峰命名法的字符串
 */
function joinStringByUpperCamel(words) {
    let newWords = [];
    for (let i = 0; i < words.length; i++) {
        let word = words[i].toLowerCase();
        if (word.length <= 0) {
            continue;
        }

        newWords.push(word.replace(word[0], word[0].toUpperCase()));
    }

    return newWords.join('');
}

/**
 * 根据小驼峰命名法把字符串数组拼接成一个新的字符串
 * @param {Array} words 需要拼接的字符串数组
 * @returns 符合小驼峰命名法的字符串
 */
function joinStringByLowerCamel(words) {
    let newWords = [];
    for (let i = 0; i < words.length; i++) {
        let word = words[i].toLowerCase();
        if (word.length <= 0) {
            continue;
        }

        if (i > 0) {
            newWords.push(word.replace(word[0], word[0].toUpperCase()));
        }
        else {
            newWords.push(word);
        }
    }

    return newWords.join('');
}

/**
 * 使用下划线把字符串数组拼接成一个新的字符串
 * @param {*} words 需要拼接的字符串数组
 * @returns 使用下划线分隔的字符串
 */
function joinStringByUnderscore(words) {
    let newWords = [];
    for (let i = 0; i < words.length; i++) {
        let word = words[i].toLowerCase();
        if (word.length <= 0) {
            continue;
        }

        newWords.push(word);
    }

    return newWords.join('_');
}

module.exports = {
    splitFieldName,
    joinStringByUpperCamel,
    joinStringByLowerCamel,
    joinStringByUnderscore
}