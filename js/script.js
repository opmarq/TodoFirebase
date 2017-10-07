var taskRef = firebase.database().ref("tasks/");
var taskInput = document.getElementById("task");
var addTaskBtn = document.getElementById("add-task");
var showMessage = document.getElementById("errormessage");

var showErrorMessage = function(show){
    if(show)
      showMessage.style.display = "block";
    else
    showMessage.style.display = "none";

};

showErrorMessage(false);

var Task = function(name,stat){
    this.name = name;
    this.stat = stat;
}

var buildList = function(list){
    
    $("#list-tasks").empty();

    if(list == null)
        return false;

    var listValues = Object.values(list);
    var done = "";
    var buttonType = "";

    for(var i = 0;i< listValues.length;i++)
    {

        if(listValues[i].stat == 1 )
        {
            done = "done";
            buttonType = `<a data-id="${ Object.keys(list)[i] }" class="action-btn-del glyphicon glyphicon-remove "></a>`;   
        }else{
            done = "";
            buttonType = `<a data-id="${ Object.keys(list)[i] }" class="action-btn-check glyphicon glyphicon-check "></a>`;  ;   
        }

        $("#list-tasks").append(`
            <li class="list-group-item">
                <div class="row">
                <div class="col-sm-9">
                    <p class="${done}"  >
                    ${listValues[i].name}
                    </p>
                </div>
                <div style="text-align: right;" class="col-sm-3">
                    ${buttonType}
                </div>
                </div>
            </li>
        `);
    }

    $(".action-btn-del").on("click",function(){
        
        taskRef.child($(this).data().id).remove();
    });

    $(".action-btn-check").on("click",function(){
        
        var statRef = taskRef.child($(this).data().id).update({
            stat:1
        });
    });
};

taskInput.addEventListener("keydown",function(e){
    if(e.key == "Enter")
    {
        addTaskBtn.click();
        this.value = "";
    }
});


addTaskBtn.addEventListener("click",function(){

    if(taskInput.value != "")
    {
        
        showErrorMessage(false);

        var task = new Task( taskInput.value,0 );
        
        taskRef.push(task,function(){

        });

    }else{

        showErrorMessage(true);
    }

});


taskRef.on("value",function(snapshot){
    buildList(snapshot.val());
});
