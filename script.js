document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    const sentenceCountEl = document.getElementById('sentence-count');
    const paragraphCountEl = document.getElementById('paragraph-count');
    const readTimeEl = document.getElementById('read-time');
    const speakTimeEl = document.getElementById('speak-time');
    const toast = document.getElementById('toast');

    function updateStats() {
        const text = textInput.value;
        
        // Characters
        charCountEl.innerText = text.length;

        // Words
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        wordCountEl.innerText = wordCount;

        // Sentences
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        sentenceCountEl.innerText = text.length === 0 ? 0 : sentences.length;

        // Paragraphs
        const paragraphs = text.split(/\n+/).filter(paragraph => paragraph.trim().length > 0);
        paragraphCountEl.innerText = text.length === 0 ? 0 : paragraphs.length;

        // Reading Time (Avg 200 words per minute)
        const readTime = Math.ceil(wordCount / 200);
        readTimeEl.innerText = readTime === 0 ? '0 min' : `~${readTime} min`;

        // Speaking Time (Avg 130 words per minute)
        const speakTime = Math.ceil(wordCount / 130);
        speakTimeEl.innerText = speakTime === 0 ? '0 min' : `~${speakTime} min`;

        // Keyword Density
        const keywordDensityListEl = document.getElementById('keyword-density-list');
        if (words.length === 0) {
            keywordDensityListEl.innerHTML = '<li>No data yet...</li>';
        } else {
            const stopWords = new Set(['the', 'a', 'an', 'is', 'in', 'it', 'and', 'or', 'to', 'of', 'for', 'with', 'on', 'at', 'by', 'this', 'that', 'are', 'was', 'as', 'be', 'from', 'but', 'not']);
            const wordCounts = {};
            words.forEach(w => {
                const cleanWord = w.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (cleanWord && !stopWords.has(cleanWord)) {
                    wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
                }
            });
            const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
            if (sortedWords.length === 0) {
                keywordDensityListEl.innerHTML = '<li>No keywords found.</li>';
            } else {
                keywordDensityListEl.innerHTML = sortedWords.map(([w, c]) => 
                    `<li style="display: flex; justify-content: space-between; margin-bottom: 5px; border-bottom: 1px solid var(--border-color); padding-bottom: 2px;">
                        <span>${w}</span> <span style="color: var(--text-primary); font-weight: 600;">${c} (${((c/wordCount)*100).toFixed(1)}%)</span>
                    </li>`
                ).join('');
            }
        }
    }

    textInput.addEventListener('input', updateStats);

    // Format Actions
    document.getElementById('btn-uppercase').addEventListener('click', () => {
        textInput.value = textInput.value.toUpperCase();
        updateStats();
    });

    document.getElementById('btn-lowercase').addEventListener('click', () => {
        textInput.value = textInput.value.toLowerCase();
        updateStats();
    });

    document.getElementById('btn-titlecase').addEventListener('click', () => {
        const smallWords = new Set(['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet']);
        textInput.value = textInput.value.toLowerCase().split(' ').map((word, index) => {
            if (index !== 0 && smallWords.has(word)) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
        updateStats();
    });

    document.getElementById('btn-sort-lines').addEventListener('click', () => {
        let lines = textInput.value.split('\n');
        lines.sort();
        textInput.value = lines.join('\n');
        updateStats();
    });

    document.getElementById('btn-reverse-lines').addEventListener('click', () => {
        let lines = textInput.value.split('\n');
        lines.reverse();
        textInput.value = lines.join('\n');
        updateStats();
    });

    document.getElementById('btn-remove-duplicates').addEventListener('click', () => {
        let lines = textInput.value.split('\n');
        let uniqueLines = [...new Set(lines)];
        textInput.value = uniqueLines.join('\n');
        updateStats();
    });

    document.getElementById('btn-remove-empty-lines').addEventListener('click', () => {
        let lines = textInput.value.split('\n');
        let nonEmptyLines = lines.filter(line => line.trim().length > 0);
        textInput.value = nonEmptyLines.join('\n');
        updateStats();
    });

    document.getElementById('btn-rem-spaces').addEventListener('click', () => {
        textInput.value = textInput.value.replace(/\s+/g, ' ').trim();
        updateStats();
    });

    document.getElementById('btn-rem-lines').addEventListener('click', () => {
        textInput.value = textInput.value.replace(/(\r\n|\n|\r)/gm, ' ');
        updateStats();
    });

    document.getElementById('btn-clear').addEventListener('click', () => {
        textInput.value = '';
        updateStats();
    });

    document.getElementById('btn-copy').addEventListener('click', () => {
        if (!textInput.value) return;
        textInput.select();
        document.execCommand('copy');
        
        // Show toast
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    });

    // Find & Replace
    document.getElementById('btn-replace').addEventListener('click', () => {
        const findText = document.getElementById('find-input').value;
        const replaceText = document.getElementById('replace-input').value;
        const useRegex = document.getElementById('use-regex').checked;
        
        if (!findText) return;

        let flags = 'g';
        let searchRegex;
        
        try {
            if (useRegex) {
                searchRegex = new RegExp(findText, flags);
            } else {
                // Escape regex characters for literal string match
                const escapedFindText = findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                searchRegex = new RegExp(escapedFindText, flags);
            }
            textInput.value = textInput.value.replace(searchRegex, replaceText);
            updateStats();
        } catch (e) {
            alert('Invalid Regular Expression');
        }
    });

    // Extraction & Modal Logic
    const modal = document.getElementById('data-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');

    function openModal(title, content) {
        modalTitle.innerText = title;
        modalContent.value = content;
        modal.style.display = 'block';
        modalOverlay.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
        modalOverlay.style.display = 'none';
    }

    document.getElementById('close-modal').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    document.getElementById('btn-copy-modal').addEventListener('click', () => {
        if (!modalContent.value) return;
        modalContent.select();
        document.execCommand('copy');
        toast.innerText = 'List copied!';
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            toast.innerText = 'Copied to clipboard!';
        }, 2000);
    });

    document.getElementById('btn-extract-emails').addEventListener('click', () => {
        const text = textInput.value;
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails = text.match(emailRegex) || [];
        const uniqueEmails = [...new Set(emails)];
        
        if (uniqueEmails.length === 0) {
            alert('No emails found.');
        } else {
            openModal(`Extracted Emails (${uniqueEmails.length})`, uniqueEmails.join('\n'));
        }
    });

    document.getElementById('btn-extract-urls').addEventListener('click', () => {
        const text = textInput.value;
        const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        const urls = text.match(urlRegex) || [];
        const uniqueUrls = [...new Set(urls)];
        
        if (uniqueUrls.length === 0) {
            alert('No URLs found.');
        } else {
            openModal(`Extracted URLs (${uniqueUrls.length})`, uniqueUrls.join('\n'));
        }
    });

    // Initialize stats
    updateStats();
});
