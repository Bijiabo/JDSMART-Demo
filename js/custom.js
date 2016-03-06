var ARC;

$(function(){
    var keyboardQueryString = "#direction-keyboard",
        keysContainerQueryString = "#keys-container";

    ARC = new _AnnulusRemoteController(keyboardQueryString, keysContainerQueryString);

    var keyTapCount = {
        up: 0,
        right: 0,
        down: 0,
        left: 0,
        center: 0
    };

    var channel = 0,
        maxChannel = 10,
        volume = 0;
    var changeChannel = function(change) {
        if (channel + change >= 0 && channel + change <= maxChannel) {
            channel += change;
        } else if (channel + change > maxChannel) {
            channel = 0;
        } else {
            channel = maxChannel;
        }
        showTip("Channel " + channel);
    };
    var changeVolume = function(change) {
        if (volume + change >= 0) {
            volume += change;
        }
        showTip("Volume " + volume);
    };

    var playState = true;
    var togglePlayState = function() {
        playState = !playState;
        showTip(playState ? "Play" : "Pause");
    };

    var showTip = function(text) {
        $("#indicator").text(text);
    };

    ARC.setTapFunction(function(keyName){
        //keyTapCount[keyName] += 1;
        //$("#indicator").text(keyName + " " + keyTapCount[keyName]);

        switch (keyName) {
            case "up":
                changeChannel(1);
                break;
            case "down":
                changeChannel(-1);
                break;
            case "left":
                changeVolume(-1);
                break;
            case "right":
                changeVolume(1);
                break;
            case "center":
                togglePlayState();
                break;
            default:
                break;
        }
    });
});

var _AnnulusRemoteController = function(keyboardQueryString, keysContainerQueryString) {

    var self = this;
    this.touchTime = {
        start: (new Date()).getTime(), //触摸开始时间, 记录为1970.1.1至今的毫秒数
        end: (new Date()).getTime(), //触摸结束时间, 同上
        duration: 0 //触摸持续时间
    };

    this.intervalTime = 500; //间隔定时器默认间隔时间,默认为500ms

    this.keyboardQueryString = keyboardQueryString;
    this.keyboardElement = $(this.keyboardQueryString);
    this.keysContainerQueryString = keysContainerQueryString;
    this.keysContainer = $(this.keysContainerQueryString);

    this.keysContainerPosition = {
        top: this.keyboardElement.offset().top,
        left: this.keyboardElement.offset().left
    };

    this.keysContainerRadius = this.keysContainer.width()/2;
    this.centerKeyRadius = $(".center-key").width()/2;

    this.activeButtonStatusClassName = "active"; //活跃按钮 CSS 类名
    this.currentActiveButtonKeyName = ""; //当前活跃按钮的按键名

    // 当前控件状态
    this.status = {
        touchMode: this.touchAction.none
    };

    // MARK: - bind events

    $(document).on(this.touchAction.start, keyboardQueryString, function(event){
        self.updateTouchAction(self.touchAction.start);
        var element = $(this);
        self.updateCurrentTouchButton(element, event);
        self.intervalID = setInterval(function(){self.timer(self);}, self.intervalTime);
    });

    $(document).on(this.touchAction.end, keyboardQueryString, function(event){
        self.updateTouchAction(self.touchAction.end);
        self.clearCurrentActiveButtonState();

        if (self.touchTime.duration<=200) { // tap
            self.tapFunction(self.currentActiveButtonKeyName);
        } else { // touch down and moved

        }

        clearInterval(self.intervalID);
    });

    $(document).on(this.touchAction.move, keyboardQueryString, function(event){
        self.updateTouchAction(self.touchAction.move);
        var element = $(this);
        self.updateCurrentTouchButton(element, event);
    });

    this.tapFunction = function(keyName){
        console.log(new Date());
        console.log("Default tap function. KeyName:"+keyName);
    };

    this.longTapFunction = function(keyName){
        console.log(new Date());
        console.log("Default long tap function. KeyName:"+keyName);
    };

};

_AnnulusRemoteController.prototype.timer = function(self) {
    /*
     * 间隔定时器,用于捕获长按事件
     */
    self.tapFunction(self.currentActiveButtonKeyName);
};

