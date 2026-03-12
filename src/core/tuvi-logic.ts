import { 
  DIA_CHI, 
  THIEN_CAN, 
  VONG_THAI_TUE, 
  VONG_BAC_SY, 
  VONG_TRANG_SINH, 
  TRANG_SINH_START, 
  KHOI_VIET_POS, 
  LOC_TON_MAP, 
  STAR_SCORES, 
  TRIET_MAP, 
  TU_HOA_MAP, 
  HOA_TINH_KHOI, 
  LINH_TINH_KHOI, 
  LUU_HA_MAP, 
  THIEN_TRU_MAP, 
  DAO_HOA_MAP, 
  CO_QUA_MAP, 
  THIEN_QUAN_PHUC_MAP, 
  THIEN_MA_MAP, 
  STAR_BRIGHTNESS, 
  PHU_TINH_BRIGHTNESS, 
  NGU_HANH_CUNG, 
  NAP_AM_MAP, 
  napAmToNguHanh, 
  sinhKhac, 
  VAN_TINH_MAP, 
  VAN_KHUC_MAP, 
  PHA_TOAI_MAP, 
  THIEN_DUC_MAP 
} from './constants';
import { LunarConverter } from './lunar-converter';
import type { 
  UserInput, 
  LasoData, 
  CungInfo, 
} from '../types';
import { 
  Gender, 
  ReadingStyle 
} from '../types';

export class TuViLogic {
  
