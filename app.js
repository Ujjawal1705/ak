/**
 * From My Heart to Yours | An Unconditional Apology & Reconnection Space
 * Core Application Logic, Ambient Synthesis, Personalization, & Safe Space Flow
 */

(function () {
  'use strict';

  // =========================================================================
  // DEFAULT CONFIGURATION & LOCAL STORAGE
  // =========================================================================
  const STORAGE_KEY = 'agy_apology_ankshika_ujjawal_v3';

  const defaultData = {
    herName: 'Ankshika',
    yourName: 'Ujjawal',
    yourEmail: '',
    yourPhone: '',
    letterDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    customNote: '',
    theme: 'theme-velvet',
    memories: [
      {
        id: 'mem-1',
        title: 'The Smile I Swear to Protect',
        tag: 'Your Purest Laugh',
        caption: '"The way you laugh wholeheartedly and shyly cover your mouth... that innocence, that genuine spark is the most beautiful thing in the world. Realizing that my reckless actions brought pain to those eyes breaks me completely. I want nothing more than to bring that pure, unburdened smile back."',
        image: 'assets/images/photo-candid-laugh.jpg'
      },
      {
        id: 'mem-2',
        title: 'The Soft Grace of Your Soul',
        tag: 'Golden Hour • 11 Nov 2024',
        caption: '"In this red floral dress under the evening sky, you looked like pure poetry. Peaceful, radiant, and gentle. You loved me with that same quiet tenderness, and I will spend every single day regretting that I hurt someone so profoundly good."',
        image: 'assets/images/photo-sunset-floral.jpg'
      },
      {
        id: 'mem-3',
        title: 'The One I Always Want to Call Home',
        tag: 'Retro Booth • Guzarish',
        caption: '"Standing in that bright red phone booth, effortless and cool. You were never just my girlfriend; you were my favorite person to talk to about everything and nothing. I long for the day you feel safe enough to pick up my call again."',
        image: 'assets/images/photo-booth.jpg'
      },
      {
        id: 'mem-4',
        title: 'The Light Blue Dress & Your Quiet Radiance',
        tag: 'Effortless Elegance',
        caption: '"Whenever you get dressed up, there is this soft elegance that takes my breath away. You were always more than enough in every possible way. My failure was never a reflection of your worth—you are irreplaceable."',
        image: 'assets/images/photo-blue-dress.jpg'
      },
      {
        id: 'mem-5',
        title: 'The Only One I See',
        tag: 'Unmatched Presence',
        caption: '"Even in subtle shadows or glowing mirrors, no one in any room could ever hold a candle to you. There is no one else I desire, no one else I will ever look for. My eyes and my loyalty belong solely to you."',
        image: 'assets/images/photo-mirror-glow.jpg'
      }
    ]
  };

  let siteData = loadSiteData();

  function loadSiteData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultData, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('LocalStorage load error', e);
    }
    return { ...defaultData };
  }

  function saveSiteData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }

  // =========================================================================
  // DOM REFERENCES
  // =========================================================================
  const tabs = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.page-section');
  const nextStepBtns = document.querySelectorAll('.next-step-btn');
  const prevSectionBtn = document.getElementById('prev-section-btn');
  const nextSectionBtn = document.getElementById('next-section-btn');
  const currentStepLabel = document.getElementById('current-step-label');

  // Display elements
  const displayHerName = document.getElementById('letter-recipient-name');
  const displayYourName = document.getElementById('letter-sender-name');
  const displayDate = document.getElementById('display-date');
  const letterBodyContainer = document.getElementById('letter-content-container');
  const memoriesGrid = document.getElementById('memories-grid-container');

  // Theme & Audio
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');

  // Modal elements
  const customizeBtn = document.getElementById('customize-btn');
  const addMemoryBtn = document.getElementById('add-memory-btn');
  const customizeModal = document.getElementById('customize-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const saveSettingsBtn = document.getElementById('save-settings-btn');
  const resetDefaultsBtn = document.getElementById('reset-defaults-btn');

  // Form Inputs in Modal
  const inputHerName = document.getElementById('cfg-her-name');
  const inputYourName = document.getElementById('cfg-your-name');
  const inputYourEmail = document.getElementById('cfg-your-email');
  const inputYourPhone = document.getElementById('cfg-your-phone');
  const inputLetterDate = document.getElementById('cfg-letter-date');
  const inputCustomNote = document.getElementById('cfg-custom-letter');

  // Add Photo Inputs in Modal
  const inputPhotoTitle = document.getElementById('cfg-photo-title');
  const inputPhotoTag = document.getElementById('cfg-photo-tag');
  const inputPhotoCaption = document.getElementById('cfg-photo-caption');
  const inputPhotoFile = document.getElementById('cfg-photo-file');
  const inputPhotoUrl = document.getElementById('cfg-photo-url');
  const btnAddPhoto = document.getElementById('cfg-add-photo-btn');

  // Safe Space Response Form
  const sentimentPills = document.querySelectorAll('.sentiment-pill');
  const herResponseText = document.getElementById('her-response-text');
  const sendWhatsAppBtn = document.getElementById('send-whatsapp-btn');
  const sendEmailBtn = document.getElementById('send-email-btn');
  const copyResponseBtn = document.getElementById('copy-response-btn');
  const responseStatusFeedback = document.getElementById('response-status-feedback');
  const toastContainer = document.getElementById('toast-container');

  const boundaryCheckboxes = [
    { el: document.getElementById('boundary-no-calls'), label: 'Please do not call me for the next few days' },
    { el: document.getElementById('boundary-text-only'), label: 'Only reach out via text if essential' },
    { el: document.getElementById('boundary-in-person'), label: 'I need time before I can meet in person' },
    { el: document.getElementById('boundary-full-truth'), label: 'Be ready to answer questions with 100% truth' }
  ];

  // Section order definition
  const sectionList = ['page-letter', 'page-commitments', 'page-memories', 'page-safe-space'];
  const sectionLabels = [
    'Section 1 of 4: The Sincere Letter',
    'Section 2 of 4: Concrete Commitments',
    'Section 3 of 4: Memories & Gratitude',
    'Section 4 of 4: Your Safe Space'
  ];
  let currentSectionIndex = 0;

  // =========================================================================
  // NAVIGATION & TAB SWITCHING
  // =========================================================================
  function navigateToSection(targetId) {
    const index = sectionList.indexOf(targetId);
    if (index === -1) return;

    currentSectionIndex = index;

    // Update Tab state
    tabs.forEach(tab => {
      if (tab.dataset.target === targetId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // Update Section visibility
    sections.forEach(section => {
      if (section.id === targetId) {
        section.classList.add('active-section');
      } else {
        section.classList.remove('active-section');
      }
    });

    // Update bottom bar
    currentStepLabel.textContent = sectionLabels[currentSectionIndex];
    prevSectionBtn.disabled = currentSectionIndex === 0;
    nextSectionBtn.disabled = currentSectionIndex === sectionList.length - 1;

    // Smooth scroll to top of section content
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      window.scrollTo({
        top: Math.max(0, targetEl.offsetTop - 110),
        behavior: 'smooth'
      });
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navigateToSection(tab.dataset.target);
    });
  });

  nextStepBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navigateToSection(btn.dataset.next);
    });
  });

  prevSectionBtn.addEventListener('click', () => {
    if (currentSectionIndex > 0) {
      navigateToSection(sectionList[currentSectionIndex - 1]);
    }
  });

  nextSectionBtn.addEventListener('click', () => {
    if (currentSectionIndex < sectionList.length - 1) {
      navigateToSection(sectionList[currentSectionIndex + 1]);
    }
  });

  // =========================================================================
  // UI RENDERING & PERSONALIZATION
  // =========================================================================
  function renderAll() {
    // 1. Names and dates
    displayHerName.textContent = siteData.herName || 'Ankshika';
    displayYourName.textContent = siteData.yourName || 'Ujjawal';
    displayDate.textContent = siteData.letterDate || 'Present';

    // 2. Custom Note in Letter
    const existingCustomNote = document.getElementById('custom-injected-note');
    if (existingCustomNote) {
      existingCustomNote.remove();
    }

    if (siteData.customNote && siteData.customNote.trim()) {
      const customP = document.createElement('div');
      customP.id = 'custom-injected-note';
      customP.className = 'quote-callout';
      customP.innerHTML = `
        <span class="quote-symbol">“</span>
        <p>${escapeHTML(siteData.customNote.trim())}</p>
      `;
      letterBodyContainer.appendChild(customP);
    }

    // 3. Render Memories
    renderMemories();

    // 4. Update Modal Form inputs
    inputHerName.value = siteData.herName || '';
    inputYourName.value = siteData.yourName || '';
    inputYourEmail.value = siteData.yourEmail || '';
    inputYourPhone.value = siteData.yourPhone || '';
    inputLetterDate.value = siteData.letterDate || '';
    inputCustomNote.value = siteData.customNote || '';

    // 5. Apply Theme
    if (siteData.theme === 'theme-parchment') {
      document.body.classList.add('theme-parchment');
      document.body.classList.remove('theme-velvet');
    } else {
      document.body.classList.add('theme-velvet');
      document.body.classList.remove('theme-parchment');
    }
  }

  function renderMemories() {
    memoriesGrid.innerHTML = '';
    siteData.memories.forEach((mem, idx) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.innerHTML = `
        <div class="memory-image-holder">
          <img src="${escapeHTML(mem.image)}" alt="${escapeHTML(mem.title)}" class="memory-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80'">
          <span class="memory-tag">${escapeHTML(mem.tag || 'Memory')}</span>
        </div>
        <div class="memory-details">
          <h4 class="memory-title">${escapeHTML(mem.title)}</h4>
          <p class="memory-caption">${escapeHTML(mem.caption)}</p>
        </div>
      `;
      memoriesGrid.appendChild(card);
    });
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // =========================================================================
  // THEME SWITCHING
  // =========================================================================
  themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('theme-parchment')) {
      document.body.classList.remove('theme-parchment');
      document.body.classList.add('theme-velvet');
      siteData.theme = 'theme-velvet';
      showToast('Switched to Dark Velvet theme');
    } else {
      document.body.classList.remove('theme-velvet');
      document.body.classList.add('theme-parchment');
      siteData.theme = 'theme-parchment';
      showToast('Switched to Warm Parchment theme');
    }
    saveSiteData();
  });

  // =========================================================================
  // PROCEDURAL AMBIENT SOUND GENERATOR (Web Audio API)
  // Provides soothing, melancholic, low-volume ambient piano/pad chords
  // =========================================================================
  let audioCtx = null;
  let isAudioPlaying = false;
  let audioTimer = null;

  // Gentle, warm, reflective chords (frequencies in Hz: F3, A3, C4, E4, etc.)
  const chordProgressions = [
    [174.61, 220.00, 261.63, 329.63], // Fmaj7
    [146.83, 220.00, 261.63, 349.23], // Dm7
    [130.81, 196.00, 246.94, 329.63], // Cmaj9
    [164.81, 196.00, 246.94, 293.66]  // Em7
  ];
  let chordIndex = 0;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playAmbientPadChord() {
    if (!isAudioPlaying || !audioCtx) return;

    const chord = chordProgressions[chordIndex];
    chordIndex = (chordIndex + 1) % chordProgressions.length;

    const now = audioCtx.currentTime;
    const duration = 5.5; // slow breath-like swell

    chord.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      // Warm sine / triangle mixture
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() * 0.5 - 0.25), now);

      // Low pass filter for soft warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      // Delicate envelope
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.028 / (i + 1), now + 2.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    });

    audioTimer = setTimeout(playAmbientPadChord, 5200);
  }

  audioToggleBtn.addEventListener('click', () => {
    initAudio();
    isAudioPlaying = !isAudioPlaying;

    if (isAudioPlaying) {
      audioToggleBtn.classList.add('active-audio');
      audioToggleBtn.querySelector('.audio-label').textContent = 'Pause Music';
      playAmbientPadChord();
      showToast('Soft ambient music playing...');
    } else {
      audioToggleBtn.classList.remove('active-audio');
      audioToggleBtn.querySelector('.audio-label').textContent = 'Ambient Music';
      if (audioTimer) clearTimeout(audioTimer);
      showToast('Ambient music paused');
    }
  });

  // =========================================================================
  // VIDEO AUDIO COORDINATION
  // Automatically pause background ambient music when the video plays
  // =========================================================================
  const memoryVideo = document.getElementById('featured-memory-video');
  let wasAmbientPlayingBeforeVideo = false;

  if (memoryVideo) {
    memoryVideo.addEventListener('play', () => {
      if (isAudioPlaying) {
        wasAmbientPlayingBeforeVideo = true;
        isAudioPlaying = false;
        if (audioTimer) clearTimeout(audioTimer);
        audioToggleBtn.classList.remove('active-audio');
        audioToggleBtn.querySelector('.audio-label').textContent = 'Ambient Music';
      }
    });

    memoryVideo.addEventListener('pause', () => {
      if (wasAmbientPlayingBeforeVideo && !isAudioPlaying) {
        initAudio();
        isAudioPlaying = true;
        audioToggleBtn.classList.add('active-audio');
        audioToggleBtn.querySelector('.audio-label').textContent = 'Pause Music';
        playAmbientPadChord();
        wasAmbientPlayingBeforeVideo = false;
      }
    });

    memoryVideo.addEventListener('ended', () => {
      if (wasAmbientPlayingBeforeVideo && !isAudioPlaying) {
        initAudio();
        isAudioPlaying = true;
        audioToggleBtn.classList.add('active-audio');
        audioToggleBtn.querySelector('.audio-label').textContent = 'Pause Music';
        playAmbientPadChord();
        wasAmbientPlayingBeforeVideo = false;
      }
    });
  }

  // =========================================================================
  // ATMOSPHERIC DUST / PETAL CANVAS
  // =========================================================================
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 42;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = Math.random() * 0.4 + 0.15;
      this.speedX = Math.sin(Math.random() * Math.PI * 2) * 0.25;
      this.opacity = Math.random() * 0.5 + 0.15;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.phase = Math.random() * Math.PI * 2;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.phase += this.pulseSpeed;
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
        this.y = canvas.height + 10;
      }
    }
    draw() {
      const alpha = this.opacity * (0.6 + 0.4 * Math.sin(this.phase));
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(226, 130, 146, ${alpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(226, 130, 146, 0.4)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // =========================================================================
  // MODAL / PERSONALIZATION INTERACTION
  // =========================================================================
  function openModal() {
    customizeModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    customizeModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  customizeBtn.addEventListener('click', openModal);
  if (addMemoryBtn) {
    addMemoryBtn.addEventListener('click', () => {
      openModal();
      setTimeout(() => {
        inputPhotoTitle.scrollIntoView({ behavior: 'smooth' });
        inputPhotoTitle.focus();
      }, 250);
    });
  }

  closeModalBtn.addEventListener('click', closeModal);
  customizeModal.addEventListener('click', (e) => {
    if (e.target === customizeModal) closeModal();
  });

  saveSettingsBtn.addEventListener('click', () => {
    siteData.herName = inputHerName.value.trim() || 'Ankshika';
    siteData.yourName = inputYourName.value.trim() || 'Ujjawal';
    siteData.yourEmail = inputYourEmail.value.trim();
    siteData.yourPhone = inputYourPhone.value.trim();
    siteData.letterDate = inputLetterDate.value.trim() || 'Present';
    siteData.customNote = inputCustomNote.value.trim();

    saveSiteData();
    renderAll();
    closeModal();
    showToast('Changes saved and applied beautifully!');
  });

  resetDefaultsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to restore default template settings?')) {
      siteData = { ...defaultData };
      saveSiteData();
      renderAll();
      closeModal();
      showToast('Restored default text and layout.');
    }
  });

  // Adding Custom Photo to Gallery
  btnAddPhoto.addEventListener('click', () => {
    const title = inputPhotoTitle.value.trim() || 'Our Memory';
    const tag = inputPhotoTag.value.trim() || 'Cherished';
    const caption = inputPhotoCaption.value.trim() || '"A quiet moment together that meant everything."';
    const directUrl = inputPhotoUrl.value.trim();
    const file = inputPhotoFile.files && inputPhotoFile.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const base64Img = e.target.result;
        addMemoryToSite(title, tag, caption, base64Img);
      };
      reader.readAsDataURL(file);
    } else if (directUrl) {
      addMemoryToSite(title, tag, caption, directUrl);
    } else {
      showToast('Please select a photo file or enter an image URL.');
    }
  });

  function addMemoryToSite(title, tag, caption, imageSrc) {
    siteData.memories.push({
      id: 'mem-' + Date.now(),
      title,
      tag,
      caption: `"${caption.replace(/^"+|"+$/g, '')}"`,
      image: imageSrc
    });

    saveSiteData();
    renderMemories();

    // Reset inputs
    inputPhotoTitle.value = '';
    inputPhotoTag.value = '';
    inputPhotoCaption.value = '';
    inputPhotoUrl.value = '';
    inputPhotoFile.value = '';

    showToast('New memory successfully added to your gallery!');
  }

  // =========================================================================
  // SAFE SPACE / HER RESPONSE HANDLERS
  // =========================================================================
  let selectedSentiment = '';

  sentimentPills.forEach(pill => {
    pill.addEventListener('click', () => {
      if (pill.classList.contains('selected')) {
        pill.classList.remove('selected');
        selectedSentiment = '';
      } else {
        sentimentPills.forEach(p => p.classList.remove('selected'));
        pill.classList.add('selected');
        selectedSentiment = pill.dataset.sentiment;
      }
    });
  });

  function assembleResponseMessage() {
    const customText = herResponseText.value.trim();
    const activeBoundaries = boundaryCheckboxes
      .filter(item => item.el && item.el.checked)
      .map(item => `• ${item.label}`);

    let msg = `[Message from ${siteData.herName || 'Ankshika'} to ${siteData.yourName || 'Ujjawal'}]\n\n`;

    if (selectedSentiment) {
      msg += `CURRENT FEELING:\n"${selectedSentiment}"\n\n`;
    }

    if (customText) {
      msg += `MY WORDS:\n${customText}\n\n`;
    }

    if (activeBoundaries.length > 0) {
      msg += `MY BOUNDARIES FOR NOW:\n${activeBoundaries.join('\n')}\n\n`;
    }

    msg += `Sent with honesty. Please respect my timeline.`;
    return msg;
  }

  // Send via WhatsApp
  sendWhatsAppBtn.addEventListener('click', () => {
    const message = assembleResponseMessage();
    if (!message.trim()) {
      showToast('Please enter your response or select a feeling first.');
      return;
    }

    // Phone cleanup: remove non-digits
    let phone = (siteData.yourPhone || '').replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);

    if (phone) {
      window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    } else {
      // Fallback: wa.me share without pre-set phone
      window.open(`https://wa.me/?text=${encoded}`, '_blank');
    }

    showResponseStatus('Your response was opened in WhatsApp. Take your time.');
  });

  // Send via Email
  sendEmailBtn.addEventListener('click', () => {
    const message = assembleResponseMessage();
    if (!message.trim()) {
      showToast('Please enter your response or select a feeling first.');
      return;
    }

    const recipient = siteData.yourEmail || '';
    const subject = encodeURIComponent(`From ${siteData.herName || 'Me'} - My Thoughts & Boundaries`);
    const body = encodeURIComponent(message);

    window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    showResponseStatus('Your email client was opened. You have total control over what you send.');
  });

  // Copy Response
  copyResponseBtn.addEventListener('click', () => {
    const message = assembleResponseMessage();
    if (!message.trim()) {
      showToast('Please write something or choose an option first.');
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message).then(() => {
        showToast('Response copied to clipboard.');
        showResponseStatus('Copied! You can paste this wherever you feel comfortable.');
      }).catch(() => {
        fallbackCopy(message);
      });
    } else {
      fallbackCopy(message);
    }
  });

  function fallbackCopy(text) {
    const temp = document.createElement('textarea');
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
    showToast('Response copied to clipboard.');
    showResponseStatus('Copied! You can paste this wherever you feel comfortable.');
  }

  function showResponseStatus(msg) {
    responseStatusFeedback.textContent = msg;
    responseStatusFeedback.classList.remove('hidden');
    setTimeout(() => {
      responseStatusFeedback.classList.add('hidden');
    }, 6000);
  }

  // =========================================================================
  // TOAST NOTIFICATIONS
  // =========================================================================
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, 3200);
  }

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  renderAll();
  navigateToSection('page-letter');

})();

