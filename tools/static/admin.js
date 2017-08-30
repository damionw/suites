var management_context = {
    "data": null
};

function refresh() {
    refresh_context();
}

function refresh_data(data) {
    management_context["data"] = data;
    update_title(data["suite"]);
    update_tasks(data["tasks"]);
}

function update_title(title) {
    d3.selectAll(".suite_label")
        .text(title)
    ;
}

function update_tasks(tasks) {
    function get_insert_point() {
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
                    if (this == d3.select("#tasks").node()) {
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

    d3.selectAll("#panel > ._synthetic")
        .remove()
    ;

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

                    d3.select("#panel").node().insertBefore(element, get_insert_point());

                    var d3_element = d3.select(element);
                    
                    d3_element
                        .classed("_synthetic", true)
                        .append("summary")
                        .text(function() {return name;})
                    ;
                    
                    d3_element
                        .append("div")
                        .text("Dashboard")
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

function load_supervisor_dashboard() {
    d3.select("#dashboard_surface")
        .html("");
    ;
    
    d3.select("#dashboard_surface")
        .append("div")
        .classed("dashboard", true)
        .text("wish you were here")
    ;
}

Window.management_context = management_context;
