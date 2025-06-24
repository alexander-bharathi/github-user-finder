import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GithubUserService } from '../../services/github-user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'guf-github-users-list',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
  template: `
  <div class="container">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="search-icon">🔍</span>
          GitHub User Finder
        </h1>
        <p class="hero-subtitle">Discover and explore GitHub developers from around the world</p>
      </div>

      <div class="search-section">
        <div class="search-bar">
          <div class="search-input-container">
            <svg class="search-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              [(ngModel)]="searchQuery" 
              placeholder="Search GitHub users..." 
              (keyup.enter)="search()"
              class="search-input"
            />
          </div>
          <button (click)="search()" class="search-btn">
            <span>Search</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="results-section">
      <div *ngIf="loading" class="loader-container">
        <div class="loader">
          <div class="spinner"></div>
          <p>Searching GitHub users...</p>
        </div>
      </div>
      
      <div *ngIf="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <p class="error-message">{{ error }}</p>
        <button (click)="search()" class="retry-btn">Try Again</button>
      </div>

      <div class="results-header" *ngIf="users.length && !loading">
        <h2>Found {{ users.length }} users</h2>
        <p>Click on any profile to view detailed information</p>
      </div>

      <div class="user-grid" *ngIf="users.length && !loading">
        <div 
          class="user-card" 
          *ngFor="let user of users; let i = index" 
          [routerLink]="['/users', user.login]"
          [style.animation-delay]="(i * 0.1) + 's'"
        >
          <div class="card-glow"></div>
          <div class="avatar-container">
            <img [src]="user.avatar_url" [alt]="user.login + ' avatar'" />
            <div class="avatar-ring"></div>
          </div>
          <div class="user-info">
            <h3>{{ user.login }}</h3>
            <p class="profile-link">
              <span>View Profile</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </p>
          </div>
          <div class="card-overlay"></div>
        </div>
      </div>
    </div>
  </div>
`,
  styles: [`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes cardSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.4; }
      50% { transform: scale(1.05); opacity: 0.7; }
    }

    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }

    .container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    }

    .hero-section {
      padding: 4rem 2rem 3rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero-section::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.3;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      animation: fadeInUp 0.8s ease-out;
    }

    .hero-title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 800;
      color: white;
      margin: 0 0 1rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-icon {
      font-size: 0.8em;
      filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
    }

    .hero-subtitle {
      font-size: 1.2rem;
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 3rem 0;
      font-weight: 400;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .search-section {
      position: relative;
      z-index: 2;
      animation: fadeInUp 0.8s ease-out 0.2s both;
    }

    .search-bar {
      display: flex;
      justify-content: center;
      align-items: stretch;
      gap: 0.5rem;
      max-width: 600px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.95);
      padding: 0.5rem;
      border-radius: 50px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .search-input-container {
      position: relative;
      flex: 1;
      min-width: 250px;
    }

    .search-icon-svg {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      z-index: 2;
    }

    .search-input {
      width: 100%;
      padding: 1rem 1rem 1rem 3rem;
      border: none;
      border-radius: 40px;
      font-size: 1rem;
      background: transparent;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .search-input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.2);
    }

    .search-input::placeholder {
      color: #94a3b8;
    }

    .search-btn {
      background: linear-gradient(135deg, #4f46e5, #7c3aed);
      color: white;
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 40px;
      cursor: pointer;
      font-weight: 600;
      font-size: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
      min-width: 110px;
      justify-content: center;
      flex-shrink: 0;
    }

    .search-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(79, 70, 229, 0.4);
      background: linear-gradient(135deg, #4338ca, #6d28d9);
    }

    .search-btn:active {
      transform: translateY(0);
    }

    .results-section {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .loader-container {
      display: flex;
      justify-content: center;
      padding: 4rem 2rem;
      animation: fadeInUp 0.6s ease-out;
    }

    .loader {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      color: white;
      text-align: center;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
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
      max-width: 500px;
      margin: 0 auto;
      animation: fadeInUp 0.6s ease-out;
    }

    .error-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .error-message {
      color: #dc2626;
      font-weight: 600;
      font-size: 1.1rem;
      margin: 0 0 1.5rem 0;
    }

    .retry-btn {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      color: white;
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 50px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .retry-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
    }

    .results-header {
      text-align: center;
      margin-bottom: 3rem;
      color: white;
      animation: fadeInUp 0.6s ease-out;
    }

    .results-header h2 {
      font-size: 1.8rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }

    .results-header p {
      font-size: 1rem;
      opacity: 0.9;
      margin: 0;
    }

    .user-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 2rem;
      padding: 1rem 0;
    }

    .user-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      text-align: center;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      animation: cardSlideIn 0.6s ease-out both;
      text-decoration: none;
      color: inherit;
    }

    .card-glow {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #667eea, #764ba2, #667eea);
      border-radius: 20px;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: -1;
    }

    .user-card:hover .card-glow {
      opacity: 0.5;
      animation: shimmer 2s infinite;
    }

    .user-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.15);
    }

    .avatar-container {
      position: relative;
      display: inline-block;
      margin-bottom: 1.5rem;
    }

    .avatar-container img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      position: relative;
      z-index: 2;
      transition: all 0.3s ease;
      border: 3px solid rgba(102, 126, 234, 0.2);
    }

    .avatar-ring {
      position: absolute;
      top: -5px;
      left: -5px;
      right: -5px;
      bottom: -5px;
      border: 2px solid transparent;
      border-radius: 50%;
      background: linear-gradient(45deg, #667eea, #764ba2) border-box;
      mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
      mask-composite: subtract;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .user-card:hover .avatar-ring {
      opacity: 1;
      animation: pulse 2s infinite;
    }

    .user-card:hover .avatar-container img {
      transform: scale(1.1);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.2);
    }

    .user-info h3 {
      margin: 0 0 0.75rem 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #1e293b;
      transition: color 0.3s ease;
    }

    .profile-link {
      color: #667eea;
      font-size: 0.95rem;
      font-weight: 500;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .user-card:hover .profile-link {
      color: #4f46e5;
      transform: translateX(4px);
    }

    .card-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 20px;
    }

    .user-card:hover .card-overlay {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 3rem 1rem 2rem;
      }

      .hero-title {
        font-size: 2.5rem;
        flex-direction: column;
        gap: 0.5rem;
      }

      .hero-subtitle {
        font-size: 1rem;
        margin-bottom: 2rem;
      }

      .search-bar {
        background: rgba(255, 255, 255, 0.95);
        padding: 0.5rem;
        border-radius: 50px;
        align-items: stretch;
        gap: 0.5rem;
      }

      .search-input-container {
        min-width: 200px;
      }

      .search-btn {
        padding: 0.75rem 1.25rem;
        min-width: 100px;
      }

      .results-section {
        padding: 1rem;
      }

      .user-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .user-card {
        padding: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .user-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
/**
 * Component that handles searching and displaying GitHub users.
 */
export class GithubUsersListComponent implements OnDestroy {
  /**
   * The current search query string for GitHub user search.
   * Defaults to 'angular' on load.
   */
  searchQuery = 'angular';
  /**
   * Array to store the list of users returned from the search.
   */
  users: any[] = [];
  /**
   * Stores any error message that occurs during the API call.
   */
  error = '';
  /**
   * Indicates whether the application is currently loading user data.
   */
  loading = false;
  /** 
   * Reference to active subscription for cleanup
   **/
  private searchSub!: Subscription;
  /**
   * Initializes the component and triggers a default user search.
   * @param github - The service used to communicate with GitHub's API.
   */
  constructor(private github: GithubUserService) {
    this.search();
  }
  /**
   * Performs a search for GitHub users based on the current search query.
   * Handles success and error states, and updates UI state accordingly.
   */
  search(): void {
    this.error = '';
    this.loading = true;
    this.searchSub = this.github.searchUsers(this.searchQuery.trim()).subscribe({
      next: data => {
        this.users = data;
        this.loading = false;
      },
      error: err => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }
  /**
   * Clean up active subscriptions when the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }
}