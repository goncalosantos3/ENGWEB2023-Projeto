
function showFile(fname, ftype, idC){
    
    if(ftype == "image/png" || ftype == "image/jpeg"){// Para imagens
        var file = $('<img src="/fileStore/' + fname + '" width="400px"/>')
    }else{ // Sem ser imagens
        var file = $('<p>' + fname + ', ' + ftype + '</p>')
    }

    var download = $('<div><a href="/' + idC + '/content/download/' + fname + '">Download</a></div>')

    // Limpa tudo o que poderia ter no modal
    $("#display").empty()
    $("#display").append(file, download)
    $("#display").modal()
}