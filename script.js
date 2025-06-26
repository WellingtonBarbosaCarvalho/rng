// Variáveis globais para controle de urgência
let spotsLeft = 7;
let countdownActive = true;

// Função principal para abrir WhatsApp com mensagem personalizada
function openWhatsApp(service = '') {
    const phoneNumber = '5511965963534'; // Número do Felipe
    
    // Mensagens personalizadas por serviço
    const messages = {
        'smartphone': 'Olá! Vi a oferta no site e preciso consertar meu SMARTPHONE. Quero aproveitar o diagnóstico GRATUITO! 📱',
        'tablet': 'Oi! Vim pelo site e preciso de ajuda com meu TABLET. Quero o diagnóstico gratuito! 📟',
        'notebook': 'Olá! Vi a promoção e meu NOTEBOOK precisa de reparo. Posso aproveitar o diagnóstico GRATUITO? 💻',
        'pc': 'Oi! Encontrei vocês no site e preciso consertar meu PC. Quero aproveitar a oferta! 🖥️',
        'default': 'Olá! Vi a oferta IMPERDÍVEL no site e quero aproveitar o DIAGNÓSTICO GRATUITO hoje mesmo! Quando posso levar meu aparelho? ⚡'
    };
    
    const message = messages[service] || messages['default'];
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Analytics tracking (opcional)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
            'event_category': 'conversion',
            'event_label': service || 'general',
            'value': 1
        });
    }
    
    // Diminui o número de vagas disponíveis
    updateSpotsLeft();
    
    // Abre WhatsApp
    window.open(whatsappURL, '_blank');
}

// Função para atualizar vagas restantes
function updateSpotsLeft() {
    if (spotsLeft > 1) {
        spotsLeft--;
        const spotsElement = document.getElementById('spots');
        if (spotsElement) {
            spotsElement.textContent = `${spotsLeft} vagas restantes`;
            
            // Adiciona efeito visual quando a vaga diminui
            spotsElement.style.animation = 'none';
            setTimeout(() => {
                spotsElement.style.animation = 'urgentBlink 1s ease-in-out 3';
            }, 10);
        }
        
        // Salva no localStorage para persistir entre sessões
        try {
            localStorage.setItem('rng_spots_left', spotsLeft.toString());
        } catch (e) {
            // Fallback se localStorage não estiver disponível
            console.log('LocalStorage não disponível');
        }
    }
}

// Função do countdown timer
function startCountdown() {
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (!hoursEl || !minutesEl || !secondsEl) return;
    
    // Define o tempo inicial (ou recupera do localStorage)
    let timeLeft;
    try {
        const saved = localStorage.getItem('rng_countdown');
        timeLeft = saved ? parseInt(saved) : 24 * 60 * 60; // 24 horas em segundos
    } catch (e) {
        timeLeft = 24 * 60 * 60; // Fallback para 24 horas
    }
    
    const timer = setInterval(() => {
        if (timeLeft <= 0) {
            // Reinicia o countdown para manter a urgência
            timeLeft = 24 * 60 * 60;
        }
        
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        hoursEl.textContent = hours.toString().padStart(2, '0');
        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
        
        // Salva o estado atual
        try {
            localStorage.setItem('rng_countdown', timeLeft.toString());
        } catch (e) {
            // Continua funcionando mesmo sem localStorage
        }
        
        timeLeft--;
        
        // Adiciona efeito de urgência quando o tempo está acabando
        if (timeLeft < 3600) { // Menos de 1 hora
            document.querySelector('.countdown').style.animation = 'urgentPulse 1s infinite';
        }
        
    }, 1000);
    
    return timer;
}

// Função para animações na rolagem
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Seleciona elementos para animar
    const animatedElements = document.querySelectorAll(
        '.trust-item, .problem-card, .service-card, .testimonial-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}

// Função para smooth scroll nos links âncora
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função para criar efeito parallax sutil
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const heroBg = document.querySelector('.hero-bg');
        if (heroBg) {
            heroBg.style.transform = `translateY(${rate}px)`;
        }
        
        const phoneModal = document.querySelector('.phone-mockup');
        if (phoneModal) {
            const parallaxRate = scrolled * 0.3;
            phoneModal.style.transform = `perspective(1000px) rotateY(-15deg) translateY(${parallaxRate}px)`;
        }
    });
}

// Função para adicionar micro-interações nos botões
function setupButtonInteractions() {
    document.querySelectorAll('.cta-btn').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(-1px) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
    });
}

