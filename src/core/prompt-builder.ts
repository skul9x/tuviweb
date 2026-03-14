import type { LasoData, CungInfo } from '../types';
import * as Constants from './constants';

/**
 * Expert JSON Prompt Builder for Tu Vi AI.
 * Ported from com.example.tviai.core.GeminiClient.kt
 */

// --- Star Classification ---
const SAT_TINH = new Set([
  "Kình Dương", "Đà La", "Hỏa Tinh", "Linh Tinh",
  "Địa Không", "Địa Kiếp", "Thiên Hình", "Kiếp Sát"
]);

const CAT_TINH = new Set([
  "Văn Xương", "Văn Khúc", "Tả Phù", "Hữu Bật",
  "Thiên Khôi", "Thiên Việt", "Lộc Tồn", "Thiên Mã", "Đào Hoa",
  "Hồng Loan", "Thiên Hỷ", "Long Trì", "Phượng Các", "Thiên Đức",
  "Nguyệt Đức", "Ân Quang", "Thiên Quý", "Thiên Quan", "Thiên Phúc",
  "Quốc Ấn", "Đường Phù", "Thai Phụ", "Phong Cáo", "Tam Thai",
  "Bát Tọa", "Thiên Giải", "Địa Giải", "Giải Thần"
]);

/**
 * Main entry point: Builds the full expert JSON prompt
 */
export function buildPromptJson(data: LasoData): string {
  const info = data.info;
  const stylePrompt = getStylePrompt(info.readingStyle);

  const promptObj = {
    role: "AI chuyên luận Tử Vi Đẩu Số theo hệ thống tinh hệ cổ điển",
    style: {
      tone: stylePrompt
    },
    methodology_sources: ["Thiên Lương", "Vân Đằng Thái Thứ Lang", "Tử Vi Đẩu Số Toàn Thư"],
    objective: "Phân tích lá số theo cấu trúc tinh hệ – không suy đoán cảm tính",
    absolute_rules: buildAbsoluteRules(data),
    priority_rules: [
      "Chính tinh > Phụ tinh (chính tinh quyết định bản chất cung)",
      "Miếu/Vượng > Đắc > Bình > Hãm (trạng thái quyết định lực — PHẢI dùng ký hiệu M/V/Đ/Bình/H có sẵn, KHÔNG tự đánh giá sáng/tối)",
      "Tứ hóa bản mệnh > Tứ hóa đại vận > Tứ hóa lưu niên",
      "Đồng cung > Tam hợp > Xung chiếu > Giáp cung",
      "Cách cục lớn > Tiểu cách (cách lớn chi phối toàn cục)"
    ],
    analysis_pipeline: buildPipeline(),
    analysis_methods: buildMethods(),
    palace_analysis_method: buildPalaceMethod(),
    analysis_order: [
      "Mệnh (phân tích kỹ nhất, bao gồm Mệnh–Thân–Cục)",
      "Phu Thê", "Quan Lộc", "Tài Bạch", "Thiên Di", "Tật Ách",
      "Điền Trạch", "Phúc Đức", "Phụ Mẫu", "Huynh Đệ", "Nô Bộc", "Tử Tức"
    ],
    output_format: buildOutputFormat(data),
    notation_rules: buildNotation(),
    common_mistakes: buildMistakes(),
    reasoning_rules: {
      always_show_evidence: true,
      evidence_format: "(Căn cứ: sao + trạng thái + cung + [quan hệ: đồng cung/tam hợp/xung chiếu nếu có] + [tứ hóa/Tuần-Triệt nếu có])",
      minimum_evidence: 2,
      conflict_resolution: "priority_rules"
    },
    chart_data: buildChartData(data)
  };

  return JSON.stringify(promptObj, null, 2);
}

function getStylePrompt(style: string): string {
  const stylePrompts: Record<string, string> = {
    "Nghiêm túc": "Điềm đạm – phân tích mệnh lý – không văn hoa. Xưng hô: 'Tại hạ' hoặc 'Tôi', gọi người xem là 'Đương số'.",
    "Đời thường": "Đời thường – dân dã – dễ hiểu. Xưng hô: 'Tôi', gọi người xem là 'Bạn'.",
    "Hài hước": "Hài hước – trẻ trung – vui nhộn. Xưng hô: 'Ad' hoặc 'Tui', gọi người xem là 'Bồ'.",
    "Kiếm hiệp": "Kiếm hiệp – cổ trang – văn phong phim chưởng. Xưng hô: 'Bần đạo' hoặc 'Lão phu', gọi người xem là 'Thí chủ'.",
    "Chữa lành": "Nhẹ nhàng – chữa lành (healing) – khích lệ tinh thần. Xưng hô: 'Mình', gọi người xem là 'Bạn'.",
    "Chuyên gia": "Điềm đạm – chuyên sâu – phân tích mệnh lý ở mức cấu trúc cao nhất. Xưng hô: 'Tôi', gọi người xem là 'Đương số'."
  };
  return stylePrompts[style] || stylePrompts["Nghiêm túc"];
}

