/**
 * Constants for Tu Vi calculation engine.
 * Ported from com.example.tviai.core.Constants.kt
 */

export const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"] as const;

export const DIA_CHI = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"] as const;

export const CUNG_DIA_BAN = DIA_CHI;

export const CUNG_CHUC_NANG = [
  "Mệnh", "Phụ Mẫu", "Phúc Đức", "Điền Trạch", "Quan Lộc", "Nô Bộc",
  "Thiên Di", "Tật Ách", "Tài Bạch", "Tử Tức", "Phu Thê", "Huynh Đệ"
] as const;

export const CHINH_TINH = [
  "Tử Vi", "Thiên Cơ", "Thái Dương", "Vũ Khúc", "Thiên Đồng", "Liêm Trinh",
  "Thiên Phủ", "Thái Âm", "Tham Lang", "Cự Môn", "Thiên Tướng", "Thiên Lương", "Thất Sát", "Phá Quân"
] as const;

export const CUC: Record<string, number> = {
  "Thủy": 2,
  "Mộc": 3,
  "Kim": 4,
  "Thổ": 5,
  "Hỏa": 6
};

export const VONG_THAI_TUE = [
  "Thái Tuế", "Thiếu Dương", "Tang Môn", "Thiếu Âm", "Quan Phù", "Tử Phù",
  "Tuế Phá", "Long Đức", "Bạch Hổ", "Phúc Đức", "Điếu Khách", "Trực Phù"
] as const;

export const VONG_BAC_SY = [
  "Bác Sỹ", "Lực Sỹ", "Thanh Long", "Tiểu Hao", "Tướng Quân", "Tấu Thư",
  "Phi Liêm", "Hỷ Thần", "Bệnh Phù", "Đại Hao", "Phục Binh", "Quan Phủ"
] as const;

export const VONG_TRANG_SINH = [
  "Tràng Sinh", "Mộc Dục", "Quan Đới", "Lâm Quan", "Đế Vượng", "Suy",
  "Bệnh", "Tử", "Mộ", "Tuyệt", "Thai", "Dưỡng"
] as const;

export const KHOI_VIET_POS: Record<string, [number, number]> = {
  "Giáp": [1, 7],
  "Mậu": [1, 7],
  "Ất": [0, 8],
  "Kỷ": [0, 8],
  "Bính": [11, 9],
  "Đinh": [11, 9],
  "Canh": [6, 2],
  "Tân": [6, 2],
  "Nhâm": [3, 5],
  "Quý": [3, 5]
};

export const LOC_TON_MAP: Record<typeof THIEN_CAN[number], typeof DIA_CHI[number]> = {
  "Giáp": "Dần", "Ất": "Mão", "Bính": "Tỵ", "Đinh": "Ngọ", "Mậu": "Tỵ",
  "Kỷ": "Ngọ", "Canh": "Thân", "Tân": "Dậu", "Nhâm": "Hợi", "Quý": "Tý"
};

export const TRANG_SINH_START: Record<number, number> = {
  4: 5,  // Kim -> Tỵ (5)
  3: 11, // Mộc -> Hợi (11)
  6: 2,  // Hỏa -> Dần (2)
  2: 8,  // Thủy -> Thân (8)
  5: 8   // Thổ -> Thân (8)
};

export const STAR_SCORES: Record<string, number> = {
  "Tử Vi": 10, "Thiên Cơ": 8, "Thái Dương": 9, "Vũ Khúc": 8, "Thiên Đồng": 7, "Liêm Trinh": 6,
  "Thiên Phủ": 10, "Thái Âm": 8, "Tham Lang": 6, "Cự Môn": 5, "Thiên Tướng": 8, "Thiên Lương": 9, "Thất Sát": 7, "Phá Quân": 5,
  "Văn Xương": 2, "Văn Khúc": 2, "Tả Phù": 2, "Hữu Bật": 2, "Thiên Khôi": 3, "Thiên Việt": 3,
  "Lộc Tồn": 5, "Hóa Lộc": 5, "Hóa Quyền": 4, "Hóa Khoa": 4, "Hóa Kỵ": -5,
  "Kình Dương": -3, "Đà La": -3, "Hỏa Tinh": -3, "Linh Tinh": -3, "Địa Không": -5, "Địa Kiếp": -5,
  "Thái Tuế": 2, "Thiên Mã": 3, "Đào Hoa": 2, "Hồng Loan": 2, "Thiên Hỷ": 2,
  "Cô Thần": -2, "Quả Tú": -2, "Đại Hao": -2, "Tiểu Hao": -1
};

