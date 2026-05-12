# Hongming Zhang - Personal Website

Personal academic website for Hongming Zhang (张宏明), Assistant Professor at the Institute of Automation, Chinese Academy of Sciences.

## 🌐 Live Demo

Visit: [https://yourusername.github.io](https://yourusername.github.io)

## 📖 About

This is a modern, responsive personal academic website built with pure HTML, CSS, and JavaScript. It showcases:

- **About**: Academic background and research interests
- **Publications**: Research papers with official links
- **Applications**: Interactive demos and projects
- **Services**: Conference reviews, teaching, and professional services
- **Interests**: Personal hobbies and activities

## 🚀 Features

- ✨ Modern and responsive design
- 🌓 Dark/Light mode toggle
- 📱 Mobile-friendly layout
- 🎯 Smooth animations and transitions
- 🔗 SEO optimized
- ⚡ Fast loading (no frameworks, pure vanilla JS)

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Variables
- **JavaScript (ES6+)** - Dynamic content loading
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## 📁 Project Structure

```
├── index.html              # Homepage
├── publications.html       # Publications page
├── applications.html       # Applications page
├── services.html          # Services page
├── misc.html              # Interests page
├── style.css              # Main stylesheet
├── script.js              # Main JavaScript
├── publications.json       # Publications data
├── projects.json          # Projects data
├── services.json          # Services data
├── misc.json              # Interests data
├── book.json              # Book information
├── preprints.json         # Preprints data
└── images/                # All images and media
    ├── photo.jpg          # Profile photo
    ├── FAME/              # Paper images
    ├── SEER/              # Paper images
    ├── CFGM/              # Paper images
    └── ...                # Other paper folders
```

## 🚀 Deployment to GitHub Pages

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `yourusername.github.io` (replace `yourusername` with your GitHub username)
3. Make it public

### Step 2: Initialize Git and Push

```bash
# Navigate to your project
cd /Users/hongmingzhang/wakaka/others/材料/个人主页

# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Personal website"

# Add remote repository
git remote add origin https://github.com/yourusername/yourusername.github.io.git

# Push to GitHub
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select `main` branch
4. Click **Save**
5. Your site will be live at `https://yourusername.github.io`

## 🔧 Customization

### Update Personal Information

Edit `index.html`:
- Update name, title, and bio
- Change profile photo (`images/photo.jpg`)
- Update social links

### Add Publications

Edit `publications.json`:
```json
{
  "title": "Your Paper Title",
  "authors": "Author names",
  "venue": "Conference/Journal",
  "year": 2024,
  "image": "images/paper-folder/overview.png",
  "links": [
    {"url": "https://paper-link.com", "icon": "fas fa-external-link-alt", "label": "Paper"}
  ]
}
```

### Update Styling

Edit `style.css`:
- Change colors in `:root` CSS variables
- Modify fonts in `--font-*` variables
- Adjust layout and spacing

## 📱 Mobile Responsiveness

The website is fully responsive and works on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to fork this repository and customize it for your own academic website!

## 📧 Contact

- **Email**: hongming.zhang@ia.ac.cn
- **Website**: [https://yourusername.github.io](https://yourusername.github.io)
- **GitHub**: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Design inspired by modern academic websites
- Icons by [Font Awesome](https://fontawesome.com)
- Fonts by [Google Fonts](https://fonts.google.com)

---

Made with ❤️ by Hongming Zhang
