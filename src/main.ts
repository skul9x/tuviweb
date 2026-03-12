import './styles/global.css'
import { InputForm } from './components/InputForm'
import type { UserInfo } from './components/InputForm'
import { TuViGrid } from './components/TuViGrid'
import { AIInterpretation } from './components/AIInterpretation'
import { TuViLogic } from './core/tuvi-logic'
import { SupabaseService } from './utils/SupabaseService'
import { Gender, ReadingStyle } from './types'

const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
  <header style="text-align: center; margin-bottom: var(--space-xl);">
    <h1 style="font-size: 2.5rem; letter-spacing: 2px;">TU VI WEB</h1>
    <p style="color: var(--text-muted);">Hệ thống an sao và luận giải tử vi chuyên nghiệp</p>
  </header>
  
  <div id="form-container"></div>
  <div id="grid-container" style="margin-top: var(--space-2xl); width: 100%;"></div>
  <div id="ai-container" style="margin-top: var(--space-xl);"></div>
`

const gridComponent = new TuViGrid('grid-container');
const aiComponent = new AIInterpretation('ai-container');
const supabaseService = new SupabaseService();

new InputForm('form-container', (data: UserInfo) => {
  console.log('Form submitted:', data);
  renderLaso(data);
});

async function renderLaso(data: UserInfo) {
  const gridDiv = document.getElementById('grid-container')!;
  const aiDiv = document.getElementById('ai-container')!;
  
  gridDiv.innerHTML = `<div class="glass-card" style="text-align: center; border-color: var(--gold-primary);">🚀 Đang tính toán lá số cho <b>${data.name}</b>...</div>`;
  aiDiv.innerHTML = '';

  try {
    const engine = new TuViLogic();
    const currentYear = new Date().getFullYear();
    
    const laso = engine.anSao({
      name: data.name,
      phoneNumber: data.phoneNumber,
      gender: data.isMale ? Gender.NAM : Gender.NU,
      solarDay: data.day,
      solarMonth: data.month,
      solarYear: data.year,
      hour: data.hour,
      viewingYear: currentYear,
      readingStyle: data.readingStyle as ReadingStyle,
      lunarDayInput: data.isLunar ? data.day : undefined,
      lunarMonthInput: data.isLunar ? data.month : undefined,
      lunarYearInput: data.isLunar ? data.year : undefined
    });

    console.log('Lá số calculated:', laso);
    
    // 1. Render the Grid
    gridComponent.render(laso);

    // 2. Sync to Supabase (Background)
    supabaseService.syncLaso(laso).catch(err => console.error('Sync failed:', err));

    // 3. Start AI Interpretation
    await aiComponent.readLaso(laso);

    // Scroll to results
    gridDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (error) {
    console.error('Calculation error:', error);
    gridDiv.innerHTML = `<div class="glass-card" style="color: var(--star-ham); text-align: center;">⚠️ Lỗi khi tính toán lá số. Vui lòng kiểm tra lại thông tin.</div>`;
  }
}
