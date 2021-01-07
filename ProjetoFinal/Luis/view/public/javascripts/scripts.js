/* SCRIPTS FILE */

$(()=>{
    /* usar AJAX */
    $.get("http://localhost:3001/files", function(data){
        data.forEach(p => {
            $("#tableFiles").append("<tr onclick='showImage(\"" + p.name + "\",\"" + p.mimetype + "\");'>" 
            +"<td>" + p.date + "</td> <td>" + p.name + "</td> <td>" + 
            p.mimetype + "</td> <td>" + p.size +"</td> </tr>")
        });
    })

})

function add() {
    var file = $('<input class="w3-input w3-border w3-light-grey" type="file" name="myFile">')
    $("#addeds").append(file)
}

function showFile(name, type, autor, desc) {
    /* if(type=='image/png' || type=='image/jpeg'){
        var file = $("<img src=\"http://localhost:3001/fileStore/" + autor +"/"+name + "\", width=\"80%\"/>"
        + "<pre> <b>Nome do Ficheiro: </b>" + name + "</pre>" +
        "<pre><b> Tipo do Ficheiro: </b>" + type + "</pre>")
    }
    else {
        var file = $("<pre> <b>Nome do Ficheiro: </b>" + name + "</pre>" +
        "<pre><b> Tipo do Ficheiro: </b>" + type + "</pre>")
    } */
    
    var file = $("<pre><b>Nome do Ficheiro: </b>" + name + "</pre>" +
    "<pre><b>Tipo do Ficheiro: </b>" + type + "</pre>" +
    "<table><tr><pre><b>Descrição: </b></td><pre><textarea rows=\"4\" cols=\"70\" style=\"font-size: 11px;\" readonly>"+desc+"</textarea>"
        + "</td></tr></table>")
    var download = $('<div style="margin: auto; width: 25%; border: 2px solid black; text-align: center;"><a href="http://localhost:3001/download/' + autor + "/" + name + '"> Download <i class="fa fa-download"></i></a></div>')

    $("#display").empty()
    $("#display").append(file, download)
    $("#display").modal()
}

function mudafoto(id) {
    var file = $("<form class=\"w3-container\" style=\"margin:50px\" action=\"http://localhost:3001/changeprofile\" method=\"POST\" enctype=\"multipart/form-data\">"
    + "<pre> <b> Mudar Foto de Perfil </b> </pre>"
    + "<input class=\"w3-input w3-border w3-light-grey\" type=\"file\" name=\"myProfilePic\" />"
    + "<input type=\"hidden\" name=\"autor\" value=\"" + id + "\"/>"
    + "<input class=\"w3-btn w3-white w3-border w3-border-green w3-round-large fa\" style=\"margin-top:10px;\" type=\"submit\" value=\"Confirm &#xf00c;\"/>"
    + "</form>")

    $("#df").empty()
    $("#df").append(file)
    $("#df").modal()
}

/*
function mudarprivacidade(id,autor){
    //a(href="http://localhost:3002/files/changeprivacy/"+a._id, class="fa fa-lock")
    $.ajax({
        url: "http://localhost:3001/changeprivacy/"+id,
        type: 'PUT',
        success: function(response) {
            window.location.replace("http://localhost:3002/users/"+autor);
        }
     });
} */


/* SCRIPTS USERS */

$(()=>{
    /* usar AJAX */
    $.get("http://localhost:3001/users", function(data){
        data.forEach(p => {
            $("#ulist").append("<li> <a href=\"http://localhost:3002/users/" + p._id +"\">" + p.name + "</li>");
        });
    })
})