window.onload = function(){
    var hichat = new HiChat();
    hichat.init();
}
var HiChat = function(){
    this.socket = null;
} 
HiChat.prototype = {
    init:function(){
        var that = this;
        this.socket = io.connect();
        this.socket.on("connect",function(){
            document.getElementById("info").textContent = "get yourself a nickname";
            document.getElementById("nickWrapper").style.display = "block";
            document.getElementById("nicknameInput").focus();
        })
        this.socket.on("nickExisted",function(){
            document.getElementById("info").textContent = "!nickname is taken,choose another pls";
        })

        this.socket.on("loginSuccess",function(){
            document.title = "hichat"+document.getElementById("nicknameInput").value;
            document.getElementById("loginWrapper").style.display = "none";
            document.getElementById("messageInput").focus();
        })
        this.socket.on('system', function (nickName, userCount, type) {
            var msg = nickName + (type == 'login' ? ' joined' : ' left');
            that._displayNewMsg('system ', msg);
            document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
        });
        this.socket.on('newMsg', function (user, msg) {
            that._displayNewMsg(user, msg);
        });
        document.getElementById("loginBtn").addEventListener("click", function () {
            var nickname = document.getElementById("nicknameInput").value;
            if (nickName.trim().length != 0) {
                that.socket.emit("login", nickName);
            } else {
                document.getElementById("nicknameInput").focus();
            }
        }, false);
        document.getElementById('nicknameInput').addEventListener('keyup', function (e) {
            if (e.keyCode == 13) {
                var nickName = document.getElementById('nicknameInput').value;
                if (nickName.trim().length != 0) {
                    that.socket.emit('login', nickName);
                };
            };
        }, false);
        document.getElementById('sendBtn').addEventListener('click', function () {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value;
            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length != 0) {
                that.socket.emit('postMsg', msg); 
                that._displayNewMsg('me', msg); 
            };
        }, false);

    },
     _displayNewMsg: function (user, msg) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span>' + msg;
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    }
}