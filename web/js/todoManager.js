///////////////////////////////////////////////////////////////////////////
///////////////////////////// Todo Manager ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

function todoManager() {

    this.todoItems = new Array();

    var uber = this;

    this.updateList = function() {

        //Make the list element

        if (uber.todoItems.length > 0) {
            hideInstructions();
        }

        for (var i = 0; i < uber.todoItems.length; i++) {
            if (uber.todoItems[i].canDo && !uber.todoItems[i].done) {
            }
        }
    }

}
