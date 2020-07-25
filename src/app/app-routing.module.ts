import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KeytagmeComponent } from './keytagme/keytagme.component';


export const routes: Routes = [
  // { path: "", redirectTo: "/imgtag", pathMatch: "full" },
  { path: "", component: KeytagmeComponent },
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })

export const navigatableComponents = [
  KeytagmeComponent
  
]
export class AppRoutingModule { }
