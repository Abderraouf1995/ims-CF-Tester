const fs = require("fs");
const _ = require('lodash');

const sep = "-";
const ret = "\n";

function logCf(testCase, confiFile, execTime, res) {
    let log = "";
    let dt = new Date(_.now());
    log += ret + _.repeat(sep, 80);
    log += ret + testCase.name;
    log += ret + _.repeat(sep, 80);
    log += ret + "Custom function()";
    log += ret + " Started : " + dt.toLocaleString();
    log += ret + " .methodName = " + confiFile.scriptName + "." + testCase.method;
    log += ret + " .inArgs (length = " + testCase.args.length + ")";
    for (var i = 0; i < testCase.args.length; i++) {
        log += ret + _.padEnd(" .inArgs[" + i.toString() + "]", 5) + " = " + testCase.args[i];
    }
    log += ret + " Finished in " + execTime + " ms.";
    log += ret + _.repeat(sep, 80);
    log += ret + "Result_customFunction" + ret + execTime + " ms.";
    log += ret + " .return_value = " + res.return_value;
    log += ret + " .outArgs (length = " + res.outArgs.length + ")";
    for (var i = 0; i < res.outArgs.length; i++) {
        log += ret + _.padEnd(" .outArgs[" + i.toString() + "]", 5) + " = " + res.outArgs[i];
    }
    log += ret + " .customErrorString = " + res.customErrorString;
    log += ret + _.repeat(sep, 80);
    console.log(log);
}

let result = {
    "return_value": 0,
    "outArgs": [
        "out1",
        "out2"
    ],
    "customErrorString": ""


}

let cf = {
    "clusterNode": "http://localhost:8080/mes",
    "sessionId": 3768194748206326,
    "scriptName": "myCF9",
    "scriptFile": "myScriptTest.js",
    "defaultStation": "01010010",
    "userId": "admin",
    "userPw": "admin",
    "client": "01",
    "sysIdentifier": "VSC Test",
    "majorVersion": 1,
    "minorVersion": -1,
    "upload": true,
    "test": true
}
let tc = {

    "scenario": 1,
    "name": "Use case 1 : Check flow 1",
    "method": "getInfo",
    "args": [
        "{ \"stationNumber\": \"123 - hello team 3\", \"errorCode\": 0, \"errorMessage\": \"\" }"
    ]

};
