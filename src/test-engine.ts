import { TuViLogic } from './core/tuvi-logic';
import { Gender, ReadingStyle, ViewingMode } from './types';

async function runQuickTest() {
  console.log("🧪 ĐANG KIỂM TRA ENGINE TU VI...");
  
  const logic = new TuViLogic();
  
  // Sample input from Prompt3.txt: Nguyễn Duy Trường, 05/03/1992, 10h (Giờ Tỵ), Nam
  const testInput = {
    name: "Nguyễn Duy Trường",
    solarDay: 5,
    solarMonth: 3,
    solarYear: 1992,
    hour: 10,
    gender: Gender.NAM,
    viewingYear: 2026,
    viewingMonth: 4,
    viewingMode: ViewingMode.YEAR,
    readingStyle: ReadingStyle.NGHIEM_TUC
  };

  try {
    const start = performance.now();
    const result = await logic.anSao(testInput);
    const end = performance.now();

    console.log("✅ ENGINE CHẠY THÀNH CÔNG!");
    console.log(`⏱️ Thời gian tính toán: ${(end - start).toFixed(2)}ms`);
    console.log("------------------------------------------");
    console.log(`👤 Họ tên: ${result.info.name}`);
    console.log(`📅 Ngày sinh: ${result.info.solarDate} (Dương)`);
    console.log(`🌙 Ngày sinh: ${result.info.lunarDate} (Âm)`);
    console.log(`☯️ Can Chi: ${result.info.canChi}`);
    console.log(`🌊 Cục: ${result.info.cuc}`);
    console.log(`🏠 Mệnh tại: ${result.info.menhTai}`);
    console.log(`💎 Thân tại: ${result.info.thanTai}`);
    console.log(`🌌 Mệnh Ngũ Hành: ${result.info.menhNguHanh}`);
    console.log(`🔄 Quan hệ Cục-Mệnh: ${result.info.cucMenhRelation}`);
    console.log("------------------------------------------");
    
    // Check stars count
    let totalStars = 0;
    result.cung.forEach(c => {
      totalStars += c.chinhTinh.length + c.phuTinh.length;
    });
    console.log(`🌠 Tổng số sao đã an: ${totalStars}`);
    
    if (totalStars > 50) {
      console.log("✅ Số lượng sao hợp lệ (Đã an đầy đủ các vòng sao).");
    } else {
      console.log("⚠️ Cảnh báo: Số lượng sao có vẻ ít, cần kiểm tra lại logic.");
    }

    console.log("📍 Kiểm tra 12 cung chức năng:");
    console.log(result.cung.map(c => `${c.name}: ${c.chucNang}`).join(" | "));

  } catch (error) {
    console.error("❌ LỖI KHI CHẠY ENGINE:");
    console.error(error);
  }
}

runQuickTest();
