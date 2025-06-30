// Form Data Handler
class FormHandler {
    constructor() {
        this.formData = {};
    }
    
    collectFormData() {
        const data = {
            personal: this.collectPersonalInfo(),
            objective: this.collectObjective(),
            experience: this.collectExperience(),
            education: this.collectEducation(),
            certifications: this.collectCertifications(),
            skills: this.collectSkills(),
            languages: this.collectLanguages(),
            achievements: this.collectAchievements()
        };
        
        this.formData = data;
        return data;
    }
    
    collectPersonalInfo() {
        const photoElement = document.querySelector('#photoPreview img');
        
        return {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            linkedin: document.getElementById('linkedin').value,
            github: document.getElementById('github').value,
            website: document.getElementById('website').value,
            photo: photoElement ? photoElement.src : null
        };
    }
    
    collectObjective() {
        return {
            jobTitle: document.getElementById('jobTitle').value,
            careerObjective: document.getElementById('careerObjective').value,
            personalSummary: document.getElementById('personalSummary').value
        };
    }
    
    collectExperience() {
        const experiences = [];
        const experienceItems = document.querySelectorAll('.experience-item');
        
        experienceItems.forEach((item, index) => {
            const position = item.querySelector(`[name="experience[${index}][position]"]`)?.value;
            const company = item.querySelector(`[name="experience[${index}][company]"]`)?.value;
            const startDate = item.querySelector(`[name="experience[${index}][startDate]"]`)?.value;
            const endDate = item.querySelector(`[name="experience[${index}][endDate]"]`)?.value;
            const current = item.querySelector(`[name="experience[${index}][current]"]`)?.checked;
            const description = item.querySelector(`[name="experience[${index}][description]"]`)?.value;
            
            if (position || company) {
                experiences.push({
                    position: position || '',
                    company: company || '',
                    startDate: startDate || '',
                    endDate: current ? 'حاليًا' : (endDate || ''),
                    current: current || false,
                    description: description || ''
                });
            }
        });
        
        return experiences;
    }
    
    collectEducation() {
        const educationList = [];
        const educationItems = document.querySelectorAll('.education-item');
        
        educationItems.forEach((item, index) => {
            const degree = item.querySelector(`[name="education[${index}][degree]"]`)?.value;
            const major = item.querySelector(`[name="education[${index}][major]"]`)?.value;
            const institution = item.querySelector(`[name="education[${index}][institution]"]`)?.value;
            const graduationYear = item.querySelector(`[name="education[${index}][graduationYear]"]`)?.value;
            const gpa = item.querySelector(`[name="education[${index}][gpa]"]`)?.value;
            
            if (degree || major || institution) {
                educationList.push({
                    degree: degree || '',
                    major: major || '',
                    institution: institution || '',
                    graduationYear: graduationYear || '',
                    gpa: gpa || ''
                });
            }
        });
        
        return educationList;
    }
    
    collectCertifications() {
        const certifications = [];
        const certificationItems = document.querySelectorAll('.certification-item');
        
        certificationItems.forEach((item, index) => {
            const name = item.querySelector(`[name="certifications[${index}][name]"]`)?.value;
            const issuer = item.querySelector(`[name="certifications[${index}][issuer]"]`)?.value;
            const date = item.querySelector(`[name="certifications[${index}][date]"]`)?.value;
            
            if (name || issuer) {
                certifications.push({
                    name: name || '',
                    issuer: issuer || '',
                    date: date || ''
                });
            }
        });
        
        return certifications;
    }
    
    collectSkills() {
        const technicalSkills = [];
        const softSkills = [];
        
        // Collect technical skills
        const technicalTags = document.querySelectorAll('#technicalSkillsTags .skill-tag span');
        technicalTags.forEach(tag => {
            if (tag.textContent.trim()) {
                technicalSkills.push(tag.textContent.trim());
            }
        });
        
        // Collect soft skills
        const softTags = document.querySelectorAll('#softSkillsTags .skill-tag span');
        softTags.forEach(tag => {
            if (tag.textContent.trim()) {
                softSkills.push(tag.textContent.trim());
            }
        });
        
        return {
            technical: technicalSkills,
            soft: softSkills
        };
    }
    
