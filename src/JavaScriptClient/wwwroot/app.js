var authority = "https://login.xena.biz";
var client_id = "41eb10a8-7d7a-47ed-9cc4-8e1bfae2df25.xena.biz";
var redirect_uri = "http://localhost:5003/callback.html";
var post_logout_redirect_uri = "http://localhost:5003/index.html";
var scopes = "openid profile testapi";
var XenaAPIEndpoint = "https://www.xena.biz";

function log() {
    document.getElementById("results").innerText = "";

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== "string") {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById("results").innerHTML += msg + "\r\n";
    });
}

document.getElementById("login").addEventListener("click", login, false);
document.getElementById("api").addEventListener("click", api, false);
document.getElementById("logout").addEventListener("click", logout, false);

var config = {
    authority: authority,
    client_id: client_id,
    redirect_uri: redirect_uri,
    response_type: "id_token token",
    scope: scopes,
    post_logout_redirect_uri: post_logout_redirect_uri
};
var mgr = new Oidc.UserManager(config);

mgr.getUser().then(function (user) {
    if (user) {
        log("User logged in", user.profile);
    }
    else {
        log("User not logged in");
    }
});

function login() {
    mgr.signinRedirect();
}

function api() {
    mgr.getUser().then(function (user) {
        var url = XenaAPIEndpoint + "/Api/User/XenaUserMembership?ForceNoPaging=true";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            log(xhr.status, JSON.parse(xhr.responseText));
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send();
    });
}

function logout() {
    mgr.signoutRedirect();
}