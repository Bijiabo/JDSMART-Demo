var ARC;

$(function(){
    var keyboardQueryString = "#direction-keyboard",
        keysContainerQueryString = "#keys-container";

    ARC = new _AnnulusRemoteController(keyboardQueryString, keysContainerQueryString);
});

var _AnnulusRemoteController = function(keyboardQueryString, keysContainerQueryString) {

    var self = this;
    this.touchTime = {
        start: (new Date()).getTime(), //触摸开始时间, 记录为1970.1.1至今的毫秒数
        end: (new Date()).getTime(), //触摸结束时间, 同上
        duration: 0 //触摸持续时间
    };

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

    // bind events

    $(document).on(this.touchAction.start, keyboardQueryString, function(event){
        self.updateTouchAction(self.touchAction.start);
        var element = $(this);
        self.updateCurrentTouchButton(element, event);
    });

    $(document).on(this.touchAction.end, keyboardQueryString, function(event){
        self.updateTouchAction(self.touchAction.end);
        var element = $(this);
        //self.updateCurrentTouchButton(element, event);
        self.clearCurrentActiveButtonState();
    });

    $(document).on(this.touchAction.move, keyboardQueryString, function(event){
        var element = $(this);
        self.updateCurrentTouchButton(element, event);
    });

};

_AnnulusRemoteController.prototype.touchAction = {
    start: "touchstart",
    end: "touchend",
    move: "touchmove"
};

_AnnulusRemoteController.prototype.updateTouchAction = function(action) {
    switch (action) {
        case this.touchAction.start:
            this.touchTime.start = (new Date()).getTime();
            this.touchTime.duration = 0;
            break;
        case this.touchAction.end:
            this.touchTime.end = (new Date()).getTime();
            this.touchTime.duration = this.touchTime.end - this.touchTime.start;
            break;
        default:
            break;
    }
};

_AnnulusRemoteController.prototype.setStatusToActiveForButtonByKeyName = function(keyName) {

    if (isEmptyForString(this.currentActiveButtonKeyName)) {
        this.currentActiveButtonKeyName = keyName;
        this.clearCurrentActiveButtonState();
        return;
    }

    var targetButton = this.buttonForKeyName(keyName);

    if (targetButton.length===0) {
        p("targetButton length => 0");
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
    return this.keysContainer.find("#keys-box .key[key-name="+keyName+"], .center-key[key-name="+keyName+"]");
};

_AnnulusRemoteController.prototype.clearCurrentActiveButtonState = function() {
    this.keysContainer.find("#keys-box .key, .center-key").removeClass(this.activeButtonStatusClassName);
};

_AnnulusRemoteController.prototype.updateCurrentTouchButton = function(element, event) {
    event.preventDefault();
    //console.log(event);

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

    if (distanceToCenter > this.keysContainerRadius) {
        this.currentActiveButtonKeyName = "";
    } else if (distanceToCenter > this.centerKeyRadius) {
        switch(true) {
            case -45<angleToCenter && angleToCenter<=45:
                this.currentActiveButtonKeyName = "left";
                break;
            case 45<angleToCenter && angleToCenter<=135:
                this.currentActiveButtonKeyName = "up";
                break;
            case 135<angleToCenter || angleToCenter<=-135:
                this.currentActiveButtonKeyName = "right";
                break;
            case -135<angleToCenter && angleToCenter<=-45:
                this.currentActiveButtonKeyName = "down";
                break;
            default:
                break;
        }
    } else {
        this.currentActiveButtonKeyName = "center";
    }

    this.setStatusToActiveForButtonByKeyName(this.currentActiveButtonKeyName);
};