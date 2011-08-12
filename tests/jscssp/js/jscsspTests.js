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

    var parsedSheet, rules;
    
    var parseSheet = function (text, numRules) {
        var parser = new CSSParser();
        parsedSheet = parser.parse(text, false, true);
        rules = parsedSheet.cssRules;
        equals(rules.length, numRules, "There should be " + numRules + " rules in the parsed text.");
        return rules;
    };
    
    test("Parse rule with class and element selector", function () {
        var cssText = ".cat span { font-size: 24px; }";
        parseSheet(cssText, 1);
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
            ".chipmunk { background-image: url('../images/chipmunk.png'); }" +
            ".turtle { background-image: url(\"turtle.png\"); }" +
            ".opossum { background-image: url( 'opossum.png' ); }" +
            ".racoon { background-image: url('http://racoons.ca/racoon.png'); }" +
            ".squirrel { background-image: url('http://squirrel.ca'); }" +
            ".beerWolf { cursor: url('/beerWolf.png'); }";
        
        
        parseSheet(sheetWithUrls, 18);

        var checkUrl = function (rule, expectedUrl, declIndex) {
            declIndex = declIndex || 0;
            equals(rule.error, undefined, "The rule should not have an error.");
            var value = rule.declarations[declIndex].values[0];
            equals(value.url, expectedUrl, "The rule should have the correct url.");
            equals(value.value, "url('" + expectedUrl + "')", "The rule should also have the correct value.");
            equals(value.cssText(), value.value, "CSSText should be the same as the value");
        };
        
        checkUrl(rules[0], "cats.png");
        checkUrl(rules[1], "dog.png", 1);   // Maintenance hazard - I know that the url declaration will be the second declaration
        checkUrl(rules[2], "hamster.png");
        checkUrl(rules[3], "cow.mp3");
        checkUrl(rules[4], "sheep.mp3");
        checkUrl(rules[4], "sheep.mp3", 1);
        checkUrl(rules[5], "goat.mp3");
        checkUrl(rules[6], "lizard.png");
        checkUrl(rules[7], "fish.png");
        checkUrl(rules[8], "snake.png", 2);  
        checkUrl(rules[9], "snail.mp3");
        checkUrl(rules[10], "penguin.png");
        checkUrl(rules[11], "../mouse.png");
        checkUrl(rules[12], "../images/chipmunk.png");
        checkUrl(rules[13], "turtle.png");
        checkUrl(rules[14], "opossum.png");
        checkUrl(rules[15], "http://racoons.ca/racoon.png");
        checkUrl(rules[16], "http://squirrel.ca");
        checkUrl(rules[17], "/beerWolf.png");
        
    });
    
    test("Modify a parsed url", function () {
        var sheet = ".cat { background-image: url('cats.png'); }";
        var expectedUrl = "../../cats.png";
        parseSheet(sheet, 1);
        var value = rules[0].declarations[0].values[0];
        equals(value.value, "url('cats.png')", "The rule should have the correct value.");
        equals(value.cssText(), value.value, "CSSText and value are the same");

        value.url = expectedUrl;
        equals(value.value, "url('cats.png')", "oddly the value remains the same - do we really want this?");
        equals(value.cssText(), "url('" + expectedUrl + "')" , "CSSText has been modified");
        
    });
})();
