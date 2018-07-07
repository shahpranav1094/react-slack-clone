function addLoadEvent(e) {
    var t = window.onload; typeof window.onload != "function" ? window.onload = e : window.onload = function () { t && t(), e() }
}
function splmInterop_Ping(e) { return e && (globalhostedInfo.hostversion = e), globalhostedInfo.version }

function splmInterop_HostServiceListUpdate(e, t) {
    try { var n = JSON.parse(t), r; for (r = 0; r < n.length; r += 1) globalhostedInfo.hostServices.push(new HostServiceDescriptor(n[r])) } catch (i) { return globalhostedInfo.GetJsonForException(i) } return "OK"
}

function splmInterop_RequestWebServiceList() {
    globalhostedInfo.sendServiceListToHost = !0; var e = globalhostedInfo.webServices, t = JSON.stringify(e); return t
}

function splmInterop_WebMethod(e, t) {
    try { var n = JSON.parse(e); if (n) { var r = globalhostedInfo.webServices, i = globalhostedInfo.webServices.length; for (var s = 0; s < i; s++) if (r[s].FQN == n.FQN && r[s].SvcVersion == n.SvcVersion) { var o = r[s]; if (o.HandleMethodCall) return o.HandleMethodCall(t) } } var u = "No service available for: " + e; throw { name: "InternalError", message: u } } catch (a) {
        return globalhostedInfo.GetJsonForException
        (a)
    } return globalhostedInfo.GetJsonForException({ name: "InvalidOperationException", message: "Unexpected WebMethod call path." })
} function splmInterop_WebEvent(e, t) { try { var n = JSON.parse(e); if (n) { var r = globalhostedInfo.webServices, i = globalhostedInfo.webServices.length; for (var s = 0; s < i; s++) if (r[s].FQN == n.FQN && r[s].SvcVersion == n.SvcVersion) { var o = r[s]; if (o.HandleEventCall) { var u = o.HandleEventCall(t); return u ? u : "" } } } var a = "No service available for: " + e; throw { name: "InternalError", message: a } } catch (f) { return globalhostedInfo.GetJsonForException(f) } return globalhostedInfo.GetJsonForException({ name: "InvalidOperationException", message: "Unexpected WebEvent call path." }) } function HostServiceDescriptor(e) { var t = this; t.SvcVersion = e.SvcVersion, t.FQN = e.FQN }

var mainHostInfo = function () {
    function t(e) {
        if (e && e.length > 11 && e.slice(0, 11) == '{"Exception') { var t = JSON.parse(e), n = t.Exception; if (n) throw n }
    }
    function n() {
        var t = JSON.stringify(e.webServices()); try {
            var n; return typeof window.splmHost_WebSideServiceListUpdate !=
            undefined && typeof window.splmHost_WebSideServiceListUpdate == "function" ? n = window.splmHost_WebSideServiceListUpdate("Replace", t) : typeof window.external.splmHost_WebSideServiceListUpdate != undefined ? n = window.external.splmHost_WebSideServiceListUpdate("Replace", t) : n = null, n
        } catch (r) { throw r }
    }
    var e = {};
    var async = false;
    return e.sendServiceListToHost = !1, e.title = "AW BrowserInterop Configuration Data", e.version = "2.1.0", e.hostversion = "", e.hostServices = [], e.webServices = [], e.StartHostHandShake = function () {
        try {            
            typeof window.splmHost_WebSideStartHandShake != undefined && typeof window.splmHost_WebSideStartHandShake == "function" ? window.splmHost_WebSideStartHandShake() :
            typeof window.external.splmHost_WebSideStartHandShake != undefined &&
            window.external.splmHost_WebSideStartHandShake()
        } catch (t) { throw t }
    },
        e.CallHost = function (n, r, callback) {
            if (typeof n != "object") throw window.alert("Bad input to CallHost: " + typeof n + " val: " + n), { name: "ArgumentException", message: "Invalid serviceDesc" };
            try {
                var i = JSON.stringify(n);
                if (typeof window.splmHostMethod != undefined && typeof window.splmHostMethod == "function") window.splmHostMethod(i, r, callback); else {
                    if (typeof window.external.splmHostMethod == undefined) throw s = null, { name: "ArgumentException", message: "No interop function to call on Host." };
                    if (window.external.async) {
                        window.external.splmHostMethod(i, r, callback);
                    } else {
                        var returnValue = window.external.splmHostMethod(i, r);
                        callback(returnValue);
                    }
                }
        } catch (o) { throw o }
        },
        e.CallHostEvent = function (n, r) { if (typeof n != "object") { window.alert("Bad input to CallHost: " + typeof n + " val: " + n); return } try { var i, s = JSON.stringify(n); if (typeof window.splmHostEvent != undefined && typeof window.splmHostEvent == "function") i = window.splmHostEvent(s, r); else { if (typeof window.external.splmHostEvent == undefined) throw { name: "ArgumentException", message: "No interop function to call on Host." }; i = window.external.splmHostEvent(s, r) } t(i) } catch (o) { throw o } }, e.FindLocalService = function (n) { var r = null; if (e.webServices()) for (var i = 0; i < e.webServices().length; i++) if (e.webServices()[i].FQN == n) { r = e.webServices()[i]; break } return r }, e.FindLocalService2 = function (n, r) {
        var i = null; if (e.webServices()) for (var s = 0; s < e
        .webServices().length; s++) if (e.webServices()[s].FQN == n && e.webServices()[s].SvcVersion == r) { i = e.webServices()[s]; break } return i
        },
        e.GetJsonForException = function (t) { var n = { Exception: { name: t.name || "no Name", message: t.message || "no Message" } }; return JSON.stringify(n) }, e
},
globalhostedInfo = mainHostInfo();

document.addEventListener("DOMContentLoaded", function () {
    if (typeof qt !== 'undefined') {
        new QWebChannel(qt.webChannelTransport, function (channel) {
            window.external = channel.objects.external;
            globalhostedInfo.StartHostHandShake();            
            window.external.async = true;
        });
    }
    else {
        window.external.async = false;
        globalhostedInfo.StartHostHandShake();
    }
});

