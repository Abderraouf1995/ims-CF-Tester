# ims-api-9-20 README

This extension manage testing of ims-api-9-20 Custom Function Script in Visual Studio Code.

# Configuration

Example : cfconfig.json

    {
        "clusterNode": "http://localhost:8080/mes",
        "sessionId": 3768194748206326,
        "scriptName": "myCF",
        "scriptFile": "myScriptFile.js",
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

# Scenarios configuration

Example : cfscenarios.json

    {
        "project": "project name",
        "description": "",
        "default": {
            "scenario": "default",
            "name": "default test",
            "method": "methodName",
            "args": [
                "{ \"stationNumber\": \"123\", \"errorCode\": 0, \"errorMessage\": \"\" }"
            ]
        },
        "scenarios": [
            {
                "scenario": 1,
                "name": "Use case 1 : Check flow 1",
                "method": "getInfo",
                "args": [
                    "{ \"stationNumber\": \"123\", \"errorCode\": 0, \"errorMessage\": \"\" }"
                ]
            },
            {
                "scenario": 2,
                "name": "Use case 2 : Check flow 2",
                "method": "getInfo",
                "args": [
                    "{ \"stationNumber\": \"123\", \"errorCode\": 0, \"errorMessage\": \"\" }"
                ]
            }
        ]
    }

### 1.0.0

Initial release of CF Tester

### 1.0.1

Update : 03/10/2020 by Faouzi Ben Mabrouk
Add upload option in configuration
Add test option in configuration

**Enjoy!**
