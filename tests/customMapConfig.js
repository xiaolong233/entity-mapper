var util = require('../utils/entityMapperUtil');
var mapFields = [
    { from: 'user_age', to: 'age', remark: '用户年龄' },
    { from: 'create_time', isIgnore: true, remark: '创建时间' }];

/**
 * 获取映射的字段名
 * @param {string} sourceFieldName 源字段名
 * @param {Object} param 可选，自定义参数对象，使用自定义的MapConfig时，可以使用该参数来传递额外的自定义参数
 * @param {Boolean} param.isReverse 是否反向映射
 * @returns 目标字段名
 */
function getMapFieldName(sourceFieldName, param) {
    for (let i = 0; i < mapFields.length; i++) {
        let mapField = mapFields[i];
        let source = mapField.from;
        let target = mapField.to;
        if (param && param.isReverse) {
            source = mapField.to;
            target = mapField.from;
        }

        if (source != sourceFieldName) {
            continue;
        }
        if (mapField.isIgnore) {
            return null;
        }

        return target;
    }

    let words = util.splitFieldName(sourceFieldName);
    if (param && param.isReverse) {
        return util.joinStringByUnderscore(words);
    }
    return util.joinStringByLowerCamel(words);
}

module.exports = {
    getMapFieldName
};