  public anSao(input: UserInput): LasoData {
    // 1. Convert Lunar
    const solarDay = input.solarDay;
    const solarMonth = input.solarMonth;
    const solarYear = input.solarYear;
    
    const lunarResult = (input.lunarDayInput !== undefined && input.lunarMonthInput !== undefined && input.lunarYearInput !== undefined)
      ? { day: input.lunarDayInput, month: input.lunarMonthInput, year: input.lunarYearInput, isLeap: false }
      : LunarConverter.convertSolarToLunar(solarDay, solarMonth, solarYear);
    
    const lunarDay = lunarResult.day;
    const lunarMonth = lunarResult.month;
    const lunarYear = lunarResult.year;
    
    const canNamIndex = LunarConverter.getCanNamIndex(lunarYear);
    const chiNamIndex = LunarConverter.getChiNamIndex(lunarYear);
    const chiGioIndex = LunarConverter.getChiGioIndex(input.hour);
    
    // Init 12 cung
    const cungList: CungInfo[] = DIA_CHI.map((name, i) => ({
      index: i,
      name: name,
      chucNang: "",
      nguHanhCung: NGU_HANH_CUNG[name] || "",
      canChi: "",
      chinhTinh: [],
      phuTinh: [],
      score: 0
    }));
    
    // 2. An Cung Menh/Than
    const { menhIndex, thanIndex } = this.anCungMenhThan(cungList, lunarMonth, chiGioIndex);
    
    // 3. An Cuc
    const { cucName, cucNumber } = this.anCuc(menhIndex, canNamIndex);
    
    // 4. An Chinh Tinh
    this.anChinhTinh(cungList, cucNumber, lunarDay);
    
    // 5. An Phu Tinh
    this.anPhuTinhFull(
      cungList, 
      cucNumber,
      canNamIndex,
      chiNamIndex,
      chiGioIndex,
      lunarMonth,
      genderToInternal(input.gender)
    );
    
    this.anTuanTriet(cungList, canNamIndex, chiNamIndex);
    this.anTuHoa(cungList, canNamIndex);
    this.anThienHinh(cungList, lunarMonth);
    this.anHoaLinh(cungList, chiNamIndex, chiGioIndex, canNamIndex, genderToInternal(input.gender));
    
    this.anPhuTinhMoRong(cungList, canNamIndex, chiNamIndex, lunarMonth, lunarDay, chiGioIndex, menhIndex, thanIndex);

    // 5.8c An Sao Đại Vận
    const daiVanMeta = this.anSaoDaiVan(
      cungList,
      menhIndex,
      cucNumber,
      genderToInternal(input.gender),
      canNamIndex,
      input.viewingYear,
      input.solarYear
    );

    // 5.8d An Sao Lưu (Năm Xem)
    this.anSaoLuu(cungList, input.viewingYear);

    // 6. Calculate Can Chi for 12 palaces
    this.anCanChiCung(cungList, canNamIndex);

    // 5.9 Attach Brightness
    this.anDoSang(cungList);
    
    // 6. Calculate Scores
    const scores = this.calculateScores(cungList);

    // 7. Calculate Tieu Han
    const isYangYear = (canNamIndex % 2 === 0);
    const isThuanDV = (input.gender === Gender.NAM) ? isYangYear : !isYangYear;
    const tieuHanIdx = this.tinhTieuHan(chiNamIndex, input.viewingYear, input.solarYear, input.gender, isThuanDV);
    const tieuHanCungName = DIA_CHI[tieuHanIdx];

    // 8. Pre-compute Phi Tinh Tu Hoa
    const phiTinhData = this.precomputePhiTinh(cungList);

    // 9. Am Duong
    const isYangPalace = (menhIndex % 2 === 0);
    const isHoaHop = (isYangYear === isYangPalace);
    const harmonyStr = isHoaHop ? "Âm dương thuận lý" : "Âm dương nghịch lý";
    const amDuongStr = `${isYangYear ? "Dương" : "Âm"} ${input.gender === Gender.NAM ? "Nam" : "Nữ"}\n${harmonyStr}\nMệnh đóng tại cung ${isYangPalace ? "Dương" : "Âm"}`;

    // 10. Nap Am
    const canChiNamStr = LunarConverter.getCanChiNam(lunarYear);
    const napAmName = NAP_AM_MAP[canChiNamStr] || "";
    const menhHanh = napAmToNguHanh(napAmName);
    const menhNguHanhStr = napAmName ? `${napAmName} (${menhHanh})` : "";

    // 11. Cuc-Menh Relation
    const cucNguHanh = cucName.split(" ")[0] || "";
    let cucMenhRel = "";
    if (cucNguHanh && menhHanh && menhHanh !== "Không xác định") {
        const rel = sinhKhac(menhHanh, cucNguHanh);
        cucMenhRel = `Mệnh (${menhHanh}) ${rel} Cục (${cucNguHanh})`;
    }

    // 12. Full Dai Van List
    const fullDaiVanList = this.buildFullDaiVanList(menhIndex, cucNumber, isThuanDV, canNamIndex);
    
    return {
      info: {
        name: input.name,
        gender: input.gender === Gender.NAM ? "Nam" : "Nữ",
        solarDate: `${solarDay}/${solarMonth}/${solarYear}`,
        time: `${input.hour}h (Giờ ${LunarConverter.getChiGio(input.hour)})`,
        lunarDate: `${lunarDay}/${lunarMonth}/${lunarYear}`,
        canChi: canChiNamStr,
        cuc: cucName,
        menhTai: DIA_CHI[menhIndex],
        thanTai: DIA_CHI[thanIndex],
        viewingYear: input.viewingYear,
        viewingMonth: input.viewingMonth || 0,
        viewingMode: input.viewingMode || "YEAR",
        readingStyle: input.readingStyle || ReadingStyle.NGHIEM_TUC,
        daiVanInfo: daiVanMeta,
        menhNguHanh: menhNguHanhStr,
        cucMenhRelation: cucMenhRel,
        daiVanFullList: fullDaiVanList,
        amDuong: amDuongStr,
        tieuHanCung: tieuHanCungName,
        phiTinhTuHoa: phiTinhData,
        phoneNumber: input.phoneNumber
      },
      cung: cungList,
      scores: scores
    };
  }

  private anCungMenhThan(cungList: CungInfo[], lunarMonth: number, chiGioIndex: number) {
    const start = 2; // Dần
    const monthStep = lunarMonth - 1;
    const hourStep = chiGioIndex;
    
    let menhPos = (start + monthStep - hourStep) % 12;
    if (menhPos < 0) menhPos += 12;
    
    let thanPos = (start + monthStep + hourStep) % 12;
    if (thanPos < 0) thanPos += 12;
    
    const chucNangList = [
      "Mệnh", "Phụ Mẫu", "Phúc Đức", "Điền Trạch", "Quan Lộc", "Nô Bộc",
      "Thiên Di", "Tật Ách", "Tài Bạch", "Tử Tức", "Phu Thê", "Huynh Đệ"
    ];

    for (let i = 0; i < 12; i++) {
      let p = (menhPos + i) % 12;
      const funcName = chucNangList[i];
      cungList[p].chucNang = (p === thanPos) ? `${funcName} [Thân cư]` : funcName;
    }
    
    return { menhIndex: menhPos, thanIndex: thanPos };
  }

