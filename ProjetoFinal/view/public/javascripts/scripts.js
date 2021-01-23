/* SCRIPTS FILE */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const token = urlParams.get('token')

/*
$(()=>{
    // usar AJAX
    $.get("http://localhost:3001/files/fromUser?token="+token, function(data){
        data.forEach(p => {
            $("#tableFiles").append("<tr onclick='showImage(\"" + p.name + "\",\"" + p.mimetype + "\");'>" 
            +"<td>" + p.date + "</td> <td>" + p.name + "</td> <td>" + 
            p.mimetype + "</td> <td>" + p.size +"</td> </tr>")
        });
    })
})*/


function add() {
    var file = $('<input class="w3-input w3-border w3-light-grey" type="file" name="myFile">');
    $("#addeds").append(file);
}


function classificar(nmr, idF) {
    $.get("http://localhost:3001/files/classificar/" + idF + "?token=" + token + "&class=" + nmr);
}


function addAsFavourite(idF) {
    $.get("http://localhost:3001/files/addAsFavourite/" + idF + "?token=" + token);
}


function showFile(id, name, type, autor, desc) {
    var file = $("<pre><b>Nome do Ficheiro: </b>" + name + "</pre>" + "<pre><b>Tipo do Ficheiro: </b>" + type + "</pre>" + "<table><tr><pre><b>Descrição: </b></td><pre><textarea rows=\"4\" cols=\"70\" style=\"font-size: 11px;\" readonly>" + desc + "</textarea>" + "</td></tr></table>");
    var download = $('<div style="margin: auto; width: 25%; border: 2px solid black; text-align: center;"><a href="http://localhost:3001/files/download/' + autor + "/" + id + '?token=' + token + '"> Download <i class="fa fa-download"></i></a></div>');

    $("#display").empty();
    $("#display").append(file, download);
    $("#display").modal();
}


function mudafoto(id, token) {
    var file = $("<form class=\"w3-container\" style=\"margin:50px\" action=\"http://localhost:3001/users/changeprofile?token=" + token + "\" method=\"POST\" enctype=\"multipart/form-data\">" + "<pre> <b> Mudar Foto de Perfil </b> </pre>" + "<input class=\"w3-input w3-border w3-light-grey\" type=\"file\" name=\"myProfilePic\" />" + "<input type=\"hidden\" name=\"autor\" value=\"" + id + "\"/>" + "<input class=\"w3-btn w3-white w3-border w3-border-green w3-round-large fa\" style=\"margin-top:10px;\" type=\"submit\" value=\"Confirm &#xf00c;\"/>" + "</form>");

    $("#df").empty();
    $("#df").append(file);
    $("#df").modal();
}


function validate() {
    mail = document.getElementsByName("_id")[0].value;
    pwd = document.getElementsByName("password")[0].value;
    cpwd = document.getElementsByName("confirm_password")[0].value;

    if (pwd != cpwd) {
        alert("Passwords not matching!");
        return false;
    }

    $.get("http://localhost:3001/users/" + mail + "?token=" + token, function (data) {
        if (data) {
            alert("Email detalhado já em uso!")
            return false;
        } else {
            return true;
        }
    })
    return true;
}


function openUploadModal(user) {
    var file = $("<form class=\"w3-container\" onSubmit=\"return confirm(&quot;Do you want to submit?&quot;)\" action=\"http://localhost:3001/files?token=" + token + " \"method=\"POST\" enctype=\"multipart/form-data\" id=\"myForm\"><label class=\"w3-text-blue-grey\"><b>Select file</b></label><!-- #addeds--><input class=\"w3-input w3-border w3-light-grey\" type=\"file\" name=\"myFile\" />" + "<p><b class=\"w3-text-blue-grey\">Acess: <select id=\"level\" name=\"privacy\" type=\"num\" ><option value=\"1\">Private</option><option value=\"0\">Public</option></select></b></p>" + "<table>" + "<tr>" + "<td>Descrição:</td>" + "<td><textarea rows=\"3\" cols=\"30\" name=\"descricao\"></textarea></td>" + "</tr>" + "</table><button.w3-btn.w3-teal(type='button' onclick='add()') +--><input type=\"hidden\" name=\"autor\" value=\"" + user + "\" /><input class=\"w3-btn w3-blue-grey\" type=\"submit\" value=\"Submit\" id=\"addFile\" />" + "</form>");

    $("#display").empty();
    $("#display").append(file);
    $("#display").modal();
}


function openWarningModal(user) {
    var file = $("<form class=\"w3-container\" onSubmit=\"return confirm(&quot;Do you want to submit?&quot;)\" action=\"http://localhost:3001/news?token=" + token + " \"method=\"POST\" enctype=\"multipart/form-data\" id=\"myForm\">" + "<table>" + "<tr>" + "<td>Warning:</td>" + "<td><textarea rows=\"3\" cols=\"30\" name=\"descricao\"></textarea></td>" + "</tr>" + "</table><button.w3-btn.w3-teal(type='button' onclick='add()') +--><input type=\"hidden\" name=\"autor\" value=\"" + user + "\" /><input class=\"w3-btn w3-blue-grey\" type=\"submit\" value=\"Submit\" id=\"addFile\" />" + "</form>");

    $("#display").empty();
    $("#display").append(file);
    $("#display").modal();
}


function preventBack() {
    window.history.forward();
}

setTimeout("preventBack()", 0);

window.onunload = function () {
    null
};

/*
function mudarprivacidade(id,autorToken){
    //a(href="http://localhost:3002/files/changeprivacy/"+a._id, class="fa fa-lock")
    $.ajax({
        url: "http://localhost:3001/files/changeprivacy/"+id+"?token="+autorToken,
        type: 'PUT',
        success: function(response) {
            window.location.replace("http://localhost:3002/users?token="+autorToken);
        }
     });
} 
*/