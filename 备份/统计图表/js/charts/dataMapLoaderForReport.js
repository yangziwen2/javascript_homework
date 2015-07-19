function loadMap(){ //需要全局变量dataKeyList
    window.$numTrim = function(str){
        var trimStr = $.trim(str);
        if('' == trimStr){
            trimStr = '0';
        }
        return trimStr;
    };
    //初始化dataMapStatus
    var totalLineNum = $('div.report table tr:visible').size()-2;
    window.dataMapStatus = {
        maxSize: -1,	//统计的推广类别数,-1表示统计全部
        isFull: false,
        totalLineNum: totalLineNum,
        countedLineNum: 0,
        isOtherNeeded: false
    };
    window.statisticDataFromPage = {};
    window.dataMap = new Map();
    //确定所需的数据在表格中所处的列序数
    $('div.report th:visible').each(function(index){
        for(var dataKey in dataKeyList ){
            if($.trim($(this).text()) == dataKeyList[dataKey].name){
                dataKeyList[dataKey].index = index;
                return;
            }
        }
    });
    if(dataKeyList['date'].index < 0){
        return;
    }
    $('div.report table tr:last').each(function(){
        $(this).children('td:visible').each(function(index){
            for(var dataKey in dataKeyList){
                if(index == dataKeyList[dataKey].index){
                    if('int' == dataKeyList[dataKey].expectedType){
                        dataKeyList[dataKey].tempStore = parseInt($numTrim($(this).text()));
                    }else if('float' == dataKeyList[dataKey].expectedType){
                        dataKeyList[dataKey].tempStore = parseFloat($numTrim($(this).text()));
                    }else{
                        dataKeyList[dataKey].tempStore = $(this).text();
                    }
                    return true;
                }
            }
        });
        for(var dataKey in dataKeyList){
            if('date' == dataKey){
                continue;
            }
            //表格最下一行的合计数据集
            statisticDataFromPage[dataKey] = {};
            if('ctr' == dataKey ){
                statisticDataFromPage[dataKey].avg = dataKeyList[dataKey].tempStore;
                statisticDataFromPage[dataKey].sum = -1;
            }else if('avgClickPrice' == dataKey){
                statisticDataFromPage[dataKey].avg = dataKeyList[dataKey].tempStore;
                statisticDataFromPage[dataKey].sum = -1;
            }else{
                statisticDataFromPage[dataKey].sum = dataKeyList[dataKey].tempStore;
                statisticDataFromPage[dataKey].avg = statisticDataFromPage[dataKey].sum / dataMapStatus.totalLineNum;
            }
        }
    });
    //获取表格中的数据行
    $('div.report table tr').each(function(){
        if(dataMapStatus.isFull){
            return false;
        }
        if($(this).children('th').size() > 0){
            return true;
        }
        var key = '';
        //获取当前行中每列的数据
        $(this).children('td:visible').each(function(index){
            for(var dataKey in dataKeyList){
                if(index == dataKeyList[dataKey].index){
                    if('int' == dataKeyList[dataKey].expectedType){
                        dataKeyList[dataKey].tempStore = parseInt($numTrim($(this).text()));
                    }else if('float' == dataKeyList[dataKey].expectedType){
                        dataKeyList[dataKey].tempStore = parseFloat($numTrim($(this).text()));
                    }else{
                        dataKeyList[dataKey].tempStore = $(this).text();
                    }
                    return true;
                }
            }
            if(index > dataKeyList['date'].index && dataKeyList['pv'].index){
                key += '-' + $.trim($(this).text());
                return true;
            }
        });
        //插入合计数据
        if(!/[\d+-]+\d/.test(dataKeyList['date'].tempStore)){
            return false;
        }
        dataMapStatus.countedLineNum++;
        if(key.length > 1){
            key = key.substring(1);
        }else{
            key = '统计结果';
        }
        //向对应的推广类别插入当前行的数据
        var dataGroup = dataMap.get(key);
        if(typeof dataGroup == 'undefined'){
            if(dataMapStatus.maxSize > 0 && dataMap.size() >= dataMapStatus.maxSize){
                dataMapStatus.isFull = true;
                return;
            }
            dataGroup = {};
            for(var dataKey in dataKeyList){
                dataGroup[dataKey] = {
                    name: dataKeyList[dataKey].name,
                    data: new Array()
                };
            }
            dataGroup.appendPoint = function(obj, point){
                obj.data.push(point);
            }
            dataMap.put(key, dataGroup);
        }
        for(var dataKey in dataKeyList){
            dataGroup.appendPoint(dataGroup[dataKey], dataKeyList[dataKey].tempStore); 
        }
    });
}

