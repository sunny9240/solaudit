'use strict';
/** 
 * @author nanasunny
 * @license GPLv3
 * 
 * 
 * */

const settings = require('../../settings');
const mod_symbols = require('../symbols');

const stateMutabilityToIcon = {
    view:"🔍",
    pure:"🔍",
    constant:"🔍",
    payable:"💰"
};

const functionVisibility = { 
    "public": '+',
    "external": '+',  //~
    "internal": '#',  //mapped to protected; ot
    "private": '-' ,  
    "default": '+' // public
};
const variableVisibility = { 
    "public": '+',
    "external": '+',  //~
    "internal": '#',  //mapped to protected; ot
    "private": '-' ,  
    "default": "#"  // internal
};
const contractNameMapping = {
    "contract":"class",
    "interface":"interface",
    "library":"abstract"
};

function _mapAstFunctionName(name) {
    switch(name) {
        case null:
            return "**__constructor__**";
        case "":
            return "**__fallback__**";
        default:
            return name;
    }
}

class PlantumlWriter {

    export(contractObjects) {
        
        let content = `@startuml
'
' -- for auto-render install: https://marketplace.visualstudio.com/items?itemName=jebbs.plantuml
' -- options --
${settings.extensionConfig().uml.options}
${settings.extensionConfig().uml.actors.enable ? "allowmixing": ""}

' -- classes --
`;

        content += contractObjects.reduce((umlTxt, contractObj) => {

            return umlTxt + `\n
${contractNameMapping[contractObj._node.kind] || "class"} ${contractObj.name} {
    ' -- inheritance --
${Object.values(contractObj.dependencies).reduce((txt, name) => {
        return txt + `\t{abstract}${name}\n`;
    },"")
}
    ' -- usingFor --
${Object.values(contractObj.usingFor).reduce((txt, astNode) => {
        return txt + `\t{abstract}📚${astNode.libraryName} for [[${mod_symbols.getVariableDeclarationType(astNode)}]]\n`;
    },"")
}
    ' -- vars --
${Object.values(contractObj.stateVars).reduce((umlSvarTxt, astNode) => {
        return umlSvarTxt + `\t${variableVisibility[astNode.visibility] || ""}${astNode.isDeclaredConst?"{static}":""}[[${mod_symbols.getVariableDeclarationType(astNode).replace(/\(/g,"").replace(/\)/g,"")}]] ${astNode.name}\n`;
    }, "")
}
    ' -- methods --
${contractObj.functions.reduce((umlFuncTxt, funcObj) => {
        return umlFuncTxt + `\t${functionVisibility[funcObj._node.visibility] || ""}${stateMutabilityToIcon[funcObj._node.stateMutability]||""}${_mapAstFunctionName(funcObj._node.name)}()\n`;
    }, "")
}
}
`;
}, "");

        content += "' -- inheritance / usingFor --\n" + contractObjects.reduce((umlTxt, contractObj) => {
            return umlTxt
                + Object.values(contractObj.dependencies).reduce((txt, name) => {
                    return txt + `${contractObj.name} --[#DarkGoldenRod]|> ${name}\n`;
                }, "")
                +  Object.values(contractObj.usingFor).reduce((txt, astNode) => {
                    return txt + `${contractObj.name} ..[#DarkOliveGreen]|> ${astNode.libraryName} : //for ${mod_symbols.getVariableDeclarationType(astNode)}//\n`;
                }, "");
        }, "");


        if(settings.extensionConfig().uml.actors.enable){
            //lets see if we can get actors as well :)

            let addresses = [];

            for (let contractObj of contractObjects) {
                addresses = addresses.concat(Object.values(contractObj.stateVars).filter(astNode => !astNode.isDeclaredConst && astNode.typeName.name =="address").map(astNode => astNode.name));
                for (let functionObj of contractObj.functions){
                    addresses = addresses.concat(Object.values(functionObj.arguments).filter(astNode => astNode.typeName.name =="address").map(astNode => astNode.name));
                }
            }

            let actors = [...new Set(addresses)];
            actors = actors.filter( item => {
                if (item === null) {
                    return false;
                }  // no nulls
                if (item.startsWith("_") && actors.indexOf(item.slice(1))) {
                    return false;
                }  // no _<name> dupes
                return true; 
                });

            content += `
' -- actors --
together {
${actors.reduce((txt, name) => txt + `\tactor ${name}\n`, "")}
}
`;
        }

        content += "\n@enduml";
        return content;
    }
}


module.exports = {
    PlantumlWriter:PlantumlWriter
};
