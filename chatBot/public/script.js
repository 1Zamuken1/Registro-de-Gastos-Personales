class ChatBot {
    constructor(options = {}) {
        this.serverUrl = options.serverUrl || 'http://localhost:5500/chat';
        this.cssPath = options.cssPath || '/chatBot/public/style.css'; // Ruta al archivo CSS
        this.isLoading = false;
        this.init();
    }

    async init() {
        this.loadStyles();
        await this.injectHTML();
        // Solo vincular eventos si el HTML se cargó correctamente
        if (document.getElementById('chatbotModal')) {
            this.bindEvents();
            console.log('ChatBot component initialized');
        } else {
            console.error('ChatBot initialization failed - HTML not loaded');
        }
    }

    loadStyles() {
        // Verificar si los estilos ya están cargados
        if (document.getElementById('chatbot-styles-link')) return;

        // Crear el elemento link para cargar el CSS
        const link = document.createElement('link');
        link.id = 'chatbot-styles-link';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = this.cssPath;
        
        // Agregar al head
        document.head.appendChild(link);
        
        console.log('ChatBot styles loaded from:', this.cssPath);
    }

    async injectHTML() {
        if (document.getElementById('chatbotModal')) return;

        try {
            const response = await fetch('/chatBot/public/index.html'); 
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            document.body.insertAdjacentHTML('beforeend', html);
            
            console.log('ChatBot HTML injected successfully');
        } catch (error) {
            console.error('Error cargando el HTML del chatbot:', error);
        }
    }

    bindEvents() {
        // Verificar que los elementos existen antes de agregar eventos
        const floatBtn = document.getElementById('chatbotFloatBtn');
        const closeBtn = document.getElementById('chatbotCloseBtn');
        const modal = document.getElementById('chatbotModal');
        const input = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSend');

        if (!floatBtn || !closeBtn || !modal || !input || !sendBtn) {
            console.error('No se pudieron encontrar todos los elementos del chatbot');
            // Intentar nuevamente después de un pequeño delay
            setTimeout(() => this.bindEvents(), 100);
            return;
        }

        // Abrir chatbot
        floatBtn.addEventListener('click', () => this.open());

        // Cerrar chatbot
        closeBtn.addEventListener('click', () => this.close());

        // Cerrar al hacer click fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close();
            }
        });

        // Enviar mensaje con Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isLoading) {
                this.sendMessage();
            }
        });

        // Enviar mensaje con botón
        sendBtn.addEventListener('click', () => this.sendMessage());

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.close();
            }
        });

        console.log('ChatBot events bound successfully');
    }

    open() {
        const modal = document.getElementById('chatbotModal');
        const input = document.getElementById('chatbotInput');
        
        if (modal && input) {
            modal.classList.add('active');
            input.focus();
        }
    }

    close() {
        const modal = document.getElementById('chatbotModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message || this.isLoading) return;
        
        // Agregar mensaje del usuario
        this.addMessage(message, 'user');
        input.value = '';
        
        // Mostrar estado de carga
        this.isLoading = true;
        this.updateSendButton(true);
        
        const loadingMessageId = this.addMessage('', 'A.F', true);
        
        try {
            const response = await fetch(this.serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });
            
            const data = await response.json();
            
            // Remover mensaje de carga
            this.removeMessage(loadingMessageId);
            
            // Agregar respuesta del A.F
            if (response.ok) {
                this.addMessage(data.reply, '');
            } else {
                this.addMessage('Error: ' + (data.reply || 'No se pudo obtener respuesta'), 'A.F');
            }
            
        } catch (error) {
            console.error('ChatBot Error:', error);
            this.removeMessage(loadingMessageId);
            this.addMessage('Error de conexión. Verifica que el servidor esté ejecutándose.', 'A.F');
        } finally {
            this.isLoading = false;
            this.updateSendButton(false);
        }
    }

    addMessage(text, sender, isTemporary = false) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) {
            console.error('Messages container not found');
            return null;
        }

        const messageDiv = document.createElement('div');
        const messageId = 'chatbot_msg_' + Date.now() + Math.random();
        
        messageDiv.className = `chatbot-message ${sender}`;
        messageDiv.id = messageId;
        
        if (isTemporary && sender === 'A.F') {
            messageDiv.innerHTML = `
                <div class="chatbot-message-sender">A.F</div>
                <div class="chatbot-message-content">
                    <div class="chatbot-typing-indicator">
                        <div class="chatbot-typing-dot"></div>
                        <div class="chatbot-typing-dot"></div>
                        <div class="chatbot-typing-dot"></div>
                    </div>
                </div>
            `;
        } else if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="chatbot-message-sender">Tú</div>
                <div class="chatbot-message-content">${this.escapeHtml(text)}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="chatbot-message-sender">A.F</div>
                <div class="chatbot-message-content">${this.escapeHtml(text)}</div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return isTemporary ? messageId : null;
    }

    removeMessage(messageId) {
        if (messageId) {
            const element = document.getElementById(messageId);
            if (element) {
                element.remove();
            }
        }
    }

    updateSendButton(loading) {
        const button = document.getElementById('chatbotSend');
        if (button) {
            if (loading) {
                button.disabled = true;
                button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" 
                 width="16" 
                 height="16" 
                 fill="currentColor" 
                 class="spinner" 
                 viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
            </svg>
        `;
            } else {
                button.disabled = false;
                button.innerHTML = '➤';
            }
        }
    }

    // Método para cambiar la URL del servidor
    setServerUrl(url) {
        this.serverUrl = url;
    }

    // Método para cambiar la ruta del CSS
    setCssPath(path) {
        this.cssPath = path;
        // Recargar estilos si es necesario
        const existingLink = document.getElementById('chatbot-styles-link');
        if (existingLink) {
            existingLink.href = path;
        }
    }

    // Método para escapar HTML y prevenir XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Método para limpiar el historial de chat
    clearMessages() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="chatbot-message A.F">
                    <div class="chatbot-message-sender">A.F</div>
                    <div class="chatbot-message-content">
                        ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                    </div>
                </div>
            `;
        }
    }

    // Método para destruir el chatbot completamente
    destroy() {
        // Remover elementos del DOM
        const modal = document.getElementById('chatbotModal');
        const floatBtn = document.getElementById('chatbotFloatBtn');
        const stylesLink = document.getElementById('chatbot-styles-link');
        
        if (modal) modal.remove();
        if (floatBtn) floatBtn.remove();
        if (stylesLink) stylesLink.remove();
        
        console.log('ChatBot destroyed');
    }
}

// Función global para inicializar el chatbot
function initChatBot(options = {}) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.chatBot = new ChatBot(options);
        });
    } else {
        window.chatBot = new ChatBot(options);
    }
}

// Exportar para uso como módulo si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChatBot, initChatBot };
}