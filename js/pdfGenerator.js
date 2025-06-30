// PDF Generator for CV Templates
class PDFGenerator {
    constructor() {
        this.isGenerating = false;
        this.defaultOptions = {
            margin: 10,
            filename: 'cv.pdf',
            html2canvas: {
                scale: 2,
                useCORS: true,
                letterRendering: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: 794, // A4 width in pixels at 96 DPI
                height: 1123, // A4 height in pixels at 96 DPI
                scrollX: 0,
                scrollY: 0
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true
            }
        };
    }

    async generatePDF(customFilename = null) {
        if (this.isGenerating) {
            app.showNotification('يتم إنشاء PDF حالياً، يرجى الانتظار...', 'info');
            return;
        }

        try {
            this.isGenerating = true;
            app.showLoading();

            // Get CV preview element
            const cvElement = document.getElementById('cvPreview');
            if (!cvElement || !cvElement.innerHTML.trim()) {
                throw new Error('لا توجد سيرة ذاتية للتحميل');
            }

            // Prepare element for PDF generation
            const originalStyles = await this.prepareElementForPDF(cvElement);

            // Generate canvas from HTML
            const canvas = await this.generateCanvas(cvElement);
            
            // Restore original styles
            this.restoreElementStyles(cvElement, originalStyles);

            // Create PDF from canvas
            const filename = customFilename || this.generateFilename();
            await this.createPDFFromCanvas(canvas, filename);

            app.showNotification('تم تحميل السيرة الذاتية بنجاح!', 'success');

        } catch (error) {
            console.error('PDF Generation Error:', error);
            app.showNotification(`خطأ في إنشاء PDF: ${error.message}`, 'error');
        } finally {
            this.isGenerating = false;
            app.hideLoading();
        }
    }

    async prepareElementForPDF(element) {
        const originalStyles = {
            width: element.style.width,
            height: element.style.height,
            maxWidth: element.style.maxWidth,
            transform: element.style.transform,
            position: element.style.position,
            top: element.style.top,
            left: element.style.left,
            zIndex: element.style.zIndex,
            backgroundColor: element.style.backgroundColor
        };

        // Apply PDF-friendly styles
        element.style.width = '794px'; // A4 width
        element.style.maxWidth = '794px';
        element.style.transform = 'scale(1)';
        element.style.position = 'relative';
        element.style.top = 'auto';
        element.style.left = 'auto';
        element.style.zIndex = '1';
        element.style.backgroundColor = '#ffffff';

        // Wait for fonts and images to load
        await this.waitForAssets(element);

        // Fix Arabic text rendering
        this.fixArabicTextRendering(element);

        return originalStyles;
    }

    restoreElementStyles(element, originalStyles) {
        Object.keys(originalStyles).forEach(property => {
            element.style[property] = originalStyles[property] || '';
        });
    }

    async waitForAssets(element) {
        // Wait for images to load
        const images = element.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.onload = resolve;
                    img.onerror = resolve;
                    // Timeout after 5 seconds
                    setTimeout(resolve, 5000);
                }
            });
        });

        await Promise.all(imagePromises);

        // Wait for fonts to load
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        // Additional wait for rendering
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    fixArabicTextRendering(element) {
        // Ensure proper Arabic text direction and font rendering
        const textElements = element.querySelectorAll('*');
        textElements.forEach(el => {
            const computedStyle = window.getComputedStyle(el);
            if (computedStyle.direction === 'rtl' || /[\u0600-\u06FF]/.test(el.textContent)) {
                el.style.fontFamily = '"Cairo", "Arial", sans-serif';
                el.style.direction = 'rtl';
                el.style.textAlign = computedStyle.textAlign || 'right';
            }
        });
    }

    async generateCanvas(element) {
        const options = {
            ...this.defaultOptions.html2canvas,
            onclone: (clonedDoc) => {
                // Ensure cloned document has proper styling
                const clonedElement = clonedDoc.getElementById('cvPreview');
                if (clonedElement) {
                    clonedElement.style.width = '794px';
                    clonedElement.style.maxWidth = '794px';
                    clonedElement.style.backgroundColor = '#ffffff';
                }
            }
        };

        try {
            const canvas = await html2canvas(element, options);
            return canvas;
        } catch (error) {
            throw new Error(`فشل في إنشاء الصورة: ${error.message}`);
        }
    }

    async createPDFFromCanvas(canvas, filename) {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF(this.defaultOptions.jsPDF);

            // Calculate dimensions
            const imgWidth = 210; // A4 width in mm
            const pageHeight = 297; // A4 height in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;

            // Convert canvas to image data
            const imgData = canvas.toDataURL('image/jpeg', 0.95);

            let position = 0;

            // Add first page
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
            heightLeft -= pageHeight;

            // Add additional pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, '', 'FAST');
                heightLeft -= pageHeight;
            }

            // Save the PDF
            pdf.save(filename);

        } catch (error) {
            throw new Error(`فشل في إنشاء PDF: ${error.message}`);
        }
    }

    generateFilename() {
        const formData = formHandler.collectFormData();
        const name = formData.personal.fullName || 'سيرة-ذاتية';
        const date = new Date().toISOString().slice(0, 10);
        const template = app.selectedTemplate || 'cv';
        
        // Clean filename from special characters
        const cleanName = name.replace(/[^\u0600-\u06FF\w\s-]/g, '').replace(/\s+/g, '-');
        
        return `${cleanName}-${template}-${date}.pdf`;
    }

    // Alternative PDF generation method using print media queries
    async generatePDFViaPrint() {
        try {
            app.showLoading();
            
            // Create a new window for printing
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                throw new Error('تم حظر النافذة المنبثقة، يرجى السماح بالنوافذ المنبثقة');
            }

            const cvElement = document.getElementById('cvPreview');
            const formData = formHandler.collectFormData();
            
            // Generate full HTML for printing
            const printHTML = this.generatePrintHTML(cvElement.innerHTML, formData);
            
            printWindow.document.write(printHTML);
            printWindow.document.close();

            // Wait for content to load
            await new Promise(resolve => {
                printWindow.onload = resolve;
                setTimeout(resolve, 1000);
            });

            // Trigger print dialog
            printWindow.print();
            
            // Close window after printing
            setTimeout(() => {
                printWindow.close();
            }, 1000);

        } catch (error) {
            app.showNotification(`خطأ في الطباعة: ${error.message}`, 'error');
        } finally {
            app.hideLoading();
        }
    }

    generatePrintHTML(cvContent, formData) {
        return `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>السيرة الذاتية - ${formData.personal.fullName || 'CV'}</title>
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&family=Amiri:wght@400;700&display=swap" rel="stylesheet">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                <style>
                    ${this.getPrintStyles()}
                </style>
            </head>
            <body>
                <div class="print-container">
                    ${cvContent}
                </div>
            </body>
            </html>
        `;
    }

    getPrintStyles() {
        return `
            @media print {
                * {
                    -webkit-print-color-adjust: exact !important;
                    color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                @page {
                    size: A4;
                    margin: 0.5in;
                }
                
                body {
                    font-family: 'Cairo', sans-serif;
                    line-height: 1.4;
                    color: #333;
                    background: white;
                    margin: 0;
                    padding: 0;
                }
                
                .print-container {
                    width: 100%;
                    max-width: none;
                }
                
                .cv-template {
                    width: 100% !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    box-shadow: none !important;
                    border-radius: 0 !important;
                }
                
                .cv-section {
                    page-break-inside: avoid;
                    margin-bottom: 1.5rem;
                }
                
                .cv-item {
                    page-break-inside: avoid;
                    margin-bottom: 1rem;
                }
                
                h1, h2, h3, h4, h5, h6 {
                    page-break-after: avoid;
                }
                
                .cv-photo {
                    max-width: 120px;
                    max-height: 120px;
                }
            }
            
            /* Include template styles */
            ${this.getTemplateStyles()}
        `;
    }

    getTemplateStyles() {
        // Get existing template styles from the document
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        let styles = '';
        
        // This is a simplified version - in a real implementation,
        // you might want to fetch and include the actual CSS content
        return `
            .cv-template { font-family: 'Cairo', sans-serif; }
            .cv-template.modern { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
            .cv-template.simple { background: white; color: #333; }
            .cv-template.classic { background: white; color: #333; }
            .cv-header { padding: 2rem; text-align: center; }
            .cv-name { font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; }
            .cv-title { font-size: 1.2rem; margin-bottom: 1rem; }
            .cv-section { margin-bottom: 2rem; }
            .cv-section h2 { font-size: 1.3rem; font-weight: bold; margin-bottom: 1rem; border-bottom: 2px solid; }
            .cv-item { margin-bottom: 1.5rem; }
            .cv-photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; }
            .cv-skills-list { display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; padding: 0; }
            .cv-skill-item { background: #e8f4f8; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.9rem; }
        `;
    }

    // Utility method to check if PDF generation is supported
    isSupported() {
        return typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined';
    }

    // Method to handle different PDF generation strategies
    async generateWithFallback(filename = null) {
        if (!this.isSupported()) {
            app.showNotification('متصفحك لا يدعم إنشاء PDF، يرجى استخدام المتصفح Chrome أو Firefox', 'error');
            return;
        }

        try {
            await this.generatePDF(filename);
        } catch (error) {
            console.warn('Primary PDF generation failed, trying print method:', error);
            app.showNotification('جاري المحاولة بطريقة أخرى...', 'info');
            await this.generatePDFViaPrint();
        }
    }

    // Method to optimize images for PDF
    optimizeImage(imgElement) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size
            canvas.width = Math.min(imgElement.naturalWidth, 800);
            canvas.height = Math.min(imgElement.naturalHeight, 800);
            
            // Draw and compress image
            ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
            
            // Convert to base64 with compression
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(optimizedDataUrl);
        });
    }

    // Method to handle special characters in filenames
    sanitizeFilename(filename) {
        return filename
            .replace(/[<>:"/\\|?*]/g, '') // Remove invalid characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .toLowerCase();
    }
}

// Create global instance
const pdfGenerator = new PDFGenerator();

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFGenerator;
}
