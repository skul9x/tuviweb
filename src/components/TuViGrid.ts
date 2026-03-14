import '../styles/tuvi-grid.css';
import type { LasoData, CungInfo } from '../types';

export class TuViGrid {
    private container: HTMLElement;

    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) throw new Error(`Container with id ${containerId} not found`);
        this.container = element;
    }

    public render(data: LasoData) {
        this.container.innerHTML = '';
        
        const gridWrapper = document.createElement('div');
        gridWrapper.className = 'tuvi-grid';

        // Order of palaces in standard Tu Vi layout (12 specific positions + 1 center)
        // Position mapping: [index_of_cung, grid_row, grid_col]
        const layout = [
            [5, 1, 1], [6, 1, 2], [7, 1, 3], [8, 1, 4], // Tỵ, Ngọ, Mùi, Thân
            [4, 2, 1],                      [9, 2, 4], // Thìn, Dậu
            [3, 3, 1],                      [10, 3, 4], // Mão, Tuất
            [2, 4, 1], [1, 4, 2], [0, 4, 3], [11, 4, 4]  // Dần, Sửu, Tý, Hợi
        ];

        // Create Palace Cells
        layout.forEach(([cungIdx, row, col]) => {
            const cung = data.cung[cungIdx];
            const cell = this.createPalaceCell(cung, row, col);
            gridWrapper.appendChild(cell);
        });

        // Create Center Area
        const center = document.createElement('div');
        center.className = 'center-area';
        center.innerHTML = `
            <div class="center-logo">☯</div>
            <h3 style="color: var(--gold-primary); margin-bottom: 4px;">${data.info.name}</h3>
            <p style="font-size: 11px; color: var(--text-muted);">${data.info.amDuong}</p>
            <p style="font-size: 13px; font-weight: 600; margin: 4px 0;">${data.info.menhNguHanh}</p>
            <p style="font-size: 11px; color: var(--gold-dark);">${data.info.cuc}</p>
            <div style="margin-top: 10px; font-size: 10px; border-top: 1px solid var(--gold-glow); padding-top: 6px;">
                ${data.info.canChi} | ${data.info.solarDate}
            </div>
        `;
        gridWrapper.appendChild(center);

        this.container.appendChild(gridWrapper);
    }

    private createPalaceCell(cung: CungInfo, row: number, col: number): HTMLElement {
        const cell = document.createElement('div');
        cell.className = 'palace-cell';
        cell.style.gridRow = row.toString();
        cell.style.gridColumn = col.toString();

        const brightnessClass = (starName: string) => {
            if (starName.includes('(Miếu)')) return 'star-mieu';
            if (starName.includes('(Vượng)')) return 'star-vuong';
            if (starName.includes('(Đắc)')) return 'star-dac';
            if (starName.includes('(Bình)')) return 'star-binh';
            if (starName.includes('(Hãm)')) return 'star-ham';
            return '';
        };

        const tuHoaMap: Record<string, string> = {
            'Hóa Lộc': 'badge-loc',
            'Hóa Quyền': 'badge-quyen',
            'Hóa Khoa': 'badge-khoa',
            'Hóa Kỵ': 'badge-ky'
        };

        // Separation of regular stars and badges
        const badges: string[] = [];
        const ordinaryStars: string[] = [];

        cung.phuTinh.forEach(s => {
            const cleanName = s.split(' (')[0];
            if (tuHoaMap[cleanName]) {
                badges.push(`<span class="badge ${tuHoaMap[cleanName]}">${cleanName}</span>`);
            } else {
                ordinaryStars.push(s);
            }
        });

        cell.innerHTML = `
            <div class="palace-header">
                <span class="palace-name">${cung.name}</span>
                <span class="palace-function">${cung.chucNang}</span>
            </div>
            
            <div class="stars-container">
                <div class="chinh-tinh-list">
                    ${cung.chinhTinh.map(s => `
                        <div class="star ${brightnessClass(s)}">${s.split(' (')[0]}</div>
                    `).join('')}
                </div>
                
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin: 4px 0;">
                    ${badges.join('')}
                </div>

                <div class="phu-tinh-list">
                    ${ordinaryStars.map(s => `
                        <span class="phu-tinh ${brightnessClass(s)}">${s.split(' (')[0]}</span>
                    `).join('')}
                </div>
            </div>

            <div class="palace-score">${cung.score}</div>
            <div class="cung-chi">${cung.canChi}</div>
        `;

        return cell;
    }
}
