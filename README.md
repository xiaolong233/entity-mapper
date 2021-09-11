# 简介
把源实体对象根据映射配置映射成一个新的实体对象。  
<span style="color:red;font-weight:bold;">注：</span>映射出来的新实体和源实体的层级结构是一致，不支持把两级结构的实体映射成只有一级结构的实体。  

# 映射配置(MapConfig)  
`MapConfig`文件定义了实体映射的逻辑，可以通过自定义`MapConfig`来实现不同的实体映射，例如不映射某些字段、手动指定映射关系等。

# 基础的MapConfig
`EntityMapper`自带了三种基础的MapConfig：  
- `upperCamelMapConfig`，大驼峰命名映射配置，该配置会把源实体中所有字段，映射成符合`大驼峰命名规范`的字段。
- `lowerCamelMapConfig`，小驼峰命名映射配置，该配置会把源实体中所有字段，映射成符合`小驼峰命名规范`的字段。  
- `underscoreMapConfig`，下划线分隔映射配置，该配置会把源实体中所有字段，映射成采用下划线分隔风格的字段。  

# 映射约定
- 默认情况下，是把源实体里的所有字段都映射到目标实体中
- 自带的`MapConfig`会先把字段名中的所有字母转换成小写后再做其他处理。  
- 在自定义`MapConfig`时，只能操作需要映射的字段名，不建议在这里面对数据进行处理，而且`EntityMapper`也是这样限制的。

# 基础使用
```
var entityMapper = require('../index');
var lowerCamelMapConfig = require('../config/lowerCamelMapConfig');
var upperCamelMapConfig = require('../config/upperCamelMapConfig');
var underscoreMapConfig = require('../config/underscoreMapConfig');

// 设置默认的映射配置，可选
entityMapper.setDefaultMapConfig(lowerCamelMapConfig);

var entity = {
    user_id: '1',
    user_name: '初音未来',
    user_age: 18,
    order: {
        address: null,
        email_list: ['MyEmail@outlook.com'],
        mobile_num: null
    },
    create_time: '2021-09-05 06:49:00'
};

// 使用默认映射配置，目标实体的字段命名为小驼峰命名法
var result = entityMapper.mapping(entity);
console.log('使用小驼峰映射配置映射的结果:');
console.log(result);
console.log('\n');

// 使用指定的映射配置，目标实体的字段命名为大驼峰命名法
var resultOfUpper = entityMapper.mapping(entity, upperCamelMapConfig);
console.log('使用大驼峰映射配置映射的结果:');
console.log(resultOfUpper);
console.log('\n');

result.userName = 'Miku';
result.order.emailList.push('MyEmail@gmail.com');
result.order.mobileNum = '123*********';
// 修改数据后再映射回原来下划线分隔的实体
// 映射成一个新的实体对象
var newEntity = entityMapper.mapping(result, underscoreMapConfig);
console.log('反向映射到一个新的实体对象:');
console.log(newEntity);
console.log('\n');

// 映射到一个已存在的实体对象，覆盖对应的内容
entityMapper.mappingTo(result, entity, underscoreMapConfig);
console.log('反向映射到已存在的实体对象:');
console.log(entity);
```
运行效果：
```
使用小驼峰映射配置映射的结果:
{
  userId: '1',
  userName: '初音未来',
  userAge: 18,
  order: {
    address: null,
    emailList: [ 'MyEmail@outlook.com' ],
    mobileNum: null
  },
  createTime: '2021-09-05 06:49:00'
}


使用大驼峰映射配置映射的结果:
{
  UserId: '1',
  UserName: '初音未来',
  UserAge: 18,
  Order: {
    Address: null,
    EmailList: [ 'MyEmail@outlook.com' ],
    MobileNum: null
  },
  CreateTime: '2021-09-05 06:49:00'
}


反向映射到一个新的实体对象:
{
  user_id: '1',
  user_name: 'Miku',
  user_age: 18,
  order: {
    address: null,
    email_list: [ 'MyEmail@outlook.com', 'MyEmail@gmail.com' ],
    mobile_num: '123*********'
  },
  create_time: '2021-09-05 06:49:00'
}


反向映射到已存在的实体对象:
{
  user_id: '1',
  user_name: 'Miku',
  user_age: 18,
  order: {
    address: null,
    email_list: [ 'MyEmail@outlook.com', 'MyEmail@gmail.com' ],
    mobile_num: '123*********'
  },
  create_time: '2021-09-05 06:49:00'
}
```

# 自定义MapConfig
通过自定义`MapConfig`实现特定的实体映射，并支持双向映射。  
```
// 自定义的MapConfig
var util = require('../utils/entityMapperUtil');

// 定义映射字段列表
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
```
```
var entityMapper = require('../index');
var customMapConfig = require('./customMapConfig');

var entity = {
    user_id: '1',
    user_name: '初音未来',
    user_age: 18,
    create_time: '2021-09-05 06:49:00'
};

// 使用自定义的映射配置，该配置会忽略"create_time"字段，并且把"user_age"字段映射为"age"
var result = entityMapper.mapping(entity, customMapConfig);
console.log(result);

// 通过自定义参数，反向映射实体
var tmp = entityMapper.mapping(result, customMapConfig, {
    isReverse: true
});
console.log(tmp);
```
运行效果：  
```
{ userId: '1', userName: '初音未来', age: 18 }
{ user_id: '1', user_name: '初音未来', user_age: 18 }
```