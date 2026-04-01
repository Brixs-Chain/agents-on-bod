import solc from 'solc';

/** 
 * Verifying Compiler Wrapper 
 * ensures the remediated code compiles and is valid 
 */
export async function verifyContract(code: string): Promise<any> {
    console.log("📡 Solidity Compiler: Compiling contract...");
    
    const input = {
        language: 'Solidity',
        sources: {
            'Contract.sol': {
                content: code
            }
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['*']
                }
            }
        }
    };

    try {
        const output = JSON.parse(solc.compile(JSON.stringify(input)));
        
        if (output.errors) {
            const errors = output.errors.filter((e: any) => e.severity === 'error');
            const warnings = output.errors.filter((e: any) => e.severity === 'warning');
            
            if (errors.length > 0) {
                return {
                    success: false,
                    errors: errors.map((e: any) => ({
                        message: e.formattedMessage,
                        severity: 'error',
                        line: e.sourceLocation?.start || 0
                    })),
                    warnings: warnings.map((e: any) => ({
                        message: e.formattedMessage,
                        severity: 'warning'
                    }))
                };
            }
        }

        // Compilation successful
        const contractName = Object.keys(output.contracts['Contract.sol'])[0];
        const contract = output.contracts['Contract.sol'][contractName];

        return {
            success: true,
            contractName,
            bytecode: contract.evm.bytecode.object,
            abi: contract.abi,
            compilerVersion: "0.8.25",
            gasEstimates: contract.evm.gasEstimates,
            warnings: output.errors ? output.errors.filter((e: any) => e.severity === 'warning').map((e: any) => e.formattedMessage) : []
        };
    } catch (error: any) {
        console.error("Compiler crashed:", error);
        return {
            success: false,
            errors: [{ message: error.message || "Unknown compiler error", severity: 'error' }]
        };
    }
}
