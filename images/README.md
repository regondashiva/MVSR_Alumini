# MVSR Alumni Network - Image Assets

This directory contains all image assets for the MVSR Engineering College Alumni Network website.

## Image Categories

### 1. College Branding
- **Logo**: MVSR Engineering College official logo
- **Favicon**: Small icon for browser tabs
- **Hero Images**: Background images for main sections

### 2. Campus Photos
- **Main Building**: Academic buildings and infrastructure
- **Library**: Library interior and exterior
- **Labs**: Computer labs, engineering labs
- **Sports Facilities**: Grounds, gymnasium
- **Hostels**: Student accommodation
- **Auditorium**: Event spaces

### 3. Events & Activities
- **Alumni Meets**: Previous reunion photos
- **Graduation Ceremonies**: Convocation photos
- **Technical Fests**: Tech events and competitions
- **Cultural Events**: College festivals
- **Sports Day**: Annual sports meet
- **Workshops**: Academic and professional workshops

### 4. People
- **Faculty**: Teaching staff photos
- **Alumni**: Successful alumni profiles
- **Students**: Current student activities
- **Guest Speakers**: Event speakers and dignitaries

### 5. Placeholder Images
- **Default Profile**: Default user avatar
- **Event Covers**: Default event cover images
- **News Thumbnails**: Default news article images

## Image Specifications

### Recommended Sizes
- **Hero Images**: 1920x1080px (16:9 ratio)
- **Event Covers**: 800x400px (2:1 ratio)
- **Profile Photos**: 400x400px (1:1 ratio)
- **Thumbnails**: 300x200px (3:2 ratio)
- **Logos**: 200x200px (1:1 ratio)

### File Formats
- **Photos**: JPEG (for quality), PNG (for transparency)
- **Logos**: SVG (vector), PNG (raster)
- **Icons**: SVG (vector), PNG (raster)

### File Size Limits
- **Profile Photos**: Max 2MB
- **Event Images**: Max 5MB
- **Gallery Photos**: Max 3MB

## Organization

```
images/
├── branding/
│   ├── logo.png
│   ├── favicon.ico
│   └── hero-bg.jpg
├── campus/
│   ├── main-building/
│   ├── library/
│   ├── labs/
│   ├── sports/
│   └── hostels/
├── events/
│   ├── alumni-meet-2024/
│   ├── graduation-2023/
│   ├── tech-fest-2023/
│   └── cultural-fest-2023/
├── people/
│   ├── faculty/
│   ├── alumni/
│   └── students/
├── placeholders/
│   ├── default-profile.png
│   ├── default-event.jpg
│   └── default-news.jpg
└── uploads/
    ├── profiles/
    ├── events/
    └── gallery/
```

## Usage Guidelines

1. **Alt Text**: Always provide descriptive alt text for accessibility
2. **Compression**: Optimize images for web without losing quality
3. **Responsive**: Use appropriate image sizes for different devices
4. **Copyright**: Ensure all images have proper permissions
5. **Consistency**: Maintain consistent style and quality

## Image Optimization

### Tools Recommended
- **TinyPNG**: For PNG compression
- **JPEG Optimizer**: For JPEG compression
- **Squoosh**: Web-based image optimization
- **ImageOptim**: Mac optimization tool

### Best Practices
- Use WebP format when supported
- Implement lazy loading for gallery images
- Use CDN for image delivery in production
- Create multiple sizes for responsive design

## Placeholder Images

For development and testing, use placeholder images from:
- `/api/placeholder/width/height` (frontend route)
- External services like picsum.photos or placeholder.com

Example: `/api/placeholder/800/400` will return a placeholder image of 800x400px.

## Upload Process

1. **Admin Upload**: Administrators can upload images through the admin panel
2. **User Upload**: Users can upload profile pictures and event photos
3. **Bulk Upload**: Multiple images can be uploaded at once for galleries
4. **Auto Resize**: Images are automatically resized to optimal dimensions
5. **Watermark**: Optional watermark can be added to protect images

## Storage

- **Development**: Local storage in `/images/uploads/` 
- **Production**: Cloud storage (AWS S3, Cloudinary, etc.)
- **Backup**: Regular backups of all uploaded images
- **CDN**: Content Delivery Network for fast loading globally

## Security

- **File Type Validation**: Only allowed image types are accepted
- **Size Limits**: Maximum file size restrictions
- **Virus Scanning**: Files are scanned for malware
- **Access Control**: Proper permissions for image access
- **Hotlink Protection**: Prevent unauthorized image linking
