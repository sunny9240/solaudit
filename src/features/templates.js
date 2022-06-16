'use strict';
/** 
 * @author github.com/tintinweb
 * @license GPLv3
 * 
 * 
 * */

const vscode = require('vscode');

function generateUnittestStubForContract(document, g_workspace, contractName){
    let contract = {
        name: contractName,
        path: document.uri.fsPath
    };

    if(!contractName){
        //take first
        let sourceUnit = g_workspace.get(document.uri.fsPath);
        if(!sourceUnit || Object.keys(sourceUnit.contracts).length<=0){
            vscode.window.showErrorMessage(`[Solidity VA] unable to create unittest stub for current contract. missing analysis for source-unit: ${document.uri.fsPath}`);
            return;
        }

        contract.name = Object.keys(sourceUnit.contracts)[0];
    }
    
    let content = `
/**
 * 
 * autogenerated by solidity-visual-auditor
 * 
 * execute with: 
 *  #> truffle test <path/to/this/test.js>
 * 
 * */
var ${contract.name} = artifacts.require("${contract.path}");

contract('${contract.name}', (accounts) => {
    var creatorAddress = accounts[0];
    var firstOwnerAddress = accounts[1];
    var secondOwnerAddress = accounts[2];
    var externalAddress = accounts[3];
    var unprivilegedAddress = accounts[4]
    /* create named accounts for contract roles */

    before(async () => {
        /* before tests */
    })
    
    beforeEach(async () => {
        /* before each context */
    })

    it('should revert if ...', () => {
        return ${contract.name}.deployed()
            .then(instance => {
                return instance.publicOrExternalContractMethod(argument1, argument2, {from:externalAddress});
            })
            .then(result => {
                assert.fail();
            })
            .catch(error => {
                assert.notEqual(error.message, "assert.fail()", "Reason ...");
            });
        });

    context('testgroup - security tests - description...', () => {
        //deploy a new contract
        before(async () => {
            /* before tests */
            const new${contract.name} =  await ${contract.name}.new()
        })
        

        beforeEach(async () => {
            /* before each tests */
        })

        

        it('fails on initialize ...', async () => {
            return assertRevert(async () => {
                await new${contract.name}.initialize()
            })
        })

        it('checks if method returns true', async () => {
            assert.isTrue(await new${contract.name}.thisMethodShouldReturnTrue())
        })
    })
});
`;
    return content;
}


function generateHardhatUnittestStubForContract(document, g_parser, contractName){
    let contract = {
        name: contractName,
        path: document.uri.fsPath
    };

    if(!contractName){
        //take first
        let sourceUnit = g_parser.sourceUnits[document.uri.fsPath];
        if(!sourceUnit || Object.keys(sourceUnit.contracts).length<=0){
            vscode.window.showErrorMessage(`[Solidity VA] unable to create hardhat-unittest stub for current contract. missing analysis for source-unit: ${document.uri.fsPath}`);
            return;
        }

        contract.name = Object.keys(sourceUnit.contracts)[0];
    }
    
    let content = `
/**
 * 
 * autogenerated by solidity-visual-auditor
 * 
 * execute with: 
 *  #> npx hardhat test <path/to/this/test.js>
 * 
 * */
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Artifact } from "hardhat/types";
import { Signers } from "../types";
import hre from "hardhat";
import "@nomiclabs/hardhat-waffle";
import { ethers } from "hardhat";
import { chai, expect } from "chai";
const { deployContract } = hre.waffle;

var ${contract.name} = await hre.artifacts.readArtifact("${contract.path}");

describe('${contract.name}', () => {

  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: before, beforeEach, after, afterEach.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // before and beforeEach callbacks.

  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;
    
  /* create named accounts for contract roles */

    before(async () => {
        /* before tests */
        this.signers = {} as Signers;
        const signers: SignerWithAddress[] = await hre.ethers.getSigners();
        this.signers.admin = signers[0];
    })
    
    beforeEach(async () => {
        /* before each context */
    })

    it('should revert if ...', () => {
        //Using .deploy() on artifact loaded (using ethers library)
        return ${contract.name}.deploy()
            .then(instance => {
                return instance.publicOrExternalContractMethod(argument1, argument2, {from:externalAddress});
            })
            .then(result => {
                assert.fail();
            })
            .catch(error => {
                assert.notEqual(error.message, "assert.fail()", "Reason ...");
            });
        });

    context('testgroup - security tests - description...', () => {
        //deploy a new contract
        before(async () => {
            /* before tests */
            const new${contract.name} =  await ${contract.name}.new()
        })
        

        beforeEach(async () => {
            /* before each tests */
        })

        

        it('fails on initialize ...', async () => {
            return assertRevert(async () => {
                await new${contract.name}.initialize()
            })
        })

        it('checks if method returns true', async () => {
            assert.isTrue(await new${contract.name}.thisMethodShouldReturnTrue())
        })
    })
});
`;
    return content;
}

module.exports = {
    generateUnittestStubForContract:generateUnittestStubForContract,
    generateHardhatUnittestStubForContract:generateHardhatUnittestStubForContract
};

    

    

    