  private anCuc(menhIndex: number, canNamIndex: number) {
    const startCans: Record<number, number> = {
      0: 2, 1: 4, 2: 6, 3: 8, 4: 0,
      5: 2, 6: 4, 7: 6, 8: 8, 9: 0
    };
    const startCanDan = startCans[canNamIndex] ?? 2;
    
    let dist = (menhIndex - 2) % 12;
    if (dist < 0) dist += 12;
    
    const canMenhIndex = (startCanDan + dist) % 10;
    const chiMenhIndex = menhIndex;
    
    const valCan = Math.floor(canMenhIndex / 2) + 1;
    let valChi = 0;
    if ([0, 1, 6, 7].includes(chiMenhIndex)) valChi = 0;
    else if ([2, 3, 8, 9].includes(chiMenhIndex)) valChi = 1;
    else valChi = 2;
    
    let total = valCan + valChi;
    if (total > 5) total -= 5;
    
    switch (total) {
      case 1: return { cucName: "Kim Tứ Cục", cucNumber: 4 };
      case 2: return { cucName: "Thủy Nhị Cục", cucNumber: 2 };
      case 3: return { cucName: "Hỏa Lục Cục", cucNumber: 6 };
      case 4: return { cucName: "Thổ Ngũ Cục", cucNumber: 5 };
      case 5: return { cucName: "Mộc Tam Cục", cucNumber: 3 };
      default: return { cucName: "Thủy Nhị Cục", cucNumber: 2 };
    }
  }

  private anChinhTinh(cungList: CungInfo[], cucNumber: number, day: number) {
    let tuViPos = 0;
    const q = Math.floor(day / cucNumber);
    const r = day % cucNumber;
    
    if (r === 0) {
      tuViPos = (2 + (q - 1)) % 12;
    } else {
      const extra = cucNumber - r;
      const fakeDay = day + extra;
      const newQ = Math.floor(fakeDay / cucNumber);
      let basePos = (2 + (newQ - 1)) % 12;
      
      if (extra % 2 !== 0) {
        basePos = (basePos - extra) % 12;
        if (basePos < 0) basePos += 12;
      } else {
        basePos = (basePos + extra) % 12;
      }
      tuViPos = basePos;
    }
    
    cungList[tuViPos].chinhTinh.push("Tử Vi");
    
    const tuViOffsets: [string, number][] = [
      ["Thiên Cơ", 1], ["Thái Dương", 3], ["Vũ Khúc", 4], ["Thiên Đồng", 5], ["Liêm Trinh", 8]
    ];
    
    for (const [star, offset] of tuViOffsets) {
      let pos = (tuViPos - offset) % 12;
      if (pos < 0) pos += 12;
      cungList[pos].chinhTinh.push(star);
    }
    
    let thienFuPos = (4 - tuViPos) % 12;
    if (thienFuPos < 0) thienFuPos += 12;
    cungList[thienFuPos].chinhTinh.push("Thiên Phủ");
    
    const thienFuOffsets: [string, number][] = [
      ["Thái Âm", 1], ["Tham Lang", 2], ["Cự Môn", 3], ["Thiên Tướng", 4], ["Thiên Lương", 5], ["Thất Sát", 6], ["Phá Quân", 10]
    ];
    
    for (const [star, offset] of thienFuOffsets) {
      let pos = (thienFuPos + offset) % 12;
      cungList[pos].chinhTinh.push(star);
    }
  }