function sortMapData(){
    if(typeof window.dataMap == 'undefined'){
        return false;
    }
    if(dataMap.size() > 1){
        //对不同推广类别进行循环
        var keys = dataMap.keys();
        for(var i=0; i<keys.length; i++){
            var key = keys[i];
            var dataGroup = dataMap.get(key);
            //对同一推广类别内不同的数据指标进行循环
            for(var dataKey in dataGroup){  //dataGroup的dataKey与dataKeyList一致(前者根据后者生成)
                if(typeof dataGroup[dataKey].data == 'undefined'){
                    continue;
                }
                if(dataKey == 'date'){
                    continue;
                }
                if('ctr' == dataKey){   //这个指标不需要sum
                    dataGroup[dataKey].sum = -1;
                }else{
                    var sum = 0;
                    for(var j=0; j<dataGroup[dataKey].data.length; j++){
                        sum += dataGroup[dataKey].data[j];
                    }
                    dataGroup[dataKey].sum = sum;
                }
                //求各项指标的统计平均值
                if('ctr' == dataKey){
                    dataGroup[dataKey].avg = dataGroup['click'].sum/dataGroup['pv'].sum;
                }else if ('avgClickPrice' == dataKey){  //ctr=click/pv
                    var notZeroCountNum = 0;
                    for(var k=0; k< dataGroup[dataKey].data.length; k++){
                        if(dataGroup[dataKey].data[k] > 0){
                            notZeroCountNum++;
                        }
                    }
                    dataGroup[dataKey].notZeroCountNum = notZeroCountNum;
                    if(notZeroCountNum > 0){
                        dataGroup[dataKey].avg = dataGroup[dataKey].sum/notZeroCountNum;
                    }else{
                        dataGroup[dataKey].avg = 0;
                    }
                }else{
                    dataGroup[dataKey].avg = dataGroup[dataKey].sum/dataGroup[dataKey].data.length;
                }
            }
        }
        //初始化排序后的结果集
        window.sortedDataResults = {
            dispNum: 15
        };
        for(var dataKey in dataKeyList){
            if('date' == dataKey){
                continue;
            }
            //以highcharts所需的数据格式用来填装各种推广类别的当前统计指标(sum or avg)，并排序
            var sortedArr = new Array();    
            for(var i=0; i<keys.length; i++){
                var key = keys[i];
                var dataGroup = dataMap.get(key);
                if('ctr' == dataKey){
                    sortedArr.push([key, dataGroup[dataKey].avg]);
                }else if('avgClickPrice' == dataKey) {
                    sortedArr.push([key, dataGroup[dataKey].avg]);
                }else{
                    sortedArr.push([key,dataGroup[dataKey].sum]);
                }
            }
            sortedArr.sort(function(a, b){
                return b[1] - a[1];
            });
            sortedArr = sortedArr.splice(0,sortedDataResults.dispNum);
            //if(dataMapStatus.isOtherNeeded){
                if(dataMap.size() > sortedDataResults.dispNum){
                    var dispSum = 0;    //饼图展示的求和数据的累加
                    for(var i=0; i<sortedDataResults.dispNum; i++){
                        if(typeof sortedArr[i][1] != 'number'){
                            continue;
                        }
                        if('ctr' == dataKey || 'avgClickPrice' == dataKey){
                        }else{
                            dispSum += sortedArr[i][1];
                        }
                    }
                    var otherSum = statisticDataFromPage[dataKey].sum - dispSum;
                    statisticDataFromPage[dataKey].otherSum = otherSum;
                    if('avgClickPrice' == dataKey){
                        sortedArr.push(['其他',statisticDataFromPage['consume'].otherSum/statisticDataFromPage['click'].otherSum]);
                    }else if ('ctr' == dataKey){
                        sortedArr.push(['其他',statisticDataFromPage['click'].otherSum/statisticDataFromPage['pv'].otherSum]);
                    }else{
                        sortedArr.push(['其他',otherSum]);    //写成二维数组是为了适应pie chart的data的格式
                    }
                }
            //}
            sortedDataResults[dataKey] = sortedArr;
        }
    }
    return true;
}