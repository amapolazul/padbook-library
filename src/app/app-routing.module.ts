import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BookmarksComponent} from './bookmarks/bookmarks.component';

const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', loadChildren: './home/home.module#HomePageModule'},
    {path: 'bookmarks', component: BookmarksComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
