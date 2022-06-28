# Sol Audit

- Output audit report including contract description graph, inheritance, function signature. 
- Advanced Solidity Language Support
- Source Exploration

##### Syntax Highlighting

- **access modifiers** (`external`, `public`, `payable`, ...)
- security relevant built-ins, globals, methods and user/miner-tainted information (`address.call()`, `tx.origin`, `msg.data`, `block.*`, `now`)
- storage access modifiers (`memory`, `storage`)
- developer notes in comments (`TODO`, `FIXME`, `HACK`, ...)
- custom function modifiers
- contract creation / event invocations
- easily differentiate between arithmetics vs. logical operations
- make **Constructor** and **Fallback** function more prominent

##### Semantic Highlighting

- highlights **StateVars** (constant, inherited)
- detects and alerts about StateVar shadowing
- highlights **function arguments** in the function body
