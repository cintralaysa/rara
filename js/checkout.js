/* ============================================
   MELODIA INÉDITA - CHECKOUT JAVASCRIPT
   ============================================ */

// Form Data Storage
let formData = {
    step1: {},
    step2: {}
};

// Current Step
let currentStep = 1;

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    initForms();
    initCharCounter();
    initPhoneMask();
});

/* ============================================
   FORM INITIALIZATION
   ============================================ */
function initForms() {
    // Step 1 Form
    const form1 = document.getElementById('form-step-1');
    if (form1) {
        form1.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateStep1()) {
                saveStep1Data();
                goToStep(2);
            }
        });
    }

    // Step 2 Form
    const form2 = document.getElementById('form-step-2');
    if (form2) {
        form2.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateStep2()) {
                saveStep2Data();
                goToStep(3);
            }
        });
    }
}

/* ============================================
   STEP NAVIGATION
   ============================================ */
function goToStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(el => {
        el.classList.remove('active');
    });

    // Show target step
    const targetStep = document.getElementById(`step-${step}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }

    // Update progress indicators
    updateProgressSteps(step);

    // Update current step
    currentStep = step;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressSteps(activeStep) {
    const steps = document.querySelectorAll('.progress-steps .step');
    const lines = document.querySelectorAll('.progress-steps .step-line');

    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNum < activeStep) {
            step.classList.add('completed');
        } else if (stepNum === activeStep) {
            step.classList.add('active');
        }
    });

    lines.forEach((line, index) => {
        if (index < activeStep - 1) {
            line.classList.add('active');
        } else {
            line.classList.remove('active');
        }
    });
}

/* ============================================
   FORM VALIDATION
   ============================================ */
function validateStep1() {
    const ocasiao = document.getElementById('ocasiao').value;
    const nomeHomenageado = document.getElementById('nome-homenageado').value.trim();
    const relacao = document.getElementById('relacao').value.trim();
    const historia = document.getElementById('historia').value.trim();

    let isValid = true;
    let firstError = null;

    // Clear previous errors
    clearErrors();

    if (!ocasiao) {
        showError('ocasiao', 'Selecione uma ocasião');
        if (!firstError) firstError = 'ocasiao';
        isValid = false;
    }

    if (!nomeHomenageado) {
        showError('nome-homenageado', 'Digite o nome do homenageado');
        if (!firstError) firstError = 'nome-homenageado';
        isValid = false;
    }

    if (!relacao) {
        showError('relacao', 'Digite sua relação com a pessoa');
        if (!firstError) firstError = 'relacao';
        isValid = false;
    }

    if (!historia) {
        showError('historia', 'Conte a história para a música');
        if (!firstError) firstError = 'historia';
        isValid = false;
    } else if (historia.length < 50) {
        showError('historia', 'Conte mais detalhes (mínimo 50 caracteres)');
        if (!firstError) firstError = 'historia';
        isValid = false;
    }

    if (firstError) {
        document.getElementById(firstError).focus();
    }

    return isValid;
}

function validateStep2() {
    const nome = document.getElementById('seu-nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();

    let isValid = true;
    let firstError = null;

    // Clear previous errors
    clearErrors();

    if (!nome) {
        showError('seu-nome', 'Digite seu nome');
        if (!firstError) firstError = 'seu-nome';
        isValid = false;
    }

    if (!email) {
        showError('email', 'Digite seu e-mail');
        if (!firstError) firstError = 'email';
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Digite um e-mail válido');
        if (!firstError) firstError = 'email';
        isValid = false;
    }

    if (!whatsapp) {
        showError('whatsapp', 'Digite seu WhatsApp');
        if (!firstError) firstError = 'whatsapp';
        isValid = false;
    } else if (whatsapp.replace(/\D/g, '').length < 10) {
        showError('whatsapp', 'Digite um número válido');
        if (!firstError) firstError = 'whatsapp';
        isValid = false;
    }

    if (firstError) {
        document.getElementById(firstError).focus();
    }

    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#ef4444';

        // Create error message
        const errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.style.cssText = 'color: #ef4444; font-size: 0.75rem; display: block; margin-top: 0.25rem;';
        errorEl.textContent = message;

        field.parentNode.appendChild(errorEl);
    }
}

function clearErrors() {
    // Reset field borders
    document.querySelectorAll('input, select, textarea').forEach(field => {
        field.style.borderColor = '';
    });

    // Remove error messages
    document.querySelectorAll('.error-message').forEach(el => el.remove());
}

/* ============================================
   SAVE FORM DATA
   ============================================ */
function saveStep1Data() {
    formData.step1 = {
        ocasiao: document.getElementById('ocasiao').value,
        nomeHomenageado: document.getElementById('nome-homenageado').value,
        relacao: document.getElementById('relacao').value,
        historia: document.getElementById('historia').value,
        palavrasIncluir: document.getElementById('palavras-incluir').value,
        estilo: document.getElementById('estilo').value
    };
    console.log('Step 1 Data:', formData.step1);
}

function saveStep2Data() {
    formData.step2 = {
        nome: document.getElementById('seu-nome').value,
        email: document.getElementById('email').value,
        whatsapp: document.getElementById('whatsapp').value,
        dataEntrega: document.getElementById('data-entrega').value,
        observacoes: document.getElementById('observacoes').value
    };
    console.log('Step 2 Data:', formData.step2);
}

/* ============================================
   PIX FUNCTIONS
   ============================================ */
function copyPixCode() {
    const pixCode = document.getElementById('pix-code');
    pixCode.select();
    pixCode.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(pixCode.value).then(() => {
        const feedback = document.getElementById('copy-feedback');
        feedback.classList.add('show');

        setTimeout(() => {
            feedback.classList.remove('show');
        }, 3000);
    }).catch(err => {
        // Fallback for older browsers
        document.execCommand('copy');
        const feedback = document.getElementById('copy-feedback');
        feedback.classList.add('show');

        setTimeout(() => {
            feedback.classList.remove('show');
        }, 3000);
    });
}

function confirmPayment() {
    // Show loading state
    const btn = event.target.closest('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    btn.disabled = true;

    // Simulate processing (in production, this would send data to server)
    setTimeout(() => {
        // Send data via WhatsApp
        sendOrderToWhatsApp();

        // Show success step
        goToStep('success');

        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

/* ============================================
   SEND ORDER TO WHATSAPP
   ============================================ */
function sendOrderToWhatsApp() {
    const data = {
        ...formData.step1,
        ...formData.step2
    };

    // Format message
    const message = `
🎵 *NOVO PEDIDO - MELODIA INÉDITA*

📋 *INFORMAÇÕES DA MÚSICA:*
• Ocasião: ${getOcasiaoLabel(data.ocasiao)}
• Homenageado: ${data.nomeHomenageado}
• Relação: ${data.relacao}
• Estilo Musical: ${getEstiloLabel(data.estilo)}

📝 *HISTÓRIA:*
${data.historia}

${data.palavrasIncluir ? `✨ *Palavras a incluir:* ${data.palavrasIncluir}` : ''}

👤 *DADOS DO CLIENTE:*
• Nome: ${data.nome}
• E-mail: ${data.email}
• WhatsApp: ${data.whatsapp}
${data.dataEntrega ? `• Precisa para: ${formatDate(data.dataEntrega)}` : ''}
${data.observacoes ? `• Observações: ${data.observacoes}` : ''}

💰 *VALOR: R$ 79,99 (2 músicas)*
📱 *Pagamento via PIX confirmado pelo cliente*
    `.trim();

    // Encode for URL
    const encodedMessage = encodeURIComponent(message);

    // Your WhatsApp number (change this!)
    const whatsappNumber = '5585999999999';

    // Open WhatsApp with message
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Open in new tab
    window.open(whatsappURL, '_blank');
}

function getOcasiaoLabel(value) {
    const labels = {
        'aniversario': 'Aniversário',
        'casamento': 'Casamento / Noivado',
        'dia-maes': 'Dia das Mães',
        'dia-pais': 'Dia dos Pais',
        'dia-namorados': 'Dia dos Namorados',
        'cha-revelacao': 'Chá Revelação',
        'formatura': 'Formatura',
        'homenagem-postuma': 'Homenagem Póstuma',
        'bodas': 'Bodas',
        'nascimento': 'Nascimento / Mesversário',
        'amizade': 'Amizade',
        'outro': 'Outro'
    };
    return labels[value] || value;
}

function getEstiloLabel(value) {
    const labels = {
        'romantico': 'Romântico / Balada',
        'alegre': 'Alegre / Pop',
        'sertanejo': 'Sertanejo',
        'mpb': 'MPB',
        'gospel': 'Gospel',
        'infantil': 'Infantil',
        'surpresa': 'Me surpreenda!'
    };
    return labels[value] || value;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

/* ============================================
   CHARACTER COUNTER
   ============================================ */
function initCharCounter() {
    const historia = document.getElementById('historia');
    const charCount = document.getElementById('char-count');

    if (historia && charCount) {
        historia.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;

            if (count > 1000) {
                this.value = this.value.substring(0, 1000);
                charCount.textContent = 1000;
            }
        });
    }
}

/* ============================================
   PHONE MASK
   ============================================ */
function initPhoneMask() {
    const whatsapp = document.getElementById('whatsapp');

    if (whatsapp) {
        whatsapp.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length > 11) {
                value = value.substring(0, 11);
            }

            if (value.length > 0) {
                value = '(' + value;
            }
            if (value.length > 3) {
                value = value.substring(0, 3) + ') ' + value.substring(3);
            }
            if (value.length > 10) {
                value = value.substring(0, 10) + '-' + value.substring(10);
            }

            e.target.value = value;
        });
    }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
