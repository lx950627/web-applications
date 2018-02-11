import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { AppComponent } from './app.component';
import { BlogService } from './blog.service';
import { EditComponent } from './edit/edit.component';
import { AbstractControl } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { AppRoutingModule } from './/app-routing.module';
import { PreviewComponent } from './preview/preview.component';

@NgModule({
  declarations: [
    AppComponent,
    EditComponent,
    ListComponent,
    PreviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [BlogService],
  bootstrap: [AppComponent]
})

export class AppModule { }
