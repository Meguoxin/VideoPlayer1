/**
 * 时间工具类
 * create by song on 2017-06-03
 */
export default {
    
    /**
     * 计算时间间隔
     * @param {*} time 时间
     */
    // time format 2016-11-11T18:56:33.904Z
    computeTime: (time) => { 
        var datePart = time.substring(0, 10).replace(/\-/g, "/");;
        var timePart = time.substring(11, 19);
        var oldTime = (new Date(datePart + ' ' + timePart)).getTime();
        var currTime = new Date().getTime();
        var diffValue = currTime - oldTime;

        var days = Math.floor(diffValue/(24*3600*1000));
        if(days === 0){
            //计算相差小时数
            var leave1 = diffValue%(24*3600*1000); //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1/(3600*1000));
            if(hours === 0) {
                //计算相差分钟数
                var leave2 = leave1 % (3600 * 1000);  //计算小时数后剩余的毫秒数
                var minutes = Math.floor(leave2 / (60 * 1000));
                if(minutes === 0) {
                    //计算相差秒数
                    var leave3 = leave2 % (60 * 1000);   //计算分钟数后剩余的毫秒数
                    var seconds = Math.round(leave3 / 1000);
                    return seconds+'秒前';
                }
                return minutes+'分钟前';
            }
            return hours+'小时前';
        }
        return days+'天前';
    },
    
    /**
     * 视频总秒数 转化为 xx:xx
     */
    getFormatTime: (value) => {
        
        var seconds = parseInt(value);// 秒
        var min = Math.floor(seconds / 60),
            second = seconds % 60,
            hour, newMin, time;

        if (min > 60) {
            hour = Math.floor(min / 60);
            newMin = min % 60;
        }

        if (second < 10) {
            second = '0' + second;
        }
        if (min < 10) {
            min = '0' + min;
        }

        return time = hour ? (hour + ':' + newMin + ':' + second) : (min + ':' + second);
    },

    /**
     * 将ISO格式时间转换为：month+"/"+day+" "+hour+":"+minute
     */
    getFormatDate: (value) => {
        Date.prototype.setISO8601 = function (string) {  
            var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +  
                "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +  
                "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";  
            if(string) {  
                var d = string.match(new RegExp(regexp));  
                var offset = 0;  
                var date = new Date(d[1], 0, 1);  
    
                if (d[3]) {  
                    date.setMonth(d[3] - 1);  
                }  
                if (d[5]) {  
                    date.setDate(d[5]);  
                }  
                if (d[7]) {  
                    date.setHours(d[7]);  
                }  
                if (d[8]) {  
                    date.setMinutes(d[8]);  
                }  
                if (d[10]) {  
                    date.setSeconds(d[10]);  
                }  
                if (d[12]) {  
                    date.setMilliseconds(Number("0." + d[12]) * 1000);  
                }  
                if (d[14]) {  
                    offset = (Number(d[16]) * 60) + Number(d[17]);  
                    offset *= ((d[15] == '-') ? 1 : -1);  
                }  
                offset -= date.getTimezoneOffset();  
                time = (Number(date) + (offset * 60 * 1000));  
                this.setTime(Number(time));  
            }  
            else  
            {  
                return;  
            }  
        } 

        let date = new Date();
        date.setISO8601(value); 
        let month = date.getMonth()+1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        if(month < 10) {
            month = '0' + month;
        }
        if(day < 10) {
            day = '0' + day;
        }
        return month + '/' + day + ' ' + hour + ':' + minute;
    },

    /**
     * 将ISO格式时间转换为具体时间
     */
    getSpecificDate: (value) => {
        Date.prototype.setISO8601 = function (string) {  
            var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +  
                "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +  
                "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";  
            if(string) {  
                var d = string.match(new RegExp(regexp));  
                var offset = 0;  
                var date = new Date(d[1], 0, 1);  
    
                if (d[3]) {  
                    date.setMonth(d[3] - 1);  
                }  
                if (d[5]) {  
                    date.setDate(d[5]);  
                }  
                if (d[7]) {  
                    date.setHours(d[7]);  
                }  
                if (d[8]) {  
                    date.setMinutes(d[8]);  
                }  
                if (d[10]) {  
                    date.setSeconds(d[10]);  
                }  
                if (d[12]) {  
                    date.setMilliseconds(Number("0." + d[12]) * 1000);  
                }  
                if (d[14]) {  
                    offset = (Number(d[16]) * 60) + Number(d[17]);  
                    offset *= ((d[15] == '-') ? 1 : -1);  
                }  
                offset -= date.getTimezoneOffset();  
                time = (Number(date) + (offset * 60 * 1000));  
                this.setTime(Number(time));  
            }  
            else  
            {  
                return;  
            }  
        } 
        let date = new Date();
        date.setISO8601(value); 
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();
        if(month < 10) {
            month = '0' + month;
        }
        if(day < 10) {
            day = '0' + day;
        }
        if(hour < 10) {
            hour = '0' + hour;
        }
        if(minute < 10) {
            minute = '0' + minute;
        }
        if(second < 10) {
            second = '0' + second;
        }
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    },

    /**
     * 获取年月日数据,1950 - 2050
     */
    getDateData: ()=> {
        let date = [];
        for(let i = 1950; i < 2050; i++) {
            let month = [];
            for(let j = 1; j < 13; j++) {
                let day = [];
                if(j === 2) {
                    for(let k = 1; k < 29; k++) {
                        day.push(k + '日');
                    }
                    if(i % 4 === 0){
                        day.push(29 + '日');
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}) {
                    for(let k = 1;k < 32; k++){
                        day.push(k + '日');
                    }
                }
                else{
                    for(let k = 1;k < 31;k++) {
                        day.push(k + '日');
                    }
                }
                let _month = {};
                _month[j + '月'] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i + '年'] = month;
            date.push(_date);
        }
        return date;
    }
}