function buildAbsoluteRules(data: LasoData) {
  const info = data.info;
  const birthYear = parseInt(info.solarDate.split("/").pop() || "0");
  const approxAge = info.viewingYear - birthYear + 1;
  const isChild = approxAge < 13 || info.daiVanInfo.includes("Chưa vào đại vận");

  const rules: any = {
    must_do: [
      "Mọi nhận định BẮT BUỘC phải có căn cứ sao",
      "Phân biệt rõ: Chính tinh, Phụ tinh, Cát tinh, Sát tinh, Tứ hóa, Sao lưu, Sao đại vận",
      "Không bỏ qua tương tác tinh hệ: đồng cung, tam hợp, xung chiếu, hội chiếu, giáp cung",
      "Sát tinh phải phân tích theo cơ chế: sát+cát, sát+vận, sát phá cách hay tạo đột phá",
      "Phải dùng ngôn ngữ xác suất: 'thường', 'có xu hướng', 'nếu vận hỗ trợ'"
    ],
    must_not: [
      "Không dùng câu chung chung ('số giàu', 'số khổ') nếu không chỉ rõ tinh hệ và cơ chế",
      "Không suy đoán khi thiếu dữ liệu. Thiếu thông tin → nêu rõ 'Không có trong dữ liệu được cung cấp' và bỏ qua phần không đủ căn cứ",
      "Không thần bí hóa sát tinh",
      "Không khẳng định tuyệt đối"
    ],
    data_integrity: {
      forbidden: [
        "Tự tính miếu/vượng/đắc/bình/hãm (phải dùng ký hiệu M/V/Đ/Bình/H có sẵn)",
        "Tự xác định đại vận khi input chưa cung cấp",
        "Tự tính lưu tinh, lưu tứ hóa hoặc sao vận khi input chưa cung cấp",
        "Tự thêm sao, tứ hóa, trạng thái sáng tối",
        "Tự kết luận cách cục nếu không đủ sao và điều kiện thực tế"
      ],
      allowed: [
        "Đánh giá lực cung 1-10 dựa trên tổ hợp sao + trạng thái + tứ hóa + Tuần/Triệt đã có sẵn",
        "Xếp hạng chủ-thứ giữa nhiều cách cục khi sao và điều kiện đã có trong dữ liệu",
        "Suy luận mạnh/yếu, thuận/nghịch, phá cách hay hỗ trợ dựa trên quy tắc ưu tiên"
      ],
      fallback: "Nếu thiếu dữ liệu → ghi rõ: 'Không có trong dữ liệu được cung cấp'"
    }
  };

  if (isChild) {
    rules.child_rule = {
      condition: "Đương số dưới 13 tuổi hoặc chưa vào đại vận",
      forbidden_topics: ["Tiền Bạc (Tài bạch)", "Sự Nghiệp (Quan lộc)", "Tình Duyên (Phu thê)"],
      focus_topics: ["Sức khỏe", "Tính cách bẩm sinh", "Khả năng tiếp thu/học tập", "Môi trường cha mẹ nuôi dưỡng (cung Phụ Mẫu)"],
      tone: "Tư vấn cho Phụ huynh. Sử dụng ngôn ngữ định hướng. VD: 'Bé có xu hướng...', 'Cha mẹ nên lưu ý...'",
      _note: "AI PHẢI bỏ qua mọi logic về công danh, tiền bạc nếu child_rule được kích hoạt."
    };
  }

  return rules;
}

