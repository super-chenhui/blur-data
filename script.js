document.addEventListener('DOMContentLoaded', function () {
  const inputText = document.getElementById('input-text');
  const outputText = document.getElementById('output-text');
  const obfuscateBtn = document.getElementById('obfuscate-btn');
  const copyBtn = document.getElementById('copy-btn');
  const charCount = document.querySelector('.char-count');
  const clearBtn = document.getElementById('clear-btn');

  // 模糊化数字的函数
  function obfuscateNumbers(text) {
    // 处理科学计数法
    const scientificRegex = /\b\d+\.?\d*e[+-]?\d+\b/gi;
    let result = text.replace(scientificRegex, match => {
      const [base, exp] = match.toLowerCase().split('e');
      const baseDigits = base.includes('.') ? base.replace('.', '').length : base.length;
      const randomBase = Math.random().toFixed(baseDigits - 1);
      return `${randomBase}e${exp}`;
    });

    // 处理普通数字
    return result.replace(/\b\d+(\.\d+)?\b/g, match => {
      const [intPart, decPart] = match.split('.');
      const generateRandomDigits = len =>
        Math.floor(Math.random() * Math.pow(10, len))
          .toString()
          .padStart(len, '0');

      return decPart
        ? `${generateRandomDigits(intPart.length)}.${generateRandomDigits(decPart.length)}`
        : generateRandomDigits(intPart.length);
    });
  }

  // 模糊化日期的函数
  function obfuscateDates(text) {
    // 扩展日期正则表达式以支持更多格式
    const datePatterns = [
      // YYYY-MM-DD, YYYY/MM/DD
      /\b\d{4}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])\b/g,
      // MM-DD-YYYY, MM/DD/YYYY
      /\b(0[1-9]|1[0-2])[-/](0[1-9]|[12]\d|3[01])[-/]\d{4}\b/g,
      // DD-MM-YYYY, DD/MM/YYYY
      /\b(0[1-9]|[12]\d|3[01])[-/](0[1-9]|1[0-2])[-/]\d{4}\b/g,
      // YYYY.MM.DD
      /\b\d{4}\.(0[1-9]|1[0-2])\.(0[1-9]|[12]\d|3[01])\b/g,
      // 简单日期: YY.MM.DD
      /\b\d{2}\.(0[1-9]|1[0-2])\.(0[1-9]|[12]\d|3[01])\b/g
    ];

    let result = text;
    datePatterns.forEach(pattern => {
      result = result.replace(pattern, match => {
        const separator = match.includes('-') ? '-' : match.includes('/') ? '/' : '.';
        const parts = match.split(/[-/.]/);

        const currentYear = new Date().getFullYear();
        const randomYear = parts[0].length === 4
          ? currentYear - Math.floor(Math.random() * 10)
          : String(Math.floor(Math.random() * 30)).padStart(2, '0');
        const randomMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const maxDay = new Date(randomYear, parseInt(randomMonth) - 1, 0).getDate();
        const randomDay = String(Math.floor(Math.random() * maxDay) + 1).padStart(2, '0');

        // 保持原始格式
        if (parts[0].length === 4 || parts[2].length === 4) {
          return `${randomYear}${separator}${randomMonth}${separator}${randomDay}`;
        } else {
          return `${randomDay}${separator}${randomMonth}${separator}${randomYear}`;
        }
      });
    });
    return result;
  }

  // 模糊化百分比的函数
  function obfuscatePercentages(text) {
    return text.replace(/\b\d+(\.\d+)?%\b/g, match => {
      const number = parseFloat(match);
      const decimalPlaces = match.includes('.') ? match.split('.')[1].length - 1 : 0;
      const randomPercent = (Math.random() * 100).toFixed(decimalPlaces);
      return `${randomPercent}%`;
    });
  }

  // 添加货币模糊化函数
  function obfuscateCurrency(text) {
    // 匹配常见货币格式：$123.45, USD 123.45, €123.45, 123.45€, ¥123.45等
    const currencyRegex = /(?:\$|€|£|¥|USD\s*|EUR\s*|GBP\s*|JPY\s*|CNY\s*)\s*\d+(\.\d{2})?|\d+(\.\d{2})?\s*(?:€|£|¥|USD|EUR|GBP|JPY|CNY)/g;

    return text.replace(currencyRegex, match => {
      const number = match.replace(/[^\d.]/g, '');
      const [intPart, decPart] = number.split('.');
      const generateRandomDigits = len =>
        Math.floor(Math.random() * Math.pow(10, len))
          .toString()
          .padStart(len, '0');

      // 保持原始货币符号和格式
      const currencySymbol = match.replace(/[\d.]/g, '').trim();
      const randomNumber = decPart
        ? `${generateRandomDigits(intPart.length)}.${generateRandomDigits(2)}`
        : generateRandomDigits(intPart.length);

      return match.startsWith(currencySymbol)
        ? `${currencySymbol}${randomNumber}`
        : `${randomNumber}${currencySymbol}`;
    });
  }

  // 添加加载状态处理
  function setLoading(isLoading) {
    if (isLoading) {
      obfuscateBtn.disabled = true;
      obfuscateBtn.innerHTML = `
        <svg class="loading-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 19.07L16.24 16.24M19.07 4.93L16.24 7.76M4.93 19.07L7.76 16.24M4.93 4.93L7.76 7.76" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <animateTransform
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 12 12"
              to="360 12 12"
              dur="1s"
              repeatCount="indefinite"/>
          </path>
        </svg>`;
    } else {
      obfuscateBtn.disabled = false;
      obfuscateBtn.innerHTML = `
        <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="btn-text">Blur</span>`;
    }
  }

  // 添加输入验证
  function validateInput(text) {
    if (text.length > 50000) { // 设置一个合理的最大长度限制
      throw new Error('Text is too long to process');
    }
    return text;
  }

  // 修改模糊化按钮的处理逻辑
  obfuscateBtn.addEventListener('click', async () => {
    try {
      const input = inputText.value.trim();
      if (!input) return;

      validateInput(input);
      setLoading(true);
      let result = input;

      // 使用 setTimeout 让加载动画有机会显示
      await new Promise(resolve => setTimeout(resolve, 100));

      result = obfuscateCurrency(result);
      result = obfuscatePercentages(result);
      result = obfuscateNumbers(result);
      result = obfuscateDates(result);

      outputText.value = result;
    } catch (error) {
      if (error.message === 'Text is too long to process') {
        alert('The text is too long. Please reduce the length and try again.');
      } else {
        alert('An error occurred while processing the text. Please try again.');
      }
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  });

  // 添加输入防抖
  const debounce = (fn, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  inputText.addEventListener('input', debounce(function () {
    const length = this.value.length;
    charCount.textContent = `${length}/5000`;

    if (length > 5000) {
      this.value = this.value.slice(0, 5000);
      charCount.textContent = '5000/5000';
    }
  }, 100));

  // 优化复制功能，使用现代API
  copyBtn.addEventListener('click', async () => {
    try {
      const text = outputText.value.trim();
      if (!text) return;

      await navigator.clipboard.writeText(text);

      // 添加更明显的视觉反馈
      copyBtn.style.backgroundColor = '#e8f5e9';
      copyBtn.style.borderColor = '#4CAF50';
      const originalSvg = copyBtn.innerHTML;
      copyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;

      setTimeout(() => {
        copyBtn.style.backgroundColor = 'transparent';
        copyBtn.style.borderColor = '#ddd';
        copyBtn.innerHTML = originalSvg;
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
      // 使用选择文本作为备选方案
      outputText.select();
      try {
        document.execCommand('copy');
      } catch (e) {
        alert('Unable to copy text. Please copy manually.');
      }
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

  // 添加节流函数
  const throttle = (fn, delay) => {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn.apply(this, args);
      }
    };
  };

  // 对大量文本的处理进行优化
  const processInChunks = async (text, chunkSize = 1000) => {
    const chunks = text.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [];
    let result = '';

    for (const chunk of chunks) {
      result += await processChunk(chunk);
      await new Promise(resolve => setTimeout(resolve, 0)); // 让出主线程
    }

    return result;
  };
}); 