  private anPhuTinhFull(
    cungList: CungInfo[], 
    cucNumber: number,
    canNamIndex: number,
    chiNamIndex: number,
    hourIndex: number,
    lunarMonth: number,
    gender: number // 0: Nam, 1: Nu
  ) {
    const isYangYear = (canNamIndex % 2 === 0);
    const isThuan = (gender === 0) ? isYangYear : !isYangYear;
    
    // Thai Tue
    for (let i = 0; i < 12; i++) {
      const pos = (chiNamIndex + i) % 12;
      cungList[pos].phuTinh.push(VONG_THAI_TUE[i]);
    }
    
    // Loc Ton
    const canNamStr = THIEN_CAN[canNamIndex];
    const locTonChi = LOC_TON_MAP[canNamStr as typeof THIEN_CAN[number]] || "Dần";
    const locTonIdx = DIA_CHI.indexOf(locTonChi as any);
    
    cungList[locTonIdx].phuTinh.push("Lộc Tồn");
    cungList[(locTonIdx + 1) % 12].phuTinh.push("Kình Dương");
    let daLaPos = (locTonIdx - 1) % 12;
    if (daLaPos < 0) daLaPos += 12;
    cungList[daLaPos].phuTinh.push("Đà La");
    
    // Vong Bac Sy
    for (let i = 0; i < 12; i++) {
      let pos = isThuan ? (locTonIdx + i) % 12 : (locTonIdx - i) % 12;
      if (pos < 0) pos += 12;
      cungList[pos].phuTinh.push(VONG_BAC_SY[i]);
    }
    
    // Vong Trang Sinh
    const tsStart = TRANG_SINH_START[cucNumber] ?? 2;
    for (let i = 0; i < 12; i++) {
      let pos = isThuan ? (tsStart + i) % 12 : (tsStart - i) % 12;
      if (pos < 0) pos += 12;
      cungList[pos].phuTinh.push(VONG_TRANG_SINH[i]);
    }
    
    // Khoi Viet
    const kv = KHOI_VIET_POS[canNamStr];
    if (kv) {
      cungList[kv[0]].phuTinh.push("Thiên Khôi");
      cungList[kv[1]].phuTinh.push("Thiên Việt");
    }
    
    // Ta Huu
    cungList[(4 + lunarMonth - 1) % 12].phuTinh.push("Tả Phù");
    let hbPos = (10 - (lunarMonth - 1)) % 12;
    if (hbPos < 0) hbPos += 12;
    cungList[hbPos].phuTinh.push("Hữu Bật");
    
    // Xuong Khuc
    let vxPos = (10 - hourIndex) % 12;
    if (vxPos < 0) vxPos += 12;
    cungList[vxPos].phuTinh.push("Văn Xương");
    cungList[(4 + hourIndex) % 12].phuTinh.push("Văn Khúc");
    
    // Thien Ma
    const maPos = THIEN_MA_MAP[chiNamIndex];
    if (maPos !== undefined) cungList[maPos].phuTinh.push("Thiên Mã");
    
    // Khoc Hu (Starting from Ngo 6)
    let khocPos = (6 - chiNamIndex) % 12;
    if (khocPos < 0) khocPos += 12;
    cungList[khocPos].phuTinh.push("Thiên Khốc");
    cungList[(6 + chiNamIndex) % 12].phuTinh.push("Thiên Hư");
    
    // Khong Kiep (Starting from Hoi 11)
    cungList[(11 + hourIndex) % 12].phuTinh.push("Địa Kiếp");
    let dkPos = (11 - hourIndex) % 12;
    if (dkPos < 0) dkPos += 12;
    cungList[dkPos].phuTinh.push("Địa Không");
  }

  private anTuanTriet(cungList: CungInfo[], canNamIndex: number, chiNamIndex: number) {
    const triet = TRIET_MAP[canNamIndex];
    if (triet) triet.forEach(idx => cungList[idx].phuTinh.push("Triệt"));
    
    let giapChiIndex = (chiNamIndex - canNamIndex) % 12;
    if (giapChiIndex < 0) giapChiIndex += 12;
    
    [2, 1].forEach(offset => {
      let pos = (giapChiIndex - offset) % 12;
      if (pos < 0) pos += 12;
      cungList[pos].phuTinh.push("Tuần");
    });
  }

  private anTuHoa(cungList: CungInfo[], canNamIndex: number) {
    const stars = TU_HOA_MAP[canNamIndex];
    if (stars && stars.length === 4) {
      const suffixes = ["Hóa Lộc", "Hóa Quyền", "Hóa Khoa", "Hóa Kỵ"];
      stars.forEach((starName, i) => {
        cungList.forEach(cung => {
          if (cung.chinhTinh.includes(starName) || cung.phuTinh.includes(starName)) {
            cung.phuTinh.push(suffixes[i]);
          }
        });
      });
    }
  }

  private anThienHinh(cungList: CungInfo[], lunarMonth: number) {
    const pos = (9 + lunarMonth - 1) % 12;
    cungList[pos].phuTinh.push("Thiên Hình");
  }

  private anHoaLinh(cungList: CungInfo[], chiNamIndex: number, hourIndex: number, canNamIndex: number, gender: number) {
    const groupMod = chiNamIndex % 4;
    const isYangYear = (canNamIndex % 2 === 0);
    const isThuan = (gender === 0 && isYangYear) || (gender === 1 && !isYangYear);
    
    const hoaStart = HOA_TINH_KHOI[groupMod] ?? 2;
    let hoaPos = isThuan ? (hoaStart + hourIndex) % 12 : (hoaStart - hourIndex) % 12;
    if (hoaPos < 0) hoaPos += 12;
    cungList[hoaPos].phuTinh.push("Hỏa Tinh");
    
    const linhStart = LINH_TINH_KHOI[groupMod] ?? 10;
    let linhPos = isThuan ? (linhStart - hourIndex) % 12 : (linhStart + hourIndex) % 12;
    if (linhPos < 0) linhPos += 12;
    cungList[linhPos].phuTinh.push("Linh Tinh");
  }

