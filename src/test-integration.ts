import { TuViLogic } from './core/tuvi-logic';
import { AIService } from './utils/AIService';
import { SupabaseService } from './utils/SupabaseService';
import { Gender, ReadingStyle, ViewingMode } from './types';

// Mock Browser Environment for Node
if (typeof navigator === 'undefined') {
    (global as any).navigator = {
        userAgent: 'NodeTest',
        vendor: 'Google',
        language: 'vi-VN'
    };
}
if (typeof window === 'undefined') {
    (global as any).window = {
        screen: { width: 1920, height: 1080 },
        scrollTo: () => {}
    };
}

async function runIntegrationTest() {
    console.log("🚀 STARTING INTEGRATION QUICK CHECK...");

    const logic = new TuViLogic();
    const ai = new AIService();
    const supabase = new SupabaseService();

    const testInput = {
        name: "Test User",
        solarDay: 1,
        solarMonth: 1,
        solarYear: 1990,
        hour: 10,
        gender: Gender.NAM,
        viewingYear: 2026,
        readingStyle: ReadingStyle.NGHIEM_TUC
    };

    try {
        // 1. Test Engine
        console.log("\n1. Testing Engine...");
        const laso = logic.anSao(testInput);
        console.log(`✅ Engine OK. Mệnh tại: ${laso.info.menhTai}, Cục: ${laso.info.cuc}`);

        // 2. Test Supabase Sync (Simulation)
        console.log("\n2. Testing Supabase Sync (Background)...");
        // We catch error because we might not have internet or valid table access in this env
        try {
            await supabase.syncLaso(laso);
            console.log("✅ Supabase Sync triggered.");
        } catch (e: any) {
            console.warn("⚠️ Supabase Sync issue (expected in restricted env):", e.message);
        }

        // 3. Test AI Connection (Stream first chunk)
        console.log("\n3. Testing AI Connection (Gemini)...");
        try {
            const stream = ai.generateReadingStream(laso);
            let firstChunk = false;
            for await (const chunk of stream) {
                if (chunk) {
                    console.log("✅ AI Chunk Received:", chunk.substring(0, 50) + "...");
                    firstChunk = true;
                    break; // Just test connection
                }
            }
            if (!firstChunk) throw new Error("No response from AI");
            console.log("✅ AI Connection OK.");
        } catch (e: any) {
            console.error("❌ AI Connection Failed:", e.message);
        }

        console.log("\n✨ INTEGRATION CHECK COMPLETE.");

    } catch (error: any) {
        console.error("\n❌ CRITICAL FAILURE:", error.message);
    }
}

runIntegrationTest();
