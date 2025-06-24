import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { GithubUserService } from '../../services/github-user.service';


@Component({
  selector: 'guf-github-user',
  imports: [FormsModule, RouterModule],
  standalone: true,
  template: `
  <div class="detail-container">
    <button class="back-btn" routerLink="/users">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="m15 18-6-6 6-6"/>
      </svg>
      Back to Users
    </button>
@if(loading){
    <div class="loader">
      <div class="spinner"></div>
      <p>Loading user profile...</p>
    </div>
}
    @if(error){
    <div  class="error-container">
      <div class="error-icon">⚠️</div>
      <p class="error-message">{{ error }}</p>
    </div>
    }
  @if(user){
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar-container">
          <img [src]="user.avatar_url" [alt]="user.login" />
          <div class="avatar-glow"></div>
        </div>

        <div class="user-info">
          <h2 class="name">{{ user.name || user.login }}</h2>
          <p class="username">{{"@"}}{{ user.login }}</p>
          @if(user.bio){<p class="bio">{{ user.bio }}</p>}
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card followers">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h4>{{ user.followers }}</h4>
            <span>Followers</span>
          </div>
        </div>
        <div class="stat-card following">
          <div class="stat-icon">👤</div>
          <div class="stat-content">
            <h4>{{ user.following }}</h4>
            <span>Following</span>
          </div>
        </div>
        <div class="stat-card repos">
          <div class="stat-icon">📦</div>
          <div class="stat-content">
            <h4>{{ user.public_repos }}</h4>
            <span>Repositories</span>
          </div>
        </div>
      </div>
@if(repos.length){
  <div class="repos-section">
        <div class="section-header">
          <h3>
            <span class="star-icon">⭐</span>
            Top Repositories
          </h3>
        </div>
        <div class="repos-grid">
          @for(repo of repos;track $index){
          <div class="repo-card">
            <a [href]="repo.html_url" target="_blank" rel="noopener noreferrer">
              <div class="repo-header">
                <span class="repo-name">{{ repo.name }}</span>
                <div class="repo-stars">
                  <span class="star">⭐</span>
                  <span class="count">{{ repo.stargazers_count }}</span>
                </div>
              </div>
              <div class="repo-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>
            </a>
          </div>
        }
        </div>
      </div>
}

    </div>
  }
  </div>
`,
  styles: [`
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.1); opacity: 0.6; }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .detail-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem;
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    animation: fadeIn 0.6s ease-out;
  }
  
  .back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 0.95rem;
    font-weight: 500;
    padding: 0.75rem 1.25rem;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    margin-bottom: 2rem;
    animation: slideIn 0.6s ease-out 0.1s both;
  }

  .back-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    color: white;
    text-align: center;
    animation: fadeIn 0.6s ease-out;
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  .loader p {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
  }
  
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 2rem;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    backdrop-filter: blur(20px);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    text-align: center;
    animation: fadeIn 0.6s ease-out;
  }

  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  .error-message {
    color: #e74c3c;
    font-weight: 600;
    font-size: 1.1rem;
    margin: 0;
  }
  
  .profile-card {
    background: rgba(255, 255, 255, 0.95);
    padding: 3rem;
    border-radius: 24px;
    backdrop-filter: blur(20px);
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    animation: fadeIn 0.8s ease-out 0.2s both;
  }

  .profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 3rem;
    position: relative;
  }
  
  .avatar-container {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .avatar-container img {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    border: 4px solid rgba(102, 126, 234, 0.3);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;
  }

  .avatar-glow {
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-radius: 50%;
    opacity: 0;
    animation: pulse 2s infinite;
    z-index: 1;
  }

  .avatar-container:hover img {
    transform: scale(1.05);
    box-shadow: 0 20px 50px rgba(102, 126, 234, 0.3);
  }

  .user-info {
    width: 100%;
  }
  
  .name {
    margin: 0 0 0.5rem 0;
    font-size: 2.2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .username {
    font-size: 1.1rem;
    color: #8e9aaf;
    margin: 0 0 1rem 0;
    font-weight: 500;
  }
  
  .bio {
    font-style: italic;
    color: #64748b;
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  
  .stat-card {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 16px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
    border-color: rgba(102, 126, 234, 0.3);
  }

  .stat-card:hover::before {
    opacity: 1;
  }

  .stat-card.followers { animation: fadeIn 0.6s ease-out 0.3s both; }
  .stat-card.following { animation: fadeIn 0.6s ease-out 0.4s both; }
  .stat-card.repos { animation: fadeIn 0.6s ease-out 0.5s both; }

  .stat-icon {
    font-size: 2rem;
    opacity: 0.8;
  }

  .stat-content h4 {
    margin: 0;
    color: #1e293b;
    font-size: 1.8rem;
    font-weight: 700;
  }

  .stat-content span {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .repos-section {
    animation: fadeIn 0.8s ease-out 0.6s both;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .section-header h3 {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
  }

  .star-icon {
    font-size: 1.2rem;
  }
  
  .repos-grid {
    display: grid;
    gap: 1rem;
  }

  .repo-card {
    background: #ffffff;
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 12px;
    transition: all 0.3s ease;
    overflow: hidden;
    position: relative;
  }

  .repo-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    border-color: rgba(102, 126, 234, 0.3);
  }

  .repo-card a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem;
    text-decoration: none;
    color: inherit;
    width: 100%;
  }

  .repo-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    gap: 1rem;
  }

  .repo-name {
    color: #667eea;
    font-weight: 600;
    font-size: 1rem;
    flex: 1;
  }

  .repo-stars {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    background: rgba(251, 191, 36, 0.1);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
  }

  .repo-stars .star {
    font-size: 0.9rem;
  }

  .repo-stars .count {
    font-weight: 600;
    color: #92400e;
    font-size: 0.9rem;
  }

  .repo-arrow {
    color: #94a3b8;
    transition: all 0.3s ease;
    margin-left: 1rem;
  }

  .repo-card:hover .repo-arrow {
    color: #667eea;
    transform: translateX(4px);
  }

  @media (max-width: 768px) {
    .detail-container {
      padding: 1rem;
    }

    .profile-card {
      padding: 2rem 1.5rem;
    }

    .name {
      font-size: 1.8rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .stat-card {
      padding: 1.25rem;
    }

    .repo-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
    }
  }
  `]
})
export class GithubUserComponent {
  user: any;
  repos: any[] = [];
  error = '';
  loading = true;

  constructor(private route: ActivatedRoute, private github: GithubUserService) {
    const username = this.route.snapshot.paramMap.get('username')!;
    this.github.getUserWithRepos(username).subscribe({
      next: (data: any) => {
        this.user = data.user;
        this.repos = data.repos;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }
}