export const TRIET_MAP: Record<number, number[]> = {
  0: [8, 9], 5: [8, 9],
  1: [6, 7], 6: [6, 7],
  2: [4, 5], 7: [4, 5],
  3: [2, 3], 8: [2, 3],
  4: [0, 1], 9: [0, 1]
};

export const TU_HOA_MAP: Record<number, string[]> = {
  0: ["Liêm Trinh", "Phá Quân", "Vũ Khúc", "Thái Dương"],
  1: ["Thiên Cơ", "Thiên Lương", "Tử Vi", "Thái Âm"],
  2: ["Thiên Đồng", "Thiên Cơ", "Văn Xương", "Liêm Trinh"],
  3: ["Thái Âm", "Thiên Đồng", "Thiên Cơ", "Cự Môn"],
  4: ["Tham Lang", "Thái Âm", "Hữu Bật", "Thiên Cơ"],
  5: ["Vũ Khúc", "Tham Lang", "Thiên Lương", "Văn Khúc"],
  6: ["Thái Dương", "Vũ Khúc", "Thái Âm", "Thiên Đồng"],
  7: ["Cự Môn", "Thái Dương", "Văn Khúc", "Văn Xương"],
  8: ["Thiên Lương", "Tử Vi", "Tả Phù", "Vũ Khúc"],
  9: ["Phá Quân", "Cự Môn", "Thái Âm", "Tham Lang"]
};

export const HOA_TINH_KHOI: Record<number, number> = {
  2: 1, 0: 2, 1: 3, 3: 9
};

export const LINH_TINH_KHOI: Record<number, number> = {
  2: 3, 0: 10, 1: 10, 3: 10
};

export const LUU_HA_MAP: Record<number, number> = {
  0: 9, 1: 10, 2: 7, 3: 8, 4: 5,
  5: 6, 6: 8, 7: 3, 8: 11, 9: 2
};

export const THIEN_TRU_MAP: Record<number, number> = {
  0: 5, 1: 6, 2: 0, 3: 5, 4: 6,
  5: 8, 6: 2, 7: 9, 8: 9, 9: 10
};

export const DAO_HOA_MAP: Record<number, number> = {
  5: 6, 9: 6, 1: 6,
  11: 0, 3: 0, 7: 0,
  2: 3, 6: 3, 10: 3,
  8: 9, 0: 9, 4: 9
};

export const CO_QUA_MAP: Record<number, [number, number]> = {
  11: [2, 10], 0: [2, 10], 1: [2, 10],
  2: [5, 1], 3: [5, 1], 4: [5, 1],
  5: [8, 4], 6: [8, 4], 7: [8, 4],
  8: [11, 7], 9: [11, 7], 10: [11, 7]
};

export const PHA_TOAI_MAP: Record<number, number> = {
  0: 5, 1: 1, 2: 9,
  3: 5, 4: 1, 5: 9,
  6: 5, 7: 1, 8: 9,
  9: 5, 10: 1, 11: 9
};

export const THIEN_DUC_MAP: Record<number, number> = {
  0: 9, 1: 10, 2: 11,
  3: 0, 4: 1, 5: 2,
  6: 3, 7: 4, 8: 5,
  9: 6, 10: 7, 11: 8
};

export const VAN_TINH_MAP: Record<number, number> = {
  0: 5, 1: 6, 2: 8, 3: 9, 4: 8, 5: 9, 6: 11, 7: 0, 8: 2, 9: 3
};

export const VAN_KHUC_MAP: Record<number, number> = {
  0: 9, 1: 8, 2: 6, 3: 5, 4: 6, 5: 5, 6: 3, 7: 2, 8: 3, 9: 11
};

export const THIEN_QUAN_PHUC_MAP: Record<number, [number, number]> = {
  0: [7, 9], 1: [4, 8], 2: [5, 0], 3: [2, 11], 4: [3, 3],
  5: [9, 2], 6: [11, 6], 7: [9, 5], 8: [10, 6], 9: [6, 5]
};

