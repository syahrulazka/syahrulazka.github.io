document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Change active nav item on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('nav ul li a');

    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });

    // Portfolio filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-level');
    let skillsAnimated = false;

    function animateSkills() {
        const skillsSection = document.querySelector('.skills');
        const skillsPosition = skillsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (skillsPosition < screenPosition && !skillsAnimated) {
            skillsAnimated = true;
            skillBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
        }
    }

    window.addEventListener('scroll', animateSkills);

    // Chatbot functionality
    const chatButton = document.querySelector('.chat-button');
    const chatBox = document.querySelector('.chat-box');
    const closeChat = document.querySelector('.close-chat');
    const chatMessages = document.querySelector('.chat-messages');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.send-button');

    // Toggle chat box
    chatButton.addEventListener('click', function() {
        chatBox.classList.toggle('active');
        if (chatBox.classList.contains('active')) {
            chatInput.focus();
        }
    });

    closeChat.addEventListener('click', function() {
        chatBox.classList.remove('active');
    });

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        
        if (message !== '') {
            // Add user message to chat
            addMessage(message, 'user');
            
            // Clear input
            chatInput.value = '';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Send to backend and get response
            fetchBotResponse(message);
        }
    }

    // Add message to chat
    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(messageElement);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('message', 'bot', 'typing-indicator');
        typingIndicator.innerHTML = '<p>Mengetik...</p>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Fetch response from backend
    async function fetchBotResponse(message) {
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            removeTypingIndicator();
            
            // Add bot response
            addMessage(data.response, 'bot');
        } catch (error) {
            console.error('Error:', error);
            removeTypingIndicator();
            addMessage('Maaf, terjadi kesalahan. Silakan coba lagi nanti.', 'bot');
        }
    }

    // Send message when clicking send button
    sendButton.addEventListener('click', sendMessage);

    // Send message when pressing Enter
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    
});