function buildPipeline() {
  return {
    step_1_summary: {
      name: "Tóm tắt cấu trúc lá số",
      items: ["Chính tinh từng cung", "Tứ hóa", "Cung Mệnh", "Cung Thân", "Tam hợp Mệnh–Tài–Quan"]
    },
    step_2_power: {
      name: "Đánh giá lực lá số",
      items: ["Mệnh mạnh hay yếu", "Thân cư cung nào", "Cục sinh hay khắc mệnh", "Sát tinh nặng hay không", "Cát tinh nâng đỡ không"]
    },
    step_3_configurations: {
      name: "Kiểm tra cách cục",
      major_list: ["Tử Phủ Vũ Tướng", "Phủ Tướng Triều Viên", "Cơ Nguyệt Đồng Lương", "Nhật Nguyệt Tịnh Minh", "Sát Phá Tham", "Liêm Tham", "Cự Nhật", "Vũ Khúc tài tinh", "Thiên Phủ tài khố", "Thái Âm tài tinh"],
      extended: {
        dai_quy: Constants.CACH_CUC_DAI_QUY,
        dai_phu: Constants.CACH_CUC_DAI_PHU,
        vo: Constants.CACH_CUC_VO,
        hung_pha: Constants.CACH_CUC_HUNG,
        dac_biet: Constants.CACH_CUC_DAC_BIET
      },
      validation_warning: "Nhóm sao hội hợp trong metadata CHỈ là gợi ý. AI TỰ XÁC ĐỊNH tính hợp lệ của cách cục BẰNG CÁCH: (1) Dùng trạng thái M/V/Đ/Bình/H CÓ SẴN trong dữ liệu sao, (2) Kiểm tra Tuần/Triệt đã được ghi nhận tại cung (flags hoặc sao 'Tuần'/'Triệt' trong palace data), (3) Xem tứ hóa đã cung cấp. KHÔNG tự tính thêm trạng thái mới. Nếu thiếu dữ liệu trạng thái → nhận định 'không đủ căn cứ'.",
      tuan_triet_check_rule: "BẮT BUỘC quét toàn bộ 12 cung khi đánh giá cách cục và vận hạn: dùng flags 'Gặp Tuần'/'Gặp Triệt' và sao 'Tuần'/'Triệt' có sẵn trong palace data. KHÔNG tự tính vị trí Tuần/Triệt ngoài dữ liệu đã cung cấp. LƯU Ý: flags và sao Tuần/Triệt trong danh sách sao là CÙNG MỘT hiện tượng, CHỈ TÍNH 1 LẦN.",
      check_sat_tinh_pha_cach: true
    },
    step_3b_ranking: {
      name: "Xếp hạng cách cục (khi ≥2 cách)",
      criteria: [
        "① So sánh LỰC: Cách nào nhiều sao Miếu/Vượng → mạnh hơn",
        "② So sánh VỊ TRÍ: Cách nào nằm tam hợp Mệnh–Tài–Quan → trực tiếp nhất",
        "③ So sánh TỨ HÓA: Cách nào được Hóa Lộc/Quyền bản mệnh hoặc đại vận chiếu → nâng tầm",
        "④ Kết luận: 'Cách cục chính' (xu hướng chi phối chính) vs 'Cách bổ trợ'"
      ],
      forbidden: "KHÔNG luận ngang nhau nếu mâu thuẫn mà không phân chủ-thứ"
    },
    step_4_contradiction_check: {
      name: "Kiểm tra mâu thuẫn (BẮT BUỘC sau 12 cung)",
      pairs: [
        "Mệnh vs Thân: Bẩm sinh vs Hành động khớp không?",
        "Mệnh vs Quan vs Tài: Tâm – Tầm – Lộc logic không?",
        "Phu Thê vs Phúc Đức: Duyên nợ khớp phúc phần không?",
        "Tật Ách vs Mệnh: Sức khỏe tương ứng cường độ Mệnh không?"
      ],
      resolution: "Giải thích theo quy tắc ưu tiên. KHÔNG để hai kết luận song song không phân chủ-thứ"
    }
  };
}

