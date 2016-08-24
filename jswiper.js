var Jswiper = function(cls,options) {
    this.win = document.querySelector(cls);
    this.itemsWrap = this.win.querySelector('.Jswiper-wrap');
    this.item = this.itemsWrap.querySelectorAll('.Jswiper-item');
    this.len = this.item.length;
    this.init();
    this.bindEvent();

    this.callback = !!options.callback ? options.callback : function (index) {
        console.log(index);
    };
    this.options = options;
    if(options.navWrapClass){
        this.setNavDots(options.navWrapClass)
    }
};
Jswiper.prototype = {
    init:function(){
        this.winWidth = this.win.offsetWidth;
        this.itemsWrap.style.width = this.winWidth*this.len+'px';
        var that = this;
        this.item.forEach(function(v,i){
            v.style.width = that.winWidth+'px';
            (v.getAttribute('dsrc') != '') && (v.style.background = 'url("'+v.getAttribute('dsrc')+'")');
            v.style.backgroundSize = 'cover';
        })
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
        var that = this;
        this.histSpan = 0;
        this.index = 0;
        this.itemsWrap.addEventListener('touchstart',function(e){
            that.stopDefault(e);
            that.initX = e.touches[0].clientX;
            that.initY = e.touches[0].clientY;
            that.itemsWrap.className = that.itemsWrap.className.replace('tst','').replace(/(^\s+|\s+$)/,'');
        },false);

        this.itemsWrap.addEventListener('touchmove',function(e){
            that.stopDefault(e);

            that.moveX = e.touches[0].clientX;
            that.moveY = e.touches[0].clientY;

            that.spanX = that.moveX-that.initX;
            that.spanY = that.moveY-that.initY;

            if(Math.abs(that.spanY)<Math.abs(that.spanX)){
                //最后一张或者第一张阻止相应的滑动
                if(that.spanX >0 && that.index== 0 || that.spanX<0 && that.index == (that.len-1)) return;
                //跟随滑动
                that.itemsWrap.style.transform = 'translate3d('+(that.spanX+that.histSpan)+'px,0,0)';
            }else{
                console.log('垂直方向的移动')
            }
        },false);
        this.itemsWrap.addEventListener('touchend',function(e){

            if(Math.abs(that.spanX)>that.winWidth/3){
                if(that.spanX>0){
                    that.direction = 'right';
                    that.index--;
                    if(that.index<0){
                        that.index=0
                    }
                }else{
                    that.direction = 'left';
                    that.index++;
                    if(that.index>=that.len){
                        that.index = that.len-1;
                    }
                }
            }

            that.itemsWrap.className = that.itemsWrap.className+' tst';

            that.moveTo(that.index);
            //记录图片的滑动位置
            that.histSpan = getComputedStyle(that.itemsWrap).transform.split(',')[4]*1;

        },false);
        this.itemsWrap.addEventListener(this.transitionEnd,function(){
            //记录图片的滑动位置
            that.histSpan = getComputedStyle(that.itemsWrap).transform.split(',')[4]*1;
            //执行回调
            that.callback(that.index);
            //检查配置项，圆点功能
            !!that.options.navWrapClass && that.changeDotsActive(that.index);
        },false)
    },
    moveTo:function(idx){
        if(idx === undefined){
            console.error('方法入参为:'+idx+'.  \nmoveTo函数需要传入数字类型参数.');
            return;
        }
        this.itemsWrap.style.transform = 'translate3d('+(-this.winWidth*idx)+'px,0,0)';
        this.index = idx;
    }
};