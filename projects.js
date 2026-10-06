/* ============================================================
   projects.js — filter kategori
   ============================================================ */

const chips = document.querySelectorAll('.filter-chip');
const projects = document.querySelectorAll('#projectsGrid .project');
const countEl = document.getElementById('projectCount');
const emptyState = document.getElementById('emptyState');

function updateCount(visibleCount) {
  if (!countEl) return;
  countEl.textContent = `${visibleCount} project`;
}

function applyFilter(filter) {
  let visible = 0;
  
  projects.forEach(card => {
    const match = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('hide', !match);
    
    if (match) {
      visible++;
      card.classList.remove('in');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => card.classList.add('in'));
      });
    }
  });
  
  updateCount(visible);
  if (emptyState) emptyState.hidden = visible !== 0;
}

if (projects.length) updateCount(projects.length);

chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    applyFilter(chip.dataset.filter);
  });
});

window.addEventListener('load', () => {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  const targetChip = [...chips].find(c => c.dataset.filter === hash);
  if (targetChip) targetChip.click();
});