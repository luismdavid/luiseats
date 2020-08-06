import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"],
})
export class HomePage implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: "Inbox",
      url: "/home/folder/Inbox",
      icon: "mail",
    },
    {
      title: "Outbox",
      url: "/home/folder/Outbox",
      icon: "paper-plane",
    },
    {
      title: "Favorites",
      url: "/home/folder/Favorites",
      icon: "heart",
    },
    {
      title: "Archived",
      url: "/home/folder/Archived",
      icon: "archive",
    },
    {
      title: "Trash",
      url: "/home/folder/Trash",
      icon: "trash",
    },
    {
      title: "Spam",
      url: "/home/folder/Spam",
      icon: "warning",
    },
    {
      title: "Establecimientos",
      url: "/home/folder/stablishments",
      icon: "trash"
    }
  ];
  public labels = ["Family", "Friends", "Notes", "Work", "Travel", "Reminders"];
  constructor() {}

  ngOnInit() {
    const path = window.location.pathname.split("folder/")[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }
}