function buildMethods() {
  return {
    m1_tu_hoa: {
      name: "Phân tích Tứ Hóa Bản Mệnh",
      steps: [
        "(1) Tìm vị trí 4 Hóa chủ sinh nạp", "(2) Xét Lộc/Kỵ trùng phùng",
        "(3) Kỵ + Sát tinh (địa kiếp, hỏa tinh...)", "(4) Lộc + Cát tinh",
        "(5) Hóa Kỵ rơi cung nào (chủ nợ/nghiệp lực)", "(6) Tứ hóa đại vận xếp chồng",
        "(7) Lưu Tứ Hóa", "(8) Kết luận lực Hóa"
      ]
    },
    m2_ngu_hanh: {
      name: "Phân tích Ngũ Hành 4 tầng",
      layers: ["Nạp âm bản mệnh", "Cục", "Ngũ hành cung", "Ngũ hành sao"],
      example: "Mệnh Kim đóng cung Thủy (sinh xuất) hội sao Hỏa (khắc) → dù miếu cũng chiết giảm lực"
    },
    m3_gender: {
      name: "Gợi ý luận theo giới tính (truyền thống, tùy chọn)",
      _note: "Đây là quy tắc truyền thống, CHỈ áp dụng khi phù hợp ngữ cảnh. Không bắt buộc.",
      male: {
        focus: ["Quan", "Tài", "Di"],
        fear: "Triệt đóng Mệnh, Cô Quả hội chiếu"
      },
      female: {
        focus: ["Phu", "Tử", "Phúc"],
        fear: "Sát Phá Tham hội Đào Hoa/Hồng Loan/Sát tinh (dễ trắc trở tình duyên)"
      }
    },
    m4_tuan_triet: {
      name: "Phân tích Tuần – Triệt",
      tuan: "Thường làm giảm đáng kể lực sao (cát giảm cát, hung giảm hung). Xu hướng ổn định dần sau 30 tuổi",
      triet: "Thường làm giảm mạnh lực sao (có thể triệt tiêu phần lớn lực). Xu hướng ảnh hưởng rõ nhất trước 30 tuổi",
      triet_at_menh: "Thường gặp khó khăn giai đoạn đầu đời"
    },
    m5_phi_tinh: {
      name: "Phi Tinh Tứ Hóa (chuyên sâu)",
      source: "chart_data.phi_tinh_tu_hoa (pre-computed: cung_nguồn → cung_nhận Lộc/Quyền/Khoa/Kỵ)",
      rules: {
        loc_a_to_b: "A mang lại lợi ích/tình cảm cho B",
        ky_a_to_b: "A gây áp lực/rắc rối/phiền muộn cho B",
        tu_hoa: "Cung tự tan biến hoặc tự mâu thuẫn"
      }
    },
    m6_fortune_layers: {
      name: "Vận hạn đa tầng (xếp chồng)",
      steps: [
        "(1) Xác định Mệnh Đại Vận", "(2) Tìm Tứ Hóa Đại Vận",
        "(3) Tìm Lưu Niên Tứ Hóa năm xem",
        "(4) Tìm Trùng điệp (Song Kỵ, Song Lộc hội tụ một cung)",
        "(5) Xét cung Tiểu Hạn"
      ]
    },
    m7_cross_check: {
      name: "Kiểm chứng chéo",
      checks: [
        "Tam giác Mệnh-Quan-Tài: Cái Tâm và Cái Tầm",
        "Mệnh (bẩm sinh) vs Thân (hành động hậu thiên)",
        "Mệnh tốt Thân xấu → Có thể thuận lợi giai đoạn đầu, biến động về sau"
      ]
    }
  };
}

function buildPalaceMethod() {
  return {
    steps: [
      "Xác định chính tinh + trạng thái miếu/vượng/đắc/hãm",
      "Liệt kê phụ tinh quan trọng và tứ hóa",
      "Phân tích tương tác: đồng cung, tam hợp, xung chiếu, giáp cung, hội sát tinh",
      "Đánh giá lực cung: mạnh/trung/yếu, thuận/nghịch",
      "Chuyển sang biểu hiện thực tế: tính cách, nghề nghiệp, tài chính, quan hệ, sức khỏe, tâm lý"
    ],
    interaction_weights: {
      dong_cung: { value: 1.0, note: "100% lực – mạnh nhất" },
      tam_hop: { value: 0.75, note: "70-80% lực" },
      xung_chieu: { value: 0.65, note: "60-70% lực – ảnh hưởng gián tiếp" },
      giap_cung: { value: 0.45, note: "40-50% lực – hỗ trợ/kìm hãm từ hai bên" },
      nhi_hop: { value: 0.3, note: "Yếu nhất" }
    },
    warnings: [
      "Sát tinh xung chiếu gây hại ÍT HƠN sát tinh đồng cung",
      "Cát tinh tam hợp hội chiếu có lực MẠNH HƠN cát tinh giáp cung"
    ]
  };
}

