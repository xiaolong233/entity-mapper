var defaultMapConfig = null;

/**
 * 设置默认的映射配置
 * @param {Object} mapConfig 映射配置对象
 */
function setDefaultMapConfig(mapConfig) {
    if (mapConfig == undefined) {
        throw 'mapConfig is undefined.';
    }
    else if (mapConfig == null) {
        throw 'mapConfig is null.';
    }

    defaultMapConfig = mapConfig;
}

/**
 * 映射实体
 * @param {Object} sourceEntity 源实体对象
 * @param {Object} mapConfig 可选，映射配置对象，不指定或设置为null时将使用默认的配置进行映射
 * @param {Object} param 可选，自定义参数对象，使用自定义的MapConfig时，可以使用该参数来传递额外的自定义参数
 * @returns {Object} 映射成功后的实体
 */
function mapping(sourceEntity, mapConfig, param) {
    // 实体校验
    if (!checkEntity(sourceEntity)) {
        return sourceEntity;
    }

    // 遍历源实体字段
    let resultEntity = {};
    let keys = Object.keys(sourceEntity);
    for (let i = 0; i < keys.length; i++) {
        let fieldName = keys[i];

        // 获取映射的字段名
        let newFieldName = getMapFieldName(fieldName, mapConfig, param);
        if (!newFieldName || typeof newFieldName != 'string') {
            continue;
        }

        // 把字段值映射到新的实体中，并递归遍历子层级
        let value = sourceEntity[fieldName];
        resultEntity[newFieldName] = mapping(value, mapConfig, param);
    }

    return resultEntity;
}

/**
 * 把源实体映射到目标实体
 * @param {Object} sourceEntity 源实体对象
 * @param {Object} destEntity 目标实体对象
 * @param {Object} mapConfig 可选，映射配置对象，不指定或设置为null时将使用默认的配置进行映射
 * @param {Object} param 可选，自定义参数对象，使用自定义的MapConfig时，可以使用该参数来传递额外的自定义参数
 */
function mappingTo(sourceEntity, destEntity, mapConfig, param) {
    // 实体校验
    if (!checkEntity(sourceEntity) || !checkEntity(destEntity)) {
        return;
    }

    let resultEntity = mapping(sourceEntity, mapConfig, param);
    copyTo(resultEntity, destEntity);
}

/**
 * 把源对象的内容复制到目标对象中
 * @param {Object} source 源对象
 * @param {Object} dest 目标对象
 */
function copyTo(source, dest) {
    if (!source || !dest) {
        return;
    }

    let keys = Object.keys(source);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (!source[key] || !dest[key]) {
            dest[key] = source[key];
            continue;
        }

        if (typeof source[key] == 'object' && !Array.isArray(source[key])) {
            copyTo(source[key], dest[key]);
        } else {
            dest[key] = source[key];
        }
    }
}

/**
 * 判断源实体对象是否合法
 * @param {Object} sourceEntity 源实体对象
 */
function checkEntity(sourceEntity) {
    if (sourceEntity == undefined) {
        // throw 'sourceEntity is undefined.';
        return false;
    }
    else if (sourceEntity == null) {
        // throw 'sourceEntity is null.';
        return false;
    }
    else if (typeof sourceEntity != 'object') {
        // throw 'sourceEntity is not object.';
        return false;
    }
    else if (Array.isArray(sourceEntity)) {
        // throw 'sourceEntity is Array.';
        return false;
    }

    return true;
}

/**
 * 获取映射的字段名
 * @param {string} sourceFieldName 源字段名
 * @param {Object} mapConfig 可选，映射配置对象，不指定时将使用默认的配置进行映射
 * @param {Object} param 可选，自定义参数对象，使用自定义的MapConfig时，可以使用该参数来传递额外的自定义参数
 * @returns 目标字段名
 */
function getMapFieldName(sourceFieldName, mapConfig, param) {
    let mapFieldName = sourceFieldName;

    if (mapConfig && typeof mapConfig.getMapFieldName == 'function') {
        mapFieldName = mapConfig.getMapFieldName(sourceFieldName, param);
    }
    else if (defaultMapConfig && typeof defaultMapConfig.getMapFieldName == 'function') {
        mapFieldName = defaultMapConfig.getMapFieldName(sourceFieldName, param);
    }

    return mapFieldName;
}

module.exports = {
    setDefaultMapConfig,
    mapping,
    mappingTo
};