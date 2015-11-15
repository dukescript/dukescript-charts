// Resource knockout-3.2.0.debug.js included by org.netbeans.html.ko4j.Knockout
/*
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS HEADER.
 *
 * Copyright 2013-2014 Oracle and/or its affiliates. All rights reserved.
 *
 * Oracle and Java are registered trademarks of Oracle and/or its affiliates.
 * Other names may be trademarks of their respective owners.
 *
 * The contents of this file are subject to the terms of either the GNU
 * General Public License Version 2 only ("GPL") or the Common
 * Development and Distribution License("CDDL") (collectively, the
 * "License"). You may not use this file except in compliance with the
 * License. You can obtain a copy of the License at
 * http://www.netbeans.org/cddl-gplv2.html
 * or nbbuild/licenses/CDDL-GPL-2-CP. See the License for the
 * specific language governing permissions and limitations under the
 * License.  When distributing the software, include this License Header
 * Notice in each file and include the License file at
 * nbbuild/licenses/CDDL-GPL-2-CP.  Oracle designates this
 * particular file as subject to the "Classpath" exception as provided
 * by Oracle in the GPL Version 2 section of the License file that
 * accompanied this code. If applicable, add the following below the
 * License Header, with the fields enclosed by brackets [] replaced by
 * your own identifying information:
 * "Portions Copyrighted [year] [name of copyright owner]"
 *
 * Contributor(s):
 *
 * The Original Software is NetBeans. The Initial Developer of the Original
 * Software is Oracle. Portions Copyright 2013-2014 Oracle. All Rights Reserved.
 *
 * If you wish your version of this file to be governed by only the CDDL
 * or only the GPL Version 2, indicate your decision by adding
 * "[Contributor] elects to include this software in this distribution
 * under the [CDDL or GPL Version 2] license." If you do not indicate a
 * single choice of license, a recipient has the option to distribute
 * your version of this file under either the CDDL, the GPL Version 2 or
 * to extend the choice of license to its licensees as provided above.
 * However, if you add GPL Version 2 code and therefore, elected the GPL
 * Version 2 license, then the option applies only if the new code is
 * made subject to such option by the copyright holder.
 */

/*!
 * Knockout JavaScript library v3.2.0
 * (c) Steven Sanderson - http://knockoutjs.com/
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

(function(){
var DEBUG=false;
(function(undefined){
    // (0, eval)('this') is a robust way of getting a reference to the global object
    // For details, see http://stackoverflow.com/questions/14119988/return-this-0-evalthis/14120023#14120023
    var window = this || (0, eval)('this'),
        document = window['document'],
        navigator = window['navigator'],
        jQueryInstance = window["jQuery"],
        JSON = window["JSON"];
(function(factory) {
    // Support three module loading scenarios
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        // [1] CommonJS/Node.js
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target, require);
    } else if (typeof define === 'function' && define['amd']) {
        // [2] AMD anonymous module
        define(['exports', 'require'], factory);
    } else {
        // [3] No module loader (plain <script> tag) - put directly in global namespace
        factory(window['ko'] = {});
    }
}(function(koExports, require){
// Internally, all KO objects are attached to koExports (even the non-exported ones whose names will be minified by the closure compiler).
// In the future, the following "ko" variable may be made distinct from "koExports" so that private objects are not externally reachable.
var ko = typeof koExports !== 'undefined' ? koExports : {};
// Google Closure Compiler helpers (used only to make the minified file smaller)
ko.exportSymbol = function(koPath, object) {
    var tokens = koPath.split(".");

    // In the future, "ko" may become distinct from "koExports" (so that non-exported objects are not reachable)
    // At that point, "target" would be set to: (typeof koExports !== "undefined" ? koExports : ko)
    var target = ko;

    for (var i = 0; i < tokens.length - 1; i++)
        target = target[tokens[i]];
    target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
    owner[publicName] = object;
};
ko.version = "3.2.0";

ko.exportSymbol('version', ko.version);
ko.utils = (function () {
    function objectForEach(obj, action) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                action(prop, obj[prop]);
            }
        }
    }

    function extend(target, source) {
        if (source) {
            for(var prop in source) {
                if(source.hasOwnProperty(prop)) {
                    target[prop] = source[prop];
                }
            }
        }
        return target;
    }

    function setPrototypeOf(obj, proto) {
        obj.__proto__ = proto;
        return obj;
    }

    var canSetPrototype = ({ __proto__: [] } instanceof Array);

    // Represent the known event types in a compact way, then at runtime transform it into a hash with event name as key (for fast lookup)
    var knownEvents = {}, knownEventTypesByEventName = {};
    var keyEventTypeName = (navigator && /Firefox\/2/i.test(navigator.userAgent)) ? 'KeyboardEvent' : 'UIEvents';
    knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
    knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
    objectForEach(knownEvents, function(eventType, knownEventsForType) {
        if (knownEventsForType.length) {
            for (var i = 0, j = knownEventsForType.length; i < j; i++)
                knownEventTypesByEventName[knownEventsForType[i]] = eventType;
        }
    });
    var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true }; // Workaround for an IE9 issue - https://github.com/SteveSanderson/knockout/issues/406

    // Detect IE versions for bug workarounds (uses IE conditionals, not UA string, for robustness)
    // Note that, since IE 10 does not support conditional comments, the following logic only detects IE < 10.
    // Currently this is by design, since IE 10+ behaves correctly when treated as a standard browser.
    // If there is a future need to detect specific versions of IE10+, we will amend this.
    var ieVersion = document && (function() {
        var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');

        // Keep constructing conditional HTML blocks until we hit one that resolves to an empty fragment
        while (
            div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
            iElems[0]
        ) {}
        return version > 4 ? version : undefined;
    }());
    var isIe6 = ieVersion === 6,
        isIe7 = ieVersion === 7;

    function isClickOnCheckableElement(element, eventType) {
        if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
        if (eventType.toLowerCase() != "click") return false;
        var inputType = element.type;
        return (inputType == "checkbox") || (inputType == "radio");
    }

    return {
        fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

        arrayForEach: function (array, action) {
            for (var i = 0, j = array.length; i < j; i++)
                action(array[i], i);
        },

        arrayIndexOf: function (array, item) {
            if (typeof Array.prototype.indexOf == "function")
                return Array.prototype.indexOf.call(array, item);
            for (var i = 0, j = array.length; i < j; i++)
                if (array[i] === item)
                    return i;
            return -1;
        },

        arrayFirst: function (array, predicate, predicateOwner) {
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate.call(predicateOwner, array[i], i))
                    return array[i];
            return null;
        },

        arrayRemoveItem: function (array, itemToRemove) {
            var index = ko.utils.arrayIndexOf(array, itemToRemove);
            if (index > 0) {
                array.splice(index, 1);
            }
            else if (index === 0) {
                array.shift();
            }
        },

        arrayGetDistinctValues: function (array) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++) {
                if (ko.utils.arrayIndexOf(result, array[i]) < 0)
                    result.push(array[i]);
            }
            return result;
        },

        arrayMap: function (array, mapping) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                result.push(mapping(array[i], i));
            return result;
        },

        arrayFilter: function (array, predicate) {
            array = array || [];
            var result = [];
            for (var i = 0, j = array.length; i < j; i++)
                if (predicate(array[i], i))
                    result.push(array[i]);
            return result;
        },

        arrayPushAll: function (array, valuesToPush) {
            if (valuesToPush instanceof Array)
                array.push.apply(array, valuesToPush);
            else
                for (var i = 0, j = valuesToPush.length; i < j; i++)
                    array.push(valuesToPush[i]);
            return array;
        },

        addOrRemoveItem: function(array, value, included) {
            var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.peekObservable(array), value);
            if (existingEntryIndex < 0) {
                if (included)
                    array.push(value);
            } else {
                if (!included)
                    array.splice(existingEntryIndex, 1);
            }
        },

        canSetPrototype: canSetPrototype,

        extend: extend,

        setPrototypeOf: setPrototypeOf,

        setPrototypeOfOrExtend: canSetPrototype ? setPrototypeOf : extend,

        objectForEach: objectForEach,

        objectMap: function(source, mapping) {
            if (!source)
                return source;
            var target = {};
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    target[prop] = mapping(source[prop], prop, source);
                }
            }
            return target;
        },

        emptyDomNode: function (domNode) {
            while (domNode.firstChild) {
                ko.removeNode(domNode.firstChild);
            }
        },

        moveCleanedNodesToContainerElement: function(nodes) {
            // Ensure it's a real array, as we're about to reparent the nodes and
            // we don't want the underlying collection to change while we're doing that.
            var nodesArray = ko.utils.makeArray(nodes);

            var container = document.createElement('div');
            for (var i = 0, j = nodesArray.length; i < j; i++) {
                container.appendChild(ko.cleanNode(nodesArray[i]));
            }
            return container;
        },

        cloneNodes: function (nodesArray, shouldCleanNodes) {
            for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
                var clonedNode = nodesArray[i].cloneNode(true);
                newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
            }
            return newNodesArray;
        },

        setDomNodeChildren: function (domNode, childNodes) {
            ko.utils.emptyDomNode(domNode);
            if (childNodes) {
                for (var i = 0, j = childNodes.length; i < j; i++)
                    domNode.appendChild(childNodes[i]);
            }
        },

        replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
            var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
            if (nodesToReplaceArray.length > 0) {
                var insertionPoint = nodesToReplaceArray[0];
                var parent = insertionPoint.parentNode;
                for (var i = 0, j = newNodesArray.length; i < j; i++)
                    parent.insertBefore(newNodesArray[i], insertionPoint);
                for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
                    ko.removeNode(nodesToReplaceArray[i]);
                }
            }
        },

        fixUpContinuousNodeArray: function(continuousNodeArray, parentNode) {
            // Before acting on a set of nodes that were previously outputted by a template function, we have to reconcile
            // them against what is in the DOM right now. It may be that some of the nodes have already been removed, or that
            // new nodes might have been inserted in the middle, for example by a binding. Also, there may previously have been
            // leading comment nodes (created by rewritten string-based templates) that have since been removed during binding.
            // So, this function translates the old "map" output array into its best guess of the set of current DOM nodes.
            //
            // Rules:
            //   [A] Any leading nodes that have been removed should be ignored
            //       These most likely correspond to memoization nodes that were already removed during binding
            //       See https://github.com/SteveSanderson/knockout/pull/440
            //   [B] We want to output a continuous series of nodes. So, ignore any nodes that have already been removed,
            //       and include any nodes that have been inserted among the previous collection

            if (continuousNodeArray.length) {
                // The parent node can be a virtual element; so get the real parent node
                parentNode = (parentNode.nodeType === 8 && parentNode.parentNode) || parentNode;

                // Rule [A]
                while (continuousNodeArray.length && continuousNodeArray[0].parentNode !== parentNode)
                    continuousNodeArray.shift();

                // Rule [B]
                if (continuousNodeArray.length > 1) {
                    var current = continuousNodeArray[0], last = continuousNodeArray[continuousNodeArray.length - 1];
                    // Replace with the actual new continuous node set
                    continuousNodeArray.length = 0;
                    while (current !== last) {
                        continuousNodeArray.push(current);
                        current = current.nextSibling;
                        if (!current) // Won't happen, except if the developer has manually removed some DOM elements (then we're in an undefined scenario)
                            return;
                    }
                    continuousNodeArray.push(last);
                }
            }
            return continuousNodeArray;
        },

        setOptionNodeSelectionState: function (optionNode, isSelected) {
            // IE6 sometimes throws "unknown error" if you try to write to .selected directly, whereas Firefox struggles with setAttribute. Pick one based on browser.
            if (ieVersion < 7)
                optionNode.setAttribute("selected", isSelected);
            else
                optionNode.selected = isSelected;
        },

        stringTrim: function (string) {
            return string === null || string === undefined ? '' :
                string.trim ?
                    string.trim() :
                    string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
        },

        stringStartsWith: function (string, startsWith) {
            string = string || "";
            if (startsWith.length > string.length)
                return false;
            return string.substring(0, startsWith.length) === startsWith;
        },

        domNodeIsContainedBy: function (node, containedByNode) {
            if (node === containedByNode)
                return true;
            if (node.nodeType === 11)
                return false; // Fixes issue #1162 - can't use node.contains for document fragments on IE8
            if (containedByNode.contains)
                return containedByNode.contains(node.nodeType === 3 ? node.parentNode : node);
            if (containedByNode.compareDocumentPosition)
                return (containedByNode.compareDocumentPosition(node) & 16) == 16;
            while (node && node != containedByNode) {
                node = node.parentNode;
            }
            return !!node;
        },

        domNodeIsAttachedToDocument: function (node) {
            return ko.utils.domNodeIsContainedBy(node, node.ownerDocument.documentElement);
        },

        anyDomNodeIsAttachedToDocument: function(nodes) {
            return !!ko.utils.arrayFirst(nodes, ko.utils.domNodeIsAttachedToDocument);
        },

        tagNameLower: function(element) {
            // For HTML elements, tagName will always be upper case; for XHTML elements, it'll be lower case.
            // Possible future optimization: If we know it's an element from an XHTML document (not HTML),
            // we don't need to do the .toLowerCase() as it will always be lower case anyway.
            return element && element.tagName && element.tagName.toLowerCase();
        },

        registerEventHandler: function (element, eventType, handler) {
            var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
            if (!mustUseAttachEvent && jQueryInstance) {
                jQueryInstance(element)['bind'](eventType, handler);
            } else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
                element.addEventListener(eventType, handler, false);
            else if (typeof element.attachEvent != "undefined") {
                var attachEventHandler = function (event) { handler.call(element, event); },
                    attachEventName = "on" + eventType;
                element.attachEvent(attachEventName, attachEventHandler);

                // IE does not dispose attachEvent handlers automatically (unlike with addEventListener)
                // so to avoid leaks, we have to remove them manually. See bug #856
                ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
                    element.detachEvent(attachEventName, attachEventHandler);
                });
            } else
                throw new Error("Browser doesn't support addEventListener or attachEvent");
        },

        triggerEvent: function (element, eventType) {
            if (!(element && element.nodeType))
                throw new Error("element must be a DOM node when calling triggerEvent");

            // For click events on checkboxes and radio buttons, jQuery toggles the element checked state *after* the
            // event handler runs instead of *before*. (This was fixed in 1.9 for checkboxes but not for radio buttons.)
            // IE doesn't change the checked state when you trigger the click event using "fireEvent".
            // In both cases, we'll use the click method instead.
            var useClickWorkaround = isClickOnCheckableElement(element, eventType);

            if (jQueryInstance && !useClickWorkaround) {
                jQueryInstance(element)['trigger'](eventType);
            } else if (typeof document.createEvent == "function") {
                if (typeof element.dispatchEvent == "function") {
                    var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
                    var event = document.createEvent(eventCategory);
                    event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
                    element.dispatchEvent(event);
                }
                else
                    throw new Error("The supplied element doesn't support dispatchEvent");
            } else if (useClickWorkaround && element.click) {
                element.click();
            } else if (typeof element.fireEvent != "undefined") {
                element.fireEvent("on" + eventType);
            } else {
                throw new Error("Browser doesn't support triggering events");
            }
        },

        unwrapObservable: function (value) {
            return ko.isObservable(value) ? value() : value;
        },

        peekObservable: function (value) {
            return ko.isObservable(value) ? value.peek() : value;
        },

        toggleDomNodeCssClass: function (node, classNames, shouldHaveClass) {
            if (classNames) {
                var cssClassNameRegex = /\S+/g,
                    currentClassNames = node.className.match(cssClassNameRegex) || [];
                ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
                    ko.utils.addOrRemoveItem(currentClassNames, className, shouldHaveClass);
                });
                node.className = currentClassNames.join(" ");
            }
        },

        setTextContent: function(element, textContent) {
            var value = ko.utils.unwrapObservable(textContent);
            if ((value === null) || (value === undefined))
                value = "";

            // We need there to be exactly one child: a text node.
            // If there are no children, more than one, or if it's not a text node,
            // we'll clear everything and create a single text node.
            var innerTextNode = ko.virtualElements.firstChild(element);
            if (!innerTextNode || innerTextNode.nodeType != 3 || ko.virtualElements.nextSibling(innerTextNode)) {
                ko.virtualElements.setDomNodeChildren(element, [element.ownerDocument.createTextNode(value)]);
            } else {
                innerTextNode.data = value;
            }

            ko.utils.forceRefresh(element);
        },

        setElementName: function(element, name) {
            element.name = name;

            // Workaround IE 6/7 issue
            // - https://github.com/SteveSanderson/knockout/issues/197
            // - http://www.matts411.com/post/setting_the_name_attribute_in_ie_dom/
            if (ieVersion <= 7) {
                try {
                    element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
                }
                catch(e) {} // For IE9 with doc mode "IE9 Standards" and browser mode "IE9 Compatibility View"
            }
        },

        forceRefresh: function(node) {
            // Workaround for an IE9 rendering bug - https://github.com/SteveSanderson/knockout/issues/209
            if (ieVersion >= 9) {
                // For text nodes and comment nodes (most likely virtual elements), we will have to refresh the container
                var elem = node.nodeType == 1 ? node : node.parentNode;
                if (elem.style)
                    elem.style.zoom = elem.style.zoom;
            }
        },

        ensureSelectElementIsRenderedCorrectly: function(selectElement) {
            // Workaround for IE9 rendering bug - it doesn't reliably display all the text in dynamically-added select boxes unless you force it to re-render by updating the width.
            // (See https://github.com/SteveSanderson/knockout/issues/312, http://stackoverflow.com/questions/5908494/select-only-shows-first-char-of-selected-option)
            // Also fixes IE7 and IE8 bug that causes selects to be zero width if enclosed by 'if' or 'with'. (See issue #839)
            if (ieVersion) {
                var originalWidth = selectElement.style.width;
                selectElement.style.width = 0;
                selectElement.style.width = originalWidth;
            }
        },

        range: function (min, max) {
            min = ko.utils.unwrapObservable(min);
            max = ko.utils.unwrapObservable(max);
            var result = [];
            for (var i = min; i <= max; i++)
                result.push(i);
            return result;
        },

        makeArray: function(arrayLikeObject) {
            var result = [];
            for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
                result.push(arrayLikeObject[i]);
            };
            return result;
        },

        isIe6 : isIe6,
        isIe7 : isIe7,
        ieVersion : ieVersion,

        getFormFields: function(form, fieldName) {
            var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
            var isMatchingField = (typeof fieldName == 'string')
                ? function(field) { return field.name === fieldName }
                : function(field) { return fieldName.test(field.name) }; // Treat fieldName as regex or object containing predicate
            var matches = [];
            for (var i = fields.length - 1; i >= 0; i--) {
                if (isMatchingField(fields[i]))
                    matches.push(fields[i]);
            };
            return matches;
        },

        parseJson: function (jsonString) {
            if (typeof jsonString == "string") {
                jsonString = ko.utils.stringTrim(jsonString);
                if (jsonString) {
                    if (JSON && JSON.parse) // Use native parsing where available
                        return JSON.parse(jsonString);
                    return (new Function("return " + jsonString))(); // Fallback on less safe parsing for older browsers
                }
            }
            return null;
        },

        stringifyJson: function (data, replacer, space) {   // replacer and space are optional
            if (!JSON || !JSON.stringify)
                throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
            return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
        },

        postJson: function (urlOrForm, data, options) {
            options = options || {};
            var params = options['params'] || {};
            var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
            var url = urlOrForm;

            // If we were given a form, use its 'action' URL and pick out any requested field values
            if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
                var originalForm = urlOrForm;
                url = originalForm.action;
                for (var i = includeFields.length - 1; i >= 0; i--) {
                    var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
                    for (var j = fields.length - 1; j >= 0; j--)
                        params[fields[j].name] = fields[j].value;
                }
            }

            data = ko.utils.unwrapObservable(data);
            var form = document.createElement("form");
            form.style.display = "none";
            form.action = url;
            form.method = "post";
            for (var key in data) {
                // Since 'data' this is a model object, we include all properties including those inherited from its prototype
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
                form.appendChild(input);
            }
            objectForEach(params, function(key, value) {
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                form.appendChild(input);
            });
            document.body.appendChild(form);
            options['submitter'] ? options['submitter'](form) : form.submit();
            setTimeout(function () { form.parentNode.removeChild(form); }, 0);
        }
    }
}());

ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);
ko.exportSymbol('utils.objectForEach', ko.utils.objectForEach);
ko.exportSymbol('utils.addOrRemoveItem', ko.utils.addOrRemoveItem);
ko.exportSymbol('unwrap', ko.utils.unwrapObservable); // Convenient shorthand, because this is used so commonly

if (!Function.prototype['bind']) {
    // Function.prototype.bind is a standard part of ECMAScript 5th Edition (December 2009, http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf)
    // In case the browser doesn't implement it natively, provide a JavaScript implementation. This implementation is based on the one in prototype.js
    Function.prototype['bind'] = function (object) {
        var originalFunction = this, args = Array.prototype.slice.call(arguments), object = args.shift();
        return function () {
            return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
        };
    };
}

ko.utils.domData = new (function () {
    var uniqueId = 0;
    var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
    var dataStore = {};

    function getAll(node, createIfNotFound) {
        var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
        var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null") && dataStore[dataStoreKey];
        if (!hasExistingDataStore) {
            if (!createIfNotFound)
                return undefined;
            dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
            dataStore[dataStoreKey] = {};
        }
        return dataStore[dataStoreKey];
    }

    return {
        get: function (node, key) {
            var allDataForNode = getAll(node, false);
            return allDataForNode === undefined ? undefined : allDataForNode[key];
        },
        set: function (node, key, value) {
            if (value === undefined) {
                // Make sure we don't actually create a new domData key if we are actually deleting a value
                if (getAll(node, false) === undefined)
                    return;
            }
            var allDataForNode = getAll(node, true);
            allDataForNode[key] = value;
        },
        clear: function (node) {
            var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
            if (dataStoreKey) {
                delete dataStore[dataStoreKey];
                node[dataStoreKeyExpandoPropertyName] = null;
                return true; // Exposing "did clean" flag purely so specs can infer whether things have been cleaned up as intended
            }
            return false;
        },

        nextKey: function () {
            return (uniqueId++) + dataStoreKeyExpandoPropertyName;
        }
    };
})();

ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear); // Exporting only so specs can clear up after themselves fully

ko.utils.domNodeDisposal = new (function () {
    var domDataKey = ko.utils.domData.nextKey();
    var cleanableNodeTypes = { 1: true, 8: true, 9: true };       // Element, Comment, Document
    var cleanableNodeTypesWithDescendants = { 1: true, 9: true }; // Element, Document

    function getDisposeCallbacksCollection(node, createIfNotFound) {
        var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
        if ((allDisposeCallbacks === undefined) && createIfNotFound) {
            allDisposeCallbacks = [];
            ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
        }
        return allDisposeCallbacks;
    }
    function destroyCallbacksCollection(node) {
        ko.utils.domData.set(node, domDataKey, undefined);
    }

    function cleanSingleNode(node) {
        // Run all the dispose callbacks
        var callbacks = getDisposeCallbacksCollection(node, false);
        if (callbacks) {
            callbacks = callbacks.slice(0); // Clone, as the array may be modified during iteration (typically, callbacks will remove themselves)
            for (var i = 0; i < callbacks.length; i++)
                callbacks[i](node);
        }

        // Erase the DOM data
        ko.utils.domData.clear(node);

        // Perform cleanup needed by external libraries (currently only jQuery, but can be extended)
        ko.utils.domNodeDisposal["cleanExternalData"](node);

        // Clear any immediate-child comment nodes, as these wouldn't have been found by
        // node.getElementsByTagName("*") in cleanNode() (comment nodes aren't elements)
        if (cleanableNodeTypesWithDescendants[node.nodeType])
            cleanImmediateCommentTypeChildren(node);
    }

    function cleanImmediateCommentTypeChildren(nodeWithChildren) {
        var child, nextChild = nodeWithChildren.firstChild;
        while (child = nextChild) {
            nextChild = child.nextSibling;
            if (child.nodeType === 8)
                cleanSingleNode(child);
        }
    }

    return {
        addDisposeCallback : function(node, callback) {
            if (typeof callback != "function")
                throw new Error("Callback must be a function");
            getDisposeCallbacksCollection(node, true).push(callback);
        },

        removeDisposeCallback : function(node, callback) {
            var callbacksCollection = getDisposeCallbacksCollection(node, false);
            if (callbacksCollection) {
                ko.utils.arrayRemoveItem(callbacksCollection, callback);
                if (callbacksCollection.length == 0)
                    destroyCallbacksCollection(node);
            }
        },

        cleanNode : function(node) {
            // First clean this node, where applicable
            if (cleanableNodeTypes[node.nodeType]) {
                cleanSingleNode(node);

                // ... then its descendants, where applicable
                if (cleanableNodeTypesWithDescendants[node.nodeType]) {
                    // Clone the descendants list in case it changes during iteration
                    var descendants = [];
                    ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
                    for (var i = 0, j = descendants.length; i < j; i++)
                        cleanSingleNode(descendants[i]);
                }
            }
            return node;
        },

        removeNode : function(node) {
            ko.cleanNode(node);
            if (node.parentNode)
                node.parentNode.removeChild(node);
        },

        "cleanExternalData" : function (node) {
            // Special support for jQuery here because it's so commonly used.
            // Many jQuery plugins (including jquery.tmpl) store data using jQuery's equivalent of domData
            // so notify it to tear down any resources associated with the node & descendants here.
            if (jQueryInstance && (typeof jQueryInstance['cleanData'] == "function"))
                jQueryInstance['cleanData']([node]);
        }
    }
})();
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode; // Shorthand name for convenience
ko.removeNode = ko.utils.domNodeDisposal.removeNode; // Shorthand name for convenience
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
(function () {
    var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;

    function simpleHtmlParse(html) {
        // Based on jQuery's "clean" function, but only accounting for table-related elements.
        // If you have referenced jQuery, this won't be used anyway - KO will use jQuery's "clean" function directly

        // Note that there's still an issue in IE < 9 whereby it will discard comment nodes that are the first child of
        // a descendant node. For example: "<div><!-- mycomment -->abc</div>" will get parsed as "<div>abc</div>"
        // This won't affect anyone who has referenced jQuery, and there's always the workaround of inserting a dummy node
        // (possibly a text node) in front of the comment. So, KO does not attempt to workaround this IE issue automatically at present.

        // Trim whitespace, otherwise indexOf won't work as expected
        var tags = ko.utils.stringTrim(html).toLowerCase(), div = document.createElement("div");

        // Finds the first match from the left column, and returns the corresponding "wrap" data from the right column
        var wrap = tags.match(/^<(thead|tbody|tfoot)/)              && [1, "<table>", "</table>"] ||
                   !tags.indexOf("<tr")                             && [2, "<table><tbody>", "</tbody></table>"] ||
                   (!tags.indexOf("<td") || !tags.indexOf("<th"))   && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
                   /* anything else */                                 [0, "", ""];

        // Go to html and back, then peel off extra wrappers
        // Note that we always prefix with some dummy text, because otherwise, IE<9 will strip out leading comment nodes in descendants. Total madness.
        var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
        if (typeof window['innerShiv'] == "function") {
            div.appendChild(window['innerShiv'](markup));
        } else {
            div.innerHTML = markup;
        }

        // Move to the right depth
        while (wrap[0]--)
            div = div.lastChild;

        return ko.utils.makeArray(div.lastChild.childNodes);
    }

    function jQueryHtmlParse(html) {
        // jQuery's "parseHTML" function was introduced in jQuery 1.8.0 and is a documented public API.
        if (jQueryInstance['parseHTML']) {
            return jQueryInstance['parseHTML'](html) || []; // Ensure we always return an array and never null
        } else {
            // For jQuery < 1.8.0, we fall back on the undocumented internal "clean" function.
            var elems = jQueryInstance['clean']([html]);

            // As of jQuery 1.7.1, jQuery parses the HTML by appending it to some dummy parent nodes held in an in-memory document fragment.
            // Unfortunately, it never clears the dummy parent nodes from the document fragment, so it leaks memory over time.
            // Fix this by finding the top-most dummy parent element, and detaching it from its owner fragment.
            if (elems && elems[0]) {
                // Find the top-most parent element that's a direct child of a document fragment
                var elem = elems[0];
                while (elem.parentNode && elem.parentNode.nodeType !== 11 /* i.e., DocumentFragment */)
                    elem = elem.parentNode;
                // ... then detach it
                if (elem.parentNode)
                    elem.parentNode.removeChild(elem);
            }

            return elems;
        }
    }

    ko.utils.parseHtmlFragment = function(html) {
        return jQueryInstance ? jQueryHtmlParse(html)   // As below, benefit from jQuery's optimisations where possible
                              : simpleHtmlParse(html);  // ... otherwise, this simple logic will do in most common cases.
    };

    ko.utils.setHtml = function(node, html) {
        ko.utils.emptyDomNode(node);

        // There's no legitimate reason to display a stringified observable without unwrapping it, so we'll unwrap it
        html = ko.utils.unwrapObservable(html);

        if ((html !== null) && (html !== undefined)) {
            if (typeof html != 'string')
                html = html.toString();

            // jQuery contains a lot of sophisticated code to parse arbitrary HTML fragments,
            // for example <tr> elements which are not normally allowed to exist on their own.
            // If you've referenced jQuery we'll use that rather than duplicating its code.
            if (jQueryInstance) {
                jQueryInstance(node)['html'](html);
            } else {
                // ... otherwise, use KO's own parsing logic.
                var parsedNodes = ko.utils.parseHtmlFragment(html);
                for (var i = 0; i < parsedNodes.length; i++)
                    node.appendChild(parsedNodes[i]);
            }
        }
    };
})();

ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

ko.memoization = (function () {
    var memos = {};

    function randomMax8HexChars() {
        return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
    }
    function generateRandomId() {
        return randomMax8HexChars() + randomMax8HexChars();
    }
    function findMemoNodes(rootNode, appendToArray) {
        if (!rootNode)
            return;
        if (rootNode.nodeType == 8) {
            var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
            if (memoId != null)
                appendToArray.push({ domNode: rootNode, memoId: memoId });
        } else if (rootNode.nodeType == 1) {
            for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
                findMemoNodes(childNodes[i], appendToArray);
        }
    }

    return {
        memoize: function (callback) {
            if (typeof callback != "function")
                throw new Error("You can only pass a function to ko.memoization.memoize()");
            var memoId = generateRandomId();
            memos[memoId] = callback;
            return "<!--[ko_memo:" + memoId + "]-->";
        },

        unmemoize: function (memoId, callbackParams) {
            var callback = memos[memoId];
            if (callback === undefined)
                throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
            try {
                callback.apply(null, callbackParams || []);
                return true;
            }
            finally { delete memos[memoId]; }
        },

        unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
            var memos = [];
            findMemoNodes(domNode, memos);
            for (var i = 0, j = memos.length; i < j; i++) {
                var node = memos[i].domNode;
                var combinedParams = [node];
                if (extraCallbackParamsArray)
                    ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
                ko.memoization.unmemoize(memos[i].memoId, combinedParams);
                node.nodeValue = ""; // Neuter this node so we don't try to unmemoize it again
                if (node.parentNode)
                    node.parentNode.removeChild(node); // If possible, erase it totally (not always possible - someone else might just hold a reference to it then call unmemoizeDomNodeAndDescendants again)
            }
        },

        parseMemoText: function (memoText) {
            var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
            return match ? match[1] : null;
        }
    };
})();

ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
ko.extenders = {
    'throttle': function(target, timeout) {
        // Throttling means two things:

        // (1) For dependent observables, we throttle *evaluations* so that, no matter how fast its dependencies
        //     notify updates, the target doesn't re-evaluate (and hence doesn't notify) faster than a certain rate
        target['throttleEvaluation'] = timeout;

        // (2) For writable targets (observables, or writable dependent observables), we throttle *writes*
        //     so the target cannot change value synchronously or faster than a certain rate
        var writeTimeoutInstance = null;
        return ko.dependentObservable({
            'read': target,
            'write': function(value) {
                clearTimeout(writeTimeoutInstance);
                writeTimeoutInstance = setTimeout(function() {
                    target(value);
                }, timeout);
            }
        });
    },

    'rateLimit': function(target, options) {
        var timeout, method, limitFunction;

        if (typeof options == 'number') {
            timeout = options;
        } else {
            timeout = options['timeout'];
            method = options['method'];
        }

        limitFunction = method == 'notifyWhenChangesStop' ?  debounce : throttle;
        target.limit(function(callback) {
            return limitFunction(callback, timeout);
        });
    },

    'notify': function(target, notifyWhen) {
        target["equalityComparer"] = notifyWhen == "always" ?
            null :  // null equalityComparer means to always notify
            valuesArePrimitiveAndEqual;
    }
};

var primitiveTypes = { 'undefined':1, 'boolean':1, 'number':1, 'string':1 };
function valuesArePrimitiveAndEqual(a, b) {
    var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
    return oldValueIsPrimitive ? (a === b) : false;
}

function throttle(callback, timeout) {
    var timeoutInstance;
    return function () {
        if (!timeoutInstance) {
            timeoutInstance = setTimeout(function() {
                timeoutInstance = undefined;
                callback();
            }, timeout);
        }
    };
}

function debounce(callback, timeout) {
    var timeoutInstance;
    return function () {
        clearTimeout(timeoutInstance);
        timeoutInstance = setTimeout(callback, timeout);
    };
}

function applyExtenders(requestedExtenders) {
    var target = this;
    if (requestedExtenders) {
        ko.utils.objectForEach(requestedExtenders, function(key, value) {
            var extenderHandler = ko.extenders[key];
            if (typeof extenderHandler == 'function') {
                target = extenderHandler(target, value) || target;
            }
        });
    }
    return target;
}

ko.exportSymbol('extenders', ko.extenders);

ko.subscription = function (target, callback, disposeCallback) {
    this.target = target;
    this.callback = callback;
    this.disposeCallback = disposeCallback;
    this.isDisposed = false;
    ko.exportProperty(this, 'dispose', this.dispose);
};
ko.subscription.prototype.dispose = function () {
    this.isDisposed = true;
    this.disposeCallback();
};

ko.subscribable = function () {
    ko.utils.setPrototypeOfOrExtend(this, ko.subscribable['fn']);
    this._subscriptions = {};
}

var defaultEvent = "change";

var ko_subscribable_fn = {
    subscribe: function (callback, callbackTarget, event) {
        var self = this;

        event = event || defaultEvent;
        var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

        var subscription = new ko.subscription(self, boundCallback, function () {
            ko.utils.arrayRemoveItem(self._subscriptions[event], subscription);
            if (self.afterSubscriptionRemove)
                self.afterSubscriptionRemove(event);
        });

        if (self.beforeSubscriptionAdd)
            self.beforeSubscriptionAdd(event);

        if (!self._subscriptions[event])
            self._subscriptions[event] = [];
        self._subscriptions[event].push(subscription);

        return subscription;
    },

    "notifySubscribers": function (valueToNotify, event) {
        event = event || defaultEvent;
        if (this.hasSubscriptionsForEvent(event)) {
            try {
                ko.dependencyDetection.begin(); // Begin suppressing dependency detection (by setting the top frame to undefined)
                for (var a = this._subscriptions[event].slice(0), i = 0, subscription; subscription = a[i]; ++i) {
                    // In case a subscription was disposed during the arrayForEach cycle, check
                    // for isDisposed on each subscription before invoking its callback
                    if (!subscription.isDisposed)
                        subscription.callback(valueToNotify);
                }
            } finally {
                ko.dependencyDetection.end(); // End suppressing dependency detection
            }
        }
    },

    limit: function(limitFunction) {
        var self = this, selfIsObservable = ko.isObservable(self),
            isPending, previousValue, pendingValue, beforeChange = 'beforeChange';

        if (!self._origNotifySubscribers) {
            self._origNotifySubscribers = self["notifySubscribers"];
            self["notifySubscribers"] = function(value, event) {
                if (!event || event === defaultEvent) {
                    self._rateLimitedChange(value);
                } else if (event === beforeChange) {
                    self._rateLimitedBeforeChange(value);
                } else {
                    self._origNotifySubscribers(value, event);
                }
            };
        }

        var finish = limitFunction(function() {
            // If an observable provided a reference to itself, access it to get the latest value.
            // This allows computed observables to delay calculating their value until needed.
            if (selfIsObservable && pendingValue === self) {
                pendingValue = self();
            }
            isPending = false;
            if (self.isDifferent(previousValue, pendingValue)) {
                self._origNotifySubscribers(previousValue = pendingValue);
            }
        });

        self._rateLimitedChange = function(value) {
            isPending = true;
            pendingValue = value;
            finish();
        };
        self._rateLimitedBeforeChange = function(value) {
            if (!isPending) {
                previousValue = value;
                self._origNotifySubscribers(value, beforeChange);
            }
        };
    },

    hasSubscriptionsForEvent: function(event) {
        return this._subscriptions[event] && this._subscriptions[event].length;
    },

    getSubscriptionsCount: function () {
        var total = 0;
        ko.utils.objectForEach(this._subscriptions, function(eventName, subscriptions) {
            total += subscriptions.length;
        });
        return total;
    },

    isDifferent: function(oldValue, newValue) {
        return !this['equalityComparer'] || !this['equalityComparer'](oldValue, newValue);
    },

    extend: applyExtenders
};

ko.exportProperty(ko_subscribable_fn, 'subscribe', ko_subscribable_fn.subscribe);
ko.exportProperty(ko_subscribable_fn, 'extend', ko_subscribable_fn.extend);
ko.exportProperty(ko_subscribable_fn, 'getSubscriptionsCount', ko_subscribable_fn.getSubscriptionsCount);

// For browsers that support proto assignment, we overwrite the prototype of each
// observable instance. Since observables are functions, we need Function.prototype
// to still be in the prototype chain.
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko_subscribable_fn, Function.prototype);
}

ko.subscribable['fn'] = ko_subscribable_fn;


ko.isSubscribable = function (instance) {
    return instance != null && typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
};

ko.exportSymbol('subscribable', ko.subscribable);
ko.exportSymbol('isSubscribable', ko.isSubscribable);

ko.computedContext = ko.dependencyDetection = (function () {
    var outerFrames = [],
        currentFrame,
        lastId = 0;

    // Return a unique ID that can be assigned to an observable for dependency tracking.
    // Theoretically, you could eventually overflow the number storage size, resulting
    // in duplicate IDs. But in JavaScript, the largest exact integral value is 2^53
    // or 9,007,199,254,740,992. If you created 1,000,000 IDs per second, it would
    // take over 285 years to reach that number.
    // Reference http://blog.vjeux.com/2010/javascript/javascript-max_int-number-limits.html
    function getId() {
        return ++lastId;
    }

    function begin(options) {
        outerFrames.push(currentFrame);
        currentFrame = options;
    }

    function end() {
        currentFrame = outerFrames.pop();
    }

    return {
        begin: begin,

        end: end,

        registerDependency: function (subscribable) {
            if (currentFrame) {
                if (!ko.isSubscribable(subscribable))
                    throw new Error("Only subscribable things can act as dependencies");
                currentFrame.callback(subscribable, subscribable._id || (subscribable._id = getId()));
            }
        },

        ignore: function (callback, callbackTarget, callbackArgs) {
            try {
                begin();
                return callback.apply(callbackTarget, callbackArgs || []);
            } finally {
                end();
            }
        },

        getDependenciesCount: function () {
            if (currentFrame)
                return currentFrame.computed.getDependenciesCount();
        },

        isInitial: function() {
            if (currentFrame)
                return currentFrame.isInitial;
        }
    };
})();

ko.exportSymbol('computedContext', ko.computedContext);
ko.exportSymbol('computedContext.getDependenciesCount', ko.computedContext.getDependenciesCount);
ko.exportSymbol('computedContext.isInitial', ko.computedContext.isInitial);
ko.exportSymbol('computedContext.isSleeping', ko.computedContext.isSleeping);
ko.observable = function (initialValue) {
    var _latestValue = initialValue;

    function observable() {
        if (arguments.length > 0) {
            // Write

            // Ignore writes if the value hasn't changed
            if (observable.isDifferent(_latestValue, arguments[0])) {
                observable.valueWillMutate();
                _latestValue = arguments[0];
                if (DEBUG) observable._latestValue = _latestValue;
                observable.valueHasMutated();
            }
            return this; // Permits chained assignments
        }
        else {
            // Read
            ko.dependencyDetection.registerDependency(observable); // The caller only needs to be notified of changes if they did a "read" operation
            return _latestValue;
        }
    }
    ko.subscribable.call(observable);
    ko.utils.setPrototypeOfOrExtend(observable, ko.observable['fn']);

    if (DEBUG) observable._latestValue = _latestValue;
    observable.peek = function() { return _latestValue };
    observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
    observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }

    ko.exportProperty(observable, 'peek', observable.peek);
    ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
    ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);

    return observable;
}

ko.observable['fn'] = {
    "equalityComparer": valuesArePrimitiveAndEqual
};

var protoProperty = ko.observable.protoProperty = "__ko_proto__";
ko.observable['fn'][protoProperty] = ko.observable;

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.observable constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko.observable['fn'], ko.subscribable['fn']);
}

ko.hasPrototype = function(instance, prototype) {
    if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
    if (instance[protoProperty] === prototype) return true;
    return ko.hasPrototype(instance[protoProperty], prototype); // Walk the prototype chain
};

ko.isObservable = function (instance) {
    return ko.hasPrototype(instance, ko.observable);
}
ko.isWriteableObservable = function (instance) {
    // Observable
    if ((typeof instance == "function") && instance[protoProperty] === ko.observable)
        return true;
    // Writeable dependent observable
    if ((typeof instance == "function") && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction))
        return true;
    // Anything else
    return false;
}


ko.exportSymbol('observable', ko.observable);
ko.exportSymbol('isObservable', ko.isObservable);
ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
ko.exportSymbol('isWritableObservable', ko.isWriteableObservable);
ko.observableArray = function (initialValues) {
    initialValues = initialValues || [];

    if (typeof initialValues != 'object' || !('length' in initialValues))
        throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

    var result = ko.observable(initialValues);
    ko.utils.setPrototypeOfOrExtend(result, ko.observableArray['fn']);
    return result.extend({'trackArrayChanges':true});
};

ko.observableArray['fn'] = {
    'remove': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var removedValues = [];
        var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        for (var i = 0; i < underlyingArray.length; i++) {
            var value = underlyingArray[i];
            if (predicate(value)) {
                if (removedValues.length === 0) {
                    this.valueWillMutate();
                }
                removedValues.push(value);
                underlyingArray.splice(i, 1);
                i--;
            }
        }
        if (removedValues.length) {
            this.valueHasMutated();
        }
        return removedValues;
    },

    'removeAll': function (arrayOfValues) {
        // If you passed zero args, we remove everything
        if (arrayOfValues === undefined) {
            var underlyingArray = this.peek();
            var allValues = underlyingArray.slice(0);
            this.valueWillMutate();
            underlyingArray.splice(0, underlyingArray.length);
            this.valueHasMutated();
            return allValues;
        }
        // If you passed an arg, we interpret it as an array of entries to remove
        if (!arrayOfValues)
            return [];
        return this['remove'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'destroy': function (valueOrPredicate) {
        var underlyingArray = this.peek();
        var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        this.valueWillMutate();
        for (var i = underlyingArray.length - 1; i >= 0; i--) {
            var value = underlyingArray[i];
            if (predicate(value))
                underlyingArray[i]["_destroy"] = true;
        }
        this.valueHasMutated();
    },

    'destroyAll': function (arrayOfValues) {
        // If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return this['destroy'](function() { return true });

        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return this['destroy'](function (value) {
            return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
        });
    },

    'indexOf': function (item) {
        var underlyingArray = this();
        return ko.utils.arrayIndexOf(underlyingArray, item);
    },

    'replace': function(oldItem, newItem) {
        var index = this['indexOf'](oldItem);
        if (index >= 0) {
            this.valueWillMutate();
            this.peek()[index] = newItem;
            this.valueHasMutated();
        }
    }
};

// Populate ko.observableArray.fn with read/write functions from native arrays
// Important: Do not add any additional functions here that may reasonably be used to *read* data from the array
// because we'll eval them without causing subscriptions, so ko.computed output could end up getting stale
ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        // Use "peek" to avoid creating a subscription in any computed that we're executing in the context of
        // (for consistency with mutating regular observables)
        var underlyingArray = this.peek();
        this.valueWillMutate();
        this.cacheDiffForKnownOperation(underlyingArray, methodName, arguments);
        var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
        this.valueHasMutated();
        return methodCallResult;
    };
});

// Populate ko.observableArray.fn with read-only functions from native arrays
ko.utils.arrayForEach(["slice"], function (methodName) {
    ko.observableArray['fn'][methodName] = function () {
        var underlyingArray = this();
        return underlyingArray[methodName].apply(underlyingArray, arguments);
    };
});

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.observableArray constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko.observableArray['fn'], ko.observable['fn']);
}

ko.exportSymbol('observableArray', ko.observableArray);
var arrayChangeEventName = 'arrayChange';
ko.extenders['trackArrayChanges'] = function(target) {
    // Only modify the target observable once
    if (target.cacheDiffForKnownOperation) {
        return;
    }
    var trackingChanges = false,
        cachedDiff = null,
        pendingNotifications = 0,
        underlyingSubscribeFunction = target.subscribe;

    // Intercept "subscribe" calls, and for array change events, ensure change tracking is enabled
    target.subscribe = target['subscribe'] = function(callback, callbackTarget, event) {
        if (event === arrayChangeEventName) {
            trackChanges();
        }
        return underlyingSubscribeFunction.apply(this, arguments);
    };

    function trackChanges() {
        // Calling 'trackChanges' multiple times is the same as calling it once
        if (trackingChanges) {
            return;
        }

        trackingChanges = true;

        // Intercept "notifySubscribers" to track how many times it was called.
        var underlyingNotifySubscribersFunction = target['notifySubscribers'];
        target['notifySubscribers'] = function(valueToNotify, event) {
            if (!event || event === defaultEvent) {
                ++pendingNotifications;
            }
            return underlyingNotifySubscribersFunction.apply(this, arguments);
        };

        // Each time the array changes value, capture a clone so that on the next
        // change it's possible to produce a diff
        var previousContents = [].concat(target.peek() || []);
        cachedDiff = null;
        target.subscribe(function(currentContents) {
            // Make a copy of the current contents and ensure it's an array
            currentContents = [].concat(currentContents || []);

            // Compute the diff and issue notifications, but only if someone is listening
            if (target.hasSubscriptionsForEvent(arrayChangeEventName)) {
                var changes = getChanges(previousContents, currentContents);
                if (changes.length) {
                    target['notifySubscribers'](changes, arrayChangeEventName);
                }
            }

            // Eliminate references to the old, removed items, so they can be GCed
            previousContents = currentContents;
            cachedDiff = null;
            pendingNotifications = 0;
        });
    }

    function getChanges(previousContents, currentContents) {
        // We try to re-use cached diffs.
        // The scenarios where pendingNotifications > 1 are when using rate-limiting or the Deferred Updates
        // plugin, which without this check would not be compatible with arrayChange notifications. Normally,
        // notifications are issued immediately so we wouldn't be queueing up more than one.
        if (!cachedDiff || pendingNotifications > 1) {
            cachedDiff = ko.utils.compareArrays(previousContents, currentContents, { 'sparse': true });
        }

        return cachedDiff;
    }

    target.cacheDiffForKnownOperation = function(rawArray, operationName, args) {
        // Only run if we're currently tracking changes for this observable array
        // and there aren't any pending deferred notifications.
        if (!trackingChanges || pendingNotifications) {
            return;
        }
        var diff = [],
            arrayLength = rawArray.length,
            argsLength = args.length,
            offset = 0;

        function pushDiff(status, value, index) {
            return diff[diff.length] = { 'status': status, 'value': value, 'index': index };
        }
        switch (operationName) {
            case 'push':
                offset = arrayLength;
            case 'unshift':
                for (var index = 0; index < argsLength; index++) {
                    pushDiff('added', args[index], offset + index);
                }
                break;

            case 'pop':
                offset = arrayLength - 1;
            case 'shift':
                if (arrayLength) {
                    pushDiff('deleted', rawArray[offset], offset);
                }
                break;

            case 'splice':
                // Negative start index means 'from end of array'. After that we clamp to [0...arrayLength].
                // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
                var startIndex = Math.min(Math.max(0, args[0] < 0 ? arrayLength + args[0] : args[0]), arrayLength),
                    endDeleteIndex = argsLength === 1 ? arrayLength : Math.min(startIndex + (args[1] || 0), arrayLength),
                    endAddIndex = startIndex + argsLength - 2,
                    endIndex = Math.max(endDeleteIndex, endAddIndex),
                    additions = [], deletions = [];
                for (var index = startIndex, argsIndex = 2; index < endIndex; ++index, ++argsIndex) {
                    if (index < endDeleteIndex)
                        deletions.push(pushDiff('deleted', rawArray[index], index));
                    if (index < endAddIndex)
                        additions.push(pushDiff('added', args[argsIndex], index));
                }
                ko.utils.findMovesInArrayComparison(deletions, additions);
                break;

            default:
                return;
        }
        cachedDiff = diff;
    };
};
ko.computed = ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
    var _latestValue,
        _needsEvaluation = true,
        _isBeingEvaluated = false,
        _suppressDisposalUntilDisposeWhenReturnsFalse = false,
        _isDisposed = false,
        readFunction = evaluatorFunctionOrOptions,
        pure = false,
        isSleeping = false;

    if (readFunction && typeof readFunction == "object") {
        // Single-parameter syntax - everything is on this "options" param
        options = readFunction;
        readFunction = options["read"];
    } else {
        // Multi-parameter syntax - construct the options according to the params passed
        options = options || {};
        if (!readFunction)
            readFunction = options["read"];
    }
    if (typeof readFunction != "function")
        throw new Error("Pass a function that returns the value of the ko.computed");

    function addSubscriptionToDependency(subscribable, id) {
        if (!_subscriptionsToDependencies[id]) {
            _subscriptionsToDependencies[id] = subscribable.subscribe(evaluatePossiblyAsync);
            ++_dependenciesCount;
        }
    }

    function disposeAllSubscriptionsToDependencies() {
        ko.utils.objectForEach(_subscriptionsToDependencies, function (id, subscription) {
            subscription.dispose();
        });
        _subscriptionsToDependencies = {};
    }

    function disposeComputed() {
        disposeAllSubscriptionsToDependencies();
        _dependenciesCount = 0;
        _isDisposed = true;
        _needsEvaluation = false;
    }

    function evaluatePossiblyAsync() {
        var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
            clearTimeout(evaluationTimeoutInstance);
            evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
        } else if (dependentObservable._evalRateLimited) {
            dependentObservable._evalRateLimited();
        } else {
            evaluateImmediate();
        }
    }

    function evaluateImmediate(suppressChangeNotification) {
        if (_isBeingEvaluated) {
            if (pure) {
                throw Error("A 'pure' computed must not be called recursively");
            }
            // If the evaluation of a ko.computed causes side effects, it's possible that it will trigger its own re-evaluation.
            // This is not desirable (it's hard for a developer to realise a chain of dependencies might cause this, and they almost
            // certainly didn't intend infinite re-evaluations). So, for predictability, we simply prevent ko.computeds from causing
            // their own re-evaluation. Further discussion at https://github.com/SteveSanderson/knockout/pull/387
            return;
        }

        // Do not evaluate (and possibly capture new dependencies) if disposed
        if (_isDisposed) {
            return;
        }

        if (disposeWhen && disposeWhen()) {
            // See comment below about _suppressDisposalUntilDisposeWhenReturnsFalse
            if (!_suppressDisposalUntilDisposeWhenReturnsFalse) {
                dispose();
                return;
            }
        } else {
            // It just did return false, so we can stop suppressing now
            _suppressDisposalUntilDisposeWhenReturnsFalse = false;
        }

        _isBeingEvaluated = true;

        // When sleeping, recalculate the value and return.
        if (isSleeping) {
            try {
                var dependencyTracking = {};
                ko.dependencyDetection.begin({
                    callback: function (subscribable, id) {
                        if (!dependencyTracking[id]) {
                            dependencyTracking[id] = 1;
                            ++_dependenciesCount;
                        }
                    },
                    computed: dependentObservable,
                    isInitial: undefined
                });
                _dependenciesCount = 0;
                _latestValue = readFunction.call(evaluatorFunctionTarget);
            } finally {
                ko.dependencyDetection.end();
                _isBeingEvaluated = false;
            }
        } else {
            try {
                // Initially, we assume that none of the subscriptions are still being used (i.e., all are candidates for disposal).
                // Then, during evaluation, we cross off any that are in fact still being used.
                var disposalCandidates = _subscriptionsToDependencies, disposalCount = _dependenciesCount;
                ko.dependencyDetection.begin({
                    callback: function(subscribable, id) {
                        if (!_isDisposed) {
                            if (disposalCount && disposalCandidates[id]) {
                                // Don't want to dispose this subscription, as it's still being used
                                _subscriptionsToDependencies[id] = disposalCandidates[id];
                                ++_dependenciesCount;
                                delete disposalCandidates[id];
                                --disposalCount;
                            } else {
                                // Brand new subscription - add it
                                addSubscriptionToDependency(subscribable, id);
                            }
                        }
                    },
                    computed: dependentObservable,
                    isInitial: pure ? undefined : !_dependenciesCount        // If we're evaluating when there are no previous dependencies, it must be the first time
                });

                _subscriptionsToDependencies = {};
                _dependenciesCount = 0;

                try {
                    var newValue = evaluatorFunctionTarget ? readFunction.call(evaluatorFunctionTarget) : readFunction();

                } finally {
                    ko.dependencyDetection.end();

                    // For each subscription no longer being used, remove it from the active subscriptions list and dispose it
                    if (disposalCount) {
                        ko.utils.objectForEach(disposalCandidates, function(id, toDispose) {
                            toDispose.dispose();
                        });
                    }

                    _needsEvaluation = false;
                }

                if (dependentObservable.isDifferent(_latestValue, newValue)) {
                    dependentObservable["notifySubscribers"](_latestValue, "beforeChange");

                    _latestValue = newValue;
                    if (DEBUG) dependentObservable._latestValue = _latestValue;

                    if (suppressChangeNotification !== true) {  // Check for strict true value since setTimeout in Firefox passes a numeric value to the function
                        dependentObservable["notifySubscribers"](_latestValue);
                    }
                }
            } finally {
                _isBeingEvaluated = false;
            }
        }

        if (!_dependenciesCount)
            dispose();
    }

    function dependentObservable() {
        if (arguments.length > 0) {
            if (typeof writeFunction === "function") {
                // Writing a value
                writeFunction.apply(evaluatorFunctionTarget, arguments);
            } else {
                throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
            }
            return this; // Permits chained assignments
        } else {
            // Reading the value
            ko.dependencyDetection.registerDependency(dependentObservable);
            if (_needsEvaluation)
                evaluateImmediate(true /* suppressChangeNotification */);
            return _latestValue;
        }
    }

    function peek() {
        // Peek won't re-evaluate, except to get the initial value when "deferEvaluation" is set, or while the computed is sleeping.
        // Those are the only times that both of these conditions will be satisfied.
        if (_needsEvaluation && !_dependenciesCount)
            evaluateImmediate(true /* suppressChangeNotification */);
        return _latestValue;
    }

    function isActive() {
        return _needsEvaluation || _dependenciesCount > 0;
    }

    // By here, "options" is always non-null
    var writeFunction = options["write"],
        disposeWhenNodeIsRemoved = options["disposeWhenNodeIsRemoved"] || options.disposeWhenNodeIsRemoved || null,
        disposeWhenOption = options["disposeWhen"] || options.disposeWhen,
        disposeWhen = disposeWhenOption,
        dispose = disposeComputed,
        _subscriptionsToDependencies = {},
        _dependenciesCount = 0,
        evaluationTimeoutInstance = null;

    if (!evaluatorFunctionTarget)
        evaluatorFunctionTarget = options["owner"];

    ko.subscribable.call(dependentObservable);
    ko.utils.setPrototypeOfOrExtend(dependentObservable, ko.dependentObservable['fn']);

    dependentObservable.peek = peek;
    dependentObservable.getDependenciesCount = function () { return _dependenciesCount; };
    dependentObservable.hasWriteFunction = typeof options["write"] === "function";
    dependentObservable.dispose = function () { dispose(); };
    dependentObservable.isActive = isActive;

    // Replace the limit function with one that delays evaluation as well.
    var originalLimit = dependentObservable.limit;
    dependentObservable.limit = function(limitFunction) {
        originalLimit.call(dependentObservable, limitFunction);
        dependentObservable._evalRateLimited = function() {
            dependentObservable._rateLimitedBeforeChange(_latestValue);

            _needsEvaluation = true;    // Mark as dirty

            // Pass the observable to the rate-limit code, which will access it when
            // it's time to do the notification.
            dependentObservable._rateLimitedChange(dependentObservable);
        }
    };

    if (options['pure']) {
        pure = true;
        isSleeping = true;     // Starts off sleeping; will awake on the first subscription
        dependentObservable.beforeSubscriptionAdd = function () {
            // If asleep, wake up the computed and evaluate to register any dependencies.
            if (isSleeping) {
                isSleeping = false;
                evaluateImmediate(true /* suppressChangeNotification */);
            }
        }
        dependentObservable.afterSubscriptionRemove = function () {
            if (!dependentObservable.getSubscriptionsCount()) {
                disposeAllSubscriptionsToDependencies();
                isSleeping = _needsEvaluation = true;
            }
        }
    } else if (options['deferEvaluation']) {
        // This will force a computed with deferEvaluation to evaluate when the first subscriptions is registered.
        dependentObservable.beforeSubscriptionAdd = function () {
            peek();
            delete dependentObservable.beforeSubscriptionAdd;
        }
    }

    ko.exportProperty(dependentObservable, 'peek', dependentObservable.peek);
    ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
    ko.exportProperty(dependentObservable, 'isActive', dependentObservable.isActive);
    ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);

    // Add a "disposeWhen" callback that, on each evaluation, disposes if the node was removed without using ko.removeNode.
    if (disposeWhenNodeIsRemoved) {
        // Since this computed is associated with a DOM node, and we don't want to dispose the computed
        // until the DOM node is *removed* from the document (as opposed to never having been in the document),
        // we'll prevent disposal until "disposeWhen" first returns false.
        _suppressDisposalUntilDisposeWhenReturnsFalse = true;

        // Only watch for the node's disposal if the value really is a node. It might not be,
        // e.g., { disposeWhenNodeIsRemoved: true } can be used to opt into the "only dispose
        // after first false result" behaviour even if there's no specific node to watch. This
        // technique is intended for KO's internal use only and shouldn't be documented or used
        // by application code, as it's likely to change in a future version of KO.
        if (disposeWhenNodeIsRemoved.nodeType) {
            disposeWhen = function () {
                return !ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved) || (disposeWhenOption && disposeWhenOption());
            };
        }
    }

    // Evaluate, unless sleeping or deferEvaluation is true
    if (!isSleeping && !options['deferEvaluation'])
        evaluateImmediate();

    // Attach a DOM node disposal callback so that the computed will be proactively disposed as soon as the node is
    // removed using ko.removeNode. But skip if isActive is false (there will never be any dependencies to dispose).
    if (disposeWhenNodeIsRemoved && isActive() && disposeWhenNodeIsRemoved.nodeType) {
        dispose = function() {
            ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, dispose);
            disposeComputed();
        };
        ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, dispose);
    }

    return dependentObservable;
};

ko.isComputed = function(instance) {
    return ko.hasPrototype(instance, ko.dependentObservable);
};

var protoProp = ko.observable.protoProperty; // == "__ko_proto__"
ko.dependentObservable[protoProp] = ko.observable;

ko.dependentObservable['fn'] = {
    "equalityComparer": valuesArePrimitiveAndEqual
};
ko.dependentObservable['fn'][protoProp] = ko.dependentObservable;

// Note that for browsers that don't support proto assignment, the
// inheritance chain is created manually in the ko.dependentObservable constructor
if (ko.utils.canSetPrototype) {
    ko.utils.setPrototypeOf(ko.dependentObservable['fn'], ko.subscribable['fn']);
}

ko.exportSymbol('dependentObservable', ko.dependentObservable);
ko.exportSymbol('computed', ko.dependentObservable); // Make "ko.computed" an alias for "ko.dependentObservable"
ko.exportSymbol('isComputed', ko.isComputed);

ko.pureComputed = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget) {
    if (typeof evaluatorFunctionOrOptions === 'function') {
        return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget, {'pure':true});
    } else {
        evaluatorFunctionOrOptions = ko.utils.extend({}, evaluatorFunctionOrOptions);   // make a copy of the parameter object
        evaluatorFunctionOrOptions['pure'] = true;
        return ko.computed(evaluatorFunctionOrOptions, evaluatorFunctionTarget);
    }
}
ko.exportSymbol('pureComputed', ko.pureComputed);

(function() {
    var maxNestedObservableDepth = 10; // Escape the (unlikely) pathalogical case where an observable's current value is itself (or similar reference cycle)

    ko.toJS = function(rootObject) {
        if (arguments.length == 0)
            throw new Error("When calling ko.toJS, pass the object you want to convert.");

        // We just unwrap everything at every level in the object graph
        return mapJsObjectGraph(rootObject, function(valueToMap) {
            // Loop because an observable's value might in turn be another observable wrapper
            for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
                valueToMap = valueToMap();
            return valueToMap;
        });
    };

    ko.toJSON = function(rootObject, replacer, space) {     // replacer and space are optional
        var plainJavaScriptObject = ko.toJS(rootObject);
        return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
    };

    function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
        visitedObjects = visitedObjects || new objectLookup();

        rootObject = mapInputCallback(rootObject);
        var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date)) && (!(rootObject instanceof String)) && (!(rootObject instanceof Number)) && (!(rootObject instanceof Boolean));
        if (!canHaveProperties)
            return rootObject;

        var outputProperties = rootObject instanceof Array ? [] : {};
        visitedObjects.save(rootObject, outputProperties);

        visitPropertiesOrArrayEntries(rootObject, function(indexer) {
            var propertyValue = mapInputCallback(rootObject[indexer]);

            switch (typeof propertyValue) {
                case "boolean":
                case "number":
                case "string":
                case "function":
                    outputProperties[indexer] = propertyValue;
                    break;
                case "object":
                case "undefined":
                    var previouslyMappedValue = visitedObjects.get(propertyValue);
                    outputProperties[indexer] = (previouslyMappedValue !== undefined)
                        ? previouslyMappedValue
                        : mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
                    break;
            }
        });

        return outputProperties;
    }

    function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
        if (rootObject instanceof Array) {
            for (var i = 0; i < rootObject.length; i++)
                visitorCallback(i);

            // For arrays, also respect toJSON property for custom mappings (fixes #278)
            if (typeof rootObject['toJSON'] == 'function')
                visitorCallback('toJSON');
        } else {
            for (var propertyName in rootObject) {
                visitorCallback(propertyName);
            }
        }
    };

    function objectLookup() {
        this.keys = [];
        this.values = [];
    };

    objectLookup.prototype = {
        constructor: objectLookup,
        save: function(key, value) {
            var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
            if (existingIndex >= 0)
                this.values[existingIndex] = value;
            else {
                this.keys.push(key);
                this.values.push(value);
            }
        },
        get: function(key) {
            var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
            return (existingIndex >= 0) ? this.values[existingIndex] : undefined;
        }
    };
})();

ko.exportSymbol('toJS', ko.toJS);
ko.exportSymbol('toJSON', ko.toJSON);
(function () {
    var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';

    // Normally, SELECT elements and their OPTIONs can only take value of type 'string' (because the values
    // are stored on DOM attributes). ko.selectExtensions provides a way for SELECTs/OPTIONs to have values
    // that are arbitrary objects. This is very convenient when implementing things like cascading dropdowns.
    ko.selectExtensions = {
        readValue : function(element) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    if (element[hasDomDataExpandoProperty] === true)
                        return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
                    return ko.utils.ieVersion <= 7
                        ? (element.getAttributeNode('value') && element.getAttributeNode('value').specified ? element.value : element.text)
                        : element.value;
                case 'select':
                    return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
                default:
                    return element.value;
            }
        },

        writeValue: function(element, value, allowUnset) {
            switch (ko.utils.tagNameLower(element)) {
                case 'option':
                    switch(typeof value) {
                        case "string":
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
                            if (hasDomDataExpandoProperty in element) { // IE <= 8 throws errors if you delete non-existent properties from a DOM node
                                delete element[hasDomDataExpandoProperty];
                            }
                            element.value = value;
                            break;
                        default:
                            // Store arbitrary object using DomData
                            ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
                            element[hasDomDataExpandoProperty] = true;

                            // Special treatment of numbers is just for backward compatibility. KO 1.2.1 wrote numerical values to element.value.
                            element.value = typeof value === "number" ? value : "";
                            break;
                    }
                    break;
                case 'select':
                    if (value === "" || value === null)       // A blank string or null value will select the caption
                        value = undefined;
                    var selection = -1;
                    for (var i = 0, n = element.options.length, optionValue; i < n; ++i) {
                        optionValue = ko.selectExtensions.readValue(element.options[i]);
                        // Include special check to handle selecting a caption with a blank string value
                        if (optionValue == value || (optionValue == "" && value === undefined)) {
                            selection = i;
                            break;
                        }
                    }
                    if (allowUnset || selection >= 0 || (value === undefined && element.size > 1)) {
                        element.selectedIndex = selection;
                    }
                    break;
                default:
                    if ((value === null) || (value === undefined))
                        value = "";
                    element.value = value;
                    break;
            }
        }
    };
})();

ko.exportSymbol('selectExtensions', ko.selectExtensions);
ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);
ko.expressionRewriting = (function () {
    var javaScriptReservedWords = ["true", "false", "null", "undefined"];

    // Matches something that can be assigned to--either an isolated identifier or something ending with a property accessor
    // This is designed to be simple and avoid false negatives, but could produce false positives (e.g., a+b.c).
    // This also will not properly handle nested brackets (e.g., obj1[obj2['prop']]; see #911).
    var javaScriptAssignmentTarget = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;

    function getWriteableValue(expression) {
        if (ko.utils.arrayIndexOf(javaScriptReservedWords, expression) >= 0)
            return false;
        var match = expression.match(javaScriptAssignmentTarget);
        return match === null ? false : match[1] ? ('Object(' + match[1] + ')' + match[2]) : expression;
    }

    // The following regular expressions will be used to split an object-literal string into tokens

        // These two match strings, either with double quotes or single quotes
    var stringDouble = '"(?:[^"\\\\]|\\\\.)*"',
        stringSingle = "'(?:[^'\\\\]|\\\\.)*'",
        // Matches a regular expression (text enclosed by slashes), but will also match sets of divisions
        // as a regular expression (this is handled by the parsing loop below).
        stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*',
        // These characters have special meaning to the parser and must not appear in the middle of a
        // token, except as part of a string.
        specials = ',"\'{}()/:[\\]',
        // Match text (at least two characters) that does not contain any of the above special characters,
        // although some of the special characters are allowed to start it (all but the colon and comma).
        // The text can contain spaces, but leading or trailing spaces are skipped.
        everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']',
        // Match any non-space character not matched already. This will match colons and commas, since they're
        // not matched by "everyThingElse", but will also match any other single character that wasn't already
        // matched (for example: in "a: 1, b: 2", each of the non-space characters will be matched by oneNotSpace).
        oneNotSpace = '[^\\s]',

        // Create the actual regular expression by or-ing the above strings. The order is important.
        bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g'),

        // Match end of previous token to determine whether a slash is a division or regex.
        divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/,
        keywordRegexLookBehind = {'in':1,'return':1,'typeof':1};

    function parseObjectLiteral(objectLiteralString) {
        // Trim leading and trailing spaces from the string
        var str = ko.utils.stringTrim(objectLiteralString);

        // Trim braces '{' surrounding the whole object literal
        if (str.charCodeAt(0) === 123) str = str.slice(1, -1);

        // Split into tokens
        var result = [], toks = str.match(bindingToken), key, values, depth = 0;

        if (toks) {
            // Append a comma so that we don't need a separate code block to deal with the last item
            toks.push(',');

            for (var i = 0, tok; tok = toks[i]; ++i) {
                var c = tok.charCodeAt(0);
                // A comma signals the end of a key/value pair if depth is zero
                if (c === 44) { // ","
                    if (depth <= 0) {
                        if (key)
                            result.push(values ? {key: key, value: values.join('')} : {'unknown': key});
                        key = values = depth = 0;
                        continue;
                    }
                // Simply skip the colon that separates the name and value
                } else if (c === 58) { // ":"
                    if (!values)
                        continue;
                // A set of slashes is initially matched as a regular expression, but could be division
                } else if (c === 47 && i && tok.length > 1) {  // "/"
                    // Look at the end of the previous token to determine if the slash is actually division
                    var match = toks[i-1].match(divisionLookBehind);
                    if (match && !keywordRegexLookBehind[match[0]]) {
                        // The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
                        str = str.substr(str.indexOf(tok) + 1);
                        toks = str.match(bindingToken);
                        toks.push(',');
                        i = -1;
                        // Continue with just the slash
                        tok = '/';
                    }
                // Increment depth for parentheses, braces, and brackets so that interior commas are ignored
                } else if (c === 40 || c === 123 || c === 91) { // '(', '{', '['
                    ++depth;
                } else if (c === 41 || c === 125 || c === 93) { // ')', '}', ']'
                    --depth;
                // The key must be a single token; if it's a string, trim the quotes
                } else if (!key && !values) {
                    key = (c === 34 || c === 39) /* '"', "'" */ ? tok.slice(1, -1) : tok;
                    continue;
                }
                if (values)
                    values.push(tok);
                else
                    values = [tok];
            }
        }
        return result;
    }

    // Two-way bindings include a write function that allow the handler to update the value even if it's not an observable.
    var twoWayBindings = {};

    function preProcessBindings(bindingsStringOrKeyValueArray, bindingOptions) {
        bindingOptions = bindingOptions || {};

        function processKeyValue(key, val) {
            var writableVal;
            function callPreprocessHook(obj) {
                return (obj && obj['preprocess']) ? (val = obj['preprocess'](val, key, processKeyValue)) : true;
            }
            if (!bindingParams) {
                if (!callPreprocessHook(ko['getBindingHandler'](key)))
                    return;

                if (twoWayBindings[key] && (writableVal = getWriteableValue(val))) {
                    // For two-way bindings, provide a write method in case the value
                    // isn't a writable observable.
                    propertyAccessorResultStrings.push("'" + key + "':function(_z){" + writableVal + "=_z}");
                }
            }
            // Values are wrapped in a function so that each value can be accessed independently
            if (makeValueAccessors) {
                val = 'function(){return ' + val + ' }';
            }
            resultStrings.push("'" + key + "':" + val);
        }

        var resultStrings = [],
            propertyAccessorResultStrings = [],
            makeValueAccessors = bindingOptions['valueAccessors'],
            bindingParams = bindingOptions['bindingParams'],
            keyValueArray = typeof bindingsStringOrKeyValueArray === "string" ?
                parseObjectLiteral(bindingsStringOrKeyValueArray) : bindingsStringOrKeyValueArray;

        ko.utils.arrayForEach(keyValueArray, function(keyValue) {
            processKeyValue(keyValue.key || keyValue['unknown'], keyValue.value);
        });

        if (propertyAccessorResultStrings.length)
            processKeyValue('_ko_property_writers', "{" + propertyAccessorResultStrings.join(",") + " }");

        return resultStrings.join(",");
    }

    return {
        bindingRewriteValidators: [],

        twoWayBindings: twoWayBindings,

        parseObjectLiteral: parseObjectLiteral,

        preProcessBindings: preProcessBindings,

        keyValueArrayContainsKey: function(keyValueArray, key) {
            for (var i = 0; i < keyValueArray.length; i++)
                if (keyValueArray[i]['key'] == key)
                    return true;
            return false;
        },

        // Internal, private KO utility for updating model properties from within bindings
        // property:            If the property being updated is (or might be) an observable, pass it here
        //                      If it turns out to be a writable observable, it will be written to directly
        // allBindings:         An object with a get method to retrieve bindings in the current execution context.
        //                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
        // key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
        // value:               The value to be written
        // checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
        //                      it is !== existing value on that writable observable
        writeValueToProperty: function(property, allBindings, key, value, checkIfDifferent) {
            if (!property || !ko.isObservable(property)) {
                var propWriters = allBindings.get('_ko_property_writers');
                if (propWriters && propWriters[key])
                    propWriters[key](value);
            } else if (ko.isWriteableObservable(property) && (!checkIfDifferent || property.peek() !== value)) {
                property(value);
            }
        }
    };
})();

ko.exportSymbol('expressionRewriting', ko.expressionRewriting);
ko.exportSymbol('expressionRewriting.bindingRewriteValidators', ko.expressionRewriting.bindingRewriteValidators);
ko.exportSymbol('expressionRewriting.parseObjectLiteral', ko.expressionRewriting.parseObjectLiteral);
ko.exportSymbol('expressionRewriting.preProcessBindings', ko.expressionRewriting.preProcessBindings);

// Making bindings explicitly declare themselves as "two way" isn't ideal in the long term (it would be better if
// all bindings could use an official 'property writer' API without needing to declare that they might). However,
// since this is not, and has never been, a public API (_ko_property_writers was never documented), it's acceptable
// as an internal implementation detail in the short term.
// For those developers who rely on _ko_property_writers in their custom bindings, we expose _twoWayBindings as an
// undocumented feature that makes it relatively easy to upgrade to KO 3.0. However, this is still not an official
// public API, and we reserve the right to remove it at any time if we create a real public property writers API.
ko.exportSymbol('expressionRewriting._twoWayBindings', ko.expressionRewriting.twoWayBindings);

// For backward compatibility, define the following aliases. (Previously, these function names were misleading because
// they referred to JSON specifically, even though they actually work with arbitrary JavaScript object literal expressions.)
ko.exportSymbol('jsonExpressionRewriting', ko.expressionRewriting);
ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.expressionRewriting.preProcessBindings);
(function() {
    // "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
    // may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
    // If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
    // of that virtual hierarchy
    //
    // The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
    // without having to scatter special cases all over the binding and templating code.

    // IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
    // but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
    // So, use node.text where available, and node.nodeValue elsewhere
    var commentNodesHaveTextProperty = document && document.createComment("test").text === "<!--test-->";

    var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko(?:\s+([\s\S]+))?\s*-->$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/;
    var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
    var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

    function isStartComment(node) {
        return (node.nodeType == 8) && startCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
    }

    function isEndComment(node) {
        return (node.nodeType == 8) && endCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
    }

    function getVirtualChildren(startComment, allowUnbalanced) {
        var currentNode = startComment;
        var depth = 1;
        var children = [];
        while (currentNode = currentNode.nextSibling) {
            if (isEndComment(currentNode)) {
                depth--;
                if (depth === 0)
                    return children;
            }

            children.push(currentNode);

            if (isStartComment(currentNode))
                depth++;
        }
        if (!allowUnbalanced)
            throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
        return null;
    }

    function getMatchingEndComment(startComment, allowUnbalanced) {
        var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
        if (allVirtualChildren) {
            if (allVirtualChildren.length > 0)
                return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
            return startComment.nextSibling;
        } else
            return null; // Must have no matching end comment, and allowUnbalanced is true
    }

    function getUnbalancedChildTags(node) {
        // e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
        //       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
        var childNode = node.firstChild, captureRemaining = null;
        if (childNode) {
            do {
                if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
                    captureRemaining.push(childNode);
                else if (isStartComment(childNode)) {
                    var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
                    if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
                        childNode = matchingEndComment;
                    else
                        captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
                } else if (isEndComment(childNode)) {
                    captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
                }
            } while (childNode = childNode.nextSibling);
        }
        return captureRemaining;
    }

    ko.virtualElements = {
        allowedBindings: {},

        childNodes: function(node) {
            return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
        },

        emptyNode: function(node) {
            if (!isStartComment(node))
                ko.utils.emptyDomNode(node);
            else {
                var virtualChildren = ko.virtualElements.childNodes(node);
                for (var i = 0, j = virtualChildren.length; i < j; i++)
                    ko.removeNode(virtualChildren[i]);
            }
        },

        setDomNodeChildren: function(node, childNodes) {
            if (!isStartComment(node))
                ko.utils.setDomNodeChildren(node, childNodes);
            else {
                ko.virtualElements.emptyNode(node);
                var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
                for (var i = 0, j = childNodes.length; i < j; i++)
                    endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
            }
        },

        prepend: function(containerNode, nodeToPrepend) {
            if (!isStartComment(containerNode)) {
                if (containerNode.firstChild)
                    containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
                else
                    containerNode.appendChild(nodeToPrepend);
            } else {
                // Start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
            }
        },

        insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
            if (!insertAfterNode) {
                ko.virtualElements.prepend(containerNode, nodeToInsert);
            } else if (!isStartComment(containerNode)) {
                // Insert after insertion point
                if (insertAfterNode.nextSibling)
                    containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
                else
                    containerNode.appendChild(nodeToInsert);
            } else {
                // Children of start comments must always have a parent and at least one following sibling (the end comment)
                containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
            }
        },

        firstChild: function(node) {
            if (!isStartComment(node))
                return node.firstChild;
            if (!node.nextSibling || isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        nextSibling: function(node) {
            if (isStartComment(node))
                node = getMatchingEndComment(node);
            if (node.nextSibling && isEndComment(node.nextSibling))
                return null;
            return node.nextSibling;
        },

        hasBindingValue: isStartComment,

        virtualNodeBindingValue: function(node) {
            var regexMatch = (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
            return regexMatch ? regexMatch[1] : null;
        },

        normaliseVirtualElementDomStructure: function(elementVerified) {
            // Workaround for https://github.com/SteveSanderson/knockout/issues/155
            // (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
            // that are direct descendants of <ul> into the preceding <li>)
            if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
                return;

            // Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
            // must be intended to appear *after* that child, so move them there.
            var childNode = elementVerified.firstChild;
            if (childNode) {
                do {
                    if (childNode.nodeType === 1) {
                        var unbalancedTags = getUnbalancedChildTags(childNode);
                        if (unbalancedTags) {
                            // Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
                            var nodeToInsertBefore = childNode.nextSibling;
                            for (var i = 0; i < unbalancedTags.length; i++) {
                                if (nodeToInsertBefore)
                                    elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
                                else
                                    elementVerified.appendChild(unbalancedTags[i]);
                            }
                        }
                    }
                } while (childNode = childNode.nextSibling);
            }
        }
    };
})();
ko.exportSymbol('virtualElements', ko.virtualElements);
ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
//ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
//ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
(function() {
    var defaultBindingAttributeName = "data-bind";

    ko.bindingProvider = function() {
        this.bindingCache = {};
    };

    ko.utils.extend(ko.bindingProvider.prototype, {
        'nodeHasBindings': function(node) {
            switch (node.nodeType) {
                case 1: // Element
                    return node.getAttribute(defaultBindingAttributeName) != null
                        || ko.components['getComponentNameForNode'](node);
                case 8: // Comment node
                    return ko.virtualElements.hasBindingValue(node);
                default: return false;
            }
        },

        'getBindings': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext),
                parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node) : null;
            return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ false);
        },

        'getBindingAccessors': function(node, bindingContext) {
            var bindingsString = this['getBindingsString'](node, bindingContext),
                parsedBindings = bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node, { 'valueAccessors': true }) : null;
            return ko.components.addBindingsForCustomElement(parsedBindings, node, bindingContext, /* valueAccessors */ true);
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'getBindingsString': function(node, bindingContext) {
            switch (node.nodeType) {
                case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
                case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
                default: return null;
            }
        },

        // The following function is only used internally by this default provider.
        // It's not part of the interface definition for a general binding provider.
        'parseBindingsString': function(bindingsString, bindingContext, node, options) {
            try {
                var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache, options);
                return bindingFunction(bindingContext, node);
            } catch (ex) {
                ex.message = "Unable to parse bindings.\nBindings value: " + bindingsString + "\nMessage: " + ex.message;
                throw ex;
            }
        }
    });

    ko.bindingProvider['instance'] = new ko.bindingProvider();

    function createBindingsStringEvaluatorViaCache(bindingsString, cache, options) {
        var cacheKey = bindingsString + (options && options['valueAccessors'] || '');
        return cache[cacheKey]
            || (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, options));
    }

    function createBindingsStringEvaluator(bindingsString, options) {
        // Build the source for a function that evaluates "expression"
        // For each scope variable, add an extra level of "with" nesting
        // Example result: with(sc1) { with(sc0) { return (expression) } }
        var rewrittenBindings = ko.expressionRewriting.preProcessBindings(bindingsString, options),
            functionBody = "with($context){with($data||{}){return{" + rewrittenBindings + "}}}";
        return new Function("$context", "$element", functionBody);
    }
})();

ko.exportSymbol('bindingProvider', ko.bindingProvider);
(function () {
    ko.bindingHandlers = {};

    // The following element types will not be recursed into during binding. In the future, we
    // may consider adding <template> to this list, because such elements' contents are always
    // intended to be bound in a different context from where they appear in the document.
    var bindingDoesNotRecurseIntoElementTypes = {
        // Don't want bindings that operate on text nodes to mutate <script> contents,
        // because it's unexpected and a potential XSS issue
        'script': true
    };

    // Use an overridable method for retrieving binding handlers so that a plugins may support dynamically created handlers
    ko['getBindingHandler'] = function(bindingKey) {
        return ko.bindingHandlers[bindingKey];
    };

    // The ko.bindingContext constructor is only called directly to create the root context. For child
    // contexts, use bindingContext.createChildContext or bindingContext.extend.
    ko.bindingContext = function(dataItemOrAccessor, parentContext, dataItemAlias, extendCallback) {

        // The binding context object includes static properties for the current, parent, and root view models.
        // If a view model is actually stored in an observable, the corresponding binding context object, and
        // any child contexts, must be updated when the view model is changed.
        function updateContext() {
            // Most of the time, the context will directly get a view model object, but if a function is given,
            // we call the function to retrieve the view model. If the function accesses any obsevables or returns
            // an observable, the dependency is tracked, and those observables can later cause the binding
            // context to be updated.
            var dataItemOrObservable = isFunc ? dataItemOrAccessor() : dataItemOrAccessor,
                dataItem = ko.utils.unwrapObservable(dataItemOrObservable);

            if (parentContext) {
                // When a "parent" context is given, register a dependency on the parent context. Thus whenever the
                // parent context is updated, this context will also be updated.
                if (parentContext._subscribable)
                    parentContext._subscribable();

                // Copy $root and any custom properties from the parent context
                ko.utils.extend(self, parentContext);

                // Because the above copy overwrites our own properties, we need to reset them.
                // During the first execution, "subscribable" isn't set, so don't bother doing the update then.
                if (subscribable) {
                    self._subscribable = subscribable;
                }
            } else {
                self['$parents'] = [];
                self['$root'] = dataItem;

                // Export 'ko' in the binding context so it will be available in bindings and templates
                // even if 'ko' isn't exported as a global, such as when using an AMD loader.
                // See https://github.com/SteveSanderson/knockout/issues/490
                self['ko'] = ko;
            }
            self['$rawData'] = dataItemOrObservable;
            self['$data'] = dataItem;
            if (dataItemAlias)
                self[dataItemAlias] = dataItem;

            // The extendCallback function is provided when creating a child context or extending a context.
            // It handles the specific actions needed to finish setting up the binding context. Actions in this
            // function could also add dependencies to this binding context.
            if (extendCallback)
                extendCallback(self, parentContext, dataItem);

            return self['$data'];
        }
        function disposeWhen() {
            return nodes && !ko.utils.anyDomNodeIsAttachedToDocument(nodes);
        }

        var self = this,
            isFunc = typeof(dataItemOrAccessor) == "function" && !ko.isObservable(dataItemOrAccessor),
            nodes,
            subscribable = ko.dependentObservable(updateContext, null, { disposeWhen: disposeWhen, disposeWhenNodeIsRemoved: true });

        // At this point, the binding context has been initialized, and the "subscribable" computed observable is
        // subscribed to any observables that were accessed in the process. If there is nothing to track, the
        // computed will be inactive, and we can safely throw it away. If it's active, the computed is stored in
        // the context object.
        if (subscribable.isActive()) {
            self._subscribable = subscribable;

            // Always notify because even if the model ($data) hasn't changed, other context properties might have changed
            subscribable['equalityComparer'] = null;

            // We need to be able to dispose of this computed observable when it's no longer needed. This would be
            // easy if we had a single node to watch, but binding contexts can be used by many different nodes, and
            // we cannot assume that those nodes have any relation to each other. So instead we track any node that
            // the context is attached to, and dispose the computed when all of those nodes have been cleaned.

            // Add properties to *subscribable* instead of *self* because any properties added to *self* may be overwritten on updates
            nodes = [];
            subscribable._addNode = function(node) {
                nodes.push(node);
                ko.utils.domNodeDisposal.addDisposeCallback(node, function(node) {
                    ko.utils.arrayRemoveItem(nodes, node);
                    if (!nodes.length) {
                        subscribable.dispose();
                        self._subscribable = subscribable = undefined;
                    }
                });
            };
        }
    }

    // Extend the binding context hierarchy with a new view model object. If the parent context is watching
    // any obsevables, the new child context will automatically get a dependency on the parent context.
    // But this does not mean that the $data value of the child context will also get updated. If the child
    // view model also depends on the parent view model, you must provide a function that returns the correct
    // view model on each update.
    ko.bindingContext.prototype['createChildContext'] = function (dataItemOrAccessor, dataItemAlias, extendCallback) {
        return new ko.bindingContext(dataItemOrAccessor, this, dataItemAlias, function(self, parentContext) {
            // Extend the context hierarchy by setting the appropriate pointers
            self['$parentContext'] = parentContext;
            self['$parent'] = parentContext['$data'];
            self['$parents'] = (parentContext['$parents'] || []).slice(0);
            self['$parents'].unshift(self['$parent']);
            if (extendCallback)
                extendCallback(self);
        });
    };

    // Extend the binding context with new custom properties. This doesn't change the context hierarchy.
    // Similarly to "child" contexts, provide a function here to make sure that the correct values are set
    // when an observable view model is updated.
    ko.bindingContext.prototype['extend'] = function(properties) {
        // If the parent context references an observable view model, "_subscribable" will always be the
        // latest view model object. If not, "_subscribable" isn't set, and we can use the static "$data" value.
        return new ko.bindingContext(this._subscribable || this['$data'], this, null, function(self, parentContext) {
            // This "child" context doesn't directly track a parent observable view model,
            // so we need to manually set the $rawData value to match the parent.
            self['$rawData'] = parentContext['$rawData'];
            ko.utils.extend(self, typeof(properties) == "function" ? properties() : properties);
        });
    };

    // Returns the valueAccesor function for a binding value
    function makeValueAccessor(value) {
        return function() {
            return value;
        };
    }

    // Returns the value of a valueAccessor function
    function evaluateValueAccessor(valueAccessor) {
        return valueAccessor();
    }

    // Given a function that returns bindings, create and return a new object that contains
    // binding value-accessors functions. Each accessor function calls the original function
    // so that it always gets the latest value and all dependencies are captured. This is used
    // by ko.applyBindingsToNode and getBindingsAndMakeAccessors.
    function makeAccessorsFromFunction(callback) {
        return ko.utils.objectMap(ko.dependencyDetection.ignore(callback), function(value, key) {
            return function() {
                return callback()[key];
            };
        });
    }

    // Given a bindings function or object, create and return a new object that contains
    // binding value-accessors functions. This is used by ko.applyBindingsToNode.
    function makeBindingAccessors(bindings, context, node) {
        if (typeof bindings === 'function') {
            return makeAccessorsFromFunction(bindings.bind(null, context, node));
        } else {
            return ko.utils.objectMap(bindings, makeValueAccessor);
        }
    }

    // This function is used if the binding provider doesn't include a getBindingAccessors function.
    // It must be called with 'this' set to the provider instance.
    function getBindingsAndMakeAccessors(node, context) {
        return makeAccessorsFromFunction(this['getBindings'].bind(this, node, context));
    }

    function validateThatBindingIsAllowedForVirtualElements(bindingName) {
        var validator = ko.virtualElements.allowedBindings[bindingName];
        if (!validator)
            throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
    }

    function applyBindingsToDescendantsInternal (bindingContext, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
        var currentChild,
            nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement),
            provider = ko.bindingProvider['instance'],
            preprocessNode = provider['preprocessNode'];

        // Preprocessing allows a binding provider to mutate a node before bindings are applied to it. For example it's
        // possible to insert new siblings after it, and/or replace the node with a different one. This can be used to
        // implement custom binding syntaxes, such as {{ value }} for string interpolation, or custom element types that
        // trigger insertion of <template> contents at that point in the document.
        if (preprocessNode) {
            while (currentChild = nextInQueue) {
                nextInQueue = ko.virtualElements.nextSibling(currentChild);
                preprocessNode.call(provider, currentChild);
            }
            // Reset nextInQueue for the next loop
            nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
        }

        while (currentChild = nextInQueue) {
            // Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
            nextInQueue = ko.virtualElements.nextSibling(currentChild);
            applyBindingsToNodeAndDescendantsInternal(bindingContext, currentChild, bindingContextsMayDifferFromDomParentElement);
        }
    }

    function applyBindingsToNodeAndDescendantsInternal (bindingContext, nodeVerified, bindingContextMayDifferFromDomParentElement) {
        var shouldBindDescendants = true;

        // Perf optimisation: Apply bindings only if...
        // (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
        //     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
        // (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
        var isElement = (nodeVerified.nodeType === 1);
        if (isElement) // Workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

        var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement)             // Case (1)
                               || ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
        if (shouldApplyBindings)
            shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, bindingContext, bindingContextMayDifferFromDomParentElement)['shouldBindDescendants'];

        if (shouldBindDescendants && !bindingDoesNotRecurseIntoElementTypes[ko.utils.tagNameLower(nodeVerified)]) {
            // We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
            //  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
            //    hence bindingContextsMayDifferFromDomParentElement is false
            //  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
            //    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
            //    hence bindingContextsMayDifferFromDomParentElement is true
            applyBindingsToDescendantsInternal(bindingContext, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
        }
    }

    var boundElementDomDataKey = ko.utils.domData.nextKey();


    function topologicalSortBindings(bindings) {
        // Depth-first sort
        var result = [],                // The list of key/handler pairs that we will return
            bindingsConsidered = {},    // A temporary record of which bindings are already in 'result'
            cyclicDependencyStack = []; // Keeps track of a depth-search so that, if there's a cycle, we know which bindings caused it
        ko.utils.objectForEach(bindings, function pushBinding(bindingKey) {
            if (!bindingsConsidered[bindingKey]) {
                var binding = ko['getBindingHandler'](bindingKey);
                if (binding) {
                    // First add dependencies (if any) of the current binding
                    if (binding['after']) {
                        cyclicDependencyStack.push(bindingKey);
                        ko.utils.arrayForEach(binding['after'], function(bindingDependencyKey) {
                            if (bindings[bindingDependencyKey]) {
                                if (ko.utils.arrayIndexOf(cyclicDependencyStack, bindingDependencyKey) !== -1) {
                                    throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + cyclicDependencyStack.join(", "));
                                } else {
                                    pushBinding(bindingDependencyKey);
                                }
                            }
                        });
                        cyclicDependencyStack.length--;
                    }
                    // Next add the current binding
                    result.push({ key: bindingKey, handler: binding });
                }
                bindingsConsidered[bindingKey] = true;
            }
        });

        return result;
    }

    function applyBindingsToNodeInternal(node, sourceBindings, bindingContext, bindingContextMayDifferFromDomParentElement) {
        // Prevent multiple applyBindings calls for the same node, except when a binding value is specified
        var alreadyBound = ko.utils.domData.get(node, boundElementDomDataKey);
        if (!sourceBindings) {
            if (alreadyBound) {
                throw Error("You cannot apply bindings multiple times to the same element.");
            }
            ko.utils.domData.set(node, boundElementDomDataKey, true);
        }

        // Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
        // we can easily recover it just by scanning up the node's ancestors in the DOM
        // (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
        if (!alreadyBound && bindingContextMayDifferFromDomParentElement)
            ko.storedBindingContextForNode(node, bindingContext);

        // Use bindings if given, otherwise fall back on asking the bindings provider to give us some bindings
        var bindings;
        if (sourceBindings && typeof sourceBindings !== 'function') {
            bindings = sourceBindings;
        } else {
            var provider = ko.bindingProvider['instance'],
                getBindings = provider['getBindingAccessors'] || getBindingsAndMakeAccessors;

            // Get the binding from the provider within a computed observable so that we can update the bindings whenever
            // the binding context is updated or if the binding provider accesses observables.
            var bindingsUpdater = ko.dependentObservable(
                function() {
                    bindings = sourceBindings ? sourceBindings(bindingContext, node) : getBindings.call(provider, node, bindingContext);
                    // Register a dependency on the binding context to support obsevable view models.
                    if (bindings && bindingContext._subscribable)
                        bindingContext._subscribable();
                    return bindings;
                },
                null, { disposeWhenNodeIsRemoved: node }
            );

            if (!bindings || !bindingsUpdater.isActive())
                bindingsUpdater = null;
        }

        var bindingHandlerThatControlsDescendantBindings;
        if (bindings) {
            // Return the value accessor for a given binding. When bindings are static (won't be updated because of a binding
            // context update), just return the value accessor from the binding. Otherwise, return a function that always gets
            // the latest binding value and registers a dependency on the binding updater.
            var getValueAccessor = bindingsUpdater
                ? function(bindingKey) {
                    return function() {
                        return evaluateValueAccessor(bindingsUpdater()[bindingKey]);
                    };
                } : function(bindingKey) {
                    return bindings[bindingKey];
                };

            // Use of allBindings as a function is maintained for backwards compatibility, but its use is deprecated
            function allBindings() {
                return ko.utils.objectMap(bindingsUpdater ? bindingsUpdater() : bindings, evaluateValueAccessor);
            }
            // The following is the 3.x allBindings API
            allBindings['get'] = function(key) {
                return bindings[key] && evaluateValueAccessor(getValueAccessor(key));
            };
            allBindings['has'] = function(key) {
                return key in bindings;
            };

            // First put the bindings into the right order
            var orderedBindings = topologicalSortBindings(bindings);

            // Go through the sorted bindings, calling init and update for each
            ko.utils.arrayForEach(orderedBindings, function(bindingKeyAndHandler) {
                // Note that topologicalSortBindings has already filtered out any nonexistent binding handlers,
                // so bindingKeyAndHandler.handler will always be nonnull.
                var handlerInitFn = bindingKeyAndHandler.handler["init"],
                    handlerUpdateFn = bindingKeyAndHandler.handler["update"],
                    bindingKey = bindingKeyAndHandler.key;

                if (node.nodeType === 8) {
                    validateThatBindingIsAllowedForVirtualElements(bindingKey);
                }

                try {
                    // Run init, ignoring any dependencies
                    if (typeof handlerInitFn == "function") {
                        ko.dependencyDetection.ignore(function() {
                            var initResult = handlerInitFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);

                            // If this binding handler claims to control descendant bindings, make a note of this
                            if (initResult && initResult['controlsDescendantBindings']) {
                                if (bindingHandlerThatControlsDescendantBindings !== undefined)
                                    throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
                                bindingHandlerThatControlsDescendantBindings = bindingKey;
                            }
                        });
                    }

                    // Run update in its own computed wrapper
                    if (typeof handlerUpdateFn == "function") {
                        ko.dependentObservable(
                            function() {
                                handlerUpdateFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);
                            },
                            null,
                            { disposeWhenNodeIsRemoved: node }
                        );
                    }
                } catch (ex) {
                    ex.message = "Unable to process binding \"" + bindingKey + ": " + bindings[bindingKey] + "\"\nMessage: " + ex.message;
                    throw ex;
                }
            });
        }

        return {
            'shouldBindDescendants': bindingHandlerThatControlsDescendantBindings === undefined
        };
    };

    var storedBindingContextDomDataKey = ko.utils.domData.nextKey();
    ko.storedBindingContextForNode = function (node, bindingContext) {
        if (arguments.length == 2) {
            ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
            if (bindingContext._subscribable)
                bindingContext._subscribable._addNode(node);
        } else {
            return ko.utils.domData.get(node, storedBindingContextDomDataKey);
        }
    }

    function getBindingContext(viewModelOrBindingContext) {
        return viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
            ? viewModelOrBindingContext
            : new ko.bindingContext(viewModelOrBindingContext);
    }

    ko.applyBindingAccessorsToNode = function (node, bindings, viewModelOrBindingContext) {
        if (node.nodeType === 1) // If it's an element, workaround IE <= 8 HTML parsing weirdness
            ko.virtualElements.normaliseVirtualElementDomStructure(node);
        return applyBindingsToNodeInternal(node, bindings, getBindingContext(viewModelOrBindingContext), true);
    };

    ko.applyBindingsToNode = function (node, bindings, viewModelOrBindingContext) {
        var context = getBindingContext(viewModelOrBindingContext);
        return ko.applyBindingAccessorsToNode(node, makeBindingAccessors(bindings, context, node), context);
    };

    ko.applyBindingsToDescendants = function(viewModelOrBindingContext, rootNode) {
        if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
            applyBindingsToDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
    };

    ko.applyBindings = function (viewModelOrBindingContext, rootNode) {
        // If jQuery is loaded after Knockout, we won't initially have access to it. So save it here.
        if (!jQueryInstance && window['jQuery']) {
            jQueryInstance = window['jQuery'];
        }

        if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
            throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
        rootNode = rootNode || window.document.body; // Make "rootNode" parameter optional

        applyBindingsToNodeAndDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
    };

    // Retrieving binding context from arbitrary nodes
    ko.contextFor = function(node) {
        // We can only do something meaningful for elements and comment nodes (in particular, not text nodes, as IE can't store domdata for them)
        switch (node.nodeType) {
            case 1:
            case 8:
                var context = ko.storedBindingContextForNode(node);
                if (context) return context;
                if (node.parentNode) return ko.contextFor(node.parentNode);
                break;
        }
        return undefined;
    };
    ko.dataFor = function(node) {
        var context = ko.contextFor(node);
        return context ? context['$data'] : undefined;
    };

    ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
    ko.exportSymbol('applyBindings', ko.applyBindings);
    ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
    ko.exportSymbol('applyBindingAccessorsToNode', ko.applyBindingAccessorsToNode);
    ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
    ko.exportSymbol('contextFor', ko.contextFor);
    ko.exportSymbol('dataFor', ko.dataFor);
})();
(function(undefined) {
    var loadingSubscribablesCache = {}, // Tracks component loads that are currently in flight
        loadedDefinitionsCache = {};    // Tracks component loads that have already completed

    ko.components = {
        get: function(componentName, callback) {
            var cachedDefinition = getObjectOwnProperty(loadedDefinitionsCache, componentName);
            if (cachedDefinition) {
                // It's already loaded and cached. Reuse the same definition object.
                // Note that for API consistency, even cache hits complete asynchronously.
                setTimeout(function() { callback(cachedDefinition) }, 0);
            } else {
                // Join the loading process that is already underway, or start a new one.
                loadComponentAndNotify(componentName, callback);
            }
        },

        clearCachedDefinition: function(componentName) {
            delete loadedDefinitionsCache[componentName];
        },

        _getFirstResultFromLoaders: getFirstResultFromLoaders
    };

    function getObjectOwnProperty(obj, propName) {
        return obj.hasOwnProperty(propName) ? obj[propName] : undefined;
    }

    function loadComponentAndNotify(componentName, callback) {
        var subscribable = getObjectOwnProperty(loadingSubscribablesCache, componentName),
            completedAsync;
        if (!subscribable) {
            // It's not started loading yet. Start loading, and when it's done, move it to loadedDefinitionsCache.
            subscribable = loadingSubscribablesCache[componentName] = new ko.subscribable();
            beginLoadingComponent(componentName, function(definition) {
                loadedDefinitionsCache[componentName] = definition;
                delete loadingSubscribablesCache[componentName];

                // For API consistency, all loads complete asynchronously. However we want to avoid
                // adding an extra setTimeout if it's unnecessary (i.e., the completion is already
                // async) since setTimeout(..., 0) still takes about 16ms or more on most browsers.
                if (completedAsync) {
                    subscribable['notifySubscribers'](definition);
                } else {
                    setTimeout(function() {
                        subscribable['notifySubscribers'](definition);
                    }, 0);
                }
            });
            completedAsync = true;
        }
        subscribable.subscribe(callback);
    }

    function beginLoadingComponent(componentName, callback) {
        getFirstResultFromLoaders('getConfig', [componentName], function(config) {
            if (config) {
                // We have a config, so now load its definition
                getFirstResultFromLoaders('loadComponent', [componentName, config], function(definition) {
                    callback(definition);
                });
            } else {
                // The component has no config - it's unknown to all the loaders.
                // Note that this is not an error (e.g., a module loading error) - that would abort the
                // process and this callback would not run. For this callback to run, all loaders must
                // have confirmed they don't know about this component.
                callback(null);
            }
        });
    }

    function getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders) {
        // On the first call in the stack, start with the full set of loaders
        if (!candidateLoaders) {
            candidateLoaders = ko.components['loaders'].slice(0); // Use a copy, because we'll be mutating this array
        }

        // Try the next candidate
        var currentCandidateLoader = candidateLoaders.shift();
        if (currentCandidateLoader) {
            var methodInstance = currentCandidateLoader[methodName];
            if (methodInstance) {
                var wasAborted = false,
                    synchronousReturnValue = methodInstance.apply(currentCandidateLoader, argsExceptCallback.concat(function(result) {
                        if (wasAborted) {
                            callback(null);
                        } else if (result !== null) {
                            // This candidate returned a value. Use it.
                            callback(result);
                        } else {
                            // Try the next candidate
                            getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
                        }
                    }));

                // Currently, loaders may not return anything synchronously. This leaves open the possibility
                // that we'll extend the API to support synchronous return values in the future. It won't be
                // a breaking change, because currently no loader is allowed to return anything except undefined.
                if (synchronousReturnValue !== undefined) {
                    wasAborted = true;

                    // Method to suppress exceptions will remain undocumented. This is only to keep
                    // KO's specs running tidily, since we can observe the loading got aborted without
                    // having exceptions cluttering up the console too.
                    if (!currentCandidateLoader['suppressLoaderExceptions']) {
                        throw new Error('Component loaders must supply values by invoking the callback, not by returning values synchronously.');
                    }
                }
            } else {
                // This candidate doesn't have the relevant handler. Synchronously move on to the next one.
                getFirstResultFromLoaders(methodName, argsExceptCallback, callback, candidateLoaders);
            }
        } else {
            // No candidates returned a value
            callback(null);
        }
    }

    // Reference the loaders via string name so it's possible for developers
    // to replace the whole array by assigning to ko.components.loaders
    ko.components['loaders'] = [];

    ko.exportSymbol('components', ko.components);
    ko.exportSymbol('components.get', ko.components.get);
    ko.exportSymbol('components.clearCachedDefinition', ko.components.clearCachedDefinition);
})();
(function(undefined) {

    // The default loader is responsible for two things:
    // 1. Maintaining the default in-memory registry of component configuration objects
    //    (i.e., the thing you're writing to when you call ko.components.register(someName, ...))
    // 2. Answering requests for components by fetching configuration objects
    //    from that default in-memory registry and resolving them into standard
    //    component definition objects (of the form { createViewModel: ..., template: ... })
    // Custom loaders may override either of these facilities, i.e.,
    // 1. To supply configuration objects from some other source (e.g., conventions)
    // 2. Or, to resolve configuration objects by loading viewmodels/templates via arbitrary logic.

    var defaultConfigRegistry = {};

    ko.components.register = function(componentName, config) {
        if (!config) {
            throw new Error('Invalid configuration for ' + componentName);
        }

        if (ko.components.isRegistered(componentName)) {
            throw new Error('Component ' + componentName + ' is already registered');
        }

        defaultConfigRegistry[componentName] = config;
    }

    ko.components.isRegistered = function(componentName) {
        return componentName in defaultConfigRegistry;
    }

    ko.components.unregister = function(componentName) {
        delete defaultConfigRegistry[componentName];
        ko.components.clearCachedDefinition(componentName);
    }

    ko.components.defaultLoader = {
        'getConfig': function(componentName, callback) {
            var result = defaultConfigRegistry.hasOwnProperty(componentName)
                ? defaultConfigRegistry[componentName]
                : null;
            callback(result);
        },

        'loadComponent': function(componentName, config, callback) {
            var errorCallback = makeErrorCallback(componentName);
            possiblyGetConfigFromAmd(errorCallback, config, function(loadedConfig) {
                resolveConfig(componentName, errorCallback, loadedConfig, callback);
            });
        },

        'loadTemplate': function(componentName, templateConfig, callback) {
            resolveTemplate(makeErrorCallback(componentName), templateConfig, callback);
        },

        'loadViewModel': function(componentName, viewModelConfig, callback) {
            resolveViewModel(makeErrorCallback(componentName), viewModelConfig, callback);
        }
    };

    var createViewModelKey = 'createViewModel';

    // Takes a config object of the form { template: ..., viewModel: ... }, and asynchronously convert it
    // into the standard component definition format:
    //    { template: <ArrayOfDomNodes>, createViewModel: function(params, componentInfo) { ... } }.
    // Since both template and viewModel may need to be resolved asynchronously, both tasks are performed
    // in parallel, and the results joined when both are ready. We don't depend on any promises infrastructure,
    // so this is implemented manually below.
    function resolveConfig(componentName, errorCallback, config, callback) {
        var result = {},
            makeCallBackWhenZero = 2,
            tryIssueCallback = function() {
                if (--makeCallBackWhenZero === 0) {
                    callback(result);
                }
            },
            templateConfig = config['template'],
            viewModelConfig = config['viewModel'];

        if (templateConfig) {
            possiblyGetConfigFromAmd(errorCallback, templateConfig, function(loadedConfig) {
                ko.components._getFirstResultFromLoaders('loadTemplate', [componentName, loadedConfig], function(resolvedTemplate) {
                    result['template'] = resolvedTemplate;
                    tryIssueCallback();
                });
            });
        } else {
            tryIssueCallback();
        }

        if (viewModelConfig) {
            possiblyGetConfigFromAmd(errorCallback, viewModelConfig, function(loadedConfig) {
                ko.components._getFirstResultFromLoaders('loadViewModel', [componentName, loadedConfig], function(resolvedViewModel) {
                    result[createViewModelKey] = resolvedViewModel;
                    tryIssueCallback();
                });
            });
        } else {
            tryIssueCallback();
        }
    }

    function resolveTemplate(errorCallback, templateConfig, callback) {
        if (typeof templateConfig === 'string') {
            // Markup - parse it
            callback(ko.utils.parseHtmlFragment(templateConfig));
        } else if (templateConfig instanceof Array) {
            // Assume already an array of DOM nodes - pass through unchanged
            callback(templateConfig);
        } else if (isDocumentFragment(templateConfig)) {
            // Document fragment - use its child nodes
            callback(ko.utils.makeArray(templateConfig.childNodes));
        } else if (templateConfig['element']) {
            var element = templateConfig['element'];
            if (isDomElement(element)) {
                // Element instance - copy its child nodes
                callback(cloneNodesFromTemplateSourceElement(element));
            } else if (typeof element === 'string') {
                // Element ID - find it, then copy its child nodes
                var elemInstance = document.getElementById(element);
                if (elemInstance) {
                    callback(cloneNodesFromTemplateSourceElement(elemInstance));
                } else {
                    errorCallback('Cannot find element with ID ' + element);
                }
            } else {
                errorCallback('Unknown element type: ' + element);
            }
        } else {
            errorCallback('Unknown template value: ' + templateConfig);
        }
    }

    function resolveViewModel(errorCallback, viewModelConfig, callback) {
        if (typeof viewModelConfig === 'function') {
            // Constructor - convert to standard factory function format
            // By design, this does *not* supply componentInfo to the constructor, as the intent is that
            // componentInfo contains non-viewmodel data (e.g., the component's element) that should only
            // be used in factory functions, not viewmodel constructors.
            callback(function (params /*, componentInfo */) {
                return new viewModelConfig(params);
            });
        } else if (typeof viewModelConfig[createViewModelKey] === 'function') {
            // Already a factory function - use it as-is
            callback(viewModelConfig[createViewModelKey]);
        } else if ('instance' in viewModelConfig) {
            // Fixed object instance - promote to createViewModel format for API consistency
            var fixedInstance = viewModelConfig['instance'];
            callback(function (params, componentInfo) {
                return fixedInstance;
            });
        } else if ('viewModel' in viewModelConfig) {
            // Resolved AMD module whose value is of the form { viewModel: ... }
            resolveViewModel(errorCallback, viewModelConfig['viewModel'], callback);
        } else {
            errorCallback('Unknown viewModel value: ' + viewModelConfig);
        }
    }

    function cloneNodesFromTemplateSourceElement(elemInstance) {
        switch (ko.utils.tagNameLower(elemInstance)) {
            case 'script':
                return ko.utils.parseHtmlFragment(elemInstance.text);
            case 'textarea':
                return ko.utils.parseHtmlFragment(elemInstance.value);
            case 'template':
                // For browsers with proper <template> element support (i.e., where the .content property
                // gives a document fragment), use that document fragment.
                if (isDocumentFragment(elemInstance.content)) {
                    return ko.utils.cloneNodes(elemInstance.content.childNodes);
                }
        }

        // Regular elements such as <div>, and <template> elements on old browsers that don't really
        // understand <template> and just treat it as a regular container
        return ko.utils.cloneNodes(elemInstance.childNodes);
    }

    function isDomElement(obj) {
        if (window['HTMLElement']) {
            return obj instanceof HTMLElement;
        } else {
            return obj && obj.tagName && obj.nodeType === 1;
        }
    }

    function isDocumentFragment(obj) {
        if (window['DocumentFragment']) {
            return obj instanceof DocumentFragment;
        } else {
            return obj && obj.nodeType === 11;
        }
    }

    function possiblyGetConfigFromAmd(errorCallback, config, callback) {
        if (typeof config['require'] === 'string') {
            // The config is the value of an AMD module
            if (require || window['require']) {
                (require || window['require'])([config['require']], callback);
            } else {
                errorCallback('Uses require, but no AMD loader is present');
            }
        } else {
            callback(config);
        }
    }

    function makeErrorCallback(componentName) {
        return function (message) {
            throw new Error('Component \'' + componentName + '\': ' + message);
        };
    }

    ko.exportSymbol('components.register', ko.components.register);
    ko.exportSymbol('components.isRegistered', ko.components.isRegistered);
    ko.exportSymbol('components.unregister', ko.components.unregister);

    // Expose the default loader so that developers can directly ask it for configuration
    // or to resolve configuration
    ko.exportSymbol('components.defaultLoader', ko.components.defaultLoader);

    // By default, the default loader is the only registered component loader
    ko.components['loaders'].push(ko.components.defaultLoader);

    // Privately expose the underlying config registry for use in old-IE shim
    ko.components._allRegisteredComponents = defaultConfigRegistry;
})();
(function (undefined) {
    // Overridable API for determining which component name applies to a given node. By overriding this,
    // you can for example map specific tagNames to components that are not preregistered.
    ko.components['getComponentNameForNode'] = function(node) {
        var tagNameLower = ko.utils.tagNameLower(node);
        return ko.components.isRegistered(tagNameLower) && tagNameLower;
    };

    ko.components.addBindingsForCustomElement = function(allBindings, node, bindingContext, valueAccessors) {
        // Determine if it's really a custom element matching a component
        if (node.nodeType === 1) {
            var componentName = ko.components['getComponentNameForNode'](node);
            if (componentName) {
                // It does represent a component, so add a component binding for it
                allBindings = allBindings || {};

                if (allBindings['component']) {
                    // Avoid silently overwriting some other 'component' binding that may already be on the element
                    throw new Error('Cannot use the "component" binding on a custom element matching a component');
                }

                var componentBindingValue = { 'name': componentName, 'params': getComponentParamsFromCustomElement(node, bindingContext) };

                allBindings['component'] = valueAccessors
                    ? function() { return componentBindingValue; }
                    : componentBindingValue;
            }
        }

        return allBindings;
    }

    var nativeBindingProviderInstance = new ko.bindingProvider();

    function getComponentParamsFromCustomElement(elem, bindingContext) {
        var paramsAttribute = elem.getAttribute('params');

        if (paramsAttribute) {
            var params = nativeBindingProviderInstance['parseBindingsString'](paramsAttribute, bindingContext, elem, { 'valueAccessors': true, 'bindingParams': true }),
                rawParamComputedValues = ko.utils.objectMap(params, function(paramValue, paramName) {
                    return ko.computed(paramValue, null, { disposeWhenNodeIsRemoved: elem });
                }),
                result = ko.utils.objectMap(rawParamComputedValues, function(paramValueComputed, paramName) {
                    // Does the evaluation of the parameter value unwrap any observables?
                    if (!paramValueComputed.isActive()) {
                        // No it doesn't, so there's no need for any computed wrapper. Just pass through the supplied value directly.
                        // Example: "someVal: firstName, age: 123" (whether or not firstName is an observable/computed)
                        return paramValueComputed.peek();
                    } else {
                        // Yes it does. Supply a computed property that unwraps both the outer (binding expression)
                        // level of observability, and any inner (resulting model value) level of observability.
                        // This means the component doesn't have to worry about multiple unwrapping.
                        return ko.computed(function() {
                            return ko.utils.unwrapObservable(paramValueComputed());
                        }, null, { disposeWhenNodeIsRemoved: elem });
                    }
                });

            // Give access to the raw computeds, as long as that wouldn't overwrite any custom param also called '$raw'
            // This is in case the developer wants to react to outer (binding) observability separately from inner
            // (model value) observability, or in case the model value observable has subobservables.
            if (!result.hasOwnProperty('$raw')) {
                result['$raw'] = rawParamComputedValues;
            }

            return result;
        } else {
            // For consistency, absence of a "params" attribute is treated the same as the presence of
            // any empty one. Otherwise component viewmodels need special code to check whether or not
            // 'params' or 'params.$raw' is null/undefined before reading subproperties, which is annoying.
            return { '$raw': {} };
        }
    }

    // --------------------------------------------------------------------------------
    // Compatibility code for older (pre-HTML5) IE browsers

    if (ko.utils.ieVersion < 9) {
        // Whenever you preregister a component, enable it as a custom element in the current document
        ko.components['register'] = (function(originalFunction) {
            return function(componentName) {
                document.createElement(componentName); // Allows IE<9 to parse markup containing the custom element
                return originalFunction.apply(this, arguments);
            }
        })(ko.components['register']);

        // Whenever you create a document fragment, enable all preregistered component names as custom elements
        // This is needed to make innerShiv/jQuery HTML parsing correctly handle the custom elements
        document.createDocumentFragment = (function(originalFunction) {
            return function() {
                var newDocFrag = originalFunction(),
                    allComponents = ko.components._allRegisteredComponents;
                for (var componentName in allComponents) {
                    if (allComponents.hasOwnProperty(componentName)) {
                        newDocFrag.createElement(componentName);
                    }
                }
                return newDocFrag;
            };
        })(document.createDocumentFragment);
    }
})();(function(undefined) {

    var componentLoadingOperationUniqueId = 0;

    ko.bindingHandlers['component'] = {
        'init': function(element, valueAccessor, ignored1, ignored2, bindingContext) {
            var currentViewModel,
                currentLoadingOperationId,
                disposeAssociatedComponentViewModel = function () {
                    var currentViewModelDispose = currentViewModel && currentViewModel['dispose'];
                    if (typeof currentViewModelDispose === 'function') {
                        currentViewModelDispose.call(currentViewModel);
                    }

                    // Any in-flight loading operation is no longer relevant, so make sure we ignore its completion
                    currentLoadingOperationId = null;
                };

            ko.utils.domNodeDisposal.addDisposeCallback(element, disposeAssociatedComponentViewModel);

            ko.computed(function () {
                var value = ko.utils.unwrapObservable(valueAccessor()),
                    componentName, componentParams;

                if (typeof value === 'string') {
                    componentName = value;
                } else {
                    componentName = ko.utils.unwrapObservable(value['name']);
                    componentParams = ko.utils.unwrapObservable(value['params']);
                }

                if (!componentName) {
                    throw new Error('No component name specified');
                }

                var loadingOperationId = currentLoadingOperationId = ++componentLoadingOperationUniqueId;
                ko.components.get(componentName, function(componentDefinition) {
                    // If this is not the current load operation for this element, ignore it.
                    if (currentLoadingOperationId !== loadingOperationId) {
                        return;
                    }

                    // Clean up previous state
                    disposeAssociatedComponentViewModel();

                    // Instantiate and bind new component. Implicitly this cleans any old DOM nodes.
                    if (!componentDefinition) {
                        throw new Error('Unknown component \'' + componentName + '\'');
                    }
                    cloneTemplateIntoElement(componentName, componentDefinition, element);
                    var componentViewModel = createViewModel(componentDefinition, element, componentParams),
                        childBindingContext = bindingContext['createChildContext'](componentViewModel);
                    currentViewModel = componentViewModel;
                    ko.applyBindingsToDescendants(childBindingContext, element);
                });
            }, null, { disposeWhenNodeIsRemoved: element });

            return { 'controlsDescendantBindings': true };
        }
    };

    ko.virtualElements.allowedBindings['component'] = true;

    function cloneTemplateIntoElement(componentName, componentDefinition, element) {
        var template = componentDefinition['template'];
        if (!template) {
            throw new Error('Component \'' + componentName + '\' has no template');
        }

        var clonedNodesArray = ko.utils.cloneNodes(template);
        ko.virtualElements.setDomNodeChildren(element, clonedNodesArray);
    }

    function createViewModel(componentDefinition, element, componentParams) {
        var componentViewModelFactory = componentDefinition['createViewModel'];
        return componentViewModelFactory
            ? componentViewModelFactory.call(componentDefinition, componentParams, { element: element })
            : componentParams; // Template-only component
    }

})();
var attrHtmlToJavascriptMap = { 'class': 'className', 'for': 'htmlFor' };
ko.bindingHandlers['attr'] = {
    'update': function(element, valueAccessor, allBindings) {
        var value = ko.utils.unwrapObservable(valueAccessor()) || {};
        ko.utils.objectForEach(value, function(attrName, attrValue) {
            attrValue = ko.utils.unwrapObservable(attrValue);

            // To cover cases like "attr: { checked:someProp }", we want to remove the attribute entirely
            // when someProp is a "no value"-like value (strictly null, false, or undefined)
            // (because the absence of the "checked" attr is how to mark an element as not checked, etc.)
            var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
            if (toRemove)
                element.removeAttribute(attrName);

            // In IE <= 7 and IE8 Quirks Mode, you have to use the Javascript property name instead of the
            // HTML attribute name for certain attributes. IE8 Standards Mode supports the correct behavior,
            // but instead of figuring out the mode, we'll just set the attribute through the Javascript
            // property for IE <= 8.
            if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
                attrName = attrHtmlToJavascriptMap[attrName];
                if (toRemove)
                    element.removeAttribute(attrName);
                else
                    element[attrName] = attrValue;
            } else if (!toRemove) {
                element.setAttribute(attrName, attrValue.toString());
            }

            // Treat "name" specially - although you can think of it as an attribute, it also needs
            // special handling on older versions of IE (https://github.com/SteveSanderson/knockout/pull/333)
            // Deliberately being case-sensitive here because XHTML would regard "Name" as a different thing
            // entirely, and there's no strong reason to allow for such casing in HTML.
            if (attrName === "name") {
                ko.utils.setElementName(element, toRemove ? "" : attrValue.toString());
            }
        });
    }
};
(function() {

ko.bindingHandlers['checked'] = {
    'after': ['value', 'attr'],
    'init': function (element, valueAccessor, allBindings) {
        var checkedValue = ko.pureComputed(function() {
            // Treat "value" like "checkedValue" when it is included with "checked" binding
            if (allBindings['has']('checkedValue')) {
                return ko.utils.unwrapObservable(allBindings.get('checkedValue'));
            } else if (allBindings['has']('value')) {
                return ko.utils.unwrapObservable(allBindings.get('value'));
            }

            return element.value;
        });

        function updateModel() {
            // This updates the model value from the view value.
            // It runs in response to DOM events (click) and changes in checkedValue.
            var isChecked = element.checked,
                elemValue = useCheckedValue ? checkedValue() : isChecked;

            // When we're first setting up this computed, don't change any model state.
            if (ko.computedContext.isInitial()) {
                return;
            }

            // We can ignore unchecked radio buttons, because some other radio
            // button will be getting checked, and that one can take care of updating state.
            if (isRadio && !isChecked) {
                return;
            }

            var modelValue = ko.dependencyDetection.ignore(valueAccessor);
            if (isValueArray) {
                if (oldElemValue !== elemValue) {
                    // When we're responding to the checkedValue changing, and the element is
                    // currently checked, replace the old elem value with the new elem value
                    // in the model array.
                    if (isChecked) {
                        ko.utils.addOrRemoveItem(modelValue, elemValue, true);
                        ko.utils.addOrRemoveItem(modelValue, oldElemValue, false);
                    }

                    oldElemValue = elemValue;
                } else {
                    // When we're responding to the user having checked/unchecked a checkbox,
                    // add/remove the element value to the model array.
                    ko.utils.addOrRemoveItem(modelValue, elemValue, isChecked);
                }
            } else {
                ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'checked', elemValue, true);
            }
        };

        function updateView() {
            // This updates the view value from the model value.
            // It runs in response to changes in the bound (checked) value.
            var modelValue = ko.utils.unwrapObservable(valueAccessor());

            if (isValueArray) {
                // When a checkbox is bound to an array, being checked represents its value being present in that array
                element.checked = ko.utils.arrayIndexOf(modelValue, checkedValue()) >= 0;
            } else if (isCheckbox) {
                // When a checkbox is bound to any other value (not an array), being checked represents the value being trueish
                element.checked = modelValue;
            } else {
                // For radio buttons, being checked means that the radio button's value corresponds to the model value
                element.checked = (checkedValue() === modelValue);
            }
        };

        var isCheckbox = element.type == "checkbox",
            isRadio = element.type == "radio";

        // Only bind to check boxes and radio buttons
        if (!isCheckbox && !isRadio) {
            return;
        }

        var isValueArray = isCheckbox && (ko.utils.unwrapObservable(valueAccessor()) instanceof Array),
            oldElemValue = isValueArray ? checkedValue() : undefined,
            useCheckedValue = isRadio || isValueArray;

        // IE 6 won't allow radio buttons to be selected unless they have a name
        if (isRadio && !element.name)
            ko.bindingHandlers['uniqueName']['init'](element, function() { return true });

        // Set up two computeds to update the binding:

        // The first responds to changes in the checkedValue value and to element clicks
        ko.computed(updateModel, null, { disposeWhenNodeIsRemoved: element });
        ko.utils.registerEventHandler(element, "click", updateModel);

        // The second responds to changes in the model value (the one associated with the checked binding)
        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
    }
};
ko.expressionRewriting.twoWayBindings['checked'] = true;

ko.bindingHandlers['checkedValue'] = {
    'update': function (element, valueAccessor) {
        element.value = ko.utils.unwrapObservable(valueAccessor());
    }
};

})();var classesWrittenByBindingKey = '__ko__cssValue';
ko.bindingHandlers['css'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (typeof value == "object") {
            ko.utils.objectForEach(value, function(className, shouldHaveClass) {
                shouldHaveClass = ko.utils.unwrapObservable(shouldHaveClass);
                ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
            });
        } else {
            value = String(value || ''); // Make sure we don't try to store or set a non-string value
            ko.utils.toggleDomNodeCssClass(element, element[classesWrittenByBindingKey], false);
            element[classesWrittenByBindingKey] = value;
            ko.utils.toggleDomNodeCssClass(element, value, true);
        }
    }
};
ko.bindingHandlers['enable'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value && element.disabled)
            element.removeAttribute("disabled");
        else if ((!value) && (!element.disabled))
            element.disabled = true;
    }
};

ko.bindingHandlers['disable'] = {
    'update': function (element, valueAccessor) {
        ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
    }
};
// For certain common events (currently just 'click'), allow a simplified data-binding syntax
// e.g. click:handler instead of the usual full-length event:{click:handler}
function makeEventHandlerShortcut(eventName) {
    ko.bindingHandlers[eventName] = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var newValueAccessor = function () {
                var result = {};
                result[eventName] = valueAccessor();
                return result;
            };
            return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
        }
    }
}

ko.bindingHandlers['event'] = {
    'init' : function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var eventsToHandle = valueAccessor() || {};
        ko.utils.objectForEach(eventsToHandle, function(eventName) {
            if (typeof eventName == "string") {
                ko.utils.registerEventHandler(element, eventName, function (event) {
                    var handlerReturnValue;
                    var handlerFunction = valueAccessor()[eventName];
                    if (!handlerFunction)
                        return;

                    try {
                        // Take all the event args, and prefix with the viewmodel
                        var argsForHandler = ko.utils.makeArray(arguments);
                        viewModel = bindingContext['$data'];
                        argsForHandler.unshift(viewModel);
                        handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
                    } finally {
                        if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                            if (event.preventDefault)
                                event.preventDefault();
                            else
                                event.returnValue = false;
                        }
                    }

                    var bubble = allBindings.get(eventName + 'Bubble') !== false;
                    if (!bubble) {
                        event.cancelBubble = true;
                        if (event.stopPropagation)
                            event.stopPropagation();
                    }
                });
            }
        });
    }
};
// "foreach: someExpression" is equivalent to "template: { foreach: someExpression }"
// "foreach: { data: someExpression, afterAdd: myfn }" is equivalent to "template: { foreach: someExpression, afterAdd: myfn }"
ko.bindingHandlers['foreach'] = {
    makeTemplateValueAccessor: function(valueAccessor) {
        return function() {
            var modelValue = valueAccessor(),
                unwrappedValue = ko.utils.peekObservable(modelValue);    // Unwrap without setting a dependency here

            // If unwrappedValue is the array, pass in the wrapped value on its own
            // The value will be unwrapped and tracked within the template binding
            // (See https://github.com/SteveSanderson/knockout/issues/523)
            if ((!unwrappedValue) || typeof unwrappedValue.length == "number")
                return { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };

            // If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
            ko.utils.unwrapObservable(modelValue);
            return {
                'foreach': unwrappedValue['data'],
                'as': unwrappedValue['as'],
                'includeDestroyed': unwrappedValue['includeDestroyed'],
                'afterAdd': unwrappedValue['afterAdd'],
                'beforeRemove': unwrappedValue['beforeRemove'],
                'afterRender': unwrappedValue['afterRender'],
                'beforeMove': unwrappedValue['beforeMove'],
                'afterMove': unwrappedValue['afterMove'],
                'templateEngine': ko.nativeTemplateEngine.instance
            };
        };
    },
    'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
    },
    'update': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
    }
};
ko.expressionRewriting.bindingRewriteValidators['foreach'] = false; // Can't rewrite control flow bindings
ko.virtualElements.allowedBindings['foreach'] = true;
var hasfocusUpdatingProperty = '__ko_hasfocusUpdating';
var hasfocusLastValue = '__ko_hasfocusLastValue';
ko.bindingHandlers['hasfocus'] = {
    'init': function(element, valueAccessor, allBindings) {
        var handleElementFocusChange = function(isFocused) {
            // Where possible, ignore which event was raised and determine focus state using activeElement,
            // as this avoids phantom focus/blur events raised when changing tabs in modern browsers.
            // However, not all KO-targeted browsers (Firefox 2) support activeElement. For those browsers,
            // prevent a loss of focus when changing tabs/windows by setting a flag that prevents hasfocus
            // from calling 'blur()' on the element when it loses focus.
            // Discussion at https://github.com/SteveSanderson/knockout/pull/352
            element[hasfocusUpdatingProperty] = true;
            var ownerDoc = element.ownerDocument;
            if ("activeElement" in ownerDoc) {
                var active;
                try {
                    active = ownerDoc.activeElement;
                } catch(e) {
                    // IE9 throws if you access activeElement during page load (see issue #703)
                    active = ownerDoc.body;
                }
                isFocused = (active === element);
            }
            var modelValue = valueAccessor();
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'hasfocus', isFocused, true);

            //cache the latest value, so we can avoid unnecessarily calling focus/blur in the update function
            element[hasfocusLastValue] = isFocused;
            element[hasfocusUpdatingProperty] = false;
        };
        var handleElementFocusIn = handleElementFocusChange.bind(null, true);
        var handleElementFocusOut = handleElementFocusChange.bind(null, false);

        ko.utils.registerEventHandler(element, "focus", handleElementFocusIn);
        ko.utils.registerEventHandler(element, "focusin", handleElementFocusIn); // For IE
        ko.utils.registerEventHandler(element, "blur",  handleElementFocusOut);
        ko.utils.registerEventHandler(element, "focusout",  handleElementFocusOut); // For IE
    },
    'update': function(element, valueAccessor) {
        var value = !!ko.utils.unwrapObservable(valueAccessor()); //force boolean to compare with last value
        if (!element[hasfocusUpdatingProperty] && element[hasfocusLastValue] !== value) {
            value ? element.focus() : element.blur();
            ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, value ? "focusin" : "focusout"]); // For IE, which doesn't reliably fire "focus" or "blur" events synchronously
        }
    }
};
ko.expressionRewriting.twoWayBindings['hasfocus'] = true;

ko.bindingHandlers['hasFocus'] = ko.bindingHandlers['hasfocus']; // Make "hasFocus" an alias
ko.expressionRewriting.twoWayBindings['hasFocus'] = true;
ko.bindingHandlers['html'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected HTML (as developers are unlikely to expect that, and it has security implications)
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        // setHtml will unwrap the value if needed
        ko.utils.setHtml(element, valueAccessor());
    }
};
// Makes a binding like with or if
function makeWithIfBinding(bindingKey, isWith, isNot, makeContextCallback) {
    ko.bindingHandlers[bindingKey] = {
        'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var didDisplayOnLastUpdate,
                savedNodes;
            ko.computed(function() {
                var dataValue = ko.utils.unwrapObservable(valueAccessor()),
                    shouldDisplay = !isNot !== !dataValue, // equivalent to isNot ? !dataValue : !!dataValue
                    isFirstRender = !savedNodes,
                    needsRefresh = isFirstRender || isWith || (shouldDisplay !== didDisplayOnLastUpdate);

                if (needsRefresh) {
                    // Save a copy of the inner nodes on the initial update, but only if we have dependencies.
                    if (isFirstRender && ko.computedContext.getDependenciesCount()) {
                        savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true /* shouldCleanNodes */);
                    }

                    if (shouldDisplay) {
                        if (!isFirstRender) {
                            ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(savedNodes));
                        }
                        ko.applyBindingsToDescendants(makeContextCallback ? makeContextCallback(bindingContext, dataValue) : bindingContext, element);
                    } else {
                        ko.virtualElements.emptyNode(element);
                    }

                    didDisplayOnLastUpdate = shouldDisplay;
                }
            }, null, { disposeWhenNodeIsRemoved: element });
            return { 'controlsDescendantBindings': true };
        }
    };
    ko.expressionRewriting.bindingRewriteValidators[bindingKey] = false; // Can't rewrite control flow bindings
    ko.virtualElements.allowedBindings[bindingKey] = true;
}

// Construct the actual binding handlers
makeWithIfBinding('if');
makeWithIfBinding('ifnot', false /* isWith */, true /* isNot */);
makeWithIfBinding('with', true /* isWith */, false /* isNot */,
    function(bindingContext, dataValue) {
        return bindingContext['createChildContext'](dataValue);
    }
);
var captionPlaceholder = {};
ko.bindingHandlers['options'] = {
    'init': function(element) {
        if (ko.utils.tagNameLower(element) !== "select")
            throw new Error("options binding applies only to SELECT elements");

        // Remove all existing <option>s.
        while (element.length > 0) {
            element.remove(0);
        }

        // Ensures that the binding processor doesn't try to bind the options
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor, allBindings) {
        function selectedOptions() {
            return ko.utils.arrayFilter(element.options, function (node) { return node.selected; });
        }

        var selectWasPreviouslyEmpty = element.length == 0;
        var previousScrollTop = (!selectWasPreviouslyEmpty && element.multiple) ? element.scrollTop : null;
        var unwrappedArray = ko.utils.unwrapObservable(valueAccessor());
        var includeDestroyed = allBindings.get('optionsIncludeDestroyed');
        var arrayToDomNodeChildrenOptions = {};
        var captionValue;
        var filteredArray;
        var previousSelectedValues;

        if (element.multiple) {
            previousSelectedValues = ko.utils.arrayMap(selectedOptions(), ko.selectExtensions.readValue);
        } else {
            previousSelectedValues = element.selectedIndex >= 0 ? [ ko.selectExtensions.readValue(element.options[element.selectedIndex]) ] : [];
        }

        if (unwrappedArray) {
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return includeDestroyed || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            // If caption is included, add it to the array
            if (allBindings['has']('optionsCaption')) {
                captionValue = ko.utils.unwrapObservable(allBindings.get('optionsCaption'));
                // If caption value is null or undefined, don't show a caption
                if (captionValue !== null && captionValue !== undefined) {
                    filteredArray.unshift(captionPlaceholder);
                }
            }
        } else {
            // If a falsy value is provided (e.g. null), we'll simply empty the select element
        }

        function applyToObject(object, predicate, defaultValue) {
            var predicateType = typeof predicate;
            if (predicateType == "function")    // Given a function; run it against the data value
                return predicate(object);
            else if (predicateType == "string") // Given a string; treat it as a property name on the data value
                return object[predicate];
            else                                // Given no optionsText arg; use the data value itself
                return defaultValue;
        }

        // The following functions can run at two different times:
        // The first is when the whole array is being updated directly from this binding handler.
        // The second is when an observable value for a specific array entry is updated.
        // oldOptions will be empty in the first case, but will be filled with the previously generated option in the second.
        var itemUpdate = false;
        function optionForArrayItem(arrayEntry, index, oldOptions) {
            if (oldOptions.length) {
                previousSelectedValues = oldOptions[0].selected ? [ ko.selectExtensions.readValue(oldOptions[0]) ] : [];
                itemUpdate = true;
            }
            var option = element.ownerDocument.createElement("option");
            if (arrayEntry === captionPlaceholder) {
                ko.utils.setTextContent(option, allBindings.get('optionsCaption'));
                ko.selectExtensions.writeValue(option, undefined);
            } else {
                // Apply a value to the option element
                var optionValue = applyToObject(arrayEntry, allBindings.get('optionsValue'), arrayEntry);
                ko.selectExtensions.writeValue(option, ko.utils.unwrapObservable(optionValue));

                // Apply some text to the option element
                var optionText = applyToObject(arrayEntry, allBindings.get('optionsText'), optionValue);
                ko.utils.setTextContent(option, optionText);
            }
            return [option];
        }

        // By using a beforeRemove callback, we delay the removal until after new items are added. This fixes a selection
        // problem in IE<=8 and Firefox. See https://github.com/knockout/knockout/issues/1208
        arrayToDomNodeChildrenOptions['beforeRemove'] =
            function (option) {
                element.removeChild(option);
            };

        function setSelectionCallback(arrayEntry, newOptions) {
            // IE6 doesn't like us to assign selection to OPTION nodes before they're added to the document.
            // That's why we first added them without selection. Now it's time to set the selection.
            if (previousSelectedValues.length) {
                var isSelected = ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[0])) >= 0;
                ko.utils.setOptionNodeSelectionState(newOptions[0], isSelected);

                // If this option was changed from being selected during a single-item update, notify the change
                if (itemUpdate && !isSelected)
                    ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
            }
        }

        var callback = setSelectionCallback;
        if (allBindings['has']('optionsAfterRender')) {
            callback = function(arrayEntry, newOptions) {
                setSelectionCallback(arrayEntry, newOptions);
                ko.dependencyDetection.ignore(allBindings.get('optionsAfterRender'), null, [newOptions[0], arrayEntry !== captionPlaceholder ? arrayEntry : undefined]);
            }
        }

        ko.utils.setDomNodeChildrenFromArrayMapping(element, filteredArray, optionForArrayItem, arrayToDomNodeChildrenOptions, callback);

        ko.dependencyDetection.ignore(function () {
            if (allBindings.get('valueAllowUnset') && allBindings['has']('value')) {
                // The model value is authoritative, so make sure its value is the one selected
                ko.selectExtensions.writeValue(element, ko.utils.unwrapObservable(allBindings.get('value')), true /* allowUnset */);
            } else {
                // Determine if the selection has changed as a result of updating the options list
                var selectionChanged;
                if (element.multiple) {
                    // For a multiple-select box, compare the new selection count to the previous one
                    // But if nothing was selected before, the selection can't have changed
                    selectionChanged = previousSelectedValues.length && selectedOptions().length < previousSelectedValues.length;
                } else {
                    // For a single-select box, compare the current value to the previous value
                    // But if nothing was selected before or nothing is selected now, just look for a change in selection
                    selectionChanged = (previousSelectedValues.length && element.selectedIndex >= 0)
                        ? (ko.selectExtensions.readValue(element.options[element.selectedIndex]) !== previousSelectedValues[0])
                        : (previousSelectedValues.length || element.selectedIndex >= 0);
                }

                // Ensure consistency between model value and selected option.
                // If the dropdown was changed so that selection is no longer the same,
                // notify the value or selectedOptions binding.
                if (selectionChanged) {
                    ko.utils.triggerEvent(element, "change");
                }
            }
        });

        // Workaround for IE bug
        ko.utils.ensureSelectElementIsRenderedCorrectly(element);

        if (previousScrollTop && Math.abs(previousScrollTop - element.scrollTop) > 20)
            element.scrollTop = previousScrollTop;
    }
};
ko.bindingHandlers['options'].optionValueDomDataKey = ko.utils.domData.nextKey();
ko.bindingHandlers['selectedOptions'] = {
    'after': ['options', 'foreach'],
    'init': function (element, valueAccessor, allBindings) {
        ko.utils.registerEventHandler(element, "change", function () {
            var value = valueAccessor(), valueToWrite = [];
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                if (node.selected)
                    valueToWrite.push(ko.selectExtensions.readValue(node));
            });
            ko.expressionRewriting.writeValueToProperty(value, allBindings, 'selectedOptions', valueToWrite);
        });
    },
    'update': function (element, valueAccessor) {
        if (ko.utils.tagNameLower(element) != "select")
            throw new Error("values binding applies only to SELECT elements");

        var newValue = ko.utils.unwrapObservable(valueAccessor());
        if (newValue && typeof newValue.length == "number") {
            ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
                var isSelected = ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0;
                ko.utils.setOptionNodeSelectionState(node, isSelected);
            });
        }
    }
};
ko.expressionRewriting.twoWayBindings['selectedOptions'] = true;
ko.bindingHandlers['style'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor() || {});
        ko.utils.objectForEach(value, function(styleName, styleValue) {
            styleValue = ko.utils.unwrapObservable(styleValue);

            if (styleValue === null || styleValue === undefined || styleValue === false) {
                // Empty string removes the value, whereas null/undefined have no effect
                styleValue = "";
            }

            element.style[styleName] = styleValue;
        });
    }
};
ko.bindingHandlers['submit'] = {
    'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (typeof valueAccessor() != "function")
            throw new Error("The value for a submit binding must be a function");
        ko.utils.registerEventHandler(element, "submit", function (event) {
            var handlerReturnValue;
            var value = valueAccessor();
            try { handlerReturnValue = value.call(bindingContext['$data'], element); }
            finally {
                if (handlerReturnValue !== true) { // Normally we want to prevent default action. Developer can override this be explicitly returning true.
                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
                }
            }
        });
    }
};
ko.bindingHandlers['text'] = {
    'init': function() {
        // Prevent binding on the dynamically-injected text node (as developers are unlikely to expect that, and it has security implications).
        // It should also make things faster, as we no longer have to consider whether the text node might be bindable.
        return { 'controlsDescendantBindings': true };
    },
    'update': function (element, valueAccessor) {
        ko.utils.setTextContent(element, valueAccessor());
    }
};
ko.virtualElements.allowedBindings['text'] = true;
(function () {

if (window && window.navigator) {
    var parseVersion = function (matches) {
        if (matches) {
            return parseFloat(matches[1]);
        }
    };

    // Detect various browser versions because some old versions don't fully support the 'input' event
    var operaVersion = window.opera && window.opera.version && parseInt(window.opera.version()),
        userAgent = window.navigator.userAgent,
        safariVersion = parseVersion(userAgent.match(/^(?:(?!chrome).)*version\/([^ ]*) safari/i)),
        firefoxVersion = parseVersion(userAgent.match(/Firefox\/([^ ]*)/));
}

// IE 8 and 9 have bugs that prevent the normal events from firing when the value changes.
// But it does fire the 'selectionchange' event on many of those, presumably because the
// cursor is moving and that counts as the selection changing. The 'selectionchange' event is
// fired at the document level only and doesn't directly indicate which element changed. We
// set up just one event handler for the document and use 'activeElement' to determine which
// element was changed.
if (ko.utils.ieVersion < 10) {
    var selectionChangeRegisteredName = ko.utils.domData.nextKey(),
        selectionChangeHandlerName = ko.utils.domData.nextKey();
    var selectionChangeHandler = function(event) {
        var target = this.activeElement,
            handler = target && ko.utils.domData.get(target, selectionChangeHandlerName);
        if (handler) {
            handler(event);
        }
    };
    var registerForSelectionChangeEvent = function (element, handler) {
        var ownerDoc = element.ownerDocument;
        if (!ko.utils.domData.get(ownerDoc, selectionChangeRegisteredName)) {
            ko.utils.domData.set(ownerDoc, selectionChangeRegisteredName, true);
            ko.utils.registerEventHandler(ownerDoc, 'selectionchange', selectionChangeHandler);
        }
        ko.utils.domData.set(element, selectionChangeHandlerName, handler);
    };
}

ko.bindingHandlers['textInput'] = {
    'init': function (element, valueAccessor, allBindings) {

        var previousElementValue = element.value,
            timeoutHandle,
            elementValueBeforeEvent;

        var updateModel = function (event) {
            clearTimeout(timeoutHandle);
            elementValueBeforeEvent = timeoutHandle = undefined;

            var elementValue = element.value;
            if (previousElementValue !== elementValue) {
                // Provide a way for tests to know exactly which event was processed
                if (DEBUG && event) element['_ko_textInputProcessedEvent'] = event.type;
                previousElementValue = elementValue;
                ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'textInput', elementValue);
            }
        };

        var deferUpdateModel = function (event) {
            if (!timeoutHandle) {
                // The elementValueBeforeEvent variable is set *only* during the brief gap between an
                // event firing and the updateModel function running. This allows us to ignore model
                // updates that are from the previous state of the element, usually due to techniques
                // such as rateLimit. Such updates, if not ignored, can cause keystrokes to be lost.
                elementValueBeforeEvent = element.value;
                var handler = DEBUG ? updateModel.bind(element, {type: event.type}) : updateModel;
                timeoutHandle = setTimeout(handler, 4);
            }
        };

        var updateView = function () {
            var modelValue = ko.utils.unwrapObservable(valueAccessor());

            if (modelValue === null || modelValue === undefined) {
                modelValue = '';
            }

            if (elementValueBeforeEvent !== undefined && modelValue === elementValueBeforeEvent) {
                setTimeout(updateView, 4);
                return;
            }

            // Update the element only if the element and model are different. On some browsers, updating the value
            // will move the cursor to the end of the input, which would be bad while the user is typing.
            if (element.value !== modelValue) {
                previousElementValue = modelValue;  // Make sure we ignore events (propertychange) that result from updating the value
                element.value = modelValue;
            }
        };

        var onEvent = function (event, handler) {
            ko.utils.registerEventHandler(element, event, handler);
        };

        if (DEBUG && ko.bindingHandlers['textInput']['_forceUpdateOn']) {
            // Provide a way for tests to specify exactly which events are bound
            ko.utils.arrayForEach(ko.bindingHandlers['textInput']['_forceUpdateOn'], function(eventName) {
                if (eventName.slice(0,5) == 'after') {
                    onEvent(eventName.slice(5), deferUpdateModel);
                } else {
                    onEvent(eventName, updateModel);
                }
            });
        } else {
            if (ko.utils.ieVersion < 10) {
                // Internet Explorer <= 8 doesn't support the 'input' event, but does include 'propertychange' that fires whenever
                // any property of an element changes. Unlike 'input', it also fires if a property is changed from JavaScript code,
                // but that's an acceptable compromise for this binding. IE 9 does support 'input', but since it doesn't fire it
                // when using autocomplete, we'll use 'propertychange' for it also.
                onEvent('propertychange', function(event) {
                    if (event.propertyName === 'value') {
                        updateModel(event);
                    }
                });

                if (ko.utils.ieVersion == 8) {
                    // IE 8 has a bug where it fails to fire 'propertychange' on the first update following a value change from
                    // JavaScript code. It also doesn't fire if you clear the entire value. To fix this, we bind to the following
                    // events too.
                    onEvent('keyup', updateModel);      // A single keystoke
                    onEvent('keydown', updateModel);    // The first character when a key is held down
                }
                if (ko.utils.ieVersion >= 8) {
                    // Internet Explorer 9 doesn't fire the 'input' event when deleting text, including using
                    // the backspace, delete, or ctrl-x keys, clicking the 'x' to clear the input, dragging text
                    // out of the field, and cutting or deleting text using the context menu. 'selectionchange'
                    // can detect all of those except dragging text out of the field, for which we use 'dragend'.
                    // These are also needed in IE8 because of the bug described above.
                    registerForSelectionChangeEvent(element, updateModel);  // 'selectionchange' covers cut, paste, drop, delete, etc.
                    onEvent('dragend', deferUpdateModel);
                }
            } else {
                // All other supported browsers support the 'input' event, which fires whenever the content of the element is changed
                // through the user interface.
                onEvent('input', updateModel);

                if (safariVersion < 5 && ko.utils.tagNameLower(element) === "textarea") {
                    // Safari <5 doesn't fire the 'input' event for <textarea> elements (it does fire 'textInput'
                    // but only when typing). So we'll just catch as much as we can with keydown, cut, and paste.
                    onEvent('keydown', deferUpdateModel);
                    onEvent('paste', deferUpdateModel);
                    onEvent('cut', deferUpdateModel);
                } else if (operaVersion < 11) {
                    // Opera 10 doesn't always fire the 'input' event for cut, paste, undo & drop operations.
                    // We can try to catch some of those using 'keydown'.
                    onEvent('keydown', deferUpdateModel);
                } else if (firefoxVersion < 4.0) {
                    // Firefox <= 3.6 doesn't fire the 'input' event when text is filled in through autocomplete
                    onEvent('DOMAutoComplete', updateModel);

                    // Firefox <=3.5 doesn't fire the 'input' event when text is dropped into the input.
                    onEvent('dragdrop', updateModel);       // <3.5
                    onEvent('drop', updateModel);           // 3.5
                }
            }
        }

        // Bind to the change event so that we can catch programmatic updates of the value that fire this event.
        onEvent('change', updateModel);

        ko.computed(updateView, null, { disposeWhenNodeIsRemoved: element });
    }
};
ko.expressionRewriting.twoWayBindings['textInput'] = true;

// textinput is an alias for textInput
ko.bindingHandlers['textinput'] = {
    // preprocess is the only way to set up a full alias
    'preprocess': function (value, name, addBinding) {
        addBinding('textInput', value);
    }
};

})();ko.bindingHandlers['uniqueName'] = {
    'init': function (element, valueAccessor) {
        if (valueAccessor()) {
            var name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);
            ko.utils.setElementName(element, name);
        }
    }
};
ko.bindingHandlers['uniqueName'].currentIndex = 0;
ko.bindingHandlers['value'] = {
    'after': ['options', 'foreach'],
    'init': function (element, valueAccessor, allBindings) {
        // If the value binding is placed on a radio/checkbox, then just pass through to checkedValue and quit
        if (element.tagName.toLowerCase() == "input" && (element.type == "checkbox" || element.type == "radio")) {
            ko.applyBindingAccessorsToNode(element, { 'checkedValue': valueAccessor });
            return;
        }

        // Always catch "change" event; possibly other events too if asked
        var eventsToCatch = ["change"];
        var requestedEventsToCatch = allBindings.get("valueUpdate");
        var propertyChangedFired = false;
        var elementValueBeforeEvent = null;

        if (requestedEventsToCatch) {
            if (typeof requestedEventsToCatch == "string") // Allow both individual event names, and arrays of event names
                requestedEventsToCatch = [requestedEventsToCatch];
            ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
            eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
        }

        var valueUpdateHandler = function() {
            elementValueBeforeEvent = null;
            propertyChangedFired = false;
            var modelValue = valueAccessor();
            var elementValue = ko.selectExtensions.readValue(element);
            ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'value', elementValue);
        }

        // Workaround for https://github.com/SteveSanderson/knockout/issues/122
        // IE doesn't fire "change" events on textboxes if the user selects a value from its autocomplete list
        var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text"
                                       && element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
        if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
            ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true });
            ko.utils.registerEventHandler(element, "focus", function () { propertyChangedFired = false });
            ko.utils.registerEventHandler(element, "blur", function() {
                if (propertyChangedFired) {
                    valueUpdateHandler();
                }
            });
        }

        ko.utils.arrayForEach(eventsToCatch, function(eventName) {
            // The syntax "after<eventname>" means "run the handler asynchronously after the event"
            // This is useful, for example, to catch "keydown" events after the browser has updated the control
            // (otherwise, ko.selectExtensions.readValue(this) will receive the control's value *before* the key event)
            var handler = valueUpdateHandler;
            if (ko.utils.stringStartsWith(eventName, "after")) {
                handler = function() {
                    // The elementValueBeforeEvent variable is non-null *only* during the brief gap between
                    // a keyX event firing and the valueUpdateHandler running, which is scheduled to happen
                    // at the earliest asynchronous opportunity. We store this temporary information so that
                    // if, between keyX and valueUpdateHandler, the underlying model value changes separately,
                    // we can overwrite that model value change with the value the user just typed. Otherwise,
                    // techniques like rateLimit can trigger model changes at critical moments that will
                    // override the user's inputs, causing keystrokes to be lost.
                    elementValueBeforeEvent = ko.selectExtensions.readValue(element);
                    setTimeout(valueUpdateHandler, 0);
                };
                eventName = eventName.substring("after".length);
            }
            ko.utils.registerEventHandler(element, eventName, handler);
        });

        var updateFromModel = function () {
            var newValue = ko.utils.unwrapObservable(valueAccessor());
            var elementValue = ko.selectExtensions.readValue(element);

            if (elementValueBeforeEvent !== null && newValue === elementValueBeforeEvent) {
                setTimeout(updateFromModel, 0);
                return;
            }

            var valueHasChanged = (newValue !== elementValue);

            if (valueHasChanged) {
                if (ko.utils.tagNameLower(element) === "select") {
                    var allowUnset = allBindings.get('valueAllowUnset');
                    var applyValueAction = function () {
                        ko.selectExtensions.writeValue(element, newValue, allowUnset);
                    };
                    applyValueAction();

                    if (!allowUnset && newValue !== ko.selectExtensions.readValue(element)) {
                        // If you try to set a model value that can't be represented in an already-populated dropdown, reject that change,
                        // because you're not allowed to have a model value that disagrees with a visible UI selection.
                        ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
                    } else {
                        // Workaround for IE6 bug: It won't reliably apply values to SELECT nodes during the same execution thread
                        // right after you've changed the set of OPTION nodes on it. So for that node type, we'll schedule a second thread
                        // to apply the value as well.
                        setTimeout(applyValueAction, 0);
                    }
                } else {
                    ko.selectExtensions.writeValue(element, newValue);
                }
            }
        };

        ko.computed(updateFromModel, null, { disposeWhenNodeIsRemoved: element });
    },
    'update': function() {} // Keep for backwards compatibility with code that may have wrapped value binding
};
ko.expressionRewriting.twoWayBindings['value'] = true;
ko.bindingHandlers['visible'] = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible)
            element.style.display = "";
        else if ((!value) && isCurrentlyVisible)
            element.style.display = "none";
    }
};
// 'click' is just a shorthand for the usual full-length event:{click:handler}
makeEventHandlerShortcut('click');
// If you want to make a custom template engine,
//
// [1] Inherit from this class (like ko.nativeTemplateEngine does)
// [2] Override 'renderTemplateSource', supplying a function with this signature:
//
//        function (templateSource, bindingContext, options) {
//            // - templateSource.text() is the text of the template you should render
//            // - bindingContext.$data is the data you should pass into the template
//            //   - you might also want to make bindingContext.$parent, bindingContext.$parents,
//            //     and bindingContext.$root available in the template too
//            // - options gives you access to any other properties set on "data-bind: { template: options }"
//            //
//            // Return value: an array of DOM nodes
//        }
//
// [3] Override 'createJavaScriptEvaluatorBlock', supplying a function with this signature:
//
//        function (script) {
//            // Return value: Whatever syntax means "Evaluate the JavaScript statement 'script' and output the result"
//            //               For example, the jquery.tmpl template engine converts 'someScript' to '${ someScript }'
//        }
//
//     This is only necessary if you want to allow data-bind attributes to reference arbitrary template variables.
//     If you don't want to allow that, you can set the property 'allowTemplateRewriting' to false (like ko.nativeTemplateEngine does)
//     and then you don't need to override 'createJavaScriptEvaluatorBlock'.

ko.templateEngine = function () { };

ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    throw new Error("Override renderTemplateSource");
};

ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
    throw new Error("Override createJavaScriptEvaluatorBlock");
};

ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {
    // Named template
    if (typeof template == "string") {
        templateDocument = templateDocument || document;
        var elem = templateDocument.getElementById(template);
        if (!elem)
            throw new Error("Cannot find template with ID " + template);
        return new ko.templateSources.domElement(elem);
    } else if ((template.nodeType == 1) || (template.nodeType == 8)) {
        // Anonymous template
        return new ko.templateSources.anonymousTemplate(template);
    } else
        throw new Error("Unknown template type: " + template);
};

ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    return this['renderTemplateSource'](templateSource, bindingContext, options);
};

ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {
    // Skip rewriting if requested
    if (this['allowTemplateRewriting'] === false)
        return true;
    return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
};

ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
    var templateSource = this['makeTemplateSource'](template, templateDocument);
    var rewritten = rewriterCallback(templateSource['text']());
    templateSource['text'](rewritten);
    templateSource['data']("isRewritten", true);
};

ko.exportSymbol('templateEngine', ko.templateEngine);

ko.templateRewriting = (function () {
    var memoizeDataBindingAttributeSyntaxRegex = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi;
    var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

    function validateDataBindValuesForRewriting(keyValueArray) {
        var allValidators = ko.expressionRewriting.bindingRewriteValidators;
        for (var i = 0; i < keyValueArray.length; i++) {
            var key = keyValueArray[i]['key'];
            if (allValidators.hasOwnProperty(key)) {
                var validator = allValidators[key];

                if (typeof validator === "function") {
                    var possibleErrorMessage = validator(keyValueArray[i]['value']);
                    if (possibleErrorMessage)
                        throw new Error(possibleErrorMessage);
                } else if (!validator) {
                    throw new Error("This template engine does not support the '" + key + "' binding within its templates");
                }
            }
        }
    }

    function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, nodeName, templateEngine) {
        var dataBindKeyValueArray = ko.expressionRewriting.parseObjectLiteral(dataBindAttributeValue);
        validateDataBindValuesForRewriting(dataBindKeyValueArray);
        var rewrittenDataBindAttributeValue = ko.expressionRewriting.preProcessBindings(dataBindKeyValueArray, {'valueAccessors':true});

        // For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional
        // anonymous function, even though Opera's built-in debugger can evaluate it anyway. No other browser requires this
        // extra indirection.
        var applyBindingsToNextSiblingScript =
            "ko.__tr_ambtns(function($context,$element){return(function(){return{ " + rewrittenDataBindAttributeValue + " } })()},'" + nodeName.toLowerCase() + "')";
        return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
    }

    return {
        ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
            if (!templateEngine['isTemplateRewritten'](template, templateDocument))
                templateEngine['rewriteTemplate'](template, function (htmlString) {
                    return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
                }, templateDocument);
        },

        memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
            return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[4], /* tagToRetain: */ arguments[1], /* nodeName: */ arguments[2], templateEngine);
            }).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
                return constructMemoizedTagReplacement(/* dataBindAttributeValue: */ arguments[1], /* tagToRetain: */ "<!-- ko -->", /* nodeName: */ "#comment", templateEngine);
            });
        },

        applyMemoizedBindingsToNextSibling: function (bindings, nodeName) {
            return ko.memoization.memoize(function (domNode, bindingContext) {
                var nodeToBind = domNode.nextSibling;
                if (nodeToBind && nodeToBind.nodeName.toLowerCase() === nodeName) {
                    ko.applyBindingAccessorsToNode(nodeToBind, bindings, bindingContext);
                }
            });
        }
    }
})();


// Exported only because it has to be referenced by string lookup from within rewritten template
ko.exportSymbol('__tr_ambtns', ko.templateRewriting.applyMemoizedBindingsToNextSibling);
(function() {
    // A template source represents a read/write way of accessing a template. This is to eliminate the need for template loading/saving
    // logic to be duplicated in every template engine (and means they can all work with anonymous templates, etc.)
    //
    // Two are provided by default:
    //  1. ko.templateSources.domElement       - reads/writes the text content of an arbitrary DOM element
    //  2. ko.templateSources.anonymousElement - uses ko.utils.domData to read/write text *associated* with the DOM element, but
    //                                           without reading/writing the actual element text content, since it will be overwritten
    //                                           with the rendered template output.
    // You can implement your own template source if you want to fetch/store templates somewhere other than in DOM elements.
    // Template sources need to have the following functions:
    //   text() 			- returns the template text from your storage location
    //   text(value)		- writes the supplied template text to your storage location
    //   data(key)			- reads values stored using data(key, value) - see below
    //   data(key, value)	- associates "value" with this template and the key "key". Is used to store information like "isRewritten".
    //
    // Optionally, template sources can also have the following functions:
    //   nodes()            - returns a DOM element containing the nodes of this template, where available
    //   nodes(value)       - writes the given DOM element to your storage location
    // If a DOM element is available for a given template source, template engines are encouraged to use it in preference over text()
    // for improved speed. However, all templateSources must supply text() even if they don't supply nodes().
    //
    // Once you've implemented a templateSource, make your template engine use it by subclassing whatever template engine you were
    // using and overriding "makeTemplateSource" to return an instance of your custom template source.

    ko.templateSources = {};

    // ---- ko.templateSources.domElement -----

    ko.templateSources.domElement = function(element) {
        this.domElement = element;
    }

    ko.templateSources.domElement.prototype['text'] = function(/* valueToWrite */) {
        var tagNameLower = ko.utils.tagNameLower(this.domElement),
            elemContentsProperty = tagNameLower === "script" ? "text"
                                 : tagNameLower === "textarea" ? "value"
                                 : "innerHTML";

        if (arguments.length == 0) {
            return this.domElement[elemContentsProperty];
        } else {
            var valueToWrite = arguments[0];
            if (elemContentsProperty === "innerHTML")
                ko.utils.setHtml(this.domElement, valueToWrite);
            else
                this.domElement[elemContentsProperty] = valueToWrite;
        }
    };

    var dataDomDataPrefix = ko.utils.domData.nextKey() + "_";
    ko.templateSources.domElement.prototype['data'] = function(key /*, valueToWrite */) {
        if (arguments.length === 1) {
            return ko.utils.domData.get(this.domElement, dataDomDataPrefix + key);
        } else {
            ko.utils.domData.set(this.domElement, dataDomDataPrefix + key, arguments[1]);
        }
    };

    // ---- ko.templateSources.anonymousTemplate -----
    // Anonymous templates are normally saved/retrieved as DOM nodes through "nodes".
    // For compatibility, you can also read "text"; it will be serialized from the nodes on demand.
    // Writing to "text" is still supported, but then the template data will not be available as DOM nodes.

    var anonymousTemplatesDomDataKey = ko.utils.domData.nextKey();
    ko.templateSources.anonymousTemplate = function(element) {
        this.domElement = element;
    }
    ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
    ko.templateSources.anonymousTemplate.prototype.constructor = ko.templateSources.anonymousTemplate;
    ko.templateSources.anonymousTemplate.prototype['text'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            if (templateData.textData === undefined && templateData.containerData)
                templateData.textData = templateData.containerData.innerHTML;
            return templateData.textData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {textData: valueToWrite});
        }
    };
    ko.templateSources.domElement.prototype['nodes'] = function(/* valueToWrite */) {
        if (arguments.length == 0) {
            var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
            return templateData.containerData;
        } else {
            var valueToWrite = arguments[0];
            ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {containerData: valueToWrite});
        }
    };

    ko.exportSymbol('templateSources', ko.templateSources);
    ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
    ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
})();
(function () {
    var _templateEngine;
    ko.setTemplateEngine = function (templateEngine) {
        if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
            throw new Error("templateEngine must inherit from ko.templateEngine");
        _templateEngine = templateEngine;
    }

    function invokeForEachNodeInContinuousRange(firstNode, lastNode, action) {
        var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
        while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
            nextInQueue = ko.virtualElements.nextSibling(node);
            action(node, nextInQueue);
        }
    }

    function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {
        // To be used on any nodes that have been rendered by a template and have been inserted into some parent element
        // Walks through continuousNodeArray (which *must* be continuous, i.e., an uninterrupted sequence of sibling nodes, because
        // the algorithm for walking them relies on this), and for each top-level item in the virtual-element sense,
        // (1) Does a regular "applyBindings" to associate bindingContext with this node and to activate any non-memoized bindings
        // (2) Unmemoizes any memos in the DOM subtree (e.g., to activate bindings that had been memoized during template rewriting)

        if (continuousNodeArray.length) {
            var firstNode = continuousNodeArray[0],
                lastNode = continuousNodeArray[continuousNodeArray.length - 1],
                parentNode = firstNode.parentNode,
                provider = ko.bindingProvider['instance'],
                preprocessNode = provider['preprocessNode'];

            if (preprocessNode) {
                invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node, nextNodeInRange) {
                    var nodePreviousSibling = node.previousSibling;
                    var newNodes = preprocessNode.call(provider, node);
                    if (newNodes) {
                        if (node === firstNode)
                            firstNode = newNodes[0] || nextNodeInRange;
                        if (node === lastNode)
                            lastNode = newNodes[newNodes.length - 1] || nodePreviousSibling;
                    }
                });

                // Because preprocessNode can change the nodes, including the first and last nodes, update continuousNodeArray to match.
                // We need the full set, including inner nodes, because the unmemoize step might remove the first node (and so the real
                // first node needs to be in the array).
                continuousNodeArray.length = 0;
                if (!firstNode) { // preprocessNode might have removed all the nodes, in which case there's nothing left to do
                    return;
                }
                if (firstNode === lastNode) {
                    continuousNodeArray.push(firstNode);
                } else {
                    continuousNodeArray.push(firstNode, lastNode);
                    ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
                }
            }

            // Need to applyBindings *before* unmemoziation, because unmemoization might introduce extra nodes (that we don't want to re-bind)
            // whereas a regular applyBindings won't introduce new memoized nodes
            invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
                if (node.nodeType === 1 || node.nodeType === 8)
                    ko.applyBindings(bindingContext, node);
            });
            invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
                if (node.nodeType === 1 || node.nodeType === 8)
                    ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
            });

            // Make sure any changes done by applyBindings or unmemoize are reflected in the array
            ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
        }
    }

    function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
        return nodeOrNodeArray.nodeType ? nodeOrNodeArray
                                        : nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
                                        : null;
    }

    function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
        options = options || {};
        var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
        var templateDocument = firstTargetNode && firstTargetNode.ownerDocument;
        var templateEngineToUse = (options['templateEngine'] || _templateEngine);
        ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
        var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);

        // Loosely check result is an array of DOM nodes
        if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
            throw new Error("Template engine must return an array of DOM nodes");

        var haveAddedNodesToParent = false;
        switch (renderMode) {
            case "replaceChildren":
                ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "replaceNode":
                ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
                haveAddedNodesToParent = true;
                break;
            case "ignoreTargetNode": break;
            default:
                throw new Error("Unknown renderMode: " + renderMode);
        }

        if (haveAddedNodesToParent) {
            activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
            if (options['afterRender'])
                ko.dependencyDetection.ignore(options['afterRender'], null, [renderedNodesArray, bindingContext['$data']]);
        }

        return renderedNodesArray;
    }

    function resolveTemplateName(template, data, context) {
        // The template can be specified as:
        if (ko.isObservable(template)) {
            // 1. An observable, with string value
            return template();
        } else if (typeof template === 'function') {
            // 2. A function of (data, context) returning a string
            return template(data, context);
        } else {
            // 3. A string
            return template;
        }
    }

    ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
        options = options || {};
        if ((options['templateEngine'] || _templateEngine) == undefined)
            throw new Error("Set a template engine before calling renderTemplate");
        renderMode = renderMode || "replaceChildren";

        if (targetNodeOrNodeArray) {
            var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

            var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); }; // Passive disposal (on next evaluation)
            var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

            return ko.dependentObservable( // So the DOM is automatically updated when any dependency changes
                function () {
                    // Ensure we've got a proper binding context to work with
                    var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
                        ? dataOrBindingContext
                        : new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));

                    var templateName = resolveTemplateName(template, bindingContext['$data'], bindingContext),
                        renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);

                    if (renderMode == "replaceNode") {
                        targetNodeOrNodeArray = renderedNodesArray;
                        firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
                    }
                },
                null,
                { disposeWhen: whenToDispose, disposeWhenNodeIsRemoved: activelyDisposeWhenNodeIsRemoved }
            );
        } else {
            // We don't yet have a DOM node to evaluate, so use a memo and render the template later when there is a DOM node
            return ko.memoization.memoize(function (domNode) {
                ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
            });
        }
    };

    ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {
        // Since setDomNodeChildrenFromArrayMapping always calls executeTemplateForArrayItem and then
        // activateBindingsCallback for added items, we can store the binding context in the former to use in the latter.
        var arrayItemContext;

        // This will be called by setDomNodeChildrenFromArrayMapping to get the nodes to add to targetNode
        var executeTemplateForArrayItem = function (arrayValue, index) {
            // Support selecting template as a function of the data being rendered
            arrayItemContext = parentBindingContext['createChildContext'](arrayValue, options['as'], function(context) {
                context['$index'] = index;
            });

            var templateName = resolveTemplateName(template, arrayValue, arrayItemContext);
            return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
        }

        // This will be called whenever setDomNodeChildrenFromArrayMapping has added nodes to targetNode
        var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
            activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
            if (options['afterRender'])
                options['afterRender'](addedNodesArray, arrayValue);
        };

        return ko.dependentObservable(function () {
            var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
            if (typeof unwrappedArray.length == "undefined") // Coerce single value into array
                unwrappedArray = [unwrappedArray];

            // Filter out any entries marked as destroyed
            var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
                return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
            });

            // Call setDomNodeChildrenFromArrayMapping, ignoring any observables unwrapped within (most likely from a callback function).
            // If the array items are observables, though, they will be unwrapped in executeTemplateForArrayItem and managed within setDomNodeChildrenFromArrayMapping.
            ko.dependencyDetection.ignore(ko.utils.setDomNodeChildrenFromArrayMapping, null, [targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback]);

        }, null, { disposeWhenNodeIsRemoved: targetNode });
    };

    var templateComputedDomDataKey = ko.utils.domData.nextKey();
    function disposeOldComputedAndStoreNewOne(element, newComputed) {
        var oldComputed = ko.utils.domData.get(element, templateComputedDomDataKey);
        if (oldComputed && (typeof(oldComputed.dispose) == 'function'))
            oldComputed.dispose();
        ko.utils.domData.set(element, templateComputedDomDataKey, (newComputed && newComputed.isActive()) ? newComputed : undefined);
    }

    ko.bindingHandlers['template'] = {
        'init': function(element, valueAccessor) {
            // Support anonymous templates
            var bindingValue = ko.utils.unwrapObservable(valueAccessor());
            if (typeof bindingValue == "string" || bindingValue['name']) {
                // It's a named template - clear the element
                ko.virtualElements.emptyNode(element);
            } else {
                // It's an anonymous template - store the element contents, then clear the element
                var templateNodes = ko.virtualElements.childNodes(element),
                    container = ko.utils.moveCleanedNodesToContainerElement(templateNodes); // This also removes the nodes from their current parent
                new ko.templateSources.anonymousTemplate(element)['nodes'](container);
            }
            return { 'controlsDescendantBindings': true };
        },
        'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var value = valueAccessor(),
                dataValue,
                options = ko.utils.unwrapObservable(value),
                shouldDisplay = true,
                templateComputed = null,
                templateName;

            if (typeof options == "string") {
                templateName = value;
                options = {};
            } else {
                templateName = options['name'];

                // Support "if"/"ifnot" conditions
                if ('if' in options)
                    shouldDisplay = ko.utils.unwrapObservable(options['if']);
                if (shouldDisplay && 'ifnot' in options)
                    shouldDisplay = !ko.utils.unwrapObservable(options['ifnot']);

                dataValue = ko.utils.unwrapObservable(options['data']);
            }

            if ('foreach' in options) {
                // Render once for each data point (treating data set as empty if shouldDisplay==false)
                var dataArray = (shouldDisplay && options['foreach']) || [];
                templateComputed = ko.renderTemplateForEach(templateName || element, dataArray, options, element, bindingContext);
            } else if (!shouldDisplay) {
                ko.virtualElements.emptyNode(element);
            } else {
                // Render once for this single data point (or use the viewModel if no data was provided)
                var innerBindingContext = ('data' in options) ?
                    bindingContext['createChildContext'](dataValue, options['as']) :  // Given an explitit 'data' value, we create a child binding context for it
                    bindingContext;                                                        // Given no explicit 'data' value, we retain the same binding context
                templateComputed = ko.renderTemplate(templateName || element, innerBindingContext, options, element);
            }

            // It only makes sense to have a single template computed per element (otherwise which one should have its output displayed?)
            disposeOldComputedAndStoreNewOne(element, templateComputed);
        }
    };

    // Anonymous templates can't be rewritten. Give a nice error message if you try to do it.
    ko.expressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
        var parsedBindingValue = ko.expressionRewriting.parseObjectLiteral(bindingValue);

        if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
            return null; // It looks like a string literal, not an object literal, so treat it as a named template (which is allowed for rewriting)

        if (ko.expressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
            return null; // Named templates can be rewritten, so return "no error"
        return "This template engine does not support anonymous templates nested within its templates";
    };

    ko.virtualElements.allowedBindings['template'] = true;
})();

ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
ko.exportSymbol('renderTemplate', ko.renderTemplate);
// Go through the items that have been added and deleted and try to find matches between them.
ko.utils.findMovesInArrayComparison = function (left, right, limitFailedCompares) {
    if (left.length && right.length) {
        var failedCompares, l, r, leftItem, rightItem;
        for (failedCompares = l = 0; (!limitFailedCompares || failedCompares < limitFailedCompares) && (leftItem = left[l]); ++l) {
            for (r = 0; rightItem = right[r]; ++r) {
                if (leftItem['value'] === rightItem['value']) {
                    leftItem['moved'] = rightItem['index'];
                    rightItem['moved'] = leftItem['index'];
                    right.splice(r, 1);         // This item is marked as moved; so remove it from right list
                    failedCompares = r = 0;     // Reset failed compares count because we're checking for consecutive failures
                    break;
                }
            }
            failedCompares += r;
        }
    }
};

ko.utils.compareArrays = (function () {
    var statusNotInOld = 'added', statusNotInNew = 'deleted';

    // Simple calculation based on Levenshtein distance.
    function compareArrays(oldArray, newArray, options) {
        // For backward compatibility, if the third arg is actually a bool, interpret
        // it as the old parameter 'dontLimitMoves'. Newer code should use { dontLimitMoves: true }.
        options = (typeof options === 'boolean') ? { 'dontLimitMoves': options } : (options || {});
        oldArray = oldArray || [];
        newArray = newArray || [];

        if (oldArray.length <= newArray.length)
            return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, options);
        else
            return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, options);
    }

    function compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, options) {
        var myMin = Math.min,
            myMax = Math.max,
            editDistanceMatrix = [],
            smlIndex, smlIndexMax = smlArray.length,
            bigIndex, bigIndexMax = bigArray.length,
            compareRange = (bigIndexMax - smlIndexMax) || 1,
            maxDistance = smlIndexMax + bigIndexMax + 1,
            thisRow, lastRow,
            bigIndexMaxForRow, bigIndexMinForRow;

        for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
            lastRow = thisRow;
            editDistanceMatrix.push(thisRow = []);
            bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
            bigIndexMinForRow = myMax(0, smlIndex - 1);
            for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
                if (!bigIndex)
                    thisRow[bigIndex] = smlIndex + 1;
                else if (!smlIndex)  // Top row - transform empty array into new array via additions
                    thisRow[bigIndex] = bigIndex + 1;
                else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1])
                    thisRow[bigIndex] = lastRow[bigIndex - 1];                  // copy value (no edit)
                else {
                    var northDistance = lastRow[bigIndex] || maxDistance;       // not in big (deletion)
                    var westDistance = thisRow[bigIndex - 1] || maxDistance;    // not in small (addition)
                    thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
                }
            }
        }

        var editScript = [], meMinusOne, notInSml = [], notInBig = [];
        for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
            meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
            if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex-1]) {
                notInSml.push(editScript[editScript.length] = {     // added
                    'status': statusNotInSml,
                    'value': bigArray[--bigIndex],
                    'index': bigIndex });
            } else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
                notInBig.push(editScript[editScript.length] = {     // deleted
                    'status': statusNotInBig,
                    'value': smlArray[--smlIndex],
                    'index': smlIndex });
            } else {
                --bigIndex;
                --smlIndex;
                if (!options['sparse']) {
                    editScript.push({
                        'status': "retained",
                        'value': bigArray[bigIndex] });
                }
            }
        }

        // Set a limit on the number of consecutive non-matching comparisons; having it a multiple of
        // smlIndexMax keeps the time complexity of this algorithm linear.
        ko.utils.findMovesInArrayComparison(notInSml, notInBig, smlIndexMax * 10);

        return editScript.reverse();
    }

    return compareArrays;
})();

ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);
(function () {
    // Objective:
    // * Given an input array, a container DOM node, and a function from array elements to arrays of DOM nodes,
    //   map the array elements to arrays of DOM nodes, concatenate together all these arrays, and use them to populate the container DOM node
    // * Next time we're given the same combination of things (with the array possibly having mutated), update the container DOM node
    //   so that its children is again the concatenation of the mappings of the array elements, but don't re-map any array elements that we
    //   previously mapped - retain those nodes, and just insert/delete other ones

    // "callbackAfterAddingNodes" will be invoked after any "mapping"-generated nodes are inserted into the container node
    // You can use this, for example, to activate bindings on those nodes.

    function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {
        // Map this array value inside a dependentObservable so we re-map when any dependency changes
        var mappedNodes = [];
        var dependentObservable = ko.dependentObservable(function() {
            var newMappedNodes = mapping(valueToMap, index, ko.utils.fixUpContinuousNodeArray(mappedNodes, containerNode)) || [];

            // On subsequent evaluations, just replace the previously-inserted DOM nodes
            if (mappedNodes.length > 0) {
                ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
                if (callbackAfterAddingNodes)
                    ko.dependencyDetection.ignore(callbackAfterAddingNodes, null, [valueToMap, newMappedNodes, index]);
            }

            // Replace the contents of the mappedNodes array, thereby updating the record
            // of which nodes would be deleted if valueToMap was itself later removed
            mappedNodes.length = 0;
            ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
        }, null, { disposeWhenNodeIsRemoved: containerNode, disposeWhen: function() { return !ko.utils.anyDomNodeIsAttachedToDocument(mappedNodes); } });
        return { mappedNodes : mappedNodes, dependentObservable : (dependentObservable.isActive() ? dependentObservable : undefined) };
    }

    var lastMappingResultDomDataKey = ko.utils.domData.nextKey();

    ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {
        // Compare the provided array against the previous one
        array = array || [];
        options = options || {};
        var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
        var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
        var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
        var editScript = ko.utils.compareArrays(lastArray, array, options['dontLimitMoves']);

        // Build the new mapping result
        var newMappingResult = [];
        var lastMappingResultIndex = 0;
        var newMappingResultIndex = 0;

        var nodesToDelete = [];
        var itemsToProcess = [];
        var itemsForBeforeRemoveCallbacks = [];
        var itemsForMoveCallbacks = [];
        var itemsForAfterAddCallbacks = [];
        var mapData;

        function itemMovedOrRetained(editScriptIndex, oldPosition) {
            mapData = lastMappingResult[oldPosition];
            if (newMappingResultIndex !== oldPosition)
                itemsForMoveCallbacks[editScriptIndex] = mapData;
            // Since updating the index might change the nodes, do so before calling fixUpContinuousNodeArray
            mapData.indexObservable(newMappingResultIndex++);
            ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode);
            newMappingResult.push(mapData);
            itemsToProcess.push(mapData);
        }

        function callCallback(callback, items) {
            if (callback) {
                for (var i = 0, n = items.length; i < n; i++) {
                    if (items[i]) {
                        ko.utils.arrayForEach(items[i].mappedNodes, function(node) {
                            callback(node, i, items[i].arrayEntry);
                        });
                    }
                }
            }
        }

        for (var i = 0, editScriptItem, movedIndex; editScriptItem = editScript[i]; i++) {
            movedIndex = editScriptItem['moved'];
            switch (editScriptItem['status']) {
                case "deleted":
                    if (movedIndex === undefined) {
                        mapData = lastMappingResult[lastMappingResultIndex];

                        // Stop tracking changes to the mapping for these nodes
                        if (mapData.dependentObservable)
                            mapData.dependentObservable.dispose();

                        // Queue these nodes for later removal
                        nodesToDelete.push.apply(nodesToDelete, ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode));
                        if (options['beforeRemove']) {
                            itemsForBeforeRemoveCallbacks[i] = mapData;
                            itemsToProcess.push(mapData);
                        }
                    }
                    lastMappingResultIndex++;
                    break;

                case "retained":
                    itemMovedOrRetained(i, lastMappingResultIndex++);
                    break;

                case "added":
                    if (movedIndex !== undefined) {
                        itemMovedOrRetained(i, movedIndex);
                    } else {
                        mapData = { arrayEntry: editScriptItem['value'], indexObservable: ko.observable(newMappingResultIndex++) };
                        newMappingResult.push(mapData);
                        itemsToProcess.push(mapData);
                        if (!isFirstExecution)
                            itemsForAfterAddCallbacks[i] = mapData;
                    }
                    break;
            }
        }

        // Call beforeMove first before any changes have been made to the DOM
        callCallback(options['beforeMove'], itemsForMoveCallbacks);

        // Next remove nodes for deleted items (or just clean if there's a beforeRemove callback)
        ko.utils.arrayForEach(nodesToDelete, options['beforeRemove'] ? ko.cleanNode : ko.removeNode);

        // Next add/reorder the remaining items (will include deleted items if there's a beforeRemove callback)
        for (var i = 0, nextNode = ko.virtualElements.firstChild(domNode), lastNode, node; mapData = itemsToProcess[i]; i++) {
            // Get nodes for newly added items
            if (!mapData.mappedNodes)
                ko.utils.extend(mapData, mapNodeAndRefreshWhenChanged(domNode, mapping, mapData.arrayEntry, callbackAfterAddingNodes, mapData.indexObservable));

            // Put nodes in the right place if they aren't there already
            for (var j = 0; node = mapData.mappedNodes[j]; nextNode = node.nextSibling, lastNode = node, j++) {
                if (node !== nextNode)
                    ko.virtualElements.insertAfter(domNode, node, lastNode);
            }

            // Run the callbacks for newly added nodes (for example, to apply bindings, etc.)
            if (!mapData.initialized && callbackAfterAddingNodes) {
                callbackAfterAddingNodes(mapData.arrayEntry, mapData.mappedNodes, mapData.indexObservable);
                mapData.initialized = true;
            }
        }

        // If there's a beforeRemove callback, call it after reordering.
        // Note that we assume that the beforeRemove callback will usually be used to remove the nodes using
        // some sort of animation, which is why we first reorder the nodes that will be removed. If the
        // callback instead removes the nodes right away, it would be more efficient to skip reordering them.
        // Perhaps we'll make that change in the future if this scenario becomes more common.
        callCallback(options['beforeRemove'], itemsForBeforeRemoveCallbacks);

        // Finally call afterMove and afterAdd callbacks
        callCallback(options['afterMove'], itemsForMoveCallbacks);
        callCallback(options['afterAdd'], itemsForAfterAddCallbacks);

        // Store a copy of the array items we just considered so we can difference it next time
        ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
    }
})();

ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
ko.nativeTemplateEngine = function () {
    this['allowTemplateRewriting'] = false;
}

ko.nativeTemplateEngine.prototype = new ko.templateEngine();
ko.nativeTemplateEngine.prototype.constructor = ko.nativeTemplateEngine;
ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
    var useNodesIfAvailable = !(ko.utils.ieVersion < 9), // IE<9 cloneNode doesn't work properly
        templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
        templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

    if (templateNodes) {
        return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
    } else {
        var templateText = templateSource['text']();
        return ko.utils.parseHtmlFragment(templateText);
    }
};

ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
(function() {
    ko.jqueryTmplTemplateEngine = function () {
        // Detect which version of jquery-tmpl you're using. Unfortunately jquery-tmpl
        // doesn't expose a version number, so we have to infer it.
        // Note that as of Knockout 1.3, we only support jQuery.tmpl 1.0.0pre and later,
        // which KO internally refers to as version "2", so older versions are no longer detected.
        var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
            if (!jQueryInstance || !(jQueryInstance['tmpl']))
                return 0;
            // Since it exposes no official version number, we use our own numbering system. To be updated as jquery-tmpl evolves.
            try {
                if (jQueryInstance['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
                    // Since 1.0.0pre, custom tags should append markup to an array called "__"
                    return 2; // Final version of jquery.tmpl
                }
            } catch(ex) { /* Apparently not the version we were looking for */ }

            return 1; // Any older version that we don't support
        })();

        function ensureHasReferencedJQueryTemplates() {
            if (jQueryTmplVersion < 2)
                throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
        }

        function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
            return jQueryInstance['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
        }

        this['renderTemplateSource'] = function(templateSource, bindingContext, options) {
            options = options || {};
            ensureHasReferencedJQueryTemplates();

            // Ensure we have stored a precompiled version of this template (don't want to reparse on every render)
            var precompiled = templateSource['data']('precompiled');
            if (!precompiled) {
                var templateText = templateSource['text']() || "";
                // Wrap in "with($whatever.koBindingContext) { ... }"
                templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

                precompiled = jQueryInstance['template'](null, templateText);
                templateSource['data']('precompiled', precompiled);
            }

            var data = [bindingContext['$data']]; // Prewrap the data in an array to stop jquery.tmpl from trying to unwrap any arrays
            var jQueryTemplateOptions = jQueryInstance['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

            var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
            resultNodes['appendTo'](document.createElement("div")); // Using "appendTo" forces jQuery/jQuery.tmpl to perform necessary cleanup work

            jQueryInstance['fragments'] = {}; // Clear jQuery's fragment cache to avoid a memory leak after a large number of template renders
            return resultNodes;
        };

        this['createJavaScriptEvaluatorBlock'] = function(script) {
            return "{{ko_code ((function() { return " + script + " })()) }}";
        };

        this['addTemplate'] = function(templateName, templateMarkup) {
            document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
        };

        if (jQueryTmplVersion > 0) {
            jQueryInstance['tmpl']['tag']['ko_code'] = {
                open: "__.push($1 || '');"
            };
            jQueryInstance['tmpl']['tag']['ko_with'] = {
                open: "with($1) {",
                close: "} "
            };
        }
    };

    ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();
    ko.jqueryTmplTemplateEngine.prototype.constructor = ko.jqueryTmplTemplateEngine;

    // Use this one by default *only if jquery.tmpl is referenced*
    var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
    if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
        ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

    ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
})();
}));
}());
})();


// Resource Chart.min.js included by net.java.html.charts.Chart
/*
 * #%L
 * charts-api - a library from the "DukeScript" project.
 * %%
 * Copyright (C) 2015 Dukehoff GmbH
 * %%
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * #L%
 */
/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 1.0.2
 *
 * Copyright 2015 Nick Downie
 * Released under the MIT license
 * https://github.com/nnnick/Chart.js/blob/master/LICENSE.md
 */
(function(){"use strict";var t=this,i=t.Chart,e=function(t){this.canvas=t.canvas,this.ctx=t;var i=function(t,i){return t["offset"+i]?t["offset"+i]:document.defaultView.getComputedStyle(t).getPropertyValue(i)},e=this.width=i(t.canvas,"Width")||t.canvas.width,n=this.height=i(t.canvas,"Height")||t.canvas.height;return t.canvas.width=e,t.canvas.height=n,e=this.width=t.canvas.width,n=this.height=t.canvas.height,this.aspectRatio=this.width/this.height,s.retinaScale(this),this};e.defaults={global:{animation:!0,animationSteps:60,animationEasing:"easeOutQuart",showScale:!0,scaleOverride:!1,scaleSteps:null,scaleStepWidth:null,scaleStartValue:null,scaleLineColor:"rgba(0,0,0,.1)",scaleLineWidth:1,scaleShowLabels:!0,scaleLabel:"<%=value%>",scaleIntegersOnly:!0,scaleBeginAtZero:!1,scaleFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",scaleFontSize:12,scaleFontStyle:"normal",scaleFontColor:"#666",responsive:!1,maintainAspectRatio:!0,showTooltips:!0,customTooltips:!1,tooltipEvents:["mousemove","touchstart","touchmove","mouseout"],tooltipFillColor:"rgba(0,0,0,0.8)",tooltipFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",tooltipFontSize:14,tooltipFontStyle:"normal",tooltipFontColor:"#fff",tooltipTitleFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",tooltipTitleFontSize:14,tooltipTitleFontStyle:"bold",tooltipTitleFontColor:"#fff",tooltipTitleTemplate:"<%= label%>",tooltipYPadding:6,tooltipXPadding:6,tooltipCaretSize:8,tooltipCornerRadius:6,tooltipXOffset:10,tooltipTemplate:"<%if (label){%><%=label%>: <%}%><%= value %>",multiTooltipTemplate:"<%= value %>",multiTooltipKeyBackground:"#fff",onAnimationProgress:function(){},onAnimationComplete:function(){}}},e.types={};var s=e.helpers={},n=s.each=function(t,i,e){var s=Array.prototype.slice.call(arguments,3);if(t)if(t.length===+t.length){var n;for(n=0;n<t.length;n++)i.apply(e,[t[n],n].concat(s))}else for(var o in t)i.apply(e,[t[o],o].concat(s))},o=s.clone=function(t){var i={};return n(t,function(e,s){t.hasOwnProperty(s)&&(i[s]=e)}),i},a=s.extend=function(t){return n(Array.prototype.slice.call(arguments,1),function(i){n(i,function(e,s){i.hasOwnProperty(s)&&(t[s]=e)})}),t},h=s.merge=function(t,i){var e=Array.prototype.slice.call(arguments,0);return e.unshift({}),a.apply(null,e)},l=s.indexOf=function(t,i){if(Array.prototype.indexOf)return t.indexOf(i);for(var e=0;e<t.length;e++)if(t[e]===i)return e;return-1},r=(s.where=function(t,i){var e=[];return s.each(t,function(t){i(t)&&e.push(t)}),e},s.findNextWhere=function(t,i,e){e||(e=-1);for(var s=e+1;s<t.length;s++){var n=t[s];if(i(n))return n}},s.findPreviousWhere=function(t,i,e){e||(e=t.length);for(var s=e-1;s>=0;s--){var n=t[s];if(i(n))return n}},s.inherits=function(t){var i=this,e=t&&t.hasOwnProperty("constructor")?t.constructor:function(){return i.apply(this,arguments)},s=function(){this.constructor=e};return s.prototype=i.prototype,e.prototype=new s,e.extend=r,t&&a(e.prototype,t),e.__super__=i.prototype,e}),c=s.noop=function(){},u=s.uid=function(){var t=0;return function(){return"chart-"+t++}}(),d=s.warn=function(t){window.console&&"function"==typeof window.console.warn&&console.warn(t)},p=s.amd="function"==typeof define&&define.amd,f=s.isNumber=function(t){return!isNaN(parseFloat(t))&&isFinite(t)},g=s.max=function(t){return Math.max.apply(Math,t)},m=s.min=function(t){return Math.min.apply(Math,t)},v=(s.cap=function(t,i,e){if(f(i)){if(t>i)return i}else if(f(e)&&e>t)return e;return t},s.getDecimalPlaces=function(t){if(t%1!==0&&f(t)){var i=t.toString();if(i.indexOf("e-")<0)return i.split(".")[1].length;if(i.indexOf(".")<0)return parseInt(i.split("e-")[1]);var e=i.split(".")[1].split("e-");return e[0].length+parseInt(e[1])}return 0}),S=s.radians=function(t){return t*(Math.PI/180)},x=(s.getAngleFromPoint=function(t,i){var e=i.x-t.x,s=i.y-t.y,n=Math.sqrt(e*e+s*s),o=2*Math.PI+Math.atan2(s,e);return 0>e&&0>s&&(o+=2*Math.PI),{angle:o,distance:n}},s.aliasPixel=function(t){return t%2===0?0:.5}),y=(s.splineCurve=function(t,i,e,s){var n=Math.sqrt(Math.pow(i.x-t.x,2)+Math.pow(i.y-t.y,2)),o=Math.sqrt(Math.pow(e.x-i.x,2)+Math.pow(e.y-i.y,2)),a=s*n/(n+o),h=s*o/(n+o);return{inner:{x:i.x-a*(e.x-t.x),y:i.y-a*(e.y-t.y)},outer:{x:i.x+h*(e.x-t.x),y:i.y+h*(e.y-t.y)}}},s.calculateOrderOfMagnitude=function(t){return Math.floor(Math.log(t)/Math.LN10)}),C=(s.calculateScaleRange=function(t,i,e,s,n){var o=2,a=Math.floor(i/(1.5*e)),h=o>=a,l=g(t),r=m(t);l===r&&(l+=.5,r>=.5&&!s?r-=.5:l+=.5);for(var c=Math.abs(l-r),u=y(c),d=Math.ceil(l/(1*Math.pow(10,u)))*Math.pow(10,u),p=s?0:Math.floor(r/(1*Math.pow(10,u)))*Math.pow(10,u),f=d-p,v=Math.pow(10,u),S=Math.round(f/v);(S>a||a>2*S)&&!h;)if(S>a)v*=2,S=Math.round(f/v),S%1!==0&&(h=!0);else if(n&&u>=0){if(v/2%1!==0)break;v/=2,S=Math.round(f/v)}else v/=2,S=Math.round(f/v);return h&&(S=o,v=f/S),{steps:S,stepValue:v,min:p,max:p+S*v}},s.template=function(t,i){function e(t,i){var e=/\W/.test(t)?new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+t.replace(/[\r\t\n]/g," ").split("<%").join("	").replace(/((^|%>)[^\t]*)'/g,"$1\r").replace(/\t=(.*?)%>/g,"',$1,'").split("	").join("');").split("%>").join("p.push('").split("\r").join("\\'")+"');}return p.join('');"):s[t]=s[t];return i?e(i):e}if(t instanceof Function)return t(i);var s={};return e(t,i)}),b=(s.generateLabels=function(t,i,e,s){var o=new Array(i);return t&&n(o,function(i,n){o[n]=C(t,{value:e+s*(n+1)})}),o},s.easingEffects={linear:function(t){return t},easeInQuad:function(t){return t*t},easeOutQuad:function(t){return-1*t*(t-2)},easeInOutQuad:function(t){return(t/=.5)<1?.5*t*t:-0.5*(--t*(t-2)-1)},easeInCubic:function(t){return t*t*t},easeOutCubic:function(t){return 1*((t=t/1-1)*t*t+1)},easeInOutCubic:function(t){return(t/=.5)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},easeInQuart:function(t){return t*t*t*t},easeOutQuart:function(t){return-1*((t=t/1-1)*t*t*t-1)},easeInOutQuart:function(t){return(t/=.5)<1?.5*t*t*t*t:-0.5*((t-=2)*t*t*t-2)},easeInQuint:function(t){return 1*(t/=1)*t*t*t*t},easeOutQuint:function(t){return 1*((t=t/1-1)*t*t*t*t+1)},easeInOutQuint:function(t){return(t/=.5)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},easeInSine:function(t){return-1*Math.cos(t/1*(Math.PI/2))+1},easeOutSine:function(t){return 1*Math.sin(t/1*(Math.PI/2))},easeInOutSine:function(t){return-0.5*(Math.cos(Math.PI*t/1)-1)},easeInExpo:function(t){return 0===t?1:1*Math.pow(2,10*(t/1-1))},easeOutExpo:function(t){return 1===t?1:1*(-Math.pow(2,-10*t/1)+1)},easeInOutExpo:function(t){return 0===t?0:1===t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(-Math.pow(2,-10*--t)+2)},easeInCirc:function(t){return t>=1?t:-1*(Math.sqrt(1-(t/=1)*t)-1)},easeOutCirc:function(t){return 1*Math.sqrt(1-(t=t/1-1)*t)},easeInOutCirc:function(t){return(t/=.5)<1?-0.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},easeInElastic:function(t){var i=1.70158,e=0,s=1;return 0===t?0:1==(t/=1)?1:(e||(e=.3),s<Math.abs(1)?(s=1,i=e/4):i=e/(2*Math.PI)*Math.asin(1/s),-(s*Math.pow(2,10*(t-=1))*Math.sin((1*t-i)*(2*Math.PI)/e)))},easeOutElastic:function(t){var i=1.70158,e=0,s=1;return 0===t?0:1==(t/=1)?1:(e||(e=.3),s<Math.abs(1)?(s=1,i=e/4):i=e/(2*Math.PI)*Math.asin(1/s),s*Math.pow(2,-10*t)*Math.sin((1*t-i)*(2*Math.PI)/e)+1)},easeInOutElastic:function(t){var i=1.70158,e=0,s=1;return 0===t?0:2==(t/=.5)?1:(e||(e=1*(.3*1.5)),s<Math.abs(1)?(s=1,i=e/4):i=e/(2*Math.PI)*Math.asin(1/s),1>t?-.5*(s*Math.pow(2,10*(t-=1))*Math.sin((1*t-i)*(2*Math.PI)/e)):s*Math.pow(2,-10*(t-=1))*Math.sin((1*t-i)*(2*Math.PI)/e)*.5+1)},easeInBack:function(t){var i=1.70158;return 1*(t/=1)*t*((i+1)*t-i)},easeOutBack:function(t){var i=1.70158;return 1*((t=t/1-1)*t*((i+1)*t+i)+1)},easeInOutBack:function(t){var i=1.70158;return(t/=.5)<1?.5*(t*t*(((i*=1.525)+1)*t-i)):.5*((t-=2)*t*(((i*=1.525)+1)*t+i)+2)},easeInBounce:function(t){return 1-b.easeOutBounce(1-t)},easeOutBounce:function(t){return(t/=1)<1/2.75?1*(7.5625*t*t):2/2.75>t?1*(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1*(7.5625*(t-=2.25/2.75)*t+.9375):1*(7.5625*(t-=2.625/2.75)*t+.984375)},easeInOutBounce:function(t){return.5>t?.5*b.easeInBounce(2*t):.5*b.easeOutBounce(2*t-1)+.5}}),w=s.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,1e3/60)}}(),P=(s.cancelAnimFrame=function(){return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame||function(t){return window.clearTimeout(t,1e3/60)}}(),s.animationLoop=function(t,i,e,s,n,o){var a=0,h=b[e]||b.linear,l=function(){a++;var e=a/i,r=h(e);t.call(o,r,e,a),s.call(o,r,e),i>a?o.animationFrame=w(l):n.apply(o)};w(l)},s.getRelativePosition=function(t){var i,e,s=t.originalEvent||t,n=t.currentTarget||t.srcElement,o=n.getBoundingClientRect();return s.touches?(i=s.touches[0].clientX-o.left,e=s.touches[0].clientY-o.top):(i=s.clientX-o.left,e=s.clientY-o.top),{x:i,y:e}},s.addEvent=function(t,i,e){t.addEventListener?t.addEventListener(i,e):t.attachEvent?t.attachEvent("on"+i,e):t["on"+i]=e}),L=s.removeEvent=function(t,i,e){t.removeEventListener?t.removeEventListener(i,e,!1):t.detachEvent?t.detachEvent("on"+i,e):t["on"+i]=c},k=(s.bindEvents=function(t,i,e){t.events||(t.events={}),n(i,function(i){t.events[i]=function(){e.apply(t,arguments)},P(t.chart.canvas,i,t.events[i])})},s.unbindEvents=function(t,i){n(i,function(i,e){L(t.chart.canvas,e,i)})}),F=s.getMaximumWidth=function(t){var i=t.parentNode,e=parseInt(R(i,"padding-left"))+parseInt(R(i,"padding-right"));return i.clientWidth-e},A=s.getMaximumHeight=function(t){var i=t.parentNode,e=parseInt(R(i,"padding-bottom"))+parseInt(R(i,"padding-top"));return i.clientHeight-e},R=s.getStyle=function(t,i){return t.currentStyle?t.currentStyle[i]:document.defaultView.getComputedStyle(t,null).getPropertyValue(i)},T=(s.getMaximumSize=s.getMaximumWidth,s.retinaScale=function(t){var i=t.ctx,e=t.canvas.width,s=t.canvas.height;window.devicePixelRatio&&(i.canvas.style.width=e+"px",i.canvas.style.height=s+"px",i.canvas.height=s*window.devicePixelRatio,i.canvas.width=e*window.devicePixelRatio,i.scale(window.devicePixelRatio,window.devicePixelRatio))}),W=s.clear=function(t){t.ctx.clearRect(0,0,t.width,t.height)},M=s.fontString=function(t,i,e){return i+" "+t+"px "+e},z=s.longestText=function(t,i,e){t.font=i;var s=0;return n(e,function(i){var e=t.measureText(i).width;s=e>s?e:s}),s},O=s.drawRoundedRectangle=function(t,i,e,s,n,o){t.beginPath(),t.moveTo(i+o,e),t.lineTo(i+s-o,e),t.quadraticCurveTo(i+s,e,i+s,e+o),t.lineTo(i+s,e+n-o),t.quadraticCurveTo(i+s,e+n,i+s-o,e+n),t.lineTo(i+o,e+n),t.quadraticCurveTo(i,e+n,i,e+n-o),t.lineTo(i,e+o),t.quadraticCurveTo(i,e,i+o,e),t.closePath()};e.instances={},e.Type=function(t,i,s){this.options=i,this.chart=s,this.id=u(),e.instances[this.id]=this,i.responsive&&this.resize(),this.initialize.call(this,t)},a(e.Type.prototype,{initialize:function(){return this},clear:function(){return W(this.chart),this},stop:function(){return e.animationService.cancelAnimation(this),this},resize:function(t){this.stop();var i=this.chart.canvas,e=F(this.chart.canvas),s=this.options.maintainAspectRatio?e/this.chart.aspectRatio:A(this.chart.canvas);return i.width=this.chart.width=e,i.height=this.chart.height=s,T(this.chart),"function"==typeof t&&t.apply(this,Array.prototype.slice.call(arguments,1)),this},reflow:c,render:function(t){if(t&&this.reflow(),this.options.animation&&!t){var i=new e.Animation;i.numSteps=this.options.animationSteps,i.easing=this.options.animationEasing,i.render=function(t,i){var e=s.easingEffects[i.easing],n=i.currentStep/i.numSteps,o=e(n);t.draw(o,n,i.currentStep)},i.onAnimationProgress=this.options.onAnimationProgress,i.onAnimationComplete=this.options.onAnimationComplete,e.animationService.addAnimation(this,i)}else this.draw(),this.options.onAnimationComplete.call(this);return this},generateLegend:function(){return C(this.options.legendTemplate,this)},destroy:function(){this.clear(),k(this,this.events);var t=this.chart.canvas;t.width=this.chart.width,t.height=this.chart.height,t.style.removeProperty?(t.style.removeProperty("width"),t.style.removeProperty("height")):(t.style.removeAttribute("width"),t.style.removeAttribute("height")),delete e.instances[this.id]},showTooltip:function(t,i){"undefined"==typeof this.activeElements&&(this.activeElements=[]);var o=function(t){var i=!1;return t.length!==this.activeElements.length?i=!0:(n(t,function(t,e){t!==this.activeElements[e]&&(i=!0)},this),i)}.call(this,t);if(o||i){if(this.activeElements=t,this.draw(),this.options.customTooltips&&this.options.customTooltips(!1),t.length>0)if(this.datasets&&this.datasets.length>1){for(var a,h,r=this.datasets.length-1;r>=0&&(a=this.datasets[r].points||this.datasets[r].bars||this.datasets[r].segments,h=l(a,t[0]),-1===h);r--);var c=[],u=[],d=function(t){var i,e,n,o,a,l=[],r=[],d=[];return s.each(this.datasets,function(t){i=t.points||t.bars||t.segments,i[h]&&i[h].hasValue()&&l.push(i[h])}),s.each(l,function(t){r.push(t.x),d.push(t.y),c.push(s.template(this.options.multiTooltipTemplate,t)),u.push({fill:t._saved.fillColor||t.fillColor,stroke:t._saved.strokeColor||t.strokeColor})},this),a=m(d),n=g(d),o=m(r),e=g(r),{x:o>this.chart.width/2?o:e,y:(a+n)/2}}.call(this,h);new e.MultiTooltip({x:d.x,y:d.y,xPadding:this.options.tooltipXPadding,yPadding:this.options.tooltipYPadding,xOffset:this.options.tooltipXOffset,fillColor:this.options.tooltipFillColor,textColor:this.options.tooltipFontColor,fontFamily:this.options.tooltipFontFamily,fontStyle:this.options.tooltipFontStyle,fontSize:this.options.tooltipFontSize,titleTextColor:this.options.tooltipTitleFontColor,titleFontFamily:this.options.tooltipTitleFontFamily,titleFontStyle:this.options.tooltipTitleFontStyle,titleFontSize:this.options.tooltipTitleFontSize,cornerRadius:this.options.tooltipCornerRadius,labels:c,legendColors:u,legendColorBackground:this.options.multiTooltipKeyBackground,title:C(this.options.tooltipTitleTemplate,t[0]),chart:this.chart,ctx:this.chart.ctx,custom:this.options.customTooltips}).draw()}else n(t,function(t){var i=t.tooltipPosition();new e.Tooltip({x:Math.round(i.x),y:Math.round(i.y),xPadding:this.options.tooltipXPadding,yPadding:this.options.tooltipYPadding,fillColor:this.options.tooltipFillColor,textColor:this.options.tooltipFontColor,fontFamily:this.options.tooltipFontFamily,fontStyle:this.options.tooltipFontStyle,fontSize:this.options.tooltipFontSize,caretHeight:this.options.tooltipCaretSize,cornerRadius:this.options.tooltipCornerRadius,text:C(this.options.tooltipTemplate,t),chart:this.chart,custom:this.options.customTooltips}).draw()},this);return this}},toBase64Image:function(){return this.chart.canvas.toDataURL.apply(this.chart.canvas,arguments)}}),e.Type.extend=function(t){var i=this,s=function(){return i.apply(this,arguments)};if(s.prototype=o(i.prototype),a(s.prototype,t),s.extend=e.Type.extend,t.name||i.prototype.name){var n=t.name||i.prototype.name,l=e.defaults[i.prototype.name]?o(e.defaults[i.prototype.name]):{};e.defaults[n]=a(l,t.defaults),e.types[n]=s,e.prototype[n]=function(t,i){var o=h(e.defaults.global,e.defaults[n],i||{});return new s(t,o,this)}}else d("Name not provided for this chart, so it hasn't been registered");return i},e.Element=function(t){a(this,t),this.initialize.apply(this,arguments),this.save()},a(e.Element.prototype,{initialize:function(){},restore:function(t){return t?n(t,function(t){this[t]=this._saved[t]},this):a(this,this._saved),this},save:function(){return this._saved=o(this),delete this._saved._saved,this},update:function(t){return n(t,function(t,i){this._saved[i]=this[i],this[i]=t},this),this},transition:function(t,i){return n(t,function(t,e){this[e]=(t-this._saved[e])*i+this._saved[e]},this),this},tooltipPosition:function(){return{x:this.x,y:this.y}},hasValue:function(){return f(this.value)}}),e.Element.extend=r,e.Point=e.Element.extend({display:!0,inRange:function(t,i){var e=this.hitDetectionRadius+this.radius;return Math.pow(t-this.x,2)+Math.pow(i-this.y,2)<Math.pow(e,2)},draw:function(){if(this.display){var t=this.ctx;t.beginPath(),t.arc(this.x,this.y,this.radius,0,2*Math.PI),t.closePath(),t.strokeStyle=this.strokeColor,t.lineWidth=this.strokeWidth,t.fillStyle=this.fillColor,t.fill(),t.stroke()}}}),e.Arc=e.Element.extend({inRange:function(t,i){var e=s.getAngleFromPoint(this,{x:t,y:i}),n=e.angle>=this.startAngle&&e.angle<=this.endAngle,o=e.distance>=this.innerRadius&&e.distance<=this.outerRadius;return n&&o},tooltipPosition:function(){var t=this.startAngle+(this.endAngle-this.startAngle)/2,i=(this.outerRadius-this.innerRadius)/2+this.innerRadius;return{x:this.x+Math.cos(t)*i,y:this.y+Math.sin(t)*i}},draw:function(t){var i=this.ctx;i.beginPath(),i.arc(this.x,this.y,this.outerRadius,this.startAngle,this.endAngle),i.arc(this.x,this.y,this.innerRadius,this.endAngle,this.startAngle,!0),i.closePath(),i.strokeStyle=this.strokeColor,i.lineWidth=this.strokeWidth,i.fillStyle=this.fillColor,i.fill(),i.lineJoin="bevel",this.showStroke&&i.stroke()}}),e.Rectangle=e.Element.extend({draw:function(){var t=this.ctx,i=this.width/2,e=this.x-i,s=this.x+i,n=this.base-(this.base-this.y),o=this.strokeWidth/2;this.showStroke&&(e+=o,s-=o,n+=o),t.beginPath(),t.fillStyle=this.fillColor,t.strokeStyle=this.strokeColor,t.lineWidth=this.strokeWidth,t.moveTo(e,this.base),t.lineTo(e,n),t.lineTo(s,n),t.lineTo(s,this.base),t.fill(),this.showStroke&&t.stroke()},height:function(){return this.base-this.y},inRange:function(t,i){return t>=this.x-this.width/2&&t<=this.x+this.width/2&&i>=this.y&&i<=this.base}}),e.Animation=e.Element.extend({currentStep:null,numSteps:60,easing:"",render:null,onAnimationProgress:null,onAnimationComplete:null}),e.Tooltip=e.Element.extend({draw:function(){var t=this.chart.ctx;t.font=M(this.fontSize,this.fontStyle,this.fontFamily),this.xAlign="center",this.yAlign="above";var i=this.caretPadding=2,e=t.measureText(this.text).width+2*this.xPadding,s=this.fontSize+2*this.yPadding,n=s+this.caretHeight+i;this.x+e/2>this.chart.width?this.xAlign="left":this.x-e/2<0&&(this.xAlign="right"),this.y-n<0&&(this.yAlign="below");var o=this.x-e/2,a=this.y-n;if(t.fillStyle=this.fillColor,this.custom)this.custom(this);else{switch(this.yAlign){case"above":t.beginPath(),t.moveTo(this.x,this.y-i),t.lineTo(this.x+this.caretHeight,this.y-(i+this.caretHeight)),t.lineTo(this.x-this.caretHeight,this.y-(i+this.caretHeight)),t.closePath(),t.fill();break;case"below":a=this.y+i+this.caretHeight,t.beginPath(),t.moveTo(this.x,this.y+i),t.lineTo(this.x+this.caretHeight,this.y+i+this.caretHeight),t.lineTo(this.x-this.caretHeight,this.y+i+this.caretHeight),t.closePath(),t.fill()}switch(this.xAlign){case"left":o=this.x-e+(this.cornerRadius+this.caretHeight);break;case"right":o=this.x-(this.cornerRadius+this.caretHeight)}O(t,o,a,e,s,this.cornerRadius),t.fill(),t.fillStyle=this.textColor,t.textAlign="center",t.textBaseline="middle",t.fillText(this.text,o+e/2,a+s/2)}}}),e.MultiTooltip=e.Element.extend({initialize:function(){this.font=M(this.fontSize,this.fontStyle,this.fontFamily),this.titleFont=M(this.titleFontSize,this.titleFontStyle,this.titleFontFamily),this.height=this.labels.length*this.fontSize+(this.labels.length-1)*(this.fontSize/2)+2*this.yPadding+1.5*this.titleFontSize,this.ctx.font=this.titleFont;var t=this.ctx.measureText(this.title).width,i=z(this.ctx,this.font,this.labels)+this.fontSize+3,e=g([i,t]);this.width=e+2*this.xPadding;var s=this.height/2;this.y-s<0?this.y=s:this.y+s>this.chart.height&&(this.y=this.chart.height-s),this.x>this.chart.width/2?this.x-=this.xOffset+this.width:this.x+=this.xOffset},getLineHeight:function(t){var i=this.y-this.height/2+this.yPadding,e=t-1;return 0===t?i+this.titleFontSize/2:i+(1.5*this.fontSize*e+this.fontSize/2)+1.5*this.titleFontSize},draw:function(){if(this.custom)this.custom(this);else{O(this.ctx,this.x,this.y-this.height/2,this.width,this.height,this.cornerRadius);var t=this.ctx;t.fillStyle=this.fillColor,t.fill(),t.closePath(),t.textAlign="left",t.textBaseline="middle",t.fillStyle=this.titleTextColor,t.font=this.titleFont,t.fillText(this.title,this.x+this.xPadding,this.getLineHeight(0)),t.font=this.font,s.each(this.labels,function(i,e){t.fillStyle=this.textColor,t.fillText(i,this.x+this.xPadding+this.fontSize+3,this.getLineHeight(e+1)),t.fillStyle=this.legendColorBackground,t.fillRect(this.x+this.xPadding,this.getLineHeight(e+1)-this.fontSize/2,this.fontSize,this.fontSize),t.fillStyle=this.legendColors[e].fill,t.fillRect(this.x+this.xPadding,this.getLineHeight(e+1)-this.fontSize/2,this.fontSize,this.fontSize)},this)}}}),e.Scale=e.Element.extend({initialize:function(){this.fit()},buildYLabels:function(){this.yLabels=[];for(var t=v(this.stepValue),i=0;i<=this.steps;i++)this.yLabels.push(C(this.templateString,{value:(this.min+i*this.stepValue).toFixed(t)}));this.yLabelWidth=this.display&&this.showLabels?z(this.ctx,this.font,this.yLabels)+10:0},addXLabel:function(t){this.xLabels.push(t),this.valuesCount++,this.fit()},removeXLabel:function(){this.xLabels.shift(),this.valuesCount--,this.fit()},fit:function(){this.startPoint=this.display?this.fontSize:0,this.endPoint=this.display?this.height-1.5*this.fontSize-5:this.height,this.startPoint+=this.padding,this.endPoint-=this.padding;var t,i=this.endPoint,e=this.endPoint-this.startPoint;for(this.calculateYRange(e),this.buildYLabels(),this.calculateXLabelRotation();e>this.endPoint-this.startPoint;)e=this.endPoint-this.startPoint,t=this.yLabelWidth,this.calculateYRange(e),this.buildYLabels(),t<this.yLabelWidth&&(this.endPoint=i,this.calculateXLabelRotation())},calculateXLabelRotation:function(){this.ctx.font=this.font;var t,i,e=this.ctx.measureText(this.xLabels[0]).width,s=this.ctx.measureText(this.xLabels[this.xLabels.length-1]).width;if(this.xScalePaddingRight=s/2+3,this.xScalePaddingLeft=e/2>this.yLabelWidth?e/2:this.yLabelWidth,this.xLabelRotation=0,this.display){var n,o=z(this.ctx,this.font,this.xLabels);this.xLabelWidth=o;for(var a=Math.floor(this.calculateX(1)-this.calculateX(0))-6;this.xLabelWidth>a&&0===this.xLabelRotation||this.xLabelWidth>a&&this.xLabelRotation<=90&&this.xLabelRotation>0;)n=Math.cos(S(this.xLabelRotation)),t=n*e,i=n*s,t+this.fontSize/2>this.yLabelWidth&&(this.xScalePaddingLeft=t+this.fontSize/2),this.xScalePaddingRight=this.fontSize/2,this.xLabelRotation++,this.xLabelWidth=n*o;this.xLabelRotation>0&&(this.endPoint-=Math.sin(S(this.xLabelRotation))*o+3)}else this.xLabelWidth=0,this.xScalePaddingRight=this.padding,this.xScalePaddingLeft=this.padding},calculateYRange:c,drawingArea:function(){return this.startPoint-this.endPoint},calculateY:function(t){var i=this.drawingArea()/(this.min-this.max);return this.endPoint-i*(t-this.min)},calculateX:function(t){var i=(this.xLabelRotation>0,this.width-(this.xScalePaddingLeft+this.xScalePaddingRight)),e=i/Math.max(this.valuesCount-(this.offsetGridLines?0:1),1),s=e*t+this.xScalePaddingLeft;return this.offsetGridLines&&(s+=e/2),Math.round(s)},update:function(t){s.extend(this,t),this.fit()},draw:function(){var t=this.ctx,i=(this.endPoint-this.startPoint)/this.steps,e=Math.round(this.xScalePaddingLeft);this.display&&(t.fillStyle=this.textColor,t.font=this.font,n(this.yLabels,function(n,o){var a=this.endPoint-i*o,h=Math.round(a),l=this.showHorizontalLines;t.textAlign="right",t.textBaseline="middle",this.showLabels&&t.fillText(n,e-10,a),0!==o||l||(l=!0),l&&t.beginPath(),o>0?(t.lineWidth=this.gridLineWidth,t.strokeStyle=this.gridLineColor):(t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor),h+=s.aliasPixel(t.lineWidth),l&&(t.moveTo(e,h),t.lineTo(this.width,h),t.stroke(),t.closePath()),t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor,t.beginPath(),t.moveTo(e-5,h),t.lineTo(e,h),t.stroke(),t.closePath()},this),n(this.xLabels,function(i,e){var s=this.calculateX(e)+x(this.lineWidth),n=this.calculateX(e-(this.offsetGridLines?.5:0))+x(this.lineWidth),o=this.xLabelRotation>0,a=this.showVerticalLines;0!==e||a||(a=!0),a&&t.beginPath(),e>0?(t.lineWidth=this.gridLineWidth,t.strokeStyle=this.gridLineColor):(t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor),a&&(t.moveTo(n,this.endPoint),t.lineTo(n,this.startPoint-3),t.stroke(),t.closePath()),t.lineWidth=this.lineWidth,t.strokeStyle=this.lineColor,t.beginPath(),t.moveTo(n,this.endPoint),t.lineTo(n,this.endPoint+5),t.stroke(),t.closePath(),t.save(),t.translate(s,o?this.endPoint+12:this.endPoint+8),t.rotate(-1*S(this.xLabelRotation)),t.font=this.font,t.textAlign=o?"right":"center",t.textBaseline=o?"middle":"top",t.fillText(i,0,0),t.restore()},this))}}),e.RadialScale=e.Element.extend({initialize:function(){this.size=m([this.height,this.width]),this.drawingArea=this.display?this.size/2-(this.fontSize/2+this.backdropPaddingY):this.size/2},calculateCenterOffset:function(t){var i=this.drawingArea/(this.max-this.min);return(t-this.min)*i},update:function(){this.lineArc?this.drawingArea=this.display?this.size/2-(this.fontSize/2+this.backdropPaddingY):this.size/2:this.setScaleSize(),this.buildYLabels()},buildYLabels:function(){this.yLabels=[];for(var t=v(this.stepValue),i=0;i<=this.steps;i++)this.yLabels.push(C(this.templateString,{value:(this.min+i*this.stepValue).toFixed(t)}))},getCircumference:function(){return 2*Math.PI/this.valuesCount},setScaleSize:function(){var t,i,e,s,n,o,a,h,l,r,c,u,d=m([this.height/2-this.pointLabelFontSize-5,this.width/2]),p=this.width,g=0;for(this.ctx.font=M(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily),i=0;i<this.valuesCount;i++)t=this.getPointPosition(i,d),e=this.ctx.measureText(C(this.templateString,{value:this.labels[i]})).width+5,0===i||i===this.valuesCount/2?(s=e/2,t.x+s>p&&(p=t.x+s,n=i),t.x-s<g&&(g=t.x-s,a=i)):i<this.valuesCount/2?t.x+e>p&&(p=t.x+e,n=i):i>this.valuesCount/2&&t.x-e<g&&(g=t.x-e,a=i);l=g,r=Math.ceil(p-this.width),o=this.getIndexAngle(n),h=this.getIndexAngle(a),c=r/Math.sin(o+Math.PI/2),u=l/Math.sin(h+Math.PI/2),c=f(c)?c:0,u=f(u)?u:0,this.drawingArea=d-(u+c)/2,this.setCenterPoint(u,c)},setCenterPoint:function(t,i){var e=this.width-i-this.drawingArea,s=t+this.drawingArea;this.xCenter=(s+e)/2,this.yCenter=this.height/2},getIndexAngle:function(t){var i=2*Math.PI/this.valuesCount;return t*i-Math.PI/2},getPointPosition:function(t,i){var e=this.getIndexAngle(t);return{x:Math.cos(e)*i+this.xCenter,y:Math.sin(e)*i+this.yCenter}},draw:function(){if(this.display){var t=this.ctx;if(n(this.yLabels,function(i,e){if(e>0){var s,n=e*(this.drawingArea/this.steps),o=this.yCenter-n;if(this.lineWidth>0)if(t.strokeStyle=this.lineColor,t.lineWidth=this.lineWidth,this.lineArc)t.beginPath(),t.arc(this.xCenter,this.yCenter,n,0,2*Math.PI),t.closePath(),t.stroke();else{t.beginPath();for(var a=0;a<this.valuesCount;a++)s=this.getPointPosition(a,this.calculateCenterOffset(this.min+e*this.stepValue)),0===a?t.moveTo(s.x,s.y):t.lineTo(s.x,s.y);t.closePath(),t.stroke()}if(this.showLabels){if(t.font=M(this.fontSize,this.fontStyle,this.fontFamily),this.showLabelBackdrop){var h=t.measureText(i).width;t.fillStyle=this.backdropColor,t.fillRect(this.xCenter-h/2-this.backdropPaddingX,o-this.fontSize/2-this.backdropPaddingY,h+2*this.backdropPaddingX,this.fontSize+2*this.backdropPaddingY)}t.textAlign="center",t.textBaseline="middle",t.fillStyle=this.fontColor,t.fillText(i,this.xCenter,o)}}},this),!this.lineArc){t.lineWidth=this.angleLineWidth,t.strokeStyle=this.angleLineColor;for(var i=this.valuesCount-1;i>=0;i--){var e=null,s=null;if(this.angleLineWidth>0&&(e=this.calculateCenterOffset(this.max),s=this.getPointPosition(i,e),t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(s.x,s.y),t.stroke(),t.closePath()),this.backgroundColors&&this.backgroundColors.length==this.valuesCount){null==e&&(e=this.calculateCenterOffset(this.max)),null==s&&(s=this.getPointPosition(i,e));var o=this.getPointPosition(0===i?this.valuesCount-1:i-1,e),a=this.getPointPosition(i===this.valuesCount-1?0:i+1,e),h={x:(o.x+s.x)/2,y:(o.y+s.y)/2},l={x:(s.x+a.x)/2,y:(s.y+a.y)/2};t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(h.x,h.y),t.lineTo(s.x,s.y),t.lineTo(l.x,l.y),t.fillStyle=this.backgroundColors[i],t.fill(),t.closePath()}var r=this.getPointPosition(i,this.calculateCenterOffset(this.max)+5);t.font=M(this.pointLabelFontSize,this.pointLabelFontStyle,this.pointLabelFontFamily),t.fillStyle=this.pointLabelFontColor;var c=this.labels.length,u=this.labels.length/2,d=u/2,p=d>i||i>c-d,f=i===d||i===c-d;0===i?t.textAlign="center":i===u?t.textAlign="center":u>i?t.textAlign="left":t.textAlign="right",f?t.textBaseline="middle":p?t.textBaseline="bottom":t.textBaseline="top",t.fillText(this.labels[i],r.x,r.y)}}}}}),e.animationService={frameDuration:17,animations:[],dropFrames:0,addAnimation:function(t,i){for(var e=0;e<this.animations.length;++e)if(this.animations[e].chartInstance===t)return void(this.animations[e].animationObject=i);this.animations.push({chartInstance:t,animationObject:i}),1==this.animations.length&&s.requestAnimFrame.call(window,this.digestWrapper)},cancelAnimation:function(t){var i=s.findNextWhere(this.animations,function(i){return i.chartInstance===t});i&&this.animations.splice(i,1)},digestWrapper:function(){e.animationService.startDigest.call(e.animationService)},startDigest:function(){var t=Date.now(),i=0;this.dropFrames>1&&(i=Math.floor(this.dropFrames),this.dropFrames-=i);for(var e=0;e<this.animations.length;e++)null===this.animations[e].animationObject.currentStep&&(this.animations[e].animationObject.currentStep=0),this.animations[e].animationObject.currentStep+=1+i,this.animations[e].animationObject.currentStep>this.animations[e].animationObject.numSteps&&(this.animations[e].animationObject.currentStep=this.animations[e].animationObject.numSteps),this.animations[e].animationObject.render(this.animations[e].chartInstance,this.animations[e].animationObject),this.animations[e].animationObject.currentStep==this.animations[e].animationObject.numSteps&&(this.animations.splice(e,1),e--);var n=Date.now(),o=n-t-this.frameDuration,a=o/this.frameDuration;a>1&&(this.dropFrames+=a),this.animations.length>0&&s.requestAnimFrame.call(window,this.digestWrapper)}},s.addEvent(window,"resize",function(){var t;return function(){clearTimeout(t),t=setTimeout(function(){n(e.instances,function(t){t.options.responsive&&t.resize(t.render,!0)})},50)}}()),p?define(function(){return e}):"object"==typeof module&&module.exports&&(module.exports=e),t.Chart=e,e.noConflict=function(){return t.Chart=i,e}}).call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={scaleBeginAtZero:!0,scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,scaleShowHorizontalLines:!0,scaleShowVerticalLines:!0,barShowStroke:!0,barStrokeWidth:2,barValueSpacing:5,barDatasetSpacing:1,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].fillColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>'};i.Type.extend({name:"Bar",defaults:s,initialize:function(t){var s=this.options;this.ScaleClass=i.Scale.extend({offsetGridLines:!0,calculateBarX:function(t,i,e){var n=this.calculateBaseWidth(),o=this.calculateX(e)-n/2,a=this.calculateBarWidth(t);return o+a*i+i*s.barDatasetSpacing+a/2},calculateBaseWidth:function(){return this.calculateX(1)-this.calculateX(0)-2*s.barValueSpacing},calculateBarWidth:function(t){var i=this.calculateBaseWidth()-(t-1)*s.barDatasetSpacing;return i/t}}),this.datasets=[],this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getBarsAtEvent(t):[];this.eachBars(function(t){t.restore(["fillColor","strokeColor"])}),e.each(i,function(t){t.fillColor=t.highlightFill,t.strokeColor=t.highlightStroke}),this.showTooltip(i)}),this.BarClass=i.Rectangle.extend({strokeWidth:this.options.barStrokeWidth,showStroke:this.options.barShowStroke,ctx:this.chart.ctx}),e.each(t.datasets,function(i,s){var n={label:i.label||null,fillColor:i.fillColor,
strokeColor:i.strokeColor,bars:[]};this.datasets.push(n),e.each(i.data,function(e,s){n.bars.push(new this.BarClass({value:e,label:t.labels[s],datasetLabel:i.label,strokeColor:i.strokeColor,fillColor:i.fillColor,highlightFill:i.highlightFill||i.fillColor,highlightStroke:i.highlightStroke||i.strokeColor}))},this)},this),this.buildScale(t.labels),this.BarClass.prototype.base=this.scale.endPoint,this.eachBars(function(t,i,s){e.extend(t,{width:this.scale.calculateBarWidth(this.datasets.length),x:this.scale.calculateBarX(this.datasets.length,s,i),y:this.scale.endPoint}),t.save()},this),this.render()},update:function(){this.scale.update(),e.each(this.activeElements,function(t){t.restore(["fillColor","strokeColor"])}),this.eachBars(function(t){t.save()}),this.render()},eachBars:function(t){e.each(this.datasets,function(i,s){e.each(i.bars,t,this,s)},this)},getBarsAtEvent:function(t){for(var i,s=[],n=e.getRelativePosition(t),o=function(t){s.push(t.bars[i])},a=0;a<this.datasets.length;a++)for(i=0;i<this.datasets[a].bars.length;i++)if(this.datasets[a].bars[i].inRange(n.x,n.y))return e.each(this.datasets,o),s;return s},buildScale:function(t){var i=this,s=function(){var t=[];return i.eachBars(function(i){t.push(i.value)}),t},n={templateString:this.options.scaleLabel,height:this.chart.height,width:this.chart.width,ctx:this.chart.ctx,textColor:this.options.scaleFontColor,fontSize:this.options.scaleFontSize,fontStyle:this.options.scaleFontStyle,fontFamily:this.options.scaleFontFamily,valuesCount:t.length,beginAtZero:this.options.scaleBeginAtZero,integersOnly:this.options.scaleIntegersOnly,calculateYRange:function(t){var i=e.calculateScaleRange(s(),t,this.fontSize,this.beginAtZero,this.integersOnly);e.extend(this,i)},xLabels:t,font:e.fontString(this.options.scaleFontSize,this.options.scaleFontStyle,this.options.scaleFontFamily),lineWidth:this.options.scaleLineWidth,lineColor:this.options.scaleLineColor,showHorizontalLines:this.options.scaleShowHorizontalLines,showVerticalLines:this.options.scaleShowVerticalLines,gridLineWidth:this.options.scaleShowGridLines?this.options.scaleGridLineWidth:0,gridLineColor:this.options.scaleShowGridLines?this.options.scaleGridLineColor:"rgba(0,0,0,0)",padding:this.options.showScale?0:this.options.barShowStroke?this.options.barStrokeWidth:0,showLabels:this.options.scaleShowLabels,display:this.options.showScale};this.options.scaleOverride&&e.extend(n,{calculateYRange:e.noop,steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}),this.scale=new this.ScaleClass(n)},addData:function(t,i){e.each(t,function(t,e){this.datasets[e].bars.push(new this.BarClass({value:t,label:i,datasetLabel:this.datasets[e].label,x:this.scale.calculateBarX(this.datasets.length,e,this.scale.valuesCount+1),y:this.scale.endPoint,width:this.scale.calculateBarWidth(this.datasets.length),base:this.scale.endPoint,strokeColor:this.datasets[e].strokeColor,fillColor:this.datasets[e].fillColor}))},this),this.scale.addXLabel(i),this.update()},removeData:function(){this.scale.removeXLabel(),e.each(this.datasets,function(t){t.bars.shift()},this),this.update()},reflow:function(){e.extend(this.BarClass.prototype,{y:this.scale.endPoint,base:this.scale.endPoint});var t=e.extend({height:this.chart.height,width:this.chart.width});this.scale.update(t)},draw:function(t){var i=t||1;this.clear();this.chart.ctx;this.scale.draw(i),e.each(this.datasets,function(t,s){e.each(t.bars,function(t,e){t.hasValue()&&(t.base=this.scale.endPoint,t.transition({x:this.scale.calculateBarX(this.datasets.length,s,e),y:this.scale.calculateY(t.value),width:this.scale.calculateBarWidth(this.datasets.length)},i).draw())},this)},this)}})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,percentageInnerCutout:50,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>'};i.Type.extend({name:"Doughnut",defaults:s,initialize:function(t){this.segments=[],this.outerRadius=(e.min([this.chart.width,this.chart.height])-this.options.segmentStrokeWidth/2)/2,this.SegmentArc=i.Arc.extend({ctx:this.chart.ctx,x:this.chart.width/2,y:this.chart.height/2}),this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getSegmentsAtEvent(t):[];e.each(this.segments,function(t){t.restore(["fillColor"])}),e.each(i,function(t){t.fillColor=t.highlightColor}),this.showTooltip(i)}),this.calculateTotal(t),e.each(t,function(i,e){i.color||(i.color="hsl("+360*e/t.length+", 100%, 50%)"),this.addData(i,e,!0)},this),this.render()},getSegmentsAtEvent:function(t){var i=[],s=e.getRelativePosition(t);return e.each(this.segments,function(t){t.inRange(s.x,s.y)&&i.push(t)},this),i},addData:function(t,i,e){var s=void 0!==i?i:this.segments.length;this.segments.splice(s,0,new this.SegmentArc({value:t.value,outerRadius:this.options.animateScale?0:this.outerRadius,innerRadius:this.options.animateScale?0:this.outerRadius/100*this.options.percentageInnerCutout,fillColor:t.color,highlightColor:t.highlight||t.color,showStroke:this.options.segmentShowStroke,strokeWidth:this.options.segmentStrokeWidth,strokeColor:this.options.segmentStrokeColor,startAngle:1.5*Math.PI,circumference:this.options.animateRotate?0:this.calculateCircumference(t.value),label:t.label})),e||(this.reflow(),this.update())},calculateCircumference:function(t){return this.total>0?2*Math.PI*(t/this.total):0},calculateTotal:function(t){this.total=0,e.each(t,function(t){this.total+=Math.abs(t.value)},this)},update:function(){this.calculateTotal(this.segments),e.each(this.activeElements,function(t){t.restore(["fillColor"])}),e.each(this.segments,function(t){t.save()}),this.render()},removeData:function(t){var i=e.isNumber(t)?t:this.segments.length-1;this.segments.splice(i,1),this.reflow(),this.update()},reflow:function(){e.extend(this.SegmentArc.prototype,{x:this.chart.width/2,y:this.chart.height/2}),this.outerRadius=(e.min([this.chart.width,this.chart.height])-this.options.segmentStrokeWidth/2)/2,e.each(this.segments,function(t){t.update({outerRadius:this.outerRadius,innerRadius:this.outerRadius/100*this.options.percentageInnerCutout})},this)},draw:function(t){var i=t?t:1;this.clear(),e.each(this.segments,function(t,e){t.transition({circumference:this.calculateCircumference(t.value),outerRadius:this.outerRadius,innerRadius:this.outerRadius/100*this.options.percentageInnerCutout},i),t.endAngle=t.startAngle+t.circumference,t.draw(),0===e&&(t.startAngle=1.5*Math.PI),e<this.segments.length-1&&(this.segments[e+1].startAngle=t.endAngle)},this)}}),i.types.Doughnut.extend({name:"Pie",defaults:e.merge(s,{percentageInnerCutout:0})})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={scaleShowGridLines:!0,scaleGridLineColor:"rgba(0,0,0,.05)",scaleGridLineWidth:1,scaleShowHorizontalLines:!0,scaleShowVerticalLines:!0,bezierCurve:!0,bezierCurveTension:.4,pointDot:!0,pointDotRadius:4,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>',offsetGridLines:!1};i.Type.extend({name:"Line",defaults:s,initialize:function(t){this.PointClass=i.Point.extend({offsetGridLines:this.options.offsetGridLines,strokeWidth:this.options.pointDotStrokeWidth,radius:this.options.pointDotRadius,display:this.options.pointDot,hitDetectionRadius:this.options.pointHitDetectionRadius,ctx:this.chart.ctx,inRange:function(t){return Math.pow(t-this.x,2)<Math.pow(this.radius+this.hitDetectionRadius,2)}}),this.datasets=[],this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getPointsAtEvent(t):[];this.eachPoints(function(t){t.restore(["fillColor","strokeColor"])}),e.each(i,function(t){t.fillColor=t.highlightFill,t.strokeColor=t.highlightStroke}),this.showTooltip(i)}),e.each(t.datasets,function(i){var s={label:i.label||null,fillColor:i.fillColor,strokeColor:i.strokeColor,pointColor:i.pointColor,pointStrokeColor:i.pointStrokeColor,points:[]};this.datasets.push(s),e.each(i.data,function(e,n){s.points.push(new this.PointClass({value:e,label:t.labels[n],datasetLabel:i.label,strokeColor:i.pointStrokeColor,fillColor:i.pointColor,highlightFill:i.pointHighlightFill||i.pointColor,highlightStroke:i.pointHighlightStroke||i.pointStrokeColor}))},this),this.buildScale(t.labels),this.eachPoints(function(t,i){e.extend(t,{x:this.scale.calculateX(i),y:this.scale.endPoint}),t.save()},this)},this),this.render()},update:function(){this.scale.update(),e.each(this.activeElements,function(t){t.restore(["fillColor","strokeColor"])}),this.eachPoints(function(t){t.save()}),this.render()},eachPoints:function(t){e.each(this.datasets,function(i){e.each(i.points,t,this)},this)},getPointsAtEvent:function(t){var i=[],s=e.getRelativePosition(t);return e.each(this.datasets,function(t){e.each(t.points,function(t){t.inRange(s.x,s.y)&&i.push(t)})},this),i},buildScale:function(t){var s=this,n=function(){var t=[];return s.eachPoints(function(i){t.push(i.value)}),t},o={templateString:this.options.scaleLabel,height:this.chart.height,width:this.chart.width,ctx:this.chart.ctx,textColor:this.options.scaleFontColor,offsetGridLines:this.options.offsetGridLines,fontSize:this.options.scaleFontSize,fontStyle:this.options.scaleFontStyle,fontFamily:this.options.scaleFontFamily,valuesCount:t.length,beginAtZero:this.options.scaleBeginAtZero,integersOnly:this.options.scaleIntegersOnly,calculateYRange:function(t){var i=e.calculateScaleRange(n(),t,this.fontSize,this.beginAtZero,this.integersOnly);e.extend(this,i)},xLabels:t,font:e.fontString(this.options.scaleFontSize,this.options.scaleFontStyle,this.options.scaleFontFamily),lineWidth:this.options.scaleLineWidth,lineColor:this.options.scaleLineColor,showHorizontalLines:this.options.scaleShowHorizontalLines,showVerticalLines:this.options.scaleShowVerticalLines,gridLineWidth:this.options.scaleShowGridLines?this.options.scaleGridLineWidth:0,gridLineColor:this.options.scaleShowGridLines?this.options.scaleGridLineColor:"rgba(0,0,0,0)",padding:this.options.showScale?0:this.options.pointDotRadius+this.options.pointDotStrokeWidth,showLabels:this.options.scaleShowLabels,display:this.options.showScale};this.options.scaleOverride&&e.extend(o,{calculateYRange:e.noop,steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}),this.scale=new i.Scale(o)},addData:function(t,i){e.each(t,function(t,e){this.datasets[e].points.push(new this.PointClass({value:t,label:i,datasetLabel:this.datasets[e].label,x:this.scale.calculateX(this.scale.valuesCount+1),y:this.scale.endPoint,strokeColor:this.datasets[e].pointStrokeColor,fillColor:this.datasets[e].pointColor}))},this),this.scale.addXLabel(i),this.update()},removeData:function(){this.scale.removeXLabel(),e.each(this.datasets,function(t){t.points.shift()},this),this.update()},reflow:function(){var t=e.extend({height:this.chart.height,width:this.chart.width});this.scale.update(t)},draw:function(t){var i=t||1;this.clear();var s=this.chart.ctx,n=function(t){return null!==t.value},o=function(t,i,s){return e.findNextWhere(i,n,s)||t},a=function(t,i,s){return e.findPreviousWhere(i,n,s)||t};this.scale&&(this.scale.draw(i),e.each(this.datasets,function(t){var h=e.where(t.points,n);e.each(t.points,function(t,e){t.hasValue()&&t.transition({y:this.scale.calculateY(t.value),x:this.scale.calculateX(e)},i)},this),this.options.bezierCurve&&e.each(h,function(t,i){var s=i>0&&i<h.length-1?this.options.bezierCurveTension:0;t.controlPoints=e.splineCurve(a(t,h,i),t,o(t,h,i),s),t.controlPoints.outer.y>this.scale.endPoint?t.controlPoints.outer.y=this.scale.endPoint:t.controlPoints.outer.y<this.scale.startPoint&&(t.controlPoints.outer.y=this.scale.startPoint),t.controlPoints.inner.y>this.scale.endPoint?t.controlPoints.inner.y=this.scale.endPoint:t.controlPoints.inner.y<this.scale.startPoint&&(t.controlPoints.inner.y=this.scale.startPoint)},this),s.lineWidth=this.options.datasetStrokeWidth,s.strokeStyle=t.strokeColor,s.beginPath(),e.each(h,function(t,i){if(0===i)s.moveTo(t.x,t.y);else if(this.options.bezierCurve){var e=a(t,h,i);s.bezierCurveTo(e.controlPoints.outer.x,e.controlPoints.outer.y,t.controlPoints.inner.x,t.controlPoints.inner.y,t.x,t.y)}else s.lineTo(t.x,t.y)},this),this.options.datasetStroke&&s.stroke(),this.options.datasetFill&&h.length>0&&(s.lineTo(h[h.length-1].x,this.scale.endPoint),s.lineTo(h[0].x,this.scale.endPoint),s.fillStyle=t.fillColor,s.closePath(),s.fill()),e.each(h,function(t){t.draw()})},this))}})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers,s={scaleShowLabelBackdrop:!0,scaleBackdropColor:"rgba(255,255,255,0.75)",scaleBeginAtZero:!0,scaleBackdropPaddingY:2,scaleBackdropPaddingX:2,scaleShowLine:!0,segmentShowStroke:!0,segmentStrokeColor:"#fff",segmentStrokeWidth:2,animationSteps:100,animationEasing:"easeOutBounce",animateRotate:!0,animateScale:!1,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"><%if(segments[i].label){%><%=segments[i].label%><%}%></span></li><%}%></ul>'};i.Type.extend({name:"PolarArea",defaults:s,initialize:function(t){this.segments=[],this.SegmentArc=i.Arc.extend({showStroke:this.options.segmentShowStroke,strokeWidth:this.options.segmentStrokeWidth,strokeColor:this.options.segmentStrokeColor,ctx:this.chart.ctx,innerRadius:0,x:this.chart.width/2,y:this.chart.height/2}),this.scale=new i.RadialScale({display:this.options.showScale,fontStyle:this.options.scaleFontStyle,fontSize:this.options.scaleFontSize,fontFamily:this.options.scaleFontFamily,fontColor:this.options.scaleFontColor,showLabels:this.options.scaleShowLabels,showLabelBackdrop:this.options.scaleShowLabelBackdrop,backdropColor:this.options.scaleBackdropColor,backdropPaddingY:this.options.scaleBackdropPaddingY,backdropPaddingX:this.options.scaleBackdropPaddingX,lineWidth:this.options.scaleShowLine?this.options.scaleLineWidth:0,lineColor:this.options.scaleLineColor,lineArc:!0,width:this.chart.width,height:this.chart.height,xCenter:this.chart.width/2,yCenter:this.chart.height/2,ctx:this.chart.ctx,templateString:this.options.scaleLabel,valuesCount:t.length}),this.updateScaleRange(t),this.scale.update(),e.each(t,function(t,i){this.addData(t,i,!0)},this),this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getSegmentsAtEvent(t):[];e.each(this.segments,function(t){t.restore(["fillColor"])}),e.each(i,function(t){t.fillColor=t.highlightColor}),this.showTooltip(i)}),this.render()},getSegmentsAtEvent:function(t){var i=[],s=e.getRelativePosition(t);return e.each(this.segments,function(t){t.inRange(s.x,s.y)&&i.push(t)},this),i},addData:function(t,i,e){var s=i||this.segments.length;this.segments.splice(s,0,new this.SegmentArc({fillColor:t.color,highlightColor:t.highlight||t.color,label:t.label,value:t.value,outerRadius:this.options.animateScale?0:this.scale.calculateCenterOffset(t.value),circumference:this.options.animateRotate?0:this.scale.getCircumference(),startAngle:1.5*Math.PI})),e||(this.reflow(),this.update())},removeData:function(t){var i=e.isNumber(t)?t:this.segments.length-1;this.segments.splice(i,1),this.reflow(),this.update()},calculateTotal:function(t){this.total=0,e.each(t,function(t){this.total+=t.value},this),this.scale.valuesCount=this.segments.length},updateScaleRange:function(t){var i=[];e.each(t,function(t){i.push(t.value)});var s=this.options.scaleOverride?{steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}:e.calculateScaleRange(i,e.min([this.chart.width,this.chart.height])/2,this.options.scaleFontSize,this.options.scaleBeginAtZero,this.options.scaleIntegersOnly);e.extend(this.scale,s,{size:e.min([this.chart.width,this.chart.height]),xCenter:this.chart.width/2,yCenter:this.chart.height/2})},update:function(){this.calculateTotal(this.segments),e.each(this.segments,function(t){t.save()}),this.reflow(),this.render()},reflow:function(){e.extend(this.SegmentArc.prototype,{x:this.chart.width/2,y:this.chart.height/2}),this.updateScaleRange(this.segments),this.scale.update(),e.extend(this.scale,{xCenter:this.chart.width/2,yCenter:this.chart.height/2}),e.each(this.segments,function(t){t.update({outerRadius:this.scale.calculateCenterOffset(t.value)})},this)},draw:function(t){var i=t||1;this.clear(),e.each(this.segments,function(t,e){t.transition({circumference:this.scale.getCircumference(),outerRadius:this.scale.calculateCenterOffset(t.value)},i),t.endAngle=t.startAngle+t.circumference,0===e&&(t.startAngle=1.5*Math.PI),e<this.segments.length-1&&(this.segments[e+1].startAngle=t.endAngle),t.draw()},this),this.scale.draw()}})}.call(this),function(){"use strict";var t=this,i=t.Chart,e=i.helpers;i.Type.extend({name:"Radar",defaults:{scaleShowLine:!0,angleShowLineOut:!0,scaleShowLabels:!1,scaleBeginAtZero:!0,angleLineColor:"rgba(0,0,0,.1)",angleLineWidth:1,pointLabelFontFamily:"'Arial'",pointLabelFontStyle:"normal",pointLabelFontSize:10,pointLabelFontColor:"#666",pointDot:!0,pointDotRadius:3,pointDotStrokeWidth:1,pointHitDetectionRadius:20,datasetStroke:!0,datasetStrokeWidth:2,datasetFill:!0,legendTemplate:'<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<datasets.length; i++){%><li><span style="background-color:<%=datasets[i].strokeColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span></li><%}%></ul>'},initialize:function(t){this.PointClass=i.Point.extend({strokeWidth:this.options.pointDotStrokeWidth,radius:this.options.pointDotRadius,display:this.options.pointDot,hitDetectionRadius:this.options.pointHitDetectionRadius,ctx:this.chart.ctx}),this.datasets=[],this.buildScale(t),this.options.showTooltips&&e.bindEvents(this,this.options.tooltipEvents,function(t){var i="mouseout"!==t.type?this.getPointsAtEvent(t):[];this.eachPoints(function(t){t.restore(["fillColor","strokeColor"])}),e.each(i,function(t){t.fillColor=t.highlightFill,t.strokeColor=t.highlightStroke}),this.showTooltip(i)}),e.each(t.datasets,function(i){var s={label:i.label||null,fillColor:i.fillColor,strokeColor:i.strokeColor,pointColor:i.pointColor,pointStrokeColor:i.pointStrokeColor,points:[]};this.datasets.push(s),e.each(i.data,function(e,n){var o;this.scale.animation||(o=this.scale.getPointPosition(n,this.scale.calculateCenterOffset(e))),s.points.push(new this.PointClass({value:e,label:t.labels[n],datasetLabel:i.label,x:this.options.animation?this.scale.xCenter:o.x,y:this.options.animation?this.scale.yCenter:o.y,strokeColor:i.pointStrokeColor,fillColor:i.pointColor,highlightFill:i.pointHighlightFill||i.pointColor,highlightStroke:i.pointHighlightStroke||i.pointStrokeColor}))},this)},this),this.render()},eachPoints:function(t){e.each(this.datasets,function(i){e.each(i.points,t,this)},this)},getPointsAtEvent:function(t){var i=e.getRelativePosition(t),s=e.getAngleFromPoint({x:this.scale.xCenter,y:this.scale.yCenter},i),n=2*Math.PI/this.scale.valuesCount,o=Math.round((s.angle-1.5*Math.PI)/n),a=[];return(o>=this.scale.valuesCount||0>o)&&(o=0),s.distance<=this.scale.drawingArea&&e.each(this.datasets,function(t){a.push(t.points[o])}),a},buildScale:function(t){this.scale=new i.RadialScale({display:this.options.showScale,fontStyle:this.options.scaleFontStyle,fontSize:this.options.scaleFontSize,fontFamily:this.options.scaleFontFamily,fontColor:this.options.scaleFontColor,showLabels:this.options.scaleShowLabels,showLabelBackdrop:this.options.scaleShowLabelBackdrop,backdropColor:this.options.scaleBackdropColor,backgroundColors:this.options.scaleBackgroundColors,backdropPaddingY:this.options.scaleBackdropPaddingY,backdropPaddingX:this.options.scaleBackdropPaddingX,lineWidth:this.options.scaleShowLine?this.options.scaleLineWidth:0,lineColor:this.options.scaleLineColor,angleLineColor:this.options.angleLineColor,angleLineWidth:this.options.angleShowLineOut?this.options.angleLineWidth:0,pointLabelFontColor:this.options.pointLabelFontColor,pointLabelFontSize:this.options.pointLabelFontSize,pointLabelFontFamily:this.options.pointLabelFontFamily,pointLabelFontStyle:this.options.pointLabelFontStyle,height:this.chart.height,width:this.chart.width,xCenter:this.chart.width/2,yCenter:this.chart.height/2,ctx:this.chart.ctx,templateString:this.options.scaleLabel,labels:t.labels,valuesCount:t.datasets[0].data.length}),this.scale.setScaleSize(),this.updateScaleRange(t.datasets),this.scale.buildYLabels()},updateScaleRange:function(t){var i=function(){var i=[];return e.each(t,function(t){t.data?i=i.concat(t.data):e.each(t.points,function(t){i.push(t.value)})}),i}(),s=this.options.scaleOverride?{steps:this.options.scaleSteps,stepValue:this.options.scaleStepWidth,min:this.options.scaleStartValue,max:this.options.scaleStartValue+this.options.scaleSteps*this.options.scaleStepWidth}:e.calculateScaleRange(i,e.min([this.chart.width,this.chart.height])/2,this.options.scaleFontSize,this.options.scaleBeginAtZero,this.options.scaleIntegersOnly);e.extend(this.scale,s)},addData:function(t,i){this.scale.valuesCount++,e.each(t,function(t,e){var s=this.scale.getPointPosition(this.scale.valuesCount,this.scale.calculateCenterOffset(t));this.datasets[e].points.push(new this.PointClass({value:t,label:i,datasetLabel:this.datasets[e].label,x:s.x,y:s.y,strokeColor:this.datasets[e].pointStrokeColor,fillColor:this.datasets[e].pointColor}))},this),this.scale.labels.push(i),this.reflow(),this.update()},removeData:function(){this.scale.valuesCount--,this.scale.labels.shift(),e.each(this.datasets,function(t){t.points.shift()},this),this.reflow(),this.update()},update:function(){this.eachPoints(function(t){t.save()}),this.reflow(),this.render()},reflow:function(){e.extend(this.scale,{width:this.chart.width,height:this.chart.height,size:e.min([this.chart.width,this.chart.height]),xCenter:this.chart.width/2,yCenter:this.chart.height/2}),this.updateScaleRange(this.datasets),this.scale.setScaleSize(),this.scale.buildYLabels()},draw:function(t){var i=t||1,s=this.chart.ctx;this.clear(),this.scale.draw(),e.each(this.datasets,function(t){e.each(t.points,function(t,e){t.hasValue()&&t.transition(this.scale.getPointPosition(e,this.scale.calculateCenterOffset(t.value)),i)},this),s.lineWidth=this.options.datasetStrokeWidth,s.strokeStyle=t.strokeColor,s.beginPath(),e.each(t.points,function(t,i){0===i?s.moveTo(t.x,t.y):s.lineTo(t.x,t.y)},this),s.closePath(),s.stroke(),s.fillStyle=t.fillColor,this.options.datasetFill&&s.fill(),e.each(t.points,function(t){t.hasValue()&&t.draw()})},this)}})}.call(this);

// TeaVM generated classes
/*
 *  Copyright 2013 Alexey Andreev.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
"use strict";
var $rt_lastObjectId = 0;
function $rt_nextId() {
    return $rt_lastObjectId++;
}
function $rt_compare(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}
function $rt_isInstance(obj, cls) {
    return obj !== null && !!obj.constructor.$meta && $rt_isAssignable(obj.constructor, cls);
}
function $rt_isAssignable(from, to) {
    if (from === to) {
        return true;
    }
    var supertypes = from.$meta.supertypes;
    for (var i = 0; i < supertypes.length; i = (i + 1) | 0) {
        if ($rt_isAssignable(supertypes[i], to)) {
            return true;
        }
    }
    return false;
}
function $rt_createArray(cls, sz) {
    var data = new Array(sz);
    var arr = new ($rt_arraycls(cls))(data);
    for (var i = 0; i < sz; i = (i + 1) | 0) {
        data[i] = null;
    }
    return arr;
}
function $rt_wrapArray(cls, data) {
    var arr = new ($rt_arraycls(cls))(data);
    return arr;
}
function $rt_createUnfilledArray(cls, sz) {
    return new ($rt_arraycls(cls))(new Array(sz));
}
function $rt_createLongArray(sz) {
    var data = new Array(sz);
    var arr = new ($rt_arraycls($rt_longcls()))(data);
    for (var i = 0; i < sz; i = (i + 1) | 0) {
        data[i] = Long_ZERO;
    }
    return arr;
}
var $rt_createNumericArray;
var $rt_createCharArray;
var $rt_createByteArray;
var $rt_createShortArray;
var $rt_createIntArray;
var $rt_createBooleanArray;
var $rt_createFloatArray;
var $rt_createDoubleArray;
if (ArrayBuffer) {
    $rt_createNumericArray = function(cls, nativeArray) {
        return new ($rt_arraycls(cls))(nativeArray);
    };
    $rt_createCharArray = function(sz) {
        return $rt_createNumericArray($rt_charcls(), new Uint16Array(new ArrayBuffer(sz << 1)), 0);
    };
    $rt_createByteArray = function(sz) {
        return $rt_createNumericArray($rt_bytecls(), new Int8Array(new ArrayBuffer(sz)), 0);
    };
    $rt_createShortArray = function(sz) {
        return $rt_createNumericArray($rt_shortcls(), new Int16Array(new ArrayBuffer(sz << 1)), 0);
    };
    $rt_createIntArray = function(sz) {
        return $rt_createNumericArray($rt_intcls(), new Int32Array(new ArrayBuffer(sz << 2)), 0);
    };
    $rt_createBooleanArray = function(sz) {
        return $rt_createNumericArray($rt_booleancls(), new Int8Array(new ArrayBuffer(sz)), 0);
    };
    $rt_createFloatArray = function(sz) {
        return $rt_createNumericArray($rt_floatcls(), new Float32Array(new ArrayBuffer(sz << 2)), 0);
    };
    $rt_createDoubleArray = function(sz) {
        return $rt_createNumericArray($rt_doublecls(), new Float64Array(new ArrayBuffer(sz << 3)), 0);
    };
} else {
    $rt_createNumericArray = function(cls, sz) {
      var data = new Array(sz);
      var arr = new ($rt_arraycls(cls))(data);
      for (var i = 0; i < sz; i = (i + 1) | 0) {
          data[i] = 0;
      }
      return arr;
    }
    $rt_createByteArray = function(sz) { return $rt_createNumericArray($rt_bytecls(), sz); }
    $rt_createShortArray = function(sz) { return $rt_createNumericArray($rt_shortcls(), sz); }
    $rt_createIntArray = function(sz) { return $rt_createNumericArray($rt_intcls(), sz); }
    $rt_createBooleanArray = function(sz) { return $rt_createNumericArray($rt_booleancls(), sz); }
    $rt_createFloatArray = function(sz) { return $rt_createNumericArray($rt_floatcls(), sz); }
    $rt_createDoubleArray = function(sz) { return $rt_createNumericArray($rt_doublecls(), sz); }
    $rt_createCharArray = function(sz) { return $rt_createNumericArray($rt_charcls(), sz); }
}
function $rt_arraycls(cls) {
    if (typeof cls.$array === 'undefined') {
        var arraycls = function(data) {
            this.data = data;
            this.$id = $rt_nextId();
        };
        arraycls.prototype = new ($rt_objcls())();
        arraycls.prototype.constructor = arraycls;
        arraycls.prototype.toString = function() {
            var str = "[";
            for (var i = 0; i < this.data.length; ++i) {
                if (i > 0) {
                    str += ", ";
                }
                str += this.data[i].toString();
            }
            str += "]";
            return str;
        }
        var name = "[" + cls.$meta.binaryName;
        arraycls.$meta = { item : cls, supertypes : [$rt_objcls()], primitive : false, superclass : $rt_objcls(),
                name : name, binaryName : name, enum : false };
        arraycls.classObject = null;
        cls.$array = arraycls;
    }
    return cls.$array;
}
function $rt_createcls() {
    return {
        classObject : null,
        $meta : {
            supertypes : [],
            superclass : null
        }
    };
}
function $rt_createPrimitiveCls(name, binaryName) {
    var cls = $rt_createcls();
    cls.$meta.primitive = true;
    cls.$meta.name = name;
    cls.$meta.binaryName = binaryName;
    cls.$meta.enum = false;
    cls.$meta.item = null;
    return cls;
}
var $rt_booleanclsCache = null;
function $rt_booleancls() {
    if ($rt_booleanclsCache === null) {
        $rt_booleanclsCache = $rt_createPrimitiveCls("boolean", "Z");
    }
    return $rt_booleanclsCache;
}
var $rt_charclsCache = null;
function $rt_charcls() {
    if ($rt_charclsCache === null) {
        $rt_charclsCache = $rt_createPrimitiveCls("char", "C");
    }
    return $rt_charclsCache;
}
var $rt_byteclsCache = null;
function $rt_bytecls() {
    if ($rt_byteclsCache === null) {
        $rt_byteclsCache = $rt_createPrimitiveCls("byte", "B");
    }
    return $rt_byteclsCache;
}
var $rt_shortclsCache = null;
function $rt_shortcls() {
    if ($rt_shortclsCache === null) {
        $rt_shortclsCache = $rt_createPrimitiveCls("short", "S");
    }
    return $rt_shortclsCache;
}
var $rt_intclsCache = null;
function $rt_intcls() {
    if ($rt_intclsCache === null) {
        $rt_intclsCache = $rt_createPrimitiveCls("int", "I");
    }
    return $rt_intclsCache;
}
var $rt_longclsCache = null;
function $rt_longcls() {
    if ($rt_longclsCache === null) {
        $rt_longclsCache = $rt_createPrimitiveCls("long", "J");
    }
    return $rt_longclsCache;
}
var $rt_floatclsCache = null;
function $rt_floatcls() {
    if ($rt_floatclsCache === null) {
        $rt_floatclsCache = $rt_createPrimitiveCls("float", "F");
    }
    return $rt_floatclsCache;
}
var $rt_doubleclsCache = null;
function $rt_doublecls() {
    if ($rt_doubleclsCache === null) {
        $rt_doubleclsCache = $rt_createPrimitiveCls("double", "D");
    }
    return $rt_doubleclsCache;
}
var $rt_voidclsCache = null;
function $rt_voidcls() {
    if ($rt_voidclsCache === null) {
        $rt_voidclsCache = $rt_createPrimitiveCls("void", "V");
    }
    return $rt_voidclsCache;
}
function $rt_init(cls, constructor, args) {
    var obj = new cls();
    cls.prototype[constructor].apply(obj, args);
    return obj;
}
function $rt_throw(ex) {
    throw $rt_exception(ex);
}
function $rt_exception(ex) {
    var err = ex.$jsException;
    if (!err) {
        var err = new Error("Java exception thrown");
        err.$javaException = ex;
        ex.$jsException = err;
    }
    return err;
}
function $rt_createMultiArray(cls, dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions));
    var firstDim = dimensions[0] | 0;
    for (var i = 0 | 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createArray(cls, firstDim);
    }
    return $rt_createMultiArrayImpl(cls, arrays, dimensions);
}
function $rt_createByteMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions));
    var firstDim = dimensions[0] | 0;
    for (var i = 0 | 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createByteArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_bytecls(), arrays, dimensions);
}
function $rt_createCharMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions));
    var firstDim = dimensions[0] | 0;
    for (var i = 0 | 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createCharArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_charcls(), arrays, dimensions);
}
function $rt_createBooleanMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions));
    var firstDim = dimensions[0] | 0;
    for (var i = 0 | 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createBooleanArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_booleancls(), arrays, dimensions);
}
function $rt_createShortMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions));
    var firstDim = dimensions[0] | 0;
    for (var i = 0 | 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createShortArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_shortcls(), arrays, dimensions);
}
function $rt_createIntMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions));
    var firstDim = dimensions[0] | 0;
    for (var i = 0 | 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createIntArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_intcls(), arrays, dimensions);
}
function $rt_createLongMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions));
    var firstDim = dimensions[0] | 0;
    for (var i = 0 | 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createLongArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_longcls(), arrays, dimensions);
}
function $rt_createFloatMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions));
    var firstDim = dimensions[0] | 0;
    for (var i = 0 | 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createFloatArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_floatcls(), arrays, dimensions);
}
function $rt_createDoubleMultiArray(dimensions) {
    var arrays = new Array($rt_primitiveArrayCount(dimensions));
    var firstDim = dimensions[0] | 0;
    for (var i = 0 | 0; i < arrays.length; i = (i + 1) | 0) {
        arrays[i] = $rt_createDoubleArray(firstDim);
    }
    return $rt_createMultiArrayImpl($rt_doublecls(), arrays, dimensions);
}
function $rt_primitiveArrayCount(dimensions) {
    var val = dimensions[1] | 0;
    for (var i = 2 | 0; i < dimensions.length; i = (i + 1) | 0) {
        val = (val * (dimensions[i] | 0)) | 0;
    }
    return val;
}
function $rt_createMultiArrayImpl(cls, arrays, dimensions) {
    var limit = arrays.length;
    for (var i = 1 | 0; i < dimensions.length; i = (i + 1) | 0) {
        cls = $rt_arraycls(cls);
        var dim = dimensions[i];
        var index = 0;
        var packedIndex = 0;
        while (index < limit) {
            var arr = $rt_createUnfilledArray(cls, dim);
            for (var j = 0; j < dim; j = (j + 1) | 0) {
                arr.data[j] = arrays[index];
                index = (index + 1) | 0;
            }
            arrays[packedIndex] = arr;
            packedIndex = (packedIndex + 1) | 0;
        }
        limit = packedIndex;
    }
    return arrays[0];
}
function $rt_assertNotNaN(value) {
    if (typeof value === 'number' && isNaN(value)) {
        throw "NaN";
    }
    return value;
}
var $rt_stdoutBuffer = "";
function $rt_putStdout(ch) {
    if (ch == 0xA) {
        if (console) {
            console.info($rt_stdoutBuffer);
        }
        $rt_stdoutBuffer = "";
    } else {
        $rt_stdoutBuffer += String.fromCharCode(ch);
    }
}
var $rt_stderrBuffer = "";
function $rt_putStderr(ch) {
    if (ch == 0xA) {
        if (console) {
            console.info($rt_stderrBuffer);
        }
        $rt_stderrBuffer = "";
    } else {
        $rt_stderrBuffer += String.fromCharCode(ch);
    }
}
function $rt_metadata(data) {
    for (var i = 0; i < data.length; i += 8) {
        var cls = data[i + 0];
        cls.$meta = {};
        var m = cls.$meta;
        m.name = data[i + 1];
        m.binaryName = "L" + m.name + ";";
        var superclass = data[i + 2];
        m.superclass = superclass !== 0 ? superclass : null;
        m.supertypes = data[i + 3];
        if (m.superclass) {
            m.supertypes.push(m.superclass);
            cls.prototype = new m.superclass();
        } else {
            cls.prototype = new Object();
        }
        var flags = data[i + 4];
        m.enum = (flags & 1) != 0;
        m.primitive = false;
        m.item = null;
        cls.prototype.constructor = cls;
        cls.classObject = null;
        var clinit = data[i + 5];
        cls.$clinit = clinit !== 0 ? clinit : function() {};

        var names = data[i + 6];
        if (!(names instanceof Array)) {
            names = [names];
        }
        for (var j = 0; j < names.length; j = (j + 1) | 0) {
            window[names[j]] = (function(cls, name) {
                return function() {
                    var clinit = cls.$clinit;
                    cls.$clinit = function() {};
                    clinit();
                    return window[name].apply(window, arguments);
                }
            })(cls, names[j]);
        }

        var virtualMethods = data[i + 7];
        for (var j = 0; j < virtualMethods.length; j += 2) {
            var name = virtualMethods[j + 0];
            var func = virtualMethods[j + 1];
            if (typeof name === 'string') {
                name = [name];
            }
            for (var k = 0; k < name.length; ++k) {
                cls.prototype[name[k]] = func;
            }
        }
    }
}
function $rt_threadStarter(f) {
    return function() {
        var args = Array.prototype.slice.apply(arguments);
        $rt_startThread(function() {
            f.apply(this, args);
        });
    }
}
function $rt_mainStarter(f) {
    return function(args) {
        if (!args) {
            args = [];
        }
        var javaArgs = $rt_createArray($rt_objcls(), args.length);
        for (var i = 0; i < args.length; ++i) {
            javaArgs.data[i] = $rt_str(args[i]);
        }
        $rt_threadStarter(f)(javaArgs);
    };
}
var $rt_stringPool_instance;
function $rt_stringPool(strings) {
    $rt_stringPool_instance = new Array(strings.length);
    for (var i = 0; i < strings.length; ++i) {
        $rt_stringPool_instance[i] = $rt_intern($rt_str(strings[i]));
    }
}
function $rt_s(index) {
    return $rt_stringPool_instance[index];
}
function TeaVMThread(runner) {
    this.status = 3;
    this.stack = [];
    this.suspendCallback = null;
    this.runner = runner;
    this.attribute = null;
    this.completeCallback = null;
}
TeaVMThread.prototype.push = function() {
    for (var i = 0; i < arguments.length; ++i) {
        this.stack.push(arguments[i]);
    }
    return this;
}
TeaVMThread.prototype.s = TeaVMThread.prototype.push;
TeaVMThread.prototype.pop = function() {
    return this.stack.pop();
}
TeaVMThread.prototype.l = TeaVMThread.prototype.pop;
TeaVMThread.prototype.isResuming = function() {
    return this.status == 2;
}
TeaVMThread.prototype.isSuspending = function() {
    return this.status == 1;
}
TeaVMThread.prototype.suspend = function(callback) {
    this.suspendCallback = callback;
    this.status = 1;
}
TeaVMThread.prototype.start = function(callback) {
    if (this.status != 3) {
        throw new Error("Thread already started");
    }
    if ($rt_currentNativeThread !== null) {
        throw new Error("Another thread is running");
    }
    this.status = 0;
    this.completeCallback = callback ? callback : function(result) {
        if (result instanceof Error) {
            throw result;
        }
    };
    this.run();
}
TeaVMThread.prototype.resume = function() {
    if ($rt_currentNativeThread !== null) {
        throw new Error("Another thread is running");
    }
    this.status = 2;
    this.run();
}
TeaVMThread.prototype.run = function() {
    $rt_currentNativeThread = this;
    var result;
    try {
        result = this.runner();
    } catch (e) {
        result = e;
    } finally {
        $rt_currentNativeThread = null;
    }
    if (this.suspendCallback !== null) {
        var self = this;
        var callback = this.suspendCallback;
        this.suspendCallback = null;
        callback(function() {
            self.resume();
        });
    } else if (this.status === 0) {
        this.completeCallback(result);
    }
}
function $rt_suspending() {
    var thread = $rt_nativeThread();
    return thread != null && thread.isSuspending();
}
function $rt_resuming() {
    var thread = $rt_nativeThread();
    return thread != null && thread.isResuming();
}
function $rt_suspend(callback) {
    return $rt_nativeThread().suspend(callback);
}
function $rt_startThread(runner, callback) {
    new TeaVMThread(runner).start(callback);
}
var $rt_currentNativeThread = null;
function $rt_nativeThread() {
    return $rt_currentNativeThread;
}
function $rt_invalidPointer() {
    throw new Error("Invalid recorded state");
}

function $dbg_repr(obj) {
    return obj.toString ? obj.toString() : "";
}
function $dbg_class(obj) {
    if (obj instanceof Long) {
        return "long";
    }
    var cls = obj.constructor;
    var arrayDegree = 0;
    while (cls.$meta && cls.$meta.item) {
        ++arrayDegree;
        cls = cls.$meta.item;
    }
    var clsName = "";
    if (cls === $rt_booleancls()) {
        clsName = "boolean";
    } else if (cls === $rt_bytecls()) {
        clsName = "byte";
    } else if (cls === $rt_shortcls()) {
        clsName = "short";
    } else if (cls === $rt_charcls()) {
        clsName = "char";
    } else if (cls === $rt_intcls()) {
        clsName = "int";
    } else if (cls === $rt_longcls()) {
        clsName = "long";
    } else if (cls === $rt_floatcls()) {
        clsName = "float";
    } else if (cls === $rt_doublecls()) {
        clsName = "double";
    } else {
        clsName = cls.$meta ? cls.$meta.name : "@" + cls.name;
    }
    while (arrayDegree-- > 0) {
        clsName += "[]";
    }
    return clsName;
}

function Long(lo, hi) {
    this.lo = lo | 0;
    this.hi = hi | 0;
}
Long.prototype.toString = function() {
    var result = [];
    var n = this;
    var positive = Long_isPositive(n);
    if (!positive) {
        n = Long_neg(n);
    }
    var radix = new Long(10, 0);
    do {
        var divRem = Long_divRem(n, radix);
        result.push(String.fromCharCode(48 + divRem[1].lo));
        n = divRem[0];
    } while (n.lo != 0 || n.hi != 0);
    result = result.reverse().join('');
    return positive ? result : "-" + result;
}
var Long_ZERO = new Long(0, 0);
var Long_MAX_NORMAL = 1 << 18;
function Long_fromInt(val) {
    return val >= 0 ? new Long(val, 0) : new Long(val, -1);
}
function Long_fromNumber(val) {
    if (val >= 0) {
        return new Long(val | 0, (val / 0x100000000) | 0);
    } else {
        return new Long(val | 0, (-(Math.abs(val) / 0x100000000) - 1) | 0);
    }
}
function Long_toNumber(val) {
    var lo = val.lo;
    var hi = val.hi;
    if (lo < 0) {
        lo += 0x100000000;
    }
    return 0x100000000 * hi + lo;
}
function Long_add(a, b) {
    if (a.hi === (a.lo >> 31) && b.hi === (b.lo >> 31)) {
        return Long_fromNumber(a.lo + b.lo);
    } else if (Math.abs(a.hi) < Long_MAX_NORMAL && Math.abs(b.hi) < Long_MAX_NORMAL) {
        return Long_fromNumber(Long_toNumber(a) + Long_toNumber(b));
    }
    var a_lolo = a.lo & 0xFFFF;
    var a_lohi = a.lo >>> 16;
    var a_hilo = a.hi & 0xFFFF;
    var a_hihi = a.hi >>> 16;
    var b_lolo = b.lo & 0xFFFF;
    var b_lohi = b.lo >>> 16;
    var b_hilo = b.hi & 0xFFFF;
    var b_hihi = b.hi >>> 16;

    var lolo = (a_lolo + b_lolo) | 0;
    var lohi = (a_lohi + b_lohi + (lolo >> 16)) | 0;
    var hilo = (a_hilo + b_hilo + (lohi >> 16)) | 0;
    var hihi = (a_hihi + b_hihi + (hilo >> 16)) | 0;
    return new Long((lolo & 0xFFFF) | ((lohi & 0xFFFF) << 16), (hilo & 0xFFFF) | ((hihi & 0xFFFF) << 16));
}
function Long_inc(a) {
    var lo = (a.lo + 1) | 0;
    var hi = a.hi;
    if (lo === 0) {
        hi = (hi + 1) | 0;
    }
    return new Long(lo, hi);
}
function Long_dec(a) {
    var lo = (a.lo - 1) | 0;
    var hi = a.hi;
    if (lo === -1) {
        hi = (hi - 1) | 0;
    }
    return new Long(lo, hi);
}
function Long_neg(a) {
    return Long_inc(new Long(a.lo ^ 0xFFFFFFFF, a.hi ^ 0xFFFFFFFF));
}
function Long_sub(a, b) {
    if (a.hi === (a.lo >> 31) && b.hi === (b.lo >> 31)) {
        return Long_fromNumber(a.lo - b.lo);
    }
    var a_lolo = a.lo & 0xFFFF;
    var a_lohi = a.lo >>> 16;
    var a_hilo = a.hi & 0xFFFF;
    var a_hihi = a.hi >>> 16;
    var b_lolo = b.lo & 0xFFFF;
    var b_lohi = b.lo >>> 16;
    var b_hilo = b.hi & 0xFFFF;
    var b_hihi = b.hi >>> 16;

    var lolo = (a_lolo - b_lolo) | 0;
    var lohi = (a_lohi - b_lohi + (lolo >> 16)) | 0;
    var hilo = (a_hilo - b_hilo + (lohi >> 16)) | 0;
    var hihi = (a_hihi - b_hihi + (hilo >> 16)) | 0;
    return new Long((lolo & 0xFFFF) | ((lohi & 0xFFFF) << 16), (hilo & 0xFFFF) | ((hihi & 0xFFFF) << 16));
}
function Long_compare(a, b) {
    var r = a.hi - b.hi;
    if (r !== 0) {
        return r;
    }
    var r = (a.lo >>> 1) - (b.lo >>> 1);
    if (r !== 0) {
        return r;
    }
    return (a.lo & 1) - (b.lo & 1);
}
function Long_isPositive(a) {
    return (a.hi & 0x80000000) === 0;
}
function Long_isNegative(a) {
    return (a.hi & 0x80000000) !== 0;
}
function Long_mul(a, b) {
    var positive = Long_isNegative(a) === Long_isNegative(b);
    if (Long_isNegative(a)) {
        a = Long_neg(a);
    }
    if (Long_isNegative(b)) {
        b = Long_neg(b);
    }
    var a_lolo = a.lo & 0xFFFF;
    var a_lohi = a.lo >>> 16;
    var a_hilo = a.hi & 0xFFFF;
    var a_hihi = a.hi >>> 16;
    var b_lolo = b.lo & 0xFFFF;
    var b_lohi = b.lo >>> 16;
    var b_hilo = b.hi & 0xFFFF;
    var b_hihi = b.hi >>> 16;

    var lolo = 0;
    var lohi = 0;
    var hilo = 0;
    var hihi = 0;
    lolo = (a_lolo * b_lolo) | 0;
    lohi = lolo >>> 16;
    lohi = ((lohi & 0xFFFF) + a_lohi * b_lolo) | 0;
    hilo = (hilo + (lohi >>> 16)) | 0;
    lohi = ((lohi & 0xFFFF) + a_lolo * b_lohi) | 0;
    hilo = (hilo + (lohi >>> 16)) | 0;
    hihi = hilo >>> 16;
    hilo = ((hilo & 0xFFFF) + a_hilo * b_lolo) | 0;
    hihi = (hihi + (hilo >>> 16)) | 0;
    hilo = ((hilo & 0xFFFF) + a_lohi * b_lohi) | 0;
    hihi = (hihi + (hilo >>> 16)) | 0;
    hilo = ((hilo & 0xFFFF) + a_lolo * b_hilo) | 0;
    hihi = (hihi + (hilo >>> 16)) | 0;
    hihi = (hihi + a_hihi * b_lolo + a_hilo * b_lohi + a_lohi * b_hilo + a_lolo * b_hihi) | 0;
    var result = new Long((lolo & 0xFFFF) | (lohi << 16), (hilo & 0xFFFF) | (hihi << 16));
    return positive ? result : Long_neg(result);
}
function Long_div(a, b) {
    if (Math.abs(a.hi) < Long_MAX_NORMAL && Math.abs(b.hi) < Long_MAX_NORMAL) {
        return Long_fromNumber(Long_toNumber(a) / Long_toNumber(b));
    }
    return Long_divRem(a, b)[0];
}
function Long_rem(a, b) {
    if (Math.abs(a.hi) < Long_MAX_NORMAL && Math.abs(b.hi) < Long_MAX_NORMAL) {
        return Long_fromNumber(Long_toNumber(a) % Long_toNumber(b));
    }
    return Long_divRem(a, b)[1];
}
function Long_divRem(a, b) {
    if (b.lo == 0 && b.hi == 0) {
        throw new Error("Division by zero");
    }
    var positive = Long_isNegative(a) === Long_isNegative(b);
    if (Long_isNegative(a)) {
        a = Long_neg(a);
    }
    if (Long_isNegative(b)) {
        b = Long_neg(b);
    }
    a = new LongInt(a.lo, a.hi, 0);
    b = new LongInt(b.lo, b.hi, 0);
    var q = LongInt_div(a, b);
    a = new Long(a.lo, a.hi);
    q = new Long(q.lo, q.hi);
    return positive ? [q, a] : [Long_neg(q), Long_neg(a)];
}
function Long_shiftLeft16(a) {
    return new Long(a.lo << 16, (a.lo >>> 16) | (a.hi << 16));
}
function Long_shiftRight16(a) {
    return new Long((a.lo >>> 16) | (a.hi << 16), a.hi >>> 16);
}
function Long_and(a, b) {
    return new Long(a.lo & b.lo, a.hi & b.hi);
}
function Long_or(a, b) {
    return new Long(a.lo | b.lo, a.hi | b.hi);
}
function Long_xor(a, b) {
    return new Long(a.lo ^ b.lo, a.hi ^ b.hi);
}
function Long_shl(a, b) {
    b &= 63;
    if (b == 0) {
        return a;
    } else if (b < 32) {
        return new Long(a.lo << b, (a.lo >>> (32 - b)) | (a.hi << b));
    } else if (b == 32) {
        return new Long(0, a.lo);
    } else {
        return new Long(0, a.lo << (b - 32));
    }
}
function Long_shr(a, b) {
    b &= 63;
    if (b == 0) {
        return a;
    } else if (b < 32) {
        return new Long((a.lo >>> b) | (a.hi << (32 - b)), a.hi >> b);
    } else if (b == 32) {
        return new Long(a.hi, a.hi >> 31);
    } else {
        return new Long((a.hi >> (b - 32)), a.hi >> 31);
    }
}
function Long_shru(a, b) {
    b &= 63;
    if (b == 0) {
        return a;
    } else if (b < 32) {
        return new Long((a.lo >>> b) | (a.hi << (32 - b)), a.hi >>> b);
    } else if (b == 32) {
        return new Long(a.hi, 0);
    } else {
        return new Long((a.hi >>> (b - 32)), 0);
    }
}

// Represents a mutable 80-bit unsigned integer
function LongInt(lo, hi, sup) {
    this.lo = lo;
    this.hi = hi;
    this.sup = sup;
}
function LongInt_mul(a, b) {
    var a_lolo = ((a.lo & 0xFFFF) * b) | 0;
    var a_lohi = ((a.lo >>> 16) * b) | 0;
    var a_hilo = ((a.hi & 0xFFFF) * b) | 0;
    var a_hihi = ((a.hi >>> 16) * b) | 0;
    var sup = (a.sup * b) | 0;

    a_lohi = (a_lohi + (a_lolo >>> 16)) | 0;
    a_hilo = (a_hilo + (a_lohi >>> 16)) | 0;
    a_hihi = (a_hihi + (a_hilo >>> 16)) | 0;
    sup = (sup + (a_hihi >>> 16)) | 0;
    a.lo = (a_lolo & 0xFFFF) | (a_lohi << 16);
    a.hi = (a_hilo & 0xFFFF) | (a_hihi << 16);
    a.sup = sup & 0xFFFF;
}
function LongInt_sub(a, b) {
    var a_lolo = a.lo & 0xFFFF;
    var a_lohi = a.lo >>> 16;
    var a_hilo = a.hi & 0xFFFF;
    var a_hihi = a.hi >>> 16;
    var b_lolo = b.lo & 0xFFFF;
    var b_lohi = b.lo >>> 16;
    var b_hilo = b.hi & 0xFFFF;
    var b_hihi = b.hi >>> 16;

    a_lolo = (a_lolo - b_lolo) | 0;
    a_lohi = (a_lohi - b_lohi + (a_lolo >> 16)) | 0;
    a_hilo = (a_hilo - b_hilo + (a_lohi >> 16)) | 0;
    a_hihi = (a_hihi - b_hihi + (a_hilo >> 16)) | 0;
    var sup = (a.sup - b.sup + (a_hihi >> 16)) | 0;
    a.lo = (a_lolo & 0xFFFF) | (a_lohi << 16);
    a.hi = (a_hilo & 0xFFFF) | (a_hihi << 16);
    a.sup = sup;
}
function LongInt_add(a, b) {
    var a_lolo = a.lo & 0xFFFF;
    var a_lohi = a.lo >>> 16;
    var a_hilo = a.hi & 0xFFFF;
    var a_hihi = a.hi >>> 16;
    var b_lolo = b.lo & 0xFFFF;
    var b_lohi = b.lo >>> 16;
    var b_hilo = b.hi & 0xFFFF;
    var b_hihi = b.hi >>> 16;

    a_lolo = (a_lolo + b_lolo) | 0;
    a_lohi = (a_lohi + b_lohi + (a_lolo >> 16)) | 0;
    a_hilo = (a_hilo + b_hilo + (a_lohi >> 16)) | 0;
    a_hihi = (a_hihi + b_hihi + (a_hilo >> 16)) | 0;
    var sup = (a.sup + b.sup + (a_hihi >> 16)) | 0;
    a.lo = (a_lolo & 0xFFFF) | (a_lohi << 16);
    a.hi = (a_hilo & 0xFFFF) | (a_hihi << 16);
    a.sup = sup;
}
function LongInt_inc(a) {
    a.lo = (a.lo + 1) | 0;
    if (a.lo == 0) {
        a.hi = (a.hi + 1) | 0;
        if (a.hi == 0) {
            a.sup = (a.sup + 1) & 0xFFFF;
        }
    }
}
function LongInt_dec(a) {
    a.lo = (a.lo - 1) | 0;
    if (a.lo == -1) {
        a.hi = (a.hi - 1) | 0;
        if (a.hi == -1) {
            a.sup = (a.sup - 1) & 0xFFFF;
        }
    }
}
function LongInt_ucompare(a, b) {
    var r = (a.sup - b.sup);
    if (r != 0) {
        return r;
    }
    var r = (a.hi >>> 1) - (b.hi >>> 1);
    if (r != 0) {
        return r;
    }
    var r = (a.hi & 1) - (b.hi & 1);
    if (r != 0) {
        return r;
    }
    var r = (a.lo >>> 1) - (b.lo >>> 1);
    if (r != 0) {
        return r;
    }
    return (a.lo & 1) - (b.lo & 1);
}
function LongInt_numOfLeadingZeroBits(a) {
    var n = 0;
    var d = 16;
    while (d > 0) {
        if ((a >>> d) !== 0) {
            a >>>= d;
            n = (n + d) | 0;
        }
        d = (d / 2) | 0;
    }
    return 31 - n;
}
function LongInt_shl(a, b) {
    if (b == 0) {
        return;
    } else if (b < 32) {
        a.sup = ((a.hi >>> (32 - b)) | (a.sup << b)) & 0xFFFF;
        a.hi = (a.lo >>> (32 - b)) | (a.hi << b);
        a.lo <<= b;
    } else if (b == 32) {
        a.sup = a.hi & 0xFFFF;
        a.hi = a.lo;
        a.lo = 0;
    } else if (b < 64) {
        a.sup = ((a.lo >>> (64 - b)) | (a.hi << (b - 32))) & 0xFFFF;
        a.hi = a.lo << b;
        a.lo = 0;
    } else if (b == 64) {
        a.sup = a.lo & 0xFFFF;
        a.hi = 0;
        a.lo = 0;
    } else {
        a.sup = (a.lo << (b - 64)) & 0xFFFF;
        a.hi = 0;
        a.lo = 0;
    }
}
function LongInt_shr(a, b) {
    if (b == 0) {
        return;
    } else if (b == 32) {
        a.lo = a.hi;
        a.hi = a.sup;
        a.sup = 0;
    } else if (b < 32) {
        a.lo = (a.lo >>> b) | (a.hi << (32 - b));
        a.hi = (a.hi >>> b) | (a.sup << (32 - b));
        a.sup >>>= b;
    } else if (b == 64) {
        a.lo = a.sup;
        a.hi = 0;
        a.sup = 0;
    } else if (b < 64) {
        a.lo = (a.hi >>> (b - 32)) | (a.sup << (64 - b));
        a.hi = a.sup >>> (b - 32);
        a.sup = 0;
    } else {
        a.lo = a.sup >>> (b - 64);
        a.hi = 0;
        a.sup = 0;
    }
}
function LongInt_copy(a) {
    return new LongInt(a.lo, a.hi, a.sup);
}
function LongInt_div(a, b) {
    // Normalize divisor
    var bits = b.hi !== 0 ? LongInt_numOfLeadingZeroBits(b.hi) : LongInt_numOfLeadingZeroBits(b.lo) + 32;
    var sz = 1 + ((bits / 16) | 0);
    var dividentBits = bits % 16;
    LongInt_shl(b, bits);
    LongInt_shl(a, dividentBits);
    var q = new LongInt(0, 0, 0);
    while (sz-- > 0) {
        LongInt_shl(q, 16);
        // Calculate approximate q
        var digitA = (a.hi >>> 16) + (0x10000 * a.sup);
        var digitB = b.hi >>> 16;
        var digit = (digitA / digitB) | 0;
        var t = LongInt_copy(b);
        LongInt_mul(t, digit);
        // Adjust q either down or up
        if (LongInt_ucompare(t, a) >= 0) {
            while (LongInt_ucompare(t, a) > 0) {
                LongInt_sub(t, b);
                --digit;
            }
        } else {
            while (true) {
                var nextT = LongInt_copy(t);
                LongInt_add(nextT, b);
                if (LongInt_ucompare(nextT, a) > 0) {
                    break;
                }
                t = nextT;
                ++digit;
            }
        }
        LongInt_sub(a, t);
        q.lo |= digit;
        LongInt_shl(a, 16);
    }
    LongInt_shr(a, bits + 16);
    return q;
}

"use strict";
function $rt_cls(cls){return A(cls);}
function $rt_str(str) {if (str===null){return null;}var characters = $rt_createCharArray(str.length);var charsBuffer = characters.data;for (var i = 0; i < str.length; i = (i + 1) | 0) {charsBuffer[i] = str.charCodeAt(i) & 0xFFFF;}return B(characters);}
function $rt_ustr(str) {var result = "";var sz = C(str);var array = $rt_createCharArray(sz);D(str, 0, sz, array, 0);for (var i = 0; i < sz; i = (i + 1) | 0) {result += String.fromCharCode(array.data[i]);}return result;}
function $rt_objcls() { return E; }
function $rt_nullCheck(val) {if (val === null) {$rt_throw(F());}return val;}
function $rt_intern(str) {return G(str);}
function $rt_getThread(){return H();}
function $rt_setThread(t){return I(t);}
var CJB=$rt_throw;var DJB=$rt_compare;var EJB=$rt_nullCheck;var FJB=$rt_cls;var GJB=$rt_createArray;var HJB=$rt_isInstance;var EC=$rt_nativeThread;var IJB=$rt_suspending;var HQ=$rt_resuming;var UF=$rt_invalidPointer;
function E(){this.pC=null;}
function Y(){E.call(this);}
function XJ(){var a=this;E.call(a);a.YD=null;a.oC=null;}
function J(){E.call(this);}
function FL(){E.call(this);}
function IC(){var a=this;E.call(a);a.YB=null;a.aH=null;a.wI=null;a.BB=null;}
IC.FM=false;function GL(){E.call(this);}
function KI(){var a=this;E.call(a);a.EC=null;a.OH=0;a.QK=0;a.wK=null;}
function N(){E.call(this);}
function M(){E.call(this);}
function L(){E.call(this);}
function AD(){M.call(this);this.hL=0;}
AD.iE=null;AD.yJ=null;function SS(){E.call(this);}
function AC(){E.call(this);}
function BU(){E.call(this);}
function BD(){E.call(this);}
function FD(){E.call(this);}
function QB(){E.call(this);}
function VD(){E.call(this);}
VD.iK=null;function GB(){var a=this;E.call(a);a.QL=null;a.FB=Long_ZERO;a.QH=null;a.MK=Long_ZERO;a.OE=null;}
GB.QC=0;GB.XF=null;GB.kG=null;GB.uC=Long_ZERO;function DB(){E.call(this);}
function LG(){E.call(this);}
function YQ(){E.call(this);}
function GC(){E.call(this);}
function SB(){var a=this;E.call(a);a.qF=false;a.jM=false;a.PL=null;a.uG=null;}
function W(){SB.call(this);}
function VB(){W.call(this);}
function LM(){E.call(this);}
function HT(){var a=this;E.call(a);a.aC=null;a.fM=null;a.YL=null;a.zG=null;a.gM=null;}
function P(){SB.call(this);}
function K(){P.call(this);}
function SC(){K.call(this);}
function CS(){SC.call(this);}
function YP(){E.call(this);}
function PM(){E.call(this);}
function ID(){E.call(this);this.KE=null;}
ID.xJ=null;ID.VG=null;function NN(){E.call(this);}
function YR(){E.call(this);}
function TK(){E.call(this);}
function OP(){E.call(this);}
function Z(){E.call(this);}
function GE(){E.call(this);}
function RL(){E.call(this);}
function AH(){E.call(this);}
function OG(){E.call(this);}
function GN(){E.call(this);}
function PB(){P.call(this);}
function YD(){E.call(this);}
function NS(){K.call(this);}
function YI(){W.call(this);}
function YT(){E.call(this);}
function NB(){var a=this;E.call(a);a.bD=0;a.cE=0;a.TD=0;a.BK=0;}
function WR(){E.call(this);}
function DE(){E.call(this);}
function PK(){E.call(this);}
function ST(){E.call(this);}
function KM(){E.call(this);}
function AB(){E.call(this);}
function XD(){var a=this;E.call(a);a.uE=null;a.nE=null;}
XD.FD=null;function DD(){K.call(this);}
function DT(){DD.call(this);}
function CF(){E.call(this);this.iH=null;}
function KR(){E.call(this);}
function WC(){E.call(this);}
function FB(){WC.call(this);this.kI=null;}
function JE(){var a=this;FB.call(a);a.KH=null;a.qB=null;a.TB=null;a.fF=null;}
JE.YE=null;function VS(){E.call(this);}
function HI(){E.call(this);}
function YG(){E.call(this);}
function YF(){E.call(this);}
function CD(){E.call(this);}
function IB(){E.call(this);}
function EB(){E.call(this);}
function QD(){E.call(this);}
function O(){EB.call(this);this.xH=0;}
function HB(){var a=this;O.call(a);a.fK=0;a.oL=null;}
function SL(){HB.call(this);this.HK=null;}
function SO(){E.call(this);}
function RG(){E.call(this);}
function PR(){E.call(this);}
function TQ(){var a=this;E.call(a);a.hI=false;a.aF=false;a.tJ=null;}
function MB(){VB.call(this);}
function TI(){MB.call(this);}
function ZS(){E.call(this);}
function EI(){E.call(this);}
function WI(){E.call(this);}
function YE(){E.call(this);}
function CJ(){K.call(this);}
function RK(){E.call(this);}
function WL(){E.call(this);}
function FP(){E.call(this);}
function UN(){E.call(this);}
function AS(){E.call(this);}
function FR(){E.call(this);}
function PP(){var a=this;E.call(a);a.cD=null;a.jG=null;a.VJ=null;a.NC=null;}
function JK(){E.call(this);}
function MN(){FB.call(this);this.yC=null;}
function JC(){var a=this;E.call(a);a.RD=null;a.NL=null;a.sE=0.0;a.yB=0.0;a.bK=null;a.RF=null;a.AJ=0;}
function GS(){E.call(this);}
function XS(){E.call(this);}
function LC(){E.call(this);}
function RB(){var a=this;LC.call(a);a.CI=null;a.HC=null;a.SI=null;a.EK=0;a.VF=false;}
function WT(){RB.call(this);this.NJ=null;}
function FK(){E.call(this);}
function ES(){E.call(this);}
function MJ(){E.call(this);}
function CR(){E.call(this);}
function QR(){E.call(this);}
function ZD(){E.call(this);}
function UE(){E.call(this);}
function QE(){E.call(this);}
function QH(){var a=this;E.call(a);a.UC=null;a.AG=0;}
function UO(){E.call(this);}
function YB(){var a=this;E.call(a);a.OI=null;a.RB=null;}
YB.DB=null;function LK(){E.call(this);}
function CC(){E.call(this);this.GI=null;}
CC.JE=null;CC.wM=null;CC.YI=null;function Q(){var a=this;E.call(a);a.lJ=0;a.QE=null;}
Q.kF=null;Q.qD=null;Q.LF=null;Q.OD=null;Q.kC=null;Q.vI=null;Q.bF=null;function HC(){E.call(this);this.NK=false;}
HC.qG=null;HC.EF=null;HC.oK=null;function LB(){K.call(this);}
function SM(){LB.call(this);this.wE=null;}
function PT(){K.call(this);}
function VM(){E.call(this);}
function VE(){E.call(this);}
function MC(){E.call(this);}
function U(){E.call(this);}
function NC(){U.call(this);this.BM=null;}
function MP(){var a=this;NC.call(a);a.wG=null;a.hF=false;a.bL=false;a.YG=null;a.nK=null;}
function QP(){E.call(this);}
function TP(){E.call(this);}
function JH(){E.call(this);}
function LQ(){E.call(this);}
function IO(){E.call(this);}
function NF(){E.call(this);}
function VQ(){E.call(this);}
function QF(){E.call(this);}
function OH(){E.call(this);this.yD=null;}
function SD(){E.call(this);}
function HP(){var a=this;E.call(a);a.eI=null;a.cC=false;a.UL=null;a.jI=null;a.vH=null;a.xC=null;}
function KD(){M.call(this);this.OC=0.0;}
KD.XG=0.0;KD.CG=null;function UI(){E.call(this);}
function QJ(){E.call(this);}
function BS(){U.call(this);}
function IE(){E.call(this);}
function T(){EB.call(this);}
function CN(){T.call(this);}
function RD(){E.call(this);}
function KB(){E.call(this);this.ZG=null;}
function BN(){KB.call(this);}
function EN(){O.call(this);}
function JB(){E.call(this);this.NG=0;}
JB.mH=null;JB.BI=null;JB.LK=null;JB.FI=null;function BB(){E.call(this);}
function FN(){E.call(this);}
function WQ(){E.call(this);}
function IS(){var a=this;HB.call(a);a.BE=null;a.BF=null;}
function MM(){E.call(this);}
function YO(){E.call(this);}
function HD(){E.call(this);}
function KC(){NB.call(this);}
function YC(){KC.call(this);}
function MR(){var a=this;YC.call(a);a.sM=null;a.yI=0;a.IL=false;}
function VP(){E.call(this);}
function EO(){E.call(this);}
function UT(){E.call(this);}
function FJ(){E.call(this);}
function DI(){E.call(this);}
function QL(){E.call(this);}
function DQ(){var a=this;E.call(a);a.tD=null;a.xF=null;}
function OB(){E.call(this);}
function AT(){E.call(this);}
function CU(){E.call(this);}
function VR(){E.call(this);}
function XI(){E.call(this);}
function BF(){E.call(this);}
function FQ(){E.call(this);}
function HR(){W.call(this);}
function UH(){E.call(this);}
function ZH(){E.call(this);}
function ZP(){K.call(this);}
function OI(){E.call(this);this.eG=null;}
function US(){E.call(this);}
function UC(){var a=this;E.call(a);a.sB=null;a.JB=0;}
UC.UE=null;UC.PG=null;function X(){E.call(this);}
function KE(){E.call(this);}
function HJ(){E.call(this);}
function MD(){JC.call(this);}
function TM(){MD.call(this);}
function CK(){E.call(this);}
function OE(){E.call(this);}
function YH(){E.call(this);}
function CI(){E.call(this);}
function SP(){E.call(this);}
function DO(){E.call(this);}
function DC(){E.call(this);}
DC.JD=null;function YN(){DC.call(this);}
function PE(){E.call(this);}
PE.SJ=null;function JT(){YB.call(this);}
function HN(){E.call(this);}
function RE(){E.call(this);}
function DU(){PB.call(this);}
function JS(){E.call(this);}
function MQ(){E.call(this);}
function NO(){E.call(this);}
function HG(){E.call(this);}
function WH(){E.call(this);}
function VC(){var a=this;E.call(a);a.ME=null;a.rI=null;a.lE=0;a.uK=null;a.nJ=null;a.iI=0;}
function TS(){E.call(this);}
function WS(){E.call(this);}
function DK(){E.call(this);}
function FE(){E.call(this);}
function PO(){E.call(this);this.gG=null;}
function OF(){K.call(this);}
function LN(){E.call(this);}
function SQ(){E.call(this);}
function UL(){var a=this;E.call(a);a.sH=null;a.hE=null;a.nG=0;a.mJ=null;}
function JR(){E.call(this);}
function BJ(){E.call(this);}
function XT(){E.call(this);}
function XO(){E.call(this);}
function GQ(){E.call(this);}
function KN(){E.call(this);}
function UM(){E.call(this);}
function GD(){O.call(this);}
function AG(){E.call(this);}
function HK(){E.call(this);}
function SI(){E.call(this);}
function MT(){E.call(this);}
function QQ(){E.call(this);}
function TT(){E.call(this);}
function PC(){E.call(this);}
function IR(){PC.call(this);}
function DL(){E.call(this);}
function AL(){E.call(this);}
function OQ(){K.call(this);}
function NQ(){E.call(this);}
function KJ(){E.call(this);}
function DN(){var a=this;E.call(a);a.aD=null;a.LE=null;a.eD=null;a.pK=null;a.RL=null;a.GF=null;}
function OD(){E.call(this);}
function TE(){E.call(this);}
function QT(){E.call(this);}
function EP(){E.call(this);}
function II(){E.call(this);}
function ME(){E.call(this);}
function RQ(){E.call(this);}
function CL(){O.call(this);this.FK=null;}
function BL(){var a=this;O.call(a);a.yH=null;a.zH=0;}
function LR(){E.call(this);}
function XQ(){E.call(this);}
function AR(){VB.call(this);}
function NE(){var a=this;E.call(a);a.IG=null;a.yM=null;}
NE.RG=false;function NH(){E.call(this);}
function GF(){E.call(this);}
function CM(){var a=this;E.call(a);a.PF=null;a.zL=0;}
function TB(){var a=this;E.call(a);a.yE=null;a.nH=0;}
function R(){TB.call(this);}
R.cG=null;R.NE=null;R.OM=null;R.rM=null;R.dM=null;R.HF=null;R.NI=null;R.VI=null;R.WK=null;function DP(){K.call(this);}
function VJ(){E.call(this);}
function RR(){E.call(this);}
function YK(){E.call(this);}
function JD(){E.call(this);}
function UB(){var a=this;JD.call(a);a.lH=null;a.XD=null;a.iM=0;}
function NR(){UB.call(this);this.KI=null;}
function AO(){E.call(this);}
function IQ(){E.call(this);}
function UQ(){E.call(this);}
function TL(){E.call(this);}
function IM(){IC.call(this);}
function GP(){E.call(this);}
function LH(){E.call(this);}
function ZO(){E.call(this);}
function LJ(){E.call(this);}
function WM(){E.call(this);}
function PN(){P.call(this);}
function AU(){E.call(this);}
function WE(){M.call(this);this.AM=Long_ZERO;}
WE.BD=null;function XF(){E.call(this);}
function NL(){E.call(this);}
function WD(){E.call(this);}
function CH(){E.call(this);}
function XR(){E.call(this);}
function GO(){E.call(this);}
function JQ(){E.call(this);}
function PH(){E.call(this);}
function DM(){E.call(this);}
function RF(){Q.call(this);}
function BC(){E.call(this);this.GK=null;}
BC.jC=null;function IP(){K.call(this);}
function EL(){E.call(this);}
function IH(){E.call(this);}
function LI(){E.call(this);}
function V(){E.call(this);}
V.tM=null;V.HB=null;V.iF=null;V.iD=null;V.fG=null;V.IK=0;function SR(){E.call(this);}
function QC(){var a=this;E.call(a);a.lK=null;a.EG=null;}
QC.zI=null;QC.DG=false;function KF(){E.call(this);}
function LL(){E.call(this);}
function KG(){E.call(this);}
function RN(){E.call(this);}
function OR(){E.call(this);}
function HF(){E.call(this);}
function UP(){MB.call(this);}
function WJ(){P.call(this);}
function WO(){E.call(this);}
function KT(){E.call(this);}
function SF(){E.call(this);}
function AK(){E.call(this);}
function AI(){var a=this;E.call(a);a.MJ=0;a.ZJ=0;a.eF=null;a.EJ=0;a.SC=0;}
function OJ(){E.call(this);}
function DG(){E.call(this);}
function VF(){E.call(this);}
function BP(){E.call(this);}
function VN(){E.call(this);}
function LE(){E.call(this);}
function HO(){E.call(this);}
function SN(){var a=this;E.call(a);a.wL=null;a.EM=0;}
function WG(){E.call(this);}
function VG(){E.call(this);}
function GJ(){E.call(this);}
function KP(){E.call(this);}
function RM(){E.call(this);}
function LO(){E.call(this);}
function XE(){M.call(this);this.LL=0;}
XE.VD=null;function FI(){PB.call(this);}
function ZR(){E.call(this);}
function OC(){var a=this;E.call(a);a.ND=null;a.uL=null;}
OC.pD=null;OC.vL=false;function FC(){E.call(this);}
FC.sD=null;function JN(){E.call(this);}
function OT(){var a=this;E.call(a);a.cK=false;a.aK=null;}
function LP(){E.call(this);}
function TG(){E.call(this);this.LH=null;}
function RC(){E.call(this);}
function OK(){E.call(this);this.gL=null;}
function AE(){E.call(this);}
function ZE(){var a=this;E.call(a);a.gI=null;a.XB=null;a.EE=null;}
ZE.hK=null;function NI(){E.call(this);}
function RJ(){var a=this;E.call(a);a.LC=null;a.IF=null;a.NF=null;a.zK=0.0;}
function ND(){E.call(this);}
function LD(){var a=this;E.call(a);a.JI=null;a.FG=null;}
function IG(){var a=this;LD.call(a);a.BG=null;a.gD=0;}
function GH(){E.call(this);}
function JJ(){E.call(this);}
function NM(){E.call(this);}
function TC(){var a=this;NB.call(a);a.GE=null;a.ZK=0;a.LM=null;}
function PQ(){var a=this;TC.call(a);a.UB=false;a.hD=false;}
function WF(){VC.call(this);}
function PI(){E.call(this);}
function XM(){E.call(this);}
function OM(){E.call(this);}
function QM(){E.call(this);}
function S(){var a=this;E.call(a);a.BJ=null;a.cL=0;}
S.lD=null;S.FE=null;S.oI=null;S.tI=null;S.UH=null;S.xG=null;S.fH=null;S.qL=null;S.CB=null;function WP(){E.call(this);}
function FO(){T.call(this);this.qI=null;}
function ML(){E.call(this);}
function EH(){E.call(this);}
function BT(){E.call(this);}
function FT(){E.call(this);}
function UK(){var a=this;GD.call(a);a.GB=null;a.AD=0;a.eK=null;}
function BI(){var a=this;E.call(a);a.hM=null;a.XH=null;}
function IT(){E.call(this);}
function MG(){E.call(this);}
function AJ(){FC.call(this);}
function HH(){E.call(this);}
function CT(){E.call(this);}
function RI(){E.call(this);}
function RT(){E.call(this);}
function MH(){E.call(this);}
function OS(){E.call(this);}
function DH(){E.call(this);}
function ZF(){E.call(this);}
function LF(){E.call(this);}
function WB(){TB.call(this);}
WB.MC=null;WB.WD=null;WB.CD=null;WB.FL=null;function KH(){E.call(this);}
function XK(){E.call(this);}
function ZB(){E.call(this);}
ZB.vD=null;ZB.zM=null;ZB.mM=null;function QK(){E.call(this);}
function JG(){E.call(this);}
function BG(){E.call(this);}
function KO(){E.call(this);}
function SJ(){var a=this;E.call(a);a.gF=null;a.DF=null;a.OG=null;}
function VT(){E.call(this);}
function VO(){E.call(this);}
function ZJ(){E.call(this);}
function TD(){E.call(this);}
TD.aJ=null;function CP(){E.call(this);}
function WK(){E.call(this);}
function KS(){E.call(this);}
function DR(){E.call(this);}
function BQ(){E.call(this);}
function RO(){BC.call(this);}
function XP(){E.call(this);this.ID=null;}
function ZI(){E.call(this);}
function VL(){T.call(this);this.jF=null;}
function EJ(){E.call(this);}
function XC(){M.call(this);this.SD=0.0;}
XC.UI=0.0;XC.oD=null;function NG(){UB.call(this);this.aE=null;}
function OL(){E.call(this);}
function SE(){E.call(this);}
function EE(){E.call(this);}
function RH(){var a=this;E.call(a);a.ED=null;a.XI=null;}
function TR(){E.call(this);}
function HE(){E.call(this);}
function CE(){E.call(this);}
function XH(){E.call(this);}
function ZN(){E.call(this);}
function JF(){var a=this;E.call(a);a.PI=null;a.AF=null;a.dG=null;a.AI=null;a.MG=0;a.lC=0;}
function VH(){E.call(this);}
function CG(){E.call(this);}
function MS(){E.call(this);}
function BM(){E.call(this);}
function FU(){K.call(this);}
function LT(){E.call(this);}
function NT(){E.call(this);}
function YS(){E.call(this);this.LG=null;}
function FF(){E.call(this);}
function JI(){E.call(this);}
function QS(){E.call(this);}
function IJ(){LB.call(this);}
function JO(){var a=this;E.call(a);a.FH=null;a.UJ=0;a.WB=null;}
function ZG(){RB.call(this);this.EH=null;}
function UR(){E.call(this);this.fJ=null;}
function BO(){E.call(this);}
function VK(){E.call(this);}
function PJ(){E.call(this);}
function AF(){E.call(this);}
function ON(){E.call(this);}
function SG(){P.call(this);}
function QI(){E.call(this);}
function MI(){E.call(this);}
function MF(){E.call(this);}
function YL(){E.call(this);this.ZI=null;}
function BR(){E.call(this);this.TL=null;}
function XL(){var a=this;E.call(a);a.NB=null;a.vM=null;a.MI=null;a.SH=0;}
function QO(){E.call(this);this.XJ=null;}
function QN(){E.call(this);}
function LS(){E.call(this);}
function EG(){E.call(this);}
function IF(){E.call(this);}
function UD(){M.call(this);this.CH=0;}
UD.ZL=null;function FS(){E.call(this);}
function JP(){E.call(this);}
function BE(){E.call(this);}
function DJ(){E.call(this);this.VH=null;}
function MO(){E.call(this);}
function ED(){var a=this;E.call(a);a.PM=null;a.qE=null;}
ED.NM=null;ED.JJ=null;function PD(){var a=this;E.call(a);a.ZE=Long_ZERO;a.KL=Long_ZERO;a.uJ=null;a.DH=null;a.mC=Long_ZERO;a.pE=null;}
PD.tG=Long_ZERO;function ZT(){E.call(this);}
function KL(){E.call(this);}
function IL(){E.call(this);}
function ER(){E.call(this);}
function NK(){var a=this;E.call(a);a.TJ=null;a.YH=null;a.vC=null;a.fL=null;}
function GK(){E.call(this);}
function EQ(){E.call(this);}
function MK(){E.call(this);}
function ZQ(){E.call(this);}
function PS(){var a=this;KB.call(a);a.JL=0;a.qM=0.0;a.oF=null;a.GD=0;a.RK=0;}
function JL(){E.call(this);}
function BK(){E.call(this);}
function ZC(){var a=this;E.call(a);a.bJ=0;a.uF=0;}
ZC.VL=null;ZC.YJ=null;function GR(){E.call(this);this.mL=null;}
function NP(){E.call(this);}
function IN(){E.call(this);}
function XB(){E.call(this);this.mE=null;}
XB.TK=null;XB.jJ=null;XB.DE=null;function XN(){E.call(this);}
function HM(){U.call(this);}
function PL(){E.call(this);}
function PF(){E.call(this);}
function FH(){E.call(this);}
function CB(){E.call(this);}
CB.lF=null;CB.SB=null;CB.pG=null;CB.gK=null;CB.tB=null;function JM(){E.call(this);}
function TN(){E.call(this);}
function JJB(){var $r=new E();Wu($r);return $r;}
function Hh($t){return A($t.constructor);}
function SCB($t){var a,b,c;if(HJB($t,AB)==0&&$t.constructor.$meta.item===null){CJB(KJB());}a=FFB($t);b=a;c=KIB();b.$id=c;return a;}
function PIB(a,b,c){var d,e;d=H();if(a.pC===null){a.pC=LJB();I(d);e=a.pC;e.nG=e.nG+b|0;PAB(c,null);return;}if(a.pC.sH!==null){GFB(a.pC.mJ,MJB(d,a,b,c));return;}a.pC.sH=d;I(d);e=a.pC;e.nG=e.nG+b|0;PAB(c,null);return;}
function WW($t,a){if($t!==a){a=0;}else{a=1;}return a;}
function HAB(a,b){var thread=$rt_nativeThread();var javaThread=$rt_getThread();if(thread.isResuming()){thread.status=0;var result=thread.attribute;if(result instanceof Error){throw result;}return result;}var callback=function(){};callback.TC=function(val){thread.attribute=val;$rt_setThread(javaThread);thread.resume();};callback.HE=function(e){thread.attribute=$rt_exception(e);$rt_setThread(javaThread);thread.resume();};callback=DHB(callback);return thread.suspend(function(){try{PIB(a,b,callback);}catch($e){callback.HE($rt_exception($e));}});}
function Wp($t){return HW($t);}
function Sq($t){if($t.pC===null){return 1;}if($t.pC.sH===null&&YGB($t.pC.mJ)!=0&&YGB($t.pC.hE)!=0){$t.pC=null;return 1;}return 0;}
function QIB(a){var b,c;if(Sq(a)==0&&a.pC.sH===H()){b=a.pC;c=b.nG-1|0;b.nG=c;if(c==0){a.pC.sH=null;}Sq(a);return;}CJB(NJB());}
function ZGB(a){var b;if(a.pC===null){a.pC=LJB();}if(a.pC.sH===null){a.pC.sH=H();}else if(a.pC.sH!==H()){CJB(OJB($rt_s(0)));}b=a.pC;b.nG=b.nG+1|0;return;}
function KGB(a){JFB(a,1);return;}
function HW($t){return $t.$id;}
function JFB(a,b){var c;if(Sq(a)==0&&a.pC.sH===H()){c=a.pC;c.nG=c.nG-b|0;if(a.pC.nG>0){return;}a.pC.sH=null;if(YGB(a.pC.mJ)!=0){Sq(a);}else{EFB(PJB(a));}return;}CJB(NJB());}
function Yk($t){return Tj(DY(DY(DY(QJB(),MBB(Hh($t))),$rt_s(1)),JDB(HW($t))));}
function EGB(a){if(a.pC!==null&&a.pC.sH===H()){a=1;}else{a=0;}return a;}
function Qg(a){var b,$p,$z;$p=0;if(HQ()){var $T=EC();$p=$T.l();b=$T.l();a=$T.l();}$m:while(true){switch($p){case 0:b=1;$p=1;case 1:C2(a,b);if(IJB()){break $m;}return;default:UF();}}EC().s(a,b,$p);}
function Wu($t){var a,b;a=$t;b=KIB();a.$id=b;return;}
function C2(a,b){var c,$p,$z;$p=0;if(HQ()){var $T=EC();$p=$T.l();c=$T.l();b=$T.l();a=$T.l();}$m:while(true){switch($p){case 0:if(a.pC===null){a.pC=LJB();}if(a.pC.sH===null){a.pC.sH=H();}if(a.pC.sH===H()){c=a.pC;c.nG=c.nG+b|0;return;}$p=1;case 1:HAB(a,b);if(IJB()){break $m;}return;default:UF();}}EC().s(a,b,c,$p);}
function OIB(a){return a;}
function RJB(a,b){var $r=new XJ();X7($r,a,b);return $r;}
function CEB($t){var a,b,$je;a=R5(Fw());$ba:{try{Cc(Fw(),$t.YD);$t.oC.p();}catch($e){$je=$e.$javaException;if($je){b=$je;break $ba;}else {throw $e;}}Cc(Fw(),a);return;}Cc(Fw(),a);CJB(b);}
function X7($t,a,b){$t.YD=a;$t.oC=b;Wu($t);return;}
function SJB(){var $r=new FL();Bz($r);return $r;}
function Bv($t){return GJB(Z,0);}
function Bz($t){Wu($t);return;}
function IC_$clinit(){IC_$clinit=function(){};
OCB=function(a){return a.wI;};
X5=function(a){return a.aH;};
Tl=function(a){return a.YB;};
Tw=function(){var a;if(P8(FJB(HT))!=0){a=0;}else{a=1;}IC.FM=a;return;};
TF=function($t,a,b,c,d){var $je;Wu($t);if(IC.FM==0&&Fu(MBB(Hh($t)),$rt_s(2))==0){CJB(TJB());}$ba:{$bb:{$bc:{$bd:{try{if(IC.FM!=0){break $bd;}if(TZ(Hh($t))===a){break $bd;}else{break $bc;}}catch($e){$je=$e.$javaException;if($je&&$je instanceof CJ){b=$je;break $bb;}else {throw $e;}}}break $ba;}try{CJB(TJB());}catch($e){$je=$e.$javaException;if($je&&$je instanceof CJ){b=$je;}else {throw $e;}}}}$t.BB=a;$t.wI=GJB(UC,c);$t.YB=$rt_createBooleanArray(c);$t.aH=GJB(UC,d);Y5(a,$t);return;};
Tw();}
function UJB(a,b,c,d){var $r=new IC();TF($r,a,b,c,d);return $r;}
function W9($t,a){return W1(a);}
function Hr($t,a){return G5(a);}
function XEB($t,a,b){return VJB(a,$t,b);}
function R3($t,a){return IV(a);}
function Sf($t,a,b){if(Ay(FJB(M),a)!=0){b=Sw($t,b);}if(FJB(HC)===a){b=Ka($t,b);}if(FJB(UC)===a){b=W9($t,b);}if(FJB(JB)===a){b=Hr($t,b);}if(FJB(AD)===a){if(b instanceof M==0){b=0;}else{b=b.g();}b=Lf(b);}if(FJB(WE)===a){if(b instanceof M==0){b=Long_ZERO;}else{b=b.i();}b=Jb(b);}if(FJB(XE)===a){if(b instanceof M==0){b=0;}else{b=b.X();}b=CX(b);}if(FJB(UD)===a){if(b instanceof M==0){b=0;}else{b=b.W();}b=D9(b);}if(FJB(XC)===a){if(b instanceof M==0){b=NaN;}else{b=b.h();}b=Xw(b);}if(FJB(KD)===a){if(b instanceof M==0)
{b=NaN;}else{b=b.j();}b=OAB(b);}if(Ki(a)!=0&&b instanceof UC!=0){b=CHB(M0(a,FJB(TB)),b);}return Ix(a,b);}
function Ls($t,a,b){if(IC.FM==0&&$t.aH.data[b]!==null){CJB(TJB());}$t.aH.data[b]=a;return;}
function Fn($t,a,b,c){if(IC.FM==0&&$t.wI.data[b]!==null){CJB(TJB());}$t.wI.data[b]=a;$t.YB.data[b]=c;return;}
function Ka($t,a){return MCB(a);}
function Kd($t,a,b){if(a===b){return 1;}if(a!==null&&b!==null){return J3(a,b);}return 0;}
function Sw($t,a){return Oo(a);}
function WJB(){var $r=new GL();Zd($r);return $r;}
function Fx($t){return GJB(Z,0);}
function Zd($t){Wu($t);return;}
function XJB(a,b){var $r=new KI();Vx($r,a,b);return $r;}
function Au($t,a){if(Zy($t.wK)<a){a=0;}else{a=1;}return a;}
function Kt($t){return M1($t.EC);}
function PEB($t,a){$t.QK=a;return;}
function Vx($t,a,b){Wu($t);$t.EC=a;$t.wK=b;return;}
function Vy($t,a){$t.OH=a;return;}
function YJB(){var $r=new M();F6($r);return $r;}
function Uz($t){return $t.g()<<24>>24;}
function F6($t){Wu($t);return;}
function Ks($t){return $t.g()<<16>>16;}
function AD_$clinit(){AD_$clinit=function(){};
ZM=function($t,a){F6($t);$t.hL=a;return;};
Uf=function(a,b){var c,d,e,f,g;if(b>=2&&b<=36){if(a!==null&&K9(a)==0){$ba:{c=0;d=0;switch(Hf(a,0)){case 43:d=1;break $ba;case 45:c=1;d=1;break $ba;default:}}e=0;if(d==C(a)){CJB(ZJB());}while(true){if(d>=C(a)){if(c!=0){e= -e|0;}return e;}f=d+1|0;g=MU(Hf(a,d));if(g<0){break;}if(g>=b){CJB(AKB(Q9(Tj(PY(DY(Qa(DY(QJB(),$rt_s(3)),b),$rt_s(4)),a)))));}e=(b*e|0)+g|0;if(e<0){if(f==C(a)&&e== -2147483648&&c!=0){return  -2147483648;}CJB(AKB(Q9(Tj(PY(DY(QJB(),$rt_s(5)),a)))));}d=f;}CJB(AKB(Q9(Tj(PY(DY(QJB(),$rt_s(6)),a)))));}CJB(AKB(Q9($rt_s(7))));}CJB(AKB(Q9(Tj(Qa(DY(QJB(),
$rt_s(8)),b)))));};
Nz=function(a,b){b=DJB(a,b);if(b>0){a=1;}else if(b>=0){a=0;}else{a= -1;}return a;};
Np=function(a,b){if(!(b>= -2147483648&&b<=2147483647)){b=10;}return Oc(BKB(20),a,b).c();};
Gf=function(){var a;if(AD.iE===null){AD.iE=GJB(AD,256);a=0;while(a<AD.iE.data.length){AD.iE.data[a]=CKB(a-128|0);a=a+1|0;}}return;};
Jj=function(a){return Np(a,10);};
Uq=function(a){return Uf(a,10);};
JDB=function(a){return Np(a,16);};
Nu=function(){AD.yJ=TFB();return;};
Lf=function(a){if(a>= -128&&a<=127){Gf();return AD.iE.data[a+128|0];}return CKB(a);};
Nu();}
function CKB(a){var $r=new AD();ZM($r,a);return $r;}
function Z4($t){return Long_fromInt($t.hL);}
function Be($t){return $t.hL;}
function Eu($t,a){return Nz($t.hL,a.hL);}
function Xg($t){return $t.hL;}
function OBB($t,a){return Eu($t,a);}
function TY($t){return $t.hL;}
function W4($t){return Jj($t.hL);}
function DKB(){var $r=new SS();RX($r);return $r;}
function J1($t){return GJB(Z,0);}
function RX($t){Wu($t);return;}
function EKB(){var $r=new BU();N6($r);return $r;}
function P6($t){return GJB(Z,0);}
function N6($t){Wu($t);return;}
function VD_$clinit(){VD_$clinit=function(){};
T9=function(){return VD.iK;};
Dn=function(){VD.iK=FKB();return;};
SH=function($t){Wu($t);return;};
Dn();}
function FKB(){var $r=new VD();SH($r);return $r;}
function Bc($t,a,b,c){return;}
function Cb($t,a){return a;}
function OZ($t,a){return;}
function H4($t,a,b,c){return;}
function Rh($t,a,b){return;}
function Ro($t,a){return a;}
function GB_$clinit(){GB_$clinit=function(){};
H=function(){return GB.kG;};
C0=function(){return GB.XF;};
AM=function($t,a,b){Wu($t);$t.OE=JJB();$t.QH=b;$t.QL=a;a=GB.uC;GB.uC=Long_add(a,Long_fromInt(1));$t.MK=a;return;};
I=function(a){if(GB.kG!==a){GB.kG=a;}GB.kG.FB=Vs();return;};
TJ=function($t,a){AM($t,null,a);return;};
Ng=function(){GB.XF=GKB(Q9($rt_s(9)));GB.kG=GB.XF;GB.uC=Long_fromInt(1);GB.QC=1;return;};
Jy=function(a){return EGB(a);};
ET=function($t){AM($t,null,null);return;};
Ng();}
function HKB(a,b){var $r=new GB();AM($r,a,b);return $r;}
function GKB(a){var $r=new GB();TJ($r,a);return $r;}
function IKB(){var $r=new GB();ET($r);return $r;}
function MV($t){return $t.MK;}
function NFB(a){return a;}
function GFB(a,b){var c;c=NFB(b);a.push(c);return;}
function DGB(a){return a.shift();}
function YGB(a){if(a.length!=0){a=0;}else{a=1;}return a;}
function JKB(){var $r=new YQ();Dj($r);return $r;}
function Ya($t){return GJB(Z,0);}
function Dj($t){Wu($t);return;}
function KKB(a){var $r=new SB();V7($r,a);return $r;}
function LKB(){var $r=new SB();V0($r);return $r;}
function MKB(a){var $r=new SB();X0($r,a);return $r;}
function Wq($t){return $t.uG;}
function O3($t){ZB_$clinit();ABB($t,ZB.vD);return;}
function V7($t,a){$t.qF=1;$t.jM=1;Qw($t);$t.uG=a;return;}
function ABB($t,a){Lm(a,Q9(Tj(DY(DY(DY(QJB(),MBB(Hh($t))),$rt_s(4)),Wq($t)))));return;}
function Qw($t){return $t;}
function V0($t){$t.qF=1;$t.jM=1;Qw($t);return;}
function X0($t,a){$t.qF=1;$t.jM=1;Qw($t);$t.PL=a;return;}
function NKB(a){var $r=new W();Vr($r,a);return $r;}
function OKB(a){var $r=new W();Th($r,a);return $r;}
function PKB(){var $r=new W();En($r);return $r;}
function Vr($t,a){V7($t,a);return;}
function Th($t,a){X0($t,a);return;}
function En($t){V0($t);return;}
function QKB(a){var $r=new VB();LY($r,a);return $r;}
function RKB(){var $r=new VB();Ws($r);return $r;}
function LY($t,a){Vr($t,a);return;}
function Ws($t){En($t);return;}
function SKB(){var $r=new LM();Jp($r);return $r;}
function NEB($t){return GJB(Z,0);}
function Jp($t){Wu($t);return;}
function VJB(a,b,c){var $r=new HT();R9($r,a,b,c);return $r;}
function Yo($t,a,b,c){Rr($t.YL,TKB($t,a,b,c));return;}
function Ip($t){var a,b,c,d,e,f;if($t.aC===null){a=Y8($t.YL,$t.fM);b=GJB(LC,OCB($t.zG).data.length);c=0;while(true){d=b.data;if(c>=d.length){break;}d[c]=Yh(a,OCB($t.zG).data[c],c,$t.fM,$t.zG,Tl($t.zG).data[c]);c=c+1|0;}e=GJB(JD,X5($t.zG).data.length);c=0;while(true){f=e.data;if(c>=f.length){break;}f[c]=IFB(X5($t.zG).data[c],c,$t.fM,$t.zG);c=c+1|0;}$t.aC=a;Rq(a,$t.fM,b,e);}return $t.aC;}
function A1($t,a){B7($t,a);return;}
function YEB($t){return $t.YL;}
function Nt($t){return $t.aC;}
function Jo($t){Ge(Ip($t),null);return;}
function AHB(a){return a.aC;}
function T5($t,a){if(a!=0&&$t.gM===null){$t.gM=UKB();}return $t.gM;}
function R9($t,a,b,c){Wu($t);$t.fM=a;$t.zG=b;$t.YL=c;return;}
function Mf($t){C9($t);return;}
function VKB(a){var $r=new P();AX($r,a);return $r;}
function WKB(){var $r=new P();Kl($r);return $r;}
function AX($t,a){V7($t,a);return;}
function Kl($t){V0($t);return;}
function XKB(a){var $r=new K();Q4($r,a);return $r;}
function YKB(){var $r=new K();Ba($r);return $r;}
function Q4($t,a){AX($t,a);return;}
function Ba($t){Kl($t);return;}
function ZKB(a){var $r=new SC();Q5($r,a);return $r;}
function ALB(){var $r=new SC();Rl($r);return $r;}
function Q5($t,a){Q4($t,a);return;}
function Rl($t){Ba($t);return;}
function BLB(){var $r=new CS();Kx($r);return $r;}
function Kx($t){Rl($t);return;}
function CLB(){var $r=new YP();Zr($r);return $r;}
function Py($t){return GJB(Z,0);}
function Zr($t){Wu($t);return;}
function DLB(){var $r=new PM();E0($r);return $r;}
function FY($t){return GJB(Z,0);}
function E0($t){Wu($t);return;}
function ID_$clinit(){ID_$clinit=function(){};
EF=function($t,a){Wu($t);$t.KE=a;return;};
RCB=function(){ID.xJ=ELB($rt_s(10));ID.VG=ELB($rt_s(11));return;};
RCB();}
function ELB(a){var $r=new ID();EF($r,a);return $r;}
function Xo($t){return $t.KE;}
function FLB(){var $r=new NN();W8($r);return $r;}
function K7($t){return GJB(Z,0);}
function W8($t){Wu($t);return;}
function GLB(){var $r=new YR();WCB($r);return $r;}
function V1($t){return GJB(Z,0);}
function WCB($t){Wu($t);return;}
function HLB(){var $r=new TK();Dk($r);return $r;}
function ZEB($t){return GJB(Z,0);}
function Dk($t){Wu($t);return;}
function ILB(){var $r=new OP();Uc($r);return $r;}
function Cw($t){return GJB(Z,0);}
function Uc($t){Wu($t);return;}
function JLB(){var $r=new RL();Kz($r);return $r;}
function Ym($t){return FJB(GE);}
function Kz($t){Wu($t);return;}
function KLB(){var $r=new AH();SAB($r);return $r;}
function Bj($t){return GJB(Z,0);}
function SAB($t){Wu($t);return;}
function LLB(){var $r=new OG();Vj($r);return $r;}
function Xc($t){return GJB(Z,0);}
function Vj($t){Wu($t);return;}
function MLB(){var $r=new GN();Bm($r);return $r;}
function M5($t){return GJB(Z,0);}
function Bm($t){Wu($t);return;}
function NLB(){var $r=new PB();Dy($r);return $r;}
function Dy($t){Kl($t);return;}
function OLB(a){var $r=new NS();Nk($r,a);return $r;}
function PLB(){var $r=new NS();Ih($r);return $r;}
function Nk($t,a){Q4($t,a);return;}
function Ih($t){Ba($t);return;}
function QLB(a){var $r=new YI();HY($r,a);return $r;}
function HY($t,a){Th($t,a);return;}
function RLB(){var $r=new YT();Kc($r);return $r;}
function Fz($t){return GJB(Z,0);}
function Kc($t){Wu($t);return;}
function SLB(a){var $r=new NB();Ew($r,a);return $r;}
function Ew($t,a){Wu($t);$t.TD= -1;$t.BK=a;$t.bD=a;return;}
function Xk($t){$t.cE=0;$t.bD=$t.BK;$t.TD= -1;return $t;}
function M1($t){var a;if($t.cE>=$t.bD){a=0;}else{a=1;}return a;}
function Zy($t){return $t.bD-$t.cE|0;}
function Ef($t){return $t.cE;}
function Xy($t,a){if(a>=0&&a<=$t.bD){$t.cE=a;if(a<$t.TD){$t.TD=0;}return $t;}CJB(TLB(Tj(DY(Qa(DY(Qa(DY(QJB(),$rt_s(12)),a),$rt_s(13)),$t.bD),$rt_s(14)))));}
function ULB(){var $r=new WR();W5($r);return $r;}
function Sn($t){return GJB(Z,0);}
function W5($t){Wu($t);return;}
function VLB(){var $r=new PK();Ee($r);return $r;}
function JCB($t){return GJB(Z,0);}
function Ee($t){Wu($t);return;}
function WLB(){var $r=new ST();Yi($r);return $r;}
function GV($t){return GJB(Z,0);}
function Yi($t){Wu($t);return;}
function XLB(){var $r=new KM();K2($r);return $r;}
function Rg($t){return GJB(Z,0);}
function K2($t){Wu($t);return;}
function XD_$clinit(){XD_$clinit=function(){};
Fm=function(a){return a.uE;};
RS=function($t,a){Wu($t);$t.uE=XEB(XD.FD,$t,a);return;};
El=function(){XD.FD=YLB(null);return;};
Rp=function(){return XD.FD;};
AP=function($t){RS($t,NV(FJB(XD)));return;};
El();}
function ZLB(a){var $r=new XD();RS($r,a);return $r;}
function AMB(){var $r=new XD();AP($r);return $r;}
function Oa($t){A1($t.uE,$rt_s(15));return $t.nE;}
function Vz($t){Jo($t.uE);return $t;}
function Il($t,a){var b;Mf($t.uE);b=$t.nE;if(Kd(XD.FD,b,a)!=0){return;}$t.nE=a;Yo($t.uE,$rt_s(15),b,a);return;}
function Yt($t){var a;a=QJB();GX(a,123);DY(GX(DY(GX(a,34),$rt_s(15)),34),$rt_s(16));DY(a,R3(XD.FD,$t.nE));GX(a,125);return Tj(a);}
function BMB(){var $r=new DD();IW($r);return $r;}
function IW($t){Ba($t);return;}
function CMB(){var $r=new DT();Z8($r);return $r;}
function Z8($t){IW($t);return;}
function DMB(a){var $r=new CF();SU($r,a);return $r;}
function Wg($t,a){var b,c,d,e,f;b=QEB(a);c=0;d=Jv(Fv($t.iH));while(Ia(d)!=0){if(J3(Rc(a),Mp(H0(d)))!=0){e=SEB().data[c%SEB().data.length];GBB(Fv($t.iH),c,EMB(Tj(Qa(DY(QJB(),$rt_s(17)),c)),Wc(a).data[0]+b,e,e));f=Xr().data;f[c]=f[c]+b;}c=c+1|0;}return;}
function SU($t,a){Wu($t);$t.iH=a;return;}
function FMB(){var $r=new KR();CZ($r);return $r;}
function QX($t){return GJB(Z,0);}
function CZ($t){Wu($t);return;}
function GMB(){var $r=new WC();Nj($r);return $r;}
function Nj($t){Wu($t);return;}
function HMB(a,b){var $r=new FB();Ms($r,a,b);return $r;}
function IMB(a){var $r=new FB();Et($r,a);return $r;}
function Ou($t){return $t.kI;}
function Ms($t,a,b){Nj($t);$t.kI=a;return;}
function Et($t,a){Nj($t);$t.kI=a;return;}
function JE_$clinit(){JE_$clinit=function(){};
GM=function($t,a,b,c,d){var e;e=c.data;Ms($t,a,JE.YE);$t.qB=b;b=e.length;$t.fF=GJB(LC,b);a=0;while(a<b){$t.fF.data[a]=J5(e[a]);a=a+1|0;}e=d.data;b=e.length;$t.TB=GJB(JD,b);a=0;while(a<b){$t.TB.data[a]=X2(e[a]);a=a+1|0;}return;};
Dp=function(a,b){var result = (function(id,bindings){var d = window['document'];
var e = id ? d['getElementById'](id) : d['body'];
ko['cleanNode'](e);
ko['applyBindings'](bindings, e);
return bindings['ko4j'];
}).call(null,YIB(a),YIB(b));return OHB(result,E);};
B9=function(a){var result = (function(js){delete js['ko4j'];
for (var p in js) {
  delete js[p];
};

}).call(null,YIB(a));return OHB(result,$rt_voidcls());};
U4=function(){JE.YE=JMB();return;};
Iz=function(a,b,c,d){var result = (function(model,prop,oldValue,newValue){if (model) {
  var koProp = model[prop];
  if (koProp && koProp['valueHasMutated']) {
    if ((oldValue !== null || newValue !== null)) {
      koProp['valueHasMutated'](newValue);
    } else if (koProp['valueHasMutated']) {
      koProp['valueHasMutated']();
    }
  }
}
}).call(null,YIB(a),YIB(b),YIB(c),YIB(d));return OHB(result,$rt_voidcls());};
S4=function(a){var result = (function(cnt){var arr = new Array(cnt);
for (var i = 0; i < cnt; i++) arr[i] = new Object();
return arr;
}).call(null,YIB(a));return OHB(result,$rt_arraycls(E));};
Qc=function(){var a;while(true){a=L0(JE.YE);if(a===null){break;}B9(a.qB);a.qB=null;a.fF=null;a.TB=null;}return;};
U4();}
function KMB(a,b,c,d){var $r=new JE();GM($r,a,b,c,d);return $r;}
function OY($t,a,b){if(b instanceof JE!=0){b=Ou(b);}X4($t.fF.data[a],b);return;}
function P4($t,a){return QY($t.fF.data[a]);}
function Je($t,a,b,c){DX($t.TB.data[a],b,c);return;}
function Oz($t){$t.KH=Ou($t);return;}
function Lj($t,a,b,c,d,e){var result = (function(ret,propNames,propReadOnly,propValues,funcNames){Object.defineProperty(ret, 'ko4j', { value : this });
function koComputed(index, name, readOnly, value) {
  var trigger = ko['observable']()['extend']({'notify':'always'});  function realGetter() {
    var self = ret['ko4j'];
    try {
      var v = self ? (function($this, p0) { return YIB($this.zJ(OHB(p0, $rt_intcls()))); })(self,index) : null;
      return v;
    } catch (e) {
      alert("Cannot call getValue on " + self + " prop: " + name + " error: " + e);
    }
  }
  var activeGetter = function() { return value; };
  var bnd = {
    'read': function() {
      trigger();
      var r = activeGetter();
      activeGetter = realGetter;
      if (r) try { var br = r.valueOf(); } catch (err) {}
      return br === undefined ? r: br;
    },
    'owner': ret
  };
  if (!readOnly) {
    bnd['write'] = function(val) {
      var self = ret['ko4j'];
      if (!self) return;
      var model = val['ko4j'];
      (function($this, p0, p1) { return YIB($this.fE(OHB(p0, $rt_intcls()), OHB(p1, E))); })(self,index, model ? model : val);
    };
  };
  var cmpt = ko['computed'](bnd);
  cmpt['valueHasMutated'] = function(val) {
    if (arguments.length === 1) activeGetter = function() { return val; };
    trigger['valueHasMutated']();
  };
  ret[name] = cmpt;
}
for (var i = 0; i < propNames.length; i++) {
  koComputed(i, propNames[i], propReadOnly[i], propValues[i]);
}
function koExpose(index, name) {
  ret[name] = function(data, ev) {
    var self = ret['ko4j'];
    if (!self) return;
    (function($this, p0, p1, p2) { return YIB($this.zC(OHB(p0, $rt_intcls()), OHB(p1, E), OHB(p2, E))); })(self,index, data, ev);
  };
}
for (var i = 0; i < funcNames.length; i++) {
  koExpose(i, funcNames[i]);
}
}).call($t,YIB(a),YIB(b),YIB(c),YIB(d),YIB(e));return OHB(result,$rt_voidcls());}
function LMB(){var $r=new VS();FZ($r);return $r;}
function Xv($t){return GJB(Z,0);}
function FZ($t){Wu($t);return;}
function MMB(){var $r=new HI();R2($r);return $r;}
function Ab($t){return GJB(Z,0);}
function R2($t){Wu($t);return;}
function NMB(){var $r=new YG();REB($r);return $r;}
function SGB(a,b){if(a===null){CJB(F());}TD_$clinit();if(a===OIB(TD.aJ)){CJB(OMB());}if(b<0){CJB(PMB());}return EIB(Bh(a),b);}
function REB($t){Wu($t);return;}
function EIB(a,b){if (a.$meta.primitive) {if (a == $rt_bytecls()) {return $rt_createByteArray(b);}if (a == $rt_shortcls()) {return $rt_createShortArray(b);}if (a == $rt_charcls()) {return $rt_createCharArray(b);}if (a == $rt_intcls()) {return $rt_createIntArray(b);}if (a == $rt_longcls()) {return $rt_createLongArray(b);}if (a == $rt_floatcls()) {return $rt_createFloatArray(b);}if (a == $rt_doublecls()) {return $rt_createDoubleArray(b);}if (a == $rt_booleancls()) {return $rt_createBooleanArray(b);}} else {return $rt_createArray(a, b)}}
function QMB(){var $r=new YF();YCB($r);return $r;}
function Fc($t){return GJB(Z,0);}
function YCB($t){Wu($t);return;}
function RMB(){var $r=new EB();H3($r);return $r;}
function Ju($t,a){var b,c,d,e,f,g;b=a.data;c=$t.f();d=b.length;if(d<c){a=SGB(KW(Hh(a)),c);}else{while(c<d){b[c]=null;c=c+1|0;}}e=0;c=$t.k();while(c.q()!=0){f=a.data;g=e+1|0;f[e]=c.n();e=g;}return a;}
function Wj($t){var a,b;a=QJB();DY(a,$rt_s(18));b=$t.k();if(b.q()!=0){DY(a,Zp(b.n()));}while(b.q()!=0){DY(DY(a,$rt_s(19)),Zp(b.n()));}DY(a,$rt_s(14));return Tj(a);}
function H3($t){Wu($t);return;}
function SMB(){var $r=new O();D7($r);return $r;}
function Ul($t,a){CJB(BMB());}
function Jv($t){return TMB($t);}
function Cp($t,a){$t.u($t.f(),a);return 1;}
function Cz($t,a,b){CJB(BMB());}
function D7($t){H3($t);return;}
function S2($t,a,b){CJB(BMB());}
function UMB(a){var $r=new HB();SW($r,a);return $r;}
function VMB(){var $r=new HB();Iy($r);return $r;}
function Kq($t,a){if(a>=0&&a<=$t.fK){return;}CJB(ALB());}
function Jq($t,a){var b;MX($t,a);b=$t.oL.data[a];$t.fK=$t.fK-1|0;while(a<$t.fK){$t.oL.data[a]=$t.oL.data[a+1|0];a=a+1|0;}$t.oL.data[$t.fK]=null;$t.xH=$t.xH+1|0;return b;}
function SW($t,a){D7($t);$t.oL=GJB(E,a);return;}
function MX($t,a){if(a>=0&&a<$t.fK){return;}CJB(ALB());}
function Yb($t,a){if($t.oL.data.length<a){$t.oL=FIB($t.oL,$t.oL.data.length+UFB(5,$t.oL.data.length/2|0)|0);}return;}
function J8($t,a,b){var c;Kq($t,a);Yb($t,$t.fK+1|0);c=$t.fK;while(c>a){$t.oL.data[c]=$t.oL.data[c-1|0];c=c+ -1|0;}$t.oL.data[a]=b;$t.fK=$t.fK+1|0;$t.xH=$t.xH+1|0;return;}
function Uo($t,a){MX($t,a);return $t.oL.data[a];}
function Yg($t){return $t.fK;}
function Iy($t){SW($t,10);return;}
function MZ($t,a,b){var c;MX($t,a);c=$t.oL.data[a];$t.oL.data[a]=b;return c;}
function AW($t,a){a=Jq($t,a);EDB($t);return a;}
function EDB($t){$t.HK.jK().AL(WMB($t));return;}
function CIB(a,b){var c,d,e;c=Ju(a,GJB(E,a.f()));d=0;while(true){e=c.data;if(d>=e.length){break;}a=YW(e[d],b);if(a!==null){e[d]=a;}d=d+1|0;}return Ux(b,c);}
function I4($t){var a,b,c,d;a=Jv($t);if(Ia(a)==0){return $rt_s(20);}b=$rt_s(21);c=QJB();GX(c,91);while(Ia(a)!=0){d=H0(a);DY(c,b);DY(c,IV(d));b=$rt_s(22);}GX(c,93);return Tj(c);}
function Gv($t){return CIB($t,If($t.HK,1));}
function XMB(){var $r=new SO();Ku($r);return $r;}
function Qn($t){return GJB(Z,0);}
function Ku($t){Wu($t);return;}
function YMB(){var $r=new RG();Yf($r);return $r;}
function Fd($t){return GJB(Z,0);}
function Yf($t){Wu($t);return;}
function ZMB(){var $r=new PR();Mq($r);return $r;}
function Pm($t){return GJB(Z,0);}
function Mq($t){Wu($t);return;}
function ANB(a,b,c,d){var $r=new TQ();Cf($r,a,b,c,d);return $r;}
function Vk($t){return $t.hI;}
function Wc($t){var a,b,c;a=$rt_createDoubleArray($t.tJ.data.length/2|0);b=0;while(true){c=a.data;if(b>=c.length){break;}c[b]=$t.tJ.data[(b*2|0)+1|0].h();b=b+1|0;}return a;}
function Cf($t,a,b,c,d){Wu($t);HC_$clinit();$t.aF=Za(HC.qG,b);HC_$clinit();$t.hI=Za(HC.qG,c);$t.tJ=d;return;}
function Xs($t){return $t.aF;}
function Rc($t){return $t.tJ.data[0];}
function BNB(a){var $r=new MB();G1($r,a);return $r;}
function CNB(){var $r=new MB();DCB($r);return $r;}
function G1($t,a){LY($t,a);return;}
function DCB($t){Ws($t);return;}
function DNB(a){var $r=new TI();Ml($r,a);return $r;}
function ENB(){var $r=new TI();P3($r);return $r;}
function Ml($t,a){G1($t,a);return;}
function P3($t){DCB($t);return;}
function FNB(){var $r=new ZS();Tu($r);return $r;}
function KCB($t){return GJB(Z,0);}
function Tu($t){Wu($t);return;}
function GNB(){var $r=new EI();SX($r);return $r;}
function Xl($t){return GJB(Z,0);}
function SX($t){Wu($t);return;}
function HNB(){var $r=new WI();Lq($r);return $r;}
function Gr($t){return GJB(Z,0);}
function Lq($t){Wu($t);return;}
function INB(){var $r=new CJ();Hb($r);return $r;}
function Hb($t){Ba($t);return;}
function JNB(){var $r=new RK();Ut($r);return $r;}
function Ub($t){var a,b,c,d,e;a=GJB(Z,1);b=a.data;c=GJB(UC,1);d=c.data;e=$rt_s(23);d[0]=e;e=KNB(c);b[0]=e;return a;}
function Ut($t){Wu($t);return;}
function LNB(){var $r=new WL();HDB($r);return $r;}
function HDB($t){Wu($t);return;}
function MNB(){var $r=new FP();Qf($r);return $r;}
function Ah($t){return GJB(Z,0);}
function Qf($t){Wu($t);return;}
function NNB(){var $r=new UN();Oe($r);return $r;}
function Ov($t){return GJB(Z,0);}
function Oe($t){Wu($t);return;}
function ONB(){var $r=new AS();Zk($r);return $r;}
function Od($t){return GJB(Z,0);}
function Zk($t){Wu($t);return;}
function PNB(){var $r=new FR();Eg($r);return $r;}
function Su($t){return GJB(Z,0);}
function Eg($t){Wu($t);return;}
function TKB(a,b,c,d){var $r=new PP();PBB($r,a,b,c,d);return $r;}
function Hw($t){if(AHB($t.jG)!==null){GW(AHB($t.jG),$t.VJ,$t.NC,$t.cD);}RW($t.jG,$t.VJ);return;}
function PBB($t,a,b,c,d){$t.jG=a;$t.VJ=b;$t.NC=c;$t.cD=d;Wu($t);return;}
function QNB(){var $r=new JK();Wb($r);return $r;}
function XGB(a){var b,c,d;b=RNB(V9(a));c=OFB(b);d=$rt_createIntArray(c);a=0;while(a<c){d.data[a]=OFB(b);a=a+1|0;}return d;}
function Wb($t){Wu($t);return;}
function SNB(a,b){var $r=new MN();Yl($r,a,b);return $r;}
function VHB(a){return a.yC;}
function Yl($t,a,b){Et($t,a);$t.yC=b;return;}
function UDB($t){var a,b;a=Ou($t);if(a===null){return null;}b=a.ED.hH(0);if(b===null){return null;}if(Dz(b,a.XI)!==a){return null;}return a;}
function TNB(a,b,c){var $r=new JC();Q0($r,a,b,c);return $r;}
function UNB(a,b,c,d){var $r=new JC();S5($r,a,b,c,d);return $r;}
function C5($t,a){var b;if(a!==null){b=a.data.length;if(b!=0&&b>=$t.yB){return;}}CJB(TLB($rt_s(24)));}
function Q0($t,a,b,c){var d;d=$rt_createByteArray(1);d.data[0]=63;S5($t,a,b,c,d);return;}
function I5($t,a){if(a===null){CJB(TLB($rt_s(25)));}$t.NL=a;J6($t,a);return $t;}
function Ig($t,a,b,c){var d,e,f,$je;$ba:{if($t.AJ!=3){if(c!=0){break $ba;}if($t.AJ!=2){break $ba;}}CJB(VNB());}if(c==0){d=1;}else{d=2;}$t.AJ=d;$bb:while(true){try{e=Fg($t,a,b);}catch($e){$je=$e.$javaException;if($je&&$je instanceof K){f=$je;CJB(QLB(f));}else {throw $e;}}if(VZ(e)!=0){if(c==0){return e;}f=Zy(a);if(f<=0){return e;}e=Ag(f);}else if(A2(e)!=0){return e;}if(A3(e)==0){d=$t.RF;}else{d=$t.NL;}$bc:{CC_$clinit();if(d!==CC.YI){CC_$clinit();if(d===CC.wM){break $bc;}else{break $bb;}}if(Zy(b)<$t.bK.data.length)
{ZC_$clinit();return ZC.VL;}Uy(b,$t.bK);}Xy(a,Ef(a)+Jw(e)|0);}return e;}
function S5($t,a,b,c,d){Wu($t);CC_$clinit();$t.RF=CC.JE;CC_$clinit();$t.NL=CC.JE;C5($t,d);$t.RD=a;$t.bK=d.oM();$t.sE=b;$t.yB=c;return;}
function L9($t,a){return;}
function GU($t,a){if(a===null){CJB(TLB($rt_s(25)));}$t.RF=a;L9($t,a);return $t;}
function PW($t,a){ZC_$clinit();return ZC.YJ;}
function J6($t,a){return;}
function YX($t,a){if($t.AJ!=2&&$t.AJ!=4){CJB(VNB());}a=PW($t,a);ZC_$clinit();if(a===ZC.YJ){$t.AJ=3;}return a;}
function WNB(){var $r=new GS();XV($r);return $r;}
function Fq($t){return GJB(Z,0);}
function XV($t){Wu($t);return;}
function XNB(){var $r=new XS();Gq($r);return $r;}
function Z7($t){return GJB(Z,0);}
function Gq($t){Wu($t);return;}
function LC_$clinit(){LC_$clinit=function(){};
Dg=function(){Fk(new YN);return;};
TH=function($t){Wu($t);return;};
Dg();}
function YNB(){var $r=new LC();TH($r);return $r;}
function ZNB(a,b,c,d,e){var $r=new RB();Kf($r,a,b,c,d,e);return $r;}
function Kf($t,a,b,c,d,e){TH($t);$t.HC=a;$t.SI=b;$t.EK=c;$t.CI=d;$t.VF=e;return;}
function QY($t){var a,b,c;a=$t.C();if(a===null){return null;}b=Oi($t.CI,a,$t.EK);c=YW(b,$t.HC);if(c===null){c=b;}return c;}
function AZ($t){return $t.VF;}
function Hq($t){return $t.SI;}
function X4($t,a){var b;b=Ys($t);if(b===null){return;}Gs($t.CI,b,$t.EK,a);return;}
function AOB(a,b,c,d,e,f){var $r=new WT();Nc($r,a,b,c,d,e,f);return $r;}
function Q8($t){return $t.NJ;}
function Nc($t,a,b,c,d,e,f){Kf($t,b,c,d,e,f);$t.NJ=a;return;}
function J5($t){return BOB($t.NJ,$t.HC,$t.SI,$t.EK,$t.CI,$t.VF);}
function COB(){var $r=new FK();MW($r);return $r;}
function SBB($t){return GJB(Z,0);}
function MW($t){Wu($t);return;}
function DOB(){var $r=new ES();Y4($r);return $r;}
function RDB($t){return GJB(Z,0);}
function Y4($t){Wu($t);return;}
function EOB(){var $r=new MJ();Ik($r);return $r;}
function K5($t){var a,b,c,d,e;a=GJB(Z,1);b=a.data;c=GJB(UC,1);d=c.data;e=$rt_s(26);d[0]=e;e=KNB(c);b[0]=e;return a;}
function Ik($t){Wu($t);return;}
function FOB(){var $r=new CR();SDB($r);return $r;}
function Hz($t){return GJB(Z,0);}
function SDB($t){Wu($t);return;}
function GOB(){var $r=new QR();DW($r);return $r;}
function Vo($t){return GJB(Z,0);}
function DW($t){Wu($t);return;}
function HOB(){var $r=new QH();E9($r);return $r;}
function J4($t,a,b,c){CJB(BMB());}
function TEB($t,a){CJB(BMB());}
function Ti($t,a){M9($t,null,a);return;}
function D5($t,a,b,c){var d,e,f,g,h,i,j,k,m,n;d=b.data;e=d.length;f=GJB(UC,e);g=$rt_createBooleanArray(e);h=GJB(E,e);i=0;while(true){j=f.data;if(i>=j.length){break;}k=g.data;j[i]=Hq(d[i]);k[i]=AZ(d[i]);m=QY(d[i]);if(m instanceof TB!=0){m=m.c();}h.data[i]=m;i=i+1|0;}n=c.data;m=GJB(UC,n.length);i=0;while(true){e=m.data;if(i>=e.length){break;}e[i]=Iv(n[i]);i=i+1|0;}i=SV($t);Lj(KMB(a,i,b,c),i,f,g,h,m);return i;}
function M9($t,a,b){b=Dp(a,b);if(b instanceof JE!=0){Oz(b);}return;}
function Bx($t,a,b,c,d){Qc();if(d instanceof TB!=0){d=d.c();}Iz(a,b,c,d);return;}
function Rv($t,a,b,c){CJB(BMB());}
function E9($t){Wu($t);return;}
function SV($t){var a,b,c;a=64;if($t.UC!==null){b=$t.AG;a=$t.UC.data.length;if(b<a){c=$t.UC.data[$t.AG];$t.UC.data[$t.AG]=null;$t.AG=$t.AG+1|0;return c;}}$t.UC=S4(a*2|0);$t.AG=1;b=$t.UC.data[0];$t.UC.data[0]=null;return b;}
function Yj($t,a,b){Qc();Iz(a,b,null,null);return;}
function Y3($t,a){return a;}
function IOB(){var $r=new UO();Qx($r);return $r;}
function Js($t){return GJB(Z,0);}
function Qx($t){Wu($t);return;}
function YB_$clinit(){YB_$clinit=function(){};
Vp=function(a){if(!(a>=48&&a<=57)&&!(a>=97&&a<=122)&&a<65&&a>90){a=0;}else{a=1;}return a;};
Sp=function(a){var b,c;if(K9(a)!=0){CJB(JOB(a));}if(Vp(Hf(a,0))==0){CJB(JOB(a));}b=1;while(b<C(a)){$ba:{c=Hf(a,b);switch(c){case 43:case 45:case 46:case 58:case 95:break;default:if(Vp(c)!=0){break $ba;}else{CJB(JOB(a));}}}b=b+1|0;}return;};
Ea=function(){YB.DB=KOB();Ma(YB.DB,$rt_s(27),LOB());return;};
HL=function($t,a,b){var c,d,e;c=b.data;Wu($t);Sp(a);d=c.length;e=0;while(e<d){Sp(c[e]);e=e+1|0;}$t.RB=a;$t.OI=b.oM();return;};
Ea();}
function MOB(a,b){var $r=new YB();HL($r,a,b);return $r;}
function F5($t,a){return X3($t,a);}
function X3($t,a){return Qk($t.RB,a.RB);}
function NOB(){var $r=new LK();MAB($r);return $r;}
function IIB(){var c='$$constructor$$';FL[c]=Bz;GL[c]=Zd;SS[c]=RX;BU[c]=N6;VD[c]=SH;GB[c]=ET;YQ[c]=Dj;VB[c]=Ws;LM[c]=Jp;CS[c]=Kx;YP[c]=Zr;PM[c]=E0;NN[c]=W8;YR[c]=WCB;TK[c]=Dk;OP[c]=Uc;RL[c]=Kz;AH[c]=SAB;OG[c]=Vj;GN[c]=Bm;PB[c]=Dy;NS[c]=Ih;YT[c]=Kc;WR[c]=W5;PK[c]=Ee;ST[c]=Yi;KM[c]=K2;XD[c]=AP;DT[c]=Z8;KR[c]=CZ;VS[c]=FZ;HI[c]=R2;YG[c]=REB;YF[c]=YCB;SO[c]=Ku;RG[c]=Yf;PR[c]=Mq;TI[c]=P3;EB[c]=H3;ZS[c]=Tu;EI[c]=SX;WI[c]=Lq;CJ[c]=Hb;RK[c]=Ut;WL[c]=HDB;FP[c]=Qf;UN[c]=Oe;AS[c]=Zk;FR[c]=Eg;JK[c]=Wb;GS[c]=XV;XS[c]=Gq;FK[c]
=MW;ES[c]=Y4;MJ[c]=Ik;CR[c]=SDB;QR[c]=DW;QH[c]=E9;UO[c]=Qx;LK[c]=MAB;Q[c]=NJ;PT[c]=KZ;VM[c]=Hs;QP[c]=Hd;TP[c]=JW;JH[c]=Jk;LQ[c]=Wn;IO[c]=U2;NF[c]=Zl;VQ[c]=HCB;QF[c]=Qb;UI[c]=G2;QJ[c]=L3;BS[c]=UY;CN[c]=Rw;BN[c]=Cx;EN[c]=Dc;FN[c]=Ga;WQ[c]=WEB;MM[c]=H7;YO[c]=LCB;VP[c]=Lx;EO[c]=YU;UT[c]=Dv;FJ[c]=Pt;DI[c]=Lk;P[c]=Kl;QL[c]=Cn;AT[c]=Tr;CU[c]=Xt;VR[c]=BDB;XI[c]=Xx;BF[c]=X8;W[c]=En;FQ[c]=LW;HR[c]=U0;UH[c]=Zc;HB[c]=Iy;ZH[c]=Ns;ZP[c]=AV;US[c]=X9;UC[c]=GG;HJ[c]=Zz;CK[c]=ODB;YH[c]=Gw;SP[c]=Aa;DO[c]=Pn;K[c]=Ba;LC[c]=TH;YN[c]
=Fk;PE[c]=CQ;JT[c]=C6;HN[c]=O2;DU[c]=Yp;JS[c]=Cg;MQ[c]=N0;NO[c]=RV;HG[c]=Xj;WH[c]=Vl;TS[c]=Ly;WS[c]=BY;DK[c]=Ld;OF[c]=Zm;LN[c]=Pf;SQ[c]=Bd;UL[c]=WDB;JR[c]=Pd;BJ[c]=MEB;XT[c]=Sh;XO[c]=Kh;GQ[c]=F9;KN[c]=Qo;UM[c]=AAB;GD[c]=Xu;AG[c]=RY;HK[c]=Lr;SI[c]=Ot;MT[c]=Sg;QQ[c]=Io;TT[c]=AEB;IR[c]=G4;DL[c]=Gi;AL[c]=VAB;OQ[c]=Mz;T[c]=Jm;NQ[c]=Pi;KJ[c]=U7;QT[c]=Fl;EP[c]=A8;II[c]=Ru;RQ[c]=Mg;LR[c]=YBB;XQ[c]=O9;AR[c]=P2;U[c]=HU;NH[c]=Jd;GF[c]=Wf;DP[c]=N4;VJ[c]=EBB;RR[c]=Gp;YK[c]=Gn;AO[c]=I8;IQ[c]=R6;UQ[c]=B4;PC[c]=Pu;TL[c]=Vn;SC[c]
=Rl;IM[c]=Qr;JD[c]=KEB;GP[c]=EX;LH[c]=R4;ZO[c]=N8;LJ[c]=ZU;WM[c]=Pz;PN[c]=C7;AU[c]=Dd;XF[c]=Bn;NL[c]=YZ;CH[c]=BBB;XR[c]=P5;GO[c]=Mb;JQ[c]=T2;PH[c]=Zv;DM[c]=L6;RF[c]=B8;BC[c]=SK;IP[c]=LBB;EL[c]=EAB;IH[c]=ZBB;LI[c]=BV;V[c]=RP;SR[c]=M3;QC[c]=HS;KF[c]=Qe;LL[c]=Lz;KG[c]=No;RN[c]=Gb;OR[c]=Ep;HF[c]=Dl;MB[c]=DCB;UP[c]=IZ;WJ[c]=De;WO[c]=RAB;KT[c]=Ae;SF[c]=Xz;AK[c]=Sy;OJ[c]=P1;DG[c]=Yy;VF[c]=T6;BP[c]=Co;VN[c]=Ei;DC[c]=VI;HO[c]=E3;WG[c]=Vw;VG[c]=BX;GJ[c]=Z5;KP[c]=Go;RM[c]=KX;LO[c]=NZ;FI[c]=LDB;ZR[c]=Ur;FC[c]=PG;JN[c]=
Sr;OT[c]=S6;LP[c]=Fs;ZE[c]=AN;NI[c]=V5;WC[c]=Nj;GH[c]=Ed;JJ[c]=XX;NM[c]=Db;PI[c]=YAB;XM[c]=Im;OM[c]=Pr;QM[c]=IEB;WP[c]=J9;FO[c]=Ey;ML[c]=TCB;EH[c]=Bi;BT[c]=TW;FT[c]=Lb;UK[c]=CFB;IT[c]=J0;MG[c]=CCB;AJ[c]=Cu;HH[c]=Sk;CT[c]=Ss;RI[c]=Z2;RT[c]=Kj;KB[c]=Cs;MH[c]=Gj;OS[c]=Gg;E[c]=Wu;DH[c]=S3;ZF[c]=W6;LF[c]=Te;KH[c]=NDB;XK[c]=Ct;ZB[c]=YJ;QK[c]=Nn;JG[c]=A5;BG[c]=JEB;KO[c]=Mx;SJ[c]=Lw;VT[c]=Em;VO[c]=Of;ZJ[c]=Ny;TD[c]=KQ;CP[c]=H8;WK[c]=B0;KS[c]=W0;DR[c]=X1;BQ[c]=Dr;RO[c]=Xa;SB[c]=V0;ZI[c]=Ji;EJ[c]=Cj;OL[c]=Fh;TR[c]=LEB;ZN[c]
=O7;VH[c]=Tz;CG[c]=T0;MS[c]=Yv;BM[c]=Dh;M[c]=F6;FU[c]=Vh;DD[c]=IW;LT[c]=Mr;NT[c]=ZZ;FF[c]=Yq;JI[c]=Vc;QS[c]=Cm;IJ[c]=Xd;BO[c]=F1;VK[c]=F2;PJ[c]=Fy;AF[c]=CY;ON[c]=MDB;SG[c]=Iu;QI[c]=Ec;MI[c]=KU;O[c]=D7;MF[c]=TDB;QO[c]=V2;QN[c]=L8;LS[c]=XCB;EG[c]=EY;IF[c]=IBB;FS[c]=N5;JP[c]=FBB;MO[c]=H5;ZT[c]=Am;KL[c]=F4;IL[c]=Zb;ER[c]=T4;GK[c]=Fr;EQ[c]=S9;MK[c]=Fp;ZQ[c]=VEB;PS[c]=Rs;JL[c]=G0;BK[c]=Gd;NP[c]=PV;IN[c]=JBB;XN[c]=Bt;LB[c]=Qj;HM[c]=R7;PL[c]=Zs;PF[c]=VU;FH[c]=Wo;CB[c]=YM;JM[c]=AY;TN[c]=Gz;WFB=WIB;}
function KIB(){return window.$rt_nextId();}
function BHB(a){return window.String.fromCharCode(a);}
function WIB(a){if($rt_resuming()){var $r = $rt_nativeThread().pop();a.$$constructor$$($r);return $r;}if(!a.hasOwnProperty('$$constructor$$')){return null;}var $r=new a();a.$$constructor$$($r);if($rt_suspending()){return $rt_nativeThread().push($r);}return $r;}
function JGB(){return window;}
function WFB(a){IIB();return WIB(a);}
function LHB(a){var c='$$annotations$$';XJ[c]=OOB();IC[c]=POB();KI[c]=QOB();AD[c]=SJB();AC[c]=ROB();VD[c]=ULB();GB[c]=SOB();LG[c]=LMB();GC[c]=TOB();VB[c]=UOB();HT[c]=VOB();CS[c]=WOB();N[c]=XOB();ID[c]=FNB();RL[c]=COB();PB[c]=FLB();YD[c]=YOB();NS[c]=ZOB();YI[c]=MLB();NB[c]=APB();DE[c]=GNB();XD[c]=BPB();DT[c]=CPB();CF[c]=DPB();JE[c]=EPB();YG[c]=FPB();SL[c]=GPB();J[c]=HPB();TQ[c]=IPB();TI[c]=JPB();EB[c]=KPB();YE[c]=XNB();CJ[c]=LPB();WL[c]=MPB();PP[c]=NPB();JK[c]=YMB();MN[c]=GOB();JC[c]=OPB();Z[c]=PPB();WT[c]=HNB();QH[c]
=EOB();GE[c]=QPB();YB[c]=RPB();LK[c]=SPB();CC[c]=TPB();Q[c]=UPB();HC[c]=LLB();SM[c]=VPB();FB[c]=CLB();PT[c]=WPB();MP[c]=XPB();OH[c]=YPB();HP[c]=ZPB();KD[c]=AQB();UI[c]=BQB();BS[c]=CQB();CN[c]=DQB();BN[c]=EQB();EN[c]=FQB();JB[c]=GQB();FN[c]=HQB();IS[c]=IQB();MR[c]=JQB();P[c]=KQB();DQ[c]=XLB();AT[c]=LQB();CU[c]=MQB();SD[c]=NQB();W[c]=OQB();FD[c]=MMB();HR[c]=PQB();HB[c]=QQB();ZP[c]=RQB();OI[c]=DKB();UC[c]=DOB();KE[c]=SQB();TM[c]=TQB();OE[c]=UQB();CI[c]=VQB();UE[c]=WQB();K[c]=XQB();LC[c]=YQB();YN[c]=ILB();PE[c]
=ZQB();JT[c]=ARB();RE[c]=BRB();DU[c]=CRB();VC[c]=DRB();WS[c]=PNB();PO[c]=ERB();OF[c]=FRB();UL[c]=GRB();JR[c]=HRB();KC[c]=ZMB();GD[c]=IRB();QD[c]=JRB();X[c]=KRB();IR[c]=LRB();DL[c]=MRB();AL[c]=NRB();OQ[c]=ORB();T[c]=PRB();RB[c]=QRB();DN[c]=RRB();TE[c]=SRB();CD[c]=TRB();II[c]=URB();ME[c]=VRB();CL[c]=WRB();BL[c]=XRB();AR[c]=DLB();NE[c]=YRB();U[c]=FMB();CM[c]=ZRB();R[c]=ASB();DP[c]=BSB();MD[c]=NNB();ZD[c]=CSB();NR[c]=IOB();MC[c]=DSB();PC[c]=ESB();SC[c]=WLB();IM[c]=FSB();JD[c]=GSB();PN[c]=HSB();WE[c]=ISB();RD[c]
=JSB();WD[c]=KSB();JQ[c]=LSB();RF[c]=MSB();BC[c]=NSB();IP[c]=OSB();IH[c]=PSB();V[c]=QSB();QC[c]=VLB();OR[c]=JNB();MB[c]=RSB();UP[c]=SSB();FE[c]=TSB();WJ[c]=USB();AI[c]=VSB();DC[c]=WSB();LE[c]=XSB();SN[c]=YSB();VG[c]=ZSB();Y[c]=ATB();RM[c]=BTB();XE[c]=CTB();FI[c]=GLB();OC[c]=DTB();FC[c]=ETB();OT[c]=FTB();TG[c]=GTB();IB[c]=FOB();RC[c]=HTB();OK[c]=ITB();ZE[c]=JTB();RJ[c]=KTB();WC[c]=LTB();IG[c]=MTB();AE[c]=KLB();OD[c]=NTB();UB[c]=OTB();LD[c]=PTB();PQ[c]=QTB();WF[c]=RTB();S[c]=MNB();FO[c]=STB();UK[c]=TTB();BI[c]
=UTB();HD[c]=VTB();AJ[c]=WTB();KB[c]=XTB();BD[c]=YTB();E[c]=ZTB();OB[c]=AUB();WB[c]=SKB();ZB[c]=BUB();QE[c]=CUB();SJ[c]=WJB();TD[c]=DUB();IE[c]=EUB();NC[c]=FUB();RO[c]=GUB();SB[c]=HUB();XP[c]=IUB();VL[c]=ONB();DB[c]=JUB();XC[c]=KUB();NG[c]=LUB();EE[c]=MUB();RH[c]=NUB();TR[c]=EKB();XH[c]=OUB();JF[c]=JKB();M[c]=PUB();FU[c]=QUB();DD[c]=RUB();SE[c]=SUB();ND[c]=TUB();YS[c]=UUB();IJ[c]=QMB();JO[c]=VUB();ZG[c]=WUB();L[c]=XUB();UR[c]=YUB();YC[c]=ZUB();SG[c]=AVB();O[c]=BVB();VE[c]=CVB();TC[c]=DVB();YL[c]=EVB();BR[c]
=FVB();XL[c]=HLB();TB[c]=GVB();QO[c]=HVB();UD[c]=IVB();AB[c]=JVB();DJ[c]=KVB();ED[c]=LVB();PD[c]=MVB();NK[c]=NVB();PS[c]=OVB();BE[c]=PVB();ZC[c]=XMB();GR[c]=QVB();BB[c]=RVB();XB[c]=SVB();QB[c]=WNB();LB[c]=TVB();HM[c]=UVB();HE[c]=RLB();CB[c]=VVB();CE[c]=WVB();LHB=function(cls){if(!cls.hasOwnProperty(c)){return null;}return cls[c].b();};return LHB(a);}
function FFB(a){var copy=new a.constructor();for(var field in a){if(!a.hasOwnProperty(field)){continue;}copy[field]=a[field];}return copy;}
function IHB(a,b){return window.setTimeout(function(){BGB(a);},b);}
function GGB(a){switch ($rt_ustr(a)) {case "net.java.html.BrwsrCtx$1Wrap": XJ.$clinit(); return XJ;case "java.lang.Integer$$__annotations__$$": FL.$clinit(); return FL;case "org.netbeans.html.json.spi.Proto$Type": IC.$clinit(); return IC;case "java.util.LinkedList$Entry$$__annotations__$$": GL.$clinit(); return GL;case "java.nio.charset.impl.BufferedEncoder$Controller": KI.$clinit(); return KI;case "java.lang.Integer": AD.$clinit(); return AD;case "net.java.html.charts.Color$$__annotations__$$": SS.$clinit(); return SS;case "net.java.html.charts.ChartListener": AC.$clinit(); return AC;case "java.lang.ref.ReferenceQueue$$__annotations__$$": BU.$clinit(); return BU;case "org.netbeans.html.json.impl.JSON$EmptyTech": VD.$clinit(); return VD;case "java.lang.Thread": GB.$clinit(); return GB;case "org.teavm.platform.PlatformQueue": LG.$clinit(); return LG;case "java.util.LinkedList$SequentialListIterator$$__annotations__$$": YQ.$clinit(); return YQ;case "java.lang.CharSequence": GC.$clinit(); return GC;case "java.lang.LinkageError": VB.$clinit(); return VB;case "java.lang.annotation.RetentionPolicy$$__annotations__$$": LM.$clinit(); return LM;case "org.netbeans.html.json.spi.Proto": HT.$clinit(); return HT;case "java.lang.StringIndexOutOfBoundsException": CS.$clinit(); return CS;case "java.io.Serializable": N.$clinit(); return N;case "java.lang.ref.WeakReference$$__annotations__$$": YP.$clinit(); return YP;case "java.lang.NoClassDefFoundError$$__annotations__$$": PM.$clinit(); return PM;case "java.nio.ByteOrder": ID.$clinit(); return ID;case "java.lang.ReflectiveOperationException$$__annotations__$$": NN.$clinit(); return NN;case "java.lang.InstantiationException$$__annotations__$$": YR.$clinit(); return YR;case "java.lang.Object$1$$__annotations__$$": TK.$clinit(); return TK;case "org.netbeans.html.json.spi.PropertyBinding$1$$__annotations__$$": OP.$clinit(); return OP;case "java.lang.FunctionalInterface$$_impl": RL.$clinit(); return RL;case "org.netbeans.html.context.spi.Contexts$Provider$$__annotations__$$": AH.$clinit(); return AH;case "java.lang.Boolean$$__annotations__$$": OG.$clinit(); return OG;case "java.nio.charset.CoderMalfunctionError$$__annotations__$$": GN.$clinit(); return GN;case "java.lang.ReflectiveOperationException": PB.$clinit(); return PB;case "org.netbeans.html.context.spi.Contexts$Id": YD.$clinit(); return YD;case "java.lang.ClassCastException": NS.$clinit(); return NS;case "java.nio.charset.CoderMalfunctionError": YI.$clinit(); return YI;case "org.teavm.jso.core.JSArrayReader$$__annotations__$$": YT.$clinit(); return YT;case "java.nio.Buffer": NB.$clinit(); return NB;case "org.netbeans.html.json.impl.JSON$EmptyTech$$__annotations__$$": WR.$clinit(); return WR;case "java.io.Flushable": DE.$clinit(); return DE;case "org.netbeans.html.json.spi.Observers$$__annotations__$$": PK.$clinit(); return PK;case "java.lang.IndexOutOfBoundsException$$__annotations__$$": ST.$clinit(); return ST;case "org.netbeans.html.context.impl.CtxImpl$$__annotations__$$": KM.$clinit(); return KM;case "com.dukescript.charts.sample.Data": XD.$clinit(); return XD;case "java.nio.ReadOnlyBufferException": DT.$clinit(); return DT;case "com.dukescript.charts.sample.ChartModel$AddSegment": CF.$clinit(); return CF;case "java.io.OutputStream$$__annotations__$$": KR.$clinit(); return KR;case "org.netbeans.html.ko4j.Knockout": JE.$clinit(); return JE;case "org.teavm.platform.PlatformQueue$$__annotations__$$": VS.$clinit(); return VS;case "org.netbeans.html.json.spi.WSTransfer$$__annotations__$$": HI.$clinit(); return HI;case "java.lang.reflect.Array": YG.$clinit(); return YG;case "java.lang.NumberFormatException$$__annotations__$$": YF.$clinit(); return YF;case "org.netbeans.html.json.impl.JSONList": SL.$clinit(); return SL;case "java.nio.charset.CoderResult$$__annotations__$$": SO.$clinit(); return SO;case "org.teavm.classlib.impl.unicode.UnicodeHelper$$__annotations__$$": RG.$clinit(); return RG;case "org.teavm.platform.PlatformAnnotationProvider": J.$clinit(); return J;case "java.nio.CharBuffer$$__annotations__$$": PR.$clinit(); return PR;case "net.java.html.charts.ChartEvent": TQ.$clinit(); return TQ;case "java.lang.NoSuchFieldError": TI.$clinit(); return TI;case "java.util.AbstractCollection": EB.$clinit(); return EB;case "java.nio.ByteOrder$$__annotations__$$": ZS.$clinit(); return ZS;case "java.io.Flushable$$__annotations__$$": EI.$clinit(); return EI;case "org.netbeans.html.json.spi.PropertyBinding$Impl$$__annotations__$$": WI.$clinit(); return WI;case "java.lang.Readable": YE.$clinit(); return YE;case "java.lang.SecurityException": CJ.$clinit(); return CJ;case "org.netbeans.html.ko4j.KOSockets$$__annotations__$$": RK.$clinit(); return RK;case "org.teavm.jso.impl.JS": WL.$clinit(); return WL;case "java.util.logging.Level$$__annotations__$$": FP.$clinit(); return FP;case "java.nio.charset.impl.BufferedEncoder$$__annotations__$$": UN.$clinit(); return UN;case "java.util.HashMap$1$$__annotations__$$": AS.$clinit(); return AS;case "org.teavm.html4j.JavaScriptConv$$__annotations__$$": FR.$clinit(); return FR;case "org.netbeans.html.json.spi.Proto$2": PP.$clinit(); return PP;case "org.teavm.classlib.impl.unicode.UnicodeHelper": JK.$clinit(); return JK;case "org.netbeans.html.json.spi.Observers$Ref": MN.$clinit(); return MN;case "java.nio.charset.CharsetEncoder": JC.$clinit(); return JC;case "java.lang.annotation.Annotation": Z.$clinit(); return Z;case "org.netbeans.html.json.spi.Technology$$__annotations__$$": GS.$clinit(); return GS;case "java.lang.Readable$$__annotations__$$": XS.$clinit(); return XS;case "org.netbeans.html.json.spi.PropertyBinding$Impl": WT.$clinit(); return WT;case "java.lang.FunctionalInterface$$_impl$$__annotations__$$": FK.$clinit(); return FK;case "java.lang.String$$__annotations__$$": ES.$clinit(); return ES;case "org.netbeans.html.ko4j.KOTech$$__annotations__$$": MJ.$clinit(); return MJ;case "java.util.Collection$$__annotations__$$": CR.$clinit(); return CR;case "org.netbeans.html.json.spi.Observers$Ref$$__annotations__$$": QR.$clinit(); return QR;case "org.netbeans.html.ko4j.KOTech": QH.$clinit(); return QH;case "java.lang.FunctionalInterface": GE.$clinit(); return GE;case "org.netbeans.html.json.spi.FunctionBinding$Impl$$__annotations__$$": UO.$clinit(); return UO;case "java.nio.charset.Charset": YB.$clinit(); return YB;case "org.teavm.platform.Platform": LK.$clinit(); return LK;case "java.nio.charset.CodingErrorAction": CC.$clinit(); return CC;case "java.lang.AbstractStringBuilder": Q.$clinit(); return Q;case "java.lang.Boolean": HC.$clinit(); return HC;case "java.nio.charset.IllegalCharsetNameException": SM.$clinit(); return SM;case "java.lang.ref.WeakReference": FB.$clinit(); return FB;case "java.util.NoSuchElementException": PT.$clinit(); return PT;case "org.netbeans.html.json.spi.Technology$ValueMutated$$__annotations__$$": VM.$clinit(); return VM;case "java.io.PrintStream": MP.$clinit(); return MP;case "org.teavm.platform.async.AsyncCallback$$__annotations__$$": QP.$clinit(); return QP;case "com.dukescript.charts.sample.BrowserMain$$__annotations__$$": TP.$clinit(); return TP;case "java.util.HashSet$$__annotations__$$": JH.$clinit(); return JH;case "java.util.AbstractSequentialList$$__annotations__$$": LQ.$clinit(); return LQ;case "java.lang.Runnable$$__annotations__$$": IO.$clinit(); return IO;case "java.util.concurrent.Executor$$__annotations__$$": NF.$clinit(); return NF;case "org.netbeans.html.json.spi.FunctionBinding$$__annotations__$$": VQ.$clinit(); return VQ;case "java.lang.Cloneable$$__annotations__$$": QF.$clinit(); return QF;case "net.java.html.charts.Values$Set": OH.$clinit(); return OH;case "java.lang.Class": HP.$clinit(); return HP;case "java.lang.Float": KD.$clinit(); return KD;case "java.util.Arrays": UI.$clinit(); return UI;case "java.lang.NoSuchFieldError$$__annotations__$$": QJ.$clinit(); return QJ;case "java.lang.ConsoleOutputStreamStdout": BS.$clinit(); return BS;case "java.util.Collections$5": CN.$clinit(); return CN;case "java.util.Collections$6": BN.$clinit(); return BN;case "java.util.Collections$3": EN.$clinit(); return EN;case "java.lang.Character": JB.$clinit(); return JB;case "java.util.Collections$1": FN.$clinit(); return FN;case "java.util.Queue$$__annotations__$$": WQ.$clinit(); return WQ;case "net.java.html.charts.Chart$ChartList": IS.$clinit(); return IS;case "org.netbeans.html.json.spi.Technology$ApplyId$$__annotations__$$": MM.$clinit(); return MM;case "org.netbeans.html.ko4j.KO4J$$__annotations__$$": YO.$clinit(); return YO;case "java.nio.CharBufferOverArray": MR.$clinit(); return MR;case "java.lang.Object$Monitor$$__annotations__$$": VP.$clinit(); return VP;case "org.netbeans.html.context.impl.CtxImpl$Bind$$__annotations__$$": EO.$clinit(); return EO;case "java.nio.charset.Charset$$__annotations__$$": UT.$clinit(); return UT;case "java.lang.Long$$__annotations__$$": FJ.$clinit(); return FJ;case "java.lang.Double$$__annotations__$$": DI.$clinit(); return DI;case "java.lang.Exception": P.$clinit(); return P;case "org.netbeans.html.json.impl.Bindings$$__annotations__$$": QL.$clinit(); return QL;case "org.netbeans.html.context.impl.CtxImpl": DQ.$clinit(); return DQ;case "java.lang.String$1": AT.$clinit(); return AT;case "org.netbeans.html.context.spi.Contexts": CU.$clinit(); return CU;case "org.netbeans.html.json.spi.PropertyBinding$Weak$$__annotations__$$": VR.$clinit(); return VR;case "java.lang.reflect.AnnotatedElement": SD.$clinit(); return SD;case "java.util.ConcurrentModificationException$$__annotations__$$": XI.$clinit(); return XI;case "java.lang.annotation.Retention$$__annotations__$$": BF.$clinit(); return BF;case "java.lang.Error": W.$clinit(); return W;case "org.netbeans.html.json.spi.WSTransfer": FD.$clinit(); return FD;case "java.lang.ConsoleOutputStreamStdout$$__annotations__$$": FQ.$clinit(); return FQ;case "java.lang.AssertionError": HR.$clinit(); return HR;case "java.util.Random$$__annotations__$$": UH.$clinit(); return UH;case "java.util.ArrayList": HB.$clinit(); return HB;case "java.lang.String$1$$__annotations__$$": ZH.$clinit(); return ZH;case "java.lang.IllegalMonitorStateException": ZP.$clinit(); return ZP;case "net.java.html.charts.Color": OI.$clinit(); return OI;case "org.teavm.platform.plugin.ResourceAccessor$$__annotations__$$": US.$clinit(); return US;case "java.lang.String": UC.$clinit(); return UC;case "org.teavm.jso.dom.events.FocusEventTarget": KE.$clinit(); return KE;case "org.teavm.jso.dom.events.EventTarget$$__annotations__$$": HJ.$clinit(); return HJ;case "java.nio.charset.impl.UTF8Encoder": TM.$clinit(); return TM;case "java.util.AbstractCollection$$__annotations__$$": CK.$clinit(); return CK;case "java.util.concurrent.Executor": OE.$clinit(); return OE;case "org.teavm.classlib.impl.CharFlow$$__annotations__$$": YH.$clinit(); return YH;case "net.java.html.js.JavaScriptResource": CI.$clinit(); return CI;case "java.util.Collections$$__annotations__$$": SP.$clinit(); return SP;case "org.netbeans.html.json.spi.Technology$BatchInit": UE.$clinit(); return UE;case "java.util.AbstractSet$$__annotations__$$": DO.$clinit(); return DO;case "java.lang.RuntimeException": K.$clinit(); return K;case "org.netbeans.html.json.spi.PropertyBinding": LC.$clinit(); return LC;case "org.netbeans.html.json.spi.PropertyBinding$1": YN.$clinit(); return YN;case "org.netbeans.html.json.impl.JSON": PE.$clinit(); return PE;case "java.nio.charset.impl.UTF8Charset": JT.$clinit(); return JT;case "java.util.logging.Logger$$__annotations__$$": HN.$clinit(); return HN;case "org.teavm.jso.dom.events.KeyboardEventTarget": RE.$clinit(); return RE;case "java.lang.ClassNotFoundException": DU.$clinit(); return DU;case "net.java.html.charts.Values$Set$$__annotations__$$": JS.$clinit(); return JS;case "java.nio.BufferUnderflowException$$__annotations__$$": MQ.$clinit(); return MQ;case "org.netbeans.html.ko4j.Knockout$$__annotations__$$": NO.$clinit(); return NO;case "java.lang.Error$$__annotations__$$": HG.$clinit(); return HG;case "java.util.Arrays$$__annotations__$$": WH.$clinit(); return WH;case "java.util.HashMap$AbstractMapIterator": VC.$clinit(); return VC;case "java.lang.ClassNotFoundException$$__annotations__$$": TS.$clinit(); return TS;case "org.teavm.html4j.JavaScriptConv": WS.$clinit(); return WS;case "java.io.Closeable$$__annotations__$$": DK.$clinit(); return DK;case "java.lang.annotation.Target$$_impl": PO.$clinit(); return PO;case "java.lang.NullPointerException": OF.$clinit(); return OF;case "org.netbeans.html.context.impl.CtxImpl$BindCompare$$__annotations__$$": LN.$clinit(); return LN;case "net.java.html.BrwsrCtx$$__annotations__$$": SQ.$clinit(); return SQ;case "java.lang.Object$Monitor": UL.$clinit(); return UL;case "java.lang.Math": JR.$clinit(); return JR;case "java.nio.ByteBufferImpl$$__annotations__$$": BJ.$clinit(); return BJ;case "java.lang.ThreadLocal$$__annotations__$$": XT.$clinit(); return XT;case "java.util.List$$__annotations__$$": XO.$clinit(); return XO;case "java.nio.CharBuffer": KC.$clinit(); return KC;case "org.teavm.jso.dom.events.FocusEventTarget$$__annotations__$$": GQ.$clinit(); return GQ;case "java.util.Collections$5$$__annotations__$$": KN.$clinit(); return KN;case "java.util.AbstractMap$$__annotations__$$": UM.$clinit(); return UM;case "java.util.AbstractSequentialList": GD.$clinit(); return GD;case "org.netbeans.html.json.spi.FunctionBinding$AImpl$1Dispatch$$__annotations__$$": AG.$clinit(); return AG;case "java.util.List": QD.$clinit(); return QD;case "java.lang.Thread$$__annotations__$$": HK.$clinit(); return HK;case "java.lang.UnsupportedOperationException$$__annotations__$$": SI.$clinit(); return SI;case "java.nio.charset.CodingErrorAction$$__annotations__$$": MT.$clinit(); return MT;case "java.lang.Object$2$$__annotations__$$": QQ.$clinit(); return QQ;case "java.nio.charset.impl.UTF8Encoder$$__annotations__$$": TT.$clinit(); return TT;case "org.teavm.jso.dom.events.EventTarget": X.$clinit(); return X;case "java.lang.ConsoleInputStream": IR.$clinit(); return IR;case "java.util.Collections$19": DL.$clinit(); return DL;case "java.util.Collections$12": AL.$clinit(); return AL;case "java.nio.BufferOverflowException": OQ.$clinit(); return OQ;case "java.util.AbstractSet": T.$clinit(); return T;case "org.netbeans.html.json.spi.PropertyBinding$AImpl": RB.$clinit(); return RB;case "java.util.Map$$__annotations__$$": NQ.$clinit(); return NQ;case "org.teavm.platform.Platform$$__annotations__$$": KJ.$clinit(); return KJ;case "net.java.html.charts.Chart": DN.$clinit(); return DN;case "java.util.Deque": TE.$clinit(); return TE;case "java.lang.Iterable": CD.$clinit(); return CD;case "java.util.Collections$1$$__annotations__$$": QT.$clinit(); return QT;case "java.util.Collections$3$$__annotations__$$": EP.$clinit(); return EP;case "com.dukescript.charts.sample.BrowserMain": II.$clinit(); return II;case "org.teavm.platform.async.AsyncCallback": ME.$clinit(); return ME;case "org.teavm.platform.PlatformAnnotationProvider$$__annotations__$$": RQ.$clinit(); return RQ;case "java.util.Collections$10": CL.$clinit(); return CL;case "java.util.Collections$11": BL.$clinit(); return BL;case "java.util.logging.LogRecord$$__annotations__$$": LR.$clinit(); return LR;case "java.lang.IllegalMonitorStateException$$__annotations__$$": XQ.$clinit(); return XQ;case "java.lang.NoClassDefFoundError": AR.$clinit(); return AR;case "net.java.html.charts.Listeners": NE.$clinit(); return NE;case "java.io.OutputStream": U.$clinit(); return U;case "java.lang.AbstractStringBuilder$$__annotations__$$": NH.$clinit(); return NH;case "org.netbeans.html.ko4j.KOTransfer$$__annotations__$$": GF.$clinit(); return GF;case "org.teavm.classlib.impl.CharFlow": CM.$clinit(); return CM;case "java.lang.annotation.ElementType": R.$clinit(); return R;case "java.nio.BufferUnderflowException": DP.$clinit(); return DP;case "java.io.FilterOutputStream$$__annotations__$$": VJ.$clinit(); return VJ;case "java.lang.SystemClassLoader$$__annotations__$$": RR.$clinit(); return RR;case "org.netbeans.html.json.spi.Observers$Watcher$$__annotations__$$": YK.$clinit(); return YK;case "java.nio.charset.impl.BufferedEncoder": MD.$clinit(); return MD;case "org.netbeans.html.json.spi.Technology$ValueMutated": ZD.$clinit(); return ZD;case "org.netbeans.html.json.spi.FunctionBinding$Impl": NR.$clinit(); return NR;case "java.io.Closeable": MC.$clinit(); return MC;case "java.util.Collections$12$$__annotations__$$": AO.$clinit(); return AO;case "java.util.MapEntry$$__annotations__$$": IQ.$clinit(); return IQ;case "java.lang.CharSequence$$__annotations__$$": UQ.$clinit(); return UQ;case "java.io.InputStream": PC.$clinit(); return PC;case "java.util.Collections$10$$__annotations__$$": TL.$clinit(); return TL;case "java.lang.IndexOutOfBoundsException": SC.$clinit(); return SC;case "com.dukescript.charts.sample.Data$Html4JavaType": IM.$clinit(); return IM;case "org.netbeans.html.json.spi.FunctionBinding": JD.$clinit(); return JD;case "java.lang.FunctionalInterface$$__annotations__$$": GP.$clinit(); return GP;case "org.teavm.jso.JSObject$$__annotations__$$": LH.$clinit(); return LH;case "java.lang.ConsoleOutputStreamStderr$$__annotations__$$": ZO.$clinit(); return ZO;case "java.util.NoSuchElementException$$__annotations__$$": LJ.$clinit(); return LJ;case "org.netbeans.html.json.spi.Transfer$$__annotations__$$": WM.$clinit(); return WM;case "java.lang.CloneNotSupportedException": PN.$clinit(); return PN;case "java.lang.annotation.Target$$_impl$$__annotations__$$": AU.$clinit(); return AU;case "java.lang.Long": WE.$clinit(); return WE;case "java.util.Map": RD.$clinit(); return RD;case "org.netbeans.html.context.spi.Contexts$Id$$_impl$$__annotations__$$": XF.$clinit(); return XF;case "java.lang.LinkageError$$__annotations__$$": NL.$clinit(); return NL;case "org.teavm.jso.dom.events.LoadEventTarget": WD.$clinit(); return WD;case "java.util.ArrayList$$__annotations__$$": CH.$clinit(); return CH;case "java.lang.Appendable$$__annotations__$$": XR.$clinit(); return XR;case "net.java.html.charts.Config$$__annotations__$$": GO.$clinit(); return GO;case "org.teavm.classlib.impl.Base46": JQ.$clinit(); return JQ;case "java.lang.Enum$$__annotations__$$": PH.$clinit(); return PH;case "java.util.HashMap$HashEntry$$__annotations__$$": DM.$clinit(); return DM;case "java.lang.StringBuilder": RF.$clinit(); return RF;case "java.lang.ClassLoader": BC.$clinit(); return BC;case "java.util.ConcurrentModificationException": IP.$clinit(); return IP;case "java.util.ServiceLoader$1$$__annotations__$$": EL.$clinit(); return EL;case "org.netbeans.html.ko4j.KOTransfer": IH.$clinit(); return IH;case "org.teavm.jso.browser.Window$$__annotations__$$": LI.$clinit(); return LI;case "com.dukescript.charts.sample.ChartModel": V.$clinit(); return V;case "net.java.html.charts.Chart$$__annotations__$$": SR.$clinit(); return SR;case "org.netbeans.html.json.spi.Observers": QC.$clinit(); return QC;case "java.nio.charset.impl.UTF8Charset$$__annotations__$$": KF.$clinit(); return KF;case "net.java.html.charts.ChartEvent$$__annotations__$$": LL.$clinit(); return LL;case "org.netbeans.html.context.spi.Contexts$Id$$__annotations__$$": KG.$clinit(); return KG;case "org.netbeans.html.json.spi.Proto$$__annotations__$$": RN.$clinit(); return RN;case "org.netbeans.html.ko4j.KOSockets": OR.$clinit(); return OR;case "java.lang.NullPointerException$$__annotations__$$": HF.$clinit(); return HF;case "java.lang.IncompatibleClassChangeError": MB.$clinit(); return MB;case "java.lang.NoSuchMethodError": UP.$clinit(); return UP;case "java.lang.annotation.Target": FE.$clinit(); return FE;case "java.io.IOException": WJ.$clinit(); return WJ;case "java.util.AbstractList$$__annotations__$$": WO.$clinit(); return WO;case "org.teavm.jso.dom.events.LoadEventTarget$$__annotations__$$": KT.$clinit(); return KT;case "org.teavm.jso.browser.WindowEventTarget$$__annotations__$$": SF.$clinit(); return SF;case "net.java.html.charts.Values$$__annotations__$$": AK.$clinit(); return AK;case "java.util.AbstractList$1": AI.$clinit(); return AI;case "java.lang.ConsoleInputStream$$__annotations__$$": OJ.$clinit(); return OJ;case "java.util.Deque$$__annotations__$$": DG.$clinit(); return DG;case "java.util.ServiceLoader$$__annotations__$$": VF.$clinit(); return VF;case "org.teavm.platform.plugin.AsyncCallbackWrapper$$__annotations__$$": BP.$clinit(); return BP;case "org.netbeans.html.context.impl.CtxAccssr$$__annotations__$$": VN.$clinit(); return VN;case "org.netbeans.html.json.impl.PropertyBindingAccessor": DC.$clinit(); return DC;case "java.util.ListIterator": LE.$clinit(); return LE;case "java.lang.reflect.AnnotatedElement$$__annotations__$$": HO.$clinit(); return HO;case "java.util.ServiceLoader$1": SN.$clinit(); return SN;case "org.netbeans.html.json.impl.JSONList$$__annotations__$$": WG.$clinit(); return WG;case "java.util.Random": VG.$clinit(); return VG;case "java.lang.Runnable": Y.$clinit(); return Y;case "java.util.Set$$__annotations__$$": GJ.$clinit(); return GJ;case "java.nio.ByteBuffer$$__annotations__$$": KP.$clinit(); return KP;case "org.teavm.platform.plugin.ResourceAccessor": RM.$clinit(); return RM;case "java.lang.AutoCloseable$$__annotations__$$": LO.$clinit(); return LO;case "java.lang.Short": XE.$clinit(); return XE;case "java.lang.InstantiationException": FI.$clinit(); return FI;case "java.io.Serializable$$__annotations__$$": ZR.$clinit(); return ZR;case "org.netbeans.html.json.impl.Bindings": OC.$clinit(); return OC;case "org.netbeans.html.context.impl.CtxAccssr": FC.$clinit(); return FC;case "net.java.html.charts.Listeners$$__annotations__$$": JN.$clinit(); return JN;case "java.lang.ThreadLocal": OT.$clinit(); return OT;case "org.teavm.jso.dom.events.MouseEventTarget$$__annotations__$$": LP.$clinit(); return LP;case "org.netbeans.html.context.spi.Contexts$Id$$_impl": TG.$clinit(); return TG;case "java.util.Collection": IB.$clinit(); return IB;case "org.teavm.platform.PlatformRunnable": RC.$clinit(); return RC;case "java.util.ServiceLoader": OK.$clinit(); return OK;case "org.netbeans.html.ko4j.KO4J": ZE.$clinit(); return ZE;case "java.lang.SecurityException$$__annotations__$$": NI.$clinit(); return NI;case "net.java.html.charts.Segment": RJ.$clinit(); return RJ;case "java.lang.ref.Reference": WC.$clinit(); return WC;case "java.util.HashMap$HashEntry": IG.$clinit(); return IG;case "java.lang.Exception$$__annotations__$$": GH.$clinit(); return GH;case "org.netbeans.html.context.spi.Contexts$Provider": AE.$clinit(); return AE;case "java.nio.charset.impl.BufferedEncoder$Controller$$__annotations__$$": JJ.$clinit(); return JJ;case "org.netbeans.html.json.spi.FunctionBinding$Weak$$__annotations__$$": NM.$clinit(); return NM;case "java.util.Queue": OD.$clinit(); return OD;case "org.netbeans.html.json.spi.FunctionBinding$AImpl": UB.$clinit(); return UB;case "java.util.MapEntry": LD.$clinit(); return LD;case "java.nio.ByteBufferImpl": PQ.$clinit(); return PQ;case "java.util.HashMap$KeyIterator": WF.$clinit(); return WF;case "java.lang.IllegalStateException$$__annotations__$$": PI.$clinit(); return PI;case "java.lang.ClassCastException$$__annotations__$$": XM.$clinit(); return XM;case "java.nio.charset.CharsetEncoder$$__annotations__$$": OM.$clinit(); return OM;case "java.lang.Object$$__annotations__$$": QM.$clinit(); return QM;case "java.util.logging.Level": S.$clinit(); return S;case "java.io.IOException$$__annotations__$$": WP.$clinit(); return WP;case "java.util.HashSet": FO.$clinit(); return FO;case "org.netbeans.html.json.impl.PropertyBindingAccessor$$__annotations__$$": ML.$clinit(); return ML;case "org.teavm.jso.impl.JS$$__annotations__$$": EH.$clinit(); return EH;case "org.netbeans.html.json.spi.FunctionBinding$AImpl$$__annotations__$$": BT.$clinit(); return BT;case "java.lang.Character$$__annotations__$$": FT.$clinit(); return FT;case "java.util.LinkedList": UK.$clinit(); return UK;case "net.java.html.charts.Values": BI.$clinit(); return BI;case "com.dukescript.charts.sample.ChartModel$$__annotations__$$": IT.$clinit(); return IT;case "java.lang.Appendable": HD.$clinit(); return HD;case "java.lang.Class$$__annotations__$$": MG.$clinit(); return MG;case "net.java.html.BrwsrCtx$1": AJ.$clinit(); return AJ;case "java.lang.StringIndexOutOfBoundsException$$__annotations__$$": HH.$clinit(); return HH;case "java.lang.Short$$__annotations__$$": CT.$clinit(); return CT;case "java.nio.BufferOverflowException$$__annotations__$$": RI.$clinit(); return RI;case "com.dukescript.charts.sample.ChartModel$AddOne$$__annotations__$$": RT.$clinit(); return RT;case "java.util.AbstractMap": KB.$clinit(); return KB;case "java.io.InputStream$$__annotations__$$": MH.$clinit(); return MH;case "org.netbeans.html.json.spi.Transfer": BD.$clinit(); return BD;case "java.util.ListIterator$$__annotations__$$": OS.$clinit(); return OS;case "java.lang.Object": E.$clinit(); return E;case "java.util.Comparator": OB.$clinit(); return OB;case "java.lang.CloneNotSupportedException$$__annotations__$$": DH.$clinit(); return DH;case "java.lang.NegativeArraySizeException$$__annotations__$$": ZF.$clinit(); return ZF;case "java.lang.ClassLoader$$__annotations__$$": LF.$clinit(); return LF;case "java.lang.annotation.RetentionPolicy": WB.$clinit(); return WB;case "org.netbeans.html.json.impl.JSONList$1$$__annotations__$$": KH.$clinit(); return KH;case "org.teavm.platform.PlatformRunnable$$__annotations__$$": XK.$clinit(); return XK;case "java.lang.System": ZB.$clinit(); return ZB;case "java.util.Map$Entry$$__annotations__$$": QK.$clinit(); return QK;case "java.lang.reflect.Array$$__annotations__$$": JG.$clinit(); return JG;case "org.netbeans.html.json.spi.Technology$ApplyId": QE.$clinit(); return QE;case "java.lang.Iterable$$__annotations__$$": BG.$clinit(); return BG;case "org.netbeans.html.json.spi.Proto$2$$__annotations__$$": KO.$clinit(); return KO;case "java.util.LinkedList$Entry": SJ.$clinit(); return SJ;case "org.netbeans.html.json.impl.JSON$$__annotations__$$": VT.$clinit(); return VT;case "java.nio.Buffer$$__annotations__$$": VO.$clinit(); return VO;case "java.util.Iterator$$__annotations__$$": ZJ.$clinit(); return ZJ;case "java.lang.Void": TD.$clinit(); return TD;case "org.netbeans.html.json.spi.PropertyBinding$$__annotations__$$": CP.$clinit(); return CP;case "java.util.AbstractList$1$$__annotations__$$": WK.$clinit(); return WK;case "java.util.Set": IE.$clinit(); return IE;case "java.io.FilterOutputStream": NC.$clinit(); return NC;case "java.lang.annotation.Target$$__annotations__$$": KS.$clinit(); return KS;case "java.lang.StringBuilder$$__annotations__$$": DR.$clinit(); return DR;case "java.lang.Number$$__annotations__$$": BQ.$clinit(); return BQ;case "java.lang.SystemClassLoader": RO.$clinit(); return RO;case "java.lang.Throwable": SB.$clinit(); return SB;case "org.netbeans.html.context.impl.CtxImpl$BindCompare": XP.$clinit(); return XP;case "java.util.LinkedList$$__annotations__$$": ZI.$clinit(); return ZI;case "java.util.HashMap$1": VL.$clinit(); return VL;case "org.teavm.jso.JSObject": DB.$clinit(); return DB;case "java.util.HashMap$KeyIterator$$__annotations__$$": EJ.$clinit(); return EJ;case "java.lang.Double": XC.$clinit(); return XC;case "org.netbeans.html.json.spi.FunctionBinding$Weak": NG.$clinit(); return NG;case "org.netbeans.html.context.spi.Contexts$$__annotations__$$": OL.$clinit(); return OL;case "org.teavm.jso.browser.WindowEventTarget": EE.$clinit(); return EE;case "org.netbeans.html.json.spi.Observers$Watcher": RH.$clinit(); return RH;case "java.lang.ref.ReferenceQueue": TR.$clinit(); return TR;case "org.teavm.jso.browser.Window": XH.$clinit(); return XH;case "java.lang.annotation.Retention$$_impl$$__annotations__$$": ZN.$clinit(); return ZN;case "java.util.LinkedList$SequentialListIterator": JF.$clinit(); return JF;case "java.lang.Byte$$__annotations__$$": VH.$clinit(); return VH;case "net.java.html.js.JavaScriptResource$$__annotations__$$": CG.$clinit(); return CG;case "com.dukescript.charts.sample.Data$Html4JavaType$$__annotations__$$": MS.$clinit(); return MS;case "net.java.html.BrwsrCtx$1$$__annotations__$$": BM.$clinit(); return BM;case "java.lang.Number": M.$clinit(); return M;case "java.lang.NegativeArraySizeException": FU.$clinit(); return FU;case "java.lang.UnsupportedOperationException": DD.$clinit(); return DD;case "org.teavm.jso.dom.events.MouseEventTarget": SE.$clinit(); return SE;case "java.util.Map$Entry": ND.$clinit(); return ND;case "java.lang.annotation.Annotation$$__annotations__$$": LT.$clinit(); return LT;case "org.netbeans.html.context.spi.Contexts$Builder$$__annotations__$$": NT.$clinit(); return NT;case "org.netbeans.html.context.spi.Contexts$Builder": YS.$clinit(); return YS;case "java.lang.NoSuchMethodError$$__annotations__$$": FF.$clinit(); return FF;case "org.teavm.jso.dom.events.KeyboardEventTarget$$__annotations__$$": JI.$clinit(); return JI;case "java.nio.CharBufferImpl$$__annotations__$$": QS.$clinit(); return QS;case "java.lang.NumberFormatException": IJ.$clinit(); return IJ;case "org.netbeans.html.context.impl.CtxImpl$Bind": JO.$clinit(); return JO;case "org.netbeans.html.json.spi.PropertyBinding$Weak": ZG.$clinit(); return ZG;case "java.lang.Comparable": L.$clinit(); return L;case "org.netbeans.html.json.impl.JSONList$1": UR.$clinit(); return UR;case "java.lang.System$$__annotations__$$": BO.$clinit(); return BO;case "org.teavm.jso.browser.StorageProvider$$__annotations__$$": VK.$clinit(); return VK;case "java.nio.CharBufferImpl": YC.$clinit(); return YC;case "java.io.PrintStream$$__annotations__$$": PJ.$clinit(); return PJ;case "java.lang.Comparable$$__annotations__$$": AF.$clinit(); return AF;case "net.java.html.BrwsrCtx$1Wrap$$__annotations__$$": ON.$clinit(); return ON;case "java.lang.IllegalStateException": SG.$clinit(); return SG;case "java.lang.Float$$__annotations__$$": QI.$clinit(); return QI;case "org.netbeans.html.json.spi.PropertyBinding$AImpl$$__annotations__$$": MI.$clinit(); return MI;case "java.util.AbstractList": O.$clinit(); return O;case "java.lang.annotation.ElementType$$__annotations__$$": MF.$clinit(); return MF;case "java.lang.AutoCloseable": VE.$clinit(); return VE;case "java.nio.ByteBuffer": TC.$clinit(); return TC;case "java.lang.Object$2": YL.$clinit(); return YL;case "org.teavm.platform.plugin.AsyncCallbackWrapper": BR.$clinit(); return BR;case "java.lang.Object$1": XL.$clinit(); return XL;case "java.lang.Enum": TB.$clinit(); return TB;case "net.java.html.charts.Config": QO.$clinit(); return QO;case "org.teavm.classlib.impl.Base46$$__annotations__$$": QN.$clinit(); return QN;case "net.java.html.charts.ChartListener$$__annotations__$$": LS.$clinit(); return LS;case "org.netbeans.html.json.spi.Proto$Type$$__annotations__$$": EG.$clinit(); return EG;case "com.dukescript.charts.sample.Data$$__annotations__$$": IF.$clinit(); return IF;case "java.lang.Byte": UD.$clinit(); return UD;case "java.util.HashMap$AbstractMapIterator$$__annotations__$$": FS.$clinit(); return FS;case "java.util.Comparator$$__annotations__$$": JP.$clinit(); return JP;case "java.lang.Cloneable": AB.$clinit(); return AB;case "java.lang.annotation.Retention$$_impl": DJ.$clinit(); return DJ;case "java.util.Collections$6$$__annotations__$$": MO.$clinit(); return MO;case "java.util.logging.Logger": ED.$clinit(); return ED;case "java.util.logging.LogRecord": PD.$clinit(); return PD;case "java.nio.charset.IllegalCharsetNameException$$__annotations__$$": ZT.$clinit(); return ZT;case "java.lang.Void$$__annotations__$$": KL.$clinit(); return KL;case "java.lang.IncompatibleClassChangeError$$__annotations__$$": IL.$clinit(); return IL;case "java.nio.CharBufferOverArray$$__annotations__$$": ER.$clinit(); return ER;case "org.netbeans.html.json.spi.FunctionBinding$AImpl$1Dispatch": NK.$clinit(); return NK;case "java.lang.Throwable$$__annotations__$$": GK.$clinit(); return GK;case "java.util.HashMap$$__annotations__$$": EQ.$clinit(); return EQ;case "java.lang.IllegalArgumentException$$__annotations__$$": MK.$clinit(); return MK;case "com.dukescript.charts.sample.ChartModel$AddSegment$$__annotations__$$": ZQ.$clinit(); return ZQ;case "java.util.HashMap": PS.$clinit(); return PS;case "java.lang.annotation.Retention": BE.$clinit(); return BE;case "java.lang.Math$$__annotations__$$": JL.$clinit(); return JL;case "java.lang.ref.Reference$$__annotations__$$": BK.$clinit(); return BK;case "java.nio.charset.CoderResult": ZC.$clinit(); return ZC;case "com.dukescript.charts.sample.ChartModel$AddOne": GR.$clinit(); return GR;case "java.lang.AssertionError$$__annotations__$$": NP.$clinit(); return NP;case "net.java.html.charts.Chart$ChartList$$__annotations__$$": IN.$clinit(); return IN;case "java.util.Iterator": BB.$clinit(); return BB;case "net.java.html.BrwsrCtx": XB.$clinit(); return XB;case "org.netbeans.html.json.spi.Technology$BatchInit$$__annotations__$$": XN.$clinit(); return XN;case "org.netbeans.html.json.spi.Technology": QB.$clinit(); return QB;case "java.lang.IllegalArgumentException": LB.$clinit(); return LB;case "java.lang.ConsoleOutputStreamStderr": HM.$clinit(); return HM;case "java.nio.ReadOnlyBufferException$$__annotations__$$": PL.$clinit(); return PL;case "net.java.html.charts.Segment$$__annotations__$$": PF.$clinit(); return PF;case "java.util.Collections$19$$__annotations__$$": FH.$clinit(); return FH;case "org.teavm.jso.core.JSArrayReader": HE.$clinit(); return HE;case "java.util.Collections": CB.$clinit(); return CB;case "org.teavm.jso.browser.StorageProvider": CE.$clinit(); return CE;case "java.lang.RuntimeException$$__annotations__$$": JM.$clinit(); return JM;case "java.util.Collections$11$$__annotations__$$": TN.$clinit(); return TN;default: return null;}}
function EFB(a){IHB(a,0);return;}
function VFB(a){var c='$$enumConstants$$';R[c]=Qq;WB[c]=Hm;VFB=function(cls){if(!cls.hasOwnProperty(c)){return null;}return cls[c]();};return VFB(a);}
function ZFB(a,b){var c,d;if(a===b){return 1;}c=a.$meta.supertypes;d=0;while(d<c.length){if(ZFB(c[d],b)!=0){return 1;}d=d+1|0;}return 0;}
function BGB(a){R8(a);return;}
function XIB(){return window;}
function MAB($t){Wu($t);return;}
function CC_$clinit(){CC_$clinit=function(){};
ZL=function($t,a){Wu($t);$t.GI=a;return;};
NW=function(){CC.wM=XVB($rt_s(28));CC.YI=XVB($rt_s(29));CC.JE=XVB($rt_s(30));return;};
NW();}
function XVB(a){var $r=new CC();ZL($r,a);return $r;}
function P9($t){return $t.GI;}
function Q_$clinit(){Q_$clinit=function(){};
Oj=function(a){var b,c,d,e;b=Long_fromInt(1);c=0;d=16;e=Q.bF.data.length-1|0;while(e>=0){if(Long_compare(Long_rem(a,Long_mul(b,Q.bF.data[e])),Long_ZERO)==0){c=c|d;b=Long_mul(b,Q.bF.data[e]);}d=d>>>1;e=e+ -1|0;}return c;};
NJ=function($t){XG($t,16);return;};
XG=function($t,a){Wu($t);$t.QE=$rt_createCharArray(a);return;};
Gx=function(a){var b,c;if(a%1000000000==0){return 9;}b=0;c=1;if(a%100000000==0){b=b|8;c=c*100000000|0;}if(a%(c*10000|0)==0){b=b|4;c=c*10000|0;}if(a%(c*100|0)==0){b=b|2;c=c*100|0;}if(a%(c*10|0)==0){b=b|1;}return b;};
Ni=function(){var a,b,c,d,e,f,g,h;a=$rt_createFloatArray(6);b=a.data;b[0]=10.0;b[1]=100.0;b[2]=10000.0;b[3]=1.0E8;b[4]=1.00000003E16;b[5]=1.0E32;Q.kF=a;c=$rt_createDoubleArray(9);d=c.data;d[0]=10.0;d[1]=100.0;d[2]=10000.0;d[3]=1.0E8;d[4]=1.0E16;d[5]=1.0E32;d[6]=1.0E64;d[7]=1.0E128;d[8]=1.0E256;Q.qD=c;a=$rt_createFloatArray(6);b=a.data;b[0]=0.1;b[1]=0.01;b[2]=1.0E-4;b[3]=1.0E-8;b[4]=1.0E-16;b[5]=1.0E-32;Q.OD=a;c=$rt_createDoubleArray(9);d=c.data;d[0]=0.1;d[1]=0.01;d[2]=1.0E-4;d[3]=1.0E-8;d[4]=1.0E-16;d[5]=1.0E-32;d[6]
=1.0E-64;d[7]=1.0E-128;d[8]=1.0E-256;Q.kC=c;e=$rt_createIntArray(10);f=e.data;f[0]=1;f[1]=10;f[2]=100;f[3]=1000;f[4]=10000;f[5]=100000;f[6]=1000000;f[7]=10000000;f[8]=100000000;f[9]=1000000000;Q.LF=e;g=$rt_createLongArray(19);h=g.data;h[0]=Long_fromInt(1);h[1]=Long_fromInt(10);h[2]=Long_fromInt(100);h[3]=Long_fromInt(1000);h[4]=Long_fromInt(10000);h[5]=Long_fromInt(100000);h[6]=Long_fromInt(1000000);h[7]=Long_fromInt(10000000);h[8]=Long_fromInt(100000000);h[9]=Long_fromInt(1000000000);h[10]=new Long(1410065408, 2);h[11]
=new Long(1215752192, 23);h[12]=new Long(3567587328, 232);h[13]=new Long(1316134912, 2328);h[14]=new Long(276447232, 23283);h[15]=new Long(2764472320, 232830);h[16]=new Long(1874919424, 2328306);h[17]=new Long(1569325056, 23283064);h[18]=new Long(2808348672, 232830643);Q.vI=g;g=$rt_createLongArray(6);h=g.data;h[0]=Long_fromInt(1);h[1]=Long_fromInt(10);h[2]=Long_fromInt(100);h[3]=Long_fromInt(10000);h[4]=Long_fromInt(100000000);h[5]=new Long(1874919424, 2328306);Q.bF=g;return;};
Ni();}
function YVB(){var $r=new Q();NJ($r);return $r;}
function BKB(a){var $r=new Q();XG($r,a);return $r;}
function Y9($t,a){return JV($t,$t.lJ,a);}
function Mi($t,a){return Oc($t,a,10);}
function Yw($t,a){return Wt($t,$t.lJ,a);}
function I6($t,a){return IY($t,$t.lJ,a);}
function Wy($t,a){$t.lJ=a;return;}
function NX($t,a,b,c){var d,e,f,g,h,i;d=1;if(Long_compare(b,Long_ZERO)<0){d=0;b=Long_neg(b);}e=Long_fromInt(c);if(Long_compare(b,e)<0){if(d!=0){Jc($t,a,a+1|0);}else{Jc($t,a,a+2|0);f=$t.QE.data;d=a+1|0;f[a]=45;a=d;}$t.QE.data[a]=WAB(b.lo,c);}else{g=1;h=Long_fromInt(1);while(true){f=Long_mul(h,e);if(Long_compare(f,h)<=0){break;}if(Long_compare(f,b)>0){break;}g=g+1|0;h=f;}if(d==0){g=g+1|0;}Jc($t,a,a+g|0);if(d!=0){d=a;}else{i=$t.QE.data;d=a+1|0;i[a]=45;}while(Long_compare(h,Long_ZERO)>0){f=$t.QE.data;g=d+1|0;f[d]
=WAB(Long_div(b,h).lo,c);b=Long_rem(b,h);h=Long_div(h,e);d=g;}}return $t;}
function Jc($t,a,b){var c,d;c=$t.lJ-a|0;$t.G(($t.lJ+b|0)-a|0);d=c-1|0;while(d>=0){$t.QE.data[b+d|0]=$t.QE.data[a+d|0];d=d+ -1|0;}$t.lJ=$t.lJ+(b-a|0)|0;return;}
function Q7($t,a,b){Jc($t,a,a+1|0);$t.QE.data[a]=b;return $t;}
function Oc($t,a,b){return M6($t,$t.lJ,a,b);}
function A0($t,a,b,c,d){var e,f,g,h;if(a>b){CJB(ZKB(Q9($rt_s(31))));}while(a<b){e=c.data;f=d+1|0;g=$t.QE.data;h=a+1|0;e[d]=g[a];d=f;a=h;}return;}
function RZ($t){return ZVB($t.QE,0,$t.lJ);}
function W2($t){return $t.lJ;}
function M6($t,a,b,c){var d,e,f,g,h,i;d=1;if(b<0){d=0;b= -b|0;}if(b<c){if(d!=0){Jc($t,a,a+1|0);}else{Jc($t,a,a+2|0);e=$t.QE.data;f=a+1|0;e[a]=45;a=f;}$t.QE.data[a]=WAB(b,c);}else{f=1;g=1;h=2147483647/c|0;$ba:{while(true){i=f*c|0;if(i>b){i=f;break $ba;}g=g+1|0;if(i>h){break;}f=i;}}if(d==0){g=g+1|0;}Jc($t,a,a+g|0);if(d!=0){g=a;}else{f=$t.QE.data;g=a+1|0;f[a]=45;}while(i>0){d=$t.QE.data;a=g+1|0;d[g]=WAB(b/i|0,c);b=b%i;i=i/c|0;g=a;}}return $t;}
function IDB($t,a,b){return NX($t,a,b,10);}
function Ds($t,a,b){var c,d,e,f;if(a>=0&&a<=$t.lJ){if(b===null){b=Q9($rt_s(32));}else if(K9(b)!=0){return $t;}NCB($t,$t.lJ+C(b)|0);c=$t.lJ-1|0;while(c>=a){$t.QE.data[c+C(b)|0]=$t.QE.data[c];c=c+ -1|0;}$t.lJ=$t.lJ+C(b)|0;d=0;while(d<C(b)){e=$t.QE.data;f=a+1|0;e[a]=Hf(b,d);d=d+1|0;a=f;}return $t;}CJB(BLB());}
function Kr($t,a,b){var c,d,e,f,g,h,i,j,k,m,n,o,p,q,r,s,t;if(b==0.0){Jc($t,a,a+3|0);c=$t.QE.data;d=a+1|0;c[a]=48;c=$t.QE.data;e=d+1|0;c[d]=46;$t.QE.data[e]=48;return $t;}if(b==0.0){Jc($t,a,a+4|0);c=$t.QE.data;d=a+1|0;c[a]=45;c=$t.QE.data;e=d+1|0;c[d]=48;c=$t.QE.data;f=e+1|0;c[e]=46;$t.QE.data[f]=48;return $t;}if((isNaN(b)?1:0)!=0){Jc($t,a,a+3|0);c=$t.QE.data;d=a+1|0;c[a]=78;c=$t.QE.data;e=d+1|0;c[d]=97;$t.QE.data[e]=78;return $t;}if((!isFinite(b)?1:0)!=0){if(b>0.0){Jc($t,a,a+8|0);b=a;}else{Jc($t,a,a+9|0);f=
$t.QE.data;b=a+1|0;f[a]=45;}c=$t.QE.data;d=b+1|0;c[b]=73;c=$t.QE.data;e=d+1|0;c[d]=110;c=$t.QE.data;d=e+1|0;c[e]=102;c=$t.QE.data;e=d+1|0;c[d]=105;c=$t.QE.data;d=e+1|0;c[e]=110;c=$t.QE.data;f=d+1|0;c[d]=105;c=$t.QE.data;e=f+1|0;c[f]=116;$t.QE.data[e]=121;return $t;}g=0;h=1;if(b<0.0){g=1;b= -b;h=h+1|0;}i=1;if(b>=1.0){j=256;k=0;m=1.0;n=Q.qD.data.length-1|0;while(n>=0){o=k|j;if(o<=308&&Q.qD.data[n]*m<=b){m=m*Q.qD.data[n];k=o;}j=j>>1;n=n+ -1|0;}b=Long_fromNumber(b/m*1.0E15+0.5);}else{k=256;p=0;m=1.0;n=Q.kC.data.length
-1|0;while(n>=0){j=p|k;if(j<=308&&Q.kC.data[n]*m*10.0>b){m=m*Q.kC.data[n];p=j;}k=k>>1;n=n+ -1|0;}k= -p|0;b=Long_fromNumber(b*1.0E15/m+0.5);}q=16;f=Oj(b);if(f>0){q=q-f|0;}if(k<7&&k>= -3){if(k>=0){i=k+1|0;q=GIB(q,i+1|0);k=0;}else if(k<0){b=Long_div(b,Q.vI.data[ -k|0]);q=q-k|0;k=0;}}if(k!=0){h=h+2|0;if(!(k> -10&&k<10)){h=h+1|0;}if(!(k> -100&&k<100)){h=h+1|0;}if(k<0){h=h+1|0;}}if(k!=0&&q==i){q=q+1|0;}Jc($t,a,a+(h+q|0)|0);if(g==0){n=a;}else{r=$t.QE.data;n=a+1|0;r[a]=45;}j=new Long(2764472320, 232830);h=0;while(h
<q){if(Long_compare(j,Long_ZERO)<=0){m=0;}else{m=Long_div(b,j).lo;b=Long_rem(b,j);}o=$t.QE.data;p=n+1|0;o[n]=(48+m|0)&65535;i=i+ -1|0;if(i!=0){n=p;}else{c=$t.QE.data;n=p+1|0;c[p]=46;}j=Long_div(j,Long_fromInt(10));h=h+1|0;}if(k!=0){c=$t.QE.data;i=n+1|0;c[n]=69;if(k>=0){b=i;}else{k= -k|0;d=$t.QE.data;b=i+1|0;d[i]=45;}if(k>=100){s=$t.QE.data;t=b+1|0;s[b]=(48+(k/100|0)|0)&65535;k=k%100;a=$t.QE.data;n=t+1|0;a[t]=(48+(k/10|0)|0)&65535;}else if(k<10){n=b;}else{i=$t.QE.data;n=b+1|0;i[b]=(48+(k/10|0)|0)&65535;}$t.QE.data[n]
=(48+k%10|0)&65535;}return $t;}
function K4($t,a){return Wm($t,$t.lJ,a);}
function Pb($t,a,b){var c,d,e,f,g,h,i,j,k,m,n,o;if(b==0.0){Jc($t,a,a+3|0);b=$t.QE.data;c=a+1|0;b[a]=48;b=$t.QE.data;a=c+1|0;b[c]=46;$t.QE.data[a]=48;return $t;}if(b==0.0){Jc($t,a,a+4|0);b=$t.QE.data;c=a+1|0;b[a]=45;b=$t.QE.data;d=c+1|0;b[c]=48;b=$t.QE.data;a=d+1|0;b[d]=46;$t.QE.data[a]=48;return $t;}if((isNaN(b)?1:0)!=0){Jc($t,a,a+3|0);b=$t.QE.data;d=a+1|0;b[a]=78;b=$t.QE.data;a=d+1|0;b[d]=97;$t.QE.data[a]=78;return $t;}if((!isFinite(b)?1:0)!=0){if(b>0.0){Jc($t,a,a+8|0);e=a;}else{Jc($t,a,a+9|0);d=$t.QE.data;e
=a+1|0;d[a]=45;}b=$t.QE.data;c=e+1|0;b[e]=73;b=$t.QE.data;d=c+1|0;b[c]=110;b=$t.QE.data;c=d+1|0;b[d]=102;b=$t.QE.data;a=c+1|0;b[c]=105;b=$t.QE.data;c=a+1|0;b[a]=110;b=$t.QE.data;d=c+1|0;b[c]=105;b=$t.QE.data;c=d+1|0;b[d]=116;$t.QE.data[c]=121;return $t;}f=0;g=1;if(b<0.0){f=1;b= -b;g=g+1|0;}h=1;if(b>=1.0){e=32;i=0;j=1.0;k=Q.kF.data.length-1|0;while(k>=0){m=i|e;if(m<=38&&Q.kF.data[k]*j<=b){j=j*Q.kF.data[k];i=m;}e=e>>1;k=k+ -1|0;}j=b/(j/1000000.0)+0.5|0;}else{i=32;j=0;n=1.0;k=Q.OD.data.length-1|0;while(k>=0){m
=j|i;if(m<=38&&Q.OD.data[k]*n*10.0>b){n=n*Q.OD.data[k];j=m;}i=i>>1;k=k+ -1|0;}i= -j|0;j=b*1000000.0/n+0.5|0;}n=7;c=Gx(j);if(c>0){n=n-c|0;}if(i<7&&i>= -3){if(i>=0){h=i+1|0;n=GIB(n,h+1|0);i=0;}else if(i<0){j=j/Q.LF.data[ -i|0]|0;n=n-i|0;i=0;}}if(i!=0){g=g+2|0;if(!(i> -10&&i<10)){g=g+1|0;}if(i<0){g=g+1|0;}}if(i!=0&&n==h){n=n+1|0;}Jc($t,a,a+(g+n|0)|0);if(f==0){k=a;}else{o=$t.QE.data;k=a+1|0;o[a]=45;}e=1000000;f=0;while(f<n){if(e<=0){m=0;}else{m=j/e|0;j=j%e;}c=$t.QE.data;g=k+1|0;c[k]=(48+m|0)&65535;h=h+ -1|0;if(h
!=0){k=g;}else{b=$t.QE.data;k=g+1|0;b[g]=46;}e=e/10|0;f=f+1|0;}if(i!=0){a=$t.QE.data;m=k+1|0;a[k]=69;if(i>=0){e=m;}else{i= -i|0;c=$t.QE.data;e=m+1|0;c[m]=45;}if(i<10){k=e;}else{j=$t.QE.data;k=e+1|0;j[e]=(48+(i/10|0)|0)&65535;}$t.QE.data[k]=(48+i%10|0)&65535;}return $t;}
function Jg($t,a){return YDB($t,$t.lJ,a);}
function Mh($t,a){if($t.QE.data.length>=a){return;}$t.QE=YFB($t.QE,(a*2|0)+1|0);return;}
function Kv($t,a,b){if(b===null){b=$rt_s(32);}else{b=b.c();}return YDB($t,a,Q9(b));}
function Hu($t,a){return Q2($t,$t.lJ,a);}
function HC_$clinit(){HC_$clinit=function(){};
La=function(a,b){$ba:{if(a==0){if(b==0){break $ba;}return  -1;}if(b==0){return 1;}}return 0;};
Rm=function(a){if(a==0){a=HC.EF;}else{a=HC.qG;}return a;};
Ev=function(a){if(a!==null&&J3(Kp(a),$rt_s(33))!=0){a=1;}else{a=0;}return a;};
EK=function($t,a){Wu($t);$t.NK=a;return;};
Uh=function(){HC.qG=AWB(1);HC.EF=AWB(0);HC.oK=PGB();return;};
Vu=function(a){if(a==0){a=$rt_s(34);}else{a=$rt_s(33);}return a;};
Uh();}
function AWB(a){var $r=new HC();EK($r,a);return $r;}
function Fb($t,a){return La($t.NK,a.NK);}
function As($t,a){return Fb($t,a);}
function Za($t,a){var b;if($t===a){return 1;}if(a instanceof HC!=0&&a.NK==$t.NK){b=1;}else{b=0;}return b;}
function Md($t){return Vu($t.NK);}
function O1($t){return $t.NK;}
function TLB(a){var $r=new LB();GEB($r,a);return $r;}
function OMB(){var $r=new LB();Qj($r);return $r;}
function GEB($t,a){Q4($t,a);return;}
function Qj($t){Ba($t);return;}
function JOB(a){var $r=new SM();Zx($r,a);return $r;}
function Zx($t,a){Qj($t);$t.wE=a;return;}
function BWB(){var $r=new PT();KZ($r);return $r;}
function KZ($t){Ba($t);return;}
function CSB(){var $r=new VM();Hs($r);return $r;}
function Tq($t){return GJB(Z,0);}
function Hs($t){Wu($t);return;}
function CWB(){var $r=new U();HU($r);return $r;}
function QZ($t,a,b,c){var d,e,f;d=0;while(d<c){e=a.data;f=b+1|0;$t.O(e[b]);d=d+1|0;b=f;}return;}
function HU($t){Wu($t);return;}
function DWB(a){var $r=new NC();GZ($r,a);return $r;}
function GZ($t,a){HU($t);$t.BM=a;return;}
function EWB(a,b){var $r=new MP();H1($r,a,b);return $r;}
function Ci($t,a,b,c){var d,e,f,g,h;d=a.data;e=SIB(a,b,c-b|0);f=$rt_createByteArray(GIB(16,UFB(d.length,1024)));c=FHB(f);g=K6($t.wG);CC_$clinit();a=GU(g,CC.YI);CC_$clinit();a=I5(a,CC.YI);while(true){h=A2(Ig(a,e,c,1));Tc($t,f,0,Ef(c));Xk(c);if(h==0){break;}}while(true){b=A2(YX(a,c));Tc($t,f,0,Ef(c));Xk(c);if(b==0){break;}}return;}
function H1($t,a,b){GZ($t,a);$t.nK=QJB();$t.YG=$rt_createCharArray(32);$t.hF=b;$t.wG=LOB();return;}
function Ts($t){var a;if($t.BM===null){$t.bL=1;}if($t.bL!=0){a=0;}else{a=1;}return a;}
function Lm($t,a){GX(DY($t.nK,a),10);Id($t);return;}
function Tc($t,a,b,c){var $je;if(Ts($t)==0){return;}$ba:{$bb:{try{QZ($t.BM,a,b,c);}catch($e){$je=$e.$javaException;if($je&&$je instanceof WJ){b=$je;break $bb;}else {throw $e;}}break $ba;}$t.bL=1;}return;}
function Id($t){var a;if(Xh($t.nK)<=$t.YG.data.length){a=$t.YG;}else{a=$rt_createCharArray(Xh($t.nK));}Du($t.nK,0,Xh($t.nK),a,0);Ci($t,a,0,Xh($t.nK));FCB($t.nK,0);return;}
function VRB(){var $r=new QP();Hd($r);return $r;}
function Q1($t){return GJB(Z,0);}
function Hd($t){Wu($t);return;}
function URB(){var $r=new TP();JW($r);return $r;}
function St($t){return GJB(Z,0);}
function JW($t){Wu($t);return;}
function STB(){var $r=new JH();Jk($r);return $r;}
function DAB($t){return GJB(Z,0);}
function Jk($t){Wu($t);return;}
function IRB(){var $r=new LQ();Wn($r);return $r;}
function Dx($t){return GJB(Z,0);}
function Wn($t){Wu($t);return;}
function ATB(){var $r=new IO();U2($r);return $r;}
function DDB($t){return GJB(Z,0);}
function U2($t){Wu($t);return;}
function UQB(){var $r=new NF();Zl($r);return $r;}
function Rx($t){return GJB(Z,0);}
function Zl($t){Wu($t);return;}
function GSB(){var $r=new VQ();HCB($r);return $r;}
function Vt($t){return GJB(Z,0);}
function HCB($t){Wu($t);return;}
function JVB(){var $r=new QF();Qb($r);return $r;}
function K0($t){return GJB(Z,0);}
function Qb($t){Wu($t);return;}
function FWB(a,b,c){var $r=new OH();S0($r,a,b,c);return $r;}
function S0($t,a,b,c){var d,e;Wu($t);d=GJB(E,6);e=d.data;e[0]=a;e[1]=b.eG;e[2]=c.eG;e[3]=null;e[4]=null;e[5]=null;$t.yD=d;return;}
function GWB(a){var $r=new HP();Bw($r,a);return $r;}
function UGB(a){var b;b=GGB(Uk(a));if(b!==null){return A(b);}CJB(HWB());}
function JHB(){return A(JGB().$rt_shortcls());}
function M0($t,a){if(Ay(a,$t)!=0){return $t;}CJB(PLB());}
function WHB(a,b,c){return UGB(a);}
function P8($t){return 1;}
function Ix($t,a){if(a!==null&&Ay($t,Hh(a))==0){CJB(OLB(Q9(Tj(PY(DY(DY(QJB(),MBB(Hh(a))),$rt_s(35)),$t.vH)))));}return a;}
function Xe($t,a){E1($t);return J2($t.UL,a);}
function KW($t){var a;if($t.cC!=0){a=$t.jI.$meta.item;if(a===null){a=null;}else{a=A(a);}$t.eI=a;$t.cC=0;}return $t.eI;}
function Ak($t){var a;a=WFB($t.jI);if(a!==null){return a;}CJB(IWB());}
function PFB(){return A(JGB().$rt_longcls());}
function Bh($t){return $t.jI;}
function Ki($t){return $t.jI.$meta.enum?1:0;}
function XFB(){return A(JGB().$rt_bytecls());}
function TFB(){return A(JGB().$rt_intcls());}
function HIB(){return A(JGB().$rt_doublecls());}
function MBB($t){if($t.vH===null){$t.vH=Q9($rt_str($t.jI.$meta.name));}return $t.vH;}
function RIB(a){var p="$$res_RIB";XJ[p]=XB;IM[p]=XD;FL[p]=E;IC[p]=HT;GP[p]=E;LH[p]=E;GL[p]=E;KI[p]=MD;ZO[p]=E;LJ[p]=E;WM[p]=E;AU[p]=E;SS[p]=E;BU[p]=E;VD[p]=PE;XF[p]=E;YQ[p]=E;NL[p]=E;CH[p]=E;LM[p]=E;XR[p]=E;YP[p]=E;PM[p]=E;GO[p]=E;NN[p]=E;YR[p]=E;TK[p]=E;PH[p]=E;DM[p]=E;OP[p]=E;EL[p]=E;LI[p]=E;AH[p]=E;OG[p]=E;GN[p]=E;SR[p]=E;YD[p]=CU;YT[p]=E;KF[p]=E;LL[p]=E;KG[p]=E;RN[p]=E;WR[p]=E;PK[p]=E;ST[p]=E;HF[p]=E;KM[p]=E;WO[p]=E;KT[p]=E;SF[p]=E;AK[p]=E;AI[p]=O;OJ[p]=E;DG[p]=E;VF[p]=E;BP[p]=E;VN[p]=E;CF[p]=V;KR[p]=E;VS[p]
=E;HI[p]=E;YF[p]=E;SO[p]=E;RG[p]=E;HO[p]=E;PR[p]=E;SN[p]=OK;WG[p]=E;GJ[p]=E;KP[p]=E;LO[p]=E;ZS[p]=E;EI[p]=E;WI[p]=E;ZR[p]=E;RK[p]=E;JN[p]=E;FP[p]=E;UN[p]=E;AS[p]=E;LP[p]=E;FR[p]=E;PP[p]=HT;NI[p]=E;MN[p]=QC;IG[p]=PS;GH[p]=E;GS[p]=E;AE[p]=CU;JJ[p]=E;NM[p]=E;UB[p]=JD;XS[p]=E;WT[p]=LC;WF[p]=PS;FK[p]=E;PI[p]=E;XM[p]=E;ES[p]=E;OM[p]=E;MJ[p]=E;CR[p]=E;QR[p]=E;QM[p]=E;WP[p]=E;UO[p]=E;ML[p]=E;EH[p]=E;BT[p]=E;FT[p]=E;VM[p]=E;IT[p]=E;QP[p]=E;TP[p]=E;JH[p]=E;LQ[p]=E;IO[p]=E;MG[p]=E;NF[p]=E;AJ[p]=XB;VQ[p]=E;HH[p]=E;QF[p]
=E;CT[p]=E;RI[p]=E;RT[p]=E;MH[p]=E;OS[p]=E;OH[p]=BI;DH[p]=E;ZF[p]=E;LF[p]=E;KH[p]=E;QJ[p]=E;XK[p]=E;QK[p]=E;JG[p]=E;QE[p]=QB;BG[p]=E;KO[p]=E;CN[p]=CB;SJ[p]=UK;BN[p]=CB;VT[p]=E;EN[p]=CB;FN[p]=CB;WQ[p]=E;IS[p]=DN;MM[p]=E;VO[p]=E;ZJ[p]=E;YO[p]=E;CP[p]=E;WK[p]=E;VP[p]=E;EO[p]=E;UT[p]=E;FJ[p]=E;DI[p]=E;QL[p]=E;KS[p]=E;DR[p]=E;AT[p]=UC;VR[p]=E;BQ[p]=E;XP[p]=DQ;ZI[p]=E;VL[p]=PS;EJ[p]=E;XI[p]=E;NG[p]=JD;BF[p]=E;OL[p]=E;FQ[p]=E;UH[p]=E;RH[p]=QC;ZH[p]=E;ZN[p]=E;JF[p]=UK;VH[p]=E;CG[p]=E;MS[p]=E;US[p]=E;BM[p]=E;HJ[p]=E;CK[p]
=E;ND[p]=RD;LT[p]=E;YH[p]=E;NT[p]=E;YS[p]=CU;FF[p]=E;JI[p]=E;QS[p]=E;SP[p]=E;UE[p]=QB;DO[p]=E;YN[p]=LC;JO[p]=DQ;HN[p]=E;ZG[p]=LC;JS[p]=E;UR[p]=SL;MQ[p]=E;BO[p]=E;VK[p]=E;NO[p]=E;PJ[p]=E;AF[p]=E;ON[p]=E;HG[p]=E;WH[p]=E;QI[p]=E;MI[p]=E;VC[p]=PS;TS[p]=E;MF[p]=E;DK[p]=E;LN[p]=E;YL[p]=E;XL[p]=E;SQ[p]=E;QN[p]=E;UL[p]=E;LS[p]=E;EG[p]=E;BJ[p]=E;IF[p]=E;XT[p]=E;FS[p]=E;JP[p]=E;XO[p]=E;GQ[p]=E;KN[p]=E;UM[p]=E;MO[p]=E;ZT[p]=E;AG[p]=E;KL[p]=E;HK[p]=E;IL[p]=E;SI[p]=E;MT[p]=E;ER[p]=E;NK[p]=UB;QQ[p]=E;TT[p]=E;GK[p]=E;EQ[p]
=E;DL[p]=CB;MK[p]=E;AL[p]=CB;ZQ[p]=E;RB[p]=LC;NQ[p]=E;KJ[p]=E;QT[p]=E;EP[p]=E;JL[p]=E;BK[p]=E;RQ[p]=E;GR[p]=V;CL[p]=CB;NP[p]=E;BL[p]=CB;LR[p]=E;XQ[p]=E;NH[p]=E;GF[p]=E;IN[p]=E;XN[p]=E;VJ[p]=E;RR[p]=E;YK[p]=E;PL[p]=E;ZD[p]=QB;PF[p]=E;NR[p]=JD;FH[p]=E;AO[p]=E;IQ[p]=E;UQ[p]=E;JM[p]=E;TN[p]=E;TL[p]=E;RIB=function(cls){return cls.hasOwnProperty(p)?cls[p]:null;};return RIB(a);}
function A(a){var b;if(a===null){return null;}b=a.classObject;if(b===null){b=GWB(a);}return b;}
function BIB(){return A(JGB().$rt_charcls());}
function E1($t){var a,b,c,d;if($t.UL!==null){return;}$t.UL=KOB();a=J7($t).data;b=a.length;c=0;while(c<b){d=a[c];Ma($t.UL,d.s(),d);c=c+1|0;}return;}
function TZ($t){var a,b;a=RIB($t.jI);if(a===null){b=null;}else{b=A(a);}return b;}
function Bw($t,a){var b;Wu($t);$t.cC=1;$t.jI=a;b=$t;a.classObject=b;return;}
function F7($t){return Nm();}
function J7($t){if($t.xC===null){$t.xC=LHB(Bh($t));}return $t.xC.oM();}
function SHB(){return A(JGB().$rt_floatcls());}
function Ay($t,a){return ZFB(Bh(a),$t.jI);}
function Xm($t){var a;if(Ki($t)==0){a=null;}else{a=VFB($t.jI);}return a;}
function PGB(){return A(JGB().$rt_booleancls());}
function LGB(){return A(JGB().$rt_voidcls());}
function KD_$clinit(){KD_$clinit=function(){};
Se=function(a){return Tj(M2(QJB(),a));};
OAB=function(a){return JWB(a);};
Ej=function(){KD.XG=NaN;KD.CG=SHB();return;};
GI=function($t,a){F6($t);$t.OC=a;return;};
Qd=function(a,b){if(a>b){a=1;}else if(b>=a){a=0;}else{a= -1;}return a;};
Ej();}
function JWB(a){var $r=new KD();GI($r,a);return $r;}
function Ht($t){return Long_fromNumber($t.OC);}
function Hp($t){return $t.OC|0;}
function F0($t){return $t.OC;}
function F8($t,a){return Fe($t,a);}
function Kk($t){return $t.OC;}
function Fe($t,a){return Qd($t.OC,a.OC);}
function FW($t){return Se($t.OC);}
function KWB(){var $r=new UI();G2($r);return $r;}
function NIB(a,b,c,d,e,f){var g,h,i,j,k,m;g=c;h=d;$ba:{$bb:{while(c!=d){if(h==e){break $bb;}i=a.data;j=i[c];k=i[h];if(f.jB(j,k)>0){i=b.data;m=g+1|0;i[g]=k;h=h+1|0;}else{i=b.data;m=g+1|0;i[g]=j;c=c+1|0;}g=m;}while(true){if(h>=e){break $ba;}d=a.data;m=b.data;j=g+1|0;c=h+1|0;m[g]=d[h];g=j;h=c;}}while(c<d){e=a.data;i=b.data;m=g+1|0;j=c+1|0;i[g]=e[c];g=m;c=j;}}return;}
function G2($t){Wu($t);return;}
function YFB(a,b){var c,d;a=a.data;c=$rt_createCharArray(b);d=UFB(b,a.length);b=0;while(b<d){c.data[b]=a[b];b=b+1|0;}return c;}
function KHB(a,b){var c,d,e,f,g,h,i;c=a.data.length;if(c==0){return;}d=GJB(E,c);e=1;f=a;while(e<c){g=0;while(true){h=f.data.length;if(g>=h){break;}NIB(f,d,g,UFB(h,g+e|0),UFB(h,g+(2*e|0)|0),b);g=g+(e*2|0)|0;}e=e*2|0;i=f;f=d;d=i;}if(f!==a){i=0;while(true){a=f.data;if(i>=a.length){break;}d.data[i]=a[i];i=i+1|0;}}return;}
function FIB(a,b){var c,d;c=a.data;a=SGB(KW(Hh(a)),b);d=UFB(b,c.length);b=0;while(b<d){a.data[b]=c[b];b=b+1|0;}return a;}
function JPB(){var $r=new QJ();L3($r);return $r;}
function Fj($t){return GJB(Z,0);}
function L3($t){Wu($t);return;}
function LWB(){var $r=new BS();UY($r);return $r;}
function XW($t,a){XIB().$rt_putStdout(a);return;}
function UY($t){HU($t);return;}
function MWB(){var $r=new T();Jm($r);return $r;}
function Jm($t){H3($t);return;}
function NWB(){var $r=new CN();Rw($r);return $r;}
function Qi($t){return 0;}
function ZCB($t){return XAB();}
function Rw($t){Jm($t);return;}
function OWB(){var $r=new KB();Cs($r);return $r;}
function Cs($t){Wu($t);return;}
function PWB(){var $r=new BN();Cx($r);return $r;}
function Cx($t){Cs($t);return;}
function QWB(){var $r=new EN();Dc($r);return $r;}
function DZ($t,a){CJB(ALB());}
function EEB($t){return 0;}
function Dc($t){D7($t);return;}
function JB_$clinit(){JB_$clinit=function(){};
MU=function(a){return Rn(a);};
S1=function(a,b){return ((a&1023)<<10|b&1023)+65536|0;};
Rn=function(a){var b,c,d,e,f;b=JX().data;c=0;d=(b.length/2|0)-1|0;while(d>=c){e=(c+d|0)/2|0;f=DJB(a,b[e*2|0]);if(f>0){c=e+1|0;}else{if(f>=0){return b[(e*2|0)+1|0];}d=e-1|0;}}return  -1;};
A6=function(a){if(Vd(a)==0&&Ob(a)==0){a=0;}else{a=1;}return a;};
V4=function(a,b){return a-b|0;};
M7=function(a){var b,c;if(a<65536){b=$rt_createCharArray(1);b.data[0]=a&65535;return b;}c=$rt_createCharArray(2);b=c.data;b[0]=DEB(a);b[1]=C1(a);return c;};
Ob=function(a){if((a&64512)!=56320){a=0;}else{a=1;}return a;};
W3=function(a){var b,c;b=new UC;c=$rt_createCharArray(1);c.data[0]=a;UG(b,c);return b;};
EW=function(){if(JB.LK===null){JB.LK=L4();}return JB.LK;};
Vf=function(a){var b;if(a>=JB.FI.data.length){return RWB(a);}b=JB.FI.data[a];if(b===null){b=RWB(a);JB.FI.data[a]=b;}return b;};
Vd=function(a){if((a&64512)!=55296){a=0;}else{a=1;}return a;};
L4=function(){return {"value":"&(#*% .%%2%)6%-:%1>%5B%9F%=J%AN%Eo%Is%Mw%Q{%U!'Y&'^*'b.'f2'j6'n:'r>'vB'zF'!#J'&#N'*#R'.#V'2#Z'6#_':#c'>#g'B#k'F#o'J#s'N#w'R#6)I:)M>)QB)UF)YJ)^N)bR)fV)jZ)n_)rc)vg)zk)!#o)&#s)*#w).#{)2#!+6#&+:#*+>#.+B#2+F#6+J#:+N#>+R#{R# !T#%&T#)*T#-.T#12T#56T#9:T#=>T#ABT#E6a# :a#%>a#)Ba#-Fa#1Ja#5Na#9Ra#=Va#AZa#E:s# >s#%Bs#)Fs#-Js#1Ns#5Rs#9Vs#=Zs#A_s#EZ:% _:%%c:%)g:%-k:%1o:%5s:%9w:%={:%A!<%E2F% 6F%%:F%)>F%-BF%1FF%5JF%9NF%=RF%AVF%EgP% kP%%oP%)sP%-wP%1{P%5!R%9&R%=*R%A.R%E>]% B]%%F]%)J]%-N]%1R]%5V]%9Z]%=_]%Ac]%Esg% wg%%{g%)!i%-&i%1*i%5.i%92i%=6i%A:i%EJs% Ns%%Rs%)Vs%-Zs%1_s%5cs%9gs%=ks%Aos%E!!' &!'%*!').!'-2!'16!'5:!'9>!'=B!'AF!'EV,' Z,'%_,')c,'-g,'1k,'5o,'9s,'=w,'A{,'E.8' 28'%68'):8'->8'1B8'5F8'9J8'=N8'AR8'E>L' BL'%FL')JL'-NL'1RL'5VL'9ZL'=_L'AcL'EsV' wV'%{V')!X'-&X'1*X'5.X'92X'=6X'A:X'EB_' F_'%J_')N_'-R_'1V_'5Z_'9__'=c_'Ag_'Esw' ww'%{w')!y'-&y'1*y'5.y'92y'=6y'A:y'EB!) F!)%J!))N!)-R!)1V!)5Z!)9_!)=c!)Ag!)Egi+ ki+%oi+)si+-wi+1{i+5!k+9&k+=*k+A.k+Eom+ sm+%wm+){m+-!o+1&o+5*o+9.o+=2o+A6o+E>,- B,-%F,-)J,--N,-1R,-5V,-9Z,-=_,-Ac,-E>8- B8-%F8-)J8--N8-1R8-5V8-9Z8-=_8-Ac8-E{F- !H-%&H-)*H--.H-12H-56H-9:H-=>H-ABH-E_H- cH-%gH-)kH--oH-1sH-5wH-9{H-=!J-A&J-E!Z- &Z-%*Z-).Z--2Z-16Z-5:Z-9>Z-=BZ-AFZ-E2c- 6c-%:c-)>c--Bc-1Fc-5Jc-9Nc-=Rc-AVc-EJo- No-%Ro-)Vo--Zo-1_o-5co-9go-=ko-Aoo-E.q- 2q-%6q-):q-->q-1Bq-5Fq-9Jq-=Nq-ARq-E&4r *4r%.4r)24r-64r1:4r5>4r9B4r=F4rAJ4rE{or !qr%&qr)*qr-.qr12qr56qr9:qr=>qrABqrE&ur *ur%.ur)2ur-6ur1:ur5>ur9Bur=FurAJurE**t .*t%2*t)6*t-:*t1>*t5B*t9F*t=J*tAN*tE_4t c4t%g4t)k4t-o4t1s4t5w4t9{4t=!6tA&6tEgXt kXt%oXt)sXt-wXt1{Xt5!Zt9&Zt=*ZtA.ZtE{c@# !e@#%&e@#)*e@#-.e@#12e@#56e@#9:e@#=>e@#ABe@#Ece@#Ige@#Mke@#Qoe@#Use@#Ywe@#^{e@#b!g@#f&g@#j*g@#n.g@#r2g@#v6g@#z:g@#!#>g@#&#Bg@#*#Fg@#.#Jg@#2#Ng@#6#Rg@#:#Vg@#>#Zg@#B#_g@#F#cg@#J#gg@#N#kg@#R#*i@#I.i@#M2i@#Q6i@#U:i@#Y>i@#^Bi@#bFi@#fJi@#jNi@#nRi@#rVi@#vZi@#z_i@#!#ci@#&#gi@#*#ki@#.#oi@#2#si@#6#wi@#:#{i@#>#!k@#B#&k@#F#*k@#J#.k@#N#2k@#R#s&D# w&D#%{&D#)!(D#-&(D#1*(D#5.(D#92(D#=6(D#A:(D#EwuH# {uH#%!wH#)&wH#-*wH#1.wH#52wH#96wH#=:wH#A>wH#Ew$J# {$J#%!&J#)&&J#-*&J#1.&J#52&J#96&J#=:&J#A>&J#E{*J# !,J#%&,J#)*,J#-.,J#12,J#56,J#9:,J#=>,J#AB,J#E_8J# c8J#%g8J#)k8J#-o8J#1s8J#5w8J#9{8J#=!:J#A&:J#EZJL# _JL#%cJL#)gJL#-kJL#1oJL#5sJL#9wJL#={JL#A!LL#EF0N% J0N%%N0N%)R0N%-V0N%1Z0N%5_0N%9c0N%=g0N%Ak0N%Eo0N% s0N%%w0N%){0N%-!2N%1&2N%5*2N%9.2N%=22N%A62N%E:2N% >2N%%B2N%)F2N%-J2N%1N2N%5R2N%9V2N%=Z2N%A_2N%Ec2N% g2N%%k2N%)o2N%-s2N%1w2N%5{2N%9!4N%=&4N%A*4N%E.4N% 24N%%64N%):4N%->4N%1B4N%5F4N%9J4N%=N4N%AR4N%E"}
;};
JX=function(){if(JB.BI===null){JB.BI=XGB((EW().value!==null?$rt_str(EW().value):null));}return JB.BI;};
QW=function(a){return BHB(a).toLowerCase().charCodeAt(0);};
WAB=function(a,b){if(b>=2&&b<=36&&a<b){if(a<10){a=(48+a|0)&65535;}else{a=((97+a|0)-10|0)&65535;}return a;}return 0;};
C1=function(a){return (56320|a&1023)&65535;};
DEB=function(a){return (55296|(a-65536|0)>>10&1023)&65535;};
Ac=function(){JB.mH=BIB();JB.FI=GJB(JB,128);return;};
Ty=function(a){return QW(a)&65535;};
TO=function($t,a){Wu($t);$t.NG=a;return;};
Ac();}
function RWB(a){var $r=new JB();TO($r,a);return $r;}
function OW($t,a){return OX($t,a);}
function YV($t){return W3($t.NG);}
function OX($t,a){return V4($t.NG,a.NG);}
function OV($t){return $t.NG;}
function SWB(){var $r=new FN();Ga($r);return $r;}
function BCB($t){return 0;}
function PU($t){CJB(BWB());}
function Ga($t){Wu($t);return;}
function NTB(){var $r=new WQ();WEB($r);return $r;}
function Lv($t){return GJB(Z,0);}
function WEB($t){Wu($t);return;}
function TWB(a,b){var $r=new IS();Zo($r,a,b);return $r;}
function Fo($t,a){var b;if(N1($t.BE)==0){return Cp($t,a);}if($t.BF!==FJB(BI)){E8($t,Yg($t),a);return 1;}b=a;if(Cp($t,a)==0){return 0;}OGB(RHB($t.BE),b.hM,b.XH);return 1;}
function E8($t,a,b){var c;if(N1($t.BE)==0){J8($t,a,b);return;}if($t.BF!==FJB(RJ)){CJB(BMB());}c=b;J8($t,a,b);GHB(RHB($t.BE),a,c.zK,Ce(c.IF),Ce(c.LC),c.NF);return;}
function Ko($t,a){var b;if(N1($t.BE)==0){return Jq($t,a);}if(a!=0&&$t.BF!==FJB(RJ)){CJB(BMB());}b=Jq($t,a);U1($t.BE,a);return b;}
function Zo($t,a,b){$t.BE=a;Iy($t);$t.BF=b;return;}
function GBB($t,a,b){var c,d,e,f;c=MZ($t,a,b);if(N1($t.BE)!=0){if($t.BF===FJB(BI)){d=b;if(WGB($t.BE).data.length!=d.hM.data.length){CJB(OMB());}$ba:{e=TIB($t.BE);f= -1;switch(Le(e)){case 66547:if(J3(e,$rt_s(36))==0){break $ba;}f=2;break $ba;case 2368532:if(J3(e,$rt_s(37))==0){break $ba;}f=0;break $ba;case 78717670:if(J3(e,$rt_s(38))==0){break $ba;}f=1;break $ba;default:}}$bb:{switch(f){case 0:case 1:f=$rt_s(39);break $bb;case 2:f=$rt_s(40);break $bb;default:}CJB(VNB());}PHB(RHB($t.BE),f,WGB($t.BE).data.length,
a,d.XH,d.hM);}if($t.BF===FJB(RJ)){b=b;ZIB(RHB($t.BE),a,b.NF,b.zK);}}return c;}
function CUB(){var $r=new MM();H7($r);return $r;}
function ZDB($t){return GJB(Z,0);}
function H7($t){Wu($t);return;}
function JTB(){var $r=new YO();LCB($r);return $r;}
function Hn($t){return GJB(Z,0);}
function LCB($t){Wu($t);return;}
function UWB(a,b,c){var $r=new KC();WV($r,a,b,c);return $r;}
function WV($t,a,b,c){Ew($t,a);$t.cE=b;$t.bD=c;return;}
function Re($t,a){var b,c,d,e,f,g,h,i;if($t===a){return 0;}b=UFB(Zy($t),Zy(a));c=$t.cE;d=a.cE;e=0;while(true){if(e>=b){return Nz(Zy($t),Zy(a));}f=c+1|0;g=Ye($t,c);h=d+1|0;i=V4(g,Ye(a,d));if(i!=0){break;}e=e+1|0;c=f;d=h;}return i;}
function SIB(a,b,c){return VWB(0,a.data.length,a,b,b+c|0,0);}
function Tk($t,a){return Re($t,a);}
function Kw($t){var a,b,c,d,e;a=$rt_createCharArray($t.bD-$t.cE|0);b=$t.cE;c=0;while(true){d=a.data;if(c>=d.length){break;}e=b+1|0;d[c]=Ye($t,b);c=c+1|0;b=e;}return B(a);}
function Sc($t,a,b,c){var d,e,f,g,h,i,j;if(b>=0){d=a.data;e=d.length;if(b<e){f=b+c|0;if(f>e){CJB(ZKB(Tj(Qa(DY(DY(Qa(DY(QJB(),$rt_s(41)),f),$rt_s(42)),$rt_s(43)),e))));}if(Zy($t)<c){CJB(WWB());}if(c<0){CJB(ZKB(Tj(DY(Qa(DY(QJB(),$rt_s(44)),c),$rt_s(45)))));}g=$t.cE;h=0;while(h<c){i=b+1|0;j=g+1|0;d[b]=Ye($t,g);h=h+1|0;b=i;g=j;}$t.cE=$t.cE+c|0;return $t;}}CJB(ZKB(Tj(DY(Qa(DY(Qa(DY(QJB(),$rt_s(46)),b),$rt_s(13)),a.data.length),$rt_s(47)))));}
function XWB(a,b,c){var $r=new YC();So($r,a,b,c);return $r;}
function So($t,a,b,c){WV($t,a,b,c);return;}
function VWB(a,b,c,d,e,f){var $r=new MR();XDB($r,a,b,c,d,e,f);return $r;}
function Ye($t,a){return $t.sM.data[a+$t.yI|0];}
function XDB($t,a,b,c,d,e,f){So($t,b,d,e);$t.yI=a;$t.IL=f;$t.sM=c;return;}
function GRB(){var $r=new VP();Lx($r);return $r;}
function Ui($t){return GJB(Z,0);}
function Lx($t){Wu($t);return;}
function VUB(){var $r=new EO();YU($r);return $r;}
function QU($t){return GJB(Z,0);}
function YU($t){Wu($t);return;}
function RPB(){var $r=new UT();Dv($r);return $r;}
function EV($t){return GJB(Z,0);}
function Dv($t){Wu($t);return;}
function ISB(){var $r=new FJ();Pt($r);return $r;}
function Ne($t){return GJB(Z,0);}
function Pt($t){Wu($t);return;}
function KUB(){var $r=new DI();Lk($r);return $r;}
function O6($t){return GJB(Z,0);}
function Lk($t){Wu($t);return;}
function DTB(){var $r=new QL();Cn($r);return $r;}
function OU($t){return GJB(Z,0);}
function Cn($t){Wu($t);return;}
function YWB(a,b){var $r=new DQ();QV($r,a,b);return $r;}
function ZWB(a){var $r=new DQ();UU($r,a);return $r;}
function UHB(a,b){var c,d;c=Jv(Eq(Qh(),a).xF);while(Ia(c)!=0){d=H0(c);if(b===IGB(d)){return Ix(b,FGB(d));}}return null;}
function QV($t,a,b){Wu($t);$t.xF=b;$t.tD=a;return;}
function UIB(a){return a.tD;}
function UU($t,a){QV($t,a,VMB());return;}
function Oh($t,a,b,c){Cp($t.xF,AXB(a,b,c));return;}
function Zf($t){Fi($t.xF,BXB($t,null));return Ug(Qh(),YWB($t.tD,I0($t.xF)));}
function CXB(){var $r=new AT();Tr($r);return $r;}
function Tr($t){Wu($t);return;}
function DXB(){var $r=new CU();Xt($r);return $r;}
function NHB(a,b){var c,d,e,f,g,h,i,$je;c=0;$ba:{$bb:{try{d=F7(a);}catch($e){$je=$e.$javaException;if($je&&$je instanceof CJ){e=$je;break $bb;}else {throw $e;}}break $ba;}d=null;}f=EXB();d=Xi(XHB(FJB(AE),d));while(Z6(d)!=0){g=Rf(d);if(I9(f,Hh(g))==0){continue;}Zi(g,b,a);c=1;}$bc:{$bd:{try{h=Xi(XHB(FJB(AE),F7(FJB(AE))));i=c;$be:while(true){try{while(true){try{if(Z6(h)==0){break $be;}c=Rf(h);if(I9(f,Hh(c))==0){i=i;c=i;continue;}Zi(c,b,a);c=1;i=c;continue;}catch($e){$je=$e.$javaException;if($je&&$je instanceof CJ)
{d=$je;break $bd;}else {throw $e;}}}}catch($e){$je=$e.$javaException;if($je&&$je instanceof CJ){d=$je;break $bd;}else {throw $e;}}}}catch($e){$je=$e.$javaException;if($je&&$je instanceof CJ){d=$je;break $bd;}else {throw $e;}}break $bc;}if(c==0){CJB(d);}i=c;}if(i==0){c=Xi(QFB(FJB(AE)));while(Z6(c)!=0){d=Rf(c);if(I9(f,Hh(d))==0){continue;}Zi(d,b,a);i=1;}}return i;}
function THB(a,b){return UHB(a,b);}
function DFB(a){return FXB(a);}
function Xt($t){Wu($t);return;}
function AJB(){return DFB(GJB(E,0));}
function WUB(){var $r=new VR();BDB($r);return $r;}
function Aq($t){return GJB(Z,0);}
function BDB($t){Wu($t);return;}
function OSB(){var $r=new XI();Xx($r);return $r;}
function Gm($t){return GJB(Z,0);}
function Xx($t){Wu($t);return;}
function PVB(){var $r=new BF();X8($r);return $r;}
function At($t){var a,b,c,d,e,f;a=GJB(Z,2);b=a.data;c=GJB(R,1);d=c.data;R_$clinit();e=R.cG;d[0]=e;e=GXB(c);b[0]=e;WB_$clinit();e=WB.MC;f=HXB(e);b[1]=f;return a;}
function X8($t){Wu($t);return;}
function CQB(){var $r=new FQ();LW($r);return $r;}
function Bl($t){return GJB(Z,0);}
function LW($t){Wu($t);return;}
function TJB(){var $r=new HR();U0($r);return $r;}
function U0($t){En($t);return;}
function ZSB(){var $r=new UH();Zc($r);return $r;}
function XBB($t){return GJB(Z,0);}
function Zc($t){Wu($t);return;}
function LQB(){var $r=new ZH();Ns($r);return $r;}
function Bg($t){return GJB(Z,0);}
function Ns($t){Wu($t);return;}
function NJB(){var $r=new ZP();AV($r);return $r;}
function AV($t){Ba($t);return;}
function IXB(a){var $r=new OI();ZW($r,a);return $r;}
function ZW($t,a){Wu($t);$t.eG=a;return;}
function Ce($t){return $t.eG;}
function ZHB(a){return IXB(a);}
function BTB(){var $r=new US();X9($r);return $r;}
function O8($t){return GJB(Z,0);}
function X9($t){Wu($t);return;}
function UC_$clinit(){UC_$clinit=function(){};
GG=function($t){Wu($t);$t.sB=$rt_createCharArray(0);return;};
EU=function($t,a,b,c){var d,e;Wu($t);$t.sB=$rt_createCharArray(c);d=0;while(d<c){e=a.data;$t.sB.data[d]=e[d+b|0];d=d+1|0;}return;};
Q9=function(a){return a;};
DF=function($t,a,b,c){var d,e,f,g,h,i,j,k,m;Wu($t);$t.sB=$rt_createCharArray(c*2|0);d=0;e=0;while(e<c){f=a.data;g=b+1|0;h=f[b];if(h<65536){i=$t.sB.data;j=d+1|0;i[d]=h&65535;}else{k=$t.sB.data;m=d+1|0;k[d]=DEB(h);i=$t.sB.data;j=m+1|0;i[m]=C1(h);}e=e+1|0;b=g;d=j;}if(d<$t.sB.data.length){$t.sB=YFB($t.sB,d);}return;};
Zp=function(a){if(a===null){a=Q9($rt_s(32));}else{a=Q9(a.c());}return a;};
UG=function($t,a){var b,c,d;b=a.data;Wu($t);c=b.length;$t.sB=$rt_createCharArray(c);d=0;while(d<c){$t.sB.data[d]=b[d];d=d+1|0;}return;};
D1=function(){UC.UE=CXB();UC.PG=KOB();return;};
D1();}
function JXB(){var $r=new UC();GG($r);return $r;}
function ZVB(a,b,c){var $r=new UC();EU($r,a,b,c);return $r;}
function KXB(a,b,c){var $r=new UC();DF($r,a,b,c);return $r;}
function B(a){var $r=new UC();UG($r,a);return $r;}
function Nd($t,a,b){var c,d,e;if(a<65536){c=a&65535;while(b<$t.sB.data.length){if($t.sB.data[b]==c){return b;}b=b+1|0;}return  -1;}d=DEB(a);e=C1(a);while(b<($t.sB.data.length-1|0)){if($t.sB.data[b]==d&&$t.sB.data[b+1|0]==e){return b;}b=b+1|0;}return  -1;}
function K9($t){var a;if($t.sB.data.length!=0){a=0;}else{a=1;}return a;}
function G($t){var a;a=J2(UC.PG,$t);if(a!==null){$t=a;}else{Ma(UC.PG,$t,$t);}return $t;}
function Qk($t,a){var b,c,d;if($t===a){return 0;}b=UFB(C($t),C(a));c=0;while(true){if(c>=b){return C($t)-C(a)|0;}d=Ty(Hf($t,c))-Ty(Hf(a,c))|0;if(d!=0){break;}c=c+1|0;}return d;}
function Le($t){var a,b,c;if($t.JB==0){a=$t.sB.data;b=a.length;c=0;while(c<b){$t.JB=(31*$t.JB|0)+a[c]|0;c=c+1|0;}}return $t.JB;}
function SY($t,a,b){if(a>b){CJB(ALB());}return ZVB($t.sB,a,b-a|0);}
function V9($t){var a,b,c;a=$rt_createCharArray($t.sB.data.length);b=0;while(true){c=a.data;if(b>=c.length){break;}c[b]=$t.sB.data[b];b=b+1|0;}return a;}
function Hf($t,a){if(a>=0&&a<$t.sB.data.length){return $t.sB.data[a];}CJB(BLB());}
function Nx($t,a){return K3($t,a);}
function Fu($t,a){var b,c,d,e;if($t===a){return 1;}if(C(a)>C($t)){return 0;}b=0;c=C($t)-C(a)|0;while(c<C($t)){d=Hf($t,c);e=b+1|0;if(d!=Hf(a,b)){return 0;}c=c+1|0;b=e;}return 1;}
function D($t,a,b,c,d){var e,f,g;if(a>=0&&a<=b&&b<=$t.t()&&d>=0){e=c.data;if((d+(b-a|0)|0)<=e.length){while(a<b){f=d+1|0;g=a+1|0;e[d]=$t.iG(a);d=f;a=g;}return;}}CJB(ALB());}
function Uk($t){return $t;}
function C($t){return $t.sB.data.length;}
function B6($t,a){return Tf($t,a,C($t)-1|0);}
function Tf($t,a,b){var c,d;if(a<65536){a=a&65535;while(b>=0){if($t.sB.data[b]==a){return b;}b=b+ -1|0;}return  -1;}c=DEB(a);d=C1(a);while(b>=1){if($t.sB.data[b]==d&&$t.sB.data[b-1|0]==c){return b-1|0;}b=b+ -1|0;}return  -1;}
function J3($t,a){var b,c;if($t===a){return 1;}if(a instanceof UC==0){return 0;}b=a;if(C(b)!=C($t)){return 0;}c=0;while(c<C(b)){if(Hf($t,c)!=Hf(b,c)){return 0;}c=c+1|0;}return 1;}
function K3($t,a){var b,c,d;if($t===a){return 0;}b=UFB(C($t),C(a));c=0;while(true){if(c>=b){return C($t)-C(a)|0;}d=Hf($t,c)-Hf(a,c)|0;if(d!=0){break;}c=c+1|0;}return d;}
function Kp($t){var a,b,c,d,e,f;if(K9($t)!=0){return $t;}a=$rt_createIntArray($t.sB.data.length);b=0;c=0;while(c<$t.sB.data.length){if(c!=($t.sB.data.length-1|0)&&Vd($t.sB.data[c])!=0&&Ob($t.sB.data[c+1|0])!=0){d=a.data;e=b+1|0;d[b]=QW(S1($t.sB.data[c],$t.sB.data[c+1|0]));c=c+1|0;}else{f=a.data;e=b+1|0;f[b]=Ty($t.sB.data[c]);}c=c+1|0;b=e;}return KXB(a,0,b);}
function DBB($t){var a,b;a=0;b=C($t)-1|0;$ba:{while(true){if(a>b){break $ba;}if(Hf($t,a)>32){break;}a=a+1|0;}}while(a<=b&&Hf($t,b)<=32){b=b+ -1|0;}return SY($t,a,b+1|0);}
function KRB(){var $r=new HJ();Zz($r);return $r;}
function E5($t){return GJB(Z,0);}
function Zz($t){Wu($t);return;}
function LXB(a,b,c){var $r=new MD();On($r,a,b,c);return $r;}
function Fg($t,a,b){var c,d,e,f,g,h,i,j,k,m;c=$rt_createCharArray(UFB(Zy(a),512));d=0;e=0;f=$rt_createByteArray(UFB(Zy(b),512));$ba:{while(true){if((d+32|0)>e&&M1(a)!=0){g=d;while(g<e){h=c.data;h[g-d|0]=h[g];g=g+1|0;}g=c.data;i=e-d|0;e=UFB(Zy(a)+i|0,g.length);Sc(a,c,i,e-i|0);d=0;}if(M1(b)==0){if(M1(a)==0&&d>=e){ZC_$clinit();j=ZC.YJ;}else{ZC_$clinit();j=ZC.VL;}break $ba;}g=f.data;k=0;g=UFB(Zy(b),g.length);m=XJB(a,b);j=ECB($t,c,d,e,f,k,g,m);d=m.OH;if(j===null&&k==m.QK){ZC_$clinit();j=ZC.YJ;}G3(b,f,0,m.QK);if(j
!==null){break;}}}Xy(a,Ef(a)-(e-d|0)|0);return j;}
function On($t,a,b,c){Q0($t,a,b,c);return;}
function MXB(a){var $r=new TM();Gu($r,a);return $r;}
function Gu($t,a){On($t,a,2.0,4.0);return;}
function ECB($t,a,b,c,d,e,f,g){var h,i,j,k,m,n,o,p,q,r;h=null;$ba:{while(true){if(b>=c){i=b;break $ba;}if(e>=f){break;}j=a.data;i=b+1|0;k=j[b];if(k<128){j=d.data;m=e+1|0;j[e]=k<<24>>24;}else if(k<2048){if((e+2|0)>f){i=i+ -1|0;if(Au(g,2)!=0){break $ba;}ZC_$clinit();h=ZC.VL;break $ba;}n=d.data;b=e+1|0;n[e]=(192|k>>6)<<24>>24;m=b+1|0;n[b]=(128|k&63)<<24>>24;}else if(A6(k)==0){if((e+3|0)>f){i=i+ -1|0;if(Au(g,3)!=0){break $ba;}ZC_$clinit();h=ZC.VL;break $ba;}n=d.data;o=e+1|0;n[e]=(224|k>>12)<<24>>24;j=o+1|0;n[o]
=(128|k>>6&63)<<24>>24;m=j+1|0;n[j]=(128|k&63)<<24>>24;}else{if(Vd(k)==0){h=Ag(1);break $ba;}if(i>=c){if(Kt(g)!=0){break $ba;}ZC_$clinit();h=ZC.YJ;break $ba;}p=i+1|0;n=j[i];if(Ob(n)==0){i=p+ -2|0;h=Ag(1);break $ba;}if((e+4|0)>f){i=p+ -2|0;if(Au(g,4)!=0){break $ba;}ZC_$clinit();h=ZC.VL;break $ba;}j=d.data;o=S1(k,n);n=e+1|0;j[e]=(240|o>>18)<<24>>24;q=n+1|0;j[n]=(128|o>>12&63)<<24>>24;r=q+1|0;j[q]=(128|o>>6&63)<<24>>24;m=r+1|0;j[r]=(128|o&63)<<24>>24;i=p;}b=i;e=m;}i=b;}Vy(g,i);PEB(g,e);return h;}
function KPB(){var $r=new CK();ODB($r);return $r;}
function Ph($t){return GJB(Z,0);}
function ODB($t){Wu($t);return;}
function ZRB(){var $r=new YH();Gw($r);return $r;}
function Xb($t){return GJB(Z,0);}
function Gw($t){Wu($t);return;}
function VVB(){var $r=new SP();Aa($r);return $r;}
function IX($t){return GJB(Z,0);}
function Aa($t){Wu($t);return;}
function PRB(){var $r=new DO();Pn($r);return $r;}
function UV($t){return GJB(Z,0);}
function Pn($t){Wu($t);return;}
function DC_$clinit(){DC_$clinit=function(){};
Hi=function(a,b,c,d,e,f){return VV(DC.JD,a,b,c,d,e,f);};
If=function(a,b){return Gl(DC.JD,a,b);};
NBB=function(a,b){return TU(DC.JD,a,b);};
Av=function(){Ra(FJB(LC));return;};
VI=function($t){Wu($t);if(DC.JD===null){DC.JD=$t;return;}CJB(VNB());};
Av();}
function NXB(){var $r=new DC();VI($r);return $r;}
function OXB(){var $r=new YN();Fk($r);return $r;}
function VV($t,a,b,c,d,e,f){return AOB(e,b,c,d,a,f);}
function Gl($t,a,b){if(b==0){a=Nt(a);}else{a=Ip(a);}return a;}
function TU($t,a,b){return My(a,b);}
function Fk($t){VI($t);return;}
function PE_$clinit(){PE_$clinit=function(){};
W1=function(a){if(a instanceof HC!=0){if(O1(a)==0){a=$rt_s(34);}else{a=$rt_s(33);}return a;}if(Km(a)!=0){return Hc(a.i());}if(a instanceof KD!=0){return Se(F0(a));}if(a instanceof XC==0){return a;}return JY(ADB(a));};
I3=function(a){a=THB(a,FJB(QB));if(a===null){a=T9();}return a;};
G5=function(a){var b;if(a instanceof M!=0){return Vf(M7(Oo(a).g()).data[0]);}if(a instanceof HC!=0){if(O1(a)==0){a=0;}else{a=1;}return Vf(a);}if(a instanceof UC==0){return a;}b=a;if(K9(b)!=0){a=0;}else{a=Hf(b,0);}return Vf(a);};
YW=function(a,b){var c;if(a===null){return null;}if(a instanceof SL!=0){return Gv(a);}if(HJB(a,IB)!=0){return CIB(a,b);}if(a instanceof UC==0&&a instanceof HC==0&&a instanceof M==0&&a instanceof JB==0&&a instanceof TB==0){a=By(a);if(a===null){return null;}a=If(a,1);if(a===null){c=null;}else{c=Wi(a);}return c;}return a;};
IV=function(a){var b,c,d,e;if(a===null){return $rt_s(32);}if(a instanceof TB!=0){a=a.c();}if(a instanceof JB!=0){a=W3(OV(a));}if(a instanceof UC==0){return a.c();}b=a;c=C(b);d=PXB(c+10|0);GX(d,34);a=0;while(a<c){$ba:{e=Hf(b,a);switch(e){case 9:break;case 10:DY(d,$rt_s(48));break $ba;case 13:DY(d,$rt_s(49));break $ba;case 34:DY(d,$rt_s(50));break $ba;case 92:DY(d,$rt_s(51));break $ba;default:GX(d,e);break $ba;}DY(d,$rt_s(52));}a=a+1|0;}GX(d,34);return Tj(d);};
By=function(a){var b;b=TV(Hh(a));if(b===null){return null;}return NBB(b,a);};
MCB=function(a){if(a instanceof UC!=0){return Rm(Ev(a));}if(a instanceof M==0){HC_$clinit();return Rm(Za(HC.qG,a));}if(Oo(a).h()==0.0){a=0;}else{a=1;}return Rm(a);};
Km=function(a){if(a instanceof AD==0&&a instanceof WE==0&&a instanceof XE==0&&a instanceof UD==0){a=0;}else{a=1;}return a;};
Oo=function(a){var b,c,$je;if(a instanceof UC!=0){$ba:{try{b=UX(a);}catch($e){$je=$e.$javaException;if($je&&$je instanceof IJ){c=$je;break $ba;}else {throw $e;}}return b;}return Xw(NaN);}if(a instanceof HC==0){return a;}if(O1(a)==0){a=0;}else{a=1;}return Lf(a);};
Ra=function(a){var b,c,$je;$ba:{$bb:{$bc:{$bd:{try{b=F7(a);}catch($e){$je=$e.$javaException;if($je&&$je instanceof CJ){c=$je;break $bd;}else if($je&&$je instanceof P){c=$je;break $bb;}else {throw $e;}}try{break $bc;}catch($e){$je=$e.$javaException;if($je&&$je instanceof P){c=$je;break $bb;}else {throw $e;}}}try{b=null;break $bc;}catch($e){$je=$e.$javaException;if($je&&$je instanceof P){c=$je;break $bb;}else {throw $e;}}}try{if(b!==null){WHB(MBB(a),1,b);}Ak(a);}catch($e){$je=$e.$javaException;if($je&&$je instanceof P)
{c=$je;break $bb;}else {throw $e;}}break $ba;}}return;};
TV=function(a){var b,c;b=0;while(b<2){c=J2(PE.SJ,a);if(c!==null){return c;}Ra(a);b=b+1|0;}return null;};
FX=function(){PE.SJ=KOB();return;};
Y5=function(a,b){Ma(PE.SJ,a,b);return;};
CQ=function($t){Wu($t);return;};
FX();}
function QXB(){var $r=new PE();CQ($r);return $r;}
function LOB(){var $r=new JT();C6($r);return $r;}
function K6($t){return MXB($t);}
function C6($t){HL($t,$rt_s(27),GJB(UC,0));return;}
function LVB(){var $r=new HN();O2($r);return $r;}
function Sl($t){return GJB(Z,0);}
function O2($t){Wu($t);return;}
function HWB(){var $r=new DU();Yp($r);return $r;}
function Yp($t){Dy($t);return;}
function YPB(){var $r=new JS();Cg($r);return $r;}
function Zw($t){return GJB(Z,0);}
function Cg($t){Wu($t);return;}
function BSB(){var $r=new MQ();N0($r);return $r;}
function GCB($t){return GJB(Z,0);}
function N0($t){Wu($t);return;}
function EPB(){var $r=new NO();RV($r);return $r;}
function QCB($t){return GJB(Z,0);}
function RV($t){Wu($t);return;}
function OQB(){var $r=new HG();Xj($r);return $r;}
function Ff($t){return GJB(Z,0);}
function Xj($t){Wu($t);return;}
function BQB(){var $r=new WH();Vl($r);return $r;}
function Q6($t){return GJB(Z,0);}
function Vl($t){Wu($t);return;}
function RXB(a){var $r=new VC();HV($r,a);return $r;}
function Pj($t){var a,b;Jr($t);if(Sa($t)==0){CJB(BWB());}if($t.rI===null){a=$t.ME.oF.data;b=$t.iI;$t.iI=b+1|0;$t.uK=a[b];$t.rI=$t.uK.BG;$t.nJ=null;}else{if($t.uK!==null){$t.nJ=$t.uK;}$t.uK=$t.rI;$t.rI=$t.rI.BG;}return;}
function HV($t,a){Wu($t);$t.ME=a;$t.lE=a.JL;$t.rI=null;return;}
function Jr($t){if($t.lE==$t.ME.JL){return;}CJB(SXB());}
function Sa($t){if($t.rI!==null){return 1;}while($t.iI<$t.ME.oF.data.length){if($t.ME.oF.data[$t.iI]!==null){return 1;}$t.iI=$t.iI+1|0;}return 0;}
function CRB(){var $r=new TS();Ly($r);return $r;}
function Jf($t){return GJB(Z,0);}
function Ly($t){Wu($t);return;}
function TXB(){var $r=new WS();BY($r);return $r;}
function YIB(a){if (a === null || a === undefined) {return a;} else if (typeof a === 'number') {return a;} else if (a.constructor.$meta && a.constructor.$meta.item) {var arr = new Array(a.data.length);for (var i = 0; i < arr.length; ++i) {arr[i] = YIB(a.data[i]);}return arr;} else if (a.constructor === UC) {var result = "";var data = a.sB.data;for (var i = 0; i < data.length; i = (i + 1) | 0) {result += String.fromCharCode(data[i]);}return result;} else if (a.constructor === UD) {return Ca(a)|0;} else if (a.constructor === XE) {return Ks(a)|0;} else if (a.constructor === AD) {return Be(a)|0;} else if (a.constructor === HC) {return O1(a)!==0;} else if (a.constructor === XC) {return ADB(a);} else if (a.constructor === JB) {return OV(a);} else {return a;}}
function BY($t){Wu($t);return;}
function OHB(a,b){if (a === null || a === undefined){return a;} else if (b.$meta.item) {var arr = $rt_createArray(b.$meta.item, a.length);for (var i = 0; i < arr.data.length; ++i) {arr.data[i] = OHB(a[i], b.$meta.item);}return arr;} else if (b === UC) {return $rt_str(a);} else if (b === HC) {return Rm(a?1:0);} else if (b === JB) {return Vf(typeof a === 'number' ? a & 0xFFFF : a.charCodeAt(0));} else if (b === UD) {return D9(a|0);} else if (b === XE) {return CX(a|0);} else if (b === AD) {return Lf(a|0);} else if (b === WE) {return Jb(Long_fromInt(a|0));} else if (b === XC) {return Xw(a);} else if (b === $rt_intcls() || b === $rt_bytecls() || b === $rt_shortcls() ||b == $rt_charcls()) {return a|0;} else if (b === $rt_longcls()) {return Long_fromInt(a|0);} else if (b === $rt_doublecls() || b == $rt_floatcls()) {return a;} else if (b === $rt_booleancls()) {return a?1:0;} else if (a instanceof Array) {var arr = $rt_createArray($rt_objcls(), a.length);for (var i = 0; i < arr.data.length; ++i) {arr.data[i] = OHB(a[i], $rt_objcls());}return arr;} else if (typeof a === 'string') {return $rt_str(a);} else if (typeof a === 'number') {if ((a|0) === a) {return Lf(a);} else {return Xw(a);}} else if (typeof a === 'boolean') {return Rm(a?1:0);} else {return a;}}
function DSB(){var $r=new DK();Ld($r);return $r;}
function L7($t){return GJB(Z,0);}
function Ld($t){Wu($t);return;}
function GXB(a){var $r=new PO();Pc($r,a);return $r;}
function Dq($t){return FJB(FE);}
function Pc($t,a){Wu($t);$t.gG=a;return;}
function F(){var $r=new OF();Zm($r);return $r;}
function Zm($t){Ba($t);return;}
function IUB(){var $r=new LN();Pf($r);return $r;}
function A9($t){return GJB(Z,0);}
function Pf($t){Wu($t);return;}
function SVB(){var $r=new SQ();Bd($r);return $r;}
function Dm($t){return GJB(Z,0);}
function Bd($t){Wu($t);return;}
function LJB(){var $r=new UL();WDB($r);return $r;}
function WDB($t){Wu($t);$t.sH=H();$t.mJ=[];$t.hE=[];return;}
function UXB(){var $r=new JR();Pd($r);return $r;}
function GIB(a,b){if(a>b){b=a;}return b;}
function UFB(a,b){if(a<b){b=a;}return b;}
function Pd($t){Wu($t);return;}
function QTB(){var $r=new BJ();MEB($r);return $r;}
function Jn($t){return GJB(Z,0);}
function MEB($t){Wu($t);return;}
function FTB(){var $r=new XT();Sh($r);return $r;}
function Ue($t){return GJB(Z,0);}
function Sh($t){Wu($t);return;}
function JRB(){var $r=new XO();Kh($r);return $r;}
function Uj($t){return GJB(Z,0);}
function Kh($t){Wu($t);return;}
function SQB(){var $r=new GQ();F9($r);return $r;}
function Z0($t){return GJB(Z,0);}
function F9($t){Wu($t);return;}
function DQB(){var $r=new KN();Qo($r);return $r;}
function S7($t){return GJB(Z,0);}
function Qo($t){Wu($t);return;}
function XTB(){var $r=new UM();AAB($r);return $r;}
function Px($t){return GJB(Z,0);}
function AAB($t){Wu($t);return;}
function VXB(){var $r=new GD();Xu($r);return $r;}
function Um($t,a,b){if(a<0){CJB(ALB());}Q3(An($t,a),b);return;}
function WY($t,a){var b,c;if(a<0){CJB(ALB());}b=An($t,a);c=Hg(b);V8(b);return c;}
function Is($t,a){if(a<0){CJB(ALB());}return Hg(An($t,a));}
function Ol($t){return Jh($t);}
function Xu($t){D7($t);return;}
function NVB(){var $r=new AG();RY($r);return $r;}
function Yx($t){return GJB(Z,0);}
function RY($t){Wu($t);return;}
function SOB(){var $r=new HK();Lr($r);return $r;}
function Ww($t){return GJB(Z,0);}
function Lr($t){Wu($t);return;}
function RUB(){var $r=new SI();Ot($r);return $r;}
function Nl($t){return GJB(Z,0);}
function Ot($t){Wu($t);return;}
function TPB(){var $r=new MT();Sg($r);return $r;}
function Eb($t){return GJB(Z,0);}
function Sg($t){Wu($t);return;}
function EVB(){var $r=new QQ();Io($r);return $r;}
function Zj($t){return GJB(Z,0);}
function Io($t){Wu($t);return;}
function TQB(){var $r=new TT();AEB($r);return $r;}
function Y1($t){return GJB(Z,0);}
function AEB($t){Wu($t);return;}
function WXB(){var $r=new PC();Pu($r);return $r;}
function Pu($t){Wu($t);return;}
function XXB(){var $r=new IR();G4($r);return $r;}
function G4($t){Pu($t);return;}
function YXB(){var $r=new DL();Gi($r);return $r;}
function Gi($t){Wu($t);return;}
function ZXB(){var $r=new AL();VAB($r);return $r;}
function Wl($t,a,b){if(a!==null){b=a.e(b);}else{b= -b.e(a)|0;}return b;}
function VAB($t){Wu($t);return;}
function AYB(){var $r=new OQ();Mz($r);return $r;}
function Mz($t){Ba($t);return;}
function JSB(){var $r=new NQ();Pi($r);return $r;}
function Op($t){return GJB(Z,0);}
function Pi($t){Wu($t);return;}
function SPB(){var $r=new KJ();U7($r);return $r;}
function Sv($t){return GJB(Z,0);}
function U7($t){Wu($t);return;}
function BYB(a,b,c,d){var $r=new DN();Tb($r,a,b,c,d);return $r;}
function Tb($t,a,b,c,d){Wu($t);$t.eD=a;$t.RL=c;$t.aD=TWB($t,b);$t.pK=d;return;}
function OGB(a,b,c){var result = (function(chart,data,label){chart.addData(data, label);}).call(null,YIB(a),YIB(b),YIB(c));return OHB(result,$rt_voidcls());}
function RHB(a){return a.GF;}
function N1($t){var a;if($t.GF===null){a=0;}else{a=1;}return a;}
function YHB(){return BYB($rt_s(53),FJB(RJ),CYB(),null);}
function Pa($t,a,b){var c,d;c=a.data;d=ANB($t,c[0],c[1],b);b=GDB($t.LE).k();while(b.q()!=0){b.n().B(d);}return;}
function HGB(){return BYB($rt_s(54),FJB(RJ),CYB(),null);}
function To($t,a){$t.LE=Bo($t.LE,a);return;}
function HHB(a,b,c,d,e,f,g){var result = (function(type,id,config,names,values,colors,highlights){var canvas = document.getElementById(id);
var ctx = canvas.getContext('2d');
var data = new Array();
for (var i = 0; i < values.length; i++) {
  data.push({
    'value' : values[i],
    'color' : colors[i],
    'highlight' : highlights[i],
    'label' : names[i]
  });
};
var graph = new Chart(ctx)[type](data, config);
return graph;
}).call(null,YIB(a),YIB(b),YIB(c),YIB(d),YIB(e),YIB(f),YIB(g));return OHB(result,E);}
function QGB(a){return BYB($rt_s(37),FJB(BI),CYB(),a);}
function RFB(a){return BYB($rt_s(38),FJB(BI),CYB(),a);}
function MFB(a,b,c,d,e){var result = (function(id,type,config,labels,names){var canvas = document.getElementById(id);
var ctx = canvas.getContext('2d');
var dataSets = [];
for (var i = 0; i < labels.length; i++) {
  dataSets.push({
    label : labels[i][0],
    fillColor: labels[i][1],
    strokeColor: labels[i][2],
    highlightFill: labels[i][3],
    highlightStroke: labels[i][4],
    data: labels[i][5]
  });
}
var data = {
  labels : names,
  datasets : dataSets
};
var graph = new Chart(ctx)[type](data, config);
return graph;
}).call(null,YIB(a),YIB(b),YIB(c),YIB(d),YIB(e));return OHB(result,E);}
function Og($t,a){var b,c,d,e,f,g,h,i,j,k,m,n,o,p,q,r,s,t,u;if($t.GF!==null){CJB(OJB($rt_s(55)));}if($t.pK===null){b=Ju($t.aD,GJB(RJ,0)).data;c=b.length;d=$rt_createDoubleArray(c);e=GJB(UC,c);f=GJB(UC,c);g=GJB(UC,c);h=0;while(h<c){i=d.data;j=e.data;k=f.data;m=g.data;i[h]=b[h].zK;j[h]=b[h].NF;k[h]=b[h].IF.eG;m[h]=b[h].LC.eG;h=h+1|0;}$t.GF=HHB($t.eD,a,$t.RL.XJ,e,d,f,g);j=$rt_s(56);}else{n=Ju($t.aD,GJB(BI,0)).data;o=n.length;p=GJB(UC,o);q=GJB(E,$t.pK.data.length);f=0;while(f<$t.pK.data.length){r=$t.pK.data[f].yD.oM();s
=$rt_createDoubleArray(o);h=0;while(h<o){s.data[h]=n[h].hM.data[f];h=h+1|0;}t=r.data;j=q.data;t[5]=s;j[f]=r;f=f+1|0;}h=0;while(h<o){p.data[h]=n[h].XH;h=h+1|0;}$ba:{u=$t.eD;j= -1;switch(Le(u)){case 66547:if(J3(u,$rt_s(36))==0){break $ba;}j=1;break $ba;case 2368532:if(J3(u,$rt_s(37))==0){break $ba;}j=0;break $ba;case 78717670:if(J3(u,$rt_s(38))==0){break $ba;}j=2;break $ba;default:}}$bb:{switch(j){case 0:j=$rt_s(57);break $bb;case 1:j=$rt_s(58);break $bb;case 2:j=$rt_s(57);break $bb;default:}CJB(OJB($t.eD));}$t.GF
=MFB(a,$t.eD,$t.RL.XJ,q,p);}Cy($t,a,j,$t.GF);return;}
function TIB(a){return a.eD;}
function ZIB(a,b,c,d){var result = (function(js,index,title,value){js.segments[index].label = title;
js.segments[index].value = value;
js.update();
}).call(null,YIB(a),YIB(b),YIB(c),YIB(d));return OHB(result,$rt_voidcls());}
function QHB(a){return BYB($rt_s(36),FJB(BI),CYB(),a);}
function PHB(a,b,c,d,e,f){var result = (function(js,type,sets,index,title,values){for (var i = 0; i < sets; i++) {
  js.datasets[i][type][index].label = title;
  js.datasets[i][type][index].value = values[i];
}
js.update();
}).call(null,YIB(a),YIB(b),YIB(c),YIB(d),YIB(e),YIB(f));return OHB(result,$rt_voidcls());}
function MGB(){return BYB($rt_s(59),FJB(RJ),CYB(),null);}
function AIB(a,b){var result = (function(chart,i){chart.removeData(i);}).call(null,YIB(a),YIB(b));return OHB(result,$rt_voidcls());}
function KFB(a){var result = (function(js){if (js.canvas) js.canvas.removeEventListener('mousedown', js.listener);
js.destroy();
}).call(null,YIB(a));return OHB(result,$rt_voidcls());}
function U1($t,a){AIB($t.GF,a);return;}
function Fv($t){return $t.aD;}
function Cy($t,a,b,c){var result = (function(id,fnName,graph){var self = this;
var canvas = document.getElementById(id);
canvas.addEventListener('mousedown', handleClick, false);
function handleClick(event)
{
  var x = event.x;
  var y = event.y;
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  var arr = graph[fnName](event);
  var info = [];
  for (var i = 0; i < arr.length; i++) {
    info.push(arr[i].label);
    info.push(arr[i].value);
  }
  (function($this, p0, p1) { return YIB($this.yL(OHB(p0, $rt_arraycls(E)), OHB(p1, $rt_arraycls(E)))); })(self,[event.shiftKey, event.ctrlKey, event.altKey, event.metaKey], info);
  event.stopPropagation();
  event.preventDefault();
}
graph.canvas = canvas;
graph.listener = handleClick;
}).call($t,YIB(a),YIB(b),YIB(c));return OHB(result,$rt_voidcls());}
function Da($t){KFB($t.GF);$t.GF=null;return;}
function GHB(a,b,c,d,e,f){var result = (function(chart,index,value,color,highlight,label){chart.addData({ value: value, color: color, highlight : highlight, label : label }, index);}).call(null,YIB(a),YIB(b),YIB(c),YIB(d),YIB(e),YIB(f));return OHB(result,$rt_voidcls());}
function WGB(a){return a.pK;}
function HQB(){var $r=new QT();Fl($r);return $r;}
function Wa($t){return GJB(Z,0);}
function Fl($t){Wu($t);return;}
function FQB(){var $r=new EP();A8($r);return $r;}
function ZAB($t){return GJB(Z,0);}
function A8($t){Wu($t);return;}
function DYB(){var $r=new II();Ru($r);return $r;}
function MIB(a){VX();return;}
function Ru($t){Wu($t);return;}
function HPB(){var $r=new RQ();Mg($r);return $r;}
function Rt($t){return GJB(Z,0);}
function Mg($t){Wu($t);return;}
function EYB(a){var $r=new CL();Vq($r,a);return $r;}
function C8($t,a){return $t.FK.m(a);}
function SZ($t){return $t.FK.f();}
function Vq($t,a){$t.FK=a;D7($t);return;}
function FYB(a,b){var $r=new BL();NAB($r,a,b);return $r;}
function O5($t,a){if(a>=0&&a<$t.zH){return $t.yH;}CJB(ALB());}
function Ii($t){return $t.zH;}
function NAB($t,a,b){$t.zH=a;$t.yH=b;D7($t);return;}
function MVB(){var $r=new LR();YBB($r);return $r;}
function Gc($t){return GJB(Z,0);}
function YBB($t){Wu($t);return;}
function RQB(){var $r=new XQ();O9($r);return $r;}
function Us($t){return GJB(Z,0);}
function O9($t){Wu($t);return;}
function GYB(a){var $r=new AR();QAB($r,a);return $r;}
function HYB(){var $r=new AR();P2($r);return $r;}
function QAB($t,a){LY($t,a);return;}
function P2($t){Ws($t);return;}
function NE_$clinit(){NE_$clinit=function(){};
GDB=function(a){var b;if(a===null){return Uw();}if(a instanceof NE==0){return Vb(1,a);}b=IYB();a=a;while(a!==null){Zq(b,a.yM);a=a.IG;}return b;};
Ps=function(a,b,c){if(b===null){return a;}if(a===null){return b;}if(a instanceof NE==0){if(a===b){return a;}return JYB(b,JYB(a,null));}$ba:{if(c!=0){c=a;while(true){if(c===null){break $ba;}if(c.yM===b){break;}c=c.IG;}return a;}}return JYB(b,a);};
Mn=function(){var a;if(P8(FJB(NE))!=0){a=0;}else{a=1;}NE.RG=a;return;};
EM=function($t,a,b){Wu($t);$t.yM=a;$t.IG=b;return;};
Bo=function(a,b){return Ps(a,b,1);};
Mn();}
function JYB(a,b){var $r=new NE();EM($r,a,b);return $r;}
function Yu($t,a){if(NE.RG!=0){return;}CJB(TJB());}
function UPB(){var $r=new NH();Jd($r);return $r;}
function Qm($t){return GJB(Z,0);}
function Jd($t){Wu($t);return;}
function PSB(){var $r=new GF();Wf($r);return $r;}
function Zn($t){var a,b,c,d,e;a=GJB(Z,1);b=a.data;c=GJB(UC,1);d=c.data;e=$rt_s(60);d[0]=e;e=KNB(c);b[0]=e;return a;}
function Wf($t){Wu($t);return;}
function RNB(a){var $r=new CM();Ar($r,a);return $r;}
function Ar($t,a){Wu($t);$t.PF=a;return;}
function KYB(a,b){var $r=new TB();D3($r,a,b);return $r;}
function Aw($t){return $t.nH;}
function ZV($t,a){if(D2(a)===D2($t)){return Nz($t.nH,Aw(a));}CJB(TLB(Q9(Tj(DY(DY(DY(DY(QJB(),$rt_s(61)),Uk(MBB(D2($t)))),$rt_s(62)),Uk(MBB(D2(a))))))));}
function D2($t){return Hh($t);}
function QBB($t){return $t.yE;}
function L2($t){return Uk($t.yE);}
function UAB($t,a){return ZV($t,a);}
function CHB(a,b){var c,d,e,f;c=Xm(a);if(c===null){CJB(TLB(Q9(Tj(PY(DY(QJB(),$rt_s(63)),MBB(a))))));}c=c.data;d=c.length;e=0;while(true){if(e>=d){CJB(TLB(Q9(Tj(DY(PY(DY(PY(DY(QJB(),$rt_s(64)),MBB(a)),$rt_s(65)),b),$rt_s(66))))));}f=c[e];if(J3(QBB(f),b)!=0){break;}e=e+1|0;}return f;}
function D3($t,a,b){Wu($t);$t.yE=a;$t.nH=b;return;}
function R_$clinit(){R_$clinit=function(){};
Qq=function(){return R.VI.oM();};
Pk=function(){var a,b;R.cG=LYB($rt_s(67),0);R.HF=LYB($rt_s(68),1);R.OM=LYB($rt_s(69),2);R.NE=LYB($rt_s(70),3);R.dM=LYB($rt_s(71),4);R.rM=LYB($rt_s(72),5);R.WK=LYB($rt_s(73),6);R.NI=LYB($rt_s(74),7);a=GJB(R,8);b=a.data;b[0]=R.cG;b[1]=R.HF;b[2]=R.OM;b[3]=R.NE;b[4]=R.dM;b[5]=R.rM;b[6]=R.WK;b[7]=R.NI;R.VI=a;return;};
FG=function($t,a,b){D3($t,a,b);return;};
Pk();}
function LYB(a,b){var $r=new R();FG($r,a,b);return $r;}
function WWB(){var $r=new DP();N4($r);return $r;}
function N4($t){Ba($t);return;}
function FUB(){var $r=new VJ();EBB($r);return $r;}
function Rz($t){return GJB(Z,0);}
function EBB($t){Wu($t);return;}
function GUB(){var $r=new RR();Gp($r);return $r;}
function Nv($t){return GJB(Z,0);}
function Gp($t){Wu($t);return;}
function NUB(){var $r=new YK();Gn($r);return $r;}
function Pe($t){return GJB(Z,0);}
function Gn($t){Wu($t);return;}
function MYB(){var $r=new JD();KEB($r);return $r;}
function IFB(a,b,c,d){return NYB(c,a,b,d);}
function KEB($t){Wu($t);return;}
function OYB(a,b,c){var $r=new UB();Na($r,a,b,c);return $r;}
function Na($t,a,b,c){KEB($t);$t.XD=a;$t.iM=b;$t.lH=c;return;}
function DX($t,a,b){var c;c=Vi($t);if(c===null){return;}Rr(YEB(My($t.lH,c)),PYB($t,c,a,b));return;}
function Iv($t){return $t.XD;}
function NYB(a,b,c,d){var $r=new NR();CBB($r,a,b,c,d);return $r;}
function X2($t){return QYB($t.KI,$t.XD,$t.iM,$t.lH);}
function CBB($t,a,b,c,d){Na($t,b,c,d);$t.KI=a;return;}
function NRB(){var $r=new AO();I8($r);return $r;}
function Lh($t){return GJB(Z,0);}
function I8($t){Wu($t);return;}
function PTB(){var $r=new IQ();R6($r);return $r;}
function Y2($t){return GJB(Z,0);}
function R6($t){Wu($t);return;}
function TOB(){var $r=new UQ();B4($r);return $r;}
function Ze($t){return GJB(Z,0);}
function B4($t){Wu($t);return;}
function WRB(){var $r=new TL();Vn($r);return $r;}
function Lg($t){return GJB(Z,0);}
function Vn($t){Wu($t);return;}
function RYB(){var $r=new IM();Qr($r);return $r;}
function YLB(a){var $r=new IM();Bk($r,a);return $r;}
function Uu($t,a,b,c,d){BZ($t,a,b,c,d);return;}
function Gs($t,a,b,c){XY($t,a,b,c);return;}
function XY($t,a,b,c){switch(b){case 0:Il(a,Sf(Rp(),FJB(UC),c));return;default:}CJB(BMB());}
function My($t,a){return Fm(a);}
function Oi($t,a,b){return Up($t,a,b);}
function Up($t,a,b){switch(b){case 0:break;default:CJB(BMB());}return Oa(a);}
function BZ($t,a,b,c,d){switch(b){case 0:break;case 1:Pp(a);return;case 2:UW(a);return;case 3:Bu(a);return;case 4:E4(a);return;case 5:IU(a);return;case 6:F3(a,Be(c.data[0]));return;default:CJB(BMB());}B3(a);return;}
function Qr($t){TF($t,FJB(XD),FJB(V),1,6);Fn($t,$rt_s(15),0,0);Ls($t,$rt_s(75),0);Ls($t,$rt_s(76),1);Ls($t,$rt_s(77),2);Ls($t,$rt_s(78),3);Ls($t,$rt_s(79),4);Ls($t,$rt_s(80),5);return;}
function Bk($t,a){Qr($t);return;}
function QPB(){var $r=new GP();EX($r);return $r;}
function Z3($t){var a,b,c,d,e,f;a=GJB(Z,2);b=a.data;c=GJB(R,1);d=c.data;R_$clinit();e=R.NI;d[0]=e;e=GXB(c);b[0]=e;WB_$clinit();e=WB.MC;f=HXB(e);b[1]=f;return a;}
function EX($t){Wu($t);return;}
function JUB(){var $r=new LH();R4($r);return $r;}
function Y6($t){return GJB(Z,0);}
function R4($t){Wu($t);return;}
function UVB(){var $r=new ZO();N8($r);return $r;}
function Nh($t){return GJB(Z,0);}
function N8($t){Wu($t);return;}
function WPB(){var $r=new LJ();ZU($r);return $r;}
function We($t){return GJB(Z,0);}
function ZU($t){Wu($t);return;}
function YTB(){var $r=new WM();Pz($r);return $r;}
function Hy($t){return GJB(Z,0);}
function Pz($t){Wu($t);return;}
function KJB(){var $r=new PN();C7($r);return $r;}
function C7($t){Kl($t);return;}
function ERB(){var $r=new AU();Dd($r);return $r;}
function WX($t){return GJB(Z,0);}
function Dd($t){Wu($t);return;}
function WE_$clinit(){WE_$clinit=function(){};
CO=function($t,a){F6($t);$t.AM=a;return;};
Jb=function(a){return SYB(a);};
Hc=function(a){return Tj(K1(QJB(),a));};
I2=function(){WE.BD=PFB();return;};
Lt=function(a,b){return Long_compare(a, b);};
I2();}
function SYB(a){var $r=new WE();CO($r,a);return $r;}
function WU($t){return $t.AM;}
function MY($t){return $t.AM.lo;}
function AFB($t,a){return Lt($t.AM,a.AM);}
function Gk($t){return Long_toNumber($t.AM);}
function Ie($t,a){return AFB($t,a);}
function Sm($t){return Long_toNumber($t.AM);}
function Ky($t){return Hc($t.AM);}
function GTB(){var $r=new XF();Bn($r);return $r;}
function Zh($t){return GJB(Z,0);}
function Bn($t){Wu($t);return;}
function UOB(){var $r=new NL();YZ($r);return $r;}
function O4($t){return GJB(Z,0);}
function YZ($t){Wu($t);return;}
function QQB(){var $r=new CH();BBB($r);return $r;}
function Rb($t){return GJB(Z,0);}
function BBB($t){Wu($t);return;}
function VTB(){var $r=new XR();P5($r);return $r;}
function KDB($t){return GJB(Z,0);}
function P5($t){Wu($t);return;}
function HVB(){var $r=new GO();Mb($r);return $r;}
function Ok($t){return GJB(Z,0);}
function Mb($t){Wu($t);return;}
function TYB(){var $r=new JQ();T2($r);return $r;}
function NGB(a){var b,c,d,e,f;b=0;c=1;while(true){d=a.PF.data;e=a.zL;a.zL=e+1|0;e=CGB(d[e]);if(e%2!=1){f=0;}else{f=1;}b=b+(c*(e/2|0)|0)|0;c=c*46|0;if(f==0){break;}}return b;}
function T2($t){Wu($t);return;}
function OFB(a){var b;b=NGB(a);a=b/2|0;if(b%2!=0){a= -a|0;}return a;}
function CGB(a){if(a<34){return a-32|0;}if(a>=92){return (a-32|0)-2|0;}return (a-32|0)-1|0;}
function GVB(){var $r=new PH();Zv($r);return $r;}
function Hl($t){return GJB(Z,0);}
function Zv($t){Wu($t);return;}
function MTB(){var $r=new DM();L6($r);return $r;}
function Qy($t){return GJB(Z,0);}
function L6($t){Wu($t);return;}
function QJB(){var $r=new RF();B8($r);return $r;}
function PXB(a){var $r=new RF();CAB($r,a);return $r;}
function Yd($t,a,b){Q7($t,a,b);return $t;}
function Qa($t,a){Mi($t,a);return $t;}
function DY($t,a){Jg($t,a);return $t;}
function LAB($t,a,b){Kv($t,a,b);return $t;}
function HBB($t,a,b){Ds($t,a,b);return $t;}
function Ex($t,a,b){IDB($t,a,b);return $t;}
function FCB($t,a){Wy($t,a);return;}
function K1($t,a){K4($t,a);return $t;}
function JV($t,a,b){return Yd($t,a,b);}
function Du($t,a,b,c,d){A0($t,a,b,c,d);return;}
function X6($t,a,b){Kr($t,a,b);return $t;}
function Tj($t){return RZ($t);}
function Xh($t){return W2($t);}
function B8($t){NJ($t);return;}
function Wm($t,a,b){return Ex($t,a,b);}
function CAB($t,a){XG($t,a);return;}
function Cq($t,a){Yw($t,a);return $t;}
function YDB($t,a,b){return HBB($t,a,b);}
function Mw($t,a,b){Pb($t,a,b);return $t;}
function M2($t,a){Hu($t,a);return $t;}
function GX($t,a){Y9($t,a);return $t;}
function Wt($t,a,b){return X6($t,a,b);}
function PY($t,a){I6($t,a);return $t;}
function Q2($t,a,b){return Mw($t,a,b);}
function NCB($t,a){Mh($t,a);return;}
function IY($t,a,b){return LAB($t,a,b);}
function BC_$clinit(){BC_$clinit=function(){};
QG=function($t,a){Wu($t);$t.GK=a;return;};
Nm=function(){return BC.jC;};
T3=function(){BC.jC=UYB();return;};
SK=function($t){QG($t,null);return;};
T3();}
function VYB(a){var $r=new BC();QG($r,a);return $r;}
function WYB(){var $r=new BC();SK($r);return $r;}
function SXB(){var $r=new IP();LBB($r);return $r;}
function LBB($t){Ba($t);return;}
function YSB(){var $r=new EL();EAB($r);return $r;}
function S8($t){return GJB(Z,0);}
function EAB($t){Wu($t);return;}
function XYB(){var $r=new IH();ZBB($r);return $r;}
function ZBB($t){Wu($t);return;}
function OUB(){var $r=new LI();BV($r);return $r;}
function Nw($t){return GJB(Z,0);}
function BV($t){Wu($t);return;}
function V_$clinit(){V_$clinit=function(){};
SEB=function(){return V.iF;};
Yr=function(a,b){var c,d,e,f,g,h,i,j,k;$ba:{c=QJB();d=V.iF.data[N9()];e=V.iF.data[N9()];f=FWB($rt_s(81),d,e);DY(c,$rt_s(82));DY(c,$rt_s(83));switch(b){case 0:break;case 1:g=GJB(OH,1);g.data[0]=f;h=QGB(g);DY(c,$rt_s(84));break $ba;default:b=GJB(OH,1);b.data[0]=f;h=RFB(b);DY(c,$rt_s(85));break $ba;}i=GJB(OH,1);i.data[0]=f;h=QHB(i);DY(c,$rt_s(86));}DY(c,$rt_s(87));DY(PY(DY(PY(c,d),$rt_s(88)),e),$rt_s(89));f=Fv(h);e=0;while(e<12){b=new BI;j=V.tM.data[e];k=$rt_createDoubleArray(1);k.data[0]=V.iD.data[e];Er(b,j,k);Fo(f,
b);DY(Cq(DY(DY(DY(c,$rt_s(90)),V.tM.data[e]),$rt_s(91)),V.iD.data[e]),$rt_s(92));e=e+1|0;}To(h,YYB(h));Og(h,$rt_s(93));DY(c,$rt_s(94));if(V.fG!==null){Da(V.fG);}V.fG=h;Il(a,Tj(c));return;};
Xr=function(){return V.iD;};
Bu=function(a){Yr(a,1);return;};
B3=function(a){F3(a,0);return;};
QEB=function(a){return Hv(a);};
IU=function(a){Yr(a,2);return;};
E4=function(a){Yr(a,0);return;};
UW=function(a){F3(a,2);return;};
F3=function(a,b){var c,d,e,f,g;$ba:{c=QJB();DY(c,$rt_s(82));DY(c,$rt_s(95));switch(b){case 0:break;case 1:d=MGB();DY(c,$rt_s(96));break $ba;default:d=YHB();DY(c,$rt_s(97));break $ba;}d=HGB();DY(c,$rt_s(98));}e=Fv(d);f=0;while(f<12){g=V.iF.data[f%V.iF.data.length];Fo(e,EMB(V.tM.data[f],V.iD.data[f],g,g));DY(DY(c,$rt_s(99)),V.tM.data[f]);DY(Cq(DY(c,$rt_s(91)),V.iD.data[f]),$rt_s(100));DY(PY(c,g),$rt_s(88));DY(PY(c,g),$rt_s(101));f=f+1|0;}To(d,DMB(d));Og(d,$rt_s(93));DY(c,$rt_s(94));if(V.fG!==null){Da(V.fG);}V.fG
=d;Il(a,Tj(c));return;};
N9=function(){var a;a=V.IK;V.IK=a+1|0;return a%V.iF.data.length;};
Hv=function(a){var b;if(Vk(a)==0){b=1;}else{b=10;}if(Xs(a)==0){a=b;}else{a= -b|0;}return a;};
Ox=function(){var a,b;a=GJB(OI,9);b=a.data;b[0]=ZHB($rt_s(102));b[1]=ZHB($rt_s(103));b[2]=ZHB($rt_s(104));b[3]=ZHB($rt_s(105));b[4]=ZHB($rt_s(106));b[5]=ZHB($rt_s(107));b[6]=ZHB($rt_s(108));b[7]=ZHB($rt_s(109));b[8]=ZHB($rt_s(110));V.iF=a;V.iD=$rt_createDoubleArray(12);a=GJB(UC,12);b=a.data;b[0]=$rt_s(111);b[1]=$rt_s(112);b[2]=$rt_s(113);b[3]=$rt_s(114);b[4]=$rt_s(115);b[5]=$rt_s(116);b[6]=$rt_s(117);b[7]=$rt_s(118);b[8]=$rt_s(119);b[9]=$rt_s(120);b[10]=$rt_s(121);b[11]=$rt_s(122);V.tM=a;return;};
VX=function(){var a,b;a=ZYB();b=0;while(b<V.iD.data.length){V.iD.data[b]=Wv(a)*100.0|0;b=b+1|0;}V.HB=AMB();Vz(V.HB);Yr(V.HB,0);return;};
Pp=function(a){F3(a,1);return;};
RP=function($t){Wu($t);return;};
Ox();}
function AZB(){var $r=new V();RP($r);return $r;}
function RRB(){var $r=new SR();M3($r);return $r;}
function Rd($t){return GJB(Z,0);}
function M3($t){Wu($t);return;}
function QC_$clinit(){QC_$clinit=function(){};
B7=function(a,b){var c,d,e,f,$je;c=QC.zI;ZGB(c);$ba:{try{C9(a);d=Ol(QC.zI);while(Z9(d)!=0){e=Hg(d);Ql(T5(a,1),e,SNB(e,b));}QIB(c);}catch($e){$je=$e.$javaException;if($je){f=$je;break $ba;}else {throw $e;}}return;}QIB(c);CJB(f);};
RW=function(a,b){var c,d,e,f,g,h,i,$je;c=IYB();d=QC.zI;ZGB(d);$ba:{$bb:{$bc:{try{e=T5(a,0);if(e!==null){break $bc;}QIB(d);}catch($e){$je=$e.$javaException;if($je){f=$je;break $bb;}else {throw $e;}}return;}try{g=Jv(e.EG);while(Ia(g)!=0){h=H0(g);if(Ou(h)===null){U3(g);continue;}if(J3(VHB(h),b)!=0){e=UDB(h);if(e!==null){Cp(c,e);}}}QIB(d);break $ba;}catch($e){$je=$e.$javaException;if($je){f=$je;}else {throw $e;}}}QIB(d);CJB(f);}a=Ol(c);while(Z9(a)!=0){i=Hg(a);i.ED.gQ(i.XI);}return;};
Dz=function(a,b){return Dw(a,b);};
C9=function(a){var b,c,d,$je;b=QC.zI;ZGB(b);$ba:{try{c=Ol(QC.zI);$bb:{try{while(Z9(c)!=0){if(Hg(c).ED===a){break $bb;}}QIB(b);}catch($e){$je=$e.$javaException;if($je){d=$je;break $ba;}else {throw $e;}}return;}}catch($e){$je=$e.$javaException;if($je){d=$je;break $ba;}else {throw $e;}}try{CJB(OJB(Tj(PY(DY(QJB(),$rt_s(123)),a))));}catch($e){$je=$e.$javaException;if($je){d=$je;}else {throw $e;}}}QIB(b);CJB(d);};
G7=function(){var a;if(P8(FJB(QC))!=0){a=0;}else{a=1;}QC.DG=a;QC.zI=IYB();return;};
HS=function($t){Wu($t);$t.lK=VMB();$t.EG=VMB();if(QC.DG==0&&Jy(QC.zI)==0){CJB(TJB());}return;};
G7();}
function UKB(){var $r=new QC();HS($r);return $r;}
function Ql($t,a,b){var c,d;Jy(QC.zI);if(a===null){return;}c=Jv($t.EG);while(true){if(Ia(c)==0){Cp($t.EG,b);return;}d=H0(c);if(b===d){return;}d=Ou(d);if(d===null){U3(c);continue;}if(d===a&&J3(VHB(b),VHB(b))!=0){break;}}return;}
function Dw($t,a){var b,c;if(a===null){return null;}b=Jv($t.lK);while(Ia(b)!=0){c=H0(b);if(a.y(c.XI)!=0){return c;}}return null;}
function ARB(){var $r=new KF();Qe($r);return $r;}
function I7($t){return GJB(Z,0);}
function Qe($t){Wu($t);return;}
function IPB(){var $r=new LL();Lz($r);return $r;}
function E6($t){return GJB(Z,0);}
function Lz($t){Wu($t);return;}
function YOB(){var $r=new KG();No($r);return $r;}
function Qs($t){var a,b,c,d,e,f;a=GJB(Z,2);b=a.data;c=GJB(R,1);d=c.data;R_$clinit();e=R.NI;d[0]=e;e=GXB(c);b[0]=e;WB_$clinit();e=WB.MC;f=HXB(e);b[1]=f;return a;}
function No($t){Wu($t);return;}
function VOB(){var $r=new RN();Gb($r);return $r;}
function ZY($t){return GJB(Z,0);}
function Gb($t){Wu($t);return;}
function BZB(){var $r=new OR();Ep($r);return $r;}
function VGB(){var result = (function(){if (window['WebSocket']) return true; else return false;}).call(null);return OHB(result,$rt_booleancls());}
function Ep($t){Wu($t);return;}
function FRB(){var $r=new HF();Dl($r);return $r;}
function ICB($t){return GJB(Z,0);}
function Dl($t){Wu($t);return;}
function CZB(a){var $r=new UP();Ln($r,a);return $r;}
function DZB(){var $r=new UP();IZ($r);return $r;}
function Ln($t,a){G1($t,a);return;}
function IZ($t){DCB($t);return;}
function EZB(){var $r=new WJ();De($r);return $r;}
function De($t){Kl($t);return;}
function BVB(){var $r=new WO();RAB($r);return $r;}
function Gy($t){return GJB(Z,0);}
function RAB($t){Wu($t);return;}
function KSB(){var $r=new KT();Ae($r);return $r;}
function M8($t){return GJB(Z,0);}
function Ae($t){Wu($t);return;}
function MUB(){var $r=new SF();Xz($r);return $r;}
function Sb($t){return GJB(Z,0);}
function Xz($t){Wu($t);return;}
function UTB(){var $r=new AK();Sy($r);return $r;}
function TAB($t){return GJB(Z,0);}
function Sy($t){Wu($t);return;}
function TMB(a){var $r=new AI();Ri($r,a);return $r;}
function Ia($t){var a;if($t.EJ>=$t.ZJ){a=0;}else{a=1;}return a;}
function H0($t){var a,b;Lo($t);$t.SC=$t.EJ;a=$t.eF;b=$t.EJ;$t.EJ=b+1|0;return a.m(b);}
function Lo($t){if($t.MJ>=$t.eF.xH){return;}CJB(SXB());}
function Ri($t,a){$t.eF=a;Wu($t);$t.MJ=$t.eF.xH;$t.ZJ=$t.eF.f();$t.SC= -1;return;}
function U3($t){if($t.SC<0){CJB(VNB());}Lo($t);$t.eF.o($t.SC);$t.MJ=$t.eF.xH;if($t.SC<$t.EJ){$t.EJ=$t.EJ-1|0;}$t.ZJ=$t.ZJ-1|0;$t.SC= -1;return;}
function LRB(){var $r=new OJ();P1($r);return $r;}
function W7($t){return GJB(Z,0);}
function P1($t){Wu($t);return;}
function SRB(){var $r=new DG();Yy($r);return $r;}
function NY($t){return GJB(Z,0);}
function Yy($t){Wu($t);return;}
function ITB(){var $r=new VF();T6($r);return $r;}
function L5($t){return GJB(Z,0);}
function T6($t){Wu($t);return;}
function FVB(){var $r=new BP();Co($r);return $r;}
function Ry($t){return GJB(Z,0);}
function Co($t){Wu($t);return;}
function ETB(){var $r=new VN();Ei($r);return $r;}
function Az($t){return GJB(Z,0);}
function Ei($t){Wu($t);return;}
function NQB(){var $r=new HO();E3($r);return $r;}
function Kg($t){return GJB(Z,0);}
function E3($t){Wu($t);return;}
function FZB(a){var $r=new SN();Ch($r,a);return $r;}
function Z6($t){var a;if($t.EM>=VIB($t.wL).data.length){a=0;}else{a=1;}return a;}
function Rf($t){var a,b;if($t.EM==VIB($t.wL).data.length){CJB(BWB());}a=VIB($t.wL).data;b=$t.EM;$t.EM=b+1|0;return a[b];}
function Ch($t,a){$t.wL=a;Wu($t);return;}
function GPB(){var $r=new WG();Vw($r);return $r;}
function Eh($t){return GJB(Z,0);}
function Vw($t){Wu($t);return;}
function ZYB(){var $r=new VG();BX($r);return $r;}
function BX($t){Wu($t);return;}
function Wv($t){return Math.random();}
function EUB(){var $r=new GJ();Z5($r);return $r;}
function Mv($t){return GJB(Z,0);}
function Z5($t){Wu($t);return;}
function DVB(){var $r=new KP();Go($r);return $r;}
function Br($t){return GJB(Z,0);}
function Go($t){Wu($t);return;}
function GZB(){var $r=new RM();KX($r);return $r;}
function KX($t){Wu($t);return;}
function CVB(){var $r=new LO();NZ($r);return $r;}
function It($t){return GJB(Z,0);}
function NZ($t){Wu($t);return;}
function XE_$clinit(){XE_$clinit=function(){};
IK=function($t,a){F6($t);$t.LL=a;return;};
Ij=function(){XE.VD=JHB();return;};
CX=function(a){return HZB(a);};
He=function(a){return Tj(Qa(QJB(),a));};
KBB=function(a,b){return a-b|0;};
Ij();}
function HZB(a){var $r=new XE();IK($r,a);return $r;}
function Mo($t){return $t.LL;}
function IAB($t){return Long_fromInt($t.LL);}
function Cv($t,a){return Ic($t,a);}
function O0($t){return $t.LL;}
function Hx($t){return $t.LL;}
function Ic($t,a){return KBB($t.LL,a.LL);}
function Cr($t){return $t.LL;}
function In($t){return He($t.LL);}
function IWB(){var $r=new FI();LDB($r);return $r;}
function LDB($t){Dy($t);return;}
function XOB(){var $r=new ZR();Ur($r);return $r;}
function D4($t){return GJB(Z,0);}
function Ur($t){Wu($t);return;}
function OC_$clinit(){OC_$clinit=function(){};
Pw=function(){var a;if(P8(FJB(OC))!=0){a=0;}else{a=1;}OC.vL=a;OC.pD=GY(MBB(FJB(OC)));return;};
GT=function($t,a){Wu($t);$t.uL=a;return;};
Y8=function(a,b){return B5(I3(a));};
B5=function(a){return IZB(a);};
Pw();}
function IZB(a){var $r=new OC();GT($r,a);return $r;}
function Yh($t,a,b,c,d,e){return Hi(d,$t,a,b,c,e);}
function Rq($t,a,b,c){var d,e,f;if(OC.vL==0&&$t.ND!==null){CJB(TJB());}if(HJB($t.uL,UE)!=0){$t.ND=D5($t.uL,a,b,c);}else{d=b.data;$t.ND=$t.uL.eB(a);b=d.length;e=0;while(e<b){$t.uL.iB(d[e],a,$t.ND);e=e+1|0;}b=c.data;f=b.length;e=0;while(e<f){$t.uL.aB(b[e],a,$t.ND);e=e+1|0;}}return;}
function GW($t,a,b,c){if(HJB($t.uL,ZD)==0){$t.uL.I($t.ND,a);}else{Bx($t.uL,$t.ND,a,YW(b,$t),YW(c,$t));}return;}
function Ux($t,a){return $t.uL.D(a);}
function Wi($t){return $t.ND;}
function Ge($t,a){var b,c,d,e,f;if(HJB($t.uL,QE)!=0){M9($t.uL,a,$t.ND);return;}if(a!==null){b=OC.pD;S_$clinit();c=S.qL;d=$rt_s(124);e=GJB(E,2);f=e.data;f[0]=$t.uL;f[1]=a;U5(b,c,d,e);}$t.uL.hB($t.ND);return;}
function FC_$clinit(){FC_$clinit=function(){};
Qh=function(){return FC.sD;};
DV=function(){NV(FJB(FC));return;};
PG=function($t){Wu($t);if(FC.sD===null){FC.sD=$t;return;}CJB(VNB());};
DV();}
function JZB(){var $r=new FC();PG($r);return $r;}
function YRB(){var $r=new JN();Sr($r);return $r;}
function Bs($t){return GJB(Z,0);}
function Sr($t){Wu($t);return;}
function KZB(){var $r=new OT();S6($r);return $r;}
function Cc($t,a){$t.aK=a;return;}
function R5($t){if($t.cK==0){$t.aK=T1($t);$t.cK=1;}return $t.aK;}
function T1($t){return null;}
function S6($t){Wu($t);return;}
function SUB(){var $r=new LP();Fs($r);return $r;}
function LU($t){return GJB(Z,0);}
function Fs($t){Wu($t);return;}
function KNB(a){var $r=new TG();G9($r,a);return $r;}
function G9($t,a){Wu($t);$t.LH=a;return;}
function Pv($t){return FJB(YD);}
function FV($t){return $t.LH.oM();}
function LZB(a){var $r=new OK();Qz($r,a);return $r;}
function XHB(a,b){return QFB(a);}
function LFB(a){if (!OK.$$services$$) {OK.$$services$$ = true;AE.$$serviceList$$ = [[ZE, AN]];}var cls = a;if (!cls.$$serviceList$$) {return $rt_createArray($rt_objcls(), 0);}var result = $rt_createArray($rt_objcls(), cls.$$serviceList$$.length);for (var i = 0; i < result.data.length; ++i) {var serviceDesc = cls.$$serviceList$$[i];result.data[i] = new serviceDesc[0]();serviceDesc[1](result.data[i]);}return result;}
function Qz($t,a){Wu($t);$t.gL=a;return;}
function Xi($t){return FZB($t);}
function QFB(a){return LZB(LFB(Bh(a)));}
function VIB(a){return a.gL;}
function ZE_$clinit(){ZE_$clinit=function(){};
Ta=function(){ZE.hK=GY(MBB(FJB(OR)));return;};
ZK=function($t,a){Wu($t);return;};
AN=function($t){ZK($t,null);return;};
Ta();}
function MZB(a){var $r=new ZE();ZK($r,a);return $r;}
function NZB(){var $r=new ZE();AN($r);return $r;}
function Zi($t,a,b){Es(a,FJB(QB),BAB($t),100);Es(a,FJB(BD),Xq($t),100);Es(a,FJB(FD),N7($t),100);return;}
function Xq($t){if($t.EE===null){$t.EE=XYB();}return $t.EE;}
function N7($t){if(VGB()==0){return null;}if($t.gI===null){$t.gI=BZB();}return $t.gI;}
function BAB($t){if($t.XB===null){$t.XB=HOB();}return $t.XB;}
function LPB(){var $r=new NI();V5($r);return $r;}
function HZ($t){return GJB(Z,0);}
function V5($t){Wu($t);return;}
function EMB(a,b,c,d){var $r=new RJ();Uv($r,a,b,c,d);return $r;}
function Uv($t,a,b,c,d){Wu($t);$t.NF=a;$t.zK=b;$t.IF=c;$t.LC=d;return;}
function Mp($t){return $t.NF;}
function OZB(a,b){var $r=new LD();UCB($r,a,b);return $r;}
function Bq($t){return Tj(PY(DY(PY(QJB(),$t.FG),$rt_s(125)),$t.JI));}
function UCB($t,a,b){Wu($t);$t.FG=a;$t.JI=b;return;}
function PZB(a,b){var $r=new IG();Ck($r,a,b);return $r;}
function Ck($t,a,b){UCB($t,a,null);$t.gD=b;return;}
function KQB(){var $r=new GH();Ed($r);return $r;}
function Tv($t){return GJB(Z,0);}
function Ed($t){Wu($t);return;}
function QOB(){var $r=new JJ();XX($r);return $r;}
function Sj($t){return GJB(Z,0);}
function XX($t){Wu($t);return;}
function LUB(){var $r=new NM();Db($r);return $r;}
function PZ($t){return GJB(Z,0);}
function Db($t){Wu($t);return;}
function QZB(a,b,c,d,e){var $r=new TC();Wd($r,a,b,c,d,e);return $r;}
function JIB(a,b,c){return RZB(0,a.data.length,a,b,b+c|0,0,0);}
function FHB(a){return JIB(a,0,a.data.length);}
function Uy($t,a){return G3($t,a,0,a.data.length);}
function Jx($t,a){return Dt($t,a);}
function G3($t,a,b,c){var d,e,f,g,h,i;if(c==0){return $t;}if(Z1($t)!=0){CJB(CMB());}if(Zy($t)<c){CJB(AYB());}if(b>=0){d=a.data;e=d.length;if(b<e){a=b+c|0;if(a>e){CJB(ZKB(Tj(Qa(DY(DY(Qa(DY(QJB(),$rt_s(126)),a),$rt_s(42)),$rt_s(43)),e))));}if(c<0){CJB(ZKB(Tj(DY(Qa(DY(QJB(),$rt_s(44)),c),$rt_s(45)))));}f=$t.cE+$t.ZK|0;g=0;while(g<c){a=$t.GE.data;h=f+1|0;i=b+1|0;a[f]=d[b];g=g+1|0;f=h;b=i;}$t.cE=$t.cE+c|0;return $t;}}CJB(ZKB(Tj(DY(Qa(DY(Qa(DY(QJB(),$rt_s(46)),b),$rt_s(13)),a.data.length),$rt_s(47)))));}
function VW($t){var a,b;a=DY(Qa(DY(Qa(DY(Qa(DY(QJB(),$rt_s(127)),$t.cE),$rt_s(128)),$t.bD),$rt_s(129)),$t.BK),$rt_s(130));if($t.TD<0){b=$rt_s(131);}else{b=Tj(Qa(DY(QJB(),$rt_s(132)),$t.TD));}return Tj(DY(DY(a,b),$rt_s(14)));}
function Dt($t,a){var b,c,d,e,f,g,h,i,j;if($t===a){return 0;}b=UFB(Zy($t),Zy(a));c=$t.cE+$t.ZK|0;d=a.cE+a.ZK|0;e=0;while(true){if(e>=b){return Nz(Zy($t),Zy(a));}f=$t.GE.data;g=c+1|0;h=f[c];i=a.GE.data;j=d+1|0;i=Ad(h,i[d]);if(i!=0){break;}e=e+1|0;c=g;d=j;}return i;}
function Wd($t,a,b,c,d,e){Ew($t,b);ID_$clinit();$t.LM=ID.xJ;$t.ZK=a;$t.GE=c;$t.cE=d;$t.bD=e;return;}
function RZB(a,b,c,d,e,f,g){var $r=new PQ();UZ($r,a,b,c,d,e,f,g);return $r;}
function Z1($t){return $t.hD;}
function UZ($t,a,b,c,d,e,f,g){Wd($t,a,b,c,d,e);$t.UB=f;$t.hD=g;return;}
function SZB(a){var $r=new WF();Qt($r,a);return $r;}
function Qt($t,a){HV($t,a);return;}
function Kn($t){Pj($t);return $t.uK.FG;}
function AVB(){var $r=new PI();YAB($r);return $r;}
function Nf($t){return GJB(Z,0);}
function YAB($t){Wu($t);return;}
function ZOB(){var $r=new XM();Im($r);return $r;}
function Aj($t){return GJB(Z,0);}
function Im($t){Wu($t);return;}
function OPB(){var $r=new OM();Pr($r);return $r;}
function VY($t){return GJB(Z,0);}
function Pr($t){Wu($t);return;}
function ZTB(){var $r=new QM();IEB($r);return $r;}
function VBB($t){return GJB(Z,0);}
function IEB($t){Wu($t);return;}
function S_$clinit(){S_$clinit=function(){};
Mu=function(){S.CB=TZB($rt_s(133),2147483647);S.oI=TZB($rt_s(134),1000);S.qL=TZB($rt_s(135),900);S.fH=TZB($rt_s(136),800);S.lD=TZB($rt_s(137),700);S.xG=TZB($rt_s(138),500);S.tI=TZB($rt_s(139),400);S.UH=TZB($rt_s(140),300);S.FE=TZB($rt_s(141), -2147483648);return;};
DS=function($t,a,b){Wu($t);$t.BJ=a;$t.cL=b;return;};
Mu();}
function TZB(a,b){var $r=new S();DS($r,a,b);return $r;}
function Jl($t){return $t.BJ;}
function PCB($t){return $t.cL;}
function USB(){var $r=new WP();J9($r);return $r;}
function Os($t){return GJB(Z,0);}
function J9($t){Wu($t);return;}
function UZB(a){var $r=new FO();Y0($r,a);return $r;}
function EXB(){var $r=new FO();Ey($r);return $r;}
function Y0($t,a){Jm($t);$t.qI=a;return;}
function TBB($t){return NU(Bp($t.qI));}
function I9($t,a){if(Ma($t.qI,a,$t)!==null){a=0;}else{a=1;}return a;}
function Ir($t){return Yn($t.qI);}
function Ey($t){Y0($t,KOB());return;}
function WSB(){var $r=new ML();TCB($r);return $r;}
function Li($t){return GJB(Z,0);}
function TCB($t){Wu($t);return;}
function MPB(){var $r=new EH();Bi($r);return $r;}
function Lc($t){return GJB(Z,0);}
function Bi($t){Wu($t);return;}
function OTB(){var $r=new BT();TW($r);return $r;}
function E2($t){return GJB(Z,0);}
function TW($t){Wu($t);return;}
function GQB(){var $r=new FT();Lb($r);return $r;}
function Ud($t){return GJB(Z,0);}
function Lb($t){Wu($t);return;}
function IYB(){var $r=new UK();CFB($r);return $r;}
function TGB(a,b){Gh(a,b);return;}
function Zq($t,a){Mm($t,a);return;}
function Gh($t,a){if(a.OG===null){$t.eK=a.gF;}else{a.OG.gF=a.gF;}if(a.gF===null){$t.GB=a.OG;}else{a.gF.OG=a.OG;}$t.AD=$t.AD-1|0;$t.xH=$t.xH+1|0;return;}
function An($t,a){var b,c,d,e;if(a<0){CJB(ALB());}if(a<=($t.AD/2|0)){b=$t.eK;c=0;while(c<a){b=b.gF;c=c+1|0;}d=new JF;if(b===null){c=null;}else{c=b.OG;}Wk(d,$t,b,c,a);return d;}if(a>$t.AD){CJB(ALB());}e=$t.GB;c=a;while(c<$t.AD){e=e.OG;c=c+1|0;}c=new JF;if(e===null){b=null;}else{b=e.gF;}Wk(c,$t,b,e,a);return c;}
function Mm($t,a){var b;if(a===null){CJB(TLB($rt_s(142)));}b=VZB();b.DF=a;b.gF=$t.eK;if($t.eK===null){$t.GB=b;}else{$t.eK.OG=b;}$t.eK=b;$t.xH=$t.xH+1|0;$t.AD=$t.AD+1|0;return 1;}
function Jh($t){return WZB($t,$t.eK,null,0);}
function MHB(a){var b;b=a.AD+1|0;a.AD=b;return b;}
function Ho($t){return $t.AD;}
function BJB(a){var b;b=a.AD-1|0;a.AD=b;return b;}
function EHB(a,b){a.eK=b;return b;}
function CFB($t){Xu($t);return;}
function LIB(a,b){a.GB=b;return b;}
function XZB(a,b){var $r=new BI();Er($r,a,b);return $r;}
function Er($t,a,b){Wu($t);$t.XH=a;$t.hM=b;return;}
function LX($t){return $t.XH;}
function QSB(){var $r=new IT();J0($r);return $r;}
function Qu($t){return GJB(Z,0);}
function J0($t){Wu($t);return;}
function ZPB(){var $r=new MG();CCB($r);return $r;}
function Ow($t){return GJB(Z,0);}
function CCB($t){Wu($t);return;}
function YZB(){var $r=new AJ();Cu($r);return $r;}
function Eq($t,a){return V6(a);}
function Ug($t,a){return ZZB(a,null);}
function Cu($t){PG($t);return;}
function WOB(){var $r=new HH();Sk($r);return $r;}
function Do($t){return GJB(Z,0);}
function Sk($t){Wu($t);return;}
function CTB(){var $r=new CT();Ss($r);return $r;}
function Si($t){return GJB(Z,0);}
function Ss($t){Wu($t);return;}
function ORB(){var $r=new RI();Z2($r);return $r;}
function Wz($t){return GJB(Z,0);}
function Z2($t){Wu($t);return;}
function QVB(){var $r=new RT();Kj($r);return $r;}
function JAB($t){return GJB(Z,0);}
function Kj($t){Wu($t);return;}
function ESB(){var $r=new MH();Gj($r);return $r;}
function Vv($t){return GJB(Z,0);}
function Gj($t){Wu($t);return;}
function XSB(){var $r=new OS();Gg($r);return $r;}
function Mj($t){return GJB(Z,0);}
function Gg($t){Wu($t);return;}
function HSB(){var $r=new DH();S3($r);return $r;}
function Tp($t){return GJB(Z,0);}
function S3($t){Wu($t);return;}
function QUB(){var $r=new ZF();W6($r);return $r;}
function D8($t){return GJB(Z,0);}
function W6($t){Wu($t);return;}
function NSB(){var $r=new LF();Te($r);return $r;}
function Ua($t){return GJB(Z,0);}
function Te($t){Wu($t);return;}
function WB_$clinit(){WB_$clinit=function(){};
I1=function(){var a,b;WB.CD=AaB($rt_s(143),0);WB.MC=AaB($rt_s(144),1);WB.WD=AaB($rt_s(145),2);a=GJB(WB,3);b=a.data;b[0]=WB.CD;b[1]=WB.MC;b[2]=WB.WD;WB.FL=a;return;};
Hm=function(){return WB.FL.oM();};
OO=function($t,a,b){D3($t,a,b);return;};
I1();}
function AaB(a,b){var $r=new WB();OO($r,a,b);return $r;}
function YUB(){var $r=new KH();NDB($r);return $r;}
function Va($t){return GJB(Z,0);}
function NDB($t){Wu($t);return;}
function HTB(){var $r=new XK();Ct($r);return $r;}
function Y7($t){return GJB(Z,0);}
function Ct($t){Wu($t);return;}
function ZB_$clinit(){ZB_$clinit=function(){};
Vs=function(){return Long_fromNumber(new Date().getTime());};
KAB=function(){ZB.mM=EWB(LWB(),0);ZB.vD=EWB(BaB(),0);ZB.zM=XXB();return;};
YJ=function($t){Wu($t);return;};
KAB();}
function CaB(){var $r=new ZB();YJ($r);return $r;}
function TUB(){var $r=new QK();Nn($r);return $r;}
function Tn($t){return GJB(Z,0);}
function Nn($t){Wu($t);return;}
function FPB(){var $r=new JG();A5($r);return $r;}
function PX($t){return GJB(Z,0);}
function A5($t){Wu($t);return;}
function TRB(){var $r=new BG();JEB($r);return $r;}
function BEB($t){return GJB(Z,0);}
function JEB($t){Wu($t);return;}
function NPB(){var $r=new KO();Mx($r);return $r;}
function Xp($t){return GJB(Z,0);}
function Mx($t){Wu($t);return;}
function VZB(){var $r=new SJ();Lw($r);return $r;}
function Lw($t){Wu($t);return;}
function ZQB(){var $r=new VT();Em($r);return $r;}
function Iw($t){return GJB(Z,0);}
function Em($t){Wu($t);return;}
function APB(){var $r=new VO();Of($r);return $r;}
function FEB($t){return GJB(Z,0);}
function Of($t){Wu($t);return;}
function RVB(){var $r=new ZJ();Ny($r);return $r;}
function Tx($t){return GJB(Z,0);}
function Ny($t){Wu($t);return;}
function TD_$clinit(){TD_$clinit=function(){};
U6=function(){TD.aJ=LGB();return;};
KQ=function($t){Wu($t);return;};
U6();}
function DaB(){var $r=new TD();KQ($r);return $r;}
function YQB(){var $r=new CP();H8($r);return $r;}
function Po($t){return GJB(Z,0);}
function H8($t){Wu($t);return;}
function VSB(){var $r=new WK();B0($r);return $r;}
function Tt($t){return GJB(Z,0);}
function B0($t){Wu($t);return;}
function TSB(){var $r=new KS();W0($r);return $r;}
function Sd($t){var a,b,c,d,e,f;a=GJB(Z,2);b=a.data;c=GJB(R,1);d=c.data;R_$clinit();e=R.cG;d[0]=e;e=GXB(c);b[0]=e;WB_$clinit();e=WB.MC;f=HXB(e);b[1]=f;return a;}
function W0($t){Wu($t);return;}
function MSB(){var $r=new DR();X1($r);return $r;}
function Gt($t){return GJB(Z,0);}
function X1($t){Wu($t);return;}
function PUB(){var $r=new BQ();Dr($r);return $r;}
function Ha($t){return GJB(Z,0);}
function Dr($t){Wu($t);return;}
function UYB(){var $r=new RO();Xa($r);return $r;}
function Xa($t){SK($t);return;}
function EaB(a){var $r=new XP();Ai($r,a);return $r;}
function BXB(a,b){var $r=new XP();C4($r,a,b);return $r;}
function Wr($t,a,b){return Eo($t,a,b);}
function Ai($t,a){$t.ID=a;Wu($t);return;}
function C4($t,a,b){Ai($t,a);return;}
function Eo($t,a,b){var c;c=Wx($t,a);if(c!=Wx($t,b)){if(c==0){b=1;}else{b= -1;}return b;}if(SFB(a)!=SFB(b)){return SFB(a)-SFB(b)|0;}return K3(MBB(IGB(a)),MBB(IGB(b)));}
function Wx($t,a){var b,c,d,e,f,g;b=Xe(Hh(FGB(a)),FJB(YD));if(b===null){return 0;}c=FV(b).data;d=c.length;a=0;$ba:while(true){if(a>=d){return 0;}b=c[a];e=UIB($t.ID).data;f=e.length;g=0;while(g<f){if(J3(b,e[g])!=0){break $ba;}g=g+1|0;}a=a+1|0;}return 1;}
function TTB(){var $r=new ZI();Ji($r);return $r;}
function T7($t){return GJB(Z,0);}
function Ji($t){Wu($t);return;}
function FaB(a){var $r=new VL();OEB($r,a);return $r;}
function OEB($t,a){$t.jF=a;Jm($t);return;}
function XZ($t){return Yn($t.jF);}
function NU($t){return SZB($t.jF);}
function RTB(){var $r=new EJ();Cj($r);return $r;}
function Hj($t){return GJB(Z,0);}
function Cj($t){Wu($t);return;}
function XC_$clinit(){XC_$clinit=function(){};
UX=function(a){return Xw(Ll(a));};
Ll=function(a){var b,c,d,e,f,g,h,i,j,k,m;b=DBB(a);c=0;d=0;if(Hf(b,d)==45){d=d+1|0;c=1;}else if(Hf(b,d)==43){d=d+1|0;}e=Hf(b,d);if(e>=48&&e<=57){f=Long_ZERO;g=0;while(true){if(Hf(b,d)!=48){$ba:{while(true){if(d>=C(b)){break $ba;}h=Hf(b,d);if(h<48){break $ba;}if(h>57){break;}if(Long_toNumber(f)>=1.0E17){g=g+1|0;}else{f=Long_add(Long_mul(f,Long_fromInt(10)),Long_fromInt(h-48|0));}d=d+1|0;}}if(d<C(b)&&Hf(b,d)==46){d=d+1|0;i=0;$bb:{while(true){if(d>=C(b)){break $bb;}j=Hf(b,d);if(j<48){break $bb;}if(j>57){break;}if
(Long_toNumber(f)<1.0E17){f=Long_add(Long_mul(f,Long_fromInt(10)),Long_fromInt(j-48|0));g=g+ -1|0;}d=d+1|0;i=1;}}if(i==0){CJB(ZJB());}}if(d<C(b)){e=Hf(b,d);if(e!=101&&e!=69){CJB(ZJB());}i=d+1|0;k=0;if(Hf(b,i)==45){i=i+1|0;k=1;}else if(Hf(b,i)==43){i=i+1|0;}m=0;d=0;$bc:{while(true){if(i>=C(b)){break $bc;}j=Hf(b,i);if(j<48){break $bc;}if(j>57){break;}m=(10*m|0)+(j-48|0)|0;d=1;i=i+1|0;}}if(d==0){CJB(ZJB());}if(k!=0){m= -m|0;}g=g+m|0;}$bd:{if(g<=308){if(g!=308){break $bd;}if(Long_compare(f,new Long(2133831477, 4185580))
<=0){break $bd;}}if(c!=0){a= -Infinity;}else{a=Infinity;}return a;}if(c!=0){f=Long_neg(f);}return Long_toNumber(f)*Sz(g);}d=d+1|0;if(d==C(b)){break;}}return 0.0;}CJB(ZJB());};
JY=function(a){return Tj(Cq(QJB(),a));};
VCB=function(a,b){b=DJB(a,b);if(b>0){a=1;}else if(b>=0){a=0;}else{a= -1;}return a;};
Un=function(){XC.UI=NaN;XC.oD=HIB();return;};
AQ=function($t,a){F6($t);$t.SD=a;return;};
Xw=function(a){return GaB(a);};
Sz=function(a){var b,c;if(a>=0){b=10.0;}else{b=0.1;a= -a|0;}c=1.0;while(a!=0){if(a%2!=0){c=c*b;}b=b*b;a=a/2|0;}return c;};
Un();}
function GaB(a){var $r=new XC();AQ($r,a);return $r;}
function Ez($t){return Long_fromNumber($t.SD);}
function Xn($t){return $t.SD|0;}
function CDB($t,a){return VCB($t.SD,a.SD);}
function BFB($t){return $t.SD;}
function FAB($t,a){return CDB($t,a);}
function ADB($t){return $t.SD;}
function Cd($t){return JY($t.SD);}
function QYB(a,b,c,d){var $r=new NG();M4($r,a,b,c,d);return $r;}
function Vi($t){return Ou($t.aE);}
function M4($t,a,b,c,d){Na($t,b,c,d);$t.aE=IMB(a);return;}
function MQB(){var $r=new OL();Fh($r);return $r;}
function G8($t){return GJB(Z,0);}
function Fh($t){Wu($t);return;}
function HEB($t){return Tj(DY(DY(PY(DY(QJB(),$rt_s(146)),$t.ED),$rt_s(19)),$t.XI));}
function JMB(){var $r=new TR();LEB($r);return $r;}
function L0($t){return null;}
function LEB($t){Wu($t);return;}
function KVB(){var $r=new ZN();O7($r);return $r;}
function B1($t){return GJB(Z,0);}
function O7($t){Wu($t);return;}
function WZB(a,b,c,d){var $r=new JF();Wk($r,a,b,c,d);return $r;}
function Wk($t,a,b,c,d){$t.dG=a;Wu($t);$t.lC=$t.dG.xH;$t.PI=b;$t.AI=c;$t.MG=d;return;}
function Q3($t,a){var b;Ve($t);b=VZB();b.DF=a;b.OG=$t.AI;b.gF=$t.PI;if($t.AI===null){EHB($t.dG,b);}else{$t.AI.gF=b;}if($t.PI===null){LIB($t.dG,b);}else{$t.PI.OG=b;}$t.AI=b;MHB($t.dG);a=$t.dG;a.xH=a.xH+1|0;$t.lC=$t.dG.xH;$t.AF=null;return;}
function Z9($t){var a;if($t.PI===null){a=0;}else{a=1;}return a;}
function Hg($t){var a;Ve($t);if($t.PI===null){CJB(BWB());}a=$t.PI.DF;$t.AF=$t.PI;$t.AI=$t.PI;$t.PI=$t.PI.gF;$t.MG=$t.MG+1|0;return a;}
function Ve($t){if($t.lC>=$t.dG.xH){return;}CJB(SXB());}
function V8($t){if($t.AF===null){CJB(VNB());}TGB($t.dG,$t.AF);if($t.AF===$t.AI){$t.AI=$t.PI.OG;$t.MG=$t.MG-1|0;}else if($t.AF===$t.PI){$t.PI=$t.AI.gF;}BJB($t.dG);$t.lC=$t.dG.xH;$t.AF=null;return;}
function IVB(){var $r=new VH();Tz($r);return $r;}
function Mc($t){return GJB(Z,0);}
function Tz($t){Wu($t);return;}
function VQB(){var $r=new CG();T0($r);return $r;}
function Jt($t){var a,b,c,d,e,f;a=GJB(Z,2);b=a.data;c=GJB(R,1);d=c.data;R_$clinit();e=R.NI;d[0]=e;e=GXB(c);b[0]=e;WB_$clinit();e=WB.CD;f=HXB(e);b[1]=f;return a;}
function T0($t){Wu($t);return;}
function FSB(){var $r=new MS();Yv($r);return $r;}
function Rk($t){return GJB(Z,0);}
function Yv($t){Wu($t);return;}
function WTB(){var $r=new BM();Dh($r);return $r;}
function Qv($t){return GJB(Z,0);}
function Dh($t){Wu($t);return;}
function PMB(){var $r=new FU();Vh($r);return $r;}
function Vh($t){Ba($t);return;}
function PPB(){var $r=new LT();Mr($r);return $r;}
function LV($t){return GJB(Z,0);}
function Mr($t){Wu($t);return;}
function UUB(){var $r=new NT();ZZ($r);return $r;}
function FDB($t){return GJB(Z,0);}
function ZZ($t){Wu($t);return;}
function FXB(a){var $r=new YS();Kb($r,a);return $r;}
function Kb($t,a){Wu($t);$t.LG=ZWB(a);return;}
function Es($t,a,b,c){if(b===null){return $t;}if(c<=0){CJB(VNB());}Oh($t.LG,a,b,c);return $t;}
function Mk($t){return Zf($t.LG);}
function SSB(){var $r=new FF();Yq($r);return $r;}
function Td($t){return GJB(Z,0);}
function Yq($t){Wu($t);return;}
function BRB(){var $r=new JI();Vc($r);return $r;}
function KY($t){return GJB(Z,0);}
function Vc($t){Wu($t);return;}
function ZUB(){var $r=new QS();Cm($r);return $r;}
function Ek($t){return GJB(Z,0);}
function Cm($t){Wu($t);return;}
function AKB(a){var $r=new IJ();PDB($r,a);return $r;}
function ZJB(){var $r=new IJ();Xd($r);return $r;}
function PDB($t,a){GEB($t,a);return;}
function Xd($t){Qj($t);return;}
function AXB(a,b,c){var $r=new JO();Yc($r,a,b,c);return $r;}
function IGB(a){return a.WB;}
function Ja($t){return Tj(GX(Qa(DY(PY(DY(PY(DY(PY(DY(QJB(),$rt_s(147)),$t.WB),$rt_s(1)),F7($t.WB)),$rt_s(148)),$t.FH),$rt_s(149)),$t.UJ),125));}
function SFB(a){return a.UJ;}
function Yc($t,a,b,c){Wu($t);$t.WB=a;$t.FH=b;$t.UJ=c;return;}
function FGB(a){return a.FH;}
function BOB(a,b,c,d,e,f){var $r=new ZG();P7($r,a,b,c,d,e,f);return $r;}
function Ys($t){return Ou($t.EH);}
function P7($t,a,b,c,d,e,f){Kf($t,b,c,d,e,f);$t.EH=IMB(a);return;}
function WMB(a){var $r=new UR();ZX($r,a);return $r;}
function ZX($t,a){$t.fJ=a;Wu($t);return;}
function BUB(){var $r=new BO();F1($r);return $r;}
function Ib($t){return GJB(Z,0);}
function F1($t){Wu($t);return;}
function WVB(){var $r=new VK();F2($r);return $r;}
function L1($t){return GJB(Z,0);}
function F2($t){Wu($t);return;}
function XPB(){var $r=new PJ();Fy($r);return $r;}
function U8($t){return GJB(Z,0);}
function Fy($t){Wu($t);return;}
function XUB(){var $r=new AF();CY($r);return $r;}
function Qp($t){return GJB(Z,0);}
function CY($t){Wu($t);return;}
function OOB(){var $r=new ON();MDB($r);return $r;}
function Oy($t){return GJB(Z,0);}
function MDB($t){Wu($t);return;}
function OJB(a){var $r=new SG();Zg($r,a);return $r;}
function VNB(){var $r=new SG();Iu($r);return $r;}
function Zg($t,a){AX($t,a);return;}
function Iu($t){Kl($t);return;}
function AQB(){var $r=new QI();Ec($r);return $r;}
function Af($t){return GJB(Z,0);}
function Ec($t){Wu($t);return;}
function QRB(){var $r=new MI();KU($r);return $r;}
function Nb($t){return GJB(Z,0);}
function KU($t){Wu($t);return;}
function ASB(){var $r=new MF();TDB($r);return $r;}
function D6($t){return GJB(Z,0);}
function TDB($t){Wu($t);return;}
function PJB(a){var $r=new YL();Rj($r,a);return $r;}
function R8($t){if(Sq($t.ZI)==0&&$t.ZI.pC.sH===null){if(YGB($t.ZI.pC.mJ)==0){Zt(DGB($t.ZI.pC.mJ));}return;}return;}
function Rj($t,a){$t.ZI=a;Wu($t);return;}
function HaB(a){var $r=new BR();UEB($r,a);return $r;}
function DHB(a){return HaB(a);}
function PAB($t,a){$t.TL.TC(a);return;}
function UEB($t,a){Wu($t);$t.TL=a;return;}
function H9($t,a){$t.TL.HE(a);return;}
function MJB(a,b,c,d){var $r=new XL();Nr($r,a,b,c,d);return $r;}
function Zt($t){var a;I($t.vM);$t.NB.pC.sH=$t.vM;a=$t.NB.pC;a.nG=a.nG+$t.SH|0;PAB($t.MI,null);return;}
function Nr($t,a,b,c,d){$t.vM=a;$t.NB=b;$t.SH=c;$t.MI=d;Wu($t);return;}
function CYB(){var $r=new QO();V2($r);return $r;}
function V2($t){var a,b;Wu($t);a=GJB(E,2);b=a.data;b[0]=$rt_s(150);b[1]=Rm(1);$t.XJ=HFB(a);return;}
function HFB(a){var result = (function(initNameValuePairs){var obj = {};
for (var i = 0; i < initNameValuePairs.length; i += 2) {
  obj[initNameValuePairs[i]] = initNameValuePairs[i + 1];
};
return obj;
}).call(null,YIB(a));return OHB(result,E);}
function LSB(){var $r=new QN();L8($r);return $r;}
function Oq($t){return GJB(Z,0);}
function L8($t){Wu($t);return;}
function ROB(){var $r=new LS();XCB($r);return $r;}
function Lu($t){return GJB(Z,0);}
function XCB($t){Wu($t);return;}
function POB(){var $r=new EG();EY($r);return $r;}
function Ax($t){return GJB(Z,0);}
function EY($t){Wu($t);return;}
function BPB(){var $r=new IF();IBB($r);return $r;}
function XU($t){return GJB(Z,0);}
function IBB($t){Wu($t);return;}
function UD_$clinit(){UD_$clinit=function(){};
ACB=function(a){return Tj(Qa(QJB(),a));};
Ad=function(a,b){return a-b|0;};
D9=function(a){return IaB(a);};
Bb=function(){UD.ZL=XFB();return;};
WN=function($t,a){F6($t);$t.CH=a;return;};
Bb();}
function IaB(a){var $r=new UD();WN($r,a);return $r;}
function Tg($t){return $t.CH;}
function Nq($t){return Long_fromInt($t.CH);}
function RU($t,a){return RBB($t,a);}
function Or($t){return $t.CH;}
function CV($t){return $t.CH;}
function Ca($t){return $t.CH;}
function Ft($t){return ACB($t.CH);}
function RBB($t,a){return Ad($t.CH,a.CH);}
function DRB(){var $r=new FS();N5($r);return $r;}
function Iq($t){return GJB(Z,0);}
function N5($t){Wu($t);return;}
function AUB(){var $r=new JP();FBB($r);return $r;}
function V3($t){var a,b,c;a=GJB(Z,1);b=a.data;c=JLB();b[0]=c;return a;}
function FBB($t){Wu($t);return;}
function HXB(a){var $r=new DJ();EZ($r,a);return $r;}
function Ap($t){return FJB(BE);}
function EZ($t,a){Wu($t);$t.VH=a;return;}
function EQB(){var $r=new MO();H5($r);return $r;}
function Ke($t){return GJB(Z,0);}
function H5($t){Wu($t);return;}
function ED_$clinit(){ED_$clinit=function(){};
Di=function(a,b){var c,d;while(true){if(a>=C(b)){return  -1;}c=a+1|0;d=Hf(b,a);if(d<=48){break;}if(d>=57){break;}a=c;}return c;};
Jz=function(a){{if(console){console.warn(a);}}};
B2=function(a){{if(console){console.info(a);}}};
GY=function(a){var b,c;b=J2(ED.NM,a);if(b===null){b=JaB(a);c=B6(a,46);if(c>=0){b.PM=GY(SY(a,0,c));}else if(K9(a)==0){b.PM=GY(Q9($rt_s(21)));}Ma(ED.NM,a,b);}return b;};
Pq=function(a){{if(console){console.error(a);}}};
BH=function($t,a){Wu($t);$t.qE=a;return;};
Bf=function(){ED.JJ=Q9($rt_s(151));ED.NM=KOB();return;};
Bf();}
function JaB(a){var $r=new ED();BH($r,a);return $r;}
function G6($t,a,b){WZ($t,KaB(a,b));return;}
function U5($t,a,b,c){var d;d=KaB(a,b);Yz(d,c);WZ($t,d);return;}
function Zu($t,a,b){var c,d,e,f,g,h;if(b===null){return a;}c=QJB();d=0;$ba:{while(true){if(d>=C(a)){break $ba;}e=Nd(a,123,d);if(e<0){break;}f=e+1|0;g=Di(f,a);if(g<0){break $ba;}if(Hf(a,g)!=125){DY(c,SY(a,d,g));d=g;continue;}e=b.data;h=Uq(SY(a,f,g));if(h>=e.length){DY(c,SY(a,d,g));d=g;continue;}PY(c,OIB(e[h]));d=g+1|0;}}return Q9(Tj(c));}
function WZ($t,a){var b,c,d;b=Zu($t,Lp(a),Tm(a));c=PCB(Cl(a));S_$clinit();if(c>=PCB(S.oI)){Pq($rt_ustr(b));}else{d=PCB(Cl(a));S_$clinit();if(d<PCB(S.qL)){B2($rt_ustr(b));}else{Jz($rt_ustr(b));}}return;}
function BW($t,a){S_$clinit();G6($t,S.qL,a);return;}
function KaB(a,b){var $r=new PD();T8($r,a,b);return $r;}
function Lp($t){return $t.DH;}
function Tm($t){return $t.pE;}
function Yz($t,a){$t.pE=a;return;}
function Cl($t){return $t.uJ;}
function T8($t,a,b){var c;Wu($t);$t.uJ=a;$t.DH=b;$t.mC=Vs();c=PD.tG;PD.tG=Long_add(c,Long_fromInt(1));$t.KL=c;$t.ZE=MV(H());return;}
function VPB(){var $r=new ZT();Am($r);return $r;}
function H6($t){return GJB(Z,0);}
function Am($t){Wu($t);return;}
function DUB(){var $r=new KL();F4($r);return $r;}
function VDB($t){return GJB(Z,0);}
function F4($t){Wu($t);return;}
function RSB(){var $r=new IL();Zb($r);return $r;}
function U9($t){return GJB(Z,0);}
function Zb($t){Wu($t);return;}
function JQB(){var $r=new ER();T4($r);return $r;}
function HX($t){return GJB(Z,0);}
function T4($t){Wu($t);return;}
function PYB(a,b,c,d){var $r=new NK();GAB($r,a,b,c,d);return $r;}
function GAB($t,a,b,c,d){$t.fL=a;$t.vC=b;$t.YH=c;$t.TJ=d;Wu($t);return;}
function Al($t){var a,$je;$ba:{$bb:{try{Uu($t.fL.lH,$t.vC,$t.fL.iM,$t.YH,$t.TJ);}catch($e){$je=$e.$javaException;if($je&&$je instanceof SB){a=$je;break $bb;}else {throw $e;}}break $ba;}O3(a);}return;}
function HUB(){var $r=new GK();Fr($r);return $r;}
function K8($t){return GJB(Z,0);}
function Fr($t){Wu($t);return;}
function OVB(){var $r=new EQ();S9($r);return $r;}
function Pg($t){return GJB(Z,0);}
function S9($t){Wu($t);return;}
function TVB(){var $r=new MK();Fp($r);return $r;}
function CW($t){return GJB(Z,0);}
function Fp($t){Wu($t);return;}
function DPB(){var $r=new ZQ();VEB($r);return $r;}
function Hk($t){return GJB(Z,0);}
function VEB($t){Wu($t);return;}
function LaB(a){var $r=new PS();KV($r,a);return $r;}
function MaB(a,b){var $r=new PS();A7($r,a,b);return $r;}
function KOB(){var $r=new PS();Rs($r);return $r;}
function AGB(a,b){if(a!==b&&a.y(b)==0){a=0;}else{a=1;}return a;}
function KV($t,a){A7($t,a,0.75);return;}
function Sx($t,a,b,c){var d;d=$t.oF.data[b];while(d!==null&&!(d.gD==c&&AGB(a,d.FG)!=0)){d=d.BG;}return d;}
function DIB(a){var b;if(a>=1073741824){return 1073741824;}if(a==0){return 16;}b=a-1|0;b=b|b>>1;b=b|b>>2;b=b|b>>4;b=b|b>>8;return (b|b>>16)+1|0;}
function A7($t,a,b){var c;Cs($t);if(a>=0&&b>0.0){c=DIB(a);$t.GD=0;$t.oF=R1($t,c);$t.qM=b;Om($t);return;}CJB(OMB());}
function R0($t,a,b){var c,d,e,f,g;if(a===null){c=QDB($t);if(c===null){$t.JL=$t.JL+1|0;c=Pl($t,null,0,0);d=$t.GD+1|0;$t.GD=d;if(d>$t.RK){Ao($t);}}}else{e=RGB(a);d=e&($t.oF.data.length-1|0);c=Sx($t,a,d,e);if(c===null){$t.JL=$t.JL+1|0;c=Pl($t,a,d,e);f=$t.GD+1|0;$t.GD=f;if(f>$t.RK){Ao($t);}}}g=c.JI;c.JI=b;return g;}
function J2($t,a){var b;b=Fa($t,a);if(b===null){return null;}return b.JI;}
function R1($t,a){return GJB(IG,a);}
function D0($t,a){var b,c,d,e,f,g,h;if(a==0){b=1;}else{b=a<<1;}a=DIB(b);c=R1($t,a);d=0;e=a-1|0;while(d<$t.oF.data.length){f=$t.oF.data[d];$t.oF.data[d]=null;while(f!==null){g=c.data;h=f.gD&e;b=f.BG;f.BG=g[h];g[h]=f;f=b;}d=d+1|0;}$t.oF=c;Om($t);return;}
function Fa($t,a){var b;if(a===null){a=QDB($t);}else{b=RGB(a);a=Sx($t,a,b&($t.oF.data.length-1|0),b);}return a;}
function Om($t){$t.RK=$t.oF.data.length*$t.qM|0;return;}
function Bp($t){if($t.ZG===null){$t.ZG=FaB($t);}return $t.ZG;}
function Ma($t,a,b){return R0($t,a,b);}
function Pl($t,a,b,c){var d;d=PZB(a,c);d.BG=$t.oF.data[b];$t.oF.data[b]=d;return d;}
function Ao($t){D0($t,$t.oF.data.length);return;}
function RGB(a){return a.Y();}
function QDB($t){var a;a=$t.oF.data[0];while(a!==null&&a.FG!==null){a=a.BG;}return a;}
function Yn($t){return $t.GD;}
function Rs($t){KV($t,16);return;}
function HRB(){var $r=new JL();G0($r);return $r;}
function Df($t){return GJB(Z,0);}
function G0($t){Wu($t);return;}
function LTB(){var $r=new BK();Gd($r);return $r;}
function YY($t){return GJB(Z,0);}
function Gd($t){Wu($t);return;}
function ZC_$clinit(){ZC_$clinit=function(){};
Ag=function(a){return NaB(2,a);};
FM=function($t,a,b){Wu($t);$t.bJ=a;$t.uF=b;return;};
Mt=function(){ZC.YJ=NaB(0,0);ZC.VL=NaB(1,0);return;};
Mt();}
function NaB(a,b){var $r=new ZC();FM($r,a,b);return $r;}
function WBB($t){var a;if(H2($t)==0&&A3($t)==0){a=0;}else{a=1;}return a;}
function H2($t){var a;if($t.bJ!=2){a=0;}else{a=1;}return a;}
function P0($t){switch($t.bJ){case 0:break;case 1:return $rt_s(152);case 2:return Tj(Qa(DY(QJB(),$rt_s(153)),$t.uF));case 3:return Tj(Qa(DY(QJB(),$rt_s(154)),$t.uF));default:CJB(TJB());}return $rt_s(155);}
function VZ($t){var a;if($t.bJ!=0){a=0;}else{a=1;}return a;}
function A2($t){var a;if($t.bJ!=1){a=0;}else{a=1;}return a;}
function Jw($t){if(WBB($t)!=0){return $t.uF;}CJB(BMB());}
function A3($t){var a;if($t.bJ!=3){a=0;}else{a=1;}return a;}
function YYB(a){var $r=new GR();Wh($r,a);return $r;}
function UBB($t,a){var b,c,d,e,f,g,h,i;b=QEB(a);c=0;d=Jv(Fv($t.mL));while(Ia(d)!=0){if(J3(Rc(a),LX(H0(d)))!=0){e=Fv($t.mL);f=new BI;g=Rc(a);h=$rt_createDoubleArray(1);h.data[0]=Wc(a).data[0]+b;Er(f,g,h);GBB(e,c,f);i=Xr().data;i[c]=i[c]+b;}c=c+1|0;}return;}
function Wh($t,a){Wu($t);$t.mL=a;return;}
function PQB(){var $r=new NP();PV($r);return $r;}
function JZ($t){return GJB(Z,0);}
function PV($t){Wu($t);return;}
function IQB(){var $r=new IN();JBB($r);return $r;}
function TX($t){return GJB(Z,0);}
function JBB($t){Wu($t);return;}
function XB_$clinit(){XB_$clinit=function(){};
V6=function(a){return a.mE;};
NV=function(a){var b;if(a===FJB(FC)){return XB.jJ;}b=R5(XB.DE);if(b!==null){return b;}b=AJB();if(NHB(a,b)!=0){return Mk(b);}BW(XB.TK,$rt_s(156));return XB.jJ;};
KK=function($t,a,b){UJ($t,a);return;};
Fw=function(){return XB.DE;};
UJ=function($t,a){Wu($t);$t.mE=a;return;};
Vm=function(){XB.TK=GY(MBB(FJB(XB)));XB.DE=KZB();Cu(new AJ);XB.jJ=Mk(AJB());return;};
Vm();}
function ZZB(a,b){var $r=new XB();KK($r,a,b);return $r;}
function OaB(a){var $r=new XB();UJ($r,a);return $r;}
function Rr($t,a){var b;b=RJB($t,a);a=THB($t,FJB(OE));if(a===null){CEB(b);}else{Rr(a,b);}return;}
function WQB(){var $r=new XN();Bt($r);return $r;}
function Xf($t){return GJB(Z,0);}
function Bt($t){Wu($t);return;}
function BaB(){var $r=new HM();R7($r);return $r;}
function N2($t,a){XIB().$rt_putStderr(a);return;}
function R7($t){HU($t);return;}
function CPB(){var $r=new PL();Zs($r);return $r;}
function C3($t){return GJB(Z,0);}
function Zs($t){Wu($t);return;}
function KTB(){var $r=new PF();VU($r);return $r;}
function JU($t){return GJB(Z,0);}
function VU($t){Wu($t);return;}
function MRB(){var $r=new FH();Wo($r);return $r;}
function E7($t){return GJB(Z,0);}
function Wo($t){Wu($t);return;}
function CB_$clinit(){CB_$clinit=function(){};
A4=function(){return NWB();};
XAB=function(){return SWB();};
I0=function(a){return EYB(a);};
YM=function($t){Wu($t);return;};
Vb=function(a,b){return FYB(a,b);};
Uw=function(){return QWB();};
Me=function(){return PWB();};
Fi=function(a,b){var c,d;if(b===null){b=CB.SB;}c=GJB(E,a.f());Ju(a,c);KHB(c,b);d=0;while(true){b=c.data;if(d>=b.length){break;}a.z(d,b[d]);d=d+1|0;}return;};
LZ=function(){CB.gK=A4();CB.lF=Me();CB.tB=Uw();CB.SB=ZXB();CB.pG=YXB();return;};
LZ();}
function PaB(){var $r=new CB();YM($r);return $r;}
function XQB(){var $r=new JM();AY($r);return $r;}
function Vg($t){return GJB(Z,0);}
function AY($t){Wu($t);return;}
function XRB(){var $r=new TN();Gz($r);return $r;}
function N3($t){return GJB(Z,0);}
function Gz($t){Wu($t);return;}
$rt_metadata([E,"java.lang.Object",0,[],0,0,[],["mI",function(){return Hh(this);},"oM",function(){return SCB(this);},"y",function(a){return WW(this,a);},"Y",function(){return Wp(this);},"lG",function(){return Sq(this);},"wB",function(){return HW(this);},"c",function(){return Yk(this);},"a",function(){Wu(this);}],Y,"java.lang.Runnable",E,[],0,0,[],[],XJ,"net.java.html.BrwsrCtx$1Wrap",E,[Y],0,0,[],["p",function(){CEB(this);},"OL",function(a,b){X7(this,a,b);}],J,"org.teavm.platform.PlatformAnnotationProvider",
E,[],0,0,[],[],FL,"java.lang.Integer$$__annotations__$$",E,[J],0,0,[],["b",function(){return Bv(this);},"a",function(){Bz(this);}],IC,"org.netbeans.html.json.spi.Proto$Type",E,[],0,IC_$clinit,['OCB','X5','Tl','Tw','TF'],["oE",function(a){return W9(this,a);},"pI",function(a){return Hr(this,a);},"DJ",function(a,b){return XEB(this,a,b);},"RC",function(a){return R3(this,a);},"rL",function(a,b){return Sf(this,a,b);},"WF",function(a,b){Ls(this,a,b);},"HD",function(a,b,c){Fn(this,a,b,c);},"sK",function(a){return Ka(this,
a);},"oJ",function(a,b){return Kd(this,a,b);},"MH",function(a){return Sw(this,a);},"pH",function(a,b,c,d){TF(this,a,b,c,d);}],GL,"java.util.LinkedList$Entry$$__annotations__$$",E,[J],0,0,[],["b",function(){return Fx(this);},"a",function(){Zd(this);}],KI,"java.nio.charset.impl.BufferedEncoder$Controller",E,[],0,0,[],["HL",function(a){return Au(this,a);},"HI",function(){return Kt(this);},"hC",function(a){PEB(this,a);},"PB",function(a,b){Vx(this,a,b);},"sL",function(a){Vy(this,a);}],N,"java.io.Serializable",E,
[],0,0,[],[],M,"java.lang.Number",E,[N],0,0,[],["W",function(){return Uz(this);},"a",function(){F6(this);},"X",function(){return Ks(this);}],L,"java.lang.Comparable",E,[],0,0,[],[],AD,"java.lang.Integer",M,[L],0,AD_$clinit,['ZM','Uf','Nz','Np','Gf','Jj','Uq','JDB','Nu','Lf'],["l",function(a){ZM(this,a);},"i",function(){return Z4(this);},"g",function(){return Be(this);},"SK",function(a){return Eu(this,a);},"j",function(){return Xg(this);},"e",function(a){return OBB(this,a);},"h",function(){return TY(this);},
"c",function(){return W4(this);}],SS,"net.java.html.charts.Color$$__annotations__$$",E,[J],0,0,[],["b",function(){return J1(this);},"a",function(){RX(this);}],AC,"net.java.html.charts.ChartListener",E,[],0,0,[],[],BU,"java.lang.ref.ReferenceQueue$$__annotations__$$",E,[J],0,0,[],["b",function(){return P6(this);},"a",function(){N6(this);}],BD,"org.netbeans.html.json.spi.Transfer",E,[],0,0,[],[],FD,"org.netbeans.html.json.spi.WSTransfer",E,[],0,0,[],[],QB,"org.netbeans.html.json.spi.Technology",E,[],0,0,[],[],VD,
"org.netbeans.html.json.impl.JSON$EmptyTech",E,[BD,FD,QB],0,VD_$clinit,['T9','Dn','SH'],["aB",function(a,b,c){Bc(this,a,b,c);},"eB",function(a){return Cb(this,a);},"hB",function(a){OZ(this,a);},"iB",function(a,b,c){H4(this,a,b,c);},"a",function(){SH(this);},"I",function(a,b){Rh(this,a,b);},"D",function(a){return Ro(this,a);}],GB,"java.lang.Thread",E,[Y],0,GB_$clinit,['H','C0','AM','I','TJ','Ng','Jy','ET'],["wC",function(a,b){AM(this,a,b);},"rE",function(){return MV(this);},"d",function(a){TJ(this,a);},"a",function()
{ET(this);}],DB,"org.teavm.jso.JSObject",E,[],0,0,[],[],LG,"org.teavm.platform.PlatformQueue",E,[DB],0,0,[],[],YQ,"java.util.LinkedList$SequentialListIterator$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ya(this);},"a",function(){Dj(this);}],GC,"java.lang.CharSequence",E,[],0,0,[],[],SB,"java.lang.Throwable",E,[],0,0,[],["K",function(){return Wq(this);},"WL",function(){O3(this);},"d",function(a){V7(this,a);},"hG",function(a){ABB(this,a);},"sI",function(){return Qw(this);},"a",function(){V0(this);
},"F",function(a){X0(this,a);}],W,"java.lang.Error",SB,[],0,0,[],["d",function(a){Vr(this,a);},"F",function(a){Th(this,a);},"a",function(){En(this);}],VB,"java.lang.LinkageError",W,[],0,0,[],["d",function(a){LY(this,a);},"a",function(){Ws(this);}],LM,"java.lang.annotation.RetentionPolicy$$__annotations__$$",E,[J],0,0,[],["b",function(){return NEB(this);},"a",function(){Jp(this);}],HT,"org.netbeans.html.json.spi.Proto",E,[],0,0,[],["fB",function(a,b,c){Yo(this,a,b,c);},"EL",function(){return Ip(this);},"mD",
function(a){A1(this,a);},"jK",function(){return YEB(this);},"DD",function(){return Nt(this);},"LI",function(){Jo(this);},"hH",function(a){return T5(this,a);},"OK",function(a,b,c){R9(this,a,b,c);},"IB",function(){Mf(this);}],P,"java.lang.Exception",SB,[],0,0,[],["d",function(a){AX(this,a);},"a",function(){Kl(this);}],K,"java.lang.RuntimeException",P,[],0,0,[],["d",function(a){Q4(this,a);},"a",function(){Ba(this);}],SC,"java.lang.IndexOutOfBoundsException",K,[],0,0,[],["d",function(a){Q5(this,a);},"a",function()
{Rl(this);}],CS,"java.lang.StringIndexOutOfBoundsException",SC,[],0,0,[],["a",function(){Kx(this);}],YP,"java.lang.ref.WeakReference$$__annotations__$$",E,[J],0,0,[],["b",function(){return Py(this);},"a",function(){Zr(this);}],PM,"java.lang.NoClassDefFoundError$$__annotations__$$",E,[J],0,0,[],["b",function(){return FY(this);},"a",function(){E0(this);}],ID,"java.nio.ByteOrder",E,[],0,ID_$clinit,['EF','RCB'],["d",function(a){EF(this,a);},"c",function(){return Xo(this);}],NN,"java.lang.ReflectiveOperationException$$__annotations__$$",
E,[J],0,0,[],["b",function(){return K7(this);},"a",function(){W8(this);}],YR,"java.lang.InstantiationException$$__annotations__$$",E,[J],0,0,[],["b",function(){return V1(this);},"a",function(){WCB(this);}],TK,"java.lang.Object$1$$__annotations__$$",E,[J],0,0,[],["b",function(){return ZEB(this);},"a",function(){Dk(this);}],OP,"org.netbeans.html.json.spi.PropertyBinding$1$$__annotations__$$",E,[J],0,0,[],["b",function(){return Cw(this);},"a",function(){Uc(this);}],Z,"java.lang.annotation.Annotation",E,[],0,0,
[],[],GE,"java.lang.FunctionalInterface",E,[Z],0,0,[],[],RL,"java.lang.FunctionalInterface$$_impl",E,[GE],0,0,[],["s",function(){return Ym(this);},"a",function(){Kz(this);}],AH,"org.netbeans.html.context.spi.Contexts$Provider$$__annotations__$$",E,[J],0,0,[],["b",function(){return Bj(this);},"a",function(){SAB(this);}],OG,"java.lang.Boolean$$__annotations__$$",E,[J],0,0,[],["b",function(){return Xc(this);},"a",function(){Vj(this);}],GN,"java.nio.charset.CoderMalfunctionError$$__annotations__$$",E,[J],0,0,[],
["b",function(){return M5(this);},"a",function(){Bm(this);}],PB,"java.lang.ReflectiveOperationException",P,[],0,0,[],["a",function(){Dy(this);}],YD,"org.netbeans.html.context.spi.Contexts$Id",E,[Z],0,0,[],[],NS,"java.lang.ClassCastException",K,[],0,0,[],["d",function(a){Nk(this,a);},"a",function(){Ih(this);}],YI,"java.nio.charset.CoderMalfunctionError",W,[],0,0,[],["F",function(a){HY(this,a);}],YT,"org.teavm.jso.core.JSArrayReader$$__annotations__$$",E,[J],0,0,[],["b",function(){return Fz(this);},"a",function()
{Kc(this);}],NB,"java.nio.Buffer",E,[],0,0,[],["l",function(a){Ew(this,a);},"JF",function(){return Xk(this);},"FF",function(){return M1(this);},"HH",function(){return Zy(this);},"bM",function(){return Ef(this);},"eC",function(a){return Xy(this,a);}],WR,"org.netbeans.html.json.impl.JSON$EmptyTech$$__annotations__$$",E,[J],0,0,[],["b",function(){return Sn(this);},"a",function(){W5(this);}],DE,"java.io.Flushable",E,[],0,0,[],[],PK,"org.netbeans.html.json.spi.Observers$$__annotations__$$",E,[J],0,0,[],["b",function()
{return JCB(this);},"a",function(){Ee(this);}],ST,"java.lang.IndexOutOfBoundsException$$__annotations__$$",E,[J],0,0,[],["b",function(){return GV(this);},"a",function(){Yi(this);}],KM,"org.netbeans.html.context.impl.CtxImpl$$__annotations__$$",E,[J],0,0,[],["b",function(){return Rg(this);},"a",function(){K2(this);}],AB,"java.lang.Cloneable",E,[],0,0,[],[],XD,"com.dukescript.charts.sample.Data",E,[AB],0,XD_$clinit,['Fm','RS','El','Rp','AP'],["AH",function(){return Oa(this);},"nM",function(a){RS(this,a);},"aM",
function(){return Vz(this);},"sC",function(a){Il(this,a);},"c",function(){return Yt(this);},"a",function(){AP(this);}],DD,"java.lang.UnsupportedOperationException",K,[],0,0,[],["a",function(){IW(this);}],DT,"java.nio.ReadOnlyBufferException",DD,[],0,0,[],["a",function(){Z8(this);}],CF,"com.dukescript.charts.sample.ChartModel$AddSegment",E,[AC],0,0,[],["B",function(a){Wg(this,a);},"R",function(a){SU(this,a);}],KR,"java.io.OutputStream$$__annotations__$$",E,[J],0,0,[],["b",function(){return QX(this);},"a",function()
{CZ(this);}],WC,"java.lang.ref.Reference",E,[],0,0,[],["a",function(){Nj(this);}],FB,"java.lang.ref.WeakReference",WC,[],0,0,[],["lB",function(){return Ou(this);},"bG",function(a,b){Ms(this,a,b);},"M",function(a){Et(this,a);}],JE,"org.netbeans.html.ko4j.Knockout",FB,[],0,JE_$clinit,['GM','Dp','B9','U4','Iz','S4','Qc'],["fE",function(a,b){OY(this,a,b);},"CF",function(a,b,c,d){GM(this,a,b,c,d);},"zJ",function(a){return P4(this,a);},"zC",function(a,b,c){Je(this,a,b,c);},"gE",function(){Oz(this);},"LB",function(a,
b,c,d,e){Lj(this,a,b,c,d,e);}],VS,"org.teavm.platform.PlatformQueue$$__annotations__$$",E,[J],0,0,[],["b",function(){return Xv(this);},"a",function(){FZ(this);}],HI,"org.netbeans.html.json.spi.WSTransfer$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ab(this);},"a",function(){R2(this);}],YG,"java.lang.reflect.Array",E,[],0,0,[],["a",function(){REB(this);}],YF,"java.lang.NumberFormatException$$__annotations__$$",E,[J],0,0,[],["b",function(){return Fc(this);},"a",function(){YCB(this);}],CD,"java.lang.Iterable",
E,[],0,0,[],[],IB,"java.util.Collection",E,[CD],0,0,[],[],EB,"java.util.AbstractCollection",E,[IB],0,0,[],["ZB",function(a){return Ju(this,a);},"c",function(){return Wj(this);},"a",function(){H3(this);}],QD,"java.util.List",E,[IB],0,0,[],[],O,"java.util.AbstractList",EB,[QD],0,0,[],["o",function(a){return Ul(this,a);},"k",function(){return Jv(this);},"x",function(a){return Cp(this,a);},"u",function(a,b){Cz(this,a,b);},"a",function(){D7(this);},"z",function(a,b){return S2(this,a,b);}],HB,"java.util.ArrayList",
O,[AB,N],0,0,[],["wD",function(a){Kq(this,a);},"o",function(a){return Jq(this,a);},"l",function(a){SW(this,a);},"QF",function(a){MX(this,a);},"G",function(a){Yb(this,a);},"u",function(a,b){J8(this,a,b);},"m",function(a){return Uo(this,a);},"f",function(){return Yg(this);},"a",function(){Iy(this);},"z",function(a,b){return MZ(this,a,b);}],SL,"org.netbeans.html.json.impl.JSONList",HB,[],0,0,[],["o",function(a){return AW(this,a);},"xB",function(){EDB(this);},"c",function(){return I4(this);},"nB",function(){return Gv(this);
}],SO,"java.nio.charset.CoderResult$$__annotations__$$",E,[J],0,0,[],["b",function(){return Qn(this);},"a",function(){Ku(this);}],RG,"org.teavm.classlib.impl.unicode.UnicodeHelper$$__annotations__$$",E,[J],0,0,[],["b",function(){return Fd(this);},"a",function(){Yf(this);}],PR,"java.nio.CharBuffer$$__annotations__$$",E,[J],0,0,[],["b",function(){return Pm(this);},"a",function(){Mq(this);}],TQ,"net.java.html.charts.ChartEvent",E,[],0,0,[],["kL",function(){return Vk(this);},"MM",function(){return Wc(this);},"QB",
function(a,b,c,d){Cf(this,a,b,c,d);},"GH",function(){return Xs(this);},"E",function(){return Rc(this);}],MB,"java.lang.IncompatibleClassChangeError",VB,[],0,0,[],["d",function(a){G1(this,a);},"a",function(){DCB(this);}],TI,"java.lang.NoSuchFieldError",MB,[],0,0,[],["d",function(a){Ml(this,a);},"a",function(){P3(this);}],ZS,"java.nio.ByteOrder$$__annotations__$$",E,[J],0,0,[],["b",function(){return KCB(this);},"a",function(){Tu(this);}],EI,"java.io.Flushable$$__annotations__$$",E,[J],0,0,[],["b",function(){return Xl(this);
},"a",function(){SX(this);}],WI,"org.netbeans.html.json.spi.PropertyBinding$Impl$$__annotations__$$",E,[J],0,0,[],["b",function(){return Gr(this);},"a",function(){Lq(this);}],YE,"java.lang.Readable",E,[],0,0,[],[],CJ,"java.lang.SecurityException",K,[],0,0,[],["a",function(){Hb(this);}],RK,"org.netbeans.html.ko4j.KOSockets$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ub(this);},"a",function(){Ut(this);}],WL,"org.teavm.jso.impl.JS",E,[],0,0,[],["a",function(){HDB(this);}],FP,"java.util.logging.Level$$__annotations__$$",
E,[J],0,0,[],["b",function(){return Ah(this);},"a",function(){Qf(this);}],UN,"java.nio.charset.impl.BufferedEncoder$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ov(this);},"a",function(){Oe(this);}],AS,"java.util.HashMap$1$$__annotations__$$",E,[J],0,0,[],["b",function(){return Od(this);},"a",function(){Zk(this);}],FR,"org.teavm.html4j.JavaScriptConv$$__annotations__$$",E,[J],0,0,[],["b",function(){return Su(this);},"a",function(){Eg(this);}],PP,"org.netbeans.html.json.spi.Proto$2",E,[Y],0,0,[],["p",
function(){Hw(this);},"BC",function(a,b,c,d){PBB(this,a,b,c,d);}],JK,"org.teavm.classlib.impl.unicode.UnicodeHelper",E,[],0,0,[],["a",function(){Wb(this);}],MN,"org.netbeans.html.json.spi.Observers$Ref",FB,[],0,0,[],["dI",function(a,b){Yl(this,a,b);},"mF",function(){return UDB(this);}],JC,"java.nio.charset.CharsetEncoder",E,[],0,0,[],["tF",function(a){C5(this,a);},"P",function(a,b,c){Q0(this,a,b,c);},"kM",function(a){return I5(this,a);},"mK",function(a,b,c){return Ig(this,a,b,c);},"UK",function(a,b,c,d){S5(this,
a,b,c,d);},"RJ",function(a){L9(this,a);},"zD",function(a){return GU(this,a);},"CC",function(a){return PW(this,a);},"tH",function(a){J6(this,a);},"jD",function(a){return YX(this,a);}],GS,"org.netbeans.html.json.spi.Technology$$__annotations__$$",E,[J],0,0,[],["b",function(){return Fq(this);},"a",function(){XV(this);}],XS,"java.lang.Readable$$__annotations__$$",E,[J],0,0,[],["b",function(){return Z7(this);},"a",function(){Gq(this);}],LC,"org.netbeans.html.json.spi.PropertyBinding",E,[],0,LC_$clinit,['Dg','TH'],
["a",function(){TH(this);}],RB,"org.netbeans.html.json.spi.PropertyBinding$AImpl",LC,[],0,0,[],["eH",function(a,b,c,d,e){Kf(this,a,b,c,d,e);},"IE",function(){return QY(this);},"J",function(){return AZ(this);},"aG",function(){return Hq(this);},"QG",function(a){X4(this,a);}],WT,"org.netbeans.html.json.spi.PropertyBinding$Impl",RB,[],0,0,[],["C",function(){return Q8(this);},"L",function(a,b,c,d,e,f){Nc(this,a,b,c,d,e,f);},"iJ",function(){return J5(this);}],FK,"java.lang.FunctionalInterface$$_impl$$__annotations__$$",
E,[J],0,0,[],["b",function(){return SBB(this);},"a",function(){MW(this);}],ES,"java.lang.String$$__annotations__$$",E,[J],0,0,[],["b",function(){return RDB(this);},"a",function(){Y4(this);}],MJ,"org.netbeans.html.ko4j.KOTech$$__annotations__$$",E,[J],0,0,[],["b",function(){return K5(this);},"a",function(){Ik(this);}],CR,"java.util.Collection$$__annotations__$$",E,[J],0,0,[],["b",function(){return Hz(this);},"a",function(){SDB(this);}],QR,"org.netbeans.html.json.spi.Observers$Ref$$__annotations__$$",E,[J],0,
0,[],["b",function(){return Vo(this);},"a",function(){DW(this);}],ZD,"org.netbeans.html.json.spi.Technology$ValueMutated",E,[QB],0,0,[],[],UE,"org.netbeans.html.json.spi.Technology$BatchInit",E,[QB],0,0,[],[],QE,"org.netbeans.html.json.spi.Technology$ApplyId",E,[QB],0,0,[],[],QH,"org.netbeans.html.ko4j.KOTech",E,[ZD,UE,QE],0,0,[],["aB",function(a,b,c){J4(this,a,b,c);},"eB",function(a){return TEB(this,a);},"hB",function(a){Ti(this,a);},"lI",function(a,b,c){return D5(this,a,b,c);},"FJ",function(a,b){M9(this,a,
b);},"nI",function(a,b,c,d){Bx(this,a,b,c,d);},"iB",function(a,b,c){Rv(this,a,b,c);},"a",function(){E9(this);},"VC",function(){return SV(this);},"I",function(a,b){Yj(this,a,b);},"D",function(a){return Y3(this,a);}],UO,"org.netbeans.html.json.spi.FunctionBinding$Impl$$__annotations__$$",E,[J],0,0,[],["b",function(){return Js(this);},"a",function(){Qx(this);}],YB,"java.nio.charset.Charset",E,[L],0,YB_$clinit,['Vp','Sp','Ea','HL'],["e",function(a){return F5(this,a);},"FC",function(a){return X3(this,a);},"eJ",function(a,
b){HL(this,a,b);}],LK,"org.teavm.platform.Platform",E,[],0,0,[],["a",function(){MAB(this);}],CC,"java.nio.charset.CodingErrorAction",E,[],0,CC_$clinit,['ZL','NW'],["d",function(a){ZL(this,a);},"c",function(){return P9(this);}],Q,"java.lang.AbstractStringBuilder",E,[GC,N],0,Q_$clinit,['Oj','NJ','XG','Gx','Ni'],["fC",function(a){return Y9(this,a);},"tL",function(a){return Mi(this,a);},"BH",function(a){return Yw(this,a);},"VK",function(a){return I6(this,a);},"N",function(a){Wy(this,a);},"xI",function(a,b,c){return NX(this,
a,b,c);},"bI",function(a,b){Jc(this,a,b);},"dB",function(a,b){return Q7(this,a,b);},"QD",function(a,b){return Oc(this,a,b);},"A",function(a,b,c,d){A0(this,a,b,c,d);},"c",function(){return RZ(this);},"t",function(){return W2(this);},"a",function(){NJ(this);},"YC",function(a,b,c){return M6(this,a,b,c);},"S",function(a,b){return IDB(this,a,b);},"l",function(a){XG(this,a);},"bB",function(a,b){return Ds(this,a,b);},"H",function(a,b){return Kr(this,a,b);},"JG",function(a){return K4(this,a);},"pB",function(a,b){return Pb(this,
a,b);},"IM",function(a){return Jg(this,a);},"G",function(a){Mh(this,a);},"Z",function(a,b){return Kv(this,a,b);},"fI",function(a){return Hu(this,a);}],HC,"java.lang.Boolean",E,[L,N],0,HC_$clinit,['La','Rm','Ev','EK','Uh','Vu'],["DL",function(a){return Fb(this,a);},"e",function(a){return As(this,a);},"y",function(a){return Za(this,a);},"vJ",function(a){EK(this,a);},"c",function(){return Md(this);},"TH",function(){return O1(this);}],LB,"java.lang.IllegalArgumentException",K,[],0,0,[],["d",function(a){GEB(this,
a);},"a",function(){Qj(this);}],SM,"java.nio.charset.IllegalCharsetNameException",LB,[],0,0,[],["d",function(a){Zx(this,a);}],PT,"java.util.NoSuchElementException",K,[],0,0,[],["a",function(){KZ(this);}],VM,"org.netbeans.html.json.spi.Technology$ValueMutated$$__annotations__$$",E,[J],0,0,[],["b",function(){return Tq(this);},"a",function(){Hs(this);}],VE,"java.lang.AutoCloseable",E,[],0,0,[],[],MC,"java.io.Closeable",E,[VE],0,0,[],[],U,"java.io.OutputStream",E,[MC,DE],0,0,[],["V",function(a,b,c){QZ(this,a,b,
c);},"a",function(){HU(this);}],NC,"java.io.FilterOutputStream",U,[],0,0,[],["pJ",function(a){GZ(this,a);}],MP,"java.io.PrintStream",NC,[],0,0,[],["AE",function(a,b,c){Ci(this,a,b,c);},"OJ",function(a,b){H1(this,a,b);},"WE",function(){return Ts(this);},"JH",function(a){Lm(this,a);},"V",function(a,b,c){Tc(this,a,b,c);},"AB",function(){Id(this);}],QP,"org.teavm.platform.async.AsyncCallback$$__annotations__$$",E,[J],0,0,[],["b",function(){return Q1(this);},"a",function(){Hd(this);}],TP,"com.dukescript.charts.sample.BrowserMain$$__annotations__$$",
E,[J],0,0,[],["b",function(){return St(this);},"a",function(){JW(this);}],JH,"java.util.HashSet$$__annotations__$$",E,[J],0,0,[],["b",function(){return DAB(this);},"a",function(){Jk(this);}],LQ,"java.util.AbstractSequentialList$$__annotations__$$",E,[J],0,0,[],["b",function(){return Dx(this);},"a",function(){Wn(this);}],IO,"java.lang.Runnable$$__annotations__$$",E,[J],0,0,[],["b",function(){return DDB(this);},"a",function(){U2(this);}],NF,"java.util.concurrent.Executor$$__annotations__$$",E,[J],0,0,[],["b",
function(){return Rx(this);},"a",function(){Zl(this);}],VQ,"org.netbeans.html.json.spi.FunctionBinding$$__annotations__$$",E,[J],0,0,[],["b",function(){return Vt(this);},"a",function(){HCB(this);}],QF,"java.lang.Cloneable$$__annotations__$$",E,[J],0,0,[],["b",function(){return K0(this);},"a",function(){Qb(this);}],OH,"net.java.html.charts.Values$Set",E,[],0,0,[],["WC",function(a,b,c){S0(this,a,b,c);}],SD,"java.lang.reflect.AnnotatedElement",E,[],0,0,[],[],HP,"java.lang.Class",E,[SD],0,0,[],["RE",function(a)
{return M0(this,a);},"hJ",function(){return P8(this);},"wJ",function(a){return Ix(this,a);},"DC",function(a){return Xe(this,a);},"xM",function(){return KW(this);},"SF",function(){return Ak(this);},"iL",function(){return Bh(this);},"jH",function(){return Ki(this);},"TI",function(){return MBB(this);},"rC",function(){E1(this);},"U",function(){return TZ(this);},"nF",function(a){Bw(this,a);},"PE",function(){return F7(this);},"b",function(){return J7(this);},"rK",function(a){return Ay(this,a);},"dF",function(){return Xm(this);
}],KD,"java.lang.Float",M,[L],0,KD_$clinit,['Se','OAB','Ej','GI','Qd'],["i",function(){return Ht(this);},"g",function(){return Hp(this);},"j",function(){return F0(this);},"e",function(a){return F8(this,a);},"h",function(){return Kk(this);},"UF",function(a){return Fe(this,a);},"c",function(){return FW(this);},"OB",function(a){GI(this,a);}],UI,"java.util.Arrays",E,[],0,0,[],["a",function(){G2(this);}],QJ,"java.lang.NoSuchFieldError$$__annotations__$$",E,[J],0,0,[],["b",function(){return Fj(this);},"a",function()
{L3(this);}],BS,"java.lang.ConsoleOutputStreamStdout",U,[],0,0,[],["O",function(a){XW(this,a);},"a",function(){UY(this);}],IE,"java.util.Set",E,[IB],0,0,[],[],T,"java.util.AbstractSet",EB,[IE],0,0,[],["a",function(){Jm(this);}],CN,"java.util.Collections$5",T,[],0,0,[],["f",function(){return Qi(this);},"k",function(){return ZCB(this);},"a",function(){Rw(this);}],RD,"java.util.Map",E,[],0,0,[],[],KB,"java.util.AbstractMap",E,[RD],0,0,[],["a",function(){Cs(this);}],BN,"java.util.Collections$6",KB,[],0,0,[],["a",
function(){Cx(this);}],EN,"java.util.Collections$3",O,[],0,0,[],["m",function(a){return DZ(this,a);},"f",function(){return EEB(this);},"a",function(){Dc(this);}],JB,"java.lang.Character",E,[L],0,JB_$clinit,['MU','S1','Rn','A6','V4','M7','Ob','W3','EW','Vf','Vd','L4','JX','QW','WAB','C1','DEB','Ac','Ty','TO'],["e",function(a){return OW(this,a);},"c",function(){return YV(this);},"kD",function(a){return OX(this,a);},"bC",function(){return OV(this);},"OF",function(a){TO(this,a);}],BB,"java.util.Iterator",E,[],0,
0,[],[],FN,"java.util.Collections$1",E,[BB],0,0,[],["q",function(){return BCB(this);},"n",function(){return PU(this);},"a",function(){Ga(this);}],WQ,"java.util.Queue$$__annotations__$$",E,[J],0,0,[],["b",function(){return Lv(this);},"a",function(){WEB(this);}],IS,"net.java.html.charts.Chart$ChartList",HB,[],0,0,[],["x",function(a){return Fo(this,a);},"u",function(a,b){E8(this,a,b);},"o",function(a){return Ko(this,a);},"iC",function(a,b){Zo(this,a,b);},"z",function(a,b){return GBB(this,a,b);}],MM,"org.netbeans.html.json.spi.Technology$ApplyId$$__annotations__$$",
E,[J],0,0,[],["b",function(){return ZDB(this);},"a",function(){H7(this);}],YO,"org.netbeans.html.ko4j.KO4J$$__annotations__$$",E,[J],0,0,[],["b",function(){return Hn(this);},"a",function(){LCB(this);}],HD,"java.lang.Appendable",E,[],0,0,[],[],KC,"java.nio.CharBuffer",NB,[GC,HD,YE,L],0,0,[],["T",function(a,b,c){WV(this,a,b,c);},"rD",function(a){return Re(this,a);},"e",function(a){return Tk(this,a);},"c",function(){return Kw(this);},"xK",function(a,b,c){return Sc(this,a,b,c);}],YC,"java.nio.CharBufferImpl",KC,
[],0,0,[],["T",function(a,b,c){So(this,a,b,c);}],MR,"java.nio.CharBufferOverArray",YC,[],0,0,[],["PK",function(a){return Ye(this,a);},"PH",function(a,b,c,d,e,f){XDB(this,a,b,c,d,e,f);}],VP,"java.lang.Object$Monitor$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ui(this);},"a",function(){Lx(this);}],EO,"org.netbeans.html.context.impl.CtxImpl$Bind$$__annotations__$$",E,[J],0,0,[],["b",function(){return QU(this);},"a",function(){YU(this);}],UT,"java.nio.charset.Charset$$__annotations__$$",E,[J],0,0,[],
["b",function(){return EV(this);},"a",function(){Dv(this);}],FJ,"java.lang.Long$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ne(this);},"a",function(){Pt(this);}],DI,"java.lang.Double$$__annotations__$$",E,[J],0,0,[],["b",function(){return O6(this);},"a",function(){Lk(this);}],QL,"org.netbeans.html.json.impl.Bindings$$__annotations__$$",E,[J],0,0,[],["b",function(){return OU(this);},"a",function(){Cn(this);}],DQ,"org.netbeans.html.context.impl.CtxImpl",E,[],0,0,[],["wF",function(a,b){QV(this,a,b);
},"w",function(a){UU(this,a);},"QJ",function(a,b,c){Oh(this,a,b,c);},"cB",function(){return Zf(this);}],OB,"java.util.Comparator",E,[],0,0,[],[],AT,"java.lang.String$1",E,[OB],0,0,[],["a",function(){Tr(this);}],CU,"org.netbeans.html.context.spi.Contexts",E,[],0,0,[],["a",function(){Xt(this);}],VR,"org.netbeans.html.json.spi.PropertyBinding$Weak$$__annotations__$$",E,[J],0,0,[],["b",function(){return Aq(this);},"a",function(){BDB(this);}],XI,"java.util.ConcurrentModificationException$$__annotations__$$",E,[J],
0,0,[],["b",function(){return Gm(this);},"a",function(){Xx(this);}],BF,"java.lang.annotation.Retention$$__annotations__$$",E,[J],0,0,[],["b",function(){return At(this);},"a",function(){X8(this);}],FQ,"java.lang.ConsoleOutputStreamStdout$$__annotations__$$",E,[J],0,0,[],["b",function(){return Bl(this);},"a",function(){LW(this);}],HR,"java.lang.AssertionError",W,[],0,0,[],["a",function(){U0(this);}],UH,"java.util.Random$$__annotations__$$",E,[J],0,0,[],["b",function(){return XBB(this);},"a",function(){Zc(this);
}],ZH,"java.lang.String$1$$__annotations__$$",E,[J],0,0,[],["b",function(){return Bg(this);},"a",function(){Ns(this);}],ZP,"java.lang.IllegalMonitorStateException",K,[],0,0,[],["a",function(){AV(this);}],OI,"net.java.html.charts.Color",E,[],0,0,[],["d",function(a){ZW(this,a);},"c",function(){return Ce(this);}],US,"org.teavm.platform.plugin.ResourceAccessor$$__annotations__$$",E,[J],0,0,[],["b",function(){return O8(this);},"a",function(){X9(this);}],UC,"java.lang.String",E,[GC,L,N],0,UC_$clinit,['GG','EU','Q9',
'DF','Zp','UG','D1'],["nD",function(a,b){return Nd(this,a,b);},"UD",function(){return K9(this);},"dK",function(){return G(this);},"HM",function(a){return Qk(this,a);},"Y",function(){return Le(this);},"ZC",function(a,b){return SY(this,a,b);},"XL",function(){return V9(this);},"iG",function(a){return Hf(this,a);},"e",function(a){return Nx(this,a);},"KF",function(a){return Fu(this,a);},"A",function(a,b,c,d){D(this,a,b,c,d);},"c",function(){return Uk(this);},"t",function(){return C(this);},"a",function(){GG(this);
},"lL",function(a,b,c){EU(this,a,b,c);},"KK",function(a){return B6(this,a);},"CL",function(a,b){return Tf(this,a,b);},"y",function(a){return J3(this,a);},"dC",function(a,b,c){DF(this,a,b,c);},"dH",function(a){return K3(this,a);},"NH",function(){return Kp(this);},"kB",function(a){UG(this,a);},"wH",function(){return DBB(this);}],X,"org.teavm.jso.dom.events.EventTarget",E,[DB],0,0,[],[],KE,"org.teavm.jso.dom.events.FocusEventTarget",E,[X],0,0,[],[],HJ,"org.teavm.jso.dom.events.EventTarget$$__annotations__$$",E,
[J],0,0,[],["b",function(){return E5(this);},"a",function(){Zz(this);}],MD,"java.nio.charset.impl.BufferedEncoder",JC,[],0,0,[],["cF",function(a,b){return Fg(this,a,b);},"P",function(a,b,c){On(this,a,b,c);}],TM,"java.nio.charset.impl.UTF8Encoder",MD,[],0,0,[],["bE",function(a){Gu(this,a);},"fD",function(a,b,c,d,e,f,g){return ECB(this,a,b,c,d,e,f,g);}],CK,"java.util.AbstractCollection$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ph(this);},"a",function(){ODB(this);}],OE,"java.util.concurrent.Executor",
E,[],0,0,[],[],YH,"org.teavm.classlib.impl.CharFlow$$__annotations__$$",E,[J],0,0,[],["b",function(){return Xb(this);},"a",function(){Gw(this);}],CI,"net.java.html.js.JavaScriptResource",E,[Z],0,0,[],[],SP,"java.util.Collections$$__annotations__$$",E,[J],0,0,[],["b",function(){return IX(this);},"a",function(){Aa(this);}],DO,"java.util.AbstractSet$$__annotations__$$",E,[J],0,0,[],["b",function(){return UV(this);},"a",function(){Pn(this);}],DC,"org.netbeans.html.json.impl.PropertyBindingAccessor",E,[],0,DC_$clinit,
['Hi','If','NBB','Av','VI'],["a",function(){VI(this);}],YN,"org.netbeans.html.json.spi.PropertyBinding$1",DC,[],0,0,[],["MF",function(a,b,c,d,e,f){return VV(this,a,b,c,d,e,f);},"cI",function(a,b){return Gl(this,a,b);},"II",function(a,b){return TU(this,a,b);},"a",function(){Fk(this);}],PE,"org.netbeans.html.json.impl.JSON",E,[],0,PE_$clinit,['W1','I3','G5','YW','IV','By','MCB','Km','Oo','Ra','TV','FX','Y5','CQ'],["a",function(){CQ(this);}],JT,"java.nio.charset.impl.UTF8Charset",YB,[],0,0,[],["aI",function(){
return K6(this);},"a",function(){C6(this);}],HN,"java.util.logging.Logger$$__annotations__$$",E,[J],0,0,[],["b",function(){return Sl(this);},"a",function(){O2(this);}],RE,"org.teavm.jso.dom.events.KeyboardEventTarget",E,[X],0,0,[],[],DU,"java.lang.ClassNotFoundException",PB,[],0,0,[],["a",function(){Yp(this);}],JS,"net.java.html.charts.Values$Set$$__annotations__$$",E,[J],0,0,[],["b",function(){return Zw(this);},"a",function(){Cg(this);}],MQ,"java.nio.BufferUnderflowException$$__annotations__$$",E,[J],0,0,[],
["b",function(){return GCB(this);},"a",function(){N0(this);}],NO,"org.netbeans.html.ko4j.Knockout$$__annotations__$$",E,[J],0,0,[],["b",function(){return QCB(this);},"a",function(){RV(this);}],HG,"java.lang.Error$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ff(this);},"a",function(){Xj(this);}],WH,"java.util.Arrays$$__annotations__$$",E,[J],0,0,[],["b",function(){return Q6(this);},"a",function(){Vl(this);}],VC,"java.util.HashMap$AbstractMapIterator",E,[],0,0,[],["nC",function(){Pj(this);},"v",function(a)
{HV(this,a);},"aL",function(){Jr(this);},"q",function(){return Sa(this);}],TS,"java.lang.ClassNotFoundException$$__annotations__$$",E,[J],0,0,[],["b",function(){return Jf(this);},"a",function(){Ly(this);}],WS,"org.teavm.html4j.JavaScriptConv",E,[],0,0,[],["a",function(){BY(this);}],DK,"java.io.Closeable$$__annotations__$$",E,[J],0,0,[],["b",function(){return L7(this);},"a",function(){Ld(this);}],FE,"java.lang.annotation.Target",E,[Z],0,0,[],[],PO,"java.lang.annotation.Target$$_impl",E,[FE],0,0,[],["s",function()
{return Dq(this);},"cM",function(a){Pc(this,a);}],OF,"java.lang.NullPointerException",K,[],0,0,[],["a",function(){Zm(this);}],LN,"org.netbeans.html.context.impl.CtxImpl$BindCompare$$__annotations__$$",E,[J],0,0,[],["b",function(){return A9(this);},"a",function(){Pf(this);}],SQ,"net.java.html.BrwsrCtx$$__annotations__$$",E,[J],0,0,[],["b",function(){return Dm(this);},"a",function(){Bd(this);}],UL,"java.lang.Object$Monitor",E,[],0,0,[],["a",function(){WDB(this);}],JR,"java.lang.Math",E,[],0,0,[],["a",function()
{Pd(this);}],BJ,"java.nio.ByteBufferImpl$$__annotations__$$",E,[J],0,0,[],["b",function(){return Jn(this);},"a",function(){MEB(this);}],XT,"java.lang.ThreadLocal$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ue(this);},"a",function(){Sh(this);}],XO,"java.util.List$$__annotations__$$",E,[J],0,0,[],["b",function(){return Uj(this);},"a",function(){Kh(this);}],GQ,"org.teavm.jso.dom.events.FocusEventTarget$$__annotations__$$",E,[J],0,0,[],["b",function(){return Z0(this);},"a",function(){F9(this);}],KN,
"java.util.Collections$5$$__annotations__$$",E,[J],0,0,[],["b",function(){return S7(this);},"a",function(){Qo(this);}],UM,"java.util.AbstractMap$$__annotations__$$",E,[J],0,0,[],["b",function(){return Px(this);},"a",function(){AAB(this);}],GD,"java.util.AbstractSequentialList",O,[],0,0,[],["u",function(a,b){Um(this,a,b);},"o",function(a){return WY(this,a);},"m",function(a){return Is(this,a);},"k",function(){return Ol(this);},"a",function(){Xu(this);}],AG,"org.netbeans.html.json.spi.FunctionBinding$AImpl$1Dispatch$$__annotations__$$",
E,[J],0,0,[],["b",function(){return Yx(this);},"a",function(){RY(this);}],HK,"java.lang.Thread$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ww(this);},"a",function(){Lr(this);}],SI,"java.lang.UnsupportedOperationException$$__annotations__$$",E,[J],0,0,[],["b",function(){return Nl(this);},"a",function(){Ot(this);}],MT,"java.nio.charset.CodingErrorAction$$__annotations__$$",E,[J],0,0,[],["b",function(){return Eb(this);},"a",function(){Sg(this);}],QQ,"java.lang.Object$2$$__annotations__$$",E,[J],0,0,
[],["b",function(){return Zj(this);},"a",function(){Io(this);}],TT,"java.nio.charset.impl.UTF8Encoder$$__annotations__$$",E,[J],0,0,[],["b",function(){return Y1(this);},"a",function(){AEB(this);}],PC,"java.io.InputStream",E,[MC],0,0,[],["a",function(){Pu(this);}],IR,"java.lang.ConsoleInputStream",PC,[],0,0,[],["a",function(){G4(this);}],DL,"java.util.Collections$19",E,[OB],0,0,[],["a",function(){Gi(this);}],AL,"java.util.Collections$12",E,[OB],0,0,[],["jB",function(a,b){return Wl(this,a,b);},"a",function(){
VAB(this);}],OQ,"java.nio.BufferOverflowException",K,[],0,0,[],["a",function(){Mz(this);}],NQ,"java.util.Map$$__annotations__$$",E,[J],0,0,[],["b",function(){return Op(this);},"a",function(){Pi(this);}],KJ,"org.teavm.platform.Platform$$__annotations__$$",E,[J],0,0,[],["b",function(){return Sv(this);},"a",function(){U7(this);}],DN,"net.java.html.charts.Chart",E,[],0,0,[],["JC",function(a,b,c,d){Tb(this,a,b,c,d);},"cH",function(){return N1(this);},"yL",function(a,b){Pa(this,a,b);},"VB",function(a){To(this,a);
},"LJ",function(a){Og(this,a);},"eE",function(a){U1(this,a);},"KB",function(){return Fv(this);},"qC",function(a,b,c){Cy(this,a,b,c);},"QI",function(){Da(this);}],OD,"java.util.Queue",E,[IB],0,0,[],[],TE,"java.util.Deque",E,[OD],0,0,[],[],QT,"java.util.Collections$1$$__annotations__$$",E,[J],0,0,[],["b",function(){return Wa(this);},"a",function(){Fl(this);}],EP,"java.util.Collections$3$$__annotations__$$",E,[J],0,0,[],["b",function(){return ZAB(this);},"a",function(){A8(this);}],II,"com.dukescript.charts.sample.BrowserMain",
E,[],0,0,[],["a",function(){Ru(this);}],ME,"org.teavm.platform.async.AsyncCallback",E,[],0,0,[],[],RQ,"org.teavm.platform.PlatformAnnotationProvider$$__annotations__$$",E,[J],0,0,[],["b",function(){return Rt(this);},"a",function(){Mg(this);}],CL,"java.util.Collections$10",O,[],0,0,[],["m",function(a){return C8(this,a);},"f",function(){return SZ(this);},"DI",function(a){Vq(this,a);}],BL,"java.util.Collections$11",O,[],0,0,[],["m",function(a){return O5(this,a);},"f",function(){return Ii(this);},"ZD",function(a,
b){NAB(this,a,b);}],LR,"java.util.logging.LogRecord$$__annotations__$$",E,[J],0,0,[],["b",function(){return Gc(this);},"a",function(){YBB(this);}],XQ,"java.lang.IllegalMonitorStateException$$__annotations__$$",E,[J],0,0,[],["b",function(){return Us(this);},"a",function(){O9(this);}],AR,"java.lang.NoClassDefFoundError",VB,[],0,0,[],["d",function(a){QAB(this,a);},"a",function(){P2(this);}],NE,"net.java.html.charts.Listeners",E,[AC],0,NE_$clinit,['GDB','Ps','Mn','EM','Bo'],["B",function(a){Yu(this,a);},"vK",function(a,
b){EM(this,a,b);}],NH,"java.lang.AbstractStringBuilder$$__annotations__$$",E,[J],0,0,[],["b",function(){return Qm(this);},"a",function(){Jd(this);}],GF,"org.netbeans.html.ko4j.KOTransfer$$__annotations__$$",E,[J],0,0,[],["b",function(){return Zn(this);},"a",function(){Wf(this);}],CM,"org.teavm.classlib.impl.CharFlow",E,[],0,0,[],["kB",function(a){Ar(this,a);}],TB,"java.lang.Enum",E,[L,N],0,0,[],["AC",function(){return Aw(this);},"kJ",function(a){return ZV(this,a);},"U",function(){return D2(this);},"MB",function()
{return QBB(this);},"c",function(){return L2(this);},"e",function(a){return UAB(this,a);},"r",function(a,b){D3(this,a,b);}],R,"java.lang.annotation.ElementType",TB,[],1,R_$clinit,['Qq','Pk','FG'],["r",function(a,b){FG(this,a,b);}],DP,"java.nio.BufferUnderflowException",K,[],0,0,[],["a",function(){N4(this);}],VJ,"java.io.FilterOutputStream$$__annotations__$$",E,[J],0,0,[],["b",function(){return Rz(this);},"a",function(){EBB(this);}],RR,"java.lang.SystemClassLoader$$__annotations__$$",E,[J],0,0,[],["b",function()
{return Nv(this);},"a",function(){Gp(this);}],YK,"org.netbeans.html.json.spi.Observers$Watcher$$__annotations__$$",E,[J],0,0,[],["b",function(){return Pe(this);},"a",function(){Gn(this);}],JD,"org.netbeans.html.json.spi.FunctionBinding",E,[],0,0,[],["a",function(){KEB(this);}],UB,"org.netbeans.html.json.spi.FunctionBinding$AImpl",JD,[],0,0,[],["xD",function(a,b,c){Na(this,a,b,c);},"nL",function(a,b){DX(this,a,b);},"SG",function(){return Iv(this);}],NR,"org.netbeans.html.json.spi.FunctionBinding$Impl",UB,[],
0,0,[],["WJ",function(){return X2(this);},"oB",function(a,b,c,d){CBB(this,a,b,c,d);}],AO,"java.util.Collections$12$$__annotations__$$",E,[J],0,0,[],["b",function(){return Lh(this);},"a",function(){I8(this);}],IQ,"java.util.MapEntry$$__annotations__$$",E,[J],0,0,[],["b",function(){return Y2(this);},"a",function(){R6(this);}],UQ,"java.lang.CharSequence$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ze(this);},"a",function(){B4(this);}],TL,"java.util.Collections$10$$__annotations__$$",E,[J],0,0,[],["b",
function(){return Lg(this);},"a",function(){Vn(this);}],IM,"com.dukescript.charts.sample.Data$Html4JavaType",IC,[],0,0,[],["mG",function(a,b,c,d){Uu(this,a,b,c,d);},"zB",function(a,b,c){Gs(this,a,b,c);},"ML",function(a,b,c){XY(this,a,b,c);},"tE",function(a){return My(this,a);},"uD",function(a,b){return Oi(this,a,b);},"kE",function(a,b){return Up(this,a,b);},"yG",function(a,b,c,d){BZ(this,a,b,c,d);},"a",function(){Qr(this);},"uH",function(a){Bk(this,a);}],GP,"java.lang.FunctionalInterface$$__annotations__$$",
E,[J],0,0,[],["b",function(){return Z3(this);},"a",function(){EX(this);}],LH,"org.teavm.jso.JSObject$$__annotations__$$",E,[J],0,0,[],["b",function(){return Y6(this);},"a",function(){R4(this);}],ZO,"java.lang.ConsoleOutputStreamStderr$$__annotations__$$",E,[J],0,0,[],["b",function(){return Nh(this);},"a",function(){N8(this);}],LJ,"java.util.NoSuchElementException$$__annotations__$$",E,[J],0,0,[],["b",function(){return We(this);},"a",function(){ZU(this);}],WM,"org.netbeans.html.json.spi.Transfer$$__annotations__$$",
E,[J],0,0,[],["b",function(){return Hy(this);},"a",function(){Pz(this);}],PN,"java.lang.CloneNotSupportedException",P,[],0,0,[],["a",function(){C7(this);}],AU,"java.lang.annotation.Target$$_impl$$__annotations__$$",E,[J],0,0,[],["b",function(){return WX(this);},"a",function(){Dd(this);}],WE,"java.lang.Long",M,[L],0,WE_$clinit,['CO','Jb','Hc','I2','Lt'],["DM",function(a){CO(this,a);},"i",function(){return WU(this);},"g",function(){return MY(this);},"YF",function(a){return AFB(this,a);},"j",function(){return Gk(this);
},"e",function(a){return Ie(this,a);},"h",function(){return Sm(this);},"c",function(){return Ky(this);}],XF,"org.netbeans.html.context.spi.Contexts$Id$$_impl$$__annotations__$$",E,[J],0,0,[],["b",function(){return Zh(this);},"a",function(){Bn(this);}],NL,"java.lang.LinkageError$$__annotations__$$",E,[J],0,0,[],["b",function(){return O4(this);},"a",function(){YZ(this);}],WD,"org.teavm.jso.dom.events.LoadEventTarget",E,[X],0,0,[],[],CH,"java.util.ArrayList$$__annotations__$$",E,[J],0,0,[],["b",function(){return Rb(this);
},"a",function(){BBB(this);}],XR,"java.lang.Appendable$$__annotations__$$",E,[J],0,0,[],["b",function(){return KDB(this);},"a",function(){P5(this);}],GO,"net.java.html.charts.Config$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ok(this);},"a",function(){Mb(this);}],JQ,"org.teavm.classlib.impl.Base46",E,[],0,0,[],["a",function(){T2(this);}],PH,"java.lang.Enum$$__annotations__$$",E,[J],0,0,[],["b",function(){return Hl(this);},"a",function(){Zv(this);}],DM,"java.util.HashMap$HashEntry$$__annotations__$$",
E,[J],0,0,[],["b",function(){return Qy(this);},"a",function(){L6(this);}],RF,"java.lang.StringBuilder",Q,[HD],0,0,[],["tK",function(a,b){return Yd(this,a,b);},"IC",function(a){return Qa(this,a);},"vF",function(a){return DY(this,a);},"XE",function(a,b){return LAB(this,a,b);},"zE",function(a,b){return HBB(this,a,b);},"oH",function(a,b){return Ex(this,a,b);},"N",function(a){FCB(this,a);},"GJ",function(a){return K1(this,a);},"dB",function(a,b){return JV(this,a,b);},"A",function(a,b,c,d){Du(this,a,b,c,d);},"rF",
function(a,b){return X6(this,a,b);},"c",function(){return Tj(this);},"t",function(){return Xh(this);},"a",function(){B8(this);},"S",function(a,b){return Wm(this,a,b);},"l",function(a){CAB(this,a);},"UG",function(a){return Cq(this,a);},"bB",function(a,b){return YDB(this,a,b);},"WI",function(a,b){return Mw(this,a,b);},"qJ",function(a){return M2(this,a);},"XC",function(a){return GX(this,a);},"H",function(a,b){return Wt(this,a,b);},"RI",function(a){return PY(this,a);},"pB",function(a,b){return Q2(this,a,b);},"G",
function(a){NCB(this,a);},"Z",function(a,b){return IY(this,a,b);}],BC,"java.lang.ClassLoader",E,[],0,BC_$clinit,['QG','Nm','T3','SK'],["RH",function(a){QG(this,a);},"a",function(){SK(this);}],IP,"java.util.ConcurrentModificationException",K,[],0,0,[],["a",function(){LBB(this);}],EL,"java.util.ServiceLoader$1$$__annotations__$$",E,[J],0,0,[],["b",function(){return S8(this);},"a",function(){EAB(this);}],IH,"org.netbeans.html.ko4j.KOTransfer",E,[BD],0,0,[],["a",function(){ZBB(this);}],LI,"org.teavm.jso.browser.Window$$__annotations__$$",
E,[J],0,0,[],["b",function(){return Nw(this);},"a",function(){BV(this);}],V,"com.dukescript.charts.sample.ChartModel",E,[],0,V_$clinit,['SEB','Yr','Xr','Bu','B3','QEB','IU','E4','UW','F3','N9','Hv','Ox','VX','Pp','RP'],["a",function(){RP(this);}],SR,"net.java.html.charts.Chart$$__annotations__$$",E,[J],0,0,[],["b",function(){return Rd(this);},"a",function(){M3(this);}],QC,"org.netbeans.html.json.spi.Observers",E,[],0,QC_$clinit,['B7','RW','Dz','C9','G7','HS'],["uM",function(a,b){Ql(this,a,b);},"eM",function(a)
{return Dw(this,a);},"a",function(){HS(this);}],KF,"java.nio.charset.impl.UTF8Charset$$__annotations__$$",E,[J],0,0,[],["b",function(){return I7(this);},"a",function(){Qe(this);}],LL,"net.java.html.charts.ChartEvent$$__annotations__$$",E,[J],0,0,[],["b",function(){return E6(this);},"a",function(){Lz(this);}],KG,"org.netbeans.html.context.spi.Contexts$Id$$__annotations__$$",E,[J],0,0,[],["b",function(){return Qs(this);},"a",function(){No(this);}],RN,"org.netbeans.html.json.spi.Proto$$__annotations__$$",E,[J],
0,0,[],["b",function(){return ZY(this);},"a",function(){Gb(this);}],OR,"org.netbeans.html.ko4j.KOSockets",E,[FD],0,0,[],["a",function(){Ep(this);}],HF,"java.lang.NullPointerException$$__annotations__$$",E,[J],0,0,[],["b",function(){return ICB(this);},"a",function(){Dl(this);}],UP,"java.lang.NoSuchMethodError",MB,[],0,0,[],["d",function(a){Ln(this,a);},"a",function(){IZ(this);}],WJ,"java.io.IOException",P,[],0,0,[],["a",function(){De(this);}],WO,"java.util.AbstractList$$__annotations__$$",E,[J],0,0,[],["b",function()
{return Gy(this);},"a",function(){RAB(this);}],KT,"org.teavm.jso.dom.events.LoadEventTarget$$__annotations__$$",E,[J],0,0,[],["b",function(){return M8(this);},"a",function(){Ae(this);}],SF,"org.teavm.jso.browser.WindowEventTarget$$__annotations__$$",E,[J],0,0,[],["b",function(){return Sb(this);},"a",function(){Xz(this);}],AK,"net.java.html.charts.Values$$__annotations__$$",E,[J],0,0,[],["b",function(){return TAB(this);},"a",function(){Sy(this);}],AI,"java.util.AbstractList$1",E,[BB],0,0,[],["q",function(){return Ia(this);
},"n",function(){return H0(this);},"Q",function(){Lo(this);},"sG",function(a){Ri(this,a);},"mB",function(){U3(this);}],OJ,"java.lang.ConsoleInputStream$$__annotations__$$",E,[J],0,0,[],["b",function(){return W7(this);},"a",function(){P1(this);}],DG,"java.util.Deque$$__annotations__$$",E,[J],0,0,[],["b",function(){return NY(this);},"a",function(){Yy(this);}],VF,"java.util.ServiceLoader$$__annotations__$$",E,[J],0,0,[],["b",function(){return L5(this);},"a",function(){T6(this);}],BP,"org.teavm.platform.plugin.AsyncCallbackWrapper$$__annotations__$$",
E,[J],0,0,[],["b",function(){return Ry(this);},"a",function(){Co(this);}],VN,"org.netbeans.html.context.impl.CtxAccssr$$__annotations__$$",E,[J],0,0,[],["b",function(){return Az(this);},"a",function(){Ei(this);}],LE,"java.util.ListIterator",E,[BB],0,0,[],[],HO,"java.lang.reflect.AnnotatedElement$$__annotations__$$",E,[J],0,0,[],["b",function(){return Kg(this);},"a",function(){E3(this);}],SN,"java.util.ServiceLoader$1",E,[BB],0,0,[],["q",function(){return Z6(this);},"n",function(){return Rf(this);},"GL",function(a)
{Ch(this,a);}],WG,"org.netbeans.html.json.impl.JSONList$$__annotations__$$",E,[J],0,0,[],["b",function(){return Eh(this);},"a",function(){Vw(this);}],VG,"java.util.Random",E,[N],0,0,[],["a",function(){BX(this);},"xL",function(){return Wv(this);}],GJ,"java.util.Set$$__annotations__$$",E,[J],0,0,[],["b",function(){return Mv(this);},"a",function(){Z5(this);}],KP,"java.nio.ByteBuffer$$__annotations__$$",E,[J],0,0,[],["b",function(){return Br(this);},"a",function(){Go(this);}],RM,"org.teavm.platform.plugin.ResourceAccessor",
E,[],0,0,[],["a",function(){KX(this);}],LO,"java.lang.AutoCloseable$$__annotations__$$",E,[J],0,0,[],["b",function(){return It(this);},"a",function(){NZ(this);}],XE,"java.lang.Short",M,[L],0,XE_$clinit,['IK','Ij','CX','He','KBB'],["j",function(){return Mo(this);},"i",function(){return IAB(this);},"e",function(a){return Cv(this,a);},"PC",function(a){IK(this,a);},"g",function(){return O0(this);},"X",function(){return Hx(this);},"CJ",function(a){return Ic(this,a);},"h",function(){return Cr(this);},"c",function()
{return In(this);}],FI,"java.lang.InstantiationException",PB,[],0,0,[],["a",function(){LDB(this);}],ZR,"java.io.Serializable$$__annotations__$$",E,[J],0,0,[],["b",function(){return D4(this);},"a",function(){Ur(this);}],OC,"org.netbeans.html.json.impl.Bindings",E,[],0,OC_$clinit,['Pw','GT','Y8','B5'],["jE",function(a,b,c,d,e){return Yh(this,a,b,c,d,e);},"xE",function(a,b,c){Rq(this,a,b,c);},"fB",function(a,b,c){GW(this,a,b,c);},"vG",function(a){GT(this,a);},"D",function(a){return Ux(this,a);},"nB",function()
{return Wi(this);},"EB",function(a){Ge(this,a);}],FC,"org.netbeans.html.context.impl.CtxAccssr",E,[],0,FC_$clinit,['Qh','DV','PG'],["a",function(){PG(this);}],JN,"net.java.html.charts.Listeners$$__annotations__$$",E,[J],0,0,[],["b",function(){return Bs(this);},"a",function(){Sr(this);}],OT,"java.lang.ThreadLocal",E,[],0,0,[],["KD",function(a){Cc(this,a);},"lB",function(){return R5(this);},"PD",function(){return T1(this);},"a",function(){S6(this);}],LP,"org.teavm.jso.dom.events.MouseEventTarget$$__annotations__$$",
E,[J],0,0,[],["b",function(){return LU(this);},"a",function(){Fs(this);}],TG,"org.netbeans.html.context.spi.Contexts$Id$$_impl",E,[YD],0,0,[],["AK",function(a){G9(this,a);},"s",function(){return Pv(this);},"rJ",function(){return FV(this);}],RC,"org.teavm.platform.PlatformRunnable",E,[],0,0,[],[],OK,"java.util.ServiceLoader",E,[CD],0,0,[],["w",function(a){Qz(this,a);},"k",function(){return Xi(this);}],AE,"org.netbeans.html.context.spi.Contexts$Provider",E,[],0,0,[],[],ZE,"org.netbeans.html.ko4j.KO4J",E,[AE],
0,ZE_$clinit,['Ta','ZK','AN'],["dD",function(a,b){Zi(this,a,b);},"KJ",function(){return Xq(this);},"JK",function(){return N7(this);},"SL",function(a){ZK(this,a);},"a",function(){AN(this);},"rG",function(){return BAB(this);}],NI,"java.lang.SecurityException$$__annotations__$$",E,[J],0,0,[],["b",function(){return HZ(this);},"a",function(){V5(this);}],RJ,"net.java.html.charts.Segment",E,[],0,0,[],["rH",function(a,b,c,d){Uv(this,a,b,c,d);},"E",function(){return Mp(this);}],ND,"java.util.Map$Entry",E,[],0,0,[],[],LD,
"java.util.MapEntry",E,[AB,ND],0,0,[],["c",function(){return Bq(this);},"pM",function(a,b){UCB(this,a,b);}],IG,"java.util.HashMap$HashEntry",LD,[],0,0,[],["pF",function(a,b){Ck(this,a,b);}],GH,"java.lang.Exception$$__annotations__$$",E,[J],0,0,[],["b",function(){return Tv(this);},"a",function(){Ed(this);}],JJ,"java.nio.charset.impl.BufferedEncoder$Controller$$__annotations__$$",E,[J],0,0,[],["b",function(){return Sj(this);},"a",function(){XX(this);}],NM,"org.netbeans.html.json.spi.FunctionBinding$Weak$$__annotations__$$",
E,[J],0,0,[],["b",function(){return PZ(this);},"a",function(){Db(this);}],TC,"java.nio.ByteBuffer",NB,[L],0,0,[],["VE",function(a){return Uy(this,a);},"e",function(a){return Jx(this,a);},"WH",function(a,b,c){return G3(this,a,b,c);},"c",function(){return VW(this);},"kK",function(a){return Dt(this,a);},"uB",function(a,b,c,d,e){Wd(this,a,b,c,d,e);}],PQ,"java.nio.ByteBufferImpl",TC,[],0,0,[],["J",function(){return Z1(this);},"KC",function(a,b,c,d,e,f,g){UZ(this,a,b,c,d,e,f,g);}],WF,"java.util.HashMap$KeyIterator",
VC,[BB],0,0,[],["v",function(a){Qt(this,a);},"n",function(){return Kn(this);}],PI,"java.lang.IllegalStateException$$__annotations__$$",E,[J],0,0,[],["b",function(){return Nf(this);},"a",function(){YAB(this);}],XM,"java.lang.ClassCastException$$__annotations__$$",E,[J],0,0,[],["b",function(){return Aj(this);},"a",function(){Im(this);}],OM,"java.nio.charset.CharsetEncoder$$__annotations__$$",E,[J],0,0,[],["b",function(){return VY(this);},"a",function(){Pr(this);}],QM,"java.lang.Object$$__annotations__$$",E,[J],
0,0,[],["b",function(){return VBB(this);},"a",function(){IEB(this);}],S,"java.util.logging.Level",E,[N],0,S_$clinit,['Mu','DS'],["c",function(){return Jl(this);},"g",function(){return PCB(this);},"r",function(a,b){DS(this,a,b);}],WP,"java.io.IOException$$__annotations__$$",E,[J],0,0,[],["b",function(){return Os(this);},"a",function(){J9(this);}],FO,"java.util.HashSet",T,[AB,N],0,0,[],["v",function(a){Y0(this,a);},"k",function(){return TBB(this);},"x",function(a){return I9(this,a);},"f",function(){return Ir(this);
},"a",function(){Ey(this);}],ML,"org.netbeans.html.json.impl.PropertyBindingAccessor$$__annotations__$$",E,[J],0,0,[],["b",function(){return Li(this);},"a",function(){TCB(this);}],EH,"org.teavm.jso.impl.JS$$__annotations__$$",E,[J],0,0,[],["b",function(){return Lc(this);},"a",function(){Bi(this);}],BT,"org.netbeans.html.json.spi.FunctionBinding$AImpl$$__annotations__$$",E,[J],0,0,[],["b",function(){return E2(this);},"a",function(){TW(this);}],FT,"java.lang.Character$$__annotations__$$",E,[J],0,0,[],["b",function()
{return Ud(this);},"a",function(){Lb(this);}],UK,"java.util.LinkedList",GD,[TE],0,0,[],["SE",function(a){Zq(this,a);},"GM",function(a){Gh(this,a);},"ZF",function(a){return An(this,a);},"TG",function(a){return Mm(this,a);},"TE",function(){return Jh(this);},"f",function(){return Ho(this);},"a",function(){CFB(this);}],BI,"net.java.html.charts.Values",E,[],0,0,[],["bH",function(a,b){Er(this,a,b);},"E",function(){return LX(this);}],IT,"com.dukescript.charts.sample.ChartModel$$__annotations__$$",E,[J],0,0,[],["b",
function(){return Qu(this);},"a",function(){J0(this);}],MG,"java.lang.Class$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ow(this);},"a",function(){CCB(this);}],AJ,"net.java.html.BrwsrCtx$1",FC,[],0,0,[],["uI",function(a){return Eq(this,a);},"jL",function(a){return Ug(this,a);},"a",function(){Cu(this);}],HH,"java.lang.StringIndexOutOfBoundsException$$__annotations__$$",E,[J],0,0,[],["b",function(){return Do(this);},"a",function(){Sk(this);}],CT,"java.lang.Short$$__annotations__$$",E,[J],0,0,[],["b",
function(){return Si(this);},"a",function(){Ss(this);}],RI,"java.nio.BufferOverflowException$$__annotations__$$",E,[J],0,0,[],["b",function(){return Wz(this);},"a",function(){Z2(this);}],RT,"com.dukescript.charts.sample.ChartModel$AddOne$$__annotations__$$",E,[J],0,0,[],["b",function(){return JAB(this);},"a",function(){Kj(this);}],MH,"java.io.InputStream$$__annotations__$$",E,[J],0,0,[],["b",function(){return Vv(this);},"a",function(){Gj(this);}],OS,"java.util.ListIterator$$__annotations__$$",E,[J],0,0,[],["b",
function(){return Mj(this);},"a",function(){Gg(this);}],DH,"java.lang.CloneNotSupportedException$$__annotations__$$",E,[J],0,0,[],["b",function(){return Tp(this);},"a",function(){S3(this);}],ZF,"java.lang.NegativeArraySizeException$$__annotations__$$",E,[J],0,0,[],["b",function(){return D8(this);},"a",function(){W6(this);}],LF,"java.lang.ClassLoader$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ua(this);},"a",function(){Te(this);}],WB,"java.lang.annotation.RetentionPolicy",TB,[],1,WB_$clinit,['I1',
'Hm','OO'],["r",function(a,b){OO(this,a,b);}],KH,"org.netbeans.html.json.impl.JSONList$1$$__annotations__$$",E,[J],0,0,[],["b",function(){return Va(this);},"a",function(){NDB(this);}],XK,"org.teavm.platform.PlatformRunnable$$__annotations__$$",E,[J],0,0,[],["b",function(){return Y7(this);},"a",function(){Ct(this);}],ZB,"java.lang.System",E,[],0,ZB_$clinit,['Vs','KAB','YJ'],["a",function(){YJ(this);}],QK,"java.util.Map$Entry$$__annotations__$$",E,[J],0,0,[],["b",function(){return Tn(this);},"a",function(){Nn(this);
}],JG,"java.lang.reflect.Array$$__annotations__$$",E,[J],0,0,[],["b",function(){return PX(this);},"a",function(){A5(this);}],BG,"java.lang.Iterable$$__annotations__$$",E,[J],0,0,[],["b",function(){return BEB(this);},"a",function(){JEB(this);}],KO,"org.netbeans.html.json.spi.Proto$2$$__annotations__$$",E,[J],0,0,[],["b",function(){return Xp(this);},"a",function(){Mx(this);}],SJ,"java.util.LinkedList$Entry",E,[],0,0,[],["a",function(){Lw(this);}],VT,"org.netbeans.html.json.impl.JSON$$__annotations__$$",E,[J],
0,0,[],["b",function(){return Iw(this);},"a",function(){Em(this);}],VO,"java.nio.Buffer$$__annotations__$$",E,[J],0,0,[],["b",function(){return FEB(this);},"a",function(){Of(this);}],ZJ,"java.util.Iterator$$__annotations__$$",E,[J],0,0,[],["b",function(){return Tx(this);},"a",function(){Ny(this);}],TD,"java.lang.Void",E,[],0,TD_$clinit,['U6','KQ'],["a",function(){KQ(this);}],CP,"org.netbeans.html.json.spi.PropertyBinding$$__annotations__$$",E,[J],0,0,[],["b",function(){return Po(this);},"a",function(){H8(this);
}],WK,"java.util.AbstractList$1$$__annotations__$$",E,[J],0,0,[],["b",function(){return Tt(this);},"a",function(){B0(this);}],KS,"java.lang.annotation.Target$$__annotations__$$",E,[J],0,0,[],["b",function(){return Sd(this);},"a",function(){W0(this);}],DR,"java.lang.StringBuilder$$__annotations__$$",E,[J],0,0,[],["b",function(){return Gt(this);},"a",function(){X1(this);}],BQ,"java.lang.Number$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ha(this);},"a",function(){Dr(this);}],RO,"java.lang.SystemClassLoader",
BC,[],0,0,[],["a",function(){Xa(this);}],XP,"org.netbeans.html.context.impl.CtxImpl$BindCompare",E,[OB],0,0,[],["jB",function(a,b){return Wr(this,a,b);},"gB",function(a){Ai(this,a);},"PJ",function(a,b){C4(this,a,b);},"sJ",function(a,b){return Eo(this,a,b);},"kH",function(a){return Wx(this,a);}],ZI,"java.util.LinkedList$$__annotations__$$",E,[J],0,0,[],["b",function(){return T7(this);},"a",function(){Ji(this);}],VL,"java.util.HashMap$1",T,[],0,0,[],["v",function(a){OEB(this,a);},"f",function(){return XZ(this);
},"k",function(){return NU(this);}],EJ,"java.util.HashMap$KeyIterator$$__annotations__$$",E,[J],0,0,[],["b",function(){return Hj(this);},"a",function(){Cj(this);}],XC,"java.lang.Double",M,[L],0,XC_$clinit,['UX','Ll','JY','VCB','Un','AQ','Xw','Sz'],["i",function(){return Ez(this);},"g",function(){return Xn(this);},"IH",function(a){return CDB(this,a);},"j",function(){return BFB(this);},"e",function(a){return FAB(this,a);},"h",function(){return ADB(this);},"c",function(){return Cd(this);},"gH",function(a){AQ(this,
a);}],NG,"org.netbeans.html.json.spi.FunctionBinding$Weak",UB,[],0,0,[],["C",function(){return Vi(this);},"oB",function(a,b,c,d){M4(this,a,b,c,d);}],OL,"org.netbeans.html.context.spi.Contexts$$__annotations__$$",E,[J],0,0,[],["b",function(){return G8(this);},"a",function(){Fh(this);}],SE,"org.teavm.jso.dom.events.MouseEventTarget",E,[X],0,0,[],[],EE,"org.teavm.jso.browser.WindowEventTarget",E,[SE,RE,WD,X,KE],0,0,[],[],RH,"org.netbeans.html.json.spi.Observers$Watcher",E,[],0,0,[],["c",function(){return HEB(this);
}],TR,"java.lang.ref.ReferenceQueue",E,[],0,0,[],["zF",function(){return L0(this);},"a",function(){LEB(this);}],HE,"org.teavm.jso.core.JSArrayReader",E,[DB],0,0,[],[],CE,"org.teavm.jso.browser.StorageProvider",E,[],0,0,[],[],XH,"org.teavm.jso.browser.Window",E,[DB,EE,HE,CE],0,0,[],[],ZN,"java.lang.annotation.Retention$$_impl$$__annotations__$$",E,[J],0,0,[],["b",function(){return B1(this);},"a",function(){O7(this);}],JF,"java.util.LinkedList$SequentialListIterator",E,[LE],0,0,[],["lM",function(a,b,c,d){Wk(this,
a,b,c,d);},"LD",function(a){Q3(this,a);},"q",function(){return Z9(this);},"n",function(){return Hg(this);},"Q",function(){Ve(this);},"mB",function(){V8(this);}],VH,"java.lang.Byte$$__annotations__$$",E,[J],0,0,[],["b",function(){return Mc(this);},"a",function(){Tz(this);}],CG,"net.java.html.js.JavaScriptResource$$__annotations__$$",E,[J],0,0,[],["b",function(){return Jt(this);},"a",function(){T0(this);}],MS,"com.dukescript.charts.sample.Data$Html4JavaType$$__annotations__$$",E,[J],0,0,[],["b",function(){return Rk(this);
},"a",function(){Yv(this);}],BM,"net.java.html.BrwsrCtx$1$$__annotations__$$",E,[J],0,0,[],["b",function(){return Qv(this);},"a",function(){Dh(this);}],FU,"java.lang.NegativeArraySizeException",K,[],0,0,[],["a",function(){Vh(this);}],LT,"java.lang.annotation.Annotation$$__annotations__$$",E,[J],0,0,[],["b",function(){return LV(this);},"a",function(){Mr(this);}],NT,"org.netbeans.html.context.spi.Contexts$Builder$$__annotations__$$",E,[J],0,0,[],["b",function(){return FDB(this);},"a",function(){ZZ(this);}],YS,
"org.netbeans.html.context.spi.Contexts$Builder",E,[],0,0,[],["w",function(a){Kb(this,a);},"tC",function(a,b,c){return Es(this,a,b,c);},"cB",function(){return Mk(this);}],FF,"java.lang.NoSuchMethodError$$__annotations__$$",E,[J],0,0,[],["b",function(){return Td(this);},"a",function(){Yq(this);}],JI,"org.teavm.jso.dom.events.KeyboardEventTarget$$__annotations__$$",E,[J],0,0,[],["b",function(){return KY(this);},"a",function(){Vc(this);}],QS,"java.nio.CharBufferImpl$$__annotations__$$",E,[J],0,0,[],["b",function()
{return Ek(this);},"a",function(){Cm(this);}],IJ,"java.lang.NumberFormatException",LB,[],0,0,[],["d",function(a){PDB(this,a);},"a",function(){Xd(this);}],JO,"org.netbeans.html.context.impl.CtxImpl$Bind",E,[],0,0,[],["c",function(){return Ja(this);},"dJ",function(a,b,c){Yc(this,a,b,c);}],ZG,"org.netbeans.html.json.spi.PropertyBinding$Weak",RB,[],0,0,[],["C",function(){return Ys(this);},"L",function(a,b,c,d,e,f){P7(this,a,b,c,d,e,f);}],UR,"org.netbeans.html.json.impl.JSONList$1",E,[Y],0,0,[],["sF",function(a)
{ZX(this,a);}],BO,"java.lang.System$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ib(this);},"a",function(){F1(this);}],VK,"org.teavm.jso.browser.StorageProvider$$__annotations__$$",E,[J],0,0,[],["b",function(){return L1(this);},"a",function(){F2(this);}],PJ,"java.io.PrintStream$$__annotations__$$",E,[J],0,0,[],["b",function(){return U8(this);},"a",function(){Fy(this);}],AF,"java.lang.Comparable$$__annotations__$$",E,[J],0,0,[],["b",function(){return Qp(this);},"a",function(){CY(this);}],ON,"net.java.html.BrwsrCtx$1Wrap$$__annotations__$$",
E,[J],0,0,[],["b",function(){return Oy(this);},"a",function(){MDB(this);}],SG,"java.lang.IllegalStateException",P,[],0,0,[],["d",function(a){Zg(this,a);},"a",function(){Iu(this);}],QI,"java.lang.Float$$__annotations__$$",E,[J],0,0,[],["b",function(){return Af(this);},"a",function(){Ec(this);}],MI,"org.netbeans.html.json.spi.PropertyBinding$AImpl$$__annotations__$$",E,[J],0,0,[],["b",function(){return Nb(this);},"a",function(){KU(this);}],MF,"java.lang.annotation.ElementType$$__annotations__$$",E,[J],0,0,[],
["b",function(){return D6(this);},"a",function(){TDB(this);}],YL,"java.lang.Object$2",E,[RC],0,0,[],["p",function(){R8(this);},"M",function(a){Rj(this,a);}],BR,"org.teavm.platform.plugin.AsyncCallbackWrapper",E,[ME],0,0,[],["TC",function(a){PAB(this,a);},"WG",function(a){UEB(this,a);},"HE",function(a){H9(this,a);}],XL,"java.lang.Object$1",E,[RC],0,0,[],["p",function(){Zt(this);},"oG",function(a,b,c,d){Nr(this,a,b,c,d);}],QO,"net.java.html.charts.Config",E,[],0,0,[],["a",function(){V2(this);}],QN,"org.teavm.classlib.impl.Base46$$__annotations__$$",
E,[J],0,0,[],["b",function(){return Oq(this);},"a",function(){L8(this);}],LS,"net.java.html.charts.ChartListener$$__annotations__$$",E,[J],0,0,[],["b",function(){return Lu(this);},"a",function(){XCB(this);}],EG,"org.netbeans.html.json.spi.Proto$Type$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ax(this);},"a",function(){EY(this);}],IF,"com.dukescript.charts.sample.Data$$__annotations__$$",E,[J],0,0,[],["b",function(){return XU(this);},"a",function(){IBB(this);}],UD,"java.lang.Byte",M,[L],0,UD_$clinit,
['ACB','Ad','D9','Bb','WN'],["j",function(){return Tg(this);},"i",function(){return Nq(this);},"e",function(a){return RU(this,a);},"g",function(){return Or(this);},"h",function(){return CV(this);},"W",function(){return Ca(this);},"c",function(){return Ft(this);},"yK",function(a){return RBB(this,a);},"GC",function(a){WN(this,a);}],FS,"java.util.HashMap$AbstractMapIterator$$__annotations__$$",E,[J],0,0,[],["b",function(){return Iq(this);},"a",function(){N5(this);}],JP,"java.util.Comparator$$__annotations__$$",
E,[J],0,0,[],["b",function(){return V3(this);},"a",function(){FBB(this);}],BE,"java.lang.annotation.Retention",E,[Z],0,0,[],[],DJ,"java.lang.annotation.Retention$$_impl",E,[BE],0,0,[],["s",function(){return Ap(this);},"EI",function(a){EZ(this,a);}],MO,"java.util.Collections$6$$__annotations__$$",E,[J],0,0,[],["b",function(){return Ke(this);},"a",function(){H5(this);}],ED,"java.util.logging.Logger",E,[],0,ED_$clinit,['Di','Jz','B2','GY','Pq','BH','Bf'],["pL",function(a,b){G6(this,a,b);},"eL",function(a,b,c){
U5(this,a,b,c);},"HJ",function(a,b){return Zu(this,a,b);},"dE",function(a){WZ(this,a);},"vE",function(a){BW(this,a);},"d",function(a){BH(this,a);}],PD,"java.util.logging.LogRecord",E,[N],0,0,[],["K",function(){return Lp(this);},"rB",function(){return Tm(this);},"JM",function(a){Yz(this,a);},"CK",function(){return Cl(this);},"dL",function(a,b){T8(this,a,b);}],ZT,"java.nio.charset.IllegalCharsetNameException$$__annotations__$$",E,[J],0,0,[],["b",function(){return H6(this);},"a",function(){Am(this);}],KL,"java.lang.Void$$__annotations__$$",
E,[J],0,0,[],["b",function(){return VDB(this);},"a",function(){F4(this);}],IL,"java.lang.IncompatibleClassChangeError$$__annotations__$$",E,[J],0,0,[],["b",function(){return U9(this);},"a",function(){Zb(this);}],ER,"java.nio.CharBufferOverArray$$__annotations__$$",E,[J],0,0,[],["b",function(){return HX(this);},"a",function(){T4(this);}],NK,"org.netbeans.html.json.spi.FunctionBinding$AImpl$1Dispatch",E,[Y],0,0,[],["gJ",function(a,b,c,d){GAB(this,a,b,c,d);},"p",function(){Al(this);}],GK,"java.lang.Throwable$$__annotations__$$",
E,[J],0,0,[],["b",function(){return K8(this);},"a",function(){Fr(this);}],EQ,"java.util.HashMap$$__annotations__$$",E,[J],0,0,[],["b",function(){return Pg(this);},"a",function(){S9(this);}],MK,"java.lang.IllegalArgumentException$$__annotations__$$",E,[J],0,0,[],["b",function(){return CW(this);},"a",function(){Fp(this);}],ZQ,"com.dukescript.charts.sample.ChartModel$AddSegment$$__annotations__$$",E,[J],0,0,[],["b",function(){return Hk(this);},"a",function(){VEB(this);}],PS,"java.util.HashMap",KB,[AB,N],0,0,[],
["l",function(a){KV(this,a);},"qK",function(a,b,c){return Sx(this,a,b,c);},"qH",function(a,b){A7(this,a,b);},"XK",function(a,b){return R0(this,a,b);},"KM",function(a){return J2(this,a);},"yF",function(a){return R1(this,a);},"TF",function(a){D0(this,a);},"IJ",function(a){return Fa(this,a);},"YK",function(){Om(this);},"CM",function(){return Bp(this);},"KG",function(a,b){return Ma(this,a,b);},"HG",function(a,b,c){return Pl(this,a,b,c);},"GG",function(){Ao(this);},"BL",function(){return QDB(this);},"f",function()
{return Yn(this);},"a",function(){Rs(this);}],JL,"java.lang.Math$$__annotations__$$",E,[J],0,0,[],["b",function(){return Df(this);},"a",function(){G0(this);}],BK,"java.lang.ref.Reference$$__annotations__$$",E,[J],0,0,[],["b",function(){return YY(this);},"a",function(){Gd(this);}],ZC,"java.nio.charset.CoderResult",E,[],0,ZC_$clinit,['Ag','FM','Mt'],["CE",function(a,b){FM(this,a,b);},"cJ",function(){return WBB(this);},"ZH",function(){return H2(this);},"c",function(){return P0(this);},"vB",function(){return VZ(this);
},"MD",function(){return A2(this);},"t",function(){return Jw(this);},"DK",function(){return A3(this);}],GR,"com.dukescript.charts.sample.ChartModel$AddOne",E,[AC],0,0,[],["B",function(a){UBB(this,a);},"R",function(a){Wh(this,a);}],NP,"java.lang.AssertionError$$__annotations__$$",E,[J],0,0,[],["b",function(){return JZ(this);},"a",function(){PV(this);}],IN,"net.java.html.charts.Chart$ChartList$$__annotations__$$",E,[J],0,0,[],["b",function(){return TX(this);},"a",function(){JBB(this);}],XB,"net.java.html.BrwsrCtx",
E,[OE],0,XB_$clinit,['V6','NV','KK','Fw','UJ','Vm'],["gC",function(a,b){KK(this,a,b);},"gB",function(a){UJ(this,a);},"AL",function(a){Rr(this,a);}],XN,"org.netbeans.html.json.spi.Technology$BatchInit$$__annotations__$$",E,[J],0,0,[],["b",function(){return Xf(this);},"a",function(){Bt(this);}],HM,"java.lang.ConsoleOutputStreamStderr",U,[],0,0,[],["O",function(a){N2(this,a);},"a",function(){R7(this);}],PL,"java.nio.ReadOnlyBufferException$$__annotations__$$",E,[J],0,0,[],["b",function(){return C3(this);},"a",
function(){Zs(this);}],PF,"net.java.html.charts.Segment$$__annotations__$$",E,[J],0,0,[],["b",function(){return JU(this);},"a",function(){VU(this);}],FH,"java.util.Collections$19$$__annotations__$$",E,[J],0,0,[],["b",function(){return E7(this);},"a",function(){Wo(this);}],CB,"java.util.Collections",E,[],0,CB_$clinit,['A4','XAB','I0','YM','Vb','Uw','Me','Fi','LZ'],["a",function(){YM(this);}],JM,"java.lang.RuntimeException$$__annotations__$$",E,[J],0,0,[],["b",function(){return Vg(this);},"a",function(){AY(this);
}],TN,"java.util.Collections$11$$__annotations__$$",E,[J],0,0,[],["b",function(){return N3(this);},"a",function(){Gz(this);}]]);
$rt_stringPool(["Can\'t enter monitor from another thread synchronously","@","$Html4JavaType","String contains digits out of radix ",": ","The value is too big for int type: ","String contains invalid digits: ","String is null or empty","Illegal radix: ","main","BIG_ENDIAN","LITTLE_ENDIAN","New position "," is outside of range [0;","]","code",":","Index","[",", ","[]","",",","websocket","Replacement preconditions do not hold","Action must be non-null","ko4j","UTF-8","IGNORE","REPLACE","REPORT","Index out of bounds",
"null","true","false"," is not subtype of ","Bar","Line","Radar","points","bars","The last char in dst "," is outside ","of array of size ","Length "," must be non-negative","Offset ",")","\\n","\\r","\\\"","\\\\","\\t","PolarArea","Pie","Already initialized","getSegmentsAtEvent","getPointsAtEvent","getBarsAtEvent","Doughnut","xhr","Can\'t compare "," to ","Class does not represent enum: ","Enum "," does not have the ","constant","ANNOTATION_TYPE","CONSTRUCTOR","FIELD","LOCAL_VARIABLE","METHOD","PACKAGE","PARAMETER",
"TYPE","pie","doughnut","polar","line","bar","radar","Months","// import net.java.html.charts.*;\n","Chart<Values, Config> chart = Chart.","createLine(","createRadar(","createBar(","new Values.Set(\"Months\", Color.valueOf(\"","\"), Color.valueOf(\"","\")));\n","chart.getData().add(new Values(\"","\", ","));\n","chart","chart.applyTo(\"chart\");\n","Chart<Segment, Config> chart = Chart.create","Doughnut();\n","Polar();\n","Pie();\n","chart.getData().add(\"",", Color.valueOf(\"","\"));\n","#4D4D4D","#5DA5DA",
"#FAA43A","#60BD68","#F17CB0","#B2912F","#B276B2","#DECF3F","#F15854","January","February","March","April","May","June","July","August","September","October","November","December","Re-entrant attempt to access ","Technology {0} does not implement ApplyId extension. Can\'t apply to {1}. Applying globally.","=","The last byte in src ","[ByteBuffer position=",", limit=",", capacity=",", mark "," is not set"," at ","OFF","SEVERE","WARNING","INFO","CONFIG","FINE","FINER","FINEST","ALL","Element can\'t be null","CLASS",
"RUNTIME","SOURCE","Watcher: ","Bind{clazz=",", impl=",", priority=","responsive","global","OVERFLOW","MALFORMED ","UNMAPPABLE ","UNDERFLOW","No browser context found. Returning empty technology!"]);
var main=MIB;
(function(){var c;c=LG.prototype;c.cast=c.XQ;c=KE.prototype;c.removeEventListener=c.YQ;c.removeEventListener=c.ZQ;c.dispatchEvent=c.aR;c.cast=c.XQ;c.addEventListener=c.bR;c.addEventListener=c.cR;c=RE.prototype;c.removeEventListener=c.YQ;c.removeEventListener=c.ZQ;c.dispatchEvent=c.aR;c.cast=c.XQ;c.addEventListener=c.bR;c.addEventListener=c.cR;c=X.prototype;c.cast=c.XQ;c=WD.prototype;c.removeEventListener=c.YQ;c.removeEventListener=c.ZQ;c.dispatchEvent=c.aR;c.cast=c.XQ;c.addEventListener=c.bR;c.addEventListener
=c.cR;c=EE.prototype;c.listenMouseOut=c.dR;c.addEventListener=c.bR;c.listenMouseEnter=c.eR;c.addEventListener=c.cR;c.listenKeyUp=c.fR;c.listenLoad=c.gR;c.neglectLoad=c.hR;c.removeEventListener=c.YQ;c.listenMouseDown=c.iR;c.listenFocus=c.jR;c.neglectKeyDown=c.kR;c.removeEventListener=c.ZQ;c.listenDoubleClick=c.lR;c.neglectFocus=c.mR;c.neglectMouseLeave=c.nR;c.listenKeyDown=c.oR;c.neglectKeyPress=c.pR;c.listenBlur=c.qR;c.cast=c.XQ;c.listenKeyPress=c.rR;c.neglectMouseEnter=c.sR;c.neglectMouseUp=c.tR;c.listenMouseOver
=c.uR;c.listenMouseLeaeve=c.vR;c.neglectMouseOut=c.wR;c.listenClick=c.xR;c.dispatchEvent=c.aR;c.listenMouseUp=c.yR;c.neglectMouseOver=c.zR;c.neglectKeyUp=c.AR;c.neglectDoubleClick=c.BR;c.neglectClick=c.CR;c.neglectMouseDown=c.DR;c.neglectBlur=c.ER;c=XH.prototype;c.listenMouseOut=c.dR;c.addEventListener=c.bR;c.listenMouseEnter=c.eR;c.neglectHashChange=c.FR;c.addEventListener=c.cR;c.listenKeyUp=c.fR;c.listenLoad=c.gR;c.neglectLoad=c.hR;c.removeEventListener=c.YQ;c.listenMouseDown=c.iR;c.listenFocus=c.jR;c.neglectKeyDown
=c.kR;c.listenMessage=c.GR;c.removeEventListener=c.ZQ;c.listenDoubleClick=c.lR;c.neglectFocus=c.mR;c.neglectMouseLeave=c.nR;c.listenKeyDown=c.oR;c.neglectKeyPress=c.pR;c.listenBlur=c.qR;c.neglectMessage=c.HR;c.listenHashChange=c.IR;c.cast=c.XQ;c.listenKeyPress=c.rR;c.neglectMouseEnter=c.sR;c.neglectMouseUp=c.tR;c.getLength=c.JR;c.listenMouseOver=c.uR;c.listenMouseLeaeve=c.vR;c.neglectMouseOut=c.wR;c.listenClick=c.xR;c.neglectBeforeOnload=c.KR;c.dispatchEvent=c.aR;c.listenMouseUp=c.yR;c.neglectMouseOver=c.zR;c.neglectKeyUp
=c.AR;c.neglectDoubleClick=c.BR;c.listenBeforeOnload=c.LR;c.get=c.MR;c.neglectClick=c.CR;c.neglectMouseDown=c.DR;c.neglectBlur=c.ER;c=SE.prototype;c.removeEventListener=c.YQ;c.removeEventListener=c.ZQ;c.dispatchEvent=c.aR;c.cast=c.XQ;c.addEventListener=c.bR;c.addEventListener=c.cR;c=HE.prototype;c.cast=c.XQ;})();
main = $rt_mainStarter(main);