    collectLanguages() {
        const languages = [];
        const languageItems = document.querySelectorAll('.language-item');
        
        languageItems.forEach((item, index) => {
            const language = item.querySelector(`[name="languages[${index}][language]"]`)?.value;
            const proficiency = item.querySelector(`[name="languages[${index}][proficiency]"]`)?.value;
            
            if (language) {
                languages.push({
                    language: language,
                    proficiency: proficiency || 'متوسط'
                });
            }
        });
        
        return languages;
    }
    
    collectAchievements() {
        const achievementsText = document.getElementById('achievements').value;
        const achievements = [];
        
        if (achievementsText.trim()) {
            const lines = achievementsText.split('\n').filter(line => line.trim());
            lines.forEach(line => {
                const cleanLine = line.trim().replace(/^[-•*]\s*/, '');
                if (cleanLine) {
                    achievements.push(cleanLine);
                }
            });
        }
        
        return achievements;
    }
    
    populateForm(data) {
        try {
            // Personal information
            if (data.personal) {
                this.setValue('fullName', data.personal.fullName);
                this.setValue('email', data.personal.email);
                this.setValue('phone', data.personal.phone);
                this.setValue('address', data.personal.address);
                this.setValue('linkedin', data.personal.linkedin);
                this.setValue('github', data.personal.github);
                this.setValue('website', data.personal.website);
                
                if (data.personal.photo) {
                    const preview = document.getElementById('photoPreview');
                    preview.innerHTML = `<img src="${data.personal.photo}" alt="صورة شخصية">`;
                }
            }
            
            // Objective
            if (data.objective) {
                this.setValue('jobTitle', data.objective.jobTitle);
                this.setValue('careerObjective', data.objective.careerObjective);
                this.setValue('personalSummary', data.objective.personalSummary);
            }
            
            // Experience
            if (data.experience && data.experience.length > 0) {
                this.populateExperience(data.experience);
            }
            
            // Education
            if (data.education && data.education.length > 0) {
                this.populateEducation(data.education);
            }
            
            // Certifications
            if (data.certifications && data.certifications.length > 0) {
                this.populateCertifications(data.certifications);
            }
            
            // Skills
            if (data.skills) {
                this.populateSkills(data.skills);
            }
            
            // Languages
            if (data.languages && data.languages.length > 0) {
                this.populateLanguages(data.languages);
            }
            
            // Achievements
            if (data.achievements && data.achievements.length > 0) {
                this.setValue('achievements', data.achievements.join('\n'));
            }
            
        } catch (error) {
            console.error('Error populating form:', error);
        }
    }
    
    setValue(id, value) {
        const element = document.getElementById(id);
        if (element && value) {
            element.value = value;
        }
    }
    
    populateExperience(experiences) {
        const container = document.getElementById('experienceSection');
        
        // Clear existing items except the first one
        const existingItems = container.querySelectorAll('.experience-item');
        existingItems.forEach((item, index) => {
            if (index > 0) {
                item.remove();
            }
        });
        
        experiences.forEach((exp, index) => {
            if (index > 0) {
                addExperience();
            }
            
            const item = container.children[index];
            if (item) {
                this.setNamedValue(item, `experience[${index}][position]`, exp.position);
                this.setNamedValue(item, `experience[${index}][company]`, exp.company);
                this.setNamedValue(item, `experience[${index}][startDate]`, exp.startDate);
                if (exp.current) {
                    const checkbox = item.querySelector(`[name="experience[${index}][current]"]`);
                    if (checkbox) checkbox.checked = true;
                } else {
                    this.setNamedValue(item, `experience[${index}][endDate]`, exp.endDate);
                }
                this.setNamedValue(item, `experience[${index}][description]`, exp.description);
            }
        });
    }
    