export const THIEN_MA_MAP: Record<number, number> = {
  2: 8, 6: 8, 10: 8,
  8: 2, 0: 2, 4: 2,
  5: 11, 9: 11, 1: 11,
  11: 5, 3: 5, 7: 5
};

export const STAR_BRIGHTNESS: Record<string, string[]> = {
  "Tử Vi": ["B", "Đ", "M", "B", "V", "M", "M", "Đ", "M", "B", "V", "B"],
  "Thiên Cơ": ["Đ", "Đ", "V", "M", "V", "B", "M", "Đ", "Đ", "M", "V", "H"],
  "Thái Dương": ["H", "Đ", "V", "V", "V", "V", "M", "Đ", "B", "H", "H", "H"],
  "Vũ Khúc": ["V", "M", "V", "Đ", "M", "B", "B", "M", "V", "Đ", "M", "H"],
  "Thiên Đồng": ["V", "H", "M", "Đ", "H", "Đ", "H", "H", "M", "H", "H", "Đ"],
  "Liêm Trinh": ["V", "Đ", "M", "H", "V", "H", "V", "Đ", "V", "H", "V", "H"],
  "Thiên Phủ": ["M", "M", "M", "B", "M", "Đ", "V", "M", "M", "B", "M", "Đ"],
  "Thái Âm": ["V", "Đ", "H", "H", "H", "H", "H", "B", "Đ", "V", "M", "M"],
  "Tham Lang": ["H", "M", "Đ", "H", "V", "H", "H", "M", "Đ", "H", "V", "H"],
  "Cự Môn": ["V", "H", "M", "M", "H", "H", "V", "H", "M", "M", "H", "V"],
  "Thiên Tướng": ["V", "M", "M", "H", "V", "Đ", "V", "M", "M", "H", "V", "Đ"],
  "Thiên Lương": ["V", "M", "V", "Đ", "M", "H", "M", "Đ", "V", "H", "M", "H"],
  "Thất Sát": ["M", "Đ", "M", "H", "H", "V", "M", "Đ", "M", "H", "H", "V"],
  "Phá Quân": ["M", "V", "H", "H", "Đ", "H", "M", "V", "H", "H", "Đ", "H"]
};

export const PHU_TINH_BRIGHTNESS: Record<string, string[]> = {
  "Kình Dương": ["H", "Đ", "M", "H", "Đ", "M", "H", "Đ", "M", "H", "Đ", "M"],
  "Đà La":      ["H", "Đ", "H", "H", "Đ", "H", "H", "Đ", "H", "H", "Đ", "H"],
  "Hỏa Tinh":   ["H", "Đ", "M", "Đ", "Đ", "Đ", "M", "H", "H", "Đ", "M", "H"],
  "Linh Tinh":  ["H", "Đ", "M", "H", "Đ", "Đ", "M", "H", "H", "Đ", "H", "H"],
  "Địa Không":  ["H", "H", "Đ", "H", "H", "Đ", "H", "H", "Đ", "H", "H", "Đ"],
  "Địa Kiếp":   ["H", "H", "Đ", "H", "H", "Đ", "H", "H", "Đ", "H", "H", "Đ"],
  "Văn Xương":  ["Đ", "M", "H", "V", "Đ", "M", "H", "V", "Đ", "M", "Đ", "V"],
  "Văn Khúc":   ["Đ", "M", "B", "V", "Đ", "M", "H", "V", "Đ", "M", "H", "V"],
  "Lộc Tồn":    ["M", "H", "V", "M", "H", "V", "M", "H", "V", "M", "H", "V"],
  "Tả Phù":     ["V", "V", "B", "B", "M", "B", "V", "V", "B", "B", "M", "B"],
  "Hữu Bật":    ["V", "V", "B", "B", "M", "B", "V", "V", "B", "B", "M", "B"],
  "Tang Môn":   ["H", "H", "Đ", "Đ", "H", "H", "H", "H", "Đ", "Đ", "H", "H"],
  "Bạch Hổ":    ["H", "H", "Đ", "Đ", "H", "H", "H", "H", "Đ", "Đ", "H", "H"],
  "Tiểu Hao":   ["H", "H", "Đ", "Đ", "H", "H", "H", "H", "Đ", "Đ", "H", "H"],
  "Đại Hao":    ["H", "H", "Đ", "Đ", "H", "H", "H", "H", "Đ", "Đ", "H", "H"],
  "Thiên Khốc": ["Đ", "Đ", "H", "Đ", "H", "H", "Đ", "Đ", "H", "Đ", "H", "H"],
  "Thiên Hư":   ["Đ", "H", "H", "H", "H", "H", "Đ", "H", "H", "H", "H", "H"],
  "Thiên Hình": ["H", "H", "M", "M", "H", "H", "H", "H", "H", "M", "M", "H"],
  "Thiên Riêu": ["B", "H", "B", "M", "B", "B", "B", "H", "B", "M", "M", "M"],
  "Thiên Mã":   ["H", "H", "V", "H", "H", "V", "H", "H", "Đ", "H", "H", "H"]
};

