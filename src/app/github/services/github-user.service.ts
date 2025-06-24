import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, forkJoin, catchError, throwError } from 'rxjs';
/**
 * Service to interact with GitHub's REST API for users and repositories.
 */
@Injectable({
  providedIn: 'root'
})
export class GithubUserService {
  /**
   * Base URL for GitHub user API.
   */
  private apiUrl = 'https://api.github.com/users/';

  constructor(private http: HttpClient) { }
  /**
   * Fetches user profile data from GitHub.
   * 
   * @param username - GitHub username to fetch.
   * @returns Observable with user profile data.
   */
  getUser(username: string) {
    return this.http.get<any>(`${this.apiUrl}${username}`);
  }
  /**
   * Fetches repositories of a GitHub user, sorts them by stars (descending),
   * and returns the top 5 repositories.
   * @param username - GitHub username to fetch repos for.
   * @returns Observable of top 5 most starred repositories.
   */
  getRepos(username: string) {
    return this.http.get<any[]>(`${this.apiUrl}${username}/repos`).pipe(
      map(repos =>
        repos
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 5)
      )
    );
  }
  /**
   * Fetches both the user profile and top repositories concurrently.
   * @param username - GitHub username.
   * @returns Observable with both user and repos data.
   * Throws an error if the user is not found.
   */
  getUserWithRepos(username: string) {
    return forkJoin({
      user: this.getUser(username),
      repos: this.getRepos(username),
    }).pipe(
      catchError(err => throwError(() => new Error('User not found')))
    );
  }
  /**
   * Searches GitHub users by query string.
   * @param query - The search query string.
   * @returns Observable with array of matched GitHub user items.
   */
  searchUsers(query: string) {
    return this.http
      .get<any>(`https://api.github.com/search/users?q=${query}`)
      .pipe(map(res => res.items || []));
  }
}
