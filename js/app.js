// Main Application Controller
class CVGeneratorApp {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 6;
        this.selectedTemplate = 'modern';
        this.formData = {};
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateProgress();
        this.loadSavedData();
    }
    
    bindEvents() {
        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => this.previousStep());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextStep());
        
        // Template selection
        document.querySelectorAll('.template-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectTemplate(e.currentTarget.dataset.template);
            });
        });
        
        // Photo upload
        document.getElementById('profilePhoto').addEventListener('change', this.handlePhotoUpload);
        document.getElementById('photoPreview').addEventListener('click', () => {
            document.getElementById('profilePhoto').click();
        });
        
        // Skill inputs
        document.getElementById('technicalSkillInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addSkill('technical');
            }
        });
        
        document.getElementById('softSkillInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addSkill('soft');
            }
        });
        
        // Auto-save form data
        this.bindAutoSave();
    }
    
    bindAutoSave() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveFormData();
            });
        });
    }
    
    saveFormData() {
        const formData = formHandler.collectFormData();
        localStorage.setItem('cvFormData', JSON.stringify(formData));
    }
    
    loadSavedData() {
        const savedData = localStorage.getItem('cvFormData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                formHandler.populateForm(data);
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }
    
    nextStep() {
        if (this.validateCurrentStep()) {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.showStep(this.currentStep);
                this.updateProgress();
                
                // Generate preview on last step
                if (this.currentStep === 6) {
                    this.generatePreview();
                }
            }
        }
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateProgress();
        }
    }
    
    showStep(step) {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(stepEl => {
            stepEl.classList.remove('active');
        });
        
        // Show current step
        document.getElementById(`step${step}`).classList.add('active');
        
        // Update step indicators
        document.querySelectorAll('.step').forEach((stepEl, index) => {
            stepEl.classList.remove('active', 'completed');
            if (index + 1 === step) {
                stepEl.classList.add('active');
            } else if (index + 1 < step) {
                stepEl.classList.add('completed');
            }
        });
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    updateProgress() {
        const progressFill = document.getElementById('progressFill');
        const progress = (this.currentStep / this.totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.style.display = this.currentStep === 1 ? 'none' : 'inline-flex';
        nextBtn.textContent = this.currentStep === this.totalSteps ? 'إنشاء السيرة الذاتية' : 'التالي';
        nextBtn.innerHTML = this.currentStep === this.totalSteps ? 
            '<i class="fas fa-check"></i> إنشاء السيرة الذاتية' : 
            'التالي <i class="fas fa-arrow-left"></i>';
    }
    
    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step${this.currentStep}`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#e74c3c';
                isValid = false;
                
                // Remove error styling after user types
                field.addEventListener('input', function() {
                    this.style.borderColor = '';
                }, { once: true });
            }
        });
        
        if (!isValid) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
        }
        
        return isValid;
    }
    
    selectTemplate(template) {
        this.selectedTemplate = template;
        
        // Update UI
        document.querySelectorAll('.template-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-template="${template}"]`).classList.add('active');
        
        // Regenerate preview if on preview step
        if (this.currentStep === 6) {
            this.generatePreview();
        }
    }
    
    generatePreview() {
        this.showLoading();
        
        setTimeout(() => {
            const formData = formHandler.collectFormData();
            const cvHTML = templateRenderer.render(this.selectedTemplate, formData);
            document.getElementById('cvPreview').innerHTML = cvHTML;
            this.hideLoading();
        }, 500);
    }
    
    showLoading() {
        document.getElementById('loadingOverlay').style.display = 'flex';
    }
    
    hideLoading() {
        document.getElementById('loadingOverlay').style.display = 'none';
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('photoPreview');
                    preview.innerHTML = `<img src="${e.target.result}" alt="صورة شخصية">`;
                };
                reader.readAsDataURL(file);
            } else {
                app.showNotification('يرجى اختيار ملف صورة صالح', 'error');
            }
        }
    }
    
    addSkill(type) {
        const inputId = type === 'technical' ? 'technicalSkillInput' : 'softSkillInput';
        const tagsId = type === 'technical' ? 'technicalSkillsTags' : 'softSkillsTags';
        
        const input = document.getElementById(inputId);
        const tagsContainer = document.getElementById(tagsId);
        const skillText = input.value.trim();
        
        if (skillText) {
            const skillTag = document.createElement('div');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `
                <span>${skillText}</span>
                <button type="button" class="remove-skill" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            tagsContainer.appendChild(skillTag);
            input.value = '';
            
            // Save data
            this.saveFormData();
        }
    }
}

// Dynamic form functions
function addExperience() {
    const container = document.getElementById('experienceSection');
    const index = container.children.length;
    
    const experienceHTML = `
        <div class="experience-item" data-index="${index}">
            <div class="section-header">
                <h3>الخبرة ${index + 1}</h3>
                <button type="button" class="btn-remove" onclick="removeExperience(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label>المسمى الوظيفي</label>
                    <input type="text" name="experience[${index}][position]">
                </div>
                
                <div class="form-group">
                    <label>اسم الشركة/المؤسسة</label>
                    <input type="text" name="experience[${index}][company]">
                </div>
                
                <div class="form-group">
                    <label>تاريخ البداية</label>
                    <input type="month" name="experience[${index}][startDate]">
                </div>
                
                <div class="form-group">
                    <label>تاريخ النهاية</label>
                    <input type="month" name="experience[${index}][endDate]">
                    <label class="checkbox-label">
                        <input type="checkbox" name="experience[${index}][current]">
                        <span>أعمل حالياً</span>
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label>وصف المهام والإنجازات</label>
                <textarea name="experience[${index}][description]" rows="4" placeholder="اكتب وصفاً مفصلاً عن مهامك وإنجازاتك..."></textarea>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', experienceHTML);
    app.bindAutoSave();
}

function removeExperience(index) {
    const item = document.querySelector(`[data-index="${index}"]`);
    if (item) {
        item.remove();
        app.saveFormData();
    }
}

function addEducation() {
    const container = document.getElementById('educationSection');
    const index = container.children.length;
    
    const educationHTML = `
        <div class="education-item" data-index="${index}">
            <div class="section-header">
                <h4>المؤهل ${index + 1}</h4>
                <button type="button" class="btn-remove" onclick="removeEducation(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label>الدرجة العلمية</label>
                    <select name="education[${index}][degree]">
                        <option value="">اختر الدرجة</option>
                        <option value="دبلوم">دبلوم</option>
                        <option value="بكالوريوس">بكالوريوس</option>
                        <option value="ماجستير">ماجستير</option>
                        <option value="دكتوراه">دكتوراه</option>
                        <option value="أخرى">أخرى</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>التخصص</label>
                    <input type="text" name="education[${index}][major]">
                </div>
                
                <div class="form-group">
                    <label>الجامعة/المعهد</label>
                    <input type="text" name="education[${index}][institution]">
                </div>
                
                <div class="form-group">
                    <label>سنة التخرج</label>
                    <input type="number" name="education[${index}][graduationYear]" min="1980" max="2030">
                </div>
                
                <div class="form-group">
                    <label>المعدل (اختياري)</label>
                    <input type="text" name="education[${index}][gpa]" placeholder="مثال: 3.8/4.0 أو ممتاز">
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', educationHTML);
    app.bindAutoSave();
}

function removeEducation(index) {
    const item = document.querySelector(`.education-item[data-index="${index}"]`);
    if (item) {
        item.remove();
        app.saveFormData();
    }
}

function addCertification() {
    const container = document.getElementById('certificationsSection');
    const index = container.children.length;
    
    const certificationHTML = `
        <div class="certification-item" data-index="${index}">
            <div class="section-header">
                <h4>الشهادة ${index + 1}</h4>
                <button type="button" class="btn-remove" onclick="removeCertification(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label>اسم الشهادة/الدورة</label>
                    <input type="text" name="certifications[${index}][name]">
                </div>
                
                <div class="form-group">
                    <label>الجهة المانحة</label>
                    <input type="text" name="certifications[${index}][issuer]">
                </div>
                
                <div class="form-group">
                    <label>تاريخ الحصول عليها</label>
                    <input type="month" name="certifications[${index}][date]">
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', certificationHTML);
    app.bindAutoSave();
}

function removeCertification(index) {
    const item = document.querySelector(`.certification-item[data-index="${index}"]`);
    if (item) {
        item.remove();
        app.saveFormData();
    }
}

function addLanguage() {
    const container = document.getElementById('languagesSection');
    const index = container.children.length;
    
    const languageHTML = `
        <div class="language-item" data-index="${index}">
            <div class="section-header">
                <h4>اللغة ${index + 1}</h4>
                <button type="button" class="btn-remove" onclick="removeLanguage(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            
            <div class="form-grid">
                <div class="form-group">
                    <label>اللغة</label>
                    <input type="text" name="languages[${index}][language]" placeholder="مثال: العربية، الإنجليزية">
                </div>
                
                <div class="form-group">
                    <label>مستوى الإجادة</label>
                    <select name="languages[${index}][proficiency]">
                        <option value="">اختر المستوى</option>
                        <option value="أساسي">أساسي</option>
                        <option value="متوسط">متوسط</option>
                        <option value="متقدم">متقدم</option>
                        <option value="لغة أم">لغة أم</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    
    container.insertAdjacentHTML('beforeend', languageHTML);
    app.bindAutoSave();
}

function removeLanguage(index) {
    const item = document.querySelector(`.language-item[data-index="${index}"]`);
    if (item) {
        item.remove();
        app.saveFormData();
    }
}

// Utility functions
function addSkill(type) {
    app.addSkill(type);
}

function nextStep() {
    app.nextStep();
}

function previousStep() {
    app.previousStep();
}

function editCV() {
    app.currentStep = 1;
    app.showStep(1);
    app.updateProgress();
}

function printCV() {
    window.print();
}

function downloadPDF() {
    if (typeof pdfGenerator !== 'undefined') {
        pdfGenerator.generatePDF();
    } else {
        app.showNotification('جاري تحميل مولد PDF...', 'info');
        setTimeout(() => {
            pdfGenerator.generatePDF();
        }, 1000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CVGeneratorApp();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);
