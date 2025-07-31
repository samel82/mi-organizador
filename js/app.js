// Variables globales para almacenar datos
let dailyTasks = JSON.parse(localStorage.getItem('dailyTasks')) || [];
let priorityTasks = JSON.parse(localStorage.getItem('priorityTasks')) || [];
let credentials = JSON.parse(localStorage.getItem('credentials')) || [];
let editingIndex = -1;

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplicación iniciada correctamente');
    renderTasks();
    renderCredentials();
    
    // Agregar eventos para presionar Enter en los inputs
    document.getElementById('dailyTaskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask('daily');
        }
    });
    
    document.getElementById('priorityTaskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask('priority');
        }
    });
    
    // Agregar eventos para los inputs de credenciales
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCredential();
        }
    });
});

// ==================== FUNCIONES DE NAVEGACIÓN ====================

function showSection(section) {
    console.log(`📱 Cambiando a sección: ${section}`);
    
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    // Mostrar la sección seleccionada
    document.getElementById(section).classList.add('active');
    event.target.classList.add('active');
}

// ==================== FUNCIONES DE TAREAS ====================

function addTask(type) {
    const inputId = type === 'daily' ? 'dailyTaskInput' : 'priorityTaskInput';
    const input = document.getElementById(inputId);
    const taskText = input.value.trim();
    
    if (taskText) {
        console.log(`➕ Agregando tarea ${type}: ${taskText}`);
        
        if (type === 'daily') {
            dailyTasks.push({
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
        } else {
            priorityTasks.push({
                id: Date.now(),
                text: taskText,
                completed: false,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('priorityTasks', JSON.stringify(priorityTasks));
        }
        
        input.value = '';
        renderTasks();
        showToast(`Tarea agregada: ${taskText}`);
    } else {
        showToast('Por favor escribe una tarea', 'error');
    }
}

function deleteTask(type, index) {
    let taskText;
    
    if (type === 'daily') {
        taskText = dailyTasks[index].text || dailyTasks[index];
        dailyTasks.splice(index, 1);
        localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
    } else {
        taskText = priorityTasks[index].text || priorityTasks[index];
        priorityTasks.splice(index, 1);
        localStorage.setItem('priorityTasks', JSON.stringify(priorityTasks));
    }
    
    console.log(`🗑️ Eliminando tarea ${type}: ${taskText}`);
    renderTasks();
    showToast('Tarea eliminada');
}

function renderTasks() {
    renderTaskList('dailyTasks', dailyTasks, 'daily');
    renderTaskList('priorityTasks', priorityTasks, 'priority');
}

function renderTaskList(containerId, tasks, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        
        // Compatibilidad con formato anterior (string) y nuevo (objeto)
        const taskText = typeof task === 'string' ? task : task.text;
        
        taskElement.innerHTML = `
            <span class="task-text">${taskText}</span>
            <button class="delete-btn" onclick="deleteTask('${type}', ${index})" title="Eliminar tarea">×</button>
        `;
        container.appendChild(taskElement);
    });
    
    console.log(`📋 Renderizadas ${tasks.length} tareas ${type}`);
}

// ==================== FUNCIONES DE CREDENCIALES ====================

function addCredential() {
    const appName = document.getElementById('appNameInput').value.trim();
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value.trim();
    
    if (appName && username && password) {
        console.log(`🔐 Agregando credencial para: ${appName}`);
        
        const newCredential = {
            id: Date.now(),
            appName: appName,
            username: username,
            password: password,
            createdAt: new Date().toISOString()
        };
        
        credentials.push(newCredential);
        localStorage.setItem('credentials', JSON.stringify(credentials));
        
        // Limpiar formulario
        document.getElementById('appNameInput').value = '';
        document.getElementById('usernameInput').value = '';
        document.getElementById('passwordInput').value = '';
        
        renderCredentials();
        showToast(`Credencial agregada para ${appName}`);
    } else {
        showToast('Por favor completa todos los campos', 'error');
    }
}

function deleteCredential(index) {
    const credential = credentials[index];
    const appName = credential.appName;
    
    if (confirm(`¿Estás seguro de eliminar las credenciales de ${appName}?`)) {
        console.log(`🗑️ Eliminando credencial: ${appName}`);
        credentials.splice(index, 1);
        localStorage.setItem('credentials', JSON.stringify(credentials));
        renderCredentials();
        showToast(`Credenciales de ${appName} eliminadas`);
    }
}

function editCredential(index) {
    editingIndex = index;
    const credential = credentials[index];
    
    console.log(`✏️ Editando credencial: ${credential.appName}`);
    
    // Llenar el modal con los datos actuales
    document.getElementById('editAppName').value = credential.appName;
    document.getElementById('editUsername').value = credential.username;
    document.getElementById('editPassword').value = credential.password;
    
    // Mostrar modal
    document.getElementById('editModal').style.display = 'block';
}

function saveEdit() {
    if (editingIndex >= 0) {
        const appName = document.getElementById('editAppName').value.trim();
        const username = document.getElementById('editUsername').value.trim();
        const password = document.getElementById('editPassword').value.trim();
        
        if (appName && username && password) {
            console.log(`💾 Guardando cambios para: ${appName}`);
            
            credentials[editingIndex] = {
                ...credentials[editingIndex],
                appName: appName,
                username: username,
                password: password,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem('credentials', JSON.stringify(credentials));
            renderCredentials();
            closeModal();
            showToast(`Credenciales de ${appName} actualizadas`);
        } else {
            showToast('Por favor completa todos los campos', 'error');
        }
    }
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
    editingIndex = -1;
    console.log('❌ Modal cerrado');
}

function copyToClipboard(text, type) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            console.log(`📋 Copiado al portapapeles: ${type}`);
            showToast(`${type} copiado al portapapeles`);
        }).catch(err => {
            console.error('❌ Error al copiar:', err);
            fallbackCopyTextToClipboard(text, type);
        });
    } else {
        // Fallback para navegadores que no soportan Clipboard API
        fallbackCopyTextToClipboard(text, type);
    }
}

