var util = require('../utils/entityMapperUtil');

/**
 * 获取映射的字段名
 * @param {string} sourceFieldName 源字段名
 * @param {Object} param 可选，自定义参数对象，使用自定义的MapConfig时，可以使用该参数来传递额外的自定义参数
 * @returns 目标字段名
 */
function getMapFieldName(sourceFieldName, param) {
    let words = util.splitFieldName(sourceFieldName);
    return util.joinStringByUnderscore(words);
}

module.exports = {
    getMapFieldName
};