_AnnulusRemoteController.prototype.setTapFunction = function(func) {
    /*
     * 设定点击事件
     */
    this.tapFunction = func;
};

_AnnulusRemoteController.prototype.touchAction = {
    start: "touchstart",
    end: "touchend",
    move: "touchmove",
    none: "none"
};

_AnnulusRemoteController.prototype.updateTouchAction = function(action) {
    switch (action) {
        case this.touchAction.start:
            this.touchTime.start = (new Date()).getTime();
            this.touchTime.duration = 0;
            this.status.touchMode = this.touchAction.start;
            break;
        case this.touchAction.end:
            this.touchTime.end = (new Date()).getTime();
            this.touchTime.duration = this.touchTime.end - this.touchTime.start;
            this.status.touchMode = this.touchAction.none;
            break;
        case this.touchAction.move:
            this.status.touchMode = this.touchAction.move;
            break;
        default:
            this.status.touchMode = this.touchAction.none;
            break;
    }
};

_AnnulusRemoteController.prototype.setStatusToActiveForButtonByKeyName = function(keyName) {

    if (isEmptyForString(keyName)) {
        this.currentActiveButtonKeyName = keyName;
        this.clearCurrentActiveButtonState();
        return;
    }

    var targetButton = this.buttonForKeyName(keyName);

    if (targetButton.length===0) {return;}

    //console.log("this.currentActiveButtonKeyName: "+this.currentActiveButtonKeyName+", keyName:"+keyName);
    //console.log(this.status.touchMode);

    if (this.currentActiveButtonKeyName===keyName &&
        (this.status.touchMode===this.touchAction.move||this.status.touchMode===this.touchAction.end)) {
        return;
    }
    if (this.isActiveForButton(targetButton)) {return;}

    this.clearCurrentActiveButtonState();
    targetButton.addClass(this.activeButtonStatusClassName);
    this.currentActiveButtonKeyName = keyName;
};

_AnnulusRemoteController.prototype.isActiveForButton = function(button) {
    return button.hasClass(this.activeButtonStatusClassName);
};

_AnnulusRemoteController.prototype.buttonForKeyName = function(keyName) {
    if (isEmptyForString(keyName)) {return [];}
    return this.keysContainer.find(".keys-box .key[key-name="+keyName+"], .center-key[key-name="+keyName+"]");
};

_AnnulusRemoteController.prototype.clearCurrentActiveButtonState = function() {
    this.keysContainer.find(".keys-box .key, .center-key").removeClass(this.activeButtonStatusClassName);
};

_AnnulusRemoteController.prototype.updateCurrentTouchButton = function(element, event) {
    event.preventDefault();

    var elementCenter = {
        x: element.width()/2,
        y: element.height()/2
    };
    var currentTargetPosition = {
        x: event.originalEvent.touches[0].pageX - this.keysContainerPosition.left,
        y:event.originalEvent.touches[0].pageY - this.keysContainerPosition.top
    };
    var distanceToCenter = Math.sqrt( Math.pow(currentTargetPosition.x - elementCenter.x, 2) + Math.pow(currentTargetPosition.y - elementCenter.y, 2) );
    var angleToCenter = Math.atan2(elementCenter.y - currentTargetPosition.y, elementCenter.x - currentTargetPosition.x) * 180 / Math.PI

    var targetActiveButton = "";

    if (distanceToCenter > this.keysContainerRadius) {
        targetActiveButton = "";
    } else if (distanceToCenter > this.centerKeyRadius) {
        switch(true) {
            case -45<angleToCenter && angleToCenter<=45:
                targetActiveButton = "left";
                break;
            case 45<angleToCenter && angleToCenter<=135:
                targetActiveButton = "up";
                break;
            case 135<angleToCenter || angleToCenter<=-135:
                targetActiveButton = "right";
                break;
            case -135<angleToCenter && angleToCenter<=-45:
                targetActiveButton = "down";
                break;
            default:
                break;
        }
    } else {
        targetActiveButton = "center";
    }

    this.setStatusToActiveForButtonByKeyName(targetActiveButton);
};