function buildOutputFormat(data: LasoData) {
  const info = data.info;
  const vanHanRequest = info.viewingMode === "MONTH" 
    ? `Vận tháng ${info.viewingMonth} năm ${info.viewingYear}`
    : `Vận năm ${info.viewingYear}`;
  
  return {
    sections: {
      A: "Tóm tắt lá số (5-10 dòng): tinh hệ nổi bật, điểm mạnh, điểm yếu, căn cứ sao",
      B: "Luận chi tiết 12 cung",
      C: "Cách cục lớn",
      D: "Phân loại lá số",
      E: "Kết luận tổng thể: sức mạnh, khả năng giàu có, quyền lực, hướng sự nghiệp",
      E1: `${vanHanRequest} (BẮT BUỘC – KHÔNG ĐƯỢC BỎ QUA)`
    },
    palace_format: {
      structure: "[Cung] → (Căn cứ: sao, trạng thái, tam hợp, sát/cát) → Logic tinh hệ → Biểu hiện thực tế",
      force_score: "1-10 (1=rất yếu, 10=rất mạnh)",
      trend: ["Thuận", "Nghịch", "Biến động"],
      confidence: {
        "Cao": "≥3 căn cứ tinh hệ khớp, không mâu thuẫn",
        "Trung bình": "1-2 căn cứ, hoặc mâu thuẫn nhẹ",
        "Thấp": "Thiếu dữ liệu hoặc nhiều mâu thuẫn"
      }
    },
    classification_categories: [
      "Đại phú", "Đại quý", "Phú quý nhờ vận", "Giàu nhưng lao tâm",
      "Quyền lực", "Học thuật", "Bạo phát", "Khởi nghiệp thành công"
    ],
    fortune_period_format: {
      steps: [
        "(1) Đại vận hiện tại → ảnh hưởng nền",
        `(2) Lưu niên ${info.viewingYear} → sao lưu + lưu tứ hóa`,
        "(3) Trùng điệp tứ hóa → Song Lộc/Song Kỵ/Lộc Kỵ giao nhau",
        "(4) Tác động lên Mệnh – Quan – Tài – Phu Thê",
        "(5) Kết luận theo dữ liệu sẵn có. Nếu thiếu dữ liệu lưu nguyệt → chỉ kết luận ở mức năm"
      ]
    }
  };
}

function buildNotation() {
  return {
    brightness: {
      M: "Miếu", V: "Vượng", Đ: "Đắc", Bình: "Bình", H: "Hãm",
      _note: "Sao không có field 'state' thường là tiểu tinh không xét miếu/hãm — coi như trung tính (không cộng/trừ lực)."
    },
    transformations: {
      ban_menh: "(Hóa Lộc), (Hóa Quyền), (Hóa Khoa), (Hóa Kỵ)",
      dai_van: "ĐV. prefix",
      luu_nien: "L. prefix"
    },
    specials: ["Tuần = Tuần Không (giảm lực)", "Triệt = Triệt Không (giảm lực)"],
    vo_chinh_dieu_rules: [
      "Bước 1: Mượn chính tinh cung đối chiếu (xung chiếu) — giảm 30% lực so với sao ở bản cung",
      "Bước 2: Phụ tinh trong cung vô chính diệu trở thành 'chủ thực tế' — phân tích kỹ hơn",
      "Bước 3: Vô chính diệu + nhiều sát tinh → cung rất yếu, biến động lớn",
      "Bước 4: Vô chính diệu + nhiều cát tinh → 'đất trống gặp mưa' — muộn phát nhưng có thể phát"
    ],
    group_labels: {
      tam_hop: "Sao phân bố đều trên 3 cung tam hợp",
      nhom: "Sao hội tụ nhưng CHƯA đủ điều kiện cách cục (cần AI đánh giá thêm)"
    }
  };
}

function buildMistakes() {
  return [
    { wrong: "Tử Vi là sao vua nên ở đâu cũng tốt", correct: "PHẢI xét miếu/hãm, cung vị" },
    { wrong: "Kình Dương luôn xấu", correct: "Kình Dương miếu (Ngọ) có thể tạo Mã Đầu Đới Kiếm" },
    { wrong: "Hóa Kỵ luôn xấu", correct: "Kỵ ở Quan/Tài có thể chỉ là 'chuyên tâm, bám víu'" },
    { wrong: "Luận Vô Chính Diệu mà không nhắc chính tinh đối cung", correct: "PHẢI nhắc chính tinh đối cung" },
    { wrong: "Gộp cát tinh + sát tinh → 'trung bình'", correct: "PHẢI phân tích cơ chế: cát giảm sát hay sát phá cát" }
  ];
}