  private anPhuTinhMoRong(
    cungList: CungInfo[], 
    canNamIndex: number,
    chiNamIndex: number,
    lunarMonth: number,
    lunarDay: number,
    hourIndex: number,
    menhIndex: number,
    thanIndex: number
  ) {
    // Dao Hoa
    const dhPos = DAO_HOA_MAP[chiNamIndex];
    if (dhPos !== undefined) cungList[dhPos].phuTinh.push("Đào Hoa");
    
    // Thien Khong (Before Thai Tue 1 pos - same as Thieu Duong)
    const tdPos = (chiNamIndex + 1) % 12;
    if (!cungList[tdPos].phuTinh.includes("Thiên Không")) cungList[tdPos].phuTinh.push("Thiên Không");
    
    // Kiep Sat
    const ksMap: Record<number, number> = { 5: 2, 9: 2, 1: 2, 11: 8, 3: 8, 7: 8, 2: 11, 6: 11, 10: 11, 8: 5, 0: 5, 4: 5 };
    const ksPos = ksMap[chiNamIndex];
    if (ksPos !== undefined) cungList[ksPos].phuTinh.push("Kiếp Sát");

    // Hong Loan
    let hlPos = (3 - chiNamIndex) % 12;
    if (hlPos < 0) hlPos += 12;
    cungList[hlPos].phuTinh.push("Hồng Loan");
    cungList[(hlPos + 6) % 12].phuTinh.push("Thiên Hỷ");
    
    // Co Qua
    const cq = CO_QUA_MAP[chiNamIndex];
    if (cq) {
      cungList[cq[0]].phuTinh.push("Cô Thần");
      cungList[cq[1]].phuTinh.push("Quả Tú");
    }
    
    // Thien Quan/Phuc
    const qp = THIEN_QUAN_PHUC_MAP[canNamIndex];
    if (qp) {
      cungList[qp[0]].phuTinh.push("Thiên Quan");
      cungList[qp[1]].phuTinh.push("Thiên Phúc");
    }
    
    // Long Tri, Phuong Cac, Giai Than
    cungList[(4 + chiNamIndex) % 12].phuTinh.push("Long Trì");
    let pcPos = (10 - chiNamIndex) % 12;
    if (pcPos < 0) pcPos += 12;
    cungList[pcPos].phuTinh.push("Phượng Các");
    cungList[pcPos].phuTinh.push("Giải Thần");

    // Thien Giai, Dia Giai
    cungList[(8 + lunarMonth - 1) % 12].phuTinh.push("Thiên Giải");
    cungList[(7 + lunarMonth - 1) % 12].phuTinh.push("Địa Giải");
    
    // Thien Rieu, Thien Y
    const rieuPos = (1 + lunarMonth - 1) % 12;
    cungList[rieuPos].phuTinh.push("Thiên Riêu");
    cungList[rieuPos].phuTinh.push("Thiên Y");

    // Luu Ha, Thien Tru
    const lh = LUU_HA_MAP[canNamIndex];
    if (lh !== undefined) cungList[lh].phuTinh.push("Lưu Hà");
    const tt = THIEN_TRU_MAP[canNamIndex];
    if (tt !== undefined) cungList[tt].phuTinh.push("Thiên Trù");

    // Hoa Cai
    const hcMap: Record<number, number> = { 2: 10, 6: 10, 10: 10, 8: 4, 0: 4, 4: 4, 5: 1, 9: 1, 1: 1, 11: 7, 3: 7, 7: 7 };
    const hcPos = hcMap[chiNamIndex];
    if (hcPos !== undefined) cungList[hcPos].phuTinh.push("Hoa Cái");
    
    // Quoc An, Duong Phu
    const canNamStr = THIEN_CAN[canNamIndex];
    const locTonIdx = DIA_CHI.indexOf(LOC_TON_MAP[canNamStr as typeof THIEN_CAN[number]] || "Dần");
    cungList[(locTonIdx + 8) % 12].phuTinh.push("Quốc Ấn");
    cungList[(locTonIdx + 5) % 12].phuTinh.push("Đường Phù");
    
    // Phong Cao
    cungList[(2 + hourIndex) % 12].phuTinh.push("Phong Cáo");
    
    // An Quang, Thien Quy
    let vxPos = (10 - hourIndex) % 12;
    if (vxPos < 0) vxPos += 12;
    cungList[(vxPos + lunarDay - 2 + 12) % 12].phuTinh.push("Ân Quang");
    cungList[( (4 + hourIndex) % 12 - lunarDay + 2 + 12*5 ) % 12].phuTinh.push("Thiên Quý");
    
    // Thien Tai/Tho
    cungList[(menhIndex + chiNamIndex) % 12].phuTinh.push("Thiên Tài");
    cungList[(thanIndex + chiNamIndex) % 12].phuTinh.push("Thiên Thọ");
    
    // Dau Quan
    let dqPos = (chiNamIndex - (lunarMonth - 1) + hourIndex) % 12;
    if (dqPos < 0) dqPos += 12;
    cungList[dqPos].phuTinh.push("Đẩu Quân");
    
    // Thien Duc/Nguyet Duc/Phai Toai/Van Tinh
    const td = THIEN_DUC_MAP[chiNamIndex as any];
    if (td !== undefined) cungList[td].phuTinh.push("Thiên Đức");
    cungList[(5 + chiNamIndex) % 12].phuTinh.push("Nguyệt Đức");
    const vt = VAN_TINH_MAP[canNamIndex as any];
    if (vt !== undefined) cungList[vt].phuTinh.push("Văn Tinh");
    const pt = PHA_TOAI_MAP[chiNamIndex as any];
    if (pt !== undefined) cungList[pt].phuTinh.push("Phá Toái");
    
    // Tam Thai, Bat Toa
    const tpPos = (4 + lunarMonth - 1) % 12;
    cungList[(tpPos + lunarDay - 1) % 12].phuTinh.push("Tam Thai");
    let hbPos = (10 - (lunarMonth - 1)) % 12;
    if (hbPos < 0) hbPos += 12;
    let btnPos = (hbPos - (lunarDay - 1)) % 12;
    if (btnPos < 0) btnPos += 12;
    cungList[btnPos].phuTinh.push("Bát Tọa");
    
    cungList[(6 + hourIndex) % 12].phuTinh.push("Thai Phụ");
    cungList[4].phuTinh.push("Thiên La");
    cungList[10].phuTinh.push("Địa Võng");
    
    // Thien Thuong / Thien Su
    const nbIdx = cungList.findIndex(c => c.chucNang.includes("Nô Bộc"));
    if (nbIdx !== -1) cungList[nbIdx].phuTinh.push("Thiên Thương");
    const taIdx = cungList.findIndex(c => c.chucNang.includes("Tật Ách"));
    if (taIdx !== -1) cungList[taIdx].phuTinh.push("Thiên Sứ");
  }

