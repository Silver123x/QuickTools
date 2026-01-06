import { mountHeightControl } from '../components/heightControl.js';
export function render(root){
  const container = document.createElement('div');
  container.className = 'tool-root';
  const wrap = document.createElement('div');
  container.appendChild(wrap);
  root.appendChild(container);
  const api = mountHeightControl(wrap, { min: 0, max: 200, step: 2, unit: 'cm', value: 80 });
  const status = document.createElement('div');
  status.className = 'pill';
  container.appendChild(status);
  function updateStatus(d){ status.textContent = 'Current height: '+d.value+' '+d.unit; }
  api.onChange(updateStatus);
  updateStatus(api.getValue());
}
