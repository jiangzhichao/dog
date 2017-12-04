/**
 * Created by jiang_mac on 2016/10/13.
 */
function Ball(config) {
    if (!config) config = {};
    var randomR = Math.floor(Math.random() * 30 + 1);
    var contentEl = config.content ? document.getElementById(config.content) : document.body;
    var el = document.createElement('div');

    this.contentEl = contentEl;
    this.el = el;
    this.r = config.r || randomR;
    this.backgroundColor = config.backgroundColor || 'rgba(' + Math.floor(Math.random() * 255 + 1) + ',' + Math.floor(Math.random() * 255 + 1) + ',' + Math.floor(Math.random() * 255 + 1) + ',' + Math.random() + ')';
    this.left = config.left || Math.floor(Math.random() * (contentEl.offsetWidth - (config.r || randomR) * 2) + 1);
    this.top = config.top || Math.floor(Math.random() * (contentEl.offsetHeight - (config.r || randomR) * 2) + 1);
    this.speed = config.speed || Math.floor(Math.random() * 15 + 1);
    this.move = typeof config.move === 'undefined' ? true : config.move;
    this.life = config.life || 1;
    this.type = config.type || 'free';
    this.crash = typeof config.crash == 'undefined' ? false : config.crash;
    this.keyboard = typeof config.keyboard === 'undefined' ? false : config.keyboard;
    this.pause = false;
    this.maxLife = config.life || 1;
    this.spring = typeof config.spring === 'undefined' ? false : config.spring;
    this.state = Math.floor(Math.random() * 4 + 1);
    this.moveSpeedIndex = 0;
    this.moveSpeed = 2;
    this.checkSpeedIndex = 0;
    this.checkSpeed = 100;
    this.time = null;

    this.init();
}

Ball.prototype.init = function () {
    var elStyle = this.el.style;
    elStyle.position = 'absolute';
    elStyle.width = 2 * this.r + 'px';
    elStyle.height = 2 * this.r + 'px';
    elStyle.backgroundColor = this.backgroundColor;
    elStyle.borderRadius = '100000px';
    elStyle.left = this.left + 'px';
    elStyle.top = this.top + 'px';
    this.el.style.textAlign = 'center';
    this.contentEl.appendChild(this.el);
    this.contentEl.style.position = 'relative';

    this.setLife(this.life);
    this.setPause();

    if (window.BallArray) {
        window.BallArray.push(this);
    } else {
        window.BallArray = [];
        window.BallArray.push(this);
    }

    if (this.crash) this.startCrash();
    if (this.spring) this.startSpring();
    if (this.keyboard) this.onKeyDown();
    if (this.move && this.type === 'free') this.moving();
    if (this.type === 'bullet') this.up();
};

Ball.prototype.onKeyDown = function () {
    var self = this;
    document.addEventListener('keydown', function (e) {
        var el = self.el;
        var speed = self.speed;
        if (e.keyCode === 37) {
            el.style.left = el.offsetLeft - speed + 'px';
            el.left = self.left = el.offsetLeft;
        } else if (e.keyCode === 38) {
            el.style.top = el.offsetTop - speed + 'px';
            el.top = self.top = el.offsetTop;
        } else if (e.keyCode === 39) {
            el.style.left = el.offsetLeft + speed + 'px';
            el.left = self.left = el.offsetLeft;
        } else if (e.keyCode === 40) {
            el.style.top = el.offsetTop + speed + 'px';
            el.top = self.top = el.offsetTop;
        }
    });
};

Ball.prototype.setPause = function () {
    var self = this;
    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 13) {
            if (!self.pause) {
                cancelAnimationFrame(self.time);
                self.pause = true;
            } else {
                if (self.move && self.type === 'free') self.moving();
                if (self.type === 'bullet') self.up();
                self.pause = false;
            }
        }
    });
};

