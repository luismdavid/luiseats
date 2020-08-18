import { Component, OnInit } from "@angular/core";
import { User } from "../models/user.interface";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: "Carrito",
      url: "/home/folder/cart",
      icon: "cart",
    },
    {
      title: "Establecimientos",
      url: "/home/folder/stablishments",
      icon: "trash",
    },
    {
      title: "Chats",
      url: "/home/folder/chats",
      icon: "chatbubbles"
    }
  ];
  public labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];
  public currentUser: User;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });

    const path = window.location.pathname.split("folder/")[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }
}