function buildChartData(data: LasoData) {
  const info = data.info;
  const cungList = data.cung;
  const boSaoList = detectBoSao(cungList);

  const vanHanRequest = info.viewingMode === "MONTH"
    ? `Phân tích vận tháng ${info.viewingMonth} âm lịch năm ${info.viewingYear}. Sử dụng: đại vận + tiểu hạn + lưu niên tứ hóa đã cung cấp. LƯU Ý: Dữ liệu hiện tại là cấp NĂM, chưa có lưu nguyệt tứ hóa. Nếu không đủ căn cứ cho kết luận cấp tháng → nêu rõ giới hạn và luận ở mức năm.`
    : `Phân tích vận năm ${info.viewingYear} (theo đại vận hiện tại và lưu tinh năm)`;

  const canChi12: Record<string, string> = {};
  cungList.forEach(c => canChi12[c.name] = c.canChi);

  return {
    _role: "Đây là dữ liệu lá số THỰC TẾ của đương số. PHẢI dùng để phân tích, KHÔNG phải ví dụ.",
    person: {
      name: info.name,
      gender: info.gender,
      birth_solar: `${info.solarDate} lúc ${info.time}`,
      birth_lunar: `${info.lunarDate} (${info.canChi})`,
      cuc: info.cuc,
      menh_position: info.menhTai,
      than_position: info.thanTai,
      dai_van: info.daiVanInfo,
      viewing_period: info.viewingMode === "MONTH" ? `Tháng ${info.viewingMonth} năm ${info.viewingYear}` : `Năm ${info.viewingYear}`
    },
    metadata: {
      menh_ngu_hanh: info.menhNguHanh,
      am_duong: info.amDuong,
      cuc_menh_relation: info.cucMenhRelation,
      ngu_hanh_14_sao: Constants.NGU_HANH_SAO,
      nhom_sao: boSaoList.length === 0 ? ["Không phát hiện"] : boSaoList,
      axis_mapping: buildAxisMapping(cungList),
      can_chi_12_cung: canChi12,
      tieu_han_cung: `${info.tieuHanCung} (năm ${info.viewingYear})`,
      dai_van_list: parseDaiVan(info.daiVanFullList)
    },
    phi_tinh_tu_hoa: info.phiTinhTuHoa ? parsePhiTinh(info.phiTinhTuHoa) : { status: "Không có dữ liệu phi tinh" },
    tu_hoa_summary: buildTuHoaSummary(cungList),
    tu_hoa_10_can: buildTuHoa10CanTable(),
    palaces: buildPalaces(cungList),
    fortune_context: {
      year: info.viewingYear,
      dai_van_current: info.daiVanInfo,
      tieu_han_cung: `${info.tieuHanCung} (năm ${info.viewingYear})`,
      tu_hoa_overlap_guide: "Phải kiểm tra xếp chồng tứ hóa: Song Kỵ (2 Kỵ cùng cung), Song Lộc (2 Lộc cùng cung), Lộc Kỵ giao nhau tại một cung. Ưu tiên phân tích: tứ hóa bản mệnh + đại vận xếp chồng → tác động lên Mệnh/Quan/Tài/Phu Thê trước, sau đó mới xét lưu niên."
    },
    fortune_request: vanHanRequest
  };
}

function buildAxisMapping(cungList: CungInfo[]) {
  const mapping: any = {};
  const axes = [
    { label: "Mệnh-Di", pair: ["Mệnh", "Thiên Di"] },
    { label: "Phụ-Ách", pair: ["Phụ Mẫu", "Tật Ách"] },
    { label: "Phúc-Tài", pair: ["Phúc Đức", "Tài Bạch"] },
    { label: "Điền-Tử", pair: ["Điền Trạch", "Tử Tức"] },
    { label: "Quan-Thê", pair: ["Quan Lộc", "Phu Thê"] },
    { label: "Nô-Huynh", pair: ["Nô Bộc", "Huynh Đệ"] }
  ];

  axes.forEach(axis => {
    const p1 = cungList.find(c => c.chucNang.includes(axis.pair[0]));
    const p2 = cungList.find(c => c.chucNang.includes(axis.pair[1]));
    if (p1 && p2) {
      mapping[axis.label] = {
        p1: `${p1.name} (${p1.chucNang})`,
        p2: `${p2.name} (${p2.chucNang})`
      };
    }
  });
  return mapping;
}

