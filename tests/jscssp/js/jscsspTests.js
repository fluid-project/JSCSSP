/*
Copyright 2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global expect, start*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function () {
    var cssText = ".cat span { font-size: 24px; }";
    
    test("Parse rule with class and element selector", function () {
        var parser = new CSSParser();
        var parsedSheet = parser.parse(cssText, false, true);
        var rules = parsedSheet.cssRules;
        equals(rules.length, 1, "There should be one parsed CSS rule.");
            
        var rule = rules[0];
        equals(rule.error, undefined, "The rule should not have an error.");
        equals(rule.mSelectorText, ".cat span", "The rule should have the correct selector.");
    });
})();
