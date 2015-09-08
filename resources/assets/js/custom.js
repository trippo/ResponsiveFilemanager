/**
 * 
 * @param {type} title
 * @param {type} icon
 * @param {type} content
 * @returns {undefined}
 */
function alertDialog(title, icon, content) {
    var html = '<form onsubmit="return false;"><h1 class="text-light"><span class="' + icon + '"></span> ' + title + '</h1><hr class="thin"><br>'
            + content + '<br/><br/><div class="form-actions page-content align-right">'
            + '<button type="button" class="button primary" onclick="ocultDialog(\'#dcmDialog\')">Cerrar</button>'
            //+ '<button type="submit" class="button primary"><span class="mif-lock"></span> Aceptar</button>'
            + '</div></form>';
    $("#dcmDialog-content").html(html);
    showDialog("#dcmDialog");
}

/**
 * 
 * @param {type} id
 * @returns {undefined}
 */
function showDialog(id) {
    var dialog = $(id).data('dialog');
    dialog.open();
}

/**
 * 
 * @param {type} id
 * @returns {undefined}
 */
function ocultDialog(id) {
    var dialog = $(id).data('dialog');
    dialog.close();
}

/**
 * 
 * @param {type} id
 * @param {type} destroy
 * @returns {undefined}
 */
function ocultDialog2(id, destroy) {
    if (destroy) {
        $(id + " .body-preview").html("");
    }
    ocultDialog(id);
}

/**
 * 
 * @param {type} title
 * @param {type} cancelTxt
 * @param {type} okTxt
 * @param {type} callback
 * @param {type} defaultVal
 * @param {type} icon
 * @returns {undefined}
 */
function showPrompt(title, cancelTxt, okTxt, callback, defaultVal, icon) {


    var header = '<h1 class="text-light"><span class="' + icon + '"></span> ' + title + '</h1><hr class="thin"><br>';

    var input = '<div class="input-control text full-size info" data-role="input">'
            + '<input type="text" value="' + defaultVal + '" name="inputDialog-i"/>'
            + '</div>';

    var template = '<div data-role="dialog" id="inputDialog" data-windows-style="true" data-overlay="true" data-overlay-color="op-dark" class="window-style">'
            + '<div class="container page-content">'
            + header
            + input
            + '<br/><br/><div class="form-actions page-content align-right"></div>'
            + '</div></div>';


    var okBut = $('<button type="button" class="button primary"><span class="mif-checkmark"></span> ' + okTxt + '</button> ');
    var cancelBut = $('<button type="button" class="button margin5R" onclick="ocultDialog(\'#inputDialog\')">' + cancelTxt + '</button> \n');

    okBut.click(function() {
        callback($("#inputDialog input").val());
        ocultDialog("#inputDialog");
        $("#inputDialog").remove();
    });
    cancelBut.click(function() {
        ocultDialog("#inputDialog");
        $("#inputDialog").remove();
    });

    var dialog = $(template);
    var actions = dialog.find(".form-actions");
    cancelBut.appendTo(actions);
    okBut.appendTo(actions);

    dialog.appendTo("body").dialog();
    showDialog("#inputDialog");
}

/**
 * 
 * @param {type} title
 * @param {type} body
 * @param {type} cancelTxt
 * @param {type} okTxt
 * @param {type} callback
 * @param {type} icon
 * @returns {undefined}
 */
function showConfirmDialog(title, body, cancelTxt, okTxt, callback, icon) {
    var header = '<h1 class="text-light"><span class="' + icon + '"></span> ' + title + '</h1><hr class="thin"><br>';


    var template = '<div data-role="dialog" id="confirmDialog" data-windows-style="true" data-overlay="true" data-overlay-color="op-dark" class="window-style">'
            + '<div class="container page-content">'
            + header
            + body
            + '<br/><br/><div class="form-actions page-content align-right"></div>'
            + '</div></div>';


    var okBut = $('<button type="button" class="button primary"><span class="mif-checkmark"></span> ' + okTxt + '</button> ');
    var cancelBut = $('<button type="button" class="button margin5R">' + cancelTxt + '</button> \n');

    var dialog = $(template);
    var actions = dialog.find(".form-actions");
    cancelBut.appendTo(actions);
    okBut.appendTo(actions);

    dialog.appendTo("body").dialog();

    okBut.click(function() {
        callback(true);
        ocultDialog("#confirmDialog");
        $("#confirmDialog").remove();
    });
    cancelBut.click(function() {
        ocultDialog("#confirmDialog");
        $("#confirmDialog").remove();
    });

    showDialog("#confirmDialog");
}

function alertDialog2(title, icon, body, okTxt, callback) {
    var header = '<h1 class="text-light"><span class="' + icon + '"></span> ' + title + '</h1><hr class="thin"><br>';


    var template = '<div data-role="dialog" id="alertDialog" data-windows-style="true" data-overlay="true" data-overlay-color="op-dark" class="window-style">'
            + '<div class="container page-content">'
            + header
            + body
            + '<br/><br/><div class="form-actions page-content align-right"></div>'
            + '</div></div>';


    var okBut = $('<button type="button" class="button primary"><span class="mif-checkmark"></span> ' + okTxt + '</button> ');

    var dialog = $(template);
    var actions = dialog.find(".form-actions");
    okBut.appendTo(actions);

    dialog.appendTo("body").dialog();

    okBut.click(function() {
        callback(true);
        ocultDialog("#alertDialog");
        $("#alertDialog").remove();
    });

    showDialog("#alertDialog");

}

$(function() {
    $('.filterx').hide(300);


    $("#showFilters").click(function() {
        var parentx = $(this).parent();
        if (parentx.hasClass("active")) {
            $('.filterx').hide(300);
            parentx.attr("class", "");
        } else {
            //show filters
            $('.filterx').show(300);
            parentx.attr("class", "active fg-yellow");
            //ocult links
            $('.actionx').hide(300);
            $("#showLinks").parent().attr("class", "");
        }

    });

    $('.actionx').hide(300);
    $("#showLinks").click(function() {
        var parentx = $(this).parent();
        if (parentx.hasClass("active")) {
            $('.actionx').hide(300);
            parentx.attr("class", "");
        } else {
            //show links
            $('.actionx').show(300);
            parentx.attr("class", "active fg-yellow");
            //ocult filters
            $('.filterx').hide(300);
            $("#showFilters").parent().attr("class", "");
        }

    });

});
//alertDialog($('#lang_info').val(), "mif-warning", msg);