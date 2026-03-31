import { OnboardingAgent } from '../core/OnboardingAgent.js';

async function main() {
    console.log("========================================");
    console.log("   BRIXS AGENT ONBOARDING SEQUENCE");
    console.log("========================================");
    
    const result = await OnboardingAgent.onboardingSystem();
    
    if (result.success) {
        console.log("\n✅ SUCCESS: " + result.status);
        console.log("\nThe Brixs Autonomous Security Agent is now LIVE.");
        console.log("You can now start auditing contracts via the /api/audit endpoint.");
    } else {
        console.log("\n❌ FAILED: Agent onboarding could not be completed.");
    }
    
    console.log("========================================");
}

main().catch(err => {
    console.error("Fatal onboarding error:", err);
    process.exit(1);
});
