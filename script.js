(function () {
    var navbar = document.getElementById('navbar');
    var navToggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    var themeToggle = document.querySelector('.theme-toggle');

    var savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        var icon = themeToggle ? themeToggle.querySelector('i') : null;
        if (icon) {
            icon.className = 'fas fa-sun';
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            document.body.classList.toggle('dark');
            var isDark = document.body.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            var icon = themeToggle.querySelector('i');
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    window.addEventListener('scroll', function () {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    navToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('active');
        });
    });

    var sections = document.querySelectorAll('section[id]');
    var navItems = navLinks.querySelectorAll('a');

    function highlightNav() {
        var scrollPos = window.scrollY + 100;
        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(function (item) {
                    item.style.color = '';
                    if (item.getAttribute('href') === '#' + id) {
                        item.style.color = 'var(--color-accent)';
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav();

    var observerInitialized = false;

    function initAnimations() {
        if (observerInitialized) return;

        var animElements = document.querySelectorAll('.pub-item, .project-card, .service-category, .misc-category');
        
        if (!animElements || animElements.length === 0) return;

        animElements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -60px 0px'
            });

            animElements.forEach(function (el) {
                observer.observe(el);
            });

            observerInitialized = true;
        } else {
            animElements.forEach(function (el) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
            observerInitialized = true;
        }
    }

    function loadJSON(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function () {
            if (xhr.status === 200) {
                callback(xhr.response);
            }
        };
        xhr.onerror = function () {
            console.error('Failed to load:', url);
        };
        xhr.send();
    }

    function escapeAttr(str) {
        return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderPublications(data, containerId) {
        var container = document.getElementById(containerId || 'publications-content');
        if (!container || !data) return;
        var html = '';
        data.forEach(function (pub, index) {
            var linksHtml = '';
            var hasDetails = pub.images && pub.images.length > 1;
            if (pub.links && pub.links.length > 0 || hasDetails) {
                linksHtml = '<div class="pub-links">';
                if (pub.links && pub.links.length > 0) {
                    pub.links.forEach(function (link) {
                        linksHtml += '<a href="' + escapeAttr(link.url) + '" target="_blank"><i class="' + escapeAttr(link.icon) + '"></i> ' + escapeAttr(link.label) + '</a>';
                    });
                }
                if (hasDetails) {
                    linksHtml += '<a href="javascript:void(0)" class="pub-view-details-link" onclick="togglePubDetails(' + index + ')"><i class="fas fa-expand"></i> View Details</a>';
                }
                linksHtml += '</div>';
            }
            var noteHtml = pub.note ? '<p class="pub-note' + (pub.note.toLowerCase().includes('oral') || pub.note.toLowerCase().includes('high-impact') ? ' oral' : '') + '">' + pub.note + '</p>' : '';
            var imgSrc = pub.image || '';
            var detailsHtml = '';
            if (hasDetails) {
                var detailImages = pub.images.slice(1);
                var isMulti = detailImages.length > 1;
                detailsHtml = '<div class="pub-details' + (isMulti ? ' multi-images' : '') + '" id="pub-details-' + index + '" style="display:none;' + (isMulti ? 'flex-wrap:wrap;gap:12px;' : '') + '">';
                detailImages.forEach(function(img) {
                    var ext = img.toLowerCase().split('.').pop();
                    if (ext === 'gif' || ext === 'mp4') {
                        if (ext === 'mp4') {
                            detailsHtml += '<div class="pub-detail-media"><video src="' + escapeAttr(img) + '" playsinline controls preload="metadata"></video></div>';
                        } else {
                            detailsHtml += '<div class="pub-detail-media"><img src="' + escapeAttr(img) + '" alt="' + escapeAttr(pub.title) + '" onclick="openModal(this)" loading="lazy"></div>';
                        }
                    } else {
                        detailsHtml += '<div class="pub-detail-media"><img src="' + escapeAttr(img) + '" alt="' + escapeAttr(pub.title) + '" onclick="openModal(this)" loading="lazy"></div>';
                    }
                });
                detailsHtml += '</div>';
            }
            
            if (imgSrc) {
                html += '<div class="pub-item">' +
                    '<div class="pub-image">' +
                    '<img src="' + escapeAttr(imgSrc) + '" alt="' + escapeAttr(pub.title) + '" onclick="openModal(this)" onerror="this.parentElement.style.display=\'none\'" loading="lazy">' +
                    '</div>' +
                    '<div class="pub-info">' +
                    '<h3 class="pub-title">' + pub.title + '</h3>' +
                    '<p class="pub-authors">' + pub.authors + '</p>' +
                    '<p class="pub-venue">' + pub.venue + '</p>' +
                    noteHtml +
                    linksHtml +
                    detailsHtml +
                    '</div>' +
                    '</div>';
            } else {
                html += '<div class="pub-item">' +
                    '<div class="pub-info" style="flex: 1;">' +
                    '<h3 class="pub-title">' + pub.title + '</h3>' +
                    '<p class="pub-authors">' + pub.authors + '</p>' +
                    '<p class="pub-venue">' + pub.venue + '</p>' +
                    noteHtml +
                    linksHtml +
                    detailsHtml +
                    '</div>' +
                    '</div>';
            }
        });
        container.innerHTML = html;
    }

    function renderProjects(data) {
        var container = document.getElementById('projects-content');
        if (!container || !data) return;
        var html = '';
        data.forEach(function (proj) {
            var tagsHtml = '';
            if (proj.tags && proj.tags.length > 0) {
                tagsHtml = '<div class="project-tags">';
                proj.tags.forEach(function (tag) {
                    tagsHtml += '<span>' + escapeAttr(tag) + '</span>';
                });
                tagsHtml += '</div>';
            }
            var linksHtml = '';
            if (proj.links && proj.links.length > 0) {
                linksHtml = '<div class="project-links">';
                proj.links.forEach(function (link) {
                    if (link.break) {
                        linksHtml += '<div class="link-break"></div>';
                    } else if (link.githubRepo) {
                        linksHtml += '<a href="' + escapeAttr(link.url) + '" target="_blank" class="github-stars"><img src="https://img.shields.io/github/stars/' + escapeAttr(link.githubRepo) + '?style=flat-square" alt="GitHub Stars" style="vertical-align:middle;"></a>';
                    } else if (link.badge) {
                        linksHtml += '<a href="' + escapeAttr(link.url) + '" target="_blank" class="badge-link"><img src="' + link.badge + '" alt="badge" style="vertical-align:middle;"></a>';
                    } else {
                        linksHtml += '<a href="' + escapeAttr(link.url) + '" target="_blank"><i class="' + escapeAttr(link.icon) + '"></i> ' + escapeAttr(link.label) + '</a>';
                    }
                });
                linksHtml += '</div>';
            }
            var mediaSrc = proj.image || '';
            var mediaHtml = '';
            if (mediaSrc) {
                if (mediaSrc.toLowerCase().endsWith('.mp4')) {
                    mediaHtml = '<video src="' + escapeAttr(mediaSrc) + '" playsinline controls preload="auto"></video>';
                } else if (proj.images && proj.images.length > 0) {
                    mediaHtml = '<div class="project-media-grid">';
                    proj.images.forEach(function(img) {
                        mediaHtml += '<img src="' + escapeAttr(img) + '" alt="' + escapeAttr(proj.title) + '" onerror="this.style.display=\'none\'" loading="lazy">';
                    });
                    mediaHtml += '</div>';
                } else {
                    mediaHtml = '<img src="' + escapeAttr(mediaSrc) + '" alt="' + escapeAttr(proj.title) + '" onerror="this.parentElement.style.display=\'none\'" loading="lazy">';
                }
            }
            html += '<div class="project-card">' +
                '<div class="project-media">' +
                mediaHtml +
                '</div>' +
                '<div class="project-body">' +
                '<h3>' + escapeAttr(proj.title) + '</h3>' +
                '<p>' + escapeAttr(proj.description) + '</p>' +
                tagsHtml +
                linksHtml +
                '</div>' +
                '</div>';
        });
        container.innerHTML = html;
        var projectVideos = container.querySelectorAll('video');
        for (var pv = 0; pv < projectVideos.length; pv++) {
            projectVideos[pv].preload = 'auto';
            projectVideos[pv].load();
        }
    }

    function renderListSection(data, containerId, cssClass) {
        var container = document.getElementById(containerId);
        if (!container || !data) return;
        var html = '';
        data.forEach(function (cat) {
            var itemsHtml = '';
            if (cat.items && cat.items.length > 0) {
                itemsHtml = '<ul>';
                cat.items.forEach(function (item) {
                    itemsHtml += '<li>' + item + '</li>';
                });
                itemsHtml += '</ul>';
            }
            html += '<div class="' + cssClass + '">' +
                '<h3><i class="' + escapeAttr(cat.icon) + '"></i> ' + escapeAttr(cat.category) + '</h3>' +
                itemsHtml +
                '</div>';
        });
        container.innerHTML = html;
    }

    var loadCount = 0;
    var totalLoads = 0;

    function onLoadComplete() {
        loadCount++;
        if (loadCount >= totalLoads) {
            setTimeout(initAnimations, 100);
        }
    }

    var currentPage = window.location.pathname.split('/').pop() || 'index.html';

    if (currentPage === 'index.html' || currentPage === '') {
        totalLoads = 0;
        onLoadComplete();
    }

    if (currentPage === 'publications.html') {
        totalLoads = 3;

        loadJSON('book.json', function (data) {
            renderPublications(data, 'book-content');
            onLoadComplete();
        });

        loadJSON('publications.json', function (data) {
            renderPublications(data, 'publications-content');
            onLoadComplete();
        });

        loadJSON('preprints.json', function (data) {
            renderPublications(data, 'preprints-content');
            onLoadComplete();
        });
    }

    if (currentPage === 'applications.html') {
        totalLoads = 1;

        loadJSON('projects.json', function (data) {
            renderProjects(data);
            onLoadComplete();
        });

        document.addEventListener('click', function(e) {
            var fpdouLink = e.target.closest('a[href="#fpdou"]');
            if (fpdouLink) {
                e.preventDefault();
                var projectsContent = document.getElementById('projects-content');
                var fpdouDetail = document.getElementById('fpdou-detail');
                if (projectsContent) projectsContent.style.display = 'none';
                if (fpdouDetail) {
                    fpdouDetail.style.display = 'block';
                    fpdouDetail.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    function closeFpdouDetail() {
        var projectsContent = document.getElementById('projects-content');
        var fpdouDetail = document.getElementById('fpdou-detail');
        if (fpdouDetail) fpdouDetail.style.display = 'none';
        if (projectsContent) {
            projectsContent.style.display = '';
            projectsContent.scrollIntoView({ behavior: 'smooth' });
        }
    }
    window.closeFpdouDetail = closeFpdouDetail;

    if (currentPage === 'services.html') {
        totalLoads = 1;

        loadJSON('services.json', function (data) {
            renderListSection(data, 'services-content', 'service-category');
            onLoadComplete();
        });
    }

    if (currentPage === 'misc.html') {
        totalLoads = 1;

        loadJSON('misc.json', function (data) {
            renderListSection(data, 'misc-content', 'misc-category');
            onLoadComplete();
        });
    }
})();

function openModal(imgEl) {
    var modal = document.getElementById('imageModal');
    var modalImg = document.getElementById('modalImage');
    if (!modal || !modalImg) return;
    modalImg.src = imgEl.src;
    modalImg.alt = imgEl.alt;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    var modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});

document.addEventListener('click', function (e) {
    var modal = document.getElementById('imageModal');
    if (modal && e.target === modal) {
        closeModal();
    }
});

function togglePubDetails(index) {
    var details = document.getElementById('pub-details-' + index);
    if (!details) return;
    var pubItem = details.closest('.pub-item');
    var link = pubItem ? pubItem.querySelector('.pub-view-details-link') : null;
    if (details.style.display === 'none') {
        if (details.classList.contains('multi-images')) {
            details.style.display = 'flex';
        } else {
            details.style.display = 'block';
        }
        if (link) {
            link.innerHTML = '<i class="fas fa-compress"></i> Hide Details';
        }
    } else {
        details.style.display = 'none';
        if (link) {
            link.innerHTML = '<i class="fas fa-expand"></i> View Details';
        }
    }
}
