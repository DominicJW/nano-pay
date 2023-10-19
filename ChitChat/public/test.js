$(document).ready(()=>{
    $("#sendButton").click(()=>{
        $.ajax ({
            url: "http://192.168.1.185/",
            type: "POST",
            data: JSON.stringify({token:"62e2c285a01937cdb462985d"}),//server needs to know what to do for the cash
            contentType: "application/json; charset=utf-8"
        }).done(function(result,status,xhr){
            console.log("done"); 
        }).fail(function(result,status,xhr){
            console.log("fail"); 
        }).always(function(result,status,xhr){
            console.log("always");
        });
    })
});