function buildTuHoaSummary(cungList: CungInfo[]) {
  const result: any = {
    _note: "Đây là bản tóm tắt nhanh. Dữ liệu gốc nằm trong fixed_stars và transit_stars của từng cung trong 'palaces'."
  };

  const findCung = (suffix: string) => {
    const cung = cungList.find(c => c.phuTinh.includes(suffix));
    return cung ? `Cung ${cung.name} (${cung.chucNang})` : null;
  };

  result.ban_menh = {
    "(Hóa Lộc)": findCung("(Hóa Lộc)"),
    "(Hóa Quyền)": findCung("(Hóa Quyền)"),
    "(Hóa Khoa)": findCung("(Hóa Khoa)"),
    "(Hóa Kỵ)": findCung("(Hóa Kỵ)")
  };

  result.dai_van = {
    "(ĐV. Hóa Lộc)": findCung("(ĐV. Hóa Lộc)"),
    "(ĐV. Hóa Quyền)": findCung("(ĐV. Hóa Quyền)"),
    "(ĐV. Hóa Khoa)": findCung("(ĐV. Hóa Khoa)"),
    "(ĐV. Hóa Kỵ)": findCung("(ĐV. Hóa Kỵ)")
  };

  result.luu_nien = {
    "(L.Hóa Lộc)": findCung("(L.Hóa Lộc)"),
    "(L.Hóa Quyền)": findCung("(L.Hóa Quyền)"),
    "(L.Hóa Khoa)": findCung("(L.Hóa Khoa)"),
    "(L.Hóa Kỵ)": findCung("(L.Hóa Kỵ)")
  };

  return result;
}

function buildTuHoa10CanTable() {
  const table: any = {
    _warning: "CHỈ dùng GIẢI THÍCH cơ chế phi tinh. KHÔNG dùng để tự tính thêm tứ hóa"
  };
  Constants.THIEN_CAN.forEach((can, idx) => {
    const hoa = Constants.TU_HOA_MAP[idx] || ["", "", "", ""];
    table[can] = { "Lộc": hoa[0], "Quyền": hoa[1], "Khoa": hoa[2], "Kỵ": hoa[3] };
  });
  return table;
}

function buildPalaces(cungList: CungInfo[]) {
  return cungList.map(c => {
    const flags: string[] = [];
    if (c.chinhTinh.length === 0) flags.push("Vô chính diệu");
    if (c.phuTinh.some(p => p.startsWith("Tuần"))) flags.push("Gặp Tuần");
    if (c.phuTinh.some(p => p.startsWith("Triệt"))) flags.push("Gặp Triệt");
    if (c.phuTinh.includes("[Cung Đại Vận]")) flags.push("Cung Đại Vận");

    const fixedPhu = c.phuTinh.filter(p => 
      !p.startsWith("ĐV.") && !p.startsWith("L.") && 
      !p.startsWith("(ĐV.") && !p.startsWith("(L.") &&
      p !== "[Cung Đại Vận]"
    );
    const daiVanStars = c.phuTinh.filter(p => p.startsWith("ĐV.") || p.startsWith("(ĐV."));
    const luuStars = c.phuTinh.filter(p => p.startsWith("L.") || p.startsWith("(L."));

    const palace: any = {
      name: c.name,
      element: c.nguHanhCung,
      function: c.chucNang,
      fixed_stars: [
        ...c.chinhTinh.map(s => parseStar(s, true)),
        ...fixedPhu.map(s => parseStar(s, false))
      ]
    };

    if (flags.length > 0) palace.flags = flags;
    if (daiVanStars.length > 0 || luuStars.length > 0) {
      palace.transit_stars = [
        ...daiVanStars.map(s => parseStar(s, false)),
        ...luuStars.map(s => parseStar(s, false))
      ];
    }

    return palace;
  });
}

function parseStar(raw: string, isMain: boolean) {
  let working = raw.trim();
  const flags: string[] = [];
  
  // Extract [FLAGS]
  const flagMatches = working.match(/\[([^\]]+)\]/g);
  if (flagMatches) {
    flagMatches.forEach(m => flags.push(m.slice(1, -1)));
    working = working.replace(/\[([^\]]+)\]/g, "").trim();
  }

  // Handle Tứ Hóa format (Hóa Lộc)
  if (working.startsWith("(") && working.endsWith(")")) {
    return { name: working.slice(1, -1), type: "tu_hoa" };
  }

  // Extract State (M), (V)...
  let name = working;
  let state: string | undefined;
  const stateMatch = working.match(/^(.+?)\s*\(([MVĐHB]|Bình)\)$/);
  if (stateMatch) {
    name = stateMatch[1].trim();
    state = stateMatch[2];
  }

  const baseName = name.replace(/^ĐV\. /, "").replace(/^L\./, "");
  
  const starObj: any = {
    name: name,
    type: isMain ? "main_star" : (SAT_TINH.has(baseName) ? "sat_tinh" : (CAT_TINH.has(baseName) ? "cat_tinh" : "sub_star"))
  };
  
  if (state) starObj.state = state;
  if (flags.length > 0) starObj.flags = flags;
  
  return starObj;
}

