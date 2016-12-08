window.suffix = "";

$(function () {
    // draw sequences sunburst chart on page load.
    var indicator = $("#indicator-select").val();
    window.suffix = suffix_choices[indicator][window.language];
    drawSequencesChart(data[window.language][indicator]);
    var selected_question_text = $("#indicator-select option:selected").text();
    $(".question-label").empty().text(selected_question_text);

    // add class active to the aggregated optin in the navbar
    $(".left-nav li:first").removeClass("active");
    $(".left-nav li:last").addClass("active");

    // indicator select change.
    $("#indicator-select").on("change", function () {
        var selected_question_text = $("#indicator-select option:selected").text();
        $(".question-label").empty().text(selected_question_text);
        var selected_indicator = $(this).val();
        window.suffix = suffix_choices[selected_indicator][window.language];
        drawSequencesChart(data[window.language][selected_indicator]);
    })
});