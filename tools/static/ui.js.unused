var supervisor_info = new Object();

function format_supervisor_info(ajax_result) {
    var task_info = new Object();

    for (var index = 0; index < ajax_result.tasks.length; ++index) {
        var entry = ajax_result.tasks[index];

        entry.ports = entry.ports.join(",");
        entry.process = entry.pid;

        if (index == 0) {
            ajax_result.selected_task = entry.name;
        }

        task_info[entry.name] = entry;
    }


    supervisor_info = ajax_result;
    supervisor_info.dependencies = supervisor_info.dependencies.join(",");
    supervisor_info.process = supervisor_info.supervisor;
    supervisor_info.tasks = task_info;
}

function refresh() {
    ajaxFunction(
        "/api/status",

        function(ajax_result){
            format_supervisor_info(ajax_result);
            refresh_supervisor();
            refresh_tasks();
        },

        function(ajax_exception){
        }
    );
}

function refresh_supervisor() {
    var controls = d3.select("#supervisor > .control > .navigator");
    var info = d3.select("#supervisor > .control > .info");

    var configure_state_info = function(name, index) {
        var element = d3.select(this);
        var value = supervisor_info[name];

        element
            .append("div")
            .text(name)
        ;

        element
            .append("div")
            .text(value)
        ;
    };

    controls
        .append("div")
        .text("Stop")
        .on('click', function(d,i) { stop_supervisor();})
        .classed("task-button", true)
    ;

    info
        .selectAll("div")
        .data(["process", "name", "suite", "dependencies"])
        .enter()
            .append('div')
            .each(configure_state_info)
    ;
}

function refresh_tasks() {
    var controls = d3.select("#tasks > .control > .navigator");
    var info = d3.select("#tasks > .control > .info");
    var tabs =  d3.select("#task-buttons");

    tabs
        .selectAll(".tab-button")
        .data(Object.keys(supervisor_info.tasks))
        .enter()
            .append("div")
            .on('click', function(name,i) { select_task(name, this);})
            .text(function(name, i) { return name;})
            .classed("tab-button", true)
            .each(function(name,i) {
                    if (i == 0) {
                        select_task(name, this);
                    }
                }
             )
    ;

    controls
        .html("")
    ;

    controls
        .append("div")
        .text("Enable")
        .on('click', function(d,i) { enable_task();})
        .classed("task-button", true)
    ;

    controls
        .append("div")
        .text("Disable")
        .on('click', function(d,i) { disable_task();})
        .classed("task-button", true)
    ;

    controls
        .append("div")
        .text("Restart")
        .on('click', function(d,i) { restart_task();})
        .classed("task-button", true)
    ;

//     select_task(supervisor_info.selected_task, null);
}

function restart_task() {
    var entry = supervisor_info.tasks[supervisor_info.selected_task];

    ajaxFunction(
        "/api/control/restart_task/" + entry.name,

        function(ajax_result){
            refresh();
        },

        function(ajax_exception){
        },

        "POST"
    );
}

function enable_task() {
    var entry = supervisor_info.tasks[supervisor_info.selected_task];
    
    ajaxFunction(
        "/api/control/enable_task/" + entry.name,

        function(ajax_result){
            refresh();
        },

        function(ajax_exception){
        },

        "POST"
    );
}

function disable_task() {
    var entry = supervisor_info.tasks[supervisor_info.selected_task];

    ajaxFunction(
        "/api/control/disable_task/" + entry.name,

        function(ajax_result){
            refresh();
        },

        function(ajax_exception){
        },

        "POST"
    );
}

function stop_supervisor() {
    ajaxFunction(
        "/api/control/stop_supervisor",

        function(ajax_result){
            refresh();
        },

        function(ajax_exception){
        },

        "POST"
    );
}

function select_task(taskname, selected_element) {
    var controls = d3.select("#tasks > .control > .navigator");
    var info = d3.select("#tasks > .control > .info");
    var entry = supervisor_info.tasks[taskname];
    var selected_element = d3.select(selected_element);

    var configure_state_info = function(name, index) {
        var element = d3.select(this);
        var value = entry[name];

        element
            .append("div")
            .text(name)
        ;

        element
            .append("div")
            .text(value)
        ;
    };

    supervisor_info.selected_task = taskname;

    info
        .html("")
        .selectAll("div")
        .data(["process", "name", "ports"])
        .enter()
            .append('div')
            .each(configure_state_info)
    ;

    controls
        .selectAll(".tab-button")
        .classed("selected", false)
    ;

    selected_element
        .classed("selected", true)
    ;
}