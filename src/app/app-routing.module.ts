import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '@app/modules/pages/components/login/login.component';
import { ZoteroImporterPageComponent } from '@app/modules/pages/components/zotero-importer-page/zotero-importer-page.component';
import { SessionDashboardPageComponent } from '@app/modules/session-dashboard/pages/session-dashboard-page/session-dashboard-page.component';
import { SignupComponent } from '@app/modules/pages/components/signup/signup.component';
import {ScatterplotComparisonPageComponent} from '@app/modules/scatterplot-comparison/pages/scatterplot-comparison-page/scatterplot-comparison-page.component'


const routes: Routes = [
  {path: '',pathMatch: 'full', redirectTo:'/dashboard'},
  {path:'login',component:LoginComponent },
  {path:'signup',component:SignupComponent },
  {path:'zot_importer',component:ZoteroImporterPageComponent },
  {path:'dashboard',component:SessionDashboardPageComponent },
  {path:'comparison',component:ScatterplotComparisonPageComponent },
  {path:'**', redirectTo:'/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
