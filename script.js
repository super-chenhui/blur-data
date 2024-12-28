document.addEventListener('DOMContentLoaded', function () {
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const obfuscateBtn = document.getElementById('obfuscate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const charCount = document.querySelector('.char-count');
  const clearBtn = document.getElementById('clear-btn');

  // 模糊化数字的函数
  function obfuscateNumbers(text) {
    // 保持数字位数不变，但改变具体数值
    return text.replace(/\b\d+(\.\d+)?\b/g, match => {
      const isDecimal = match.includes('.');
      const length = match.replace('.', '').length;

      if (isDecimal) {
        const [intPart, decPart] = match.split('.');
        const newInt = Math.floor(Math.random() * Math.pow(10, intPart.length)).toString().padStart(intPart.length, '0');
        const newDec = Math.floor(Math.random() * Math.pow(10, decPart.length)).toString().padStart(decPart.length, '0');
        return `${newInt}.${newDec}`;
      } else {
        return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
      }
    });
  }

  // 模糊化日期的函数
  function obfuscateDates(text) {
    // 匹配常见的日期格式并替换
    const datePatterns = [
      // YYYY-MM-DD 或 YYYY/MM/DD
      /\b\d{4}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/g,
      // MM-DD-YYYY 或 MM/DD/YYYY
      /\b(0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])[-/]\d{4}\b/g
    ];

    let result = text;
    datePatterns.forEach(pattern => {
      result = result.replace(pattern, match => {
        const parts = match.split(/[-/]/);
        const randomYear = 2000 + Math.floor(Math.random() * 24); // 2000-2023
        const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const randomDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');

        if (parts[0].length === 4) {
          return `${randomYear}-${randomMonth}-${randomDay}`;
        } else {
          return `${randomMonth}-${randomDay}-${randomYear}`;
        }
      });
    });
    return result;
  }

  // 点击模糊化按钮
  obfuscateBtn.addEventListener('click', () => {
    const input = inputText.value;
    let result = input;

    // 依次应用各种模糊化处理
    result = obfuscateNumbers(result);
    result = obfuscateDates(result);

    outputText.value = result;
  });

  // 添加输入防抖
  let debounceTimer;
  inputText.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const length = this.value.length;
      charCount.textContent = `${length}/5000`;

      if (length > 5000) {
        this.value = this.value.slice(0, 5000);
        charCount.textContent = '5000/5000';
      }
    }, 100);
  });

  // 优化复制功能，使用现代API
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(outputText.value);
      const originalSvg = copyBtn.innerHTML;
      copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      setTimeout(() => {
        copyBtn.innerHTML = originalSvg;
      }, 2000);
    } catch (err) {
      outputText.select();
      document.execCommand('copy');
      alert('Copied to clipboard!');
    }
  });

  // 添加键盘快捷键支持
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'Enter') {
        // Ctrl/Cmd + Enter 触发模糊化
        e.preventDefault();
        obfuscateBtn.click();
      }
    }
  });

  // 修改清空按钮的点击事件处理
  clearBtn.addEventListener('click', () => {
    inputText.value = '';
    outputText.value = '';  // 同时清空右边的文本框
    charCount.textContent = '0/5000';
  });
}); 