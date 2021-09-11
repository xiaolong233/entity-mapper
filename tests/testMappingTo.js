var entityMapper = require('../index');
var underscoreMapConfig = require('../config/underscoreMapConfig');

let entity = {
    user_id: '1',
    user_name: '初音未来',
    order: {
        email: ['11111@outlook.com', '22222@gmial.com'],
        mobile_num: '123456789',
        remark: null
    }
};

let dto = {
    userId: '1',
    userName: '初音未来1',
    order: {
        email: ['22222@gmial.com'],
        mobileNum: null,
        remark: '测试用户'
    }
};

entityMapper.mappingTo(dto, entity, underscoreMapConfig);
console.log(entity);