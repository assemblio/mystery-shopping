window.suffix = suffix_choices;

var no_data_indicators = {
    "en": {
        "Agency for Civil Registration": [],
        "Agency for Business Registration": ["A02", "P4", "P5", "P6"],
        "Agency for Medicine and Medical Equipment": ["A02", "P4", "P5", "P6"],
        "Kosovo Customs": ["A02", "P4", "P5", "P6"],
        "Department of Higher Education": [],
        "Department of Non-Governmental Organizations - DONGOs": ["A02", "A1", "A2", "P4", "P5", "P6"],
        "Departament of plant production and protection (DPPP)": ["A02", "A1", "A2", "P4", "P5", "P6"],
        "Department for regulation of petroleum market": ["A02", "P4", "P5", "P6"]
    },
    "sq": {
        "Agjencia per regjistrim civil": [],
        "Agjencia per Regjistrimin e Bizneseve": ["A02", "P4", "P5", "P6"],
        "Agjencioni per produkte dhe pajisje mjekesore (AKPM)": ["A02", "P4", "P5", "P6"],
        "Dogana e Kosovës": ["A02", "P4", "P5", "P6"],
        "Departamenti i Arsimit të Lartë": [],
        "Departamenti I Organizatave Jo Qeveritare - DOJQ": ["A02", "A1", "A2", "P4", "P5", "P6"],
        "Departamenti Prodhimtarise dhe Mbrojtjes se Bimeve (DPMB)": ["A02", "A1", "A2", "P4", "P5", "P6"],
        "Departamenti per rregullimin e tregut te naftes": ["A02", "P4", "P5", "P6"]
    },
    "sr": {
        "Agencija za civilnu registraciju": [],
        "Agencija za registraciju biznisa": ["A02", "P4", "P5", "P6"],
        "Agencija za lekove i medicinsku opremu ": ["A02", "P4", "P5", "P6"],
        "Carina Kosova": ["A02", "P4", "P5", "P6"],
        "Odeljenje za visoko obrazovanje ": [],
        "Odeljenje za nevladine organizacije - ONVO": ["A02", "A1", "A2", "P4", "P5", "P6"],
        "Odeljenje za proizvodnju i zaštitu bilja ": ["A02", "A1", "A2", "P4", "P5", "P6"],
        "Odeljenje za regulisanje naftnog tržišta": ["A02", "P4", "P5", "P6"]
    }
};

$(function () {
    var selected_agency = $("#agency-select").val();
    drawAsterChart(data[window.language]["A02"]["answer"][selected_agency], suffix["A02"][window.language]);
    var selected_question_text = $("#question-select option:selected").text();
    $(".question-label").empty().text(selected_question_text);

    $("#agency-select").change(function () {
        var selected_agency = $("#agency-select").val();
        $("#question-select option").show();
        $("#question-select option").addClass("visible");
        $("#question-select option").removeClass("hidden");
        for (var i = 0; i < no_data_indicators[window.language][selected_agency].length; i++) {
            var item = no_data_indicators[window.language][selected_agency][i];
            $("#question-select > option[value$='" + item + "']").hide();
            $("#question-select > option[value$='" + item + "']").addClass("hidden");
        }

        var selected_question_text = $("#question-select option:selected").text();
        $(".question-label").empty().text(selected_question_text);
        var selected_question = $("#question-select option[class$='visible']")[0].value;
        $("#question-select").val(selected_question);
        displayChart(data[window.language][selected_question]["answer"][selected_agency], window.suffix[selected_question][window.language]);
    });

    $("#question-select").change(function () {
        var selected_agency = $("#agency-select").val();
        var selected_question = $("#question-select").val();
        var selected_question_text = $("#question-select option:selected").text();
        $(".question-label").empty().text(selected_question_text);
        displayChart(data[window.language][selected_question]["answer"][selected_agency], window.suffix[selected_question][window.language]);
    })
});

function displayChart(data, suffix) {
    if (data != undefined) {
        drawAsterChart(data, suffix);
        $(".no-data-div").hide();
        $(".aster-chart-container").show();
    } else {
        $(".no-data-div").show();
        $(".aster-chart-container").hide();
    }
}