  private anSaoDaiVan(
    cungList: CungInfo[], 
    menhIndex: number, 
    cucNumber: number, 
    gender: number, 
    canNamIndex: number, 
    viewingYear: number,
    birthYear: number
  ): string {
    const isYangYear = (canNamIndex % 2 === 0);
    const isThuan = (gender === 0) ? isYangYear : !isYangYear;
    
    const currentAge = viewingYear - birthYear + 1;
    const decadeIdx = currentAge >= cucNumber ? Math.floor((currentAge - cucNumber) / 10) : -1;
    
    if (decadeIdx < 0) {
      return `Chưa vào đại vận (đại vận đầu tiên bắt đầu từ tuổi ${cucNumber} tại cung ${DIA_CHI[menhIndex]}).`;
    }
    
    let daiVanPos = isThuan ? (menhIndex + decadeIdx) % 12 : (menhIndex - decadeIdx) % 12;
    if (daiVanPos < 0) daiVanPos += 12;
    
    cungList[daiVanPos].phuTinh.push("[Cung Đại Vận]");
    
    const startCanDan = [2, 4, 6, 8, 0][canNamIndex % 5];
    let distFromDan = (daiVanPos - 2) % 12;
    if (distFromDan < 0) distFromDan += 12;
    const canDaiVan = (startCanDan + distFromDan) % 10;
    const canStr = THIEN_CAN[canDaiVan];
    
    // An stars for DV
    const locTonChi = LOC_TON_MAP[canStr] || "Dần";
    const dvLocPos = DIA_CHI.indexOf(locTonChi as any);
    cungList[dvLocPos].phuTinh.push("ĐV. Lộc Tồn");
    cungList[(dvLocPos + 1) % 12].phuTinh.push("ĐV. Kình Dương");
    let dvDaPos = (dvLocPos - 1) % 12;
    if (dvDaPos < 0) dvDaPos += 12;
    cungList[dvDaPos].phuTinh.push("ĐV. Đà La");
    
    const kv = KHOI_VIET_POS[canStr];
    if (kv) {
      cungList[kv[0]].phuTinh.push("ĐV. Thiên Khôi");
      cungList[kv[1]].phuTinh.push("ĐV. Thiên Việt");
    }
    
    const vx = VAN_TINH_MAP[canDaiVan];
    if (vx !== undefined) cungList[vx].phuTinh.push("ĐV. Văn Xương");
    const vk = VAN_KHUC_MAP[canDaiVan];
    if (vk !== undefined) cungList[vk].phuTinh.push("ĐV. Văn Khúc");
    const tm = THIEN_MA_MAP[daiVanPos];
    if (tm !== undefined) cungList[tm].phuTinh.push("ĐV. Thiên Mã");
    
    const tuHoa = TU_HOA_MAP[canDaiVan];
    if (tuHoa && tuHoa.length === 4) {
      const dvSuffixes = ["(ĐV. Hóa Lộc)", "(ĐV. Hóa Quyền)", "(ĐV. Hóa Khoa)", "(ĐV. Hóa Kỵ)"];
      tuHoa.forEach((s, i) => {
        cungList.forEach(c => {
          if (c.chinhTinh.includes(s) || c.phuTinh.includes(s)) c.phuTinh.push(dvSuffixes[i]);
        });
      });
    }

    const startAge = cucNumber + decadeIdx * 10;
    const endAge = startAge + 9;
    return `Đại vận thứ ${decadeIdx + 1} (${startAge}–${endAge} tuổi), Can: ${canStr}, Cung: ${DIA_CHI[daiVanPos]}, Hướng: ${isThuan ? "Thuận" : "Nghịch"}`;
  }