export const NGU_HANH_CUNG: Record<string, string> = {
  "Tý": "Thủy", "Sửu": "Thổ", "Dần": "Mộc", "Mão": "Mộc",
  "Thìn": "Thổ", "Tỵ": "Hỏa", "Ngọ": "Hỏa", "Mùi": "Thổ",
  "Thân": "Kim", "Dậu": "Kim", "Tuất": "Thổ", "Hợi": "Thủy"
};

export const NGU_HANH_SAO: Record<string, string> = {
  "Tử Vi": "Thổ", "Thiên Cơ": "Mộc", "Thái Dương": "Hỏa",
  "Vũ Khúc": "Kim", "Thiên Đồng": "Thủy", "Liêm Trinh": "Hỏa",
  "Thiên Phủ": "Thổ", "Thái Âm": "Thủy", "Tham Lang": "Mộc",
  "Cự Môn": "Thủy", "Thiên Tướng": "Thủy", "Thiên Lương": "Mộc",
  "Thất Sát": "Kim", "Phá Quân": "Thủy"
};

export const NAP_AM_MAP: Record<string, string> = {
  "Giáp Tý": "Hải Trung Kim", "Ất Sửu": "Hải Trung Kim",
  "Bính Dần": "Lư Trung Hỏa", "Đinh Mão": "Lư Trung Hỏa",
  "Mậu Thìn": "Đại Lâm Mộc", "Kỷ Tỵ": "Đại Lâm Mộc",
  "Canh Ngọ": "Lộ Bàng Thổ", "Tân Mùi": "Lộ Bàng Thổ",
  "Nhâm Thân": "Kiếm Phong Kim", "Quý Dậu": "Kiếm Phong Kim",
  "Giáp Tuất": "Sơn Đầu Hỏa", "Ất Hợi": "Sơn Đầu Hỏa",
  "Bính Tý": "Giản Hạ Thủy", "Đinh Sửu": "Giản Hạ Thủy",
  "Mậu Dần": "Thành Đầu Thổ", "Kỷ Mão": "Thành Đầu Thổ",
  "Canh Thìn": "Bạch Lạp Kim", "Tân Tỵ": "Bạch Lạp Kim",
  "Nhâm Ngọ": "Dương Liễu Mộc", "Quý Mùi": "Dương Liễu Mộc",
  "Giáp Thân": "Tuyền Trung Thủy", "Ất Dậu": "Tuyền Trung Thủy",
  "Bính Tuất": "Ốc Thượng Thổ", "Đinh Hợi": "Ốc Thượng Thổ",
  "Mậu Tý": "Tích Lịch Hỏa", "Kỷ Sửu": "Tích Lịch Hỏa",
  "Canh Dần": "Tùng Bách Mộc", "Tân Mão": "Tùng Bách Mộc",
  "Nhâm Thìn": "Trường Lưu Thủy", "Quý Tỵ": "Trường Lưu Thủy",
  "Giáp Ngọ": "Sa Trung Kim", "Ất Mùi": "Sa Trung Kim",
  "Bính Thân": "Sơn Hạ Hỏa", "Đinh Dậu": "Sơn Hạ Hỏa",
  "Mậu Tuất": "Bình Địa Mộc", "Kỷ Hợi": "Bình Địa Mộc",
  "Canh Tý": "Bích Thượng Thổ", "Tân Sửu": "Bích Thượng Thổ",
  "Nhâm Dần": "Kim Bạc Kim", "Quý Mão": "Kim Bạc Kim",
  "Giáp Thìn": "Phú Đăng Hỏa", "Ất Tỵ": "Phú Đăng Hỏa",
  "Bính Ngọ": "Thiên Hà Thủy", "Đinh Mùi": "Thiên Hà Thủy",
  "Mậu Thân": "Đại Trạch Thổ", "Kỷ Dậu": "Đại Trạch Thổ",
  "Canh Tuất": "Thoa Xuyến Kim", "Tân Hợi": "Thoa Xuyến Kim",
  "Nhâm Tý": "Tang Đố Mộc", "Quý Sửu": "Tang Đố Mộc",
  "Giáp Dần": "Đại Khê Thủy", "Ất Mão": "Đại Khê Thủy",
  "Bính Thìn": "Sa Trung Thổ", "Đinh Tỵ": "Sa Trung Thổ",
  "Mậu Ngọ": "Thiên Thượng Hỏa", "Kỷ Mùi": "Thiên Thượng Hỏa",
  "Canh Thân": "Thạch Lựu Mộc", "Tân Dậu": "Thạch Lựu Mộc",
  "Nhâm Tuất": "Đại Hải Thủy", "Quý Hợi": "Đại Hải Thủy"
};

