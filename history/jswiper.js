'use strict';
var Jswiper = function(cls,options) {
    this.options = options;
    this.win = document.querySelector(cls);
    this.itemsWrap = this.win.querySelector(options.itemWrapClass||'.Jswiper-wrap');

    this.item = this.itemsWrap.querySelectorAll(options.itemClass||'.Jswiper-item');
    this.len = this.item.length;
    this.stopMove = false;

    this.init();
    this.bindEvent();


    this.callback = !!options.callback ? options.callback : function (index) {
        //console.log(index);
    };
    this.beforeSwipe = options.beforeSwipe || function(e){

    };
    this.afterSwipe = options.afterSwipe || function(e){

    };

    if(options.navWrapClass){
        this.setNavDots(options.navWrapClass)
    }
};
Jswiper.prototype = {
    init:function(){
        this.winWidth = this.win.offsetWidth;
        this.itemsWrap.style.position = 'absolute';
        this.itemsWrap.style.width = this.winWidth*this.len+'px';

        var that = this;
        for(var i=0; i<this.len; i++){
            this.item[i].style.width = that.winWidth+'px';
            this.item[i].style.float = 'left';
            (this.item[i].getAttribute('dsrc') != '') && (this.item[i].style.background = 'url("'+this.item[i].getAttribute('dsrc')+'")');
            this.item[i].style.backgroundSize = 'cover';
        }

        this.index = 0;
    },
    setNavDots:function(cls){
        var dom =  this.dots = document.querySelector(cls), str = '';
        for(var i=0; i<this.len; i++){
            if(i == 0){
                str+='<span class="swiper-dot active"></span>'
            }else{
                str+='<span class="swiper-dot"></span>'
            }
        }
        dom.innerHTML = str;
    },
    changeDotsActive:function(idx){
        var dots = this.dots.querySelectorAll('.swiper-dot');

        for(var i=0; i<dots.length; i++){
            if(i == idx){
                dots[i].className = 'swiper-dot active';
            }else{
                dots[i].className = 'swiper-dot';
            }
        }
    },
    stopDefault:function (e) {
        e = e || window.event;
        if (e && e.preventDefault) {
            //e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        } else  {
            window.event.returnValue = false;
            e.cancelBubble = true;
            window.event.cancelBubble = true;
        }
        return false;
    },
    transitionEnd:function (){
        var ele = document.createElement('bootstrap');
        var obj = {
            WebkitTransform : 'webkitTransitionEnd',
            MozTransform : 'TransitionEnd',
            MsTransform : 'msTransitionEnd',
            OTransform : 'oTransitionEnd',
            Transform : 'transitionEn'
        };

        for(var i in obj){
            if(ele.style[i] !== undefined ){
                return obj[i];
            }
        }

    }(),
    bindEvent:function(){
        this.histSpan = 0;
        var startTime,endTime,timeSpan,that = this;

        this.itemsWrap.addEventListener('touchstart',function(e){
            that.stopDefault(e);
            !!that.beforeSwipe && that.beforeSwipe(e);
            if(that.stopMove) return;
            that.initX = e.touches[0].clientX;
            that.initY = e.touches[0].clientY;
            that.itemsWrap.className = that.itemsWrap.className.replace('tst','').replace(/(^\s+|\s+$)/,'');
            startTime = new Date().getTime();
        },false);

        this.itemsWrap.addEventListener('touchmove',function(e){
            that.stopDefault(e);
            if(that.stopMove) return;
            that.moveX = e.touches[0].clientX;
            that.moveY = e.touches[0].clientY;

            that.spanX = that.moveX-that.initX;
            that.spanY = that.moveY-that.initY;

            if(Math.abs(that.spanY)<Math.abs(that.spanX)){
                //最后一张或者第一张阻止相应的滑动
                if(that.spanX >0 && that.index== 0 || that.spanX<0 && that.index == (that.len-1)) {
                    return;
                }
                //跟随滑动
                that.itemsWrap.style.transform = 'translate3d('+(that.spanX+that.histSpan)+'px,0,0)';
            }else{
                console.log('vertical move')
            }
        },false);
        this.itemsWrap.addEventListener('touchend',function(e){
            if(that.stopMove) return;
            endTime = new Date().getTime();

            timeSpan = endTime- startTime;

            if(timeSpan<300 && timeSpan>10 && Math.abs(that.spanX)>10 || Math.abs(that.spanX)>that.winWidth/3){
                if(that.spanX>0){
                    that.index--;
                    if(that.index<0){
                        that.index=0
                    }
                    that.direction = 'right';
                }else{
                    that.index++;
                    if(that.index>=that.len){
                        that.index = that.len-1;
                    }
                    that.direction = 'left';
                }
            }

            //重置
            timeSpan = 0;
            that.spanX = 0;
            that.spanY = 0;
            //添加过渡transition类
            if(that.itemsWrap.className.indexOf('tst')==-1){
                that.itemsWrap.className = that.itemsWrap.className+' tst';
            }
            //移动方法
            that.moveTo(that.index);
            //记录图片的滑动位置
            that.histSpan = getComputedStyle(that.itemsWrap).transform.split(',')[4]*1;

        },false);
        this.itemsWrap.addEventListener(this.transitionEnd,function(){
            if(that.stopMove) return;
            //记录图片的滑动位置
            that.histSpan = getComputedStyle(that.itemsWrap).transform.split(',')[4]*1;
            //滑动结束的回调
            !!that.afterSwipe && that.afterSwipe(that.index);
            //执行回调
            that.callback(that.index);
            //检查配置项，圆点功能
            !!that.options.navWrapClass && that.changeDotsActive(that.index);

        },false);

    },
    moveTo:function(idx){
        if(idx === undefined){
            console.error('该函数入参为: '+idx+' \n moveTo函数需要传入数字类型参数.');
            return;
        }
        this.itemsWrap.style.transform = 'translate3d('+(-this.winWidth*idx)+'px,0,0)';
        this.index = idx;
    }
};