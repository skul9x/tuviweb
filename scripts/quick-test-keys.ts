
/**
 * Quick Test: API Key Parsing Logic
 * This mimics how the Vercel function splits the keys to ensure no errors.
 */

const testParsing = (keysString: string) => {
    console.log("Input string:", JSON.stringify(keysString));
    const keys = keysString.split(/[,\n]+/).map(k => k.trim()).filter(k => k.length > 5);
    console.log("Parsed keys count:", keys.length);
    keys.forEach((k, i) => console.log(`Key ${i+1}: ${k.substring(0, 8)}...`));
    return keys;
};

// Case 1: The keys the user provided (with newlines and commas)
const userKeys = `AIzaSyDj2xrepITb1Yceu2hVpmzLvXVozm52Tvg, AIzaSyAfRfOJSDKazhhe7t4qfvD-9DB9cBKZPoM, AIzaSyDT2rDPCoL06b_0oe5gwNVz7rSi9ZDrEHc
AIzaSyApabr7XT6mUI4CV5gZfXW7umIzgApsZvs, AIzaSyCD8dZaZxx5CU3IUqYl2p6BJf2sFjMCq_M`;

console.log("--- Testing User Provided Format ---");
const result1 = testParsing(userKeys);

if (result1.length === 5) {
    console.log("\n✅ SUCCESS: Correctly parsed 5 keys from the messy string!");
} else {
    console.log("\n❌ FAIL: Expected 5 keys, but found " + result1.length);
}
