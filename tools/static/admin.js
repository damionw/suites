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
//     d3.select("#tasks")
//         .each(function() {d3.select(this.node().previousSibling);})
//         .
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

Window.management_context = management_context;
