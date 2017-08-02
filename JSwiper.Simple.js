var JSwiper = function (selector, options) {
    this.el = typeof selector == 'string' ? document.querySelector(selector) : selector;
    this.wrapper = this.el.children[0];
    this.index = 0;
    this.count = this.wrapper.querySelectorAll('.swiper-slide').length;
    this.init(options || {});
};
JSwiper.prototype = {
    init: function (options) {
        this.afterSlide = options.afterSlide || function () { };
        this.autoplay = options.autoplay || false;
        this.direction = options.direction || 'horizontal';
        this.roadway = this.direction==='horizontal'?this.el.offsetWidth:this.el.offsetHeight;
        if(this.direction!=='horizontal'){
            this.el.children[0].classList.add('swiper-vertical');
        }
        if (this.autoplay) {
            this.autoPlay()
        }
        this.bindEvent();
    },
    bindEvent: function () {
        var index = this.index;
        var count = this.count;
        var el = this.el;
        var wrapper = this.el.children[0];
        var roadway = this.roadway;
        var direction = this.direction;
        var start, move, span, end = 0;

        el.addEventListener('touchstart', function (e) {
            index = this.index;
            if (this.timer) clearInterval(this.timer);
            
            span = 0;
            wrapper.classList.remove('tst');
            end = -index * this.roadway;
            start = direction=='horizontal'?e.touches[0].pageX:e.touches[0].pageY;
        }.bind(this));
        el.addEventListener('touchmove', function (e) {
            move = direction=='horizontal'?e.touches[0].pageX:e.touches[0].pageY;

            span = move - start;

            if (index == 0 && span > 0 || index == count - 1 && span < 0) return;

            wrapper.style.transform = direction=='horizontal'?'translate3d(' + (end + span) + 'px,0,0)':'translate3d(0,' + (end + span) + 'px,0)'

        });
        el.addEventListener('touchend', function () {
            wrapper.classList.add('tst');

            if (Math.abs(span) > roadway / 3) {

                if (span > 0) {
                    //去往上一帧
                    console.log('去往上一帧')
                    index--;
                    if (index <= 0) index = 0
                }
                if (span < 0) {
                    //去下一帧
                    console.log('去往下一帧')
                    index++;
                    if (index >= count - 1) index = count - 1
                }
            }
            this.index = index;
            this.moveTo(index);
        }.bind(this))
    },
    moveTo: function (index) {
        this.wrapper.style.transform = this.direction=='horizontal'?'translate3d(' + (-index * this.roadway) + 'px,0,0)':'translate3d(0,' + (-index * this.roadway) + 'px,0)'
        this.afterSlide(index);
    },
    autoPlay: function () {
        var index = this.index;
        var time = typeof this.autoplay == 'number' ? this.autoplay : 3000;
        var that = this;
        this.wrapper.classList.add('tst');
        this.timer = setInterval(function () {
            index++;

            if (index >= that.count) {
                index = 0
            }
            that.index = index;
            that.moveTo(index);
        }, time)
    }
};
