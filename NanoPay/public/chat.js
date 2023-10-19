

function NanoPay(ticket,callback){
  $.ajax ({
    url: "http://localhost:3000/AUTHUSER",
    type: "POST",
    data: JSON.stringify(ticket),
    dataType: "json",
    contentType: "application/json; charset=utf-8"
  }).done((result) => {
    console.log(result);
    ticket["token"] = result["token"];
    $.ajax ({
      url: ticket["AUTHURL"],
      type: "POST",
      data: JSON.stringify(ticket),
      dataType: "json",
      contentType: "application/json; charset=utf-8"
    }).done((result)=> callback(result));
  });
}

$(document).ready(()=>{
  $("#sendButton").click(()=>{NanoPay({
    "site":"Helloworld",
    "User":"Dom",
    "Service":"buybricks",
    "AUTHURL":"http://127.0.0.1:5050/chatsite/auth"
  },
  (result) => console.log(`${result} yooo hooo`));
  })
});