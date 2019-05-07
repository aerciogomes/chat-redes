$(document).ready(function(){
  var socket = io.connect("http://localhost:3000");
  var ready = false;

  $("#submit").submit(function(e) {
  e.preventDefault();
  $("#nick").fadeOut();
  $("#chat").fadeIn();
  var name = $("#nickname").val();
  var time = new Date();
  $("#name").html(name);
  $("#time").html('First login: ' + time.getHours() + ':' + time.getMinutes());

  ready = true;
  socket.emit("join", name);

});

function ManualSocketDisconnect() {
  socket.emit("manual-disconnection", name);
  socket.close();
}

function ListofUsers(){
  socket.emit("list", name);
}

$("#textarea").keypress(function(e){
      if(e.which == 13) {
      var text1 = $("#textarea").val();
        if(text1.indexOf('bye') >= 0){
          $("#textarea").val('');
          var time = new Date();
          $(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + text1 + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
          ManualSocketDisconnect();
        }
        if(text1.indexOf('list') >= 0){
          $("#textarea").val('');
          var time = new Date();
          $(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + text1 + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
          socket.emit("send", text1);
          ListofUsers();
        }
        if(text1.indexOf('send -all') >= 0){
          var text = text1.slice(9);
          $("#textarea").val('');
          var time = new Date();
          $(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
          socket.emit("send", text);
        }
        if(text1.indexOf('send -user') >= 0){
          var text = text1.slice(11);
          text = text.split(' ');
          var user = text1.slice(11);
          socket.emit("send -user", text);
          var mensagem = text;
          mensagem.shift();
          mensagem = mensagem.join(" ");
          $("#textarea").val('');
          var time = new Date();
          $(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + mensagem + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
        }
        if(text1.indexOf('rename') >= 0){
          var text = text1.slice(7);
          $("#textarea").val('');
          var time = new Date();
          //$(".chat").append('<li class="self"><div class="msg"><span>' + $("#nickname").val() + ':</span><p>' + text + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
          name = text;
          socket.emit("rename", text);
          $("#name").html(name);
          $("#nickname").val() = name;
        }
        // automatically scroll down
        document.getElementById('bottom').scrollIntoView();
      }
  });


  socket.on("update", function(msg) {
    if (ready) {
      $('.chat').append('<li class="info">' + msg + '</li>')
    }
  });

  socket.on("chat", function(client,msg) {
    if (ready) {
      var time = new Date();
      $(".chat").append('<li class="field"><div class="msg"><span>' + client + ':</span><p>' + msg + '</p><time>' + time.getHours() + ':' + time.getMinutes() + '</time></div></li>');
    }
  });


});

//client.broadcast.to(socketid).emit('message', 'for your eyes only');