// Função para mostrar notificações de conversão social
function showSocialProof() {
    const notifications = [
        'João de São Paulo acabou de solicitar orçamento! 📱',
        'Maria de Guarulhos consertou seu notebook! 💻',
        'Carlos de Osasco aproveitou a oferta! ⚡',
        'Ana de São Paulo recuperou seus dados! 📂',
        'Pedro de Taboão consertou a tela! 📱'
    ];
    
    let notificationIndex = 0;
    
    function createNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4ECDC4, #44A08D);
            color: white;
            padding: 15px 20px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 14px;
            z-index: 1001;
            transform: translateX(400px);
            transition: all 0.5s ease;
            box-shadow: 0 8px 25px rgba(78, 205, 196, 0.3);
            max-width: 300px;
        `;
        
        notification.textContent = notifications[notificationIndex];
        document.body.appendChild(notification);
        
        // Anima entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove após 4 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
        
        notificationIndex = (notificationIndex + 1) % notifications.length;
    }
    
    // Primeira notificação após 5 segundos
    setTimeout(createNotification, 5000);
    
    // Notificações subsequentes a cada 15-25 segundos
    setInterval(() => {
        if (Math.random() > 0.3) { // 70% de chance
            createNotification();
        }
    }, 20000);
}

// Função para tracking de tempo na página
function trackTimeOnPage() {
    const startTime = Date.now();
    
    window.addEventListener('beforeunload', () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'time_on_page', {
                'event_category': 'engagement',
                'value': timeSpent
            });
        }
    });
}

// Função para detectar intenção de saída e mostrar oferta final
function setupExitIntent() {
    let hasShownExitOffer = false;
    
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !hasShownExitOffer) {
            hasShownExitOffer = true;
            showExitOffer();
        }
    });
}

function showExitOffer() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 20px;
            text-align: center;
            max-width: 500px;
            margin: 20px;
            animation: slideIn 0.5s ease;
        ">
            <h2 style="color: #FF4757; font-size: 28px; margin-bottom: 20px;">
                ⚠️ ESPERA! NÃO PERCA ESSA CHANCE!
            </h2>
            <p style="font-size: 18px; margin-bottom: 25px; color: #333;">
                Antes de sair, que tal aproveitar nosso <strong>DIAGNÓSTICO GRATUITO</strong>?<br>
                <span style="color: #FF4757;">Válido apenas para os próximos visitantes!</span>
            </p>
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="openWhatsApp(); this.parentElement.parentElement.parentElement.remove();" 
                        style="
                            background: linear-gradient(135deg, #25D366, #20c757);
                            color: white;
                            border: none;
                            padding: 15px 25px;
                            border-radius: 50px;
                            font-weight: 600;
                            cursor: pointer;
                            font-size: 16px;
                        ">
                    SIM, QUERO APROVEITAR! 📱
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove();"
                        style="
                            background: #ccc;
                            color: #666;
                            border: none;
                            padding: 15px 25px;
                            border-radius: 50px;
                            font-weight: 600;
                            cursor: pointer;
                            font-size: 16px;
                        ">
                    Não, obrigado
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Remove modal se clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// CSS adicional para animações do modal
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(modalStyles);

// Função para carregar estado inicial das vagas
function loadInitialSpots() {
    try {
        const savedSpots = localStorage.getItem('rng_spots_left');
        if (savedSpots) {
            spotsLeft = parseInt(savedSpots);
            const spotsElement = document.getElementById('spots');
            if (spotsElement) {
                spotsElement.textContent = `${spotsLeft} vagas restantes`;
            }
        }
    } catch (e) {
        // Se não conseguir carregar, mantém o valor padrão
        console.log('Não foi possível carregar o estado das vagas');
    }
}

// Função para adicionar efeitos visuais ao scroll
function addScrollEffects() {
    const whatsappBtn = document.querySelector('.whatsapp-float');
    let isScrolling = false;
    
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            isScrolling = true;
            
            // Adiciona efeito de "pular" no botão do WhatsApp durante scroll
            if (whatsappBtn) {
                whatsappBtn.style.animation = 'none';
                setTimeout(() => {
                    whatsappBtn.style.animation = 'bounce 1s ease-in-out';
                }, 100);
            }
            
            setTimeout(() => {
                isScrolling = false;
            }, 150);
        }
    });
}

// Inicialização quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 RNG Landing Page carregada com sucesso!');
    
    // Inicializa todas as funcionalidades
    loadInitialSpots();
    startCountdown();
    setupScrollAnimations();
    setupSmoothScroll();
    setupParallax();
    setupButtonInteractions();
    addScrollEffects();
    trackTimeOnPage();
    
    // Funcionalidades com delay para melhor UX
    setTimeout(() => {
        showSocialProof();
        setupExitIntent();
    }, 3000);
    
    // Log para debug
    console.log('✅ Todas as funcionalidades inicializadas');
});

// Previne erros em navegadores antigos
window.addEventListener('error', function(e) {
    console.log('Erro capturado:', e.message);
    // Não mostra erros para o usuário, apenas loga
});

// Função auxiliar para debugging (pode ser removida em produção)
function debugInfo() {
    console.log('Debug Info:', {
        spotsLeft: spotsLeft,
        countdownActive: countdownActive,
        userAgent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    });
}

// Expõe algumas funções globalmente para uso em onclick dos elementos HTML
window.openWhatsApp = openWhatsApp;
window.debugInfo = debugInfo;
