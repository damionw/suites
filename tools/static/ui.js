supervisor_info = null;

function refresh() {
    ajaxFunction(
        "/api/status",

        function(ajax_result){
            supervisor_info = ajax_result;
            refresh_supervisor();
            refresh_tasks();
        },

        function(ajax_exception){
        }
    );
}

function refresh_supervisor() {
}

function refresh_tasks(tasks) {
    d3
        .select("nav")
        .selectAll("div")
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