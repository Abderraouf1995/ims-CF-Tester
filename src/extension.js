const vscode = require("vscode");
const fs = require("fs");
const axios = require("axios").default;
const _ = require('lodash');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';



/**
 * @param {vscode.ExtensionContext} context
 */

async function activate(context) {
	console.log('Congratulations, your extension "ims" is now active!');

	var imsUrl;
	var params;
	let outputc = vscode.window.createOutputChannel("output");



	let disposable = vscode.commands.registerCommand("ims.execute", async function () {

		outputc.show();
		outputc.appendLine("I am a banana.");

		const folderPath = vscode.workspace.rootPath;
		try {
			var configFile = JSON.parse(fs.readFileSync(folderPath + "\\cfconfig.json", "utf8"));
			var cfScenarios = JSON.parse(fs.readFileSync(folderPath + "\\cfscenarios.json", "utf8"));

			params = new getConfig(configFile);
			if (params.clusterNode) {
				imsUrl = params.clusterNode;
			}
			else {
				imsUrl = null;
			}
		} catch (e) {
			console.log("Config files error!");
		}

		const sessionContext = {
			sessionId: params.sessionId,
			persId: 1,
			locale: "en_US"
		}

		vscode.window.showInformationMessage("Executing the custom function! ");


		var filePath = folderPath + "\\js\\" + params.scriptFile;
		console.log("Script path : " + filePath);
		let content = await getFileByteArray(filePath);

		if (configFile.upload) {
			let upload = await uploadCF(imsUrl, params, sessionContext, content);
			console.log(upload);
		}

		if (configFile.test) {

			let testCase = cfScenarios.default;
			let startTime = _.now();
			let executeDefault = await executeCF(imsUrl, params, sessionContext, testCase.method, testCase.args);
			let res = executeDefault.data.result;
			let execTime = _.now() - startTime;
			logCf(testCase, configFile, execTime, res);

			var scenarios = cfScenarios.scenarios;
			for (var k = 0; k < scenarios.length; k++) {
				let sce = scenarios[k];
				startTime = _.now();
				let executeScenario = await executeCF(imsUrl, params, sessionContext, sce.method, sce.args);
				res = executeScenario.data.result;
				execTime = _.now() - startTime;
				logCf(sce, configFile, execTime, res);
			}
		}



	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;


async function uploadCF(url, params, sessionContext, content) {

	var utcSec = Date.now();
	var data = {
		sessionContext: sessionContext,
		stationNumber: params.defaultStation = "01010010",
		mdaValues: [
			{ key: "INFO", value: "vsc" },
			{ key: "MDA_GROUP_PATH", value: "" },
			{ key: "MDA_ACTIVE", value: 1 },
			{ key: "MDA_DESC", value: "vsc" },
			{ key: "MDA_MAJOR_VERSION", value: params.majorVersion },
			{ key: "MDA_FILE_NAME", value: params.scriptFile },
			{ key: "MDA_MINOR_VERSION", value: params.minorVersion },
			{ key: "MDA_NAME", value: params.scriptName },
			{ key: "MDA_STATUS", value: 2 },
			{ key: "MDA_VERSION_DESC", value: "vsc - " + utcSec },
			{ key: "MDA_VERSION_NAME", value: "vsc - " + utcSec },
		],
		content: content
	};

	console.log("Uploading CF script...");

	return await axios({
		method: "post",
		url: url + "/imsapi/rest/actions/mdaUploadCustomFunction",
		data: data
	})
		.then((result) => {
			console.log("HTTP status : " + result.status);
			console.log("Upload success : " + data.content.length + " byte(s) - v" + params.majorVersion + "." + params.minorVersion);
		}).catch((error) => {
			console.error("Upload error");
		});

}

async function executeCF(url, params, sessionContext, method, inargs) {


	var data = {
		sessionContext: sessionContext,
		methodName: params.scriptName + "." + method,
		inArgs: inargs
	};

	console.log("Executing CF script...");

	return await axios({
		method: "post",
		url: url + "/imsapi/rest/actions/customFunction",
		data: data
	})
		.then(response => {
			console.log("HTTP status : " + response.status);
			return response;
		}).catch(error => {
			console.error("Not executed");
			throw error;
		});

}

async function getByteArray(filePath) {
	var fileData = [];

	fs.open(filePath, 'r', function (err, fd) {
		if (err)
			throw err;
		var buffer = new Buffer(1);
		while (true) {
			var num = fs.readSync(fd, buffer, 0, 1, null);
			if (num === 0) break;
			fileData.push(buffer[0]);
		}
	});
	return fileData;
}

async function getFileByteArray(filePath) {
	return new Promise((resolve, reject) => {
		var fileData = [];
		fs.open(filePath, 'r', function (err, fd) {
			if (err) reject(err);
			var buffer = new Buffer(1);
			while (true) {
				var num = fs.readSync(fd, buffer, 0, 1, null);
				if (num === 0) break;
				fileData.push(buffer[0]);
			}
			resolve(fileData);
		});
	})


}


function deactivate() { }

function getConfig(configFile) {
	this.clusterNode = configFile.clusterNode;
	this.sessionId = configFile.sessionId;
	this.scriptName = configFile.scriptName;
	this.scriptFile = configFile.scriptFile;
	this.defaultStation = configFile.defaultStation;
	this.userId = configFile.userId;
	this.userPw = configFile.userPw;
	this.client = configFile.client;
	this.sysIdentifier = configFile.sysIdentifier;
	this.majorVersion = configFile.majorVersion;
	this.minorVersion = configFile.minorVersion;
	this.upload = configFile.upload;
	this.test = configFile.test;
}

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
	log += ret + "Result_customFunction";
	log += ret + " .return_value = " + res.return_value;
	log += ret + " .outArgs (length = " + res.outArgs.length + ")";
	for (var i = 0; i < res.outArgs.length; i++) {
		log += ret + _.padEnd(" .outArgs[" + i.toString() + "]", 5) + " = " + res.outArgs[i];
	}
	log += ret + " .customErrorString = " + res.customErrorString;
	log += ret + _.repeat(sep, 80) + ret;
	console.log(log);
	const folderPath = vscode.workspace.rootPath;
	const outFile = folderPath + "\\" + "result.out";
	fs.appendFile(outFile, log, function (err) {
		if (err) throw err;
		console.log('Result log updated.');
	});
}






module.exports = {
	activate,
	deactivate,
};
