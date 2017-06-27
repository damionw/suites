var supervisor_info = null;
var selected_task = null;

function refresh() {
    ajaxFunction(
        "/api/status",

        function(ajax_result){
            supervisor_info = ajax_result;
            refresh_supervisor();
            refresh_tasks();
            pick_task(supervisor_info.tasks[0]);
        },

        function(ajax_exception){
        }
    );
}

function pick_task(index) {
    var panel = d3.select("#task-info");

    panel
        .html("")
    ;

}

function refresh_supervisor() {
    var panel = d3.select("#supervisor-buttons");

    panel
        .append("div")
        .text("Stop")
        .on('click', function(d,i) { stop_supervisor();})
        .classed("task-button", true)
    ;
}

function refresh_tasks(tasks) {
    d3
        .select("#task-buttons")
        .selectAll(".task-button")
        .data(supervisor_info.tasks)
        .enter()
            .append("div")
            .on('click', function(d,i) { select_task(d.name);})
            .text(function(d,i) { return d.name;})
            .classed("task-button", true)
    ;
}

function select_task(taskname) {
    console.log(taskname);
//     alert(taskname);
}