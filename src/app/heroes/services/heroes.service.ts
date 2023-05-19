import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Hero } from '../interfaces/hero.interface';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private baseUrl: string = environment.baseUrl;

  constructor(private http: HttpClient) { }

  // Métodos READ
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`);
  }

  getHeroById(id: string): Observable<Hero | undefined> {
    return this.http
               .get<Hero>(`${this.baseUrl}/heroes/${id}`)
               .pipe(
                 catchError(error => of(undefined))
               );
  }

  getSuggestions(query: string): Observable<Hero[]> {
    let params: HttpParams = new HttpParams();
    params = params.set('q', query);
    params = params.set('_limit', 6);
    // params = params.append('q',query);
    // params = params.append('_limit',6);
    console.log({params});
    return this.http.get<Hero[]>(`${this.baseUrl}/heroes`, {params: params});
  }

  // Métodos CREATE
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.baseUrl}/heroes`, hero);
  }

  // Métodos UPDATE
  updateHero(hero: Hero): Observable<Hero> {
    if (!hero.id) throw Error('Hero id is required');
    return this.http.patch<Hero>(`${this.baseUrl}/heroes/${hero.id}`, hero);
  }

  // Métodos DELETE
  deleteHeroById(id: string): Observable<boolean> {
    return this.http.delete(`${this.baseUrl}/heroes/${id}`)
      .pipe(
        map( resp => true),
        catchError( err => of(false))
      );
  }
}
