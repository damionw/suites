/*--------------------------------- Context -----------------------------*/
var management_context = {
    "data": null,
    "first_time": true
};

/*-------------------------------- Data Updates -----------------------------*/
function refresh() {
    d3.selectAll("#panel > ._synthetic")
        .remove()
    ;

    refresh_context();
}

function refresh_data(supervisor_info) {
    management_context["data"] = supervisor_info;
    update_title(supervisor_info.suite);
    populate_supervisor_interface(supervisor_info);
    populate_task_interfaces(supervisor_info.tasks);
    
    if (management_context.first_time) {
        load_supervisor_dashboard(supervisor_info);
        management_context.first_time = false;
    }
}

function update_title(title) {
    d3.selectAll(".suite_label")
        .text(title)
    ;
}

/*--------------------------------- UI Formatting -----------------------------*/
function populate_supervisor_interface(supervisor_info) {
    var insertion_element = get_panel_insertion_point("supervisor");

    d3.select("#panel")
        .selectAll(function() {return [];})
        .data([supervisor_info])
        .enter()
            .each(
                function(supervisor_info) {
                    var new_element = document.createElement("div");

                    d3.select("#panel").node().insertBefore(new_element, insertion_element);

                    d3.select(new_element)
                        .classed("_synthetic", true)
                        .classed("menu_selection", true)
                        .text(function() {return "Supervisor Dashboard";})
                        .on("click", function(){load_supervisor_dashboard(supervisor_info);})
                    ;
                }
            )
    ;
}

function populate_task_interfaces(tasks) {
    var insertion_element = get_panel_insertion_point("tasks");

    d3.select("#panel")
        .selectAll(function() {return [];})
        .data(tasks)
        .enter()
            .each(
                function(task_descriptor) {
                    var new_element = document.createElement("div");

                    d3.select("#panel").node().insertBefore(new_element, insertion_element);
                    
                    d3.select(new_element)
                        .classed("_synthetic", true)
                        .classed("menu_selection", true)
                        .text(function() {return task_descriptor.name;})
                        .on("click", function(){load_task_dashboard(task_descriptor);})
                    ;
                }
            )
    ;
}

/*--------------------------------- Dashboard Formatting -----------------------------*/
function load_supervisor_dashboard(supervisor_info) {
    d3.select("#dashboard_surface")
        .html("");
    ;
    
    var d3_table = d3.select("#dashboard_surface")
        .append("div")
        .classed("dashboard", true)
        .append("table")
    ;

    d3_table
        .append("tr")
        .text("Controls")
        .classed("dashboard-header", true)
        .style("color", "green")
        .style("font-size", "22px")
    ;

    d3_table
        .append("tr")
        .selectAll("td")
        .data(
            [
                ["Stop Supervisor", function(){stop_supervisor(); load_supervisor_dashboard(supervisor_info);}]
            ]
         )
        .enter()
            .append("td")
            .append("div")
            .classed("task-button", true)
            .text(function(d) {return d[0];})
            .on("click", function(d){d[1]();})
    ;

    d3_table
        .append("tr")
        .append("div")
        .classed("dashboard-header", true)
        .text("State")
        .style("color", "green")
        .style("font-size", "22px")
    ;

    d3_table
        .selectAll(function(){return [];})
        .data(
            [
                ["Suite", supervisor_info.name],
                ["Path", supervisor_info.suite],
                ["Process ID", supervisor_info.supervisor]
            ]
        )
        .enter()
            .append("tr")
            .each(
                function(d) {
                    d3.select(this)
                        .append("td")
                        .text(d[0])
                    ;

                    d3.select(this)
                        .append("td")
                        .text(d[1])
                    ;
                }
            )
    ;

    d3_table
        .append("tr")
        .classed("dashboard-header", true)
        .text("Dependencies")
        .style("color", "green")
        .style("font-size", "22px")
    ;

    d3_table
        .selectAll(function(){return [];})
        .data(supervisor_info.dependencies.sort())
        .enter()
            .append("tr")
            .each(
                function(pid) {
                    d3.select(this)
                        .append("td")
                        .text(pid)
                    ;

                    d3.select(this)
                        .append("td")
                        .append("div")
                        .classed("task-button", true)
                        .text("remove")
                        .on("click", function(){deregister_dependency(pid);})
                    ;
                }
            )
    ;
}

function load_task_dashboard(task_descriptor) {
    function make_url(port) {
        return '<a href="http://' + window.location.hostname + ":" + port + '/">' + port + "</href>";
    }

    d3.select("#dashboard_surface")
        .html("");
    ;

    var d3_table = d3.select("#dashboard_surface")
        .append("div")
        .classed("dashboard", true)
        .append("table")
    ;

    d3_table
        .append("tr")
        .classed("dashboard-header", true)
        .text("Controls")
        .style("color", "green")
        .style("font-size", "22px")
        .style("padding-top", "40px")
    ;

    d3_table
        .append("tr")
        .selectAll("td")
        .data(
            [
                ["Restart", function(){restart_task(task_descriptor.name); load_task_dashboard(task_descriptor);}],
                ["Enable", function(){enable_task(task_descriptor.name); load_task_dashboard(task_descriptor);}],
                ["Disable", function(){disable_task(task_descriptor.name); load_task_dashboard(task_descriptor);}]
            ]
         )
        .enter()
            .append("td")
            .append("div")
            .classed("task-button", true)
            .text(function(d) {return d[0];})
            .on("click", function(d){d[1]();})
    ;

    d3_table
        .append("tr")
        .style("border", "2px solid orange")
        .style("margin-top", "40px")
        .classed("dashboard-header", true)
        .text("Status")
        .style("color", "green")
        .style("font-size", "22px")
    ;

    d3_table
        .selectAll(function(){return [];})
        .data(
            [
                ["Task", task_descriptor.name],
                ["Process ID", task_descriptor.pid],
                ["Ports", task_descriptor.ports.sort().map(make_url).join(",")]
            ]
        )
        .enter()
            .append("tr")
            .each(
                function(d) {
                    d3.select(this)
                        .append("td")
                        .text(d[0])
                    ;

                    d3.select(this)
                        .append("td")
                        .html(d[1])
                    ;
                }
            )
    ;
}

/*--------------------------------- API Calls -----------------------------*/
function restart_task(name) {
    ajaxFunction(
        "/api/control/restart_task/" + name,

        function(ajax_result){
            refresh();
        },

        function(ajax_exception){
        },

        "POST"
    );
}

function enable_task(name) {
    ajaxFunction(
        "/api/control/enable_task/" + name,

        function(ajax_result){
            refresh();
        },

        function(ajax_exception){
        },

        "POST"
    );
}

function disable_task(name) {
    ajaxFunction(
        "/api/control/disable_task/" + name,

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

function deregister_dependency(pid) {
    ajaxFunction(
        "/api/control/deregister_dependency/" + pid,

        function(ajax_result){
            refresh();
        },

        function(ajax_exception){
        },

        "POST"
    );
}

function refresh_context() {
    ajaxFunction(
        "/api/status",

        function(ajax_result){
            refresh_data(ajax_result);
        },

        function(ajax_exception){
        }
    );
}

/*--------------------------------- DOM Info -----------------------------*/
function get_panel_insertion_point(where) {
    var on = false;
    var list = [];

    d3.select("#panel")
        .selectAll(
            function() {
                return this.childNodes;
            }
        )
        .each(
            function() {
                if (this == d3.select("#" + where).node()) {
                    on = true;
                    list.push(this);
                } else if (! on) {
                } else if (this.tagName == "DETAILS") {
                    list.push(this);
                } else if (this.tagName) {
                    on = false;
                }
            }
        )
    ;

    return list[list.length - 1].nextElementSibling;
}

Window.management_context = management_context;
