/**
 * Created by Administrator on 2017/3/6.
 */
$(function () {
    var nav_top = $('.nav').offset().top;//第而次犯错了
    $(window).on('scroll', function () {
        var now_top = $(window).scrollTop();
        if (now_top > nav_top) {
            $('.nav').css({position: 'fixed', top: 50});
            $('.nav h1').stop().animate({opacity: 1});
            $('.goTop').stop().fadeIn();
        } else {
            $('.nav').css({position: 'absolute', top: 100});
            $('.nav h1').stop().animate({opacity: 0});
            $('.goTop').stop().fadeOut();
        }
    });
    $('.goTop').on('click', function () {
        $(this).stop().fadeOut();
        $('body').stop().animate({scrollTop: 0});
    });
    //切换代办事项与完成事项
    $('.centen_T li').on('click', function () {
        $(this).addClass('curr').siblings().removeClass('curr');
        var index = $(this).index();
        $('.body').eq(index).css({display: 'block'});
        $('.body:not(:eq(' + index + '))').css({display: 'none'});
    });
    //输入框有内容时点击按钮添加事项
    var itemArray;
    itemArray = store.get('itemArray')||[];
    addData();
    $('.go').on('click', function (event) {
        event.preventDefault();
        var myValue = $('.text').val();
        if ($.trim(myValue) == '') {
            alert('请输入内容');
            return;
        } else {
            var obj = {
                title: myValue,
                content: '',
                isClick: false,
                timing: '',
                isDone: false
            };
            itemArray.push(obj);
            $('.text').val('');
        }
        addData();
    });
    //点击删除
    $('body').on('click','.matter_del',function(){
        var index = $(this).parent().data('index');
        if (index == undefined || !itemArray[index])return;
        delete itemArray[index];//只是删除内容,数组的长度没有变化
        addData();
    });
    //点击完成
    $('body').on('click','.matter_btn',function(){
        var index = $(this).parent().data('index');
        var item = itemArray[index];
            item.isClick=!item.isClick;
            itemArray[index]=item;
        addData();
    });
    //点击详情跳出蒙板
    //记录点击详情的索引
    var num = 0;
    $('body').on('click','.matter_det',function(){
        var index = $(this).parent().data('index');
        var item = itemArray[index];
        num = index;
        $('.small_T span:first-child').text(item.title);
       $('.big').fadeIn();
    });
    //点击蒙板消失
    $('.big').click(function(){
        $('.big').fadeOut();
    });
    //阻止冒泡
    $('.small').click(function(event){
        event.stopPropagation();
    });
    //点击关闭蒙板消失
    $('.small_T span:last-child').click(function(){
        $('.big').fadeOut();
    });
    //点击输入框跳出时间栏,设置时间
    $.datetimepicker.setLocale('ch');//设置本地时区,ch代表中国
    /*8.22给对应的标签设置对应时间选择器*/
    $('.big .small input').datetimepicker();
    //点击更新,更新数据
    $('.renew').on('click',function(){
        var concent = $('textarea').val();
        var timing = $('.big .small input').val();
        var item = itemArray[num];
        if($.trim(concent)!=''){
            item.content=concent;
        }
        if(timing!=''){
            item.timing=timing;
        }
        item.isDone=false;
        itemArray[num]=item;
        addData();
        $('.big').fadeOut();
    });
    //设置定时器,进行任务提醒
    setInterval(function(){
        var now = new Date();
        var now_time = now.getTime();
        console.log(1);
        for (var i = 0; i < itemArray.length; i++) {
            var obj = itemArray[i];
            if(obj == undefined ||!obj ||obj.timing.length<1||obj.isDone){continue};
            var timing =  new Date(obj.timing);
            var timing_time = timing.getTime();
            if(now_time-timing_time>1){
                console.log(2);
                $('video').get(0).play();
                //$('video').get(0).currentTime=0;
                obj.isDone=true;
                itemArray[i]=obj;
                store.set('itemArray',itemArray);
            }
        }





    },2000);





    function addData() {
        store.set('itemArray',itemArray);
        $('.centen_C').empty();
        $('.centen_B').empty();
        for (var i = 0; i < itemArray.length; i++) {
            var obj = itemArray[i];
            if (obj == undefined || !obj) {
               continue;
            }
            var tag = $('<li data-index="' + i + '">' +
                '<input type="checkbox"  class="matter_btn" '+(obj.isClick?'checked':'')+'>' +
                '<span class="matter_title">' + obj.title + '</span>' +
                '<span class="matter_del">删除</span>' +
                '<span class="matter_det">详情</span>' +
                '</li>');
            if(obj.isClick){
                $('.centen_B').prepend(tag);
            }else {
                //alert(1);
                $('.centen_C').prepend(tag);
            }
        }
    }
});