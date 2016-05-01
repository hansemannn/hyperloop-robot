var UIScreen = require('UIKit/UIScreen'),
    NSURLRequest = require('Foundation/NSURLRequest'),
    NSURL = require('Foundation/NSURL'),
    WKWebView = require("WebKit/WKWebView"),
    WKNavigation = require("WebKit/WKNavigation"),
    url;

/**
 *  Constructor
 **/
(function constructor(args) {
    url = "http:/sphero.hans-knoechel.de/static/" + args.identifier + ".html";
	$.window.add(createWebView());
    $.window.setTitle(L(args.identifier));
})(arguments[0] || {});

function createWebView() {
    var WebViewDelegate = createWebViewDelegate();
    var delegate = new WebViewDelegate();
    
    delegate.didStartProvisionalNavigation = function(webView, navigation) {
        var loader = Ti.UI.createActivityIndicator()
        $.window.setRightNavButton(loader);
        loader.show();
    };
    
    delegate.didFinishNavigation = function(webView, navigation) {
        $.window.setRightNavButton(null);
    };
    
    var web = WKWebView.alloc().initWithFrame(UIScreen.mainScreen().bounds);
    web.setNavigationDelegate(delegate);
    web.loadRequest(NSURLRequest.alloc().initWithURL(NSURL.alloc().initWithString(url)));
    
    return web;
}

function createWebViewDelegate() {
    var WebViewDelegate = Hyperloop.defineClass('WebViewDelegate', 'NSObject', ['WKNavigationDelegate']);

    WebViewDelegate.addMethod({
        selector: 'webView:didStartProvisionalNavigation:',
        instance: true,
        arguments: ['WKWebView', 'WKNavigation'],
        callback: function (webView, navigation) {
            if (this.didStartProvisionalNavigation) {
                this.didStartProvisionalNavigation(webView, navigation);
            }
        }
    });
    
    WebViewDelegate.addMethod({
        selector: 'webView:didFinishNavigation:',
        instance: true,
        arguments: ['WKWebView', 'WKNavigation'],
        callback: function (webView, navigation) {
            if (this.didFinishNavigation) {
                this.didFinishNavigation(webView, navigation);
            }
        }
    });    
    
    return WebViewDelegate;
}