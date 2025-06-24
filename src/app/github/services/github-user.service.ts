import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, forkJoin, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubUserService {

  private apiUrl = 'https://api.github.com/users/';

  constructor(private http: HttpClient) { }

  getUser(username: string) {
    return this.http.get<any>(`${this.apiUrl}${username}`);
  }

  getRepos(username: string) {
    return this.http.get<any[]>(`${this.apiUrl}${username}/repos`).pipe(
      map(repos => repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 5))
    );
  }

  getUserWithRepos(username: string) {
    return forkJoin({
      user: this.getUser(username),
      repos: this.getRepos(username),
    }).pipe(
      catchError(err => throwError(() => new Error('User not found')))
    );
  }

  searchUsers(query: string) {
    return this.http.get<any>(`https://api.github.com/search/users?q=${query}`).pipe(
      map(res => res.items || [])
    );
  }
}
