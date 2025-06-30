// CV Template Renderer
class TemplateRenderer {
    constructor() {
        this.templates = {
            modern: this.renderModernTemplate,
            simple: this.renderSimpleTemplate,
            classic: this.renderClassicTemplate,
            sidebar: this.renderSidebarTemplate,
            minimal: this.renderMinimalTemplate
        };
    }
    
    render(templateName, data) {
        const renderer = this.templates[templateName];
        if (!renderer) {
            throw new Error(`Template "${templateName}" not found`);
        }
        
        return renderer.call(this, data);
    }
    
    renderModernTemplate(data) {
        return `
            <div class="cv-template modern">
                <div class="cv-header">
                    ${data.personal.photo ? `<img src="${data.personal.photo}" alt="صورة شخصية" class="cv-photo">` : ''}
                    <h1 class="cv-name">${this.sanitize(data.personal.fullName)}</h1>
                    <h2 class="cv-title">${this.sanitize(data.objective.jobTitle)}</h2>
                    <div class="cv-contact">
                        ${data.personal.email ? `<div class="cv-contact-item"><i class="fas fa-envelope"></i> ${this.sanitize(data.personal.email)}</div>` : ''}
                        ${data.personal.phone ? `<div class="cv-contact-item"><i class="fas fa-phone"></i> ${this.sanitize(data.personal.phone)}</div>` : ''}
                        ${data.personal.address ? `<div class="cv-contact-item"><i class="fas fa-map-marker-alt"></i> ${this.sanitize(data.personal.address)}</div>` : ''}
                        ${data.personal.linkedin ? `<div class="cv-contact-item"><i class="fab fa-linkedin"></i> LinkedIn</div>` : ''}
                        ${data.personal.github ? `<div class="cv-contact-item"><i class="fab fa-github"></i> GitHub</div>` : ''}
                        ${data.personal.website ? `<div class="cv-contact-item"><i class="fas fa-globe"></i> موقع شخصي</div>` : ''}
                    </div>
                </div>
                
                <div class="cv-content">
                    <div class="cv-sidebar">
                        ${this.renderSkillsSection(data.skills)}
                        ${this.renderLanguagesSection(data.languages)}
                        ${this.renderCertificationsSection(data.certifications)}
                    </div>
                    
                    <div class="cv-main">
                        ${this.renderObjectiveSection(data.objective)}
                        ${this.renderExperienceSection(data.experience)}
                        ${this.renderEducationSection(data.education)}
                        ${this.renderAchievementsSection(data.achievements)}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderSimpleTemplate(data) {
        return `
            <div class="cv-template simple">
                <div class="cv-header">
                    ${data.personal.photo ? `<img src="${data.personal.photo}" alt="صورة شخصية" class="cv-photo">` : ''}
                    <h1 class="cv-name">${this.sanitize(data.personal.fullName)}</h1>
                    <h2 class="cv-title">${this.sanitize(data.objective.jobTitle)}</h2>
                    <div class="cv-contact">
                        ${data.personal.email ? `<div class="cv-contact-item">${this.sanitize(data.personal.email)}</div>` : ''}
                        ${data.personal.phone ? `<div class="cv-contact-item">${this.sanitize(data.personal.phone)}</div>` : ''}
                        ${data.personal.address ? `<div class="cv-contact-item">${this.sanitize(data.personal.address)}</div>` : ''}
                    </div>
                </div>
                
                <div class="cv-content">
                    ${this.renderObjectiveSection(data.objective)}
                    ${this.renderExperienceSection(data.experience)}
                    ${this.renderEducationSection(data.education)}
                    ${this.renderSkillsSection(data.skills)}
                    ${this.renderLanguagesSection(data.languages)}
                    ${this.renderCertificationsSection(data.certifications)}
                    ${this.renderAchievementsSection(data.achievements)}
                </div>
            </div>
        `;
    }
    
    renderClassicTemplate(data) {
        return `
            <div class="cv-template classic">
                <div class="cv-header">
                    <div class="cv-header-content">
                        ${data.personal.photo ? `<img src="${data.personal.photo}" alt="صورة شخصية" class="cv-photo">` : ''}
                        <div class="cv-header-text">
                            <h1 class="cv-name">${this.sanitize(data.personal.fullName)}</h1>
                            <h2 class="cv-title">${this.sanitize(data.objective.jobTitle)}</h2>
                            <div class="cv-contact">
                                ${data.personal.email ? `<div class="cv-contact-item">البريد الإلكتروني: ${this.sanitize(data.personal.email)}</div>` : ''}
                                ${data.personal.phone ? `<div class="cv-contact-item">الهاتف: ${this.sanitize(data.personal.phone)}</div>` : ''}
                                ${data.personal.address ? `<div class="cv-contact-item">العنوان: ${this.sanitize(data.personal.address)}</div>` : ''}
                                ${data.personal.linkedin ? `<div class="cv-contact-item">LinkedIn: متوفر</div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="cv-content">
                    ${this.renderObjectiveSection(data.objective)}
                    ${this.renderExperienceSection(data.experience)}
                    ${this.renderEducationSection(data.education)}
                    ${this.renderSkillsSection(data.skills)}
                    ${this.renderLanguagesSection(data.languages)}
                    ${this.renderCertificationsSection(data.certifications)}
                    ${this.renderAchievementsSection(data.achievements)}
                </div>
            </div>
        `;
    }
    
    renderObjectiveSection(objective) {
        if (!objective.personalSummary && !objective.careerObjective) {
            return '';
        }
        
        return `
            <div class="cv-section">
                <h2>الملخص الشخصي</h2>
                ${objective.personalSummary ? `<p>${this.sanitize(objective.personalSummary).replace(/\n/g, '<br>')}</p>` : ''}
                ${objective.careerObjective ? `<p><strong>الهدف المهني:</strong> ${this.sanitize(objective.careerObjective).replace(/\n/g, '<br>')}</p>` : ''}
            </div>
        `;
    }
    
    renderExperienceSection(experiences) {
        if (!experiences || experiences.length === 0) {
            return '';
        }
        
        const experienceItems = experiences.map(exp => {
            if (!exp.position && !exp.company) return '';
            
            return `
                <div class="cv-item">
                    <h3>${this.sanitize(exp.position)}</h3>
                    <div class="cv-company">${this.sanitize(exp.company)}</div>
                    <div class="cv-date">${this.formatDate(exp.startDate)} - ${exp.current ? 'حاليًا' : this.formatDate(exp.endDate)}</div>
                    ${exp.description ? `<div class="cv-description">${this.sanitize(exp.description).replace(/\n/g, '<br>')}</div>` : ''}
                </div>
            `;
        }).filter(item => item).join('');
        
        if (!experienceItems) return '';
        
        return `
            <div class="cv-section">
                <h2>الخبرات العملية</h2>
                ${experienceItems}
            </div>
        `;
    }
    
    renderEducationSection(education) {
        if (!education || education.length === 0) {
            return '';
        }
        
        const educationItems = education.map(edu => {
            if (!edu.degree && !edu.major && !edu.institution) return '';
            
            return `
                <div class="cv-item">
                    <h3>${this.sanitize(edu.degree)} ${edu.major ? `في ${this.sanitize(edu.major)}` : ''}</h3>
                    <div class="cv-institution">${this.sanitize(edu.institution)}</div>
                    ${edu.graduationYear ? `<div class="cv-date">تخرج: ${edu.graduationYear}</div>` : ''}
                    ${edu.gpa ? `<div class="cv-date">المعدل: ${this.sanitize(edu.gpa)}</div>` : ''}
                </div>
            `;
        }).filter(item => item).join('');
        
        if (!educationItems) return '';
        
        return `
            <div class="cv-section">
                <h2>المؤهلات التعليمية</h2>
                ${educationItems}
            </div>
        `;
    }
    
    renderSkillsSection(skills) {
        if (!skills || (!skills.technical?.length && !skills.soft?.length)) {
            return '';
        }
        
        return `
            <div class="cv-section">
                <h2>المهارات</h2>
                ${skills.technical?.length ? `
                    <h3>المهارات التقنية</h3>
                    <ul class="cv-skills-list">
                        ${skills.technical.map(skill => `<li class="cv-skill-item">${this.sanitize(skill)}</li>`).join('')}
                    </ul>
                ` : ''}
                ${skills.soft?.length ? `
                    <h3>المهارات الشخصية</h3>
                    <ul class="cv-skills-list">
                        ${skills.soft.map(skill => `<li class="cv-skill-item">${this.sanitize(skill)}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
    }
    
    renderLanguagesSection(languages) {
        if (!languages || languages.length === 0) {
            return '';
        }
        
        const languageItems = languages.map(lang => {
            if (!lang.language) return '';
            
            return `
                <div class="cv-language-item">
                    <span>${this.sanitize(lang.language)}</span>
                    <span class="cv-language-level">${this.sanitize(lang.proficiency)}</span>
                </div>
            `;
        }).filter(item => item).join('');
        
        if (!languageItems) return '';
        
        return `
            <div class="cv-section">
                <h2>اللغات</h2>
                ${languageItems}
            </div>
        `;
    }
    
    renderCertificationsSection(certifications) {
        if (!certifications || certifications.length === 0) {
            return '';
        }
        
        const certificationItems = certifications.map(cert => {
            if (!cert.name && !cert.issuer) return '';
            
            return `
                <div class="cv-item">
                    <h3>${this.sanitize(cert.name)}</h3>
                    ${cert.issuer ? `<div class="cv-institution">${this.sanitize(cert.issuer)}</div>` : ''}
                    ${cert.date ? `<div class="cv-date">${this.formatDate(cert.date)}</div>` : ''}
                </div>
            `;
        }).filter(item => item).join('');
        
        if (!certificationItems) return '';
        
        return `
            <div class="cv-section">
                <h2>الشهادات والدورات</h2>
                ${certificationItems}
            </div>
        `;
    }
    
    renderAchievementsSection(achievements) {
        if (!achievements || achievements.length === 0) {
            return '';
        }
        
        const achievementItems = achievements.map(achievement => 
            `<li>${this.sanitize(achievement)}</li>`
        ).join('');
        
        return `
            <div class="cv-section">
                <h2>الإنجازات</h2>
                <ul class="cv-achievements">
                    ${achievementItems}
                </ul>
            </div>
        `;
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            // Handle month input format (YYYY-MM)
            const [year, month] = dateString.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            
            const arabicMonths = [
                'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
            ];
            
            return `${arabicMonths[date.getMonth()]} ${date.getFullYear()}`;
        } catch (error) {
            return dateString;
        }
    }
    
    sanitize(input) {
        if (!input) return '';
        
        return input.toString()
                   .replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;')
                   .replace(/"/g, '&quot;')
                   .replace(/'/g, '&#x27;')
                   .replace(/\//g, '&#x2F;');
    }
    
    generatePreview(templateName, data) {
        try {
            const html = this.render(templateName, data);
            return html;
        } catch (error) {
            console.error('Error generating preview:', error);
            return `<div class="error">حدث خطأ في إنشاء المعاينة: ${error.message}</div>`;
        }
    }
    
    exportTemplate(templateName, data, format = 'html') {
        const html = this.render(templateName, data);
        
        if (format === 'html') {
            const fullHTML = `
                <!DOCTYPE html>
                <html lang="ar" dir="rtl">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>السيرة الذاتية - ${data.personal.fullName}</title>
                    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                    <link rel="stylesheet" href="styles/templates.css">
                    <link rel="stylesheet" href="styles/print.css" media="print">
                </head>
                <body>
                    ${html}
                </body>
                </html>
            `;
            
            const blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `cv-${data.personal.fullName}-${templateName}.html`;
            link.click();
        }
    }
    
    renderSidebarTemplate(data) {
        return `
            <div class="cv-template sidebar">
                <div class="cv-sidebar">
                    ${data.personal.photo ? `<img src="${data.personal.photo}" alt="صورة شخصية" class="cv-photo">` : ''}
                    
                    <div class="cv-section">
                        <h2>تواصل معي</h2>
                        ${data.personal.email ? `<div class="cv-contact-item"><i class="fas fa-envelope"></i> ${this.sanitize(data.personal.email)}</div>` : ''}
                        ${data.personal.phone ? `<div class="cv-contact-item"><i class="fas fa-phone"></i> ${this.sanitize(data.personal.phone)}</div>` : ''}
                        ${data.personal.address ? `<div class="cv-contact-item"><i class="fas fa-map-marker-alt"></i> ${this.sanitize(data.personal.address)}</div>` : ''}
                        ${data.personal.linkedin ? `<div class="cv-contact-item"><i class="fab fa-linkedin"></i> LinkedIn</div>` : ''}
                    </div>
                    
                    ${this.renderSkillsSection(data.skills)}
                    ${this.renderLanguagesSection(data.languages)}
                </div>
                
                <div class="cv-main">
                    <h1 class="cv-name">${this.sanitize(data.personal.fullName)}</h1>
                    <h2 class="cv-title">${this.sanitize(data.objective.jobTitle)}</h2>
                    
                    ${this.renderObjectiveSection(data.objective)}
                    ${this.renderExperienceSection(data.experience)}
                    ${this.renderEducationSection(data.education)}
                    ${this.renderCertificationsSection(data.certifications)}
                    ${this.renderAchievementsSection(data.achievements)}
                </div>
            </div>
        `;
    }
    
    renderMinimalTemplate(data) {
        return `
            <div class="cv-template minimal">
                <div class="cv-header">
                    ${data.personal.photo ? `<img src="${data.personal.photo}" alt="صورة شخصية" class="cv-photo">` : ''}
                    <h1 class="cv-name">${this.sanitize(data.personal.fullName)}</h1>
                    <h2 class="cv-title">${this.sanitize(data.objective.jobTitle)}</h2>
                    
                    <div class="cv-contact">
                        ${data.personal.email ? `<div class="cv-contact-item"><i class="fas fa-envelope"></i> ${this.sanitize(data.personal.email)}</div>` : ''}
                        ${data.personal.phone ? `<div class="cv-contact-item"><i class="fas fa-phone"></i> ${this.sanitize(data.personal.phone)}</div>` : ''}
                        ${data.personal.address ? `<div class="cv-contact-item"><i class="fas fa-map-marker-alt"></i> ${this.sanitize(data.personal.address)}</div>` : ''}
                        ${data.personal.linkedin ? `<div class="cv-contact-item"><i class="fab fa-linkedin"></i> LinkedIn</div>` : ''}
                    </div>
                </div>
                
                <div class="cv-content">
                    ${this.renderObjectiveSection(data.objective)}
                    ${this.renderExperienceSection(data.experience)}
                    ${this.renderEducationSection(data.education)}
                    ${this.renderSkillsSection(data.skills)}
                    ${this.renderLanguagesSection(data.languages)}
                    ${this.renderCertificationsSection(data.certifications)}
                    ${this.renderAchievementsSection(data.achievements)}
                </div>
            </div>
        `;
    }
}

// Create global instance
const templateRenderer = new TemplateRenderer();