Ball.prototype.moving = function () {
    var self = this;
    var el = this.el;
    var speed = self.speed;
    var contentEl = this.contentEl;
    var width = contentEl.offsetWidth;
    var height = contentEl.offsetHeight;

    run();

    function run() {
        self.time = requestAnimationFrame(run);
        self.moveSpeedIndex += 1;
        if (self.moveSpeedIndex === self.moveSpeed) {
            self.moveSpeedIndex = 0;
            switch (self.state) {
                case 1:
                    upLeft();
                    break;
                case 2:
                    upRight();
                    break;
                case 3:
                    downLeft();
                    break;
                case 4:
                    downRight();
                    break;
            }
        }
    }

    function upLeft() {
        el.style.left = el.offsetLeft - speed + 'px';
        el.style.top = el.offsetTop - speed + 'px';
        var left = self.left = el.offsetLeft;
        var top = self.top = el.offsetTop;

        if (left < 0) {
            self.state = self.state = 2;
        } else if (top < 0) {
            self.state = self.state = 3;
        }
    }

    function upRight() {
        var elWidth = self.r * 2;

        el.style.left = el.offsetLeft + speed + 'px';
        el.style.top = el.offsetTop - speed + 'px';
        var left = self.left = el.offsetLeft;
        var top = self.top = el.offsetTop;

        if (left > width - elWidth) {
            self.state = self.state = 1;
        } else if (top < 0) {
            self.state = self.state = 4;
        }
    }

    function downLeft() {
        var elHeight = self.r * 2;

        el.style.left = el.offsetLeft - speed + 'px';
        el.style.top = el.offsetTop + speed + 'px';
        var left = self.left = el.offsetLeft;
        var top = self.top = el.offsetTop;

        if (left < 0) {
            self.state = self.state = 4;
        } else if (top > height - elHeight) {
            self.state = self.state = 1;
        }
    }

    function downRight() {
        var elWidth = self.r * 2;
        var elHeight = self.r * 2;

        el.style.left = el.offsetLeft + speed + 'px';
        el.style.top = el.offsetTop + speed + 'px';
        var left = self.left = el.offsetLeft;
        var top = self.top = el.offsetTop;

        if (left > width - elWidth) {
            self.state = self.state = 3;
        } else if (top > height - elHeight) {
            self.state = self.state = 2;
        }
    }
};

Ball.prototype.eat = function (eneR) {
    var r = this.r;
    var oneVolume = Math.PI * r * r;
    var twoVolume = Math.PI * eneR * eneR;
    var allVolume = oneVolume + twoVolume;
    r = this.r = parseInt(Math.sqrt(allVolume / Math.PI));
    this.el.style.width = r * 2 + 'px';
    this.el.style.height = r * 2 + 'px';
    this.setLife(this.life);
};

Ball.prototype.destroy = function () {
    var parentNode = this.el.parentNode;
    if (parentNode) {
        parentNode.removeChild(this.el);
        this.life = -1;
        clearInterval(this.time);
    }
};

Ball.prototype.hit = function () {
    this.star();
    var life = this.life -= 1;
    this.setLife(life);
    if (this.life < 1) this.destroy();
};

Ball.prototype.setLife = function (life) {
    if (this.el) this.el.innerHTML = '<span style="opacity: 0.2; font-size: 0.5em; color: #ffffff; line-height: ' + this.r * 2 + 'px">' + (life === 1 ? '' : life) + '</span>';
};

Ball.prototype.star = function () {

};

Ball.prototype.up = function () {
    var self = this;
    var speed = this.speed;
    var el = this.el;
    var left = this.left = this.left - this.r;
    el.style.left = left + 'px';
    this.time = setInterval(run, 40);
    function run() {
        el.style.top = el.offsetTop - speed + 'px';
        self.top = el.offsetTop;
        if (self.top < 0) {
            clearInterval(self.time);
            self.destroy();
        }
    }
};

