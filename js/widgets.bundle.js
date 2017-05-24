(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
class WidgetParent {
    constructor(widgetInstanceId) {
        this.widgetInstanceId = widgetInstanceId;
        this.setSelector();
    }
    clbkCreated() {
    }
    clbkResized() {
    }
    clbkMoved() {
    }
    clbkTab() {
    }
    setSelector() {
        this.selector = ".jsWidgetContainer[data-widget-instance-id=" + this.widgetInstanceId + "]";
    }
}
exports.WidgetParent = WidgetParent;

},{}],2:[function(require,module,exports){
///<reference path="../typings/tsd.d.ts" />
"use strict";
var Helper;
(function (Helper) {
    class FormHelper {
        typeDefToHtmlForm(elem, name, formName, type, typeDefs, level = 0) {
            let typeDef = this.getTypeDef(type, typeDefs);
            let iname, itype;
            let hType = $("<span style='color:#777;'>&nbsp;(" + type + ")</span>").prop('outerHTML');
            if (typeDef == null) {
                let input = this.generateInputField(formName, type);
                $(elem).append($("<p style='padding-left:" + (level * 20) + "px'>" + name + hType + input + "</p>"));
            }
            else if (typeDef.fieldnames.length == 0) {
                $(elem).append($("<p style='padding-left:" + (level * 20) + "px'>" + name + hType + "</p>"));
            }
            else {
                $(elem).append($("<p style='padding-left:" + (level * 20) + "px'>" + name + hType + "</p>"));
                let i;
                for (i in typeDef.fieldnames) {
                    iname = typeDef.fieldnames[i];
                    itype = typeDef.fieldtypes[i];
                    let prefix = formName != "" ? formName + "." : "";
                    this.typeDefToHtmlForm(elem, iname, prefix + iname, itype, typeDefs, level + 1);
                }
            }
        }
        getTypeDef(type, typeDefs, request = 1) {
            let typeDef;
            let i;
            let filtered = typeDefs.filter((value, index, array) => { return type == value.type; });
            if (filtered.length > 0)
                return filtered[0];
            return null;
        }
        generateInputField(name, type) {
            let aInt = ["int8", "uint8", "int16", "uint16", "int32", "uint32", "int64", "uint64"];
            let aFloat = ["float32", "float64"];
            let aString = ["string"];
            let aTime = ["time", "duration"];
            let aBool = ["bool"];
            if (aInt.indexOf(type) != -1) {
                return $("<input type='number' name='" + name + "' value='' />").prop('outerHTML');
            }
            else if (aFloat.indexOf(type) != -1) {
                return $("<input type='number' name='" + name + "' value='' />").prop('outerHTML');
            }
            else if (aString.indexOf(type) != -1) {
                return $("<input type='text' name='" + name + "' value='' />").prop('outerHTML');
            }
            else if (aTime.indexOf(type) != -1) {
                return $("<input type='number' name='" + name + "' value='' />").prop('outerHTML');
            }
            else if (aBool.indexOf(type) != -1) {
                return $("<input type='checkbox' name='" + name + "' value='' />").prop('outerHTML');
            }
            else {
                throw new Error("Unknown primitive type: " + type);
            }
        }
        ;
    }
    Helper.FormHelper = FormHelper;
})(Helper = exports.Helper || (exports.Helper = {}));

},{}],3:[function(require,module,exports){
///<reference path="../../ts/typings/tsd.d.ts" />
"use strict";
const widget_1 = require('../../ts/classmodel/widget');
const html_1 = require('../../ts/helpers/html');
class WidgetTopicPublisher extends widget_1.WidgetParent {
    constructor(widgetInstanceId) {
        super(widgetInstanceId);
        this.topic = new ROSLIB.Topic({ ros: ros, name: "", messageType: "" });
    }
    // Mandatory callbacks
    clbkCreated() {
        $(document).delegate(this.selector + " .jsWidgetTopicPublisherOnce", 'click', (e) => {
            $(this.selector).find(".jsWidgetTopicPublisherOnce").attr("disabled", "disabled");
            $(this.selector).find(".jsWidgetTopicPublisherPublish").attr("disabled", "disabled");
            $(this.selector).find(".jsWidgetTopicPublisherStop").attr("disabled", "disabled");
            this.publishOnce();
            $(this.selector).find(".jsWidgetTopicPublisherOnce").removeAttr("disabled");
            $(this.selector).find(".jsWidgetTopicPublisherPublish").removeAttr("disabled");
            $(this.selector).find(".jsWidgetTopicPublisherStop").removeAttr("disabled");
        });
        $(document).delegate(this.selector + " .jsWidgetTopicPublisherPublish", 'click', (e) => {
            $(this.selector).find(".jsWidgetTopicPublisherOnce").attr("disabled", "disabled");
            $(this.selector).find(".jsWidgetTopicPublisherPublish").attr("disabled", "disabled");
            $(this.selector).find(".jsWidgetTopicPublisherStop").removeAttr("disabled");
            this.publish();
        });
        $(document).delegate(this.selector + " .jsWidgetTopicPublisherStop", 'click', (e) => {
            $(this.selector).find(".jsWidgetTopicPublisherOnce").removeAttr("disabled");
            $(this.selector).find(".jsWidgetTopicPublisherPublish").removeAttr("disabled");
            $(this.selector).find(".jsWidgetTopicPublisherStop").removeAttr("disabled");
            this.stop();
        });
    }
    clbkResized() {
    }
    clbkMoved() {
    }
    clbkTab() {
    }
    clbkConfirm() {
        ros.getMessageDetails(this.topicType, (typeDefs) => {
            var elem = $(this.selector + " .form form").html("");
            let htmlHelper = new html_1.Helper.FormHelper();
            $(this.selector).find("p.name").html(this.topicName);
            $(this.selector).find("p.type").html(this.topicType);
            htmlHelper.typeDefToHtmlForm(elem, "Object", "formObject", this.topicType, typeDefs, 0);
        }, (error) => {
            alert("Topic type not found, please try again");
            console.log(error);
        });
    }
    // button callbacks
    publishOnce() {
        let obj = this.getObjectForm(this.selector + " .form form");
        let name = this.topicName;
        let messageType = this.topicType;
        let publisher = new ROSLIB.Topic({
            ros: ros,
            name: name,
            messageType: messageType
        });
        publisher.publish(obj);
    }
    publish() {
        let name = this.topicName;
        let messageType = this.topicType;
        let publisher = new ROSLIB.Topic({
            ros: ros,
            name: name,
            messageType: messageType
        });
        this.interval = window.setInterval(() => { publisher.publish(this.getObjectForm(this.selector + " .form form")); }, 1000);
    }
    stop() {
        window.clearInterval(this.interval);
    }
    // helper methods
    getObjectForm(selector) {
        var input, name, type;
        var tree;
        var formObject = {};
        var inputs = $(selector).find("input[type=text], input[type=checkbox], input[type=number]");
        for (var i = 0; i < inputs.length; i++) {
            input = inputs[i];
            name = $(input).attr("name");
            type = $(input).attr("type");
            var nameSplit = name.split('.');
            for (let j = 0; j < nameSplit.length; j++) {
                let slice = nameSplit.slice(0, (j + 1));
                let prop = slice.join(".");
                eval("if(" + prop + " == undefined) " + prop + " = {}");
            }
            switch (type) {
                case 'text':
                    eval(name + " = '" + $(input).val() + "'");
                    break;
                case 'number':
                    eval(name + " = " + parseFloat($(input).val()));
                    break;
                case 'checkbox':
                    eval(name + " = " + $(input).is(":checked")) ? 1 : 0;
                    break;
            }
        }
        return formObject;
    }
    ;
}
window["WidgetTopicPublisher"] = WidgetTopicPublisher;

},{"../../ts/classmodel/widget":1,"../../ts/helpers/html":2}]},{},[3])

//# sourceMappingURL=widgets.bundle.js.map
