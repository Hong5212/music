/*全局的移动默认行为取消*/
;(function () {
    var wrap = document.querySelector(".wrap");
    document.addEventListener("touchstart", function (event) {
        event.preventDefault();
    })
})();

var size;
/*rem适配*/
(function (designWidth) {
    size = document.documentElement.clientWidth / (designWidth / 100);
    document.documentElement.style.fontSize = size + "px";
    document.body.style.fontSize = "14px";
}(1080));

(function () {
    window.onload = function () {
        menuShowHide();
        navHandle();
        lbt();
        addScrollBar();
        handleTabNav();
    };

    /*菜单显示和隐藏*/
    function menuShowHide() {
        var activeMenu = document.querySelector(".active_menu");
        var menu = document.querySelector(".menu");
        $(".active_menu").tap(function (event) {
            $(".menu").toggle();

        });
        document.addEventListener("touchstart", function (event) {
            if (event.changedTouches[0].target.id != "active_menu") {
                $(".menu").hide();
            }
        })
    }

    /*处理导航*/
    function navHandle() {
        var activeIndex = 0;
        var lis = document.querySelectorAll(".nav li");
        for (var i = 0; i < lis.length; i++) {
            // 记录每一个li所在数组的位置
            lis[i].i = i;
            $(lis[i]).tap(function (event) {
                lis[activeIndex].classList.remove("active");
                this.classList.add("active");
                // 把每次点击的li记录下来
                activeIndex = this.i;
            });
        }

        var initX = 0;
        $(".nav").pan(function (event) {
            this.style.transition = "";
            var deltaX = event.deltaX;
            $(this).transform("translate3d", deltaX + initX, 0, 0);
            if (event.end) {
                initX += deltaX;
                if (initX >= 0) {
                    initX = 0;
                    // 贝塞尔曲线
                    this.style.transition = "transform 0.4s cubic-bezier(.28,.19,.95,1.75)";
                    $(this).transform("translate3d", initX, 0, 0);
                } else if (initX < -this.offsetWidth + this.parentElement.offsetWidth) {
                    initX = -this.offsetWidth + this.parentElement.offsetWidth;
                    this.style.transition = "transform 0.4s cubic-bezier(.28,.19,.95,1.75)";
                    $(this).transform("translate3d", initX, 0, 0);
                }
            }
        });
    }

    /*轮播图*/
    function lbt() {
        var spiders = document.querySelector(".spiders");
        var spans = document.querySelectorAll(".indicator span");
        var w = window.innerWidth;
        var startX, startiX;
        var currentIndex = 0;
        var lastIndex = currentIndex;
        $(".spiders").pan(function (event) {
            // 如果手指移动的距离小于 20, 则不滑动
            if (!event.start && Math.abs(event.deltaX) < 20) return;

            if (event.start) {
                clearInterval(id);
                startX = $(this).tx();
                startiX = $(".indicator i").tx();
                /*每次手指触摸开始的时候得到这个时候的translateX的值*/
            }

            $(this).transform("translate3d", event.deltaX + startX);
            // 处理红色的球随着手指的移动
            if ((startiX == 0 && event.deltaX > 0) || (startiX == disI * 4 && event.deltaX < 0)) {
                $(".indicator i").transform("translate3d", startiX + event.deltaX / w * disI * 4);
            } else {
                $(".indicator i").transform("translate3d", startiX - event.deltaX / w * disI);
            }

            if (event.end) {
                var i = Math.round(event.deltaX / w);    // (-1, 1) 四舍五入 值: 1, 0, -1
                currentIndex -= i;
                play();
                /*开启自动播放的功能*/
                autoPlay();
            }
        });

        spiders.addEventListener("transitionend", function (event) {
            this.style.transition = "";
            i.style.transition = "";
            /*过渡结束之后, 清除过渡*/
            if (currentIndex <= -1) {
                currentIndex = 4;
                $(this).transform("translate3d", -currentIndex * w);
            } else if (currentIndex >= 5) {
                currentIndex = 0;
                $(this).transform("translate3d", -currentIndex * w);
            }
            // 过渡结束的时候, 把currentIndex值存为上一次的值.
            lastIndex = currentIndex;
        });

        autoPlay();
        var id;

        function autoPlay() {
            id = setInterval(function () {
                currentIndex++;
                play();
            }, 2000);
        }

        function play() {
            spiders.style.transition = "transform 0.4s";
            i.style.transition = "transform 0.4s";
            $(spiders).transform("translate3d", -currentIndex * w);

            var j = currentIndex;
            j = j == -1 ? 4 : j;
            j = j == 5 ? 0 : j;
            $(".indicator i").transform("translate3d", j * disI)
        }

        var disI;
        var i = document.querySelector(".indicator i");
        initMoveI();

        function initMoveI() {
            disI = spans[1].offsetLeft - spans[0].offsetLeft;
            var firstSpan = spans[0];
            i.style.left = firstSpan.offsetLeft + "px";

        }
    }

    /*添加滚动条*/
    function addScrollBar() {
        /*先把滚动条添加上去*/
        $(".content").scrollBar("gray", 4);

        var startY;
        $(".content").pan(function (event) {
            if (!event.start && !event.end && Math.abs(event.deltaY) < 20) return;

            if (event.start) {
                this.style.transition = "";
                startY = $(this).ty();
            }
            $(this).transform("translate3d", 0, startY + event.deltaY);
            $(this).scroll(startY + event.deltaY, true);

            if (event.end) {
                var ty = $(this).ty();
                $(this).scroll(ty, false);
                if (ty >= 0) {
                    this.style.transition = "transform 0.6s";
                    $(this).transform("translate3d", 0, 0);
                } else if (ty <= -(this.offsetHeight + 2.7 * size - this.parentElement.offsetHeight)) {
                    this.style.transition = "transform 0.6s";
                    $(this).transform("translate3d", 0, -(this.offsetHeight + 2.7 * size - this.parentElement.offsetHeight));
                }
            }
        });
    }

    tabChange();

    /*滑动tab*/
    function tabChange() {
        var tabContent = document.querySelector(".tab_content");
        var currentIndex = 0;
        var w = window.innerWidth;
        var startX;
        $(".tab_content").pan(function (event) {
            if (event.start) {
                this.style.transition = "";
                startX = $(this).tx();
            }
            $(this).transform("translate3d", startX + event.deltaX);
            if (event.end) {
                // currentIndex = 0;   -1 0 1
                // 0 + -1 = -1
                this.style.transition = "transform 0.4s";
                currentIndex += Math.round(event.deltaX / w);
                $(this).transform("translate3d", currentIndex * w);
                changeTabNav(Math.round(event.deltaX / w));
            }
        });

        /*当左右滑动的时候，让tabnav进行相应的跟随*/
        function changeTabNav(dir) {
            if (dir == -1) { //手向左滑动
                lastId++;
                lastId = lastId >= 7 ? 1 : lastId;
            } else if (dir == 1) { //手向右滑动
                lastId--;
                lastId = lastId <= 0 ? 6 : lastId;
            }
            // lastId == 2
            radios[lastId - 1].checked = true;
        }

        tabContent.addEventListener("transitionend", function (event) {
            setInterval(function () {
                currentIndex = 0;
                tabContent.style.transition = "";
                $(tabContent).transform("translate3d", 0);
            }, 1000);
        })
    }

    var lastId = 1;
    var radios = document.querySelectorAll(".tab_nav input");

    /*处理tab的导航条标签的事件*/
    function handleTabNav() {
        var w = window.innerWidth;
        for (var i = 0; i < radios.length; i++) {
            /*监听单选按钮的change事件*/
            radios[i].onchange = function (event) {
                var currentId = this.id;
                if (currentId > lastId) {
                    $(".tab_content").transform("translate3d", -w)
                        .transition("transform 0.4s");
                } else {
                    $(".tab_content").transform("translate3d", w)
                        .transition("transform 0.4s");
                }
                lastId = currentId;
            }
        }
    }
})();