Ball.prototype.startCrash = function () {
    if (!window.crashTime) {
        console.log('开始碰撞检测');
        window.crashTime = setInterval(checkCrash, 40);
    }

    function checkCrash() {
        for (var i = 0; i < BallArray.length; i++) {
            var oneBall = BallArray[i];
            if (!oneBall || !oneBall.crash) continue;
            var oneR = oneBall.r;
            var oneLeft = oneBall.left;
            var oneTop = oneBall.top;

            for (var j = i + 1; j < BallArray.length; j++) {
                var twoBall = BallArray[j];
                if (!twoBall || !twoBall.crash) continue;
                var twoR = twoBall.r;
                var twoLeft = twoBall.left;
                var twoTop = twoBall.top;

                if (distance(oneR, oneLeft, oneTop, twoR, twoLeft, twoTop)) {
                    if (oneR > twoR) {
                        twoBall.hit();
                        if (twoBall.life < 1) {
                            BallArray[j] = null;
                            oneBall.eat(twoR);
                        }
                    } else {
                        oneBall.hit();
                        if (oneBall.life < 1) {
                            BallArray[i] = null;
                            twoBall.eat(oneR);
                        }
                    }
                }
            }
        }

        BallArray = BallArray.filter(function (item) {
            return !!item === true;
        });

        if (BallArray.length === 1) {
            console.log('-------- 检测碰撞停止 -------');
            clearInterval(window.crashTime);
        }

        function distance(oneR, oneLeft, oneTop, twoR, twoLeft, twoTop) {
            var oneCenterX = oneLeft + oneR;
            var oneCenterY = oneTop + oneR;
            var twoCenterX = twoLeft + twoR;
            var twoCenterY = twoTop + twoR;
            var centerLength = Math.sqrt((oneCenterX - twoCenterX) * (oneCenterX - twoCenterX) + (oneCenterY - twoCenterY) * (oneCenterY - twoCenterY));
            if (oneR - twoR === 0) {
                if (oneLeft - twoLeft === 0 && oneTop - twoTop === 0) {
                    return true;
                }
            } else if (oneR - twoR > 0) {
                if (centerLength <= oneR - twoR) {
                    return true
                }
            } else if (oneR - twoR < 0) {
                if (centerLength <= twoR - oneR) {
                    return true
                }
            }
            return false;
        }
    }
};

Ball.prototype.startSpring = function () {
    if (!window.springTime) {
        console.log('开始对撞检测');
        window.springTime = setInterval(checkSpring, 40);
    }

    checkSpring();

    function checkSpring() {
        window.springTime = requestAnimationFrame(checkSpring);

        for (var i = 0; i < BallArray.length; i++) {
            var oneBall = BallArray[i];
            if (!oneBall || !oneBall.spring) continue;
            var oneR = oneBall.r;
            var oneLeft = oneBall.left;
            var oneTop = oneBall.top;

            for (var j = i + 1; j < BallArray.length; j++) {
                var twoBall = BallArray[j];
                if (!twoBall || !twoBall.spring) continue;
                var twoR = twoBall.r;
                var twoLeft = twoBall.left;
                var twoTop = twoBall.top;

                if (distance(oneR, oneLeft, oneTop, twoR, twoLeft, twoTop)) {
                    oneBall.state = reverseDirection(oneBall.state);
                    twoBall.state = reverseDirection(twoBall.state);
                }
            }
        }

        BallArray = BallArray.filter(function (item) {
            return !!item === true;
        });

        if (BallArray.length === 1) {
            console.log('-------- 检测碰撞停止 -------');
            cancelAnimationFrame(window.springTime);
        }

        function reverseDirection(state) {
            switch (state) {
                case 1:
                    return 4;
                case 2:
                    return 3;
                case 3:
                    return 2;
                case 4:
                    return 1;
            }
        }

        function distance(oneR, oneLeft, oneTop, twoR, twoLeft, twoTop) {
            var oneCenterX = oneLeft + oneR;
            var oneCenterY = oneTop + oneR;
            var twoCenterX = twoLeft + twoR;
            var twoCenterY = twoTop + twoR;
            var centerLength = Math.sqrt((oneCenterX - twoCenterX) * (oneCenterX - twoCenterX) + (oneCenterY - twoCenterY) * (oneCenterY - twoCenterY));
            if (oneR + twoR >= centerLength) return true;
            return false;
        }
    }
};

export default Ball;