  private anSaoLuu(cungList: CungInfo[], viewingYear: number) {
    const canNamXemIdx = LunarConverter.getCanNamIndex(viewingYear);
    const chiNamXemIdx = LunarConverter.getChiNamIndex(viewingYear);
    const canStr = THIEN_CAN[canNamXemIdx];
    
    cungList[chiNamXemIdx].phuTinh.push("L.Thái Tuế");
    cungList[(chiNamXemIdx + 2) % 12].phuTinh.push("L.Tang Môn");
    cungList[(chiNamXemIdx + 8) % 12].phuTinh.push("L.Bạch Hổ");
    
    const lLocChi = LOC_TON_MAP[canStr as typeof THIEN_CAN[number]] || "Dần";
    const lLocIdx = DIA_CHI.indexOf(lLocChi as any);
    cungList[lLocIdx].phuTinh.push("L.Lộc Tồn");
    cungList[(lLocIdx + 1) % 12].phuTinh.push("L.Kình Dương");
    let lDaPos = (lLocIdx - 1) % 12;
    if (lDaPos < 0) lDaPos += 12;
    cungList[lDaPos].phuTinh.push("L.Đà La");
    
    const lTm = THIEN_MA_MAP[chiNamXemIdx];
    if (lTm !== undefined) cungList[lTm].phuTinh.push("L.Thiên Mã");
    
    let lKhocPos = (6 - chiNamXemIdx + 12) % 12;
    cungList[lKhocPos].phuTinh.push("L.Thiên Khốc");
    cungList[(6 + chiNamXemIdx) % 12].phuTinh.push("L.Thiên Hư");
    
    const dhPos = DAO_HOA_MAP[chiNamXemIdx];
    if (dhPos !== undefined) {
      cungList[dhPos].phuTinh.push("L.Đào Hoa");
      const tdIdx = (chiNamXemIdx + 1) % 12;
      cungList[tdIdx].phuTinh.push("L.Thiên Không");
      
      let hlPos = (3 - chiNamXemIdx + 12) % 12;
      cungList[hlPos].phuTinh.push("L.Hồng Loan");
    }
    
    const kv = KHOI_VIET_POS[canStr];
    if (kv) {
      cungList[kv[0]].phuTinh.push("L.Thiên Khôi");
      cungList[kv[1]].phuTinh.push("L.Thiên Việt");
    }
    
    const vx = VAN_TINH_MAP[canNamXemIdx];
    if (vx !== undefined) cungList[vx].phuTinh.push("L.Văn Xương");
    const vk = VAN_KHUC_MAP[canNamXemIdx];
    if (vk !== undefined) cungList[vk].phuTinh.push("L.Văn Khúc");
    
    cungList[(5 + chiNamXemIdx) % 12].phuTinh.push("L.Nguyệt Đức");
    cungList[(chiNamXemIdx + 9) % 12].phuTinh.push("L.Long Đức");
    cungList[(chiNamXemIdx + 9) % 12].phuTinh.push("L.Thiên Đức");
    cungList[(chiNamXemIdx + 11) % 12].phuTinh.push("L.Phúc Đức");
  }

