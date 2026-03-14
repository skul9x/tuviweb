export enum Gender {
  NAM = "NAM",
  NU = "NU"
}

export enum ReadingStyle {
  NGHIEM_TUC = "Nghiêm túc",
  DOI_THUONG = "Đời thường",
  HAI_HUOC = "Hài hước",
  KIEM_HIEP = "Kiếm hiệp",
  CHUA_LANH = "Chữa lành",
  CHUYEN_GIA = "Chuyên gia mệnh lý"
}

export enum ViewingMode {
  YEAR = "Theo năm",
  MONTH = "Theo tháng"
}

export interface UserInput {
  name: string;
  solarDay: number;
  solarMonth: number;
  solarYear: number;
  hour: number;
  gender: Gender;
  isLunar?: boolean;
  viewingYear: number;
  viewingMonth?: number;
  viewingMode?: ViewingMode;
  readingStyle?: ReadingStyle;
  phoneNumber?: string;
  lunarDayInput?: number;
  lunarMonthInput?: number;
  lunarYearInput?: number;
}

export interface CungInfo {
  index: number;
  name: string;
  chucNang: string;
  nguHanhCung: string;
  canChi: string;
  chinhTinh: string[];
  phuTinh: string[];
  score: number;
}

export interface UserInfoResult {
  name: string;
  gender: string;
  solarDate: string;
  time: string;
  lunarDate: string;
  canChi: string;
  cuc: string;
  menhTai: string;
  thanTai: string;
  viewingYear: number;
  viewingMonth: number;
  viewingMode: string;
  readingStyle: string;
  daiVanInfo: string;
  menhNguHanh: string;
  cucMenhRelation: string;
  daiVanFullList: string;
  amDuong: string;
  tieuHanCung: string;
  phiTinhTuHoa: string;
  phoneNumber?: string;
}

export interface LasoData {
  info: UserInfoResult;
  cung: CungInfo[];
  scores: number[];
}
