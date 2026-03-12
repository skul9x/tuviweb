import '../styles/input-form.css';

export interface UserInfo {
    name: string;
    phoneNumber?: string;
    isMale: boolean;
    day: number;
    month: number;
    year: number;
    hour: number;
    minute: number;
    isLunar: boolean;
    readingStyle?: string;
}

export class InputForm {
    private container: HTMLElement;
    private onSubmit: (data: UserInfo) => void;

    constructor(containerId: string, onSubmit: (data: UserInfo) => void) {
        const element = document.getElementById(containerId);
        if (!element) throw new Error(`Container with id ${containerId} not found`);
        this.container = element;
        this.onSubmit = onSubmit;
        this.render();
    }

    private render() {
        this.container.innerHTML = `
            <div class="glass-card" style="max-width: 500px; margin: 0 auto;">
                <h2 style="margin-bottom: var(--space-lg); text-align: center;">Thông Tin Lá Số</h2>
                
                <form id="tuvi-form" class="input-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name">Họ và Tên</label>
                            <input type="text" id="name" name="name" class="input-field" placeholder="Nhập họ tên..." required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Số Điện Thoại (Tùy chọn)</label>
                            <input type="tel" id="phone" name="phone" class="input-field" placeholder="Nhập số điện thoại...">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Giới Tính</label>
                        <div class="radio-group">
                            <label class="radio-item">
                                <input type="radio" name="gender" value="male" checked> Nam
                            </label>
                            <label class="radio-item">
                                <input type="radio" name="gender" value="female"> Nữ
                            </label>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="day">Ngày Sinh</label>
                            <select id="day" name="day" class="input-field" required>
                                ${this.generateOptions(1, 31)}
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="month">Tháng Sinh</label>
                            <select id="month" name="month" class="input-field" required>
                                ${this.generateOptions(1, 12)}
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="year">Năm Sinh</label>
                            <input type="number" id="year" name="year" class="input-field" value="1990" min="1900" max="2049" required>
                        </div>
                        <div class="form-group">
                            <label for="hour-select">Giờ Sinh</label>
                            <select id="hour-select" name="hour" class="input-field" required>
                                <option value="0">Tý (23g - 01g)</option>
                                <option value="2">Sửu (01g - 03g)</option>
                                <option value="4">Dần (03g - 05g)</option>
                                <option value="6">Mão (05g - 07g)</option>
                                <option value="8">Thìn (07g - 09g)</option>
                                <option value="10">Tỵ (09g - 11g)</option>
                                <option value="12">Ngọ (11g - 13g)</option>
                                <option value="14">Mùi (13g - 15g)</option>
                                <option value="16">Thân (15g - 17g)</option>
                                <option value="18">Dậu (17g - 19g)</option>
                                <option value="20">Tuất (19g - 21g)</option>
                                <option value="22">Hợi (21g - 23g)</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label>Lịch Biểu</label>
                            <div class="radio-group">
                                <label class="radio-item">
                                    <input type="radio" name="calendar" value="solar" checked> Dương Lịch
                                </label>
                                <label class="radio-item">
                                    <input type="radio" name="calendar" value="lunar"> Âm Lịch
                                </label>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="reading-style">Phong Cách Luận</label>
                            <select id="reading-style" name="readingStyle" class="input-field">
                                <option value="Nghiêm túc">Nghiêm túc</option>
                                <option value="Đời thường">Đời thường</option>
                                <option value="Hài hước">Hài hước</option>
                                <option value="Kiếm hiệp">Kiếm hiệp</option>
                                <option value="Chữa lành">Chữa lành</option>
                                <option value="Chuyên gia mệnh lý">Chuyên gia</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" class="btn-gold" style="width: 100%; margin-top: var(--space-md);">
                        An Sao & Luận Giải
                    </button>
                </form>
            </div>
        `;

        const form = document.getElementById('tuvi-form') as HTMLFormElement;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit(form);
        });
    }

    private generateOptions(start: number, end: number): string {
        let options = '';
        for (let i = start; i <= end; i++) {
            options += `<option value="${i}">${i < 10 ? '0' + i : i}</option>`;
        }
        return options;
    }

    private handleFormSubmit(form: HTMLFormElement) {
        const formData = new FormData(form);
        const data: UserInfo = {
            name: formData.get('name') as string,
            phoneNumber: formData.get('phone') as string,
            isMale: formData.get('gender') === 'male',
            day: parseInt(formData.get('day') as string),
            month: parseInt(formData.get('month') as string),
            year: parseInt(formData.get('year') as string),
            hour: parseInt(formData.get('hour') as string),
            minute: 0,
            isLunar: formData.get('calendar') === 'lunar',
            readingStyle: formData.get('readingStyle') as string
        };

        this.onSubmit(data);
    }
}
