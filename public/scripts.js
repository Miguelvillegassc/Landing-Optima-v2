// Navegación scroll effect
document.addEventListener('scroll', function () {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('nav-colored');
        nav.classList.remove('nav-transparent');
    } else {
        nav.classList.add('nav-transparent');
        nav.classList.remove('nav-colored');
    }
});

// Smooth scroll mejorado
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            console.log(`Navegando a: ${targetId}`, target);
        } else {
            console.log(`No se encontró el elemento: ${targetId}`);
        }
    });
});

// Intersection Observer para animaciones
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observar elementos con animación
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Animación de las partículas en el hero
function createParticles() {
    const heroSection = document.querySelector('.hero-particles');
    if (!heroSection) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = Math.random() * 4 + 4 + 's';
        heroSection.appendChild(particle);
    }
}

// Inicializar partículas
createParticles();

// Función para mostrar notificaciones
function showNotification(message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos inline para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Form submission handling ACTUALIZADO
document.querySelector('.contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const button = this.querySelector('.submit-button');
    const originalText = button.innerHTML;
    
    // Obtener datos del formulario
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        empresa: document.getElementById('empresa').value.trim(),
        mensaje: document.getElementById('mensaje').value.trim()
    };
    
    // Validación básica
    if (!formData.nombre || !formData.email || !formData.mensaje) {
        showNotification('Por favor completa todos los campos requeridos', 'error');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showNotification('Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Loading state
    button.innerHTML = '<i class="bi bi-hourglass-split"></i> Enviando...';
    button.disabled = true;
    
    try {
        // Enviar datos al servidor
        const response = await fetch('/api/contacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Éxito
            button.innerHTML = '<i class="bi bi-check-circle"></i> ¡Mensaje Enviado!';
            button.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
            
            showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            
            // Reset form después de 3 segundos
            setTimeout(() => {
                button.innerHTML = originalText;
                button.disabled = false;
                button.style.background = '';
                this.reset();
            }, 3000);
            
        } else {
            throw new Error(result.message || 'Error al enviar el mensaje');
        }
        
    } catch (error) {
        console.error('Error:', error);
        
        // Error state
        button.innerHTML = '<i class="bi bi-exclamation-triangle"></i> Error al Enviar';
        button.style.background = 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)';
        
        showNotification('Error al enviar el mensaje. Por favor intenta de nuevo.', 'error');
        
        // Reset button después de 3 segundos
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
            button.style.background = '';
        }, 3000);
    }
});

// Parallax effect para el hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    const videoBackground = document.querySelector('.video-bg');
    if (videoBackground) {
        videoBackground.style.transform = `translateY(${rate}px)`;
    }
});

// Agregar estilos para las notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;
document.head.appendChild(notificationStyles);

console.log('🚀 OPTIMA Ingeniería - Landing renovada cargada exitosamente');