function fallbackCopyTextToClipboard(text, type) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Evitar scroll
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            console.log(`📋 Copiado (fallback): ${type}`);
            showToast(`${type} copiado al portapapeles`);
        } else {
            showToast('No se pudo copiar', 'error');
        }
    } catch (err) {
        console.error('❌ Error en fallback copy:', err);
        showToast('Error al copiar', 'error');
    }
    
    document.body.removeChild(textArea);
}

function renderCredentials() {
    const container = document.getElementById('credentialsList');
    container.innerHTML = '';
    
    if (credentials.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: rgba(255,255,255,0.6);">
                <p>📱 No hay aplicaciones guardadas</p>
                <p style="font-size: 14px; margin-top: 10px;">Agrega tu primera app arriba</p>
            </div>
        `;
        return;
    }
    
    credentials.forEach((credential, index) => {
        const credentialElement = document.createElement('div');
        credentialElement.className = 'credential-card';
        credentialElement.innerHTML = `
            <div class="credential-header">
                <div class="app-name">${escapeHtml(credential.appName)}</div>
                <button class="delete-btn" onclick="deleteCredential(${index})" title="Eliminar credencial">×</button>
            </div>
            <div class="credential-info">
                <label>Usuario:</label>
                <div class="credential-value" onclick="copyToClipboard('${escapeHtml(credential.username)}', 'Usuario')" title="Click para copiar">
                    ${escapeHtml(credential.username)}
                </div>
            </div>
            <div class="credential-info">
                <label>Contraseña:</label>
                <div class="credential-value" onclick="copyToClipboard('${escapeHtml(credential.password)}', 'Contraseña')" title="Click para copiar">
                    ${'•'.repeat(Math.min(credential.password.length, 12))}
                </div>
            </div>
            <div class="credential-actions">
                <button class="edit-btn" onclick="editCredential(${index})">✏️ Editar</button>
                <button class="copy-btn" onclick="copyToClipboard('Usuario: ${escapeHtml(credential.username)}\\nContraseña: ${escapeHtml(credential.password)}', 'Credenciales completas')">📋 Copiar Todo</button>
            </div>
        `;
        container.appendChild(credentialElement);
    });
    
    console.log(`🔐 Renderizadas ${credentials.length} credenciales`);
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// ==================== FUNCIONES DE UI ====================

function showToast(message, type = 'success') {
    // Remover toast anterior si existe
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Cambiar color según el tipo
    if (type === 'error') {
        toast.style.background = '#ff4757';
    } else {
        toast.style.background = '#2ed573';
    }
    
    document.body.appendChild(toast);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 3000);
    
    console.log(`💬 Toast mostrado: ${message}`);
}

// ==================== EVENT LISTENERS ====================

// Cerrar modal al hacer clic fuera de él
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modal = document.getElementById('editModal');
        if (modal.style.display === 'block') {
            closeModal();
        }
    }
});

// Manejar eventos de teclado en el modal
document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('editModal');
    if (modal.style.display === 'block' && event.key === 'Enter') {
        saveEdit();
    }
});

// ==================== UTILIDADES ====================

function exportData() {
    const data = {
        dailyTasks: dailyTasks,
        priorityTasks: priorityTasks,
        credentials: credentials,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `mi-organizador-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showToast('Backup exportado correctamente');
    console.log('💾 Datos exportados');
}

function clearAllData() {
    if (confirm('⚠️ ¿Estás seguro de que quieres eliminar TODOS los datos?\n\nEsta acción no se puede deshacer.')) {
        localStorage.clear();
        dailyTasks = [];
        priorityTasks = [];
        credentials = [];
        
        renderTasks();
        renderCredentials();
        
        showToast('Todos los datos han sido eliminados');
        console.log('🗑️ Todos los datos eliminados');
    }
}

// ==================== INICIALIZACIÓN ====================

console.log(`
🚀 Mi Organizador Personal v1.0
📱 Aplicación web progresiva
💾 Datos guardados localmente
🔒 Funciona sin internet
`);