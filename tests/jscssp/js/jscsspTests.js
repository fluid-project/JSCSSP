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
    
    var parseSheet = function (text, numRules) {
        var parser = new CSSParser();
        var parsedSheet = parser.parse(text, false, true);
        var rules = parsedSheet.cssRules;
        equals(rules.length, numRules, "There should be " + numRules + " rules in the parsed text.");
        return rules;
    };
    
    test("Parse rule with class and element selector", function () {
        var rules = parseSheet(cssText, 1);
        var rule = rules[0];
        equals(rule.error, undefined, "The rule should not have an error.");
        equals(rule.mSelectorText, ".cat span", "The rule should have the correct selector.");
    });
    
    
    test("Parse a sheet that contains urls", function () {
        var sheetWithUrls = 
            ".cat { background-image: url('cats.png'); }" +
            ".dog { background: url('dog.png'); }" + 
            ".hamster { content: url('hamster.png'); }" + 
            ".cow { cue-after: url('cow.mp3'); }" + 
            ".sheep { cue: url('sheep.mp3'); }" + 
            ".goat { cue-before: url('goat.mp3'); }" + 
            ".lizard { cursor: url('lizard.png'); }" + 
            ".fish { list-style-image: url('fish.png'); }" + 
            ".snake { list-style: url('snake.png'); }" + 
            ".snail { play-during: url('snail.mp3'); }" +
            ".penguin { background-image: url(penguin.png); }" +
            ".mouse { background-image: url('../mouse.png'); }" +
            ".turtle { background-image: url(\"turtle.png\"); }" +
            ".opossum { background-image: url( 'opossum.png' ); }" +
            ".racoon { background-image: url('http://racoons.ca/racoon.png'); }";
        
        
        var rules = parseSheet(sheetWithUrls, 15);

        var checkUrl = function (rule, expectedUrl, declIndex) {
            declIndex = declIndex || 0;
            equals(rule.error, undefined, "The rule should not have an error.");
            equals(rule.declarations[declIndex].values[0].url, expectedUrl, "The rule should have the correct url.");            
        };
        
        checkUrl(rules[0], "cats.png");
        checkUrl(rules[1], "dog.png", 1);   // Maintenance hazard - I know that the url declaration will be the second declaration
        checkUrl(rules[2], "hamster.png");
        checkUrl(rules[3], "cow.mp3");
        checkUrl(rules[4], "sheep.mp3");
        checkUrl(rules[5], "goat.mp3");
        checkUrl(rules[6], "lizard.png");
        checkUrl(rules[7], "fish.png");
        checkUrl(rules[8], "snake.png", 2);  // Maintenance hazard - I know that the url declaration will be the third declaration
        checkUrl(rules[9], "snail.mp3");
        checkUrl(rules[10], "penguin.png");
        checkUrl(rules[11], "../mouse.png");
        checkUrl(rules[12], "turtle.png");
        checkUrl(rules[13], "opossum.png");
        checkUrl(rules[14], "http://racoons.ca/racoon.png");
        
    });
    
})();
