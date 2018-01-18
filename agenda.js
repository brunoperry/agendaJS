(function (window) {

    function Agenda() {

        var input;
        //elements
        var daysContainer;
        var hoursContainer;

        var init = function() {

            daysContainer = document.getElementsByClassName("days-container")[0];
            hoursContainer = document.getElementsByClassName("hour-items-container")[0];

            input = new AgendaInput();
            input.init(document.getElementsByClassName("agenda-container")[0], onInput);
        }

        var onInput = function(e) {

            if(e.dir === "v") {
                hoursContainer.style.top = e.val + "px";
            } else if (e.dir === "") {

            }
        }

        var createWeekRow = function () {

            let res;

            let weekContainer = document.createElement("div");
            weekContainer.className = "week-container";

            let dayItem = document.createElement("div");
            dayItem.className = "day-item";

            return res;
        }

        var createAgendaItems = function () {

            let agendaItemsContainer = document.createElement("div");
            agendaItemsContainer.className = "agenda-items-container";

            let agendaItem;
            for (let i = 0; i < 7 * 24; i++) {
                agendaItem = document.createElement("div");
                agendaItem.dataset.cellId = i;
                agendaItem.className = "agenda-item";
                agendaItemsContainer.appendChild(agendaItem);
            }

            input.addAgenda(agendaItemsContainer);

            return agendaItemsContainer;
        }

        init();

        document.getElementsByClassName("agenda-container")[0].appendChild(createAgendaItems());
    }

    window.Agenda = Agenda;

}(window));

(function (window) {

    function AgendaInput(mAgenda) {

        var isMobile = Util.isMobile();

        var touchDownTime;
        var prevTouchTime;
        var maxDelta = 90;
        var touchPos = {
            x:NaN,
            y:NaN
        }

        var isDragging = false;
        var scrollDir = "";

        var mainAgenda;
        var dragAgenda;
        var callback;

        var containerYPos;
        var containerXPos;

        this.init = function(mAgenda, cBack) {
            mainAgenda = mAgenda;

            if(isMobile) {
                mainAgenda.ontouchstart = onAgendaDown;
                mainAgenda.ontouchend = onAgendaUp;
            } else {
                mainAgenda.onmousedown = onAgendaDown;
                mainAgenda.onmouseup = onAgendaUp;
            }

            callback = cBack;
        }

        this.addAgenda = function (agenda) {

            dragAgenda = agenda;
        }

        var onAgendaDown = function (e) {

            touchDownTime = Date.now();

            containerYPos = parseFloat(dragAgenda.style.top.replace("px", ""));
            containerXPos = parseFloat(dragAgenda.style.left.replace("px", ""));

            if(isMobile) {
            
                touchPos.x = e.touches[0].screenX;
                touchPos.y = e.touches[0].screenY;
                mainAgenda.ontouchmove = onAgendaMove;
            } else {
            
                touchPos.x = e.screenX;
                touchPos.y = e.screenY;
                mainAgenda.onmousemove = onAgendaMove;
            }
            
        }

        var onAgendaMove = function(e) {

            if(Date.now() - touchDownTime < maxDelta ) return;


            let xPos;
            let yPos;
            if(isMobile) {
                xPos = e.touches[0].screenX;
                yPos = e.touches[0].screenY;

            } else {
                xPos = e.screenX;
                yPos = e.screenY;
            }

            if(!isDragging) {
                if(Math.abs(touchPos.x - xPos) > Math.abs(touchPos.y - yPos)) {
                    scrollDir = "h";
                    isDragging = true;
                } else if(Math.abs(touchPos.x - xPos) === Math.abs(touchPos.y - yPos)) {
                    scrollDir = "";
                    isDragging = false;
                } else {
                    scrollDir = "v";
                    isDragging = true;
                }
            }
            if(isDragging) {
                // let t = parseFloat(dragAgenda.style.top.replace("px", ""));

                
                if(scrollDir === "v") {
                    if(!containerYPos) containerYPos = 0;
                    let yVal = (touchPos.y - yPos) + containerYPos;
                    
                    if(yVal > 0) yVal = 0;
                    if(yVal < -(dragAgenda.offsetHeight - mainAgenda.offsetHeight)) {
                        yVal = -(dragAgenda.offsetHeight - mainAgenda.offsetHeight);
                    }

                    dragAgenda.style.top = (yVal) + "px";
                    callback({
                        dir: scrollDir,
                        val: yVal
                    });
                } else {
                    if(!containerXPos) containerXPos = 0;
                    let xVal = (touchPos.x - xPos) + containerXPos;
                    dragAgenda.style.left = xVal + "px";
                    callback({
                        dir: scrollDir,
                        val: xVal
                    });
                }
            }
        }

        var onAgendaUp = function (e) {

            if(isDragging) {
                isDragging = false;
            } else {
                onItemClick(e);
            }
            mainAgenda.onmousemove = null;
        }

        var onItemClick = function (e) {
            console.log("item clicked");
        }
    }

    window.AgendaInput = AgendaInput;
}(window));

(function(window) {

    function Util(){};

    Util.isMobile = function() {
        let res = false;

        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            res = true;
        }
        return res;
    }

    window.Util = Util;
}(window));