    populateEducation(educationList) {
        const container = document.getElementById('educationSection');
        
        // Clear existing items except the first one
        const existingItems = container.querySelectorAll('.education-item');
        existingItems.forEach((item, index) => {
            if (index > 0) {
                item.remove();
            }
        });
        
        educationList.forEach((edu, index) => {
            if (index > 0) {
                addEducation();
            }
            
            const item = container.children[index];
            if (item) {
                this.setNamedValue(item, `education[${index}][degree]`, edu.degree);
                this.setNamedValue(item, `education[${index}][major]`, edu.major);
                this.setNamedValue(item, `education[${index}][institution]`, edu.institution);
                this.setNamedValue(item, `education[${index}][graduationYear]`, edu.graduationYear);
                this.setNamedValue(item, `education[${index}][gpa]`, edu.gpa);
            }
        });
    }
    
    populateCertifications(certifications) {
        const container = document.getElementById('certificationsSection');
        
        // Clear existing items except the first one
        const existingItems = container.querySelectorAll('.certification-item');
        existingItems.forEach((item, index) => {
            if (index > 0) {
                item.remove();
            }
        });
        
        certifications.forEach((cert, index) => {
            if (index > 0) {
                addCertification();
            }
            
            const item = container.children[index];
            if (item) {
                this.setNamedValue(item, `certifications[${index}][name]`, cert.name);
                this.setNamedValue(item, `certifications[${index}][issuer]`, cert.issuer);
                this.setNamedValue(item, `certifications[${index}][date]`, cert.date);
            }
        });
    }
    
    populateSkills(skills) {
        // Clear existing skills
        document.getElementById('technicalSkillsTags').innerHTML = '';
        document.getElementById('softSkillsTags').innerHTML = '';
        
        // Add technical skills
        if (skills.technical) {
            skills.technical.forEach(skill => {
                this.addSkillTag('technicalSkillsTags', skill);
            });
        }
        
        // Add soft skills
        if (skills.soft) {
            skills.soft.forEach(skill => {
                this.addSkillTag('softSkillsTags', skill);
            });
        }
    }
    
    addSkillTag(containerId, skillText) {
        const container = document.getElementById(containerId);
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            <span>${skillText}</span>
            <button type="button" class="remove-skill" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(skillTag);
    }
    
    populateLanguages(languages) {
        const container = document.getElementById('languagesSection');
        
        // Clear existing items except the first one
        const existingItems = container.querySelectorAll('.language-item');
        existingItems.forEach((item, index) => {
            if (index > 0) {
                item.remove();
            }
        });
        
        languages.forEach((lang, index) => {
            if (index > 0) {
                addLanguage();
            }
            
            const item = container.children[index];
            if (item) {
                this.setNamedValue(item, `languages[${index}][language]`, lang.language);
                this.setNamedValue(item, `languages[${index}][proficiency]`, lang.proficiency);
            }
        });
    }
    
    setNamedValue(container, name, value) {
        const element = container.querySelector(`[name="${name}"]`);
        if (element && value) {
            element.value = value;
        }
    }
    
    formatDate(dateString) {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString + '-01'); // Add day for month input
            const options = { year: 'numeric', month: 'long' };
            return date.toLocaleDateString('ar-SA', options);
        } catch (error) {
            return dateString;
        }
    }
    
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    validatePhone(phone) {
        const phoneRegex = /^[\+]?[0-9\-\(\)\s]+$/;
        return phoneRegex.test(phone);
    }
    
    validateURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    sanitizeInput(input) {
        return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                   .replace(/javascript:/gi, '')
                   .replace(/on\w+\s*=/gi, '');
    }
    
    exportData() {
        const data = this.collectFormData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'cv-data.json';
        link.click();
    }
    
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.populateForm(data);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('فشل في قراءة الملف'));
            reader.readAsText(file);
        });
    }
}

// Create global instance
const formHandler = new FormHandler();
