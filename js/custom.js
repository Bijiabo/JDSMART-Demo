$(function(){

    var keysContainerPosition = {
        top: $("#keys-container").offset().top,
        left: $("#keys-container").offset().left
    };

    var centerKeyRadius = $(".center-key").width()/2;

    $(document).on("mousemove", "#keys-container", function(event){
        var element = $(this);
        var elementCenter = {
            x: element.width()/2,
            y: element.height()/2
        };
        var currentTargetPosition = {
            x: event.pageX - keysContainerPosition.left,
            y:event.pageY - keysContainerPosition.top
        };
        var distanceToCenter = Math.sqrt( Math.pow(currentTargetPosition.x - elementCenter.x, 2) + Math.pow(currentTargetPosition.y - elementCenter.y, 2) );
        var angleToCenter = Math.atan2(elementCenter.y - currentTargetPosition.y, elementCenter.x - currentTargetPosition.x) * 180 / Math.PI
        //console.log(angleToCenter);
        var targetButton = "none";

        if (distanceToCenter > element.width()/2) {
            clearActiveButtonState();
        } else if (distanceToCenter > centerKeyRadius) {
            switch(true) {
                case -45<angleToCenter && angleToCenter<=45:
                    targetButton = "left";
                    activeButton(2);
                    break;
                case 45<angleToCenter && angleToCenter<=135:
                    targetButton = "up";
                    activeButton(0);
                    break;
                case 135<angleToCenter || angleToCenter<=-135:
                    targetButton = "right";
                    activeButton(1);
                    break;
                case -135<angleToCenter && angleToCenter<=-45:
                    targetButton = "down";
                    activeButton(3);
                    break;
                default:
                    break
            }
        } else {
            clearActiveButtonState();
            $(".center-key").addClass("active");
        }


        //console.log(targetButton);
    });

    var activeButton = function(index) {
        clearActiveButtonState();
        $("#keys-box .key:eq("+index+")").addClass("active");
    };

    var clearActiveButtonState = function() {
        $("#keys-box .key, .center-key").removeClass("active");
    };
});