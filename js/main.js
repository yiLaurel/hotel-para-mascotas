const auth = {
    isAuthenticated: false,
    currentUser: null,
    
    init() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.isAuthenticated = true;
            this.currentUser = JSON.parse(user);
            this.updateUI();
        }
    },
    
    login(email, password) {
        
        return new Promise((resolve, reject) => {
            
            document.getElementById('loader').style.display = 'flex';
            document.getElementById('loader-text').textContent = 'Verificando credenciales...';
            
            setTimeout(() => {
              
                document.getElementById('loader').style.display = 'none';
                
                
                if (email === 'usuario@ejemplo.com' && password === 'password123') {
                    this.isAuthenticated = true;
                    this.currentUser = {
                        name: 'Usuario Ejemplo',
                        email: email,
                        petName: 'Firulais',
                        pets: ['Firulais', 'Luna', 'Rocky']
                    };
                    
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    this.updateUI();
                    resolve();
                } else {
                    reject(new Error('Credenciales incorrectas. Intenta con: usuario@ejemplo.com / password123'));
                }
            }, 1500);
        });
    },
    
    register(name, email, password, petName) {
        
        return new Promise((resolve, reject) => {
         
            if (!name || !email || !password || !petName) {
                reject(new Error('Todos los campos son obligatorios'));
                return;
            }
            
            if (password.length < 8) {
                reject(new Error('La contraseña debe tener al menos 8 caracteres'));
                return;
            }
            
            if (password !== document.getElementById('confirm-password').value) {
                reject(new Error('Las contraseñas no coinciden'));
                return;
            }
            
           
            document.getElementById('loader').style.display = 'flex';
            document.getElementById('loader-text').textContent = 'Creando tu cuenta...';
            
            setTimeout(() => {
                
                document.getElementById('loader').style.display = 'none';
                
                this.isAuthenticated = true;
                this.currentUser = {
                    name: name,
                    email: email,
                    petName: petName,
                    pets: [petName]
                };
                
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                localStorage.setItem(`ultimaMascota_${email}`, petName);
                this.updateUI();
                resolve();
            }, 2000);
        });
    },
    
    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
    },
    
    updateUI() {
        if (this.isAuthenticated && this.currentUser) {
           
            document.getElementById('auth-buttons').style.display = 'none';
            document.getElementById('user-info').style.display = 'flex';
            document.getElementById('user-avatar').textContent = this.currentUser.name.charAt(0).toUpperCase();
            document.getElementById('user-name').textContent = this.currentUser.name.split(' ')[0];
            document.getElementById('welcome-message').textContent = `¡Bienvenido de nuevo, ${this.currentUser.name.split(' ')[0]}!`;
            
          
            document.getElementById('guest-message').style.display = 'none';
            document.getElementById('user-form').style.display = 'block';
            
         
            if (localStorage.getItem(`ultimaMascota_${this.currentUser.email}`)) {
                document.getElementById('nombre_mascota').value = 
                    localStorage.getItem(`ultimaMascota_${this.currentUser.email}`);
            }
            
            
            if (this.currentUser.pets && this.currentUser.pets.length > 0) {
                const mascotaInput = document.getElementById('nombre_mascota');
                mascotaInput.value = this.currentUser.pets[0];
            }
        } else {
            
            document.getElementById('auth-buttons').style.display = 'flex';
            document.getElementById('user-info').style.display = 'none';
            document.getElementById('welcome-message').textContent = '¡Bienvenido a nuestro Hotel de Mascotas!';
            
           
            document.getElementById('guest-message').style.display = 'flex';
            document.getElementById('user-form').style.display = 'none';
        }
    },
    
    addPet(petName) {
        if (!this.currentUser) return;
        
        if (!this.currentUser.pets) {
            this.currentUser.pets = [];
        }
        
        if (!this.currentUser.pets.includes(petName)) {
            this.currentUser.pets.push(petName);
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }
};


const modal = {
    open(id) {
        document.getElementById(id).style.display = 'flex';
        document.body.style.overflow = 'hidden';
    },
    
    close(id) {
        document.getElementById(id).style.display = 'none';
        document.body.style.overflow = 'auto';
    },
    
    init() {
        
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.close(e.target.id);
            }
        });
        
        
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal');
                this.close(modal.id);
            });
        });
        
       
        document.getElementById('btn-login').addEventListener('click', () => this.open('login-modal'));
        document.getElementById('btn-register').addEventListener('click', () => this.open('register-modal'));
        document.getElementById('btn-login-2').addEventListener('click', () => this.open('login-modal'));
        document.getElementById('btn-register-2').addEventListener('click', () => this.open('register-modal'));
        
    
        document.getElementById('go-to-register').addEventListener('click', (e) => {
            e.preventDefault();
            this.close('login-modal');
            this.open('register-modal');
        });
        
        document.getElementById('go-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.close('register-modal');
            this.open('login-modal');
        });
        
        document.getElementById('forgot-password').addEventListener('click', (e) => {
            e.preventDefault();
            this.close('login-modal');
            this.open('recover-modal');
        });
        
        document.getElementById('back-to-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.close('recover-modal');
            this.open('login-modal');
        });
    }
};


const tabs = {
    init() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
              
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
    }
};


const faq = {
    init() {
        
        document.getElementById('toggle-faq').addEventListener('click', () => {
            const faqSection = document.getElementById('faq-section');
            const isHidden = faqSection.style.display === 'none' || faqSection.style.display === '';
            
            faqSection.style.display = isHidden ? 'block' : 'none';
            document.getElementById('toggle-faq').innerHTML = isHidden ? 
                '<i class="bi bi-x-circle"></i> Ocultar Preguntas Frecuentes' : 
                '<i class="bi bi-question-circle"></i> Ver Preguntas Frecuentes';
        });
        
      
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                question.classList.toggle('active');
                const answer = question.nextElementSibling;
                answer.classList.toggle('show');
            });
        });
    }
};


const forms = {
    init() {
        
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const alert = document.getElementById('login-alert');
            
            try {
                await auth.login(email, password);
                modal.close('login-modal');
                alert.style.display = 'none';
            } catch (error) {
                alert.style.display = 'block';
                alert.textContent = error.message;
            }
        });
        
       
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirm = document.getElementById('confirm-password').value;
            const petName = document.getElementById('pet-name').value;
            const alert = document.getElementById('register-alert');
            
            try {
                await auth.register(name, email, password, petName);
                modal.close('register-modal');
                alert.style.display = 'none';
            } catch (error) {
                alert.style.display = 'block';
                alert.textContent = error.message;
            }
        });
        
     
        document.getElementById('recover-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('recover-email').value;
            const alert = document.getElementById('recover-alert');
            
           
            alert.style.display = 'block';
            alert.textContent = `Se ha enviado un enlace de recuperación a ${email}`;
            alert.className = 'alert alert-success';
            
           
            setTimeout(() => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelector('.tab[data-tab="reset"]').classList.add('active');
                
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById('reset-tab').classList.add('active');
                
                
                document.getElementById('reset-token').value = 'simulated-token-12345';
            }, 1500);
        });
        
     
        document.getElementById('reset-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const password = document.getElementById('new-password').value;
            const confirm = document.getElementById('confirm-new-password').value;
            const alert = document.getElementById('recover-alert');
            
            
            if (password !== confirm) {
                alert.style.display = 'block';
                alert.textContent = 'Las contraseñas no coinciden';
                alert.className = 'alert alert-danger';
                return;
            }
            
            if (password.length < 8) {
                alert.style.display = 'block';
                alert.textContent = 'La contraseña debe tener al menos 8 caracteres';
                alert.className = 'alert alert-danger';
                return;
            }
            
            
            alert.style.display = 'block';
            alert.textContent = 'Contraseña cambiada correctamente. Ya puedes iniciar sesión.';
            alert.className = 'alert alert-success';
            
            
            setTimeout(() => {
                modal.close('recover-modal');
                modal.open('login-modal');
            }, 2000);
        });
        
        
        document.getElementById('camara-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const camara = document.getElementById('numero_camara').value;
            const mascota = document.getElementById('nombre_mascota').value;
            
            if (!camara || !mascota) {
                alert('Por favor complete todos los campos');
                return false;
            }
            
           
            if (auth.currentUser) {
                localStorage.setItem(`ultimaMascota_${auth.currentUser.email}`, mascota);
                auth.addPet(mascota);
            }
            
           
            const loader = document.getElementById('loader');
            document.getElementById('loader-text').textContent = 
                `Cargando cámara ${camara} para ${mascota}...`;
            loader.style.display = 'flex';
            
            
            setTimeout(() => {
                e.target.submit();
            }, 1000);
        });
        
        
        document.getElementById('ver-historial').addEventListener('click', (e) => {
            e.preventDefault();
            
            if (auth.currentUser && auth.currentUser.pets) {
                const listaMascotas = auth.currentUser.pets.map(pet => `- ${pet}`).join('\n');
                alert(`Tus mascotas registradas:\n\n${listaMascotas}`);
            } else {
                alert('No tienes mascotas registradas aún.');
            }
        });
    }
};


document.getElementById('btn-logout').addEventListener('click', () => {
    auth.logout();
});


document.addEventListener('DOMContentLoaded', () => {
    auth.init();
    modal.init();
    tabs.init();
    faq.init();
    forms.init();
    
    
    const img = new Image();
    img.src = 'http://10.13.15.118:8080/video';
});