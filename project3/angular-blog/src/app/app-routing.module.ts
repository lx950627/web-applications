import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [
  { path: 'edit/:id', component: EditComponent },
  { path: 'preview/:id', component: PreviewComponent },
  { path: '**',redirectTo:''}
];

@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes,{useHash:true}) ],
  declarations: []
})


export class AppRoutingModule { }
