import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualChatPage } from './actual-chat.page';

const routes: Routes = [
  {
    path: '',
    component: ActualChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualChatPageRoutingModule {}
