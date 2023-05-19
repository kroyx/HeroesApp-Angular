import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';

// @ts-ignore
@Component({
  selector: 'heroes-new-page',
  templateUrl: './new-page.component.html',
  styles: []
})
export class NewPageComponent implements OnInit {

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', {nonNullable: true}),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers: Publisher[] = Object.values(Publisher);

  public isEdit: boolean = false;

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog) {}

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.isEdit = true;
    this.activatedRoute.params
      .pipe(
        switchMap(({id}) => this.heroesService.getHeroById(id))
      )
      .subscribe(hero => {
        if (!hero) return this.router.navigateByUrl('/');

        this.heroForm.reset(hero);
        return;
      });
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    // actualizar heroe
    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackbar(`${hero.superhero} actualizado!`);
        });
      return;
    }

    // crear heroe
    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        // TODO: mostrar snackbar y navegar a /heroes/editar/hero.id
        this.showSnackbar(`${hero.superhero} creado!`);
        this.router.navigateByUrl(`/heroes/edit/${hero.id}`);
      });
  }

  onDeleteHero(): void {
    if (!this.currentHero.id) throw Error('Hero id is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted),
      )
      .subscribe(() => {
        this.router.navigateByUrl('/heroes');
      })

    // dialogRef.afterClosed()
    //   .subscribe(result => {
    //     if (!result) return;
    //
    //     this.heroesService.deleteHeroById(this.currentHero.id)
    //       .subscribe((wasDeleted) => {
    //         if (wasDeleted) {
    //           this.router.navigateByUrl('/heroes');
    //         }
    //       });
    //   });
  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'hecho', {
      duration: 2500,
    });
  }
}
