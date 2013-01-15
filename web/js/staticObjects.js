///////////////////////////////////////////////////////////////////////////
////////////////////// Static Object Classes //////////////////////////////
///////////////////////////////////////////////////////////////////////////

function point(x,y) {
    this.x = x;
    this.y = y;
}

function straightLine(canvas,startX,startY,endX,endY) {

    //These are internal variables

    this.start = new point(startX,startY);
    this.end = new point(endX,endY);

    this.lowerRight = new point(startX,startY);

    //We save the array of renderObjects so we can remove ourselves later
    //then we add ourselves to that array

    canvas.renderObjects.push(this);

    this.draw = function(ctx) {

        //Need to call this otherwise all your lines run into each other and
        //don't erase when you clear the page :(

        ctx.beginPath();

        //This sets the place the pen starts

        ctx.moveTo(this.start.x,this.start.y);

        //This moves the marker

        ctx.lineTo(this.end.x,this.end.y);

        //Sets the color

        ctx.strokeStyle = "#000";

        //Renders to the canvas

        ctx.stroke();
    }

    this.onDelete = function() {
        var index = canvas.renderObjects.indexOf(this);

        //Remove ourselves only if we are still in the array

        if (index != -1) canvas.renderObjects.splice(index, 1);
    }
}

function bezierLine(canvas,startX,startY,endX,endY,bezierStrength) {

    //These are internal variables

    this.start = new point(startX,startY);
    this.end = new point(endX,endY);

    //We save the array of renderObjects so we can remove ourselves later
    //then we add ourselves to that array

    canvas.renderObjects.push(this);

    var uber = this;

    this.draw = function(ctx) {

        //Need to call this otherwise all your lines run into each other and
        //don't erase when you clear the page :(

        ctx.beginPath();

        //This sets the place the pen starts

        ctx.moveTo(this.start.x,this.start.y);

        //This moves the marker

        ctx.bezierCurveTo(this.start.x,this.start.y+bezierStrength,this.end.x,this.end.y-bezierStrength,this.end.x,this.end.y);

        //Sets the color

        ctx.strokeStyle = "#111";

        //Sets the line width

        ctx.lineWidth = 2;

        //Renders to the canvas

        ctx.stroke();
    }

    this.onDelete = function() {

        //Remove ourselves only if we are still in the array

        var index = canvas.renderObjects.indexOf(uber);
        if (index != -1) canvas.renderObjects.splice(index, 1);
    }
}

function complexLine(canvas,x,y) {

    //Create the points array

    this.points = new Array();

    //Start our complexLine

    this.points.push(new point(x,y));

    //Add ourselves to the renderObjects list

    canvas.renderObjects.push(this);

    this.lowerRight = new point(x,y);

    //Hold on to 'this' when in functions

    var uber = this;

    //Add points to our complexLine

    this.addPoint = function(x,y) {
        this.points.push(new point(x,y));
        if (uber.lowerRight.x < x) {
            uber.lowerRight.x = x;
        }
        if (uber.lowerRight.y < y) {
            uber.lowerRight.y = y;
        }
        canvas.stretchToContent(x,y);
    }

    this.draw = function(ctx) {

        //Quit here if there's no points to render

        if (this.points.length == 0) {
            return;
        }
        ctx.beginPath();

        //This sets the place the pen starts

        ctx.moveTo(this.points[0].x,this.points[0].y);

        //Iterates through all the points to draw short line segments between
        //them

        for (var i = 1; i < this.points.length; i++) {

            //This moves the marker

            ctx.lineTo(this.points[i].x,this.points[i].y);
        }

        //Sets the color

        ctx.strokeStyle = "#000";

        //Renders to the canvas

        ctx.stroke();
    }

    this.onDelete = function() {

        //Remove ourselves only if we are still in the array

        var index = canvas.renderObjects.indexOf(uber);
        if (index != -1) canvas.renderObjects.splice(index, 1);
    }
}

function rect(canvas,x,y,width,height) {

    //setup our variables

    this.pos = new point(x,y);
    this.size = new point(width,height);

    canvas.renderObjects.push(this);

    var uber = this;

    this.setPos = function(x,y) {
        uber.pos.x = x;
        uber.pos.y = y;
    }

    this.draw = function(ctx) {
        ctx.fillStyle = "#bbb";
        ctx.fillRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
    }

    this.onDelete = function() {

        //Remove ourselves only if we are still in the array

        var index = canvas.renderObjects.indexOf(uber);
        if (index != -1) canvas.renderObjects.splice(index, 1);
    }
}

function textBox(canvas,x,y,text) {

    //setup our variables

    this.pos = new point(x,y);
    this.text = text;

    //Create the HTML element that will hold the text box

    this.div = document.createElement('div');
    this.div.innerHTML = this.text;
    this.div.className = "rounded textbox unselectable";
    this.div.style.position = "absolute";
    this.div.style.left = this.pos.x+"px";
    this.div.style.top = this.pos.y+"px";

    canvas.canvasElm.parentNode.appendChild(this.div);

    //Clever hack to still have 'this' when in functions

    var uber = this;

    //Because we're using HTML to render this text, we need to actively
    //call functions in order to change it's position or text

    this.setText = function(text) {
        uber.text = text;
        uber.div.innerHTML = text;
    }

    this.setPos = function(x,y) {
        uber.pos.x = x;
        uber.pos.y = y;
        uber.div.style.left = x+"px";
        uber.div.style.top = y+"px";

        //Resize the window if necessary to accomodate the new movement

        uber.canvas.stretchToContent(uber.lowerRight.x,uber.lowerRight.y);
    }

    this.onDelete = function() {
        canvas.canvasElm.parentNode.removeChild(this.div);
    }
}