function parsePhiTinh(raw: string) {
  const result: any = {};
  raw.trim().split("\n").forEach(line => {
    const match = line.trim().match(/^(\S+)\((\S+)\):\s*(.+)$/);
    if (match) {
      const [_, cung, can, rest] = match;
      const obj: any = { can };
      rest.split(",").forEach(part => {
        const hoaMatch = part.trim().match(/H\.(\S+)→(\S+)/);
        if (hoaMatch) {
          const type = hoaMatch[1].toLowerCase();
          obj[type === "quyền" ? "quyen" : type] = hoaMatch[2]; // map "quyền" to "quyen"
        }
      });
      result[cung] = obj;
    }
  });
  return result;
}

function parseDaiVan(raw: string) {
  return raw.split("|").map(segment => {
    const match = segment.trim().match(/^(\d+[–-]\d+):\s*(\S+)\s+(\S+)$/);
    if (match) {
      return { age: match[1], can: match[2], cung: match[3] };
    }
    return null;
  }).filter(x => x !== null);
}

function detectBoSao(cungList: CungInfo[]) {
  const result: string[] = [];
  
  const findStarIdx = (name: string) => {
    const idx = cungList.findIndex(c => c.chinhTinh.some(s => s.startsWith(name)));
    return idx >= 0 ? idx : null;
  };

  const getHoiHop = (idx: number) => new Set([idx, (idx + 4) % 12, (idx + 8) % 12, (idx + 6) % 12]);
  const getTamHop = (idx: number) => new Set([idx, (idx + 4) % 12, (idx + 8) % 12]);

  // Sát Phá Tham
  const sat = findStarIdx("Thất Sát");
  const pha = findStarIdx("Phá Quân");
  const tham = findStarIdx("Tham Lang");
  if (sat !== null && pha !== null && tham !== null) {
    if (getTamHop(sat).has(pha) && getTamHop(sat).has(tham)) {
      result.push(`Tam hợp Sát Phá Tham (${Constants.DIA_CHI[sat]}–${Constants.DIA_CHI[pha]}–${Constants.DIA_CHI[tham]})`);
    }
  }

  // Tử Phủ Vũ Tướng
  const tu = findStarIdx("Tử Vi");
  const phu = findStarIdx("Thiên Phủ");
  const vu = findStarIdx("Vũ Khúc");
  const tuong = findStarIdx("Thiên Tướng");
  if (tu !== null && phu !== null && vu !== null && tuong !== null) {
    const group = getHoiHop(tu);
    if (group.has(phu) && group.has(vu) && group.has(tuong)) {
      result.push(`Tử Phủ Vũ Tướng hội chiếu`);
    }
  }

  // Cơ Nguyệt Đồng Lương
  const co = findStarIdx("Thiên Cơ");
  const nguyet = findStarIdx("Thái Âm");
  const dong = findStarIdx("Thiên Đồng");
  const luong = findStarIdx("Thiên Lương");
  if (co !== null && nguyet !== null && dong !== null && luong !== null) {
    const group = getHoiHop(co);
    if (group.has(nguyet) && group.has(dong) && group.has(luong)) {
      result.push(`Cơ Nguyệt Đồng Lương hội chiếu`);
    }
  }

  // Nhật Nguyệt
  const nhat = findStarIdx("Thái Dương");
  if (nhat !== null && nguyet !== null) {
    if (nhat === nguyet) result.push(`Nhật Nguyệt đồng cung tại ${Constants.DIA_CHI[nhat]}`);
    else if (Math.abs(nhat - nguyet) === 6) result.push(`Nhật Nguyệt đối chiếu (${Constants.DIA_CHI[nhat]}–${Constants.DIA_CHI[nguyet]})`);
    else if (Math.abs(nhat - nguyet) % 4 === 0) result.push(`Nhật Nguyệt hội chiếu (${Constants.DIA_CHI[nhat]}–${Constants.DIA_CHI[nguyet]})`);
  }

  return result;
}
