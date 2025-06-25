function addEntry() {
    const category = document.getElementById("category").value;
    const amount = document.getElementById("amount").value;
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value;
    const account = document.getElementById("account").value;
    if (!amount || !date) return alert("Укажи сумму и дату!");
  
    const record = {
      category,
      amount,
      date,
      description,
      account
    };
  
    renderEntry(record);
    clearForm();
  }
  
  function clearForm() {
    ["amount", "description", "date", "account"].forEach(id => {
      document.getElementById(id).value = "";
    });
  }
  
  function renderEntry(record) {
    const list = document.getElementById("savedList");
    let dateBlock = document.querySelector(`[data-date="${record.date}"]`);
  
    if (!dateBlock) {
      const group = document.createElement("div");
      group.className = "date-group";
      group.dataset.date = record.date;
      group.innerHTML = `<h3>${record.date}</h3><div class="entries"></div>`;
      list.prepend(group);
      dateBlock = group;
    }
  
    const entry = document.createElement("div");
    entry.className = `record ${record.category}`;
    entry.innerHTML = `
      <strong>${record.description || 'Без описания'}</strong><br/>
      Сумма: ${record.amount} ₸ | ${record.category === 'income' ? 'Доход' : 'Расход'}<br/>
      Счёт: ${record.account || 'не указан'}
    `;
  
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = '🗑️ Удалить';
    deleteBtn.className = 'delete-btn';
    deleteBtn.onclick = () => {
      const entriesBlock = entry.closest(".entries");
      entry.remove();
      setTimeout(() => {
        if (entriesBlock && entriesBlock.children.length === 0) {
          const dateGroup = entriesBlock.closest(".date-group");
          if (dateGroup) dateGroup.remove();
        }
        updateTotals();
      }, 0);
    };
  
    entry.appendChild(deleteBtn);
    dateBlock.querySelector(".entries")?.appendChild(entry);
    updateTotals();
  }
  
  function filterEntries() {
    const keyword = document.getElementById("search").value.toLowerCase();
    const dateGroups = document.querySelectorAll(".date-group");
  
    dateGroups.forEach(group => {
      const entries = group.querySelectorAll(".record");
      let hasVisible = false;
  
      entries.forEach(entry => {
        const match = entry.textContent.toLowerCase().includes(keyword);
        entry.style.display = match ? "block" : "none";
        if (match) hasVisible = true;
      });
  
      group.style.display = hasVisible ? "block" : "none";
    });
  }
  
  function updateTotals() {
    const records = document.querySelectorAll('.record');
    let totalIncome = 0;
    let totalExpense = 0;
  
    records.forEach(rec => {
      const text = rec.textContent;
      const match = text.match(/Сумма:\s*(\d+)/);
      const amount = match ? parseFloat(match[1]) : 0;
  
      if (rec.classList.contains('income')) {
        totalIncome += amount;
      } else {
        totalExpense += amount;
      }
    });
  
    document.getElementById("totalIncome").textContent = `${totalIncome} ₸`;
    document.getElementById("totalExpense").textContent = `${totalExpense} ₸`;
  }
  