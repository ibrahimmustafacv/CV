# Arabic CV Generator - Replit Project Documentation

## Overview

This is a client-side Arabic CV generator web application that allows users to create professional resumes through an interactive form. The application is built entirely with HTML, CSS, and JavaScript to ensure compatibility with GitHub Pages hosting. Users can input their information through a multi-step form, choose from different CV templates, and export their resume as a PDF.

## System Architecture

The application follows a modular, client-side architecture with separation of concerns:

- **Frontend**: Pure HTML/CSS/JavaScript with no framework dependencies
- **Template System**: Multiple CV templates with different visual styles
- **PDF Generation**: Client-side PDF creation using jsPDF and html2canvas
- **Data Storage**: Browser localStorage for temporary data persistence
- **Internationalization**: RTL support for Arabic language

## Key Components

### 1. Frontend Architecture
- **HTML Structure**: Single-page application with step-based form navigation
- **CSS Framework**: Custom CSS with CSS variables for theming and responsive design
- **JavaScript Modules**: Modular ES6 classes for different functionality areas
- **RTL Support**: Right-to-left layout for Arabic language interface

### 2. Form System
- **Multi-step Form**: 6-step progressive form with validation
- **Dynamic Sections**: Ability to add/remove experiences, educations, and skills
- **Photo Upload**: Client-side image handling and preview
- **Real-time Validation**: Form validation with user feedback

### 3. Template Engine
- **Template Renderer**: Dynamic HTML generation based on user data
- **Multiple Templates**: Modern, Simple, and Classic CV layouts
- **Data Sanitization**: XSS protection for user input
- **Preview System**: Live preview of CV as user fills the form

### 4. PDF Export System
- **Client-side Generation**: No server required for PDF creation
- **HTML to Canvas**: Uses html2canvas for rendering
- **Canvas to PDF**: Uses jsPDF for PDF generation
- **Print Optimization**: Dedicated print CSS for better output

## Data Flow

1. **User Input**: Multi-step form collects user information
2. **Data Validation**: Client-side validation ensures data quality
3. **Template Selection**: User chooses preferred CV template
4. **Real-time Preview**: CV is rendered in real-time as user progresses
5. **PDF Export**: Final CV is converted to PDF for download
6. **Local Storage**: Form data is saved locally for recovery

## External Dependencies

### Core Libraries
- **jsPDF**: PDF generation from JavaScript
- **html2canvas**: HTML to canvas conversion for PDF export
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Arabic fonts (Cairo and Amiri)

### No Backend Dependencies
- No server-side processing required
- No database needed
- No user authentication system
- Compatible with static hosting (GitHub Pages)

## Deployment Strategy

### Static Hosting
- **Target Platform**: GitHub Pages
- **Build Process**: No build step required
- **File Structure**: Direct HTML/CSS/JS serving
- **CDN Dependencies**: External libraries loaded via CDN

### Browser Compatibility
- Modern browsers with ES6 support
- HTML5 canvas support required
- localStorage support needed
- Print media queries support

## Changelog
- June 30, 2025. Initial setup
- June 30, 2025. Enhanced CV templates with professional high-quality designs
  - Modern Template: Executive style with gradient backgrounds and gold accents
  - Simple Template: Clean professional with card-based sections and subtle shadows
  - Classic Template: Luxury design with golden elements and elegant typography
  - Updated template selection UI with better previews and descriptions
- June 30, 2025. Added new CV templates inspired by professional designs
  - Sidebar Template: Professional blue sidebar layout with organized sections
  - Minimal Template: Clean and simple design focused on content clarity
  - Updated template thumbnails with enhanced visual previews
  - Fixed text visibility issues in certificates sections

## User Preferences

Preferred communication style: Simple, everyday language.
Template quality preference: High-quality, professional, and well-formatted CV templates

### Development Notes

The application is designed to be completely self-contained and work offline once loaded. All processing happens client-side, making it ideal for privacy-conscious users who don't want to upload personal information to servers.

Key architectural decisions:
- **Client-side only**: Ensures privacy and eliminates server costs
- **Modular JavaScript**: Easier maintenance and feature additions
- **CSS Variables**: Consistent theming and easy customization
- **Progressive Enhancement**: Basic functionality works even with JavaScript disabled
- **RTL First**: Built with Arabic language support as primary consideration