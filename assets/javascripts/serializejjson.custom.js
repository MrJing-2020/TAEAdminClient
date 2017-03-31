;
(function($){
    $.fn.serializeNestedObject = function() {
        var json = {};
        var arrObj = this.serializeArray();
        //alert(JSON.stringify(arrObj));
        $.each(arrObj, function() {
            // 对重复的name属性，会将对应的众多值存储成json数组
            if (json[this.name]) {
                if (!json[this.name].push) {
                    json[this.name] = [ json[this.name] ];
                }
                json[this.name].push(this.value || '');
            } else {
                // 有嵌套的属性，用'.'分隔的
                if (this.name.indexOf('.') > -1) {
                    var pos = this.name.indexOf('.');
                    var key =  this.name.substring(0, pos);
                    // 判断此key是否已存在json数据中，不存在则新建一个对象出来
                    if(!existKeyInJSON(key, json)){
                        json[key] = {};
                    }
                    var subKey = this.name.substring(pos + 1);
                    json[key][subKey] = this.value || '';
                }
                // 普通属性
                else{
                    json[this.name] = this.value || '';
                }

            }
        });

        // 处理那些值应该属于数组的元素，即带'[number]'的key-value对
        var resultJson = {};
        for(var key in json){
            // 数组元素
            if(key.indexOf('[') > -1){
                var pos = key.indexOf('[');
                var realKey =  key.substring(0, pos);
                // 判断此key是否已存在json数据中，不存在则新建一个数组出来
                if(!existKeyInJSON(realKey, resultJson)){
                    resultJson[realKey] = [];
                }
                resultJson[realKey].push(json[key]);

            }
            else{ // 单元素
                resultJson[key] = json[key];
            }
        }
        return resultJson;
    };
    function existKeyInJSON(key, json){
        if(key == null || key == '' || $.isEmptyObject(json)){
            return false;
        }
        var exist = false;
        for(var k in json){
            if(key === k){
                exist = true;
            }
        }
        return exist;
    };
})(jQuery);