export type NguHanh = "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ" | "Không xác định";

export function napAmToNguHanh(napAm: string): NguHanh {
  if (napAm.includes("Kim")) return "Kim";
  if (napAm.includes("Mộc")) return "Mộc";
  if (napAm.includes("Thủy")) return "Thủy";
  if (napAm.includes("Hỏa")) return "Hỏa";
  if (napAm.includes("Thổ")) return "Thổ";
  return "Không xác định";
}

export function sinhKhac(hanh1: string, hanh2: string): string {
  const sinh: Record<string, string> = {
    "Kim": "Thủy", "Thủy": "Mộc", "Mộc": "Hỏa",
    "Hỏa": "Thổ", "Thổ": "Kim"
  };
  const khac: Record<string, string> = {
    "Kim": "Mộc", "Mộc": "Thổ", "Thổ": "Thủy",
    "Thủy": "Hỏa", "Hỏa": "Kim"
  };

  if (hanh1 === hanh2) return "đồng hành";
  if (sinh[hanh1] === hanh2) return "sinh";
  if (sinh[hanh2] === hanh1) return "được sinh";
  if (khac[hanh1] === hanh2) return "khắc";
  if (khac[hanh2] === hanh1) return "bị khắc";
  return "không xác định";
}

export const CACH_CUC_DAI_QUY = [
  "Quân Thần Khánh Hội", "Phủ Tướng Triều Viên", "Tử Phủ Vũ Tướng",
  "Nhật Nguyệt Tịnh Minh", "Nhật Xuất Lôi Môn (Thái Dương miếu ở Mão)",
  "Nguyệt Lãng Thiên Môn (Thái Âm miếu ở Hợi)", "Minh Châu Xuất Hải (Thái Âm ở Hợi + cát tinh)"
];
export const CACH_CUC_DAI_PHU = [
  "Vũ Khúc + Lộc Tồn đồng cung hoặc hội chiếu", "Thiên Phủ + Lộc Tồn",
  "Lộc Mã Giao Trì", "Song Lộc (Hóa Lộc + Lộc Tồn) triều Mệnh"
];
export const CACH_CUC_VO = [
  "Mã Đầu Đới Kiếm (Kình Dương ở Ngọ + miếu)", "Hỏa Tham / Linh Tham đồng cung", "Thất Sát triều đẩu"
];
export const CACH_CUC_HUNG = [
  "Mệnh Vô Chính Diệu + sát tinh", "Tài Ấm Giáp Ấn bị phá", "Hình Tù Giáp Ấn (Liêm Trinh + sát)",
  "Lộc Phùng Xung Phá", "Mã Đầu Đới Kiếm bị phá", "Tam Kỵ Trùng Phùng (tứ hóa bản mệnh/đại vận/lưu niên)",
  "Nhật Nguyệt phản bối (cả hai đều hãm)"
];
export const CACH_CUC_DAC_BIET = [
  "Cơ Nguyệt Đồng Lương (công chức, ổn định)", "Sát Phá Tham (khai phá, biến động)",
  "Cự Nhật (miệng lưỡi, truyền thông, nước ngoài)", "Liêm Tham (tình cảm phức tạp, nghệ thuật)"
];
