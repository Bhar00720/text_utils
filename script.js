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
        textInput.value = textInput.value.toLowerCase().split(' ').map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        }).join(' ');
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

    // Initialize stats
    updateStats();
});