  private anDoSang(cungList: CungInfo[]) {
    cungList.forEach((cung, i) => {
      const hasTriet = cung.phuTinh.includes("Triệt");
      const hasTuan = cung.phuTinh.includes("Tuần");
      
      cung.chinhTinh = cung.chinhTinh.map(s => {
        const brightness = (STAR_BRIGHTNESS[s as any] as string[])?.[i] || "";
        let res = `${s} (${brightness === "B" ? "Bình" : brightness})`;
        if (hasTriet) res += " [BỊ TRIỆT LỘ]";
        if (hasTuan) res += " [BỊ TUẦN KHÔNG]";
        return res;
      });
      
      cung.phuTinh = cung.phuTinh.map(s => {
        let actual = s;
        let prefix = "";
        if (s.startsWith("L.")) { prefix = "L."; actual = s.substring(2); }
        else if (s.startsWith("ĐV.")) { prefix = "ĐV."; actual = s.substring(3); }
        
        const b = (PHU_TINH_BRIGHTNESS[actual as any] as string[])?.[i];
        return b ? `${prefix}${actual} (${b === "B" ? "Bình" : b})` : s;
      });
    });
  }

  private calculateScores(cungList: CungInfo[]): number[] {
    return cungList.map(c => {
      let s = 5;
      c.chinhTinh.forEach(ct => {
        const name = ct.split(" (")[0];
        s += STAR_SCORES[name] || 0;
      });
      c.phuTinh.forEach(pt => {
        const name = pt.replace("L.", "").replace("ĐV.", "").split(" (")[0];
        s += STAR_SCORES[name] || 0;
      });
      c.score = s;
      return s;
    });
  }

  private buildFullDaiVanList(menhIndex: number, cucNumber: number, isThuan: boolean, canNamIndex: number): string {
    const startCanDan = [2, 4, 6, 8, 0][canNamIndex % 5];
    const list: string[] = [];
    for (let i = 0; i < 10; i++) {
        const s = cucNumber + i * 10;
        const e = s + 9;
        let p = isThuan ? (menhIndex + i) % 12 : (menhIndex - i) % 12;
        if (p < 0) p += 12;
        let can = (startCanDan + (p - 2 + 12) % 12) % 10;
        list.push(`${s}–${e}: ${THIEN_CAN[can]} ${DIA_CHI[p]}`);
    }
    return list.join(" | ");
  }

  private anCanChiCung(cungList: CungInfo[], canNamIndex: number) {
    const startCanDan = [2, 4, 6, 8, 0][canNamIndex % 5];
    cungList.forEach((cung, i) => {
        const can = (startCanDan + (i - 2 + 12) % 12) % 10;
        cung.canChi = `${THIEN_CAN[can]} ${DIA_CHI[i]}`;
    });
  }

  private tinhTieuHan(chiNamSinh: number, viewingYear: number, birthYear: number, gender: Gender, _isThuan: boolean): number {
    const age = viewingYear - birthYear + 1;
    let startPos = 0;
    if ([2, 6, 10].includes(chiNamSinh)) startPos = 4;
    else if ([8, 0, 4].includes(chiNamSinh)) startPos = 10;
    else if ([5, 9, 1].includes(chiNamSinh)) startPos = 7;
    else startPos = 1;

    const direction = (gender === Gender.NAM) ? 1 : -1;
    let pos = (startPos + (age - 1) * direction) % 12;
    if (pos < 0) pos += 12;
    return pos;
  }

  private precomputePhiTinh(cungList: CungInfo[]): string {
    let res = "";
    const hoa = ["Lộc", "Quyền", "Khoa", "Kỵ"];
    cungList.forEach(c => {
        const can = c.canChi.split(" ")[0];
        const idx = THIEN_CAN.indexOf(can as any);
        if (idx !== -1) {
            const targets = TU_HOA_MAP[idx] || [];
            const phi: string[] = [];
            targets.forEach((star, i) => {
                const targetCung = cungList.find(tc => tc.chinhTinh.some(s => s.startsWith(star)) || tc.phuTinh.some(s => s.startsWith(star)));
                if (targetCung) phi.push(`H.${hoa[i]}→${targetCung.name}`);
            });
            if (phi.length) res += `${c.name}(${can}): ${phi.join(", ")}\n`;
        }
    });
    return res;
  }
}

function genderToInternal(g: Gender): number {
  return g === Gender.NAM ? 0 : 1;
}
