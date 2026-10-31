/**
 * For Ankshika | An Unconditional Apology & Reconnection Space
 * Core Application Logic, Ambient Synthesis, Smooth Scrolling & Video Coordination
 */

(function () {
  'use strict';

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

  // Theme & Audio
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const audioToggleBtn = document.getElementById('audio-toggle-btn');

  // Section order definition
  const sectionList = ['page-letter', 'page-commitments', 'page-memories', 'page-safe-space'];
  const sectionLabels = [
    'Section 1 of 4: The Letter',
    'Section 2 of 4: Commitments',
    'Section 3 of 4: 🎥 Video & Photos',
    'Section 4 of 4: A Quiet Promise'
  ];
  let currentSectionIndex = 0;

  // =========================================================================
  // SMOOTH SCROLLING & NAVIGATION
  // =========================================================================
  function scrollToSection(targetId) {
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    const navOffset = 120;
    const elementPosition = targetEl.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    updateActiveTab(targetId);
  }

  function updateActiveTab(targetId) {
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

    // Update bottom bar
    if (currentStepLabel) {
      currentStepLabel.textContent = sectionLabels[currentSectionIndex];
    }
    if (prevSectionBtn) {
      prevSectionBtn.disabled = currentSectionIndex === 0;
    }
    if (nextSectionBtn) {
      nextSectionBtn.disabled = currentSectionIndex === sectionList.length - 1;
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection(tab.dataset.target);
    });
  });

  nextStepBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection(btn.dataset.next);
    });
  });

  if (prevSectionBtn) {
    prevSectionBtn.addEventListener('click', () => {
      if (currentSectionIndex > 0) {
        scrollToSection(sectionList[currentSectionIndex - 1]);
      }
    });
  }

  if (nextSectionBtn) {
    nextSectionBtn.addEventListener('click', () => {
      if (currentSectionIndex < sectionList.length - 1) {
        scrollToSection(sectionList[currentSectionIndex + 1]);
      }
    });
  }

  // Highlight active tab as user naturally scrolls
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 180;

    for (let i = sectionList.length - 1; i >= 0; i--) {
      const section = document.getElementById(sectionList[i]);
      if (section && section.offsetTop <= scrollPos) {
        if (currentSectionIndex !== i) {
          updateActiveTab(sectionList[i]);
        }
        break;
      }
    }
  }, { passive: true });

  // =========================================================================
  // THEME SWITCHING
  // =========================================================================
  themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('theme-parchment')) {
      document.body.classList.remove('theme-parchment');
      document.body.classList.add('theme-velvet');
    } else {
      document.body.classList.remove('theme-velvet');
      document.body.classList.add('theme-parchment');
    }
  });

  // =========================================================================
  // PROCEDURAL AMBIENT SOUND GENERATOR (Web Audio API)
  // Provides soothing, melancholic, low-volume ambient piano/pad chords
  // =========================================================================
  let audioCtx = null;
  let isAudioPlaying = false;
  let audioTimer = null;

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
    const duration = 5.5;

    chord.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const filter = audioCtx.createBiquadFilter();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() * 0.5 - 0.25), now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

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
    } else {
      audioToggleBtn.classList.remove('active-audio');
      audioToggleBtn.querySelector('.audio-label').textContent = 'Ambient Music';
      if (audioTimer) clearTimeout(audioTimer);
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
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 38;

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
  }

  // Initial state setup
  updateActiveTab('page-letter');

})();
