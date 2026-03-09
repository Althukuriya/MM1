// js/youtube.js
document.addEventListener('DOMContentLoaded', async () => {
    const gallery = document.getElementById('video-gallery-grid');
    if (!gallery) return;
    
    await fetchVehiclesFromSheet();
    const videos = window.allVehicles.filter(v => v.youtube && v.youtube.trim() !== '');
    
    if (videos.length === 0) {
        gallery.innerHTML = '<p class="no-videos">No videos available</p>';
        return;
    }
    
    gallery.innerHTML = videos.map(video => `
        <div class="youtube-card" onclick="window.open('${video.youtube}', '_blank')">
            <div class="youtube-thumbnail">
                <img src="${video.image}" alt="${video.name}" loading="lazy">
                <div class="play-button">
                    <i class="fas fa-play"></i>
                </div>
            </div>
            <div class="vehicle-info">
                <h3>${video.name}</h3>
                <p style="color: #FF0000; margin-top: 0.5rem;"><i class="fab fa-youtube"></i> Watch Review</p>
            </div>
        </div>
    `).join('');
});