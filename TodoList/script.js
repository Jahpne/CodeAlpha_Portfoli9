const taskInput = document.getElementById('newTask');
    const dueInput = document.getElementById('dueDate');
    const tagInput = document.getElementById('tagInput');
    const tagSuggestions = document.getElementById('tagSuggestions');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const emptyMsg = document.getElementById('emptyMsg');
    const doneSpan = document.getElementById('done');
    const totalSpan = document.getElementById('total');
    const progressFg = document.querySelector('.progress-ring .fg');
    const filterDiv = document.getElementById('filter');
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const statsTotal = document.getElementById('statsTotal');
    const statsCompleted = document.getElementById('statsCompleted');
    const statsPending = document.getElementById('statsPending');
    const statsRate = document.getElementById('statsRate');
    const tagStats = document.getElementById('tagStats');

    let tasks = JSON.parse(localStorage.getItem('todo-pro') || '[]');
    let tags = JSON.parse(localStorage.getItem('todo-tags') || '[]');
    let activeTag = '';

    const save = () => {
      localStorage.setItem('todo-pro', JSON.stringify(tasks));
      localStorage.setItem('todo-tags', JSON.stringify(tags));
    };

    const escape = s => s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);

    const toggleTheme = () => {
      const isDark = body.getAttribute('data-theme') === 'dark';
      body.setAttribute('data-theme', isDark ? 'light' : 'dark');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'light' : 'dark');
    };

    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

    const updateTagSuggestions = () => {
      tagSuggestions.innerHTML = '';
      tags.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t;
        tagSuggestions.appendChild(opt);
      });
    };

    const renderFilter = () => {
      filterDiv.innerHTML = '<button data-tag="" class="active">All</button>';
      tags.forEach(t => {
        const btn = document.createElement('button');
        btn.dataset.tag = t;
        btn.textContent = t;
        btn.style.background = getTagColor(t);
        btn.onclick = () => filterByTag(t);
        filterDiv.appendChild(btn);
      });
      filterDiv.querySelectorAll('button').forEach(b => {
        b.classList.toggle('active', b.dataset.tag === activeTag);
      });
    };

    const getTagColor = t => {
      const colors = ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e'];
      return colors[t.charCodeAt(0) % colors.length];
    };

    const filterByTag = tag => {
      activeTag = tag;
      renderFilter();
      render();
    };

    const updateStats = () => {
      const total = tasks.length;
      const completed = tasks.filter(t => t.done).length;
      const pending = total - completed;
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      statsTotal.textContent = total;
      statsCompleted.textContent = completed;
      statsPending.textContent = pending;
      statsRate.textContent = `${rate}%`;
      
      // Update tag stats
      const tagCounts = {};
      tasks.forEach(task => {
        if (task.tag) {
          tagCounts[task.tag] = (tagCounts[task.tag] || 0) + 1;
        }
      });
      
      tagStats.innerHTML = '';
      Object.entries(tagCounts).forEach(([tag, count]) => {
        const tagStat = document.createElement('div');
        tagStat.className = 'tag-stat';
        tagStat.style.background = getTagColor(tag);
        tagStat.innerHTML = `
          ${escape(tag)}
          <span class="tag-count">${count}</span>
        `;
        tagStats.appendChild(tagStat);
      });
      
      if (Object.keys(tagCounts).length === 0) {
        tagStats.innerHTML = '<p style="color: var(--muted); font-size: 1rem;">No tags yet</p>';
      }
    };

    const render = () => {
      const visible = activeTag ? tasks.filter(t => t.tag === activeTag) : tasks;
      const total = tasks.length;
      const done = tasks.filter(t => t.done).length;

      totalSpan.textContent = total;
      doneSpan.textContent = done;

      const circ = 188.4; // 2 * π * 30 (radius)
      const offset = total === 0 ? 0 : circ - (done / total) * circ;
      progressFg.style.strokeDasharray = `${circ} ${circ}`;
      progressFg.style.strokeDashoffset = offset;

      taskList.innerHTML = '';
      if (visible.length === 0) {
        emptyMsg.hidden = false;
        return;
      }
      emptyMsg.hidden = true;

      visible.forEach(t => {
        const li = document.createElement('li');
        li.className = `task ${t.done ? 'completed' : ''}`;
        li.dataset.id = t.id;

        li.innerHTML = `
          <input type="checkbox" class="task-check" ${t.done ? 'checked' : ''}>
          <div class="task-text">${escape(t.text)}</div>
          <div class="task-meta">
            ${t.tag ? `<span class="tag" style="background:${getTagColor(t.tag)}">${escape(t.tag)}</span>` : ''}
            ${t.due ? `<span class="due">${formatDate(t.due)}</span>` : ''}
          </div>
          <div class="task-actions">
            <button class="delete" title="Delete">✕</button>
          </div>
        `;

        const check = li.querySelector('.task-check');
        const delBtn = li.querySelector('.delete');

        check.addEventListener('change', () => toggleDone(t.id));
        delBtn.onclick = () => deleteTask(t.id);

        taskList.appendChild(li);
      });
      
      updateStats();
    };

    const formatDate = d => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const addTask = () => {
      const text = taskInput.value.trim();
      const due = dueInput.value;
      const tag = tagInput.value.trim();

      if (!text) return;

      if (tag && !tags.includes(tag)) {
        tags.push(tag);
      }

      tasks.push({
        id: Date.now(),
        text,
        done: false,
        due: due || null,
        tag: tag || null
      });

      save();
      render();
      renderFilter();
      updateTagSuggestions();
      resetInputs();
      showToast('Task added!', true);
    };

    const resetInputs = () => {
      taskInput.value = '';
      dueInput.value = '';
      tagInput.value = '';
      taskInput.focus();
    };

    const toggleDone = id => {
      const t = tasks.find(x => x.id === id);
      if (t) {
        t.done = !t.done;
        save();
        render();
        if (t.done) showToast('Task completed!', true);
      }
    };

    const deleteTask = id => {
      tasks = tasks.filter(x => x.id !== id);
      save();
      render();
      showToast('Task deleted!');
    };

    const showToast = (msg, withConfetti = false) => {
      toastMsg.textContent = msg;
      toast.classList.add('show');
      if (withConfetti) triggerConfetti();
      setTimeout(() => toast.classList.remove('show'), 2500);
    };

    // CONFETTI
    const triggerConfetti = () => {
      const colors = ['#facc15', '#f87171', '#34d399', '#60a5fa', '#c084fc', '#a855f7'];
      for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 0.6 + 's';
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 2000);
      }
    };

    addBtn.onclick = addTask;
    taskInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });
    themeToggle.onclick = toggleTheme;

    // Set minimum date to today for due date
    const today = new Date().toISOString().split('T')[0];
    dueInput.min = today;

    updateTagSuggestions();
    renderFilter();
    render();

