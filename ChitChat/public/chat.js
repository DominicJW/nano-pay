function NanoPay(ticket,callback){
    ticket.myd = Date.now();
    $.ajax ({
        url: "http://localhost:3000/AUTHUSER",
        xhrFields: {
            withCredentials:true
        },
        type: "POST",
        data: JSON.stringify(ticket),
        contentType: "application/json; charset=utf-8"
    }).done((result) => {
        ticket._id = result;
        console.log(ticket);
        $.ajax ({
            url: "http://127.0.0.1:5050/chatsite/auth",
            type: "POST",
            data: JSON.stringify(ticket),
            contentType: "application/json; charset=utf-8"
        }).done(function(result,status,xhr){
            console.log(ticket+result); 
            // console.log(result);
            // console.log(status);
            // console.log(xhr);
        }).fail(function(result,status,xhr){
            console.log("fail"); 
            // console.log(result);
            // console.log(status);
            // console.log(xhr);
        }).always(function(result,status,xhr){
             // console.log(result);
            // console.log(status);
            // console.log(xhr);
        });
    }).fail((result,status,xhr) => {
        alert(result.responseText);
        //it doesnt like this
    });
}

//could suggest partners use query urlparams
$(document).ready(()=>{
    $("#sendButton").click(()=>{
        NanoPay({service:"62e2c285a01937cdb462985d"},(result) => console.log(`$yooo hooo`));
    })
});
