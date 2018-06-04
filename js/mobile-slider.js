    //时间条区域
    let mobile_time_box = $('#mobile-time-box');
    //播放按钮
    let mobile_play_btn = $('.mobile-icon-play');
    //终止按钮
    let mobile_pause_btn = $('.mobile-icon-pause');

    let mobile_timecode = $('#mobile-timecode');
    //窗体对象
    let window_obj = $(window);
    //计算窗体中心位置
    let w = window_obj.width() / 2;
    //获取touch开始时的X坐标位置
    let touchX;
    //判断是否在播放状态
    let playState = false;

    //存放初始时间和结束时间的个数
    let DateIndex = [];

    //完成整个进度的时间,默认值为100
    let intervalTime = 120000;
    let userSetTime = 120000;

    //全局变量起始日期和终止日期
    let date0,date1;

    //存储起始和终止日期时间间隔 例如：10天为240小时
    let n_interval;

    //存放日期数组 例如 2018/04/27 12:00
    let day_array;

    //存放最新日期相隔天数
    let day_diff_n ;
    //记录时间区域的总长
    let total_width ;
    //剩余长度
    let LeftPart;
    //记录最新的Left值
    let lastLeft = 0;
    //记录用户的callback函数
    let mCallBack;

    let lastValue;


    //定义函数及回调方法
    function TimeSlider(date_start,date_end){
        //存放起始终止日期为全局变量
        date0 = date_start;
        date1 = date_end;
        lastValue = date_start;
    }

    //初始化进度条
    TimeSlider.prototype.Init = function () {
    //初始化
        init(date0,date1);

    };

    //初始化进度条
    TimeSlider.prototype.setOnChangedListener = function (callback) {
        mCallBack = callback;
        setDivLeftListener();
    };

    $(window).resize(ScreenResize);

    function ScreenResize(){

        const nowLeft = total_width + mobile_time_box.offset().left;

        intervalTime = nowLeft/total_width * userSetTime;

        mobile_time_box.empty();
        w = window_obj.width() / 2;

        if(playState)
            stop();
        mobile_time_box.css('left',0);
        setTimeout(function () {
            init(date0,date1);
        },500);
        mobile_pause_btn.css('visibility','hidden');
        mobile_play_btn.css('visibility','visible');
        playState = false;

    }

    mobile_play_btn .on('click',function () {
        mobile_pause_btn.css('visibility','visible');
        mobile_play_btn.css('visibility','hidden');
        playState = true;
        move();
    });

    mobile_pause_btn .on('click',function () {
        mobile_pause_btn.css('visibility','hidden');
        mobile_play_btn.css('visibility','visible');
        playState = false;
        stop();
    });

    mobile_time_box.on('touchstart',TouchStart);

    function TouchStart(event){
        let e = event || window.event;
        window_obj.on('touchmove',TouchMove);
        window_obj.on('touchend',TouchEnd);
        let pDiv = mobile_time_box.offset();
        touchX = e.originalEvent.targetTouches[0].clientX - pDiv.left;
        if(playState)
            stop();
        return false;
    }

    function TouchMove(event){
        let e = event || window.event;
        let left =  e.originalEvent.targetTouches[0].clientX - touchX;

        mobile_time_box.css('left',left);
        if(mobile_time_box.offset().left > 0)
            mobile_time_box.css('left',0);
        else if(mobile_time_box.offset().left < LeftPart)
            mobile_time_box.css('left',LeftPart);
    }

    function TouchEnd(event) {
        window_obj.off('touchmove');
        window_obj.off('touchend');
       // const total_width = mobile_time_box.width();
        const nowLeft = total_width + mobile_time_box.offset().left;

        intervalTime = nowLeft/total_width * userSetTime;
       // mobile_time_box.css('left',nowLeft);
        if(playState)
            move();
    }

    function TrimDate2Time(str){
        if(str !== undefined){
            let dateTime = str.split(" ");
            return dateTime[1];
        }
    }

    function init(d0,d1){
        //计算得到起始时间和终止时间之间的时长，如10天为240
        n_interval = dateTime_diff(d0,d1);
        //初始化提示框内的文字
        mobile_timecode.text(TrimDate2Time(d0));
        //添加基础长度，两端的半个窗口的长度
        let base_Length = window_obj.width(); //2* w;
        mobile_time_box.width(base_Length);
        //添加第一个基础长度div
        $first_Div = $('<div style="background-color:rgba(93,93,93,0.5); height:2.5rem;line-height: 2.5rem;width: '+ w + 'px"></div>');
        mobile_time_box.append($first_Div);
        getDay(d0,d1);

        const index = day_diff_n -1;
        const last_color = $('#date' + index).css('background-color');
        $end_Div = $('<div style="background-color:rgba(42,42,42,0.51);height:2.5rem;line-height: 2.5rem;width: '+ w + 'px"></div>');
        $end_Div.css('background-color',last_color);
        mobile_time_box.append($end_Div);
        total_width = mobile_time_box.width() - window_obj.width();
        LeftPart =   window_obj.width() - mobile_time_box.width();
    }

    function move() {

        mobile_time_box.animate({left: -mobile_time_box.width() +window_obj.width()},intervalTime,'linear',function(){
        mobile_time_box.css('left',0);
        //重置完成整个进度所需时间
        intervalTime = userSetTime;
        setTimeout(function(){
           move();
        },intervalTime / n_interval);

     });

    }

    function stop(){
        mobile_time_box.stop(true);
    }



    //日期格式转化
    Date.prototype.Format = function (fmt) {
        const o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        return fmt;
    };

    /*
     return datetime formatter
     */
    function hours2dateTime(hours){
        const stamp = hours*1000*3600;
        let newdate = new Date(stamp);
        //console.log();
        return newdate.Format('yyyy/MM/dd HH:mm');
    }

    /*
     return hours diffrent
     */
    function dateTime_diff(startDate,endDate){
        /*
         date formatter : '2015-12-12 23:59:59'
         */
        const d0 = stamp2hour(startDate);
        const d1 = stamp2hour(endDate);
        return (d1-d0);
    }

    /*
     return hours at the time ...
     */
    function stamp2hour(dateTime){
        const time = dateTime.split(' ');
        if (time.length === 2){
            let stamp = new Date(dateTime).getTime();
            return stamp/1000/3600
        }
    }

    /*
     return date array about hours
     */
    function dateArray(dateStart,dateEnd){
        let date_array = [];
        let startHour = stamp2hour(dateStart);
        let endHour = stamp2hour(dateEnd);
        for(let i=0;i<(endHour-startHour);i++){
            date_array.push(String(hours2dateTime(startHour+i)));
        }
        date_array.push(dateEnd);
        return date_array
    }

    function clipDateString(date){

        return date.toString().split(" ")[0];
    }

    function getDateCount(str,param){
        //let c = param; // 要计算的字符
        let regex = new RegExp(param, 'g'); // 使用g表示整个字符串都要匹配
        let result = str.match(regex);
        return !result ? 0 : result.length;
    }

    /*
    将获取的0-6日期转化为文字
    */
    function setWeekDayName(num){
        let show_day=['日','一','二','三','四','五','六'];
        return show_day[num];
    }

    //提取出日期中的时间
    function clipDateTime(date){
        const TimeString = date.toString().split(" ")[1];
        const Hours = parseInt(TimeString.split(':')[0]);
        return 24 - Hours;
    }

    /*计算日期并显示*/
    function getDay(d0,d1){
        let day0 = new Date(d0);
        let day1 = new Date(d1);
        /*相差多少天*/
        const day_diff = (day1.getTime()-day0.getTime())/1000/3600/24;
        /*日期数组*/
        day_array = dateArray(d0,d1);
        let length = 160;
        DateIndex[0] = getDateCount(day_array.toString(),clipDateString(d0));
        DateIndex[1] = getDateCount(day_array.toString(),clipDateString(d1));
        const left_hours =  clipDateTime(d0);
        const right_hours = clipDateTime(d1);

        if((left_hours === 0 &&  right_hours === 0 )
            || (left_hours === 24 && right_hours === 24))
            day_diff_n = day_diff ;
        else if(left_hours !== right_hours)
            day_diff_n  =  Math.ceil(day_diff);
        else
            day_diff_n = day_diff + 1;

        for (let j=0;j<day_diff_n;j++){

            let n = 0;
            let dis = 0;

            if(j === 0){
                n = left_hours * j;

                if(left_hours === 0)
                    dis =  length;
                else
                    dis =  ((left_hours +1) / 24) * length ;

            }else if(j === day_diff_n -1){
                if(left_hours === 0 &&  right_hours === 0 )
                    n =left_hours + 24*j;
                else if(left_hours ===0 &&  right_hours !== 0 )
                    n =left_hours + 24*j;
                else if(left_hours !== 0 && right_hours === 0)
                    n = 24*j ;
                else
                    n =left_hours + 24*(j-1);

                if(right_hours === 0)
                    dis =  length;
                else if(right_hours !== 24)
                    dis = ((24 - right_hours) / 24) *length ;
                else
                    dis = (right_hours / 24) *length ;

            } else{
                n = 24 *j;
                dis = length ;
            }

            let now_width = mobile_time_box.width();
            mobile_time_box.width(now_width + dis);

            let date = new Date(day_array[n]);
            //console.log(date);
            /*星期几*/
            let weekDay = date.getDay();
            /*多少号*/
            let Day = date.getDate();
            /*把周0变成周7*/
            weekDay = setWeekDayName(weekDay);
            /*添加的 div 的百分比宽度*/
            let color ;
            if(j % 2 ===0)
                color = 'rgba(93,93,93,0.5)';
            else
                color = 'rgba(42,42,42,0.5)';
            let div_center;
            if(dis <= 40 ){
                div_center = $('<div id = date' +j+' style="background-color:' + color +';height:2.7rem;line-height: 2.7rem;">'+ Day +'</div>');
            }else if(dis > 40 && dis < 80)
                div_center = $('<div id = date' +j+' style="background-color:' + color +';height:2.7rem;line-height: 2.7rem;">'+ '周'+weekDay+'</div>');
            else
                div_center = $('<div id = date' +j+' style="background-color:' + color +';height:2.7rem;line-height: 2.7rem;">'+ '周'+weekDay+' '+Day +'</div>');

            mobile_time_box.append(div_center);

            let date_j = $('#date' +j);
            date_j.width(dis);
        }
    }

    function setDivLeftListener(){

        setInterval(function () {
            let DivLeft = mobile_time_box.offset().left;
            if(lastLeft !== DivLeft){
                lastLeft = DivLeft;
                setTimeCode(lastLeft);
            }
        },100);
    }

    function setTimeCode(value){
        let left_width = Math.abs(value);
        let piece =  total_width / day_array.length;

        let align =parseInt(left_width/piece);
        if(align >= day_array.length )
            align = day_array.length -1;
        if(lastValue === day_array[align])
            return;
        else{
            // 时间变化
            mobile_timecode.text(TrimDate2Time(day_array[align]));
            mCallBack(day_array[align]);
            lastValue = day_array[align];
        }
    }