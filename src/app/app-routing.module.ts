import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BookmarksComponent} from './bookmarks/bookmarks.component';
import {LibraryComponent} from './library/library.component';

const routes: Routes = [
    { path: '', redirectTo: 'slide', pathMatch: 'full' },
    { path: 'home', loadChildren: './home/home.module#HomePageModule' },
    { path: 'bookmarks', component: BookmarksComponent },
    { path: 'slide', loadChildren: './slide/slide.module#SlidePageModule' },
    { path: 'library', component: LibraryComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
