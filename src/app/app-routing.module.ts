import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BookmarksComponent} from './bookmarks/bookmarks.component';

const routes: Routes = [
    {path: '', redirectTo: 'slide', pathMatch: 'full'},
    {path: 'home', loadChildren: './home/home.module#HomePageModule'},
    {path: 'bookmarks', component: BookmarksComponent},
    {path: 'slide', loadChildren: './slide/slide.module#SlidePageModule'},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
