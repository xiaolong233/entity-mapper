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