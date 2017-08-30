var management_context = {
    "data": null,
    "first_time": true
};

function refresh() {
    d3.selectAll("#panel > ._synthetic")
        .remove()
    ;

    refresh_context();
}

function refresh_data(data) {
    management_context["data"] = data;
    update_title(data["suite"]);
    populate_supervisor_interface(data);
    populate_task_interfaces(data["tasks"]);
    
    if (management_context.first_time) {
        load_supervisor_dashboard(data);
        management_context.first_time = false;
    }
}

function update_title(title) {
    d3.selectAll(".suite_label")
        .text(title)
    ;
}

function populate_supervisor_interface(supervisor_info) {
    var new_element = document.createElement("div");
    var insertion_element = get_panel_insertion_point("supervisor");

    d3.select("#panel").node().insertBefore(new_element, insertion_element);

    d3.select(new_element)
        .classed("_synthetic", true)
        .classed("menu_selection", true)
        .text(function() {return "Supervisor Dashboard";})
        .on("click", function(){load_supervisor_dashboard(supervisor_info);})
    ;

    insertion_element = new_element.nextElementSibling;
    new_element = document.createElement("div");
    d3.select("#panel").node().insertBefore(new_element, insertion_element);

    d3.select(new_element)
        .classed("_synthetic", true)
        .classed("menu_selection", true)
        .text("Stop")
        .on("click", function(){stop_supervisor(); load_supervisor_dashboard(supervisor_info);})
    ;
}

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

function populate_task_interfaces(tasks) {
    d3.select("#panel")
        .selectAll(
            function() {return [];}
        )
        .data(tasks)
        .enter()
            .each(
                function(d) {
                    var element = document.createElement("details");
                    var name = d.name;

                    d3.select("#panel").node().insertBefore(element, get_panel_insertion_point("tasks"));

                    var d3_element = d3.select(element);
                    
                    d3_element
                        .classed("_synthetic", true)
                        .append("summary")
                        .text(function() {return name;})
                    ;
                    
                    d3_element
                        .append("div")
                        .text("Dashboard")
                        .on("click", function(){load_task_dashboard(d);})
                    ;

                    d3_element
                        .append("div")
                        .text("Restart")
                        .on("click", function(){restart_task(name); load_task_dashboard(d);})
                    ;

                    d3_element
                        .append("div")
                        .text("Enable")
                        .on("click", function(){enable_task(name); load_task_dashboard(d);})
                    ;

                    d3_element
                        .append("div")
                        .text("Disable")
                        .on("click", function(){disable_task(name); load_task_dashboard(d);})
                    ;
                }
            )
        ;
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

function load_supervisor_dashboard(supervisor_info) {
    d3.select("#dashboard_surface")
        .html("");
    ;
    
    d3.select("#dashboard_surface")
        .append("div")
        .classed("dashboard ", true)
        .append("table")
        .selectAll("tr")
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
}

function load_task_dashboard(task_descriptor) {
    d3.select("#dashboard_surface")
        .html("");
    ;
    
    d3.select("#dashboard_surface")
        .append("div")
        .classed("dashboard ", true)
        .append("table")
        .selectAll("tr")
        .data(
            [
                ["Task", task_descriptor.name],
                ["Process ID", task_descriptor.pid],
                ["Ports", task_descriptor.ports.join(",")]
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
}

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

Window.management_context = management_context;
