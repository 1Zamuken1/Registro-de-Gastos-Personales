class ChatBot {
    constructor(options = {}) {
        this.serverUrl = options.serverUrl || 'http://localhost:5500/chat';
        this.isLoading = false;
        this.init();
    }

    init() {
        this.injectStyles();
        this.injectHTML();
        this.bindEvents();
        console.log('ChatBot component initialized');
    }

    injectStyles() {
        if (document.getElementById('chatbot-styles')) return;

        const styles = `
            <style id="chatbot-styles">
                /* Estilos del botón flotante */
                .chatbot-float-button {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    transition: all 0.3s ease;
                }

                .chatbot-float-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(0,0,0,0.4);
                }

                /* Estilos del modal */
                .chatbot-modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 1001;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .chatbot-modal.active {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 1;
                }

                .chatbot-container {
                    background: white;
                    width: 90%;
                    max-width: 500px;
                    height: 600px;
                    border-radius: 15px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transform: scale(0.8);
                    transition: transform 0.3s ease;
                }

                .chatbot-modal.active .chatbot-container {
                    transform: scale(1);
                }

                /* Header del chatbot */
                .chatbot-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .chatbot-title {
                    font-size: 18px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .chatbot-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 5px;
                    border-radius: 50%;
                    width: 35px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s ease;
                }

                .chatbot-close:hover {
                    background: rgba(255,255,255,0.2);
                }

                /* Área de mensajes */
                .chatbot-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: #f8f9fa;
                }

                .chatbot-message {
                    margin-bottom: 15px;
                    display: flex;
                    flex-direction: column;
                }

                .chatbot-message.user {
                    align-items: flex-end;
                }

                .chatbot-message.bot {
                    align-items: flex-start;
                }

                .chatbot-message-sender {
                    font-size: 12px;
                    color: #666;
                    margin-bottom: 5px;
                    font-weight: bold;
                }

                .chatbot-message-content {
                    max-width: 80%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    word-wrap: break-word;
                }

                .chatbot-message.user .chatbot-message-content {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }

                .chatbot-message.bot .chatbot-message-content {
                    background: white;
                    color: #333;
                    border: 1px solid #e0e0e0;
                }

                /* Área de input */
                .chatbot-input-area {
                    padding: 20px;
                    background: white;
                    border-top: 1px solid #e0e0e0;
                    display: flex;
                    gap: 10px;
                }

                .chatbot-input {
                    flex: 1;
                    padding: 12px 16px;
                    border: 2px solid #e0e0e0;
                    border-radius: 25px;
                    outline: none;
                    font-size: 14px;
                    transition: border-color 0.3s ease;
                }

                .chatbot-input:focus {
                    border-color: #667eea;
                }

                .chatbot-send {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 45px;
                    height: 45px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .chatbot-send:hover:not(:disabled) {
                    transform: scale(1.1);
                }

                .chatbot-send:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Loading animation */
                .chatbot-typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 8px 0;
                }

                .chatbot-typing-dot {
                    width: 8px;
                    height: 8px;
                    background: #999;
                    border-radius: 50%;
                    animation: chatbot-typing 1.4s infinite ease-in-out;
                }

                .chatbot-typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .chatbot-typing-dot:nth-child(2) { animation-delay: -0.16s; }

                @keyframes chatbot-typing {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1); }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .chatbot-container {
                        width: 95%;
                        height: 80vh;
                    }
                    
                    .chatbot-float-button {
                        bottom: 15px;
                        right: 15px;
                        width: 55px;
                        height: 55px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    injectHTML() {
        if (document.getElementById('chatbotModal')) return;

        const html = `
            <!-- Botón flotante para abrir el chatbot -->
            <button class="chatbot-float-button" id="chatbotFloatBtn" title="Abrir Chat">
                💬
            </button>

            <!-- Modal del chatbot -->
            <div id="chatbotModal" class="chatbot-modal">
                <div class="chatbot-container">
                    <!-- Header -->
                    <div class="chatbot-header">
                        <div class="chatbot-title">
                            🤖 ChatBot Assistant
                        </div>
                        <button class="chatbot-close" id="chatbotCloseBtn" title="Cerrar">
                            ×
                        </button>
                    </div>

                    <!-- Área de mensajes -->
                    <div id="chatbotMessages" class="chatbot-messages">
                        <div class="chatbot-message bot">
                            <div class="chatbot-message-sender">Bot</div>
                            <div class="chatbot-message-content">
                                ¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                            </div>
                        </div>
                    </div>

                    <!-- Área de input -->
                    <div class="chatbot-input-area">
                        <input 
                            type="text" 
                            id="chatbotInput" 
                            class="chatbot-input" 
                            placeholder="Escribe tu mensaje aquí..."
                        >
                        <button id="chatbotSend" class="chatbot-send" title="Enviar">
                            ➤
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    bindEvents() {
        const floatBtn = document.getElementById('chatbotFloatBtn');
        const closeBtn = document.getElementById('chatbotCloseBtn');
        const modal = document.getElementById('chatbotModal');
        const input = document.getElementById('chatbotInput');
        const sendBtn = document.getElementById('chatbotSend');

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
    }

    open() {
        document.getElementById('chatbotModal').classList.add('active');
        document.getElementById('chatbotInput').focus();
    }

    close() {
        document.getElementById('chatbotModal').classList.remove('active');
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
        
        const loadingMessageId = this.addMessage('', 'bot', true);
        
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
            
            // Agregar respuesta del bot
            if (response.ok) {
                this.addMessage(data.reply, 'bot');
            } else {
                this.addMessage('Error: ' + (data.reply || 'No se pudo obtener respuesta'), 'bot');
            }
            
        } catch (error) {
            console.error('ChatBot Error:', error);
            this.removeMessage(loadingMessageId);
            this.addMessage('Error de conexión. Verifica que el servidor esté ejecutándose.', 'bot');
        } finally {
            this.isLoading = false;
            this.updateSendButton(false);
        }
    }

    addMessage(text, sender, isTemporary = false) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        const messageId = 'chatbot_msg_' + Date.now() + Math.random();
        
        messageDiv.className = `chatbot-message ${sender}`;
        messageDiv.id = messageId;
        
        if (isTemporary && sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="chatbot-message-sender">Bot</div>
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
                <div class="chatbot-message-content">${text}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="chatbot-message-sender">Bot</div>
                <div class="chatbot-message-content">${text}</div>
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
        if (loading) {
            button.disabled = true;
            button.innerHTML = '⏳';
        } else {
            button.disabled = false;
            button.innerHTML = '➤';
        }
    }

    // Método para cambiar la URL del servidor
    setServerUrl(url) {
        this.serverUrl = url;
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