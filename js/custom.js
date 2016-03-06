var ARC;

$(function(){
    var keyboardQueryString = "#direction-keyboard",
        keysContainerQueryString = "#keys-container";

    ARC = new _AnnulusRemoteController(keyboardQueryString, keysContainerQueryString);
});

var _AnnulusRemoteController = function(keyboardQueryString, keysContainerQueryString) {
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

    this.activeButtonStatusClassName = "active";
    this.currentActiveButtonKeyName = "";

    var self = this;

    $(document).on("mousemove", keyboardQueryString, function(event){
        var element = $(this);
        self.updateCurrentTouchButton(element, event);
    });
};

_AnnulusRemoteController.prototype.setStatusToActiveForButtonByKeyName = function(keyName) {

    //p("keyName:"+keyName+", currentActiveButtonKeyName:"+this.currentActiveButtonKeyName);
    //if (keyName === this.currentActiveButtonKeyName) {return;}

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
    var elementCenter = {
        x: element.width()/2,
        y: element.height()/2
    };
    var currentTargetPosition = {
        x: event.pageX - this.keysContainerPosition.left,
        y:event.pageY - this.